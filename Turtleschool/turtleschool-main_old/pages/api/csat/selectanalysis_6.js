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
  let s_division = req.query.division;
  let s_year = req.query.year;
  let s_universitynm = req.query.universitynm? req.query.universitynm : null;
  let s_departmentnm = req.query.departmentnm? req.query.departmentnm : null;
  let s_recruitment = req.query.recruitment? req.query.recruitment : null;
  let s_collegeinterest = req.query.collegeinterest? req.query.collegeinterest : null;
  let s_areacode = req.query.areacode? req.query.areacode : null;
  let s_cross_sprt = req.query.cross_sprt? req.query.cross_sprt : null;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

              with res as ( --사용자의 구분별 원점수 표준점수의 합
                  select round(sum(case when substring(subject_a , 1, 1) in ('6','7','1','2') and subject_a != '1G'
                  			          then cast(standardscore as numeric) else 0 end) / 4) as standardscore ,
                  	     round(sum(case when substring(subject_a , 1, 1) in ('6','7','1','2') and subject_a != '1G'
                  	   		        then cast(percentage as numeric) else 0 end) / 4) as percentage,
                  	   	 memberid,
                         division
                  from csatidscore
                  where memberid = $1
                  and division = $2
                  group by memberid, division
              )
              ,res2 as ( --대학별 반영과목점수
                  select z.division,
                         z.universityid,
                         z.major,
                         z.selection_type,
                         z.sml_fld,
                         z.recruitment,
                  			 (select comn_nm from commoncode c where comn_grp_cd = 'C00007' and c.comn_cd = z.test_combination) as aa,
                  			 required, score,
                  			 sum( case when required like '%국%' then 1 else 0 end +
                  					  case when required like '%수%' then 1 else 0 end +
                              case when required like '%영%' then 1 else 0 end +
                  					  case when required like '%탐(1)%' then 1 else 0 end +
                  					  case when required like '%탐(2)%' then 1 else 0 end +
                  					  case when required like '%한%' then 1 else 0 end) as required_count,
                  			 max(case when y.required like '%탐(1)%' then '1'
                  		    		    when y.required like '%탐(2)%' then '2'
                  		    		    when y.selected1 like '%탐(1)%' then '1'
                  		    		    when y.selected1 like '%탐(2)%' then '2'
                  		    		    when y.selected2 like '%탐(1)%' then '1'
                  		    		    when y.selected2 like '%탐(2)%' then '2'
                  		    		    else '0' end) as required_exp,
                 			   selected1, selected_count1,
                  			 selected2, selected_count2,
                  			 y.score_convert, y.TEST_REFLCT,
                  			 x.subject_a, x.subject_b,
                  			 w.standardscore, w.percentage,
                         y.prdctcutnb as EXPECTED_SCORE,
                         y.prdctcutnb, y.frcstcut
                  	from csatuscore z
                  	left outer join csatanlys y on z.division = y.division and z.universityid = y.universityid and z.major = y.major and z.selection_type = y.selection_type and z.sml_fld = y.sml_fld and z.recruitment = y.recruitment
                  	left outer join csatidscore x on z.accountid = x.memberid and x."year" = cast($3 as varchar) and x.useyn = 'Y' --and x.division = z.division
                  	left outer join res w on w.memberid = x.memberid --and w.division = x.division
                  	where z.accountid = $1
                    and (((coalesce ($9, '1') ='1') and coalesce(z.cross_sprt, 'N') != 'Y') or
                         ((coalesce ($9, '1')!='1') and coalesce(z.cross_sprt, 'N') = $9))
                  	group by z.division, z.universityid, z.major, z.selection_type, z.sml_fld, z.recruitment,
                  			     z.test_combination, required, score, selected1, selected_count1,
                  			     selected2, selected_count2, y.score_convert, x.subject_a, x.subject_b,
                  			     w.standardscore, w.percentage, y.TEST_REFLCT, y.EXPECTED_SCORE, y.prdctcutnb, y.frcstcut
        			 )
              , RES3 as (
                	select division, universityid, major, selection_type, sml_fld, recruitment, score,
                			   required, required_count, required_exp,frcstcut,
                			   selected1, selected_count1,
                			   selected2, selected_count2,
                			   case when substring(subject_a, 1, 1) in ('6', '7') then subject_b else subject_a end as subject_a,
                			   standardscore , percentage ,
                			   case  when required like '%국%' and substring(subject_a, 1, 1) = '6' then 'Y'
                      				 when required like '%수%' and substring(subject_a, 1, 1) = '7' then 'Y'
                               when required like '%영%' and substring(subject_a, 1, 1) = '8' then 'Y'
                      				 when required like '%탐%' and substring(subject_a, 1, 1) in ('1','2') and subject_a != '1G' then 'Y'
                      				 when required like '%한%' and subject_a = '1G' then 'Y'
                      				 when selected1 like '%국%' and substring(subject_a, 1, 1) = '6' then 'Y'
                      				 when selected1 like '%수%' and substring(subject_a, 1, 1) = '7' then 'Y'
                               when selected1 like '%영%' and substring(subject_a, 1, 1) = '8' then 'Y'
                      				 when selected1 like '%탐%' and substring(subject_a, 1, 1) in ('1','2') and subject_a != '1G' then 'Y'
                      				 when selected1 like '%한%' and subject_a = '1G' then 'Y'
                      				 when selected2 like '%국%' and substring(subject_a, 1, 1) = '6' then 'Y'
                      				 when selected2 like '%수%' and substring(subject_a, 1, 1) = '7' then 'Y'
                               when selected2 like '%영%' and substring(subject_a, 1, 1) = '8' then 'Y'
                      				 when selected2 like '%탐%' and substring(subject_a, 1, 1) in ('1','2') and subject_a != '1G' then 'Y'
                      				 when selected2 like '%한%' and subject_a = '1G' then 'Y'
                      				 else 'N' end as new_score_yn, score_convert, TEST_REFLCT,
                			   round(case when test_reflct = '1' and substring(subject_a, 1, 1) in ('6','7') then percentage
                				            when test_reflct in ('1','2') and substring(subject_a, 1, 1) in ('1','2') then percentage
                				            else '0' end) as new_percentage, --baek
                			   round(case when test_reflct in ('2','3','4') and substring(subject_a, 1, 1) in ('6','7') then standardscore
                				            when test_reflct in ('3','4') and substring(subject_a, 1, 1) in ('1','2') then standardscore
                				            else '0' end) as new_standardscore, EXPECTED_SCORE, prdctcutnb
                	from RES2
              )
              , res4 as (
              	select r.division, r.universityid, r.major, r.selection_type, r.sml_fld,
              		     r.score_convert as score_convert_a, y.score_convert_b,
              		     sum(case when substring(subject_a, 1, 1) in ('1', '2') and required_exp = '1' then cast(y.score as numeric) / 2
              		   		        else cast(y.score as numeric) end) as score,
              		     r.score as basic_score, r.recruitment,r.required, r.selected1, r.selected2,
              		     r.EXPECTED_SCORE, r.prdctcutnb, r.frcstcut
              	from res3 r
                left outer join CSATRSSUY y
              	on y.subject = r.subject_a
              	and y.standard_score = r.new_standardscore
              	--and y.percentage_score = case when r.new_percentage = '0' then y.percentage_score else r.new_percentage end
              	and y.score_convert_a = r.score_convert
              	and y.score_convert_b = r.division
              	and y.useyn = 'Y'
              	and y."year" = cast($3 as varchar)
              	where substring(r.subject_a , 1, 1) in ('1', '2', '6', '7', '8')
              	and new_score_yn = 'Y'
              	--and y.score_convert_b is not null
                group by r.score_convert, r.division, r.universityid, r.major, r.selection_type, r.sml_fld,
              		       y.score_convert_a, y.score_convert_b,
              		       r.score, r.recruitment,r.required, r.selected1, r.selected2,
                         r.EXPECTED_SCORE, r.prdctcutnb, r.frcstcut
              )
              select a.division,
              	     a.universityid, --대학코드
              	     u.name,	--대학명
              	     coalesce(c2.department, '-') as major_cd, --학과코드
                     coalesce(d2."name", '-') as major_nm, --학과명
                     c2.major,
              	     a.selection_type,
              	     a.sml_fld,
              	     a.score_convert_a,
              	     max(a.score_convert_b) as score_convert_b,
                     max(a.basic_score) as basic_score, --1차점수 최초합예측점 --내점수
                     (cast(max(basic_score) as numeric) -
                      public.selectanalysis_6_ubul(cast(a.division as varchar), cast(a.universityid as numeric), cast(c2.major as varchar),
                                                   cast(a.score_convert_a as varchar), cast($1 as numeric), cast($3 as varchar)
                                                 )) as new_score
              	     ,null as u_jisu --c2.u_jisu as u_jisu
              	     ,public.selectanalysis_6_ubul(cast(a.division as varchar), cast(a.universityid as numeric), cast(c2.major as varchar),
              	     							                 cast(a.score_convert_a as varchar), cast($1 as numeric), cast($3 as varchar))
              	     							               * cast(coalesce(c2.u_jisu, '1') as numeric
                                                   ) as u_t_jisu
                     ,case when (cast(max(basic_score) as numeric) - sum(coalesce(cast(c2.final70 as numeric), 0))) > 5 then 'H'
              	   		     when (cast(max(basic_score) as numeric) - sum(coalesce (cast(c2.final70 as numeric), 0))) between 0 and 5 then 'O'
              	   		     when (cast(max(basic_score) as numeric) - sum(coalesce (cast(c2.final70 as numeric), 0))) < 0 then 'L'
              	   		     else '' end as risk_yn
              	     ,max(cast(a.basic_score as numeric)) - cast(c2.final70 as numeric) as EXPECTED_SCORE_diff--차이
                     ,a.recruitment
                     ,c2.final70 as expected_score--a
                     ,c2.final70 as last70cuts_score --b
                     ,c2.cumulativetop as prdctcutnb --상위누적
                     ,c2.kor
                     ,c2.mat
                     ,c2.eng
                     ,c2."exp"
                     ,c2.foreg
                     --,c2.recruits --정원
                     ,c2.total_recruits as recruits
                     ,c2.EXPECTED_SCORE_cumulative --최초합예측점수상위누적
                     ,a.prdctcutnb as last70cuts_scoretopc --d
                     ,a.frcstcut as final70 --c
                     ,cast(coalesce(c2.recruits, '0') as numeric) + 0  as acceptancerank --최초합 합격 순위
                     ,round(cast(coalesce(c2.recruits, '0') as numeric) + 0 + cast(coalesce(max(c2.addrecruits), '0') as numeric)) as rv_acceptrank --추합 합격 순위
                     ,c2.add70cuts_score
                     ,c2.addcumulativetop
                     ,max(cast(a.basic_score as numeric)) - cast(c2.add70cuts_score as numeric) as add_EXPECTED_SCORE_diff--차이
              from res4 a
              	,universities u
              	,commoncode c
              	,csatunivdepart c2
              	,departments d2
              where a.universityid = u.id
              and c.comn_grp_cd = 'C00008'
              and a.major = c.comn_cd
              and a.universityid = cast(c2.universityid as numeric) and a.score_convert_a = c2.score_convert
              and cast(c2.department as numeric) = d2.id
              and a.major = c2.major
              and a.division = c2.division
              and (((coalesce ($4, '1') ='1') and 1=1) or
                   ((coalesce ($4, '1')!='1') and (u."name" like '%' || coalesce($4, '') || '%')))
              and (((coalesce ($5, '1') ='1') and 1=1) or
                   ((coalesce ($5, '1')!='1') and (d2."name" IN (select unnest(string_to_array($5, ',')) as score))))
              and (((coalesce ($7, '1') ='1') and 1=1) or
                   ((coalesce ($7, '1')!='1') and (c2.recruitment = $7 )))
              and (((coalesce ($6, '1') ='1') and 1=1) or
                   ((coalesce ($6, '1')!='1') and ((c2.universityid , c2.department) in (select universityid, department from csatinteruniv c where accountId = cast($1 as varchar) and year = cast($3 as varchar) and useyn = 'Y'))))
              and (((coalesce ($8, '1') ='1') and 1=1) or
                   ((coalesce ($8, '1')!='1') and (u."areaCode" IN (select unnest(string_to_array($8, ',')) as score))))
/*
              and c2.division in (select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                                 from csatidscore c
                                 where memberid = cast($1 as numeric)
                                 and year = cast($3 as varchar)
                                 and useyn = 'Y'
                                 )
*/
              and (((coalesce ($9, '1') ='1') and c2.division in ((select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                                 from csatidscore c
                                 where memberid = cast($1 as numeric)
                                 and year = cast($3 as varchar)
                                 and useyn = 'Y'
                                 ))) or
                   ((coalesce ($9, '1')!='1') and c2.division not in ((select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                                 from csatidscore c
                                 where memberid = cast($1 as numeric)
                                 and year = cast($3 as varchar)
                                 and useyn = 'Y'
                                 ))))
              group by a.division, a.universityid, u.name, c2.department , d2."name", --a.major, c.comn_nm,
              a.selection_type, a.sml_fld, a.score_convert_a, EXPECTED_SCORE, a.recruitment,
              c2.final70,c2.kor,c2.mat,c2.eng,c2."exp",c2.foreg, c2.recruits, c2.final70_cumulative, c2.EXPECTED_SCORE_cumulative,c2.major
              ,c2.u_jisu,c2.u_jisu_sum,c2.cumulativetop,a.prdctcutnb, a.frcstcut, c2.total_recruits,
              c2.add70cuts_score ,c2.addcumulativetop  `,
        [
          req.headers.auth,
          s_division,
          s_year,
          s_universitynm,
          s_departmentnm,
          s_collegeinterest,
          s_recruitment,
          s_areacode,
          s_cross_sprt,
        ],
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
