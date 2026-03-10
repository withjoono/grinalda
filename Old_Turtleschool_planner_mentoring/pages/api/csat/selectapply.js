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
    let s_recruitment = req.query.recruitment;

    switch (req.method) {
        case 'GET':
        case 'POST':
            rows  = await pool.query(`

                  with res as ( --점수 과목별 조회
                       select case when substring(subject_a, 1, 1) in ('6','7') then substring(subject_a, 1, 1) || '0' else subject_a  end as subject,
                       		standardscore as standard_score , percentage as percentage_score, grade
                       from csatidscore c
                       where memberid = cast($1 as numeric)
                    )
                    , res2 as ( --각대학별 점수 조회
                    select c.division, c.universityid as id, c.major , c.selection_type , c.sml_fld
                       , c.recruitment, c.area , c.score_convert , c.math_expl_chcs
                       , c.test_reflct , c.test_combination
                       --필수값
                       , sum(case when substring(r.subject, 1, 1) = '6'      and c.required like '%국%' then cast(score as numeric)
                       		        when substring(r.subject, 1, 1) = '7'      and c.required like '%수%' then cast(score as numeric)
                       		        when substring(r.subject, 1, 1) = '8'      and c.required like '%영%' then cast(score as numeric)
                       		        else 0 end) as required_a
                       , max(case when substring(r.subject, 1, 1) in ('1', '2')  and c.required like '%탐(1)%' then cast(score as numeric) else 0 end) as required_b
                       , sum(case when substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.required like '%탐(2)%' then cast(score as numeric) else 0 end) as required_c
                       --선택1
                       , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) = '6' and c.selected1 like '%국%' then cast(score as numeric) else 0 end) as selected1_a
                       , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) = '7' and c.selected1 like '%수%' then cast(score as numeric) else 0 end) as selected1_b
                       , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) = '8' and c.selected1 like '%영%' then cast(score as numeric) else 0 end) as selected1_c
                       , max(case when c.selected1 is not null and substring(r.subject, 1, 1) in ('1', '2')  and c.selected1 like '%탐(1)%' then cast(score as numeric) else 0 end) as selected1_d
                       , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.selected1 like '%탐(2)%' then cast(score as numeric) else 0 end) as selected1_e
                       , sum(case when c.selected1 is not null and r.subject = '1G' and c.selected1 like '%한%' then cast(score as numeric) else 0 end) as selected1_f
                       --선택2
                       , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) = '6' and c.selected2 like '%국%' then cast(score as numeric) else 0 end) as selected2_a
                       , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) = '7' and c.selected2 like '%수%' then cast(score as numeric) else 0 end) as selected2_b
                       , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) = '8' and c.selected2 like '%영%' then cast(score as numeric) else 0 end) as selected2_c
                       , max(case when c.selected2 is not null and substring(r.subject, 1, 1) in ('1', '2')  and c.selected2 like '%탐(1)%' then cast(score as numeric) else 0 end) as selected2_d
                       , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.selected2 like '%탐(2)%' then cast(score as numeric) else 0 end) as selected2_e
                       , sum(case when r.subject = '1G' then cast(score as numeric) else 0 end) as kor_h
                       , substring(r.subject, 1, 1) as subject
                       , c.required
                       , c.selected1, c.selected_count1, c.selected2, c.selected_count2
                       , c.EXPECTED_SCORE as frcstcut --c.frcstcut
                       , c.prdctcutnb
                    from res r
                        ,csatanlys c
                        ,CSATRSSUY y
                    where substring(r.subject , 1, 1) in ('1', '2', '6', '7', '8')
                    and c.division = '1'
                    and y.subject = r.subject
                    and y.standard_score = (case when r.subject in ('1G','81') then r.grade else r.standard_score end) --r.standard_score
                    --and y.percentage_score = (case when r.subject in ('1G','81') then y.percentage_score else r.percentage_score end)
                    and y.score_convert_a = c.score_convert
                    and y.score_convert_b = c.division
                    and y.useyn = 'Y'
                    and y."year" = cast($2 as varchar)
                    group by c.division, c.universityid, c.major, c.selection_type, c.sml_fld,
                             c.recruitment, c.area, c.score_convert, c.math_expl_chcs, c.test_reflct,
                             c.test_combination, substring(r.subject, 1, 1), c.required, c.selected1,
                             c.selected_count1, c.selected2, c.selected_count2, c.EXPECTED_SCORE, c.prdctcutnb
                       )
                    ,res3 as ( --각대학별 표준점수의 과목별 순위
                       select division, id, major, selection_type, sml_fld,
                       		  recruitment, area, score_convert, math_expl_chcs,
                       		  test_reflct, test_combination,
                       		  required, selected1, selected_count1, selected2, selected_count2,
                       		  required_a, required_b, required_c,
                       		  selected1_a, selected1_b, selected1_c, selected1_d, selected1_e, selected1_f,
                       		  selected2_a, selected2_b, selected2_c, selected2_d, selected2_e,
                       		  RANK () OVER (PARTITION BY division, id, SELECTION_TYPE, MAJOR, SCORE_CONVERT ORDER BY selected1_a + selected1_b + selected1_c + selected1_d + selected1_e, selected1_f desc) as selected1_rank,
            				        RANK () OVER (PARTITION BY division, id, SELECTION_TYPE, MAJOR, SCORE_CONVERT ORDER BY selected2_a + selected2_b + selected2_c + selected2_d + selected2_e desc) as selected2_rank
                            ,frcstcut, prdctcutnb, kor_h
                       from res2
                       )
                       ,res4 as (
                       select a.division, a.id, a.major, a.selection_type, a.sml_fld,
                       		  a.recruitment, area, a.score_convert, a.division, a.math_expl_chcs,
                       		  a.test_reflct, a.test_combination,
                       		  sum(required_a + required_b + required_c +
                       		  case when selected_count1 is not null and selected1_rank <= cast(selected_count1 as numeric) then selected1_a + selected1_b + selected1_c + selected1_d + selected1_e + selected1_f else 0 end +
                       		  case when selected_count2 is not null and selected2_rank <= cast(selected_count2 as numeric) then selected2_a + selected2_b + selected2_c + selected2_d + selected2_e else 0 end
                            + kor_h
                          )as score, b.department ,b.recruits, b.finalCmrt, a.frcstcut, b.addrecruits, a.prdctcutnb,
                          b.final70,
                          b."70cuts",
                          b."95cuts",
                          b."70cuts_cumulative",
                          b."95cuts_cumulative"
                       		  from res3 a
                       		  ,csatunivdepart b
                       where a.id = cast(b.universityid as numeric)
                       and b.use_yn = 'Y'
                       and b."year" = cast($2 as varchar)
                       and a.major = b.major
                       --and a.score_convert = b.score_convert
                       and a.division = b.division
                        group by a.division, a.id, a.major, a.selection_type, a.sml_fld,
                       		  a.recruitment, a.area, a.score_convert, a.division, a.math_expl_chcs,
                       		  a.test_reflct, a.test_combination, b.department, b.recruits , b.finalCmrt, a.frcstcut
                            ,b.addrecruits, a.prdctcutnb, b.final70, b."70cuts",
                            b."95cuts",
                            b."70cuts_cumulative",
                            b."95cuts_cumulative"
                       		  )
                    select a.universityid --대학코드
                        ,u."name" as universitynm --대학명
                        ,a.department as departmentcd --학과코드
                        ,d."name" as departmentnm --학과명
                        ,a.recruitment --계열
                        ,z.recruits as garden --정원
                        ,'미발표' as essayover --수시이월
                        ,cast(coalesce(z.recruits, '0') as numeric) + 0 as recruits --모집인원
                        ,z.finalCmrt as tv_competition --3개년평균경쟁률
                        ,round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1) as numberapplicants --평균경쟁률로 산정한 예측 지원자수
                        --,cast(coalesce(z.finalCmrt, '0') as numeric) || '/' || round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1) as acceptancerank --최초합 합격 순위
                        --,round(cast(coalesce(z.finalCmrt, '0') as numeric) / round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1)) as acceptancerank --최초합 합격 순위
                        ,cast(coalesce(z.recruits, '0') as numeric) + 0  as acceptancerank --최초합 합격 순위
                        ,z.addrecruits as rva_addjungwon --3개년 평균 추합 정원
                        ,round(cast(coalesce(z.recruits, '0') as numeric) + 0 + cast(coalesce(z.addrecruits, '0') as numeric)) as rv_acceptrank --추합 합격 순위
                        ,get_csatapply_recuits(a.universityid,
                                              a.department,
                                              a.recruitment,
                                              a.year) as numbermockappy --모의 지원자 수
                        ,get_csatapply_grade(cast(a.accountid as varchar),
                                  						  a.universityid,
                                  						  a.department,
                                  						  a.recruitment,
                                  						  a.year) as myrank --내 등수
                        ,round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '0') as numeric)) as predictedrank_a --예측 등수
                        ,round(cast(get_csatapply_grade(cast(a.accountid as varchar),
                                  						  a.universityid,
                                  						  a.department,
                                  						  a.recruitment,
                                  						  a.year) as numeric) * 1.75 /
          case when round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1) = 0
          then 1 else round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1) end
                                            ) as predictedrank_b --예측 등수
                        /*
                      ,case when round(cast(coalesce(z.finalCmrt, '0') as numeric) / round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1)) <= cast(coalesce(z.recruits, '0') as numeric) * 0.7
                    		  then '안전'
                    		  when round(cast(coalesce(z.finalCmrt, '0') as numeric) / round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1)) between cast(coalesce(z.recruits, '0') as numeric) * 0.7 and cast(coalesce(z.recruits, '0') as numeric) * 0.95
                    		  then '노랑'
                    		  when round(cast(coalesce(z.finalCmrt, '0') as numeric) / round((cast(coalesce(z.recruits, '0') as numeric) + 0) * cast(coalesce(z.finalCmrt, '1') as numeric), 1)) between cast(coalesce(z.recruits, '0') as numeric) * 0.95 and cast(coalesce(z.recruits, '0') as numeric) * 1.00
                    		  then '주황'
                    		  else '빨강' end as firsttime
                      ,case when cast(coalesce(z.recruits, '0') as numeric) + 0 + cast(coalesce(z.addrecruits, '0') as numeric) <= cast(z.addrecruits as numeric) * 0.3
                    		  then '노랑'
                    		  when cast(coalesce(z.recruits, '0') as numeric) + 0 + cast(coalesce(z.addrecruits, '0') as numeric) between cast(z.addrecruits as numeric) * 0.3 and cast(z.addrecruits as numeric) * 0.7
                    		  then '주황'
                    		  else '빨강' end as secondtime --추합 판단
                          */
                        ,'추후판단' as firsttime
                        ,'추후판단' as secondtime
                        , round(z.score, 2) as score
                        , z.frcstcut --최초합 예측점수_점수
                        --, z.prdctcutnb --최초합 예측점수_상위적
                        , z.frcstcut as prdctcutnb
                        , cast(coalesce(z.frcstcut, '0') as numeric) - cast(coalesce(z.score, '0') as numeric) as score_diff
                        , final70
                        , "70cuts" as firsttime_a
                        , "95cuts" as firsttime_b
                        , '-' as secondtime_a
                        ,case    when cast(z.score as numeric) - cast(coalesce(z.frcstcut, '0') as numeric)  > 7 then ''
                                 when cast(z.score as numeric) - cast(coalesce(z.frcstcut, '0') as numeric) between -3 and 0 then '위험'
                 	   		         when cast(z.score as numeric) - cast(coalesce(z.frcstcut, '0') as numeric) between 0 and 3 then '소신'
                          	     when cast(z.score as numeric) - cast(coalesce(z.frcstcut, '0') as numeric) between 3 and 7 then '적정'
                 	   		         when cast(z.score as numeric) - cast(coalesce(z.frcstcut, '0') as numeric) < -3 then '불합'
                 	   		         else '' end as pass_status
                        , "95cuts"
                        , "95cuts_cumulative"
                    from csatmstrysprt a
                    left outer join res4 z on a.universityid = cast(z.id as varchar) and a.department = z.department
                    left outer join universities u on a.universityid = cast(u.id as varchar)
                    left outer join departments d on a.department = cast(d.id as varchar)
                    where a.accountid = cast($1 as varchar)
                    and a."year" = cast($2 as varchar)
                    and a.useyn = 'Y'
                    and (((coalesce($3, '1') ='1') and 1=1) or
                         ((coalesce($3, '1')!='1') and a.recruitment = cast($3 as varchar)))
              ;
                `,
                    [req.headers.auth, s_year, s_recruitment]
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
