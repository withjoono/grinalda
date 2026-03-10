import pool from '../../../../lib/pool';

/*
    - title: 대학의 순번으로 해당 대학의 학부 조회하기
    - params:
        학교 아이디
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
  let data = {};
  switch (req.method) {
    case 'GET':
      const {recruitYear, universityId} = {
        recruitYear: process.env.RECRUIT_YEAR,
        universityId: req.query.universityId,
      };
      const {lineCode, groupCode} = req.query;

      if (lineCode && groupCode) {
        let {rows} = await pool.query(
          `
		select	e."departmentId"
			,	d."name" as "departmentName"
		from	entrances as e
				inner join universities as u
				on e."universityId" = u."id"
				inner join departments as d
				on e."departmentId" = d."id"
		where	e."isUse" = true 
		and		e."recruitYear" = $1
		and		e."universityId" = $2
		and 	e."lineCode" = $3
		and 	e."groupCode" = $4
		group by e."departmentId"
			,	d."name"
		order by d."name" asc
				`,
          [recruitYear, universityId, lineCode, groupCode],
        );
        success = true;
        data = rows;
      } else if (groupCode) {
        let {rows} = await pool.query(
          `
		select	e."departmentId"
			,	d."name" as "departmentName"
		from	entrances as e
				inner join universities as u
				on e."universityId" = u."id"
				inner join departments as d
				on e."departmentId" = d."id"
		where	e."isUse" = true 
		and		e."recruitYear" = $1
		and		e."universityId" = $2
		and		e."groupCode" = $3
		group by e."departmentId"
			,	d."name"
		order by d."name" asc
				`,
          [recruitYear, universityId, groupCode],
        );
        success = true;
        data = rows;
      } else {
        let {rows} = await pool.query(
          `
		select	e."departmentId"
			,	d."name" as "departmentName"
		from	entrances as e
				inner join universities as u
				on e."universityId" = u."id"
				inner join departments as d
				on e."departmentId" = d."id"
		where	e."isUse" = true 
		and		e."recruitYear" = $1
		and		e."universityId" = $2
		group by e."departmentId"
			,	d."name"
		order by d."name" asc
				`,
          [recruitYear, universityId],
        );
        success = true;
        data = rows;
      }
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
