import pool from '../../lib/pool';

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
          delete from members
          where account = $1
        ;
				`,
      [req.headers.auth],
    );

    await pool.query(
      `
          call public.set_members(cast($1 as varchar), 'D') ;
				`,
      [req.headers.auth],
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
