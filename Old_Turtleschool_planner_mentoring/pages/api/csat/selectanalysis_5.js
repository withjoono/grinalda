import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title: 저장된 사용자의 대학 학과별 점수
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
    let s_recruitment = req.query.recruitment;
    let s_area = req.query.area;
    let s_cross_sprt = req.query.cross_sprt;
    let s_major_nm = req.query.major_nm;
    let s_universitynm = req.query.universitynm;

    switch (req.method) {
        case 'GET':
        case 'POST':
            rows  = await pool.query(`

              select case when a.division = '0' then '문과' else '이과' end as division_nm,
              	   a.division as division_cd,
              	   u."name" as universityid_nm,
              	   a.universityid as universityid_cd,
                   c.department as major_cd,
                   d2."name" as major_nm,
                   --d.comn_nm as major_nm,
              	   --a.major as major_cd,
              	   --a.selection_type, --선발유형
              	   --a.sml_fld,	--소계열
              	   a.recruitment,
              	   --a.area,
              	   --a.score_convert_a, --계열1
              	   --a.score_convert_b, --계열2
              	   --a.math_expl_chcs, --수탐선택
              	   --a.test_reflct, --수능반영
              	   --a.test_combination, --수능조합
              	   a.score as user_score,
              	   b.standard_score_i,
              	   b.standard_score_a,
              	   case when cast(a.score as numeric) >= b.standard_score_a then '하향'
              	   		when cast(a.score as numeric) between b.standard_score_i and b.standard_score_a then '안전'
              	   		when cast(a.score as numeric) <= b.standard_score_i then '위험'
              	   		else '' end as risk_yn
              from public.csatuscore a --정시 사용자 내역
              left outer join commoncode d on d.comn_grp_cd = 'C00008' and d.comn_cd = a.major
              left outer join universities u on u.id = a.universityid
              left outer join (select universityid, recruitment, lar_fld, cast(standard_score_i as numeric) as standard_score_i , cast(standard_score_a as numeric) as standard_score_a
              				 from public.csatunivsco) b on a.universityid = cast(b.universityid as numeric) and a.recruitment = b.recruitment
              				 and a.division = case when lar_fld = '인문' then '0' else '1' end
              left outer join csatunivdepart c on a.universityid = cast(c.universityid as numeric) and a.score_convert_a = c.score_convert and a.major = c.major
              left outer join departments d2 on cast(c.department as numeric) = d2.id
              where a.accountid = $1 --'154'
              and a.useyn = 'Y'
              and a.year = $2 --'2022'
              and a.recruitment = $3 --'1' --1가 2나 3다
              and (((coalesce ($4, '1') ='1') and (1=1)) or
                	 ((coalesce ($4, '1')!='1') and (u."areaCode" IN (select unnest(string_to_array($4, ',')) as score))))
              and (((coalesce ($5, '1') ='1') and (coalesce(a.cross_sprt, 'N')!='Y')) or
                   ((coalesce ($5, '1')!='1') and (a.cross_sprt = 'Y')))
              and (((coalesce ($6, '1') ='1') and (1=1)) or
                 	 ((coalesce ($6, '1')!='1') and (d.comn_nm IN (select unnest(string_to_array($6, ',')) as score))))
              and (((coalesce ($7, '1') ='1') and (1=1)) or
                   ((coalesce ($7, '1')!='1') and (u."name" IN (select unnest(string_to_array($7, ',')) as score))))
              order by a.universityid
              ;
                `,
                [req.headers.auth, s_year, s_recruitment, s_area, s_cross_sprt, s_major_nm, s_universitynm]
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
