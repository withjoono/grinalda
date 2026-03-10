import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select id, "relationCode" from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  // let row = rows[0].relationCode;
  if (rows[0].relationCode == null) {
    res.json({success: 1, msg: '수험생만 생성 가능합니다', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  const memberId = req.headers.auth;
  const random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const code = Array(6)
    .fill()
    .map(e => {
      return random.charAt(Math.floor(Math.random() * random.length));
    })
    .join('');
  let data = await pool.query(
    `insert into tempcode values ($1, $2, now() + interval '5 minutes') returning expire`,
    [memberId, code],
  );
  res.json({success: true, data: {code: code, time: data.rows[0].expire}});
  res.statusCode = 200;
  res.end();
};
