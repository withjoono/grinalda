import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  switch (req.method) {
    case 'GET':
      const {id} = {id: rows[0].id};
      const {groupid, title} = req.query;
      rows = await pool.query(
        `
             update adminclass set groupname = $2 where memberid = $1 and groupname = $2
                `,
        [id, title],
      );

      success = true;
      break;
    default:
      break;
  }

  if (success) {
    statusCode = 200;
    msg = 'success';
  }

  res.json({success: success, msg: msg, data: data});
  res.statusCode = statusCode;
  res.end();
};
