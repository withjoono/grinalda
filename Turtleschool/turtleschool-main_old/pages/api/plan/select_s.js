import pool from '../../../lib/pool';

/****************************************
 * 학습현황 / 수업현황
 * 학습개요 / 주간성취도
 *
 ****************************************/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.status(406).json({success: false, msg: 'No authorization', data: null});
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  const str_id = rows[0].id;
  const str_primarytype = req.query.primarytype;
  //const str_pages = req.query.pages;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `
           with res as (
               select
                   "primaryType" as primary_type
                 , subject
                 , sum((extract (epoch from to_char("endDate", 'hh24:mm')::time - to_char("startDate", 'hh24:mm')::time)) / 60) as date_diff_hour
                 , "memberId" as memberid
                 , sum(cast(progress as numeric)) as progress
               from planneritems a
               where "memberId" = $1 --'154'
               and "primaryType" = $2 --'수업'
               and to_char("startDate", 'yyyy-MM-dd') between to_char(date_trunc('week', current_date), 'yyyy-MM-dd') and to_char(date_trunc('week', current_date) + '6 days'::interval, 'yyyy-MM-dd')
               group by "primaryType", subject, "memberId"
           )
           select a.memberid,
                  a.primary_type,
                  a.subject,
                  a.date_diff_hour as date_diff_minute,
                  round(cast((a.date_diff_hour * 1.0 / b.sum_date_diff_hour * 1.0) * 100.0 as numeric), 2) as ratio,
                  round(cast((a.progress * 1.0 / b.sum_progress * 1.0) * 100.0 as numeric), 2) as ratio_progress
           from res a
             ,(select sum(date_diff_hour) as sum_date_diff_hour, sum(cast(progress as numeric)) as sum_progress from res ) b
          order by a.subject
            ; `,
        [str_id, str_primarytype],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
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
};
