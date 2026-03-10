import pool from '../../../lib/pool';

/*
    - title:
    - params:
*/
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
  let s_year = req.query.year;
  let s_division = req.query.division;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `
              with res as (
                  select
                    (select upper_subject_cd_order from subjecttitle where subject_cd = subject_a) as upper_subject_cd_order,
                    (select case when subject_cd = '1G' then '1' else upper_subject_cd end from subjecttitle where subject_cd = subject_a) as lar_subject_cd,
                    (select upper_title_a from subjecttitle where subject_cd = c.subject_a) as lar_subject_nm,
                    subject_a, standardscore , percentage , grade, cumulative
                  from csatidscore c
                  where memberid = $1
                  and division = $2
                  and year = $3
                  and useyn = 'Y'
              )
              select a.lar_subject_cd, a.lar_subject_nm, a.subject_a, a.standardscore, a.percentage, a.grade,
              	case when a.lar_subject_cd in ('1', '2') and subject_a != '1G'
              		 then b.sum_standardscore
              		 else null end as sum_standardscore,
              	case when a.lar_subject_cd in ('1', '2') and subject_a != '1G'
              		 then b.sum_percentage
              		 else null end as sum_percentage,
              	case when a.lar_subject_cd in ('1', '2') and subject_a != '1G'
              		 then b.sum_grade
              		 else null end as sum_grade, a.cumulative
              from res a
              left outer join (select lar_subject_cd, sum(standardscore) as sum_standardscore, sum(percentage) as sum_percentage, sum(grade) as sum_grade
              	from res
                 where lar_subject_cd in ('1', '2') and subject_a != '1G'
                 group by lar_subject_cd) b on a.lar_subject_cd = b.lar_subject_cd
              order by a.upper_subject_cd_order asc
              ;
                `,
        [req.headers.auth, s_division, s_year],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.json({success: false, msg: 'No data', data: null});
        res.statusCode = 406;
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

  res.status(statusCode).json({success: success, msg: msg, data: data});
  res.end();
};
