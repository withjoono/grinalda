import pool from '../../../lib/pool'
import axios from 'axios'

/****************************************
* 학습현황 / 수업현황
* 주간성취도 그래프
*
****************************************/
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

  const str_id = rows[0].id;
  const str_primarytype = req.query.primarytype;
  //const str_pages = req.query.pages;

  switch (req.method) {
      case 'GET':
         rows  = await pool.query(`
            select subject,
                   title
            from planneritems a
            where "memberId" = $1 --'154'
            and "primaryType" = $2 --'수업'
            and to_char("startDate", 'yyyy-MM-dd') between to_char(date_trunc('week', current_date), 'yyyy-MM-dd') and to_char(date_trunc('week', current_date) + '6 days'::interval, 'yyyy-MM-dd')
            group by subject, title
            order by subject
        	; `, [str_id, str_primarytype]
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
