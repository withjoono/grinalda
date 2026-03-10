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
               with res as (
				select
                    ce.id as typeid,
                    ce.type as typenm,
                    ce.grade ,
                    ce.sort,
                    ce.year,
                    ce."month" ,
                    --case when 1=1 then
                    e."subjectArea" ,
                    e."subjectCode" ,
                    sum(e."originScore") as s_originscore,
                    sum(e."standardScore") as s_standardscore,
                    sum(e."percentScore") as s_percentscore,
                    sum(e.grade) as s_grade,
                    sum(e.accumulate) as s_accumulate
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
                GROUP by ROLLUP (ce.id, ce.type, ce.grade, ce.sort, ce.year, ce."month", e."subjectArea", e."subjectCode")
                )
                select a.typeid,
                	   a.typenm,
                	   a.grade,
                	   a.year,
                	   a.month,
                	   a."subjectArea",
                	   a."subjectCode",
                	   a.s_originscore,
                	   a.s_standardscore,
                	   a.s_percentscore,
                	   a.s_grade,
                	   a.s_accumulate,
                	   e3.universityid,
                	   e3.departmentid,
                	   e3.origin_cut_a,
                	   e3.percentage_cut_a,
                	   e3.standard_cut_a,
                	   e3.grade_cut_a,
                	   e3.origin_cut_b,
                	   e3.percentage_cut_b,
                	   e3.standard_cut_b,
                	   e3.grade_cut_b,
                	   case when a."subjectArea" is null and e3.origin_cut_a is not null then coalesce(a.s_originscore, 0) - coalesce(e3.origin_cut_a, 0) else null end as cut_origin_score_a,
                	   case when a."subjectArea" is null and e3.standard_cut_a is not null then coalesce(a.s_standardscore, 0) - coalesce(e3.standard_cut_a, 0) else null end as cut_standard_score_a,
                	   case when a."subjectArea" is null and e3.percentage_cut_a is not null then coalesce(a.s_percentscore, 0) - coalesce(e3.percentage_cut_a, 0) else null end as cut_percent_score_a,
                	   case when a."subjectArea" is null and e3.grade_cut_a is not null then coalesce(a.s_grade, 0) - coalesce(e3.grade_cut_a, 0) else null end as cut_grade_score_a,
                	   case when a."subjectArea" is null and e3.origin_cut_b is not null then coalesce(a.s_originscore, 0) - coalesce(e3.origin_cut_b, 0) else null end as cut_origin_score_b,
                	   case when a."subjectArea" is null and e3.standard_cut_b is not null then coalesce(a.s_standardscore, 0) - coalesce(e3.standard_cut_b, 0) else null end as cut_standard_score_b,
                	   case when a."subjectArea" is null and e3.percentage_cut_b is not null then coalesce(a.s_percentscore, 0) - coalesce(e3.percentage_cut_b, 0) else null end as cut_percent_score_b,
                	   case when a."subjectArea" is null and e3.grade_cut_b is not null then coalesce(a.s_grade, 0) - coalesce(e3.grade_cut_b, 0) else null end as cut_grade_score_b,
                	   c."name" as subjectareanm, d."name" as subjectcodenm, c.sort
                from res a
                left outer join codes c on c."groupId" = '13' and a."subjectArea" = c.code
                left outer join codes d on d."groupId" = '14' and a."subjectCode" = d.code
                left outer join (select e2.membersid, e2.universityid, e2.departmentid,
                						u.origin_cut_a, u.percentage_cut_a, u.standard_cut_a, u.grade_cut_a,
                    					u.origin_cut_b, u.percentage_cut_b, u.standard_cut_b, u.grade_cut_b
                				 from examsinu e2
                				 	,uniexamcut u
                				 where e2.membersid = $1
                				 and e2.universityid = u.universityid
                				 and e2.departmentid = u.departmentid
                				) e3 on 1=1
                where a.month is not null
				        order by typeid, c.sort, a."subjectCode"
                ;
               `,
        [rows[0].id, req.query.typeid, req.query.grade, req.query.year],
      );

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
