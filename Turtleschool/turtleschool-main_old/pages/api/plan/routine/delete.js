import pool from '../../../../lib/pool';

export default async (req, res) => {
  const w = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (w.rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  const rows = await pool.query(`delete from routines where id=$1 and memberid=$2`, [
    req.query.id,
    req.headers.auth,
  ]);
  res.json({success: true, msg: 'success'});
  res.statusCode = 200;
  res.end();
  return rows;
};
