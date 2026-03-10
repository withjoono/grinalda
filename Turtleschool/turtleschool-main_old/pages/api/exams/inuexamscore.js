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
               select u.universityid
               	,u2."name" as universitynm
               	,u.departmentid
               	,d."name" as departmentnm
               	,u.origin_cut_a
                ,u.percentage_cut_a
                ,u.standard_cut_a
                ,u.grade_cut_a
                ,u.origin_cut_b
                ,u.percentage_cut_b
                ,u.standard_cut_b
                ,u.grade_cut_b
               	,(select sum(case when "subjectArea" in ('60','70','10','20') and "subjectCode" != '1G'
               					  then coalesce("originScore", 0)
               					  else 0 end) as originalscore
               		from exams e
               		where "memberId" = $1
               		and "typeId" = $2
               		and "isFrequent" = true
               	) as originalscore
               from uniexamcut u
               	,universities u2
               	,departments d
               where u.universityid = u2.id
               and u.departmentid = d.id
               and u2."name" like '%' || coalesce($3, '') ||'%'
               and d."name" like '%' || coalesce($4, '') ||'%'
               ;
               `,
        [rows[0].id, req.query.typeid, req.query.universitynm, req.query.departmentnm],
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
