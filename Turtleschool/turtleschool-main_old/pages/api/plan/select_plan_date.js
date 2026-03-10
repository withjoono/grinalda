import pool from '../../../lib/pool';

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
  const str_subject = req.query.subject;
  const str_title = req.query.title;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `
           select to_char(a."startDate", 'yyyy-mm-dd') as start_date,
    				   title,
               to_char("startDate", 'hh24:mm') || '~' ||
               to_char("endDate", 'hh24:mm') || '(' ||
               (EXTRACT(EPOCH FROM "endDate" - "startDate")/3600)::Integer || '시간)' as circle_time,
    				   mentor_test,
    				   mentor_desc,
    				   mentor_rank,
    				   id,
    				   late,
    				   absent,
    				   score,
    				   rank,
    				   progress,
               description
            from planneritems a
            where "memberId" = $1 --'154'
            and "primaryType" = $2 --'수업'
            and to_char("startDate", 'yyyy-MM-dd') between to_char(date_trunc('week', current_date), 'yyyy-MM-dd') and to_char(date_trunc('week', current_date) + '6 days'::interval, 'yyyy-MM-dd')
            and (
                   ((coalesce($3, '*') = '*') and 1=1) or
                   ((coalesce($3, '*') != '*') and subject = $3)
                 )
            and (
                   ((coalesce($4, '*') = '*') and 1=1) or
                   ((coalesce($4, '*') != '*') and title = $4)
                 )
            order by "startDate", subject
          ; `,
        [str_id, str_primarytype, str_subject, str_title],
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
