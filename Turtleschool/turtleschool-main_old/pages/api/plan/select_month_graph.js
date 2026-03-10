import pool from '../../../lib/pool';

/****************************************
 * 학습현황 / 수업현황
 * 과목월간시험결과 / 과목월간과제현황
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
  const str_subject = req.query.subject;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `
            select a.v_month,
                   b.subject,
                   b.avg_progress,
                   b.avg_score
            from (  select '01' as v_month union all
            		    select '02' as v_month union all
                		select '03' as v_month union all
                		select '04' as v_month union all
                		select '05' as v_month union all
                		select '06' as v_month union all
                		select '07' as v_month union all
                		select '08' as v_month union all
                		select '09' as v_month union all
                		select '10' as v_month union all
                		select '11' as v_month union all
                		select '12' as v_month) a
                		left outer join (
                                      select subject,
                                       		   to_char(current_date, 'MM') as v_month,
                                       		   avg(cast(progress as numeric)) as avg_progress, --과제현황
                                       		   avg(score) as avg_score
                                        from planneritems b
                                       where to_char("startDate", 'yyyy-MM-dd') between to_char(current_date, 'YYYY') || '-01-01' and to_char(current_date, 'YYYY') || '-12-31'
                                       and "memberId" = $1 --'154'
                                       and "primaryType" = $2 --'수업'
                                       and (
                                              ((coalesce($3, '*') = '*') and 1=1) or
                                              ((coalesce($3, '*') != '*') and subject = $3)
                                            )
                                       group by subject, to_char(current_date, 'MM')
                                       ) b on a.v_month = b.v_month
            order by a.v_month
            ; `,
        [str_id, str_primarytype, str_subject],
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
