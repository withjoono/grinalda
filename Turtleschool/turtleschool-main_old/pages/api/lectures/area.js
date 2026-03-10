import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  const {company} = req.query;
  const data = await pool.query(`select area from lectures where company = $1 group by area`, [
    company,
  ]);
  res.json({
    success: true,
    msg: 'success',
    data: data.rows.reduce((acc, obj) => {
      acc.push(obj.area);
      return acc;
    }, []),
  });
  res.statusCode = 200;
  res.end();
};
