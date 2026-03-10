import pool from '../../../lib/pool';

/*
    - title: 전형으로 대학, 학부 조회하기
    - params:
        전형
		문과/이과
		지역
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let memberId = rows[0].id;
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = {};

  switch (req.method) {
    case 'GET':
      const {year} = {year: process.env.RECRUIT_YEAR};
      const {type, lineCode, areaCode} = req.query;
      let {rows} = await pool.query(
        `
    select	e."universityId"
        ,	u."name" as "universityName"
        ,	e."departmentId"
        ,	d."name" as "departmentName" 
		,	e."admissionId"
		,	a."minortype" as "admissionName"
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
            inner join departments as d
            on e."departmentId" = d."id"
			inner join admission as a
			on e."admissionId" = a."id"
    where	e."recruitYear" = $1
    and		a."majortype" like '%' || $2 || '%'
	and		e."lineCode" = $3
	and		e."areaCode" = $4
    group by e."universityId"
        ,	u."name"
        ,	e."departmentId"
        ,	d."name"
		,	e."admissionId"
		,	a."minortype"
    order by u."name" asc, d."name" asc, a."minortype" asc
            `,
        [year, type, lineCode, areaCode],
      );
      success = true;
      data = rows;
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
