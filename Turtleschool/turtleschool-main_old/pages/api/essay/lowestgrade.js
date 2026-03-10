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

  let kor = req.query.kor;
  let eng = req.query.eng;
  let mat1 = req.query.mat1;
  let mat2 = req.query.mat2;
  let soc1 = req.query.soc1;
  let soc2 = req.query.soc2;
  let sci1 = req.query.sci1;
  let sci2 = req.query.sci2;
  let khistory = req.query.khistory;
  let str_division = req.query.division;
  let str_univers = req.query.univers;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `
                with res as (
                    select a.subject, a.kor, b.university, b.rcrtmunit, b.rmk,
                    b.korean, b.english, b.math1, b.math2, coalesce(b.sum1, '0') as sum1, coalesce(b.sum2, '9') as sum2, b.koreanhistory, b.andenglish, b.orenglish, b.inenglish, b.essential,
                    b.science, b.explore, b.socialscience, b.science1, b.explore1, b.socialscience1
                    from (
                        select '60' as subject, coalesce($1, '0') as kor union all
                        select '80' as subject, coalesce($2, '0') as eng union all
                        select '71' as subject, coalesce($3, '0') as mat1 union all
                        select '72' as subject, coalesce($4, '0') as mat2 union all
                        select '11' as subject, coalesce($5, '0') as soc1 union all
                        select '12' as subject, coalesce($6, '0') as soc2 union all
                        select '21' as subject, coalesce($7, '0') as sci1 union all
                        select '22' as subject, coalesce($8, '0') as sci2 union all
                        select '99' as subject, coalesce($9, '0') as khistory
                    ) a
                    , essayrecruitment b
                    where b.university = b.university
                    --영어 [eng] 성적이 andenglish 보다 작을 경우에만 해당
                    and $2 <= coalesce(b.andenglish, '9')
                    --미적 [mat2] 성적이 0 일경우 b.math2 is null
                    and (((coalesce($4, '7') = '7') and b.math2 is null) or ((coalesce($4, '7') != '7') and 1=1))
                    --사회역역 [soc1] 또는 [soc2]가 0보다 클경우 b.explore  is null or b.explore1 is null
                    and (((coalesce($5, '1') = '1') and (b.explore is null or b.explore1 is null)) or ((coalesce($5, '1') != '1') and 1=1))
                    and b.rmk != '-'
                    and b.useyn = 'Y'
                    and b.division = $10
                )
                , res2 as (
                    select substring(subject, 1, 1) as subject,
                        university, rcrtmunit, rmk, case when substring(subject, 1, 1) in ('1', '2') then trunc(sum(cast(kor as numeric)) /2) else sum(cast(kor as numeric)) end as asuma,
                        case when substring(subject, 1, 1) in ('1', '2') then min(cast(kor as numeric)) else 0 end as m_exp,
                        korean, english, math1, math2, sum1, sum2, koreanhistory, andenglish, orenglish, inenglish,
                        science, explore, socialscience, science1, explore1, socialscience1, essential
                    from res
                    group by substring(subject, 1, 1),
                        university, rcrtmunit, rmk,
                        korean, english, math1, math2, sum1, sum2, koreanhistory, andenglish, orenglish, inenglish,
                        science, explore, socialscience, science1, explore1, socialscience1, essential
                )
                , res3 as (
                    select subject, university, rcrtmunit, rmk,
                    asuma, --합등급,
                    m_exp, --탐구1과목
                    case when subject = '6' and korean is not null then asuma
                        when subject = '7' and (math1 is not null or math2 is not null) then asuma
                        when subject = '8' and english is not null then asuma
                        when subject = '1' and (explore is not null or socialscience is not null) then asuma
                        when subject = '2' and (science is not null or explore is not null or socialscience is not null) then asuma
                        when subject = '1' and (explore1 is not null or socialscience1 is not null) then m_exp
                        when subject = '2' and (science1 is not null or explore1 is not null or socialscience1 is not null) then m_exp
                        when subject = '9' and koreanhistory is not null then asuma
                        else 0 end as s_score,
                    case when subject = '6' and korean is not null then coalesce(korean, '')
                        when subject = '7' and (math1 is not null or math2 is not null) then coalesce(math1, '') || coalesce(math2, '')
                        when subject = '8' and english is not null then coalesce(english, '')
                        when subject = '1' and (explore is not null or socialscience is not null) then coalesce(explore, '') || coalesce(socialscience, '')
                        when subject = '2' and (science is not null or explore is not null or socialscience is not null) then coalesce(science, '') || coalesce(explore, '') || coalesce(socialscience, '')
                        when subject = '1' and (explore1 is not null or socialscience1 is not null) then coalesce(explore1, '') || coalesce(socialscience1, '')
                        when subject = '2' and (science1 is not null or explore1 is not null or socialscience1 is not null) then coalesce(science1, '') || coalesce(explore1, '') || coalesce(socialscience1, '')
                        when subject = '9' and koreanhistory is not null then coalesce(koreanhistory, '')
                        else '' end as titel, sum1, sum2, andenglish, orenglish, inenglish, essential
                    from res2
                )
                , res4 as (
                    select subject, university, rcrtmunit, rmk,
                    asuma, m_exp,
                    s_score, substring(titel, 2, 1) as ccou, sum1, sum2,
                    andenglish, orenglish, inenglish, essential,
                    RANK () OVER (partition by university,rcrtmunit,rmk  ORDER BY s_score, subject) as rrank
                    from res3
                    where s_score != '0'
                    and (substring(titel, 2, 1) is not null and substring(titel, 2, 1) != '')
                )
                select distinct rcrtmunit, rmk
                    ,case when (total_score between sum1 and sum2) then '합격'
                          when gubu = 'Y' then '합격' else '불합격' end as pass_result_nm
                    ,case when (total_score between sum1 and sum2) then 'Y'
                          when gubu = 'Y' then 'Y' else 'N' end as pass_result_cd
                    , u.name, u.id, c.comn_nm
                from
                (
                    select university, rcrtmunit, rmk, sum(s_score) as total_score, min(cast(sum1 as numeric)) as sum1, min(case when inenglish is not null then cast(inenglish as numeric) else cast(sum2 as numeric) end) as sum2
                    , max(case when essential is not null and essential like '%'|| subject ||'%' then 'Y'
                            when subject = '8' and andenglish is not null and cast(andenglish as numeric) < s_score then 'Y'
                            when inenglish is not null and subject = '8' then 'Y'
                            when essential is null and andenglish is null and inenglish is null then 'Y'
                            else 'N' end) as gubu
                    from res4
                    where rrank <= cast(ccou as numeric)
                    and ccou is not null
                    group by university, rcrtmunit, rmk
                    union all
                    select university, rcrtmunit, rmk, s_score as total_score, 0 as sum1, cast(orenglish as numeric) as sum2, 'Y' as gubu
                    from res4
                    where subject = '8'
                    and orenglish is not null
                    and not exists (
                        select 'X' from (
                            select university, rcrtmunit, rmk, sum(s_score) as total_score, min(cast(sum1 as numeric)) as sum1, min(case when inenglish is not null then cast(inenglish as numeric) else cast(sum2 as numeric) end) as sum2
                            , max(case when essential is not null and essential like '%'|| subject ||'%' then 'Y'
                                       when subject = '8' and andenglish is not null and cast(andenglish as numeric) < s_score then 'Y'
                                       when inenglish is not null and subject = '8' then 'Y'
                                       when essential is null and andenglish is null and inenglish is null then 'Y'
                                       else 'N' end) as gubu
                            from res4
                            where rrank <= cast(ccou as numeric)
                            and ccou is not null
                            group by university, rcrtmunit, rmk) as bb
                            )
                ) as a
                , universities u
                , commoncode c
                where cast(a.university as numeric) = u.id
                and c.comn_grp_cd = 'E00001'
                and c.useyn = 'Y'
                and c.comn_cd = a.rcrtmunit
                and (((coalesce($11, '1') = '1') and 1=1) or ((coalesce($11, '1') != '1') and cast(a.university as varchar) in (select unnest(string_to_array($11, '|')))  ))

                union all
               select rcrtmunit, e.rmk, '합격' as pass_result_nm, 'Y' as pass_result_cd,
               		u.name, cast(e.university as numeric), c.comn_nm
               from essayrecruitment e
               		,universities u
               		,commoncode c
               where e.division = $10
               and e.useyn = 'Y'
               and cast(e.university as numeric) = u.id
               and c.comn_grp_cd = 'E00001'
               and c.useyn = 'Y'
               and c.comn_cd = e.rcrtmunit
               and e.rmk = '-'
               and (((coalesce($11, '1') = '1') and 1=1) or ((coalesce($11, '1') != '1') and cast(e.university as varchar) in (select unnest(string_to_array($11, '|')))  ))
               order by id, rcrtmunit--, useyn
                ;
                `,
        [kor, eng, mat1, mat2, soc1, soc2, sci1, sci2, khistory, str_division, str_univers],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.status(200).json({success: false, msg: 'No data', data: null});
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
