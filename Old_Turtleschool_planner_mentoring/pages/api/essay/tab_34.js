
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title:
    - params:

*/
export default async (req, res) => {
    let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    let success = false;
    let msg = 'fail'
    let statusCode = 500;
    let data = [];

    let s_math = req.query.math;
    let s_mathp = req.query.mathp;
    let s_mathd = req.query.mathd;
    let s_mathg = req.query.mathg;

    let s_scncc = req.query.scncc;
    let s_scncpa = req.query.scncpa;
    let s_scncca = req.query.scncca;
    let s_scncba = req.query.scncba;
    let s_scncea = req.query.scncea;

    let s_scncpb = req.query.scncpb;
    let s_scnccb = req.query.scnccb;
    let s_scncbb = req.query.scncbb;
    let s_scnceb = req.query.scnceb;
    let s_division = req.query.division;
    let s_year = req.query.year;

    let s_hmntsessay = req.query.hmntsessay;
    let s_mdclessay = req.query.mdclessay;
    let s_englishessay = req.query.englishessay;
    let s_lar_cd = req.query.lar_cd;
    let str_univers = req.query.univers;

    let s_gubu = req.query.gubu;


    switch (req.method) {
        case 'GET':
             rows  = await pool.query(`

   with res as (
   select u.name, a.university ,
   max(case when mathc is not null or math is not null or mathp is not null or mathd is not null or mathg is not null then '수학' else '' end ||
                   case when scncc is not null or scncpa is not null or scncca is not null or scncba is not null or
                   			 scncea is not null or scncpb is not null or scnccb is not null or scncbb is not null or
                   			 scnceb is not null then '과학' else '' end) as subject,
   max(a.mathc) as mathc,  max(a.math) as math,   max(a.mathp) as mathp,  max(a.mathd) as mathd,  max(a.mathg) as mathg,
   max(a.scncc) as scncc,  max(a.scncpa) as scncpa, max(a.scncca) as scncca, max(a.scncba) as scncba, max(a.scncea) as scncea,
   max(a.scncpb) as scncpb, max(a.scnccb) as scnccb, max(a.scncbb) as scncbb, max(a.scnceb) as scnceb,
   max(a.hmntsessay) as hmntsessay, max(a.mdclessay) as mdclessay, max(a.englishessay ) as englishessay,
   '1' as gubu
   from essaysbjctunvrs a
   	,universities u
   where a.division = $5
   and a.year = $6
   and a.university = u.id
   and ( --1기본 --2기타기능선택
   	 ((coalesce($10, '1') = '1') and 1=1) or
   	 ((coalesce($10, '1') != '1') and a.lar_cd  = '2')
   	 )
   group by u.name, a.university
   )
   , res2 as (
     select *
     from res
     --수학
     where
     --수학
     ((($12 != '0') and 1=1) or
     (($12   = '0') and (
  	     ((
  	     --1체크 전체조회
  	     --2노체크 해당건제외
  	        ((coalesce($1, '2') = '1') and coalesce(math, '') = '') or --수1수2
  	        ((coalesce($1, '2') != '1') and 1=1)
  	        )
  	      and (
  	        ((coalesce($2, '2') = '1') and coalesce(mathp, '') = '' ) or --확통
  	        ((coalesce($2, '2') != '1') and 1=1)
  	        )
  	      and (
  	        ((coalesce($3, '2') = '1') and coalesce(mathd, '') = '' ) or --미적
  	        ((coalesce($3, '2') != '1') and 1=1)
  	        )
  	      and (
  	        ((coalesce($4, '2') = '1') and coalesce(mathg, '') = '' ) or --기하학
  	        ((coalesce($4, '2') != '1') and 1=1)
  	        ))
        ))
      )
       --과학
       and ((($12 != '1') and 1=1) or
     (($12   = '1') and (
scncc  = '○' or scncpa  = '○' or scncca  = '○' or scncba  = '○' or scncea  = '○' or scncpb  = '○' or scnccb  = '○' or scncbb  = '○' or scnceb  = '○'
        )
        )
      )
       --의학
        and (
         ((coalesce($7, '1') = '1') and 1=1) or --문과논술
         ((coalesce($7, '1') != '1') and hmntsessay  = '○')
       )and (
         ((coalesce($8, '1') = '1') and 1=1) or --의학논술
         ((coalesce($8, '1') != '1') and mdclessay  = '○')
       )and (
         ((coalesce($9, '1') = '1') and 1=1) or --영어
         ((coalesce($9, '1') != '1') and englishessay  = '○')
       )
       and (
         ((coalesce($11, '1') = '1') and 1=1) or
         ((coalesce($11, '1') != '1') and cast(university as varchar) in (select split_part(unnest(string_to_array($11, '|')), '|', 1))
       ))
   )
   select * from res2
   union all
   select u.name, a.university ,
   max(case when mathc is not null or math is not null or mathp is not null or mathd is not null or mathg is not null then '수학' else '' end ||
                   case when scncc is not null or scncpa is not null or scncca is not null or scncba is not null or
                   			 scncea is not null or scncpb is not null or scnccb is not null or scncbb is not null or
                   			 scnceb is not null then '과학' else '' end) as subject,
   max(a.mathc) as mathc,  max(a.math) as math,   max(a.mathp) as mathp,  max(a.mathd) as mathd,  max(a.mathg) as mathg,
   max(a.scncc) as scncc,  max(a.scncpa) as scncpa, max(a.scncca) as scncca, max(a.scncba) as scncba, max(a.scncea) as scncea,
   max(a.scncpb) as scncpb, max(a.scnccb) as scnccb, max(a.scncbb) as scncbb, max(a.scnceb) as scnceb,
   max(a.hmntsessay) as hmntsessay, max(a.mdclessay) as mdclessay, max(a.englishessay ) as englishessay,
   '2' as gubu
   from essaysbjctunvrs a
   	,universities u
   where a.division = $5
   and a.year = $6
   and a.university = u.id
   and a.university not in (select university from res2)
   and coalesce($12, '0') != '1'
   and ( --1기본 --2기타기능선택
   	 ((coalesce($10, '1') = '1') and 1=1) or
   	 ((coalesce($10, '1') != '1') and a.lar_cd  = '2')
   	 )
   and (
       ((coalesce($11, '1') = '1') and 1=1) or
       ((coalesce($11, '1') != '1') and cast(a.university as varchar) in (select split_part(unnest(string_to_array($11, '|')), '|', 1))
  ))
   group by u.name, a.university
   order by gubu, name, university
   ;
                `, [s_math, s_mathp, s_mathd, s_mathg, s_division,
                   s_year, s_hmntsessay, s_mdclessay, s_englishessay, s_lar_cd,
                   str_univers, s_gubu]
            )

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
    }

    res.json({success: success, msg: msg, data: data});
    res.statusCode = statusCode;
    res.end();
}
