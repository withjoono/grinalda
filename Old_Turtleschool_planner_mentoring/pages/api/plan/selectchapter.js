import pool from '../../../lib/pool'
import axios from 'axios'

/****************************************
*
*
*
****************************************/
export default async (req, res) => {

  let success = false;
  let msg = 'fail'
  let statusCode = 500;
  let data = [];

  let rows  = await pool.query(`
     select get_books_chapter(cast($1 as varchar)) as data ; `
     , [req.query.id]
  )

  if (rows.rows == undefined || rows.rows.length < 1)
  {
    res.status(406).json({success: false, msg: 'No data', data: null});
    res.end();
    return;
  }

  success = true;
  data = rows.rows;

  if (success) {
      statusCode = 200;
      msg = 'success';
  }

  res.json({success: success, msg: msg, data:rows.rows[0].data});
  res.statusCode = statusCode;
  res.end();
}
