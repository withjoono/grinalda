import axios from 'axios';
import pool from '../../lib/pool';

export default async (req, res) => {
  try {
    const {imp_uid, merchant_uid} = req.body;
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
      `select id, "name" , price , dependence  from paymenttypes where name = $1`,
      [name],
    );
    const amountToBePaid = parseInt(rows[0].price);
    if (amount === amountToBePaid) {
      // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
      switch (status) {
        case 'paid': // 결제 완료
          const payrow = await pool.query(
            `update payments
											set confirmed = true
											where imp_uid = $1
											returning payments.*`,
            [imp_uid],
          );

          const {rows} = await pool.query(`select push_token from members where id = $1`, [
            payrow.rows[0].accountid,
          ]);
          if (rows[0].push_token !== '') {
            const {vbank_name, vbank_num, vbank_holder} = paymentData;
            await axios.post('https://ingipsy.com/api/notification', {
              push_token: rows[0].push_token,
              title: '결제 완료',
              message: `결제 타입:${name}\n금액:${amount}\n${vbank_name}\n${vbank_num}\n${vbank_holder}\n`,
            });
          }
          res.send({status: 'success', message: '일반 결제 성공'});
          break;
        case 'ready':
          break;
        case 'cancelled': // 결제 완료
          await pool.query(`delete from payments where imp_uid = $1`, [imp_uid]);
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
      await pool.query(`delete from payments where imp_uid = $1`, [imp_uid]);
      res.send({status: 'cancelled', message: '결제 취소 확인'});

      throw {status: 'forgery', message: '위조된 결제시도'};
    }
  } catch (e) {
    res.status(400).send(e);
  }
};
