import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title: 저장된 사용자의 정시 원점수 표준점수 등급 조회
    - params:
*/
export default async (req, res) => {
    let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth]);

    if (rows.length < 1) {
        res.status(406).json({ success: false, msg: 'No authorization', data: null });
        res.end();
        return;
    }
    let success = false;
    let msg = 'fail';
    let statusCode = 500;
    let data = [];
    let s_division = req.query.division;
    let s_year = req.query.year;

    switch (req.method) {
        case 'GET':
        case 'POST':
            rows = await pool.query(
                `

                  select substring(subject_a, 1, 1) as lar_subject_cd,
              	         case when substring(subject_a, 1, 1) = '6' then '국어'
                              when substring(subject_a, 1, 1) = '7' then '수학'
              		            when substring(subject_a, 1, 1) = '8' then '영어'
              		            when substring(subject_a, 1, 1) = '9' then '제2외국어'
              		            when substring(subject_a, 1, 1) = '1' and subject_a != '1G' then '사회탐구'
              		            when substring(subject_a, 1, 1) = '1' and subject_a  = '1G' then '한국사'
              		            when substring(subject_a, 1, 1) = '2' then '과학탐구'
              		            else '' end as lar_subject_nm,
              	         subject_a,
                         case when substring(subject_a, 1, 1) in ('8','9') or subject_a = '1G'
                              then null else standardscore end standardscore,
                         case when substring(subject_a, 1, 1) in ('8','9') or subject_a = '1G'
                              then null else percentage end percentage , grade, score_a, score_b,
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
              and division = $2
              and year = $3
              and useyn = 'Y'
                `,
                [req.headers.auth, s_division, s_year]
            );

            if (rows.rows == undefined || rows.rows.length < 1) {
                res.json({ success: false, msg: 'No data', data: null });
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
        console.log('202');
    }

    res.status(statusCode).json({ success: success, msg: msg, data: data });
    res.end();
};
