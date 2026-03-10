import pool from '../../../../lib/pool';

/*
    - title: 지역, 문이과, 모집군으로 대학 조회하기
    - params:
        지역, 문이과, 모집군
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
    case 'POST':
      const {recruitYear} = {recruitYear: process.env.RECRUIT_YEAR};
      const {areaCode, lineCode, groupCode} = req.body.search;

      if (areaCode == undefined && lineCode == undefined) {
        data = await pool.query(
          `
    select	e."universityId"
        ,	u."name" as "universityName"
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
    where	e."isUse" = true
    and		e."recruitYear" = $1
    and		e."groupCode" = $2
    group by e."universityId"
        ,	u."name"
    order by u."name" asc
                `,
          [recruitYear, groupCode],
        );
      } else if (areaCode && !lineCode) {
        data = await pool.query(
          `
    select	e."universityId"
        ,	u."name" as "universityName"
		,	max(u."max") as "max"
		,	min(u."min") as "min"
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
    where	e."isUse" = true
    and		e."recruitYear" = $1
    and		e."areaCode" = $2
    and		e."groupCode" = $3
    group by e."universityId"
        ,	u."name"
    order by u."name" asc
                `,
          [recruitYear, areaCode, groupCode],
        );
      } else {
        data = await pool.query(
          `
    select	e."universityId"
        ,	u."name" as "universityName"
		,	max(u."max") as "max"
		,	min(u."min") as "min"
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
    where	e."isUse" = true
    and		e."recruitYear" = $1
    and		e."areaCode" = $2
    and		e."lineCode" = $3
    and		e."groupCode" = $4
    group by e."universityId"
        ,	u."name"
    order by u."name" asc
                `,
          [recruitYear, areaCode, lineCode, groupCode],
        );
      }

      success = true;
      data = data.rows;
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
