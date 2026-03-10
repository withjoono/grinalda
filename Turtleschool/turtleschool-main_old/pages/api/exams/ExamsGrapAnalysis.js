import pool from '../../../lib/pool';

/*
    - title: 내신 성적관리 > 내신성적분석 > 내신 성적변동분석
    - params:

*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `
               select
                    ce.id as typeid,
                    ce.type as typenm,
                    ce.grade ,
                    ce.sort,
                    --표준점수
                  sum(case when "subjectArea" = '60' then "standardScore" else 0 end) as kor_standard_score,
                  sum(case when "subjectArea" = '70' then "standardScore" else 0 end) as mat_standard_score,
                  sum(case when "subjectArea" = '80' then "standardScore" else 0 end) as eng_standard_score,
                  sum(case when "subjectArea" in ('10', '20') and "subjectCode" != '1G' then "standardScore" else 0 end) as exp_standard_score,
                  --원점수
                  sum(case when "subjectArea" = '60' then "originScore" else 0 end) as kor_origin_score,
                  sum(case when "subjectArea" = '70' then "originScore" else 0 end) as mat_origin_score,
                  sum(case when "subjectArea" = '80' then "originScore" else 0 end) as eng_origin_score,
                  sum(case when "subjectArea" in ('10', '20') and "subjectCode" != '1G' then "originScore" else 0 end) as exp_origin_score,
                  --백분위
                  round(avg(case when "subjectArea" = '60' then "percentScore" else 0 end), 2) as kor_percent_score,
                  round(avg(case when "subjectArea" = '70' then "percentScore" else 0 end), 2) as mat_percent_score,
                  round(avg(case when "subjectArea" = '80' then "percentScore" else 0 end), 2) as eng_percent_score,
                  round(avg(case when "subjectArea" in ('10', '20') and "subjectCode" != '1G' then "percentScore" else 0 end), 2) as exp_percent_score,
                  --등급
                  round(avg(case when "subjectArea" = '60' then e.grade else 0 end), 2) as kor_grade,
                  round(avg(case when "subjectArea" = '70' then e.grade else 0 end), 2) as mat_grade,
                  round(avg(case when "subjectArea" = '80' then e.grade else 0 end), 2) as eng_grade,
                  round(avg(case when "subjectArea" in ('10', '20') and "subjectCode" != '1G' then e.grade else 0 end), 2) as exp_grade,
                  --국수탐
                  sum(case when "subjectArea" in ('60','70','10','20') and "subjectCode" != '1G'
                       then "standardScore" else 0 end) as kme_standard_score,
                  sum(case when "subjectArea" in ('60','70','10','20') and "subjectCode" != '1G'
                       then "originScore" else 0 end) as kme_origin_score,
                  round(avg(case when "subjectArea" in ('60','70','10','20') and "subjectCode" != '1G'
                       then "percentScore" else 0 end), 2) as kme_percent_score,
                  round(avg(case when "subjectArea" in ('60','70','10','20') and "subjectCode" != '1G'
                       then e.grade else 0 end), 2) as kme_grade,
                  --국수탐영
                  sum(case when "subjectArea" in ('60','70','80','10','20') and "subjectCode" != '1G'
                       then "standardScore" else 0 end) as kmee_standard_score,
                  sum(case when "subjectArea" in ('60','70','80','10','20') and "subjectCode" != '1G'
                       then "originScore" else 0 end) as kmee_origin_score,
                  round(avg(case when "subjectArea" in ('60','70','80','10','20') and "subjectCode" != '1G'
                       then "percentScore" else 0 end), 2) as kmee_percent_score,
                  round(avg(case when "subjectArea" in ('60','70','80','10','20') and "subjectCode" != '1G'
                       then e.grade else 0 end), 2) as kmee_grade
                from "codeExams" ce
                left outer join exams e on ce.id = e."typeId" and e."memberId" = $1
                where 1=1
                and "isFrequent" = true
                and (((coalesce($3, '*'))  = '*' and (1=1)) or
                     ((coalesce($3, '*')) != '*' and (ce.grade = $3)))
                and (((coalesce($4, '*'))  = '*' and (1=1)) or
                     ((coalesce($4, '*')) != '*' and (ce."year" = $4)))
                and (((coalesce($2, '*'))  = '*' and (1=1)) or
                     ((coalesce($2, '*')) != '*' and (e."typeId" = $2)))
                group by ce.id, ce.grade, ce."type"
                order by sort asc
                ;
               `,
        [rows[0].id, req.query.typeid, req.query.grade, req.query.year],
      );
      /*
union all
select '999999' as typeid
,u2."name" as typenm
,null as grade
,'999999' as sort
,null as kor_standard_score
,null as mat_standard_score
,null as eng_standard_score
,null as exp_standard_score
,null as kor_origin_score
,null as mat_origin_Score
,null as eng_origin_score
,null as exp_origin_score
,null as kor_percent_score
,null as mat_percent_Score
,null as eng_percent_score
,null as exp_percent_score
,null as kor_grade_score
,null as mat_grade_Score
,null as eng_grade_score
,null as exp_grade_score
,u.standard_cut_a
,u.origin_cut_a
,u.percentage_cut_a
,u.grade_cut_a
,u.standard_cut_b
,u.origin_cut_b
,u.percentage_cut_b
,u.grade_cut_b
from examsinu e
,uniexamcut u
,universities u2
where e.universityid = u.universityid
and e.departmentid = u.departmentid
and e.membersid = $1
and e.universityid = u2.id
*/
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
};
