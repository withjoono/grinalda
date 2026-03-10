import pool from '../../../lib/pool';

/*
    - title:
    - params:
*/
export default async (req, res) => {
  /*
  let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])

  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }
*/

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  if (req.method == 'POST' || req.method == 'GET') {
    await pool.query(
      `
          call public.update_plannerclass($1, $2, $3, $4) ;
				`,
      [req.query.plnerid, req.query.cls, req.query.enddt, req.query.clsnm],
    );

    success = true;
    data = null;

    if (success) {
      statusCode = 200;
      msg = 'success';
    }

    res.status(statusCode).json({success: success, msg: msg, user: data});
    res.end();
  }
};
