import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
  let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }

  let success = false;
  let msg = 'fail'
  let statusCode = 500;
  let data = [];

  const str_title = req.query.title;

  switch (req.method) {
      case 'GET':
         rows  = await pool.query(`

        select company, area, teacher, title, id
          from lectures
         where title  like '%' || $1 || '%'
         order by company, area, id
          ; `, [str_title]
        )

        if (rows.rows == undefined || rows.rows.length < 1)
        {
          res.status(406).json({success: false, msg: 'No data', data: null});
          res.end();
          return;
        }

        success = true;
        data = rows.rows;
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
}
