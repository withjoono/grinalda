import axios from 'axios';
import pool from '../../lib/pool';

/*
    - title: 사용자 정보 수정
    - params:
{
  userName: '테스터',
  relationCode: '10',
  gradeCode: 'H1',
  school: '서울고등학교',
  cellphone: '010-2222-3333',
  email: 'master@ingipsy.com'
}
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length == 1) {
    res.json({success: true, msg: 'Already registered', data: null});
    res.statusCode = 200;
    res.end();
    return;
  }
  const uid = req.headers.auth;
  const {access_token, type, name} = req.query;

  let confirmed = false;
  if (type == 'kakaotalk') {
    const result = await axios.get('https://kapi.kakao.com/v1/user/access_token_info', {
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });
    if (result.data.id && result.data.id == uid) confirmed = true;
  } else if (type == 'google') {
    const result = await axios.get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
      params: {
        access_token: access_token,
      },
    });
    if (result.data.user_id && result.data.user_id == uid) confirmed = true;
    confirmed = true;
  } else if (type == 'facebook') {
    const result = await axios.get('https://graph.facebook.com/debug_token', {
      params: {
        input_token: access_token,
        access_token: process.env.FACEBOOK_ID + '|' + process.env.FACEBOOK_SECRET,
      },
    });
    if (result.data.data && result.data.data.user_id == uid) confirmed = true;
  }
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = {};
  if (confirmed) {
    rows = await pool.query(
      `INSERT INTO members (account,cellphone,cert_path,email,"gradeCode","isPay",join_date,"payDate",push_token,"relationCode",school,"updateDate",user_name,imp_uid,merchant_uid)
										VALUES ($1,null,'kk',null,null,false,timezone('utc'::text, now()),null,null,null,null,timezone('utc'::text, now()),$2,'','')`,
      [uid, name],
    );

    success = true;
    msg = 'success';
    statusCode = 200;
    data = rows.rows[0];
  }

  res.json({success: success, msg: msg, data: data});
  res.statusCode = statusCode;
  res.end();
};
