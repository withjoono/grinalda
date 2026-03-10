import pool from '../../../lib/pool';

export default async (req, res) => {
  const w = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (w.rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  if (req.method == 'GET') {
    const {planid, itemid} = req.query;
    if (planid) await pool.query(`update plans`);
    res.json({success: true, msg: 'success', data: {plans: rows, items: items.rows}});
    res.statusCode = 200;
    res.end();
  }
};
