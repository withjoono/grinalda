
import pool from '../../../lib/pool'
import axios from 'axios'

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
  let s_year = req.body.data.year;
  let s_array_score = req.body.data.array_score;
  let s_division = req.body.data.division;

  if (req.method == 'POST') {

    //1.저장전에 삭제
		await pool.query(`delete from csatuscore where accountid = $1 and year = $2`,[req.headers.auth, s_year])

    //2.삭제후 저장
		//for (var i = 0; i < req.body.data.length; i++)
    //{
				await pool.query(`

        with res as ( --점수 과목별 조회
          select case when substring(split_part(score, ',', 1), 1, 1) in ('6','7')
          					  then substring(split_part(score, ',', 1), 1, 1) || '0'
          					  else split_part(score, ',', 1) end as subject,
          	     case when split_part(score, ',', 2) is null or split_part(score, ',', 2) = ''
                      then 0
                      else cast(split_part(score, ',', 2) as numeric) end as original_score,
                 case when split_part(score, ',', '1') = '81'
                      then case when split_part(score, ',', 5) is null or split_part(score, ',', 5) = ''
                                then 0 else cast(split_part(score, ',', 5) as numeric) end
                 		  else case when split_part(score, ',', 3) is null or split_part(score, ',', 3) = ''
                                then 0 else cast(split_part(score, ',', 3) as numeric) end
                      end as standard_score,
                 case when split_part(score, ',', 4) is null or split_part(score, ',', 4) = ''
                      then cast(( select percentage_score from csatsspu
                            			where division = '2'
                            			and subject = split_part(score, ',', 1)
                            			and standard_score = split_part(score, ',', 3)
                            			limit 1) as numeric)
                      else cast(split_part(score, ',', 4) as numeric)
                      end as percentage_score,
                 case when split_part(score, ',', 5) is null or split_part(score, ',', 5) = ''
                      then cast(( select rating_score from csatsspu
                            			where division = '2'
                            			and subject = split_part(score, ',', 1)
                            			and standard_score = split_part(score, ',', 3)
                            			limit 1) as numeric)
                      else cast(split_part(score, ',', 5) as numeric)
                      end as grade
                , case when substring(split_part(score, ',', 1), 1, 1) = '2' then '1' else '0' end as subject_division
                , case when substring(split_part(score, ',', 1), 1, 1) = '9' then '1' else '0' end as foregin2
                , case when split_part(score, ',', 1) in ('7F','7I') then '1' else '0' end as math_division
                , case when split_part(score, ',', 1) in ('76') then '1' else '0' end as math_division2
                 from (
                  --'60,74,124,88,|7F,69,130,76,|81,0,0,0,2|2E,44,60,80,|2F,40,64,90,|1G,42,3,77,'
              select unnest(string_to_array($3, '|')) as score
              ) as z
              --where substring(split_part(score, ',',1), 1, 1) != '9'
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
             , max(case when substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.required like '%탐(1)%' then cast(score as numeric) else 0 end * coalesce(c.exp_gasan, 1)) as required_b
             , sum(case when substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.required like '%탐(2)%' then cast(score as numeric) else 0 end * coalesce(c.exp_gasan, 1)) as required_c
             --선택1
             , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) = '6' and c.selected1 like '%국%' then cast(score as numeric) else 0 end) as selected1_a
             , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) = '7' and c.selected1 like '%수%' then cast(score as numeric) else 0 end) as selected1_b
             , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) = '8' and c.selected1 like '%영%' then cast(score as numeric) else 0 end) as selected1_c
             , max(case when c.selected1 is not null and substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.selected1 like '%탐(1)%' then cast(score as numeric) else 0 end) as selected1_d
             , sum(case when c.selected1 is not null and substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.selected1 like '%탐(2)%' then cast(score as numeric) else 0 end) as selected1_e
             , sum(case when c.selected1 is not null and r.subject = '1G' and c.selected1 like '%한%' then cast(score as numeric) else 0 end) as selected1_f
             --선택2
             , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) = '6' and c.selected2 like '%국%' then cast(score as numeric) else 0 end) as selected2_a
             , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) = '7' and c.selected2 like '%수%' then cast(score as numeric) else 0 end) as selected2_b
             , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) = '8' and c.selected2 like '%영%' then cast(score as numeric) else 0 end) as selected2_c
             , max(case when c.selected2 is not null and substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.selected2 like '%탐(1)%' then cast(score as numeric) else 0 end) as selected2_d
             , sum(case when c.selected2 is not null and substring(r.subject, 1, 1) in ('1', '2') and r.subject != '1G' and c.selected2 like '%탐(2)%' then cast(score as numeric) else 0 end) as selected2_e
             , substring(r.subject, 1, 1) as subject
             , sum(case when r.subject = '1G' then cast(score as numeric) else 0 end) as kor_h
             , c.required
             , c.selected1, c.selected_count1, c.selected2, c.selected_count2
             , c.selected1_gasan, c.selected2_gasan
             , max(case when c.score_convert  in ('231','232','659') and substring(r.subject, 1, 1) = '2' then r.percentage_score else 0 end) * 0.1 as case1
             , max(r.subject_division) as subject_division
             , sum(cast(r.foregin2 as numeric)) as foregin2
             , max(r.math_division) as math_division
             , max(r.math_division2) as math_division2
          from res r
              ,csatanlys c
              ,CSATRSSUY y
          where substring(r.subject , 1, 1) in ('1', '2', '6', '7', '8')
          and c.division = $4
          and y.subject = r.subject
          and y.standard_score = (case when r.subject in ('1G','81') then r.grade else r.standard_score end) --r.standard_score
          --and y.percentage_score = (case when r.subject in ('1G','81') then y.percentage_score else r.percentage_score end)
          and y.score_convert_a = c.score_convert
          and y.score_convert_b = c.division
          and y.useyn = 'Y'
          and y."year" = $1
          group by c.division, c.universityid, c.major, c.selection_type, c.sml_fld,
                   c.recruitment, c.area, c.score_convert, c.math_expl_chcs, c.test_reflct,
                   c.test_combination, substring(r.subject, 1, 1), c.required, c.selected1,
                   c.selected_count1, c.selected2, c.selected_count2,
                   c.selected1_gasan, c.selected2_gasan
             )
          ,res3 as ( --각대학별 표준점수의 과목별 순위
             select division, id, major, selection_type, sml_fld,
             		  recruitment, area, score_convert, math_expl_chcs,
             		  test_reflct, test_combination,
             		  required, selected1, selected_count1, selected2, selected_count2,
             		  required_a, required_b, required_c,
             		  selected1_a, selected1_b, selected1_c, selected1_d, selected1_e, selected1_f,
             		  selected2_a, selected2_b, selected2_c, selected2_d, selected2_e, kor_h,
                  RANK () OVER (PARTITION BY division, id, SELECTION_TYPE, MAJOR, SCORE_CONVERT ORDER BY selected1_a + selected1_b + selected1_c + selected1_d + selected1_e + selected1_f desc, subject asc) as selected1_rank,
                  RANK () OVER (PARTITION BY division, id, SELECTION_TYPE, MAJOR, SCORE_CONVERT ORDER BY selected2_a + selected2_b + selected2_c + selected2_d + selected2_e desc, subject asc) as selected2_rank,
                  ROW_NUMBER () OVER (PARTITION BY division, id, SELECTION_TYPE, MAJOR, SCORE_CONVERT ORDER BY required_a + required_b + required_c + selected2_a + selected2_b + selected2_c + selected2_d + selected2_e + kor_h  desc) as required_rank,
                  ROW_NUMBER () OVER (PARTITION BY division, id, SELECTION_TYPE, MAJOR, SCORE_CONVERT ORDER BY selected1_a + selected1_b + selected1_c desc) as selected3_rank,
                  selected1_gasan, selected2_gasan, case1, subject, foregin2, subject_division, math_division, math_division2
             from res2
             )
          insert into csatuscore
          (division, universityid , major , selection_type , sml_fld ,
          recruitment , area , score_convert_a , score_convert_b ,math_expl_chcs ,
          test_reflct , test_combination , score, useyn , year,
          accountid )
             select division, id, major, selection_type, sml_fld,
             		  recruitment, area, score_convert, division, math_expl_chcs,
             		  test_reflct, test_combination,
                  (case
                    when (a.score_convert in ('266', '267')) then  (sum(required_a) + greatest(sum(selected1_a), sum(selected1_c) , sum(selected1_d), sum(kor_h) )) -- 신한
                    when (a.score_convert in ('132','131')) then  (sum(required_b) + sum(selected1_a) + sum(selected1_b) + sum(selected1_c) - LEAST(sum(selected1_a), sum(selected1_b), sum(selected1_c)) +sum(kor_h) ) -- 대진자연
                    when (a.score_convert in ('313', '314')) then  (sum(required_a) + greatest(sum(selected1_b), sum(selected1_e)) + sum(kor_h) + '90'  ) -- 을지아동, 을지유교
                    when (a.score_convert in ('462')) then  (sum(required_a) + greatest(sum(selected1_a), sum(selected1_e)) + sum(kor_h) + '90'  ) -- 을지간호1
                    when (a.score_convert = '326') then  (sum(required_a) + sum(selected1_a) + sum(selected1_b) + sum(selected1_d) - LEAST(sum(selected1_a), sum(selected1_b), sum(selected1_d)) + sum(kor_h) + '240'  ) -- 인천재능
                    when (a.score_convert in ('354', '355' )) then  (sum(required_b) + sum(selected1_a) + sum(selected1_b) + sum(selected1_c) - LEAST(sum(selected1_a), sum(selected1_b), sum(selected1_c)) + sum(kor_h)  ) -- 중부사범, 중부통합
                    when (a.score_convert = '43') then  (sum(required_a) + sum(required_b) + sum(kor_h) +'120' ) -- 경희예술
                    when (a.score_convert = '46') then  (sum(required_a) + sum(required_b) + sum(kor_h) +'135' ) -- 경희태권
                    when (a.score_convert in ('241')) then sum(case when subject in ('7') then required_a else 0 end) + (sum(case when required_rank in ('2') then ( required_a + required_b + required_c +  kor_h) else 0 end)*3) + ( sum(case when required_rank in ('3') then ( required_a + required_b + required_c +  kor_h) else 0 end)*2.5) + (sum(case when required_rank in ('4') then ( required_a + required_b + required_c +  kor_h) else 0 end)*1.5) + sum(kor_h) -- 수원자연
                    when (a.score_convert = '240') then sum(case when subject in ('6') then required_a else 0 end) + (sum(case when required_rank in ('2') then ( required_a + required_b + required_c +  kor_h) else 0 end)*3) + ( sum(case when required_rank in ('3') then ( required_a + required_b + required_c +  kor_h) else 0 end)*2.5) + (sum(case when required_rank in ('4') then ( required_a + required_b + required_c +  kor_h) else 0 end)*1.5) + sum(kor_h) -- 수원인문
                    when (a.score_convert in ('422', '423')) then  (sum(case when selected1_rank in ('1') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*5) + (sum(case when selected1_rank in ('2') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*3) + (sum(case when selected1_rank in ('3') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*2) + sum(kor_h) -- 한신자연
                    when (a.score_convert in ('471')) then  (sum(case when selected1_rank in ('1') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*4.5) + (sum(case when selected1_rank in ('2') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*3.5) + (sum(case when selected1_rank in ('3') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*2) + sum(kor_h) -- 수원인문2
                    when (a.score_convert in ('472')) then  (sum(case when selected1_rank in ('1') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*4.5) + (sum(case when selected1_rank in ('2') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*3.5) + (sum(case when selected1_rank in ('3') then ( selected1_a + selected1_b + selected1_c + selected1_d ) else 0 end)*2) + sum(kor_h) + (sum(selected1_b)*0.1) -- 수원자연2
                    when (a.score_convert = '172') then (sum(selected1_a) + sum(selected1_b) + sum(selected1_c) + sum(selected1_d) - LEAST(sum(selected1_a), sum(selected1_b), sum(selected1_c), sum(selected1_d)) + sum(kor_h) + 1)
                    when (a.score_convert = '456') then greatest( sum(case when subject in ('6') then required_a else 0 end), sum(case when subject in ('7') then required_a else 0 end)) * 3.5 + least( sum(case when subject in ('6') then required_a else 0 end), sum(case when subject in ('7') then required_a else 0 end)) * 2.5+sum(case when subject in ('8') then required_a else 0 end) + sum(required_b) + sum(kor_h) -- 가천인문1
                    when (a.score_convert = '463') then (sum(case when required_rank in ('1') then ( required_a + required_b + required_c +  kor_h) else 0 end) * 4) + (sum(case when required_rank in ('2') then ( required_a + required_b + required_c +  kor_h) else 0 end) * 3) + (sum(case when required_rank in ('3') then ( required_a + required_b + required_c +  kor_h) else 0 end) * 2) +(sum(case when required_rank in ('4') then ( required_a + required_b + required_c +  kor_h) else 0 end) * 1)
                    when (a.score_convert in ('406', '408', '411', '412')) then (sum(case when selected3_rank in ('1') then ( selected1_a + selected1_b + selected1_c ) else 0 end)*7) + greatest(sum(case when selected3_rank in ('2') then ( selected1_a + selected1_b + selected1_c ) else 0 end), sum(selected1_e) )*3
                    when (a.score_convert = '208') then sum(required_a) + sum(required_b) + sum(required_c) + sum(kor_h) + case when max(cast(coalesce(foregin2, '0') as numeric)) = 0 then -3.5 else max(cast(coalesce(foregin2, '0') as numeric)) end
                    when (a.score_convert = '388' and max(subject_division) = '0') then 0
                    when (a.score_convert = '390' and (max(subject_division) = '0' or max(math_division) ='0')) then 0
                    when (a.score_convert in ('392', '319') and (max(subject_division) = '0' or max(math_division2) = '0')) then 0
                    when (a.score_convert = '446' and a.division = '0' and (max(subject_division) = '1' or max(math_division2) ='0')) then 0
            else
                  round((
                  sum(required_a + required_b + required_c +
                     (case when selected_count1 is not null and selected1_rank <= cast(selected_count1 as numeric) then selected1_a + selected1_b + selected1_c + selected1_d + selected1_e + selected1_f else 0 end) +
                     (case when selected_count2 is not null and selected2_rank <= cast(selected_count2 as numeric) then selected2_a + selected2_b + selected2_c + selected2_d + selected2_e else 0 end )
                + case when a.score_convert in ('478','234') then 0 else kor_h end
                + case1
                + (case when a.score_convert in ('134','135') and subject in ('6','7','8') then required_a else 0 end * 2)
                + case when a.score_convert = '379' and a.subject = '2' then 10 else 0 end
              )
              -  min(case when a.score_convert in ('134','135') and subject in ('6','7','8') then required_a
                          when a.score_convert in ('134','135') and subject not in ('6','7','8') then null else 0 end * 1.5)
            + case when a.score_convert in ('253','254','255','391','388','390') then 800
              		 when a.score_convert in ('64','66','67') then 120
              		 when a.score_convert in ('69','68') then 150
                   when a.score_convert in ('407','292') then 600
                   when a.score_convert in ('392') then 790
                   when a.score_convert in ('30','545','594','612','340','341') then 700 else 0 end
              ),2) end) as score, 'Y', cast($1 as numeric), $2
             		  from res3 a
              group by  division, id, major, selection_type, sml_fld,
             		  recruitment, area, score_convert, division, math_expl_chcs,
             		  test_reflct,  test_combination
        ;
				`,[s_year, req.headers.auth, s_array_score, s_division ])
     //}

		res.status(200).json({success: true, msg: 'success'});
		res.end();
  }
}
