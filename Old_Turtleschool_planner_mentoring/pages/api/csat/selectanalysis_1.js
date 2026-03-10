import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title:
    - params:
*/
export default async (req, res) => {

    let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

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
            rows  = await pool.query(`

              with res as (
                  select substring(subject_a, 1, 1) as lar_subject_cd,
              	         case when substring(subject_a, 1, 1) = '6' then '국어'
                              when substring(subject_a, 1, 1) = '7' then '수학'
              		            when substring(subject_a, 1, 1) = '8' then '영어'
              		            when substring(subject_a, 1, 1) = '9' then '제2외국어'
              		            when substring(subject_a, 1, 1) = '1' and subject_a != '1G' then '사회탐구'
              		            when substring(subject_a, 1, 1) = '1' and subject_a  = '1G' then '한국사'
              		            when substring(subject_a, 1, 1) = '2' then '과학탐구'
              		            else '' end as lar_subject_nm,
              	         subject_a, standardscore , percentage , grade,
                         round(cast((select cumulative from csatsspu z
                        	          where z.subject = case when substring(c.subject_a, 1, 1) = '6' then '60' else c.subject_a end
                        	          and cast(z.standard_score as numeric) = case when c.subject_a in ('81', '1G') or substring(c.subject_a, 1, 1) = '9' then cast(z.standard_score as numeric) else c.standardscore end
                      						  and z.rating_score = case when c.subject_a in ('81', '1G') or substring(c.subject_a, 1, 1) = '9' then cast(c.grade as varchar) else z.rating_score end
                      						  and z.use_yn = 'Y'
                      						  and z.year = $3
                      						  and z.division = '2'
                                    	          limit 1
                      						  ) as numeric), 1) as cumulative
              from csatidscore c
              where memberid = $1
              and division = $2 --발표전
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
              ;
                `,
                    [req.headers.auth, s_division, s_year]
                );

                if (rows.rows == undefined || rows.rows.length < 1)
                {
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
        console.log("202");
    }

        res.status(statusCode).json({ success: success, msg: msg, data: data });
        res.end();
};
