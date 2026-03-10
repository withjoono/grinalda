import pool from '../../../lib/pool';

export default async (req, res) => {
  const {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  switch (req.method) {
    case 'GET':
  }
};
