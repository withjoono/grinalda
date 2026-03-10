
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title:
    - params:

*/
export default async (req, res) => {
    try{
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

    let str_division = req.query.division;
    let str_year = req.query.year;
    let str_lar_cd = req.query.lar_cd;
    let str_mid_cd2 = req.query.mid_cd2;
    let str_mid_cd3 = req.query.mid_cd3;

    switch (req.method) {
        case 'GET':
             rows  = await pool.query(`

           with res as (
              select u.name,
                    c1.comn_nm,
                    e.universityid,
                    e.lar_cd,
                    e.rmk1 as departmentid,
                    coalesce((select name from departments d where cast(d.id as varchar) = e.rmk1 limit 1), e.rmk1) as departmentnm,
                    '이과' as gubu,
                    max(case when mathc is not null or math is not null or mathp is not null or mathd is not null or mathg is not null then '수학' else '' end ||
                        case when scncc is not null or scncpa is not null or scncca is not null or scncba is not null or
                                  scncea is not null or scncpb is not null or scnccb is not null or scncbb is not null or
                                  scnceb is not null then '과학' else '' end) as subject,
                    max(case when math = '○' then '○' else '' end) as casea, --수1수2
                    max(case when mathp = '○' then '○' else '' end) as caseb, --확통
                    max(case when mathd = '○' then '○' else '' end) as casec, --미적
                    max(case when mathg = '○' then '○' else '' end) as cased, --기타
                    max(case when mathc = '○' then '○' else '' end) as casee --곹옽
              from essayetc e
                  ,universities u
                  ,commoncode c1
                  ,(select university, department,
                           mathc, math, mathp, mathd, mathg,
                           scncc, scncpa, scncca, scncba, scncea, scncpb, scnccb, scncbb, scnceb
                    from essaysbjctunvrs e
                    where division = $1
                    and "year" = $2
                    and useyn = 'Y') m
            where e.year = $2
            and e.division = $1
            and e.universityid = u.id
            and c1.comn_grp_cd = 'E00002'
            and c1.comn_cd = e.lar_cd
            and lar_cd = $3
            and e.useyn = 'Y'
            and e.universityid = m.university
            group by u.name, c1.comn_nm, e.universityid ,e.lar_cd, e.rmk1
          )
           select name,
                  comn_nm,
                  universityid,
                  lar_cd,
                  gubu,
                  subject,
                  casea,
                  caseb,
                  casec,
                  cased,
                  casee,
                  departmentid,
                  departmentnm
           from res
           where (
                  ((coalesce($4, '1') = '1') and 1=1) or
                  ((coalesce($4, '1') != '1') and casea  = '○')
                  )
           and   (
                  ((coalesce($5, '1') = '1') and 1=1) or
                  ((coalesce($5, '1') != '1') and caseb  = '○')
                  )
           order by name, universityid
            ;
                `, [str_division, str_year, str_lar_cd, str_mid_cd2, str_mid_cd3]
            )

            if (rows.rows == undefined || rows.rows.length < 1)
            {
              res.status(200).json({success: false, msg: 'No data', data: []});
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

    res.status(200).json({success: success, msg: msg, data: data});
    res.end();
} catch (err) {
    console.log(err)
    res.status(406).json({success: false, msg: 'Error', data: null});
              res.end();
              return;
}
}
