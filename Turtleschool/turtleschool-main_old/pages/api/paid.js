import pool from '../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let memberId = rows[0].id;
  let d = await pool.query(`select "isPay" from members where id = $1`, [memberId]);
  const {isPay} = d.rows[0];
  res.send({success: true, isPay});
  res.end();
  return;
};
