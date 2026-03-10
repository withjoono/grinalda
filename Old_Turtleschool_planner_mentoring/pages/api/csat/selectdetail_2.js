import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title:과목별원점수 입력시 표준점수 등급 조회
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
      let s_suniversityid = req.query.universityid;
      let s_departmentnm = req.query.departmentnm;
let s_department = req.query.department;
    switch (req.method) {
        case 'GET':
            rows  = await pool.query(`

              select
              c.area,
              (select name from universities u where u.id = c.universityid) as universitynm,
              c.universityid ,
              (select name from departments d where d.id = cast(c2.department as numeric)) as departmentnm,
              c2.department as departmentid,
              (select comn_nm from commoncode c3 where c3.comn_grp_cd = 'C00001' and c3.comn_cd = c.selection_type) as selection_type_NM, --선발윻
              c.selection_type ,
              (select comn_nm from commoncode c4 where c4.comn_grp_cd = 'C00003' and c4.comn_cd = c.recruitment) as recruitment_NM, --선발윻
              c.recruitment ,
              (select comn_nm from commoncode c5 where c5.comn_grp_cd = 'C00002' and c5.comn_cd = c.sml_fld) as sml_fld_nm, --선발윻
              c.sml_fld ,
              (select comn_nm from commoncode c6 where c6.comn_grp_cd = 'C00007' and c6.comn_cd = c.test_combination) as TEST_REFLCT_nm, --선발윻
              c.test_combination,
              c2.kor ,
              c2.mat ,
              c2.eng ,
              c2."exp" ,
              c2.foreg ,
              --c.APPROPRIATE_SCORE,
              c.EXPECTED_SCORE
              --c.BELIEF_SCORE
              from csatanlys c
              	,csatunivdepart c2
              	,departments d2
              where c."year" = cast($1 as numeric)
              and c.use_yn = 'Y'
              and c.division = c2.division
              and c.universityid = cast(c2.universityid as numeric)
              and c."year" = cast(c2."year" as numeric)
              and c.use_yn = c2.use_yn
              and c.score_convert = c2.score_convert
              and c.major = c2.major
              and c.universityid = cast($2 as numeric) --'345'
              and c2.department = cast(d2.id as varchar)
              and d2.id = cast($3 as numeric)
              /*
              and (((coalesce ($3, '1') ='1') and 1=1) or
                   ((coalesce ($3, '1')!='1') and (d2."name" like '%' || coalesce($3, '') || '%')))
              */
              limit 1
              ; `,
                    [s_year, s_suniversityid, s_department]
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
