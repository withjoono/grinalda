import axios from 'axios';
import pool from '../../lib/pool';

export default async (req, res) => {
  try {
    const {imp_uid, merchant_uid, uid} = req.body.id; // req의 body에서 imp_uid, merchant_uid 추출

    let uidd = uid.toString();
    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post', // POST method
      headers: {'Content-Type': 'application/json'}, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IAMPORT_REST_API_KEY, // REST API키
        imp_secret: process.env.IAMPORT_REST_API_SECRET, // REST API Secret
      },
    });
    const {access_token} = getToken.data.response;
    // imp_uid로 아임포트 서버에서 결제 정보 조회
    const getPaymentData = await axios({
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: 'get', // GET method
      headers: {Authorization: access_token}, // 인증 토큰 Authorization header에 추가
    });
    const paymentData = getPaymentData.data.response;

    const {amount, status, name} = paymentData;
    const {rows} = await pool.query(
      `select id, "name" , price , dependence
         from paymenttypes where name = $1`,
      [name],
    );

    const amountToBePaid = parseInt(rows[0].price);

    const typesid = rows[0].id;
    const memrow = await pool.query(`select id from members where account = $1`, [uidd]);
    const userid = memrow.rows[0].id;

    if (amount === amountToBePaid) {
      // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      let dat;
      switch (status) {
        case 'ready': // 결제 완료
          dat = await pool.query(
            `insert into payments (accountid, amount, imp_uid, merchant_uid, name,time,typesid)
														values ($1, $2, $3,$4,$5,now()::timestamp,$6)`,
            [userid, amount, imp_uid, merchant_uid, name, typesid],
          );
          const obj = {
            status: 'ready',
            amount: paymentData.amount,
            vbank_holder: paymentData.vbank_holder,
            vbank_name: paymentData.vbank_name,
            vbank_num: paymentData.vbank_num,
          };
          res.send(obj);
          break;
        case 'paid': // 결제 완료
          dat = await pool.query(
            `insert into payments (accountid, amount, imp_uid, merchant_uid, name,confirmed,time,typesid)
														values ($1, $2, $3,$4,$5,true,now()::timestamp,$6)`,
            [userid, amount, imp_uid, merchant_uid, name, typesid],
          );
          res.send(paymentData);
          break;
        case 'cancelled': // 결제 완료
          res.send({status: 'cancelled', message: '결제 취소 확인'});
          break;
      }
    } else {
      // 결제 금액 불일치. 위/변조 된 결제
      await axios({
        url: 'https://api.iamport.kr/payments/cancel',
        method: 'post', // POST method
        headers: {
          'Content-Type': 'application/json',
          Authorization: access_token,
        }, // "Content-Type": "application/json"
        data: {
          reason: '위조된 결제시도',
          imp_uid: imp_uid,
        },
      });

      throw {status: 'forgery', message: '위조된 결제시도'};
    }
    res.end();
  } catch (e) {
    res.status(400).send(e);
    res.end();
  }
};
