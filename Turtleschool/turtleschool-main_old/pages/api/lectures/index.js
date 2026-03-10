import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  const {company, area} = req.query;
  const d = await pool.query(
    `select company , area , teacher , title , id from lectures where company = $1 and area = $2`,
    [company, area],
  );
  const data = d.rows.reduce((acc, obj) => {
    if (!acc[obj.teacher]) {
      acc[obj.teacher] = [];
    }
    acc[obj.teacher].push([obj.title, obj.id]);
    return acc;
  }, {});
  res.json({success: true, msg: 'success', data: data});
  res.statusCode = 200;
  res.end();
};
