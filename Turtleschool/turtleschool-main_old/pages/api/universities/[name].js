import pool from '../../../lib/pool';

/*
    - title: 대학명으로 대학 조회하기
    - params:
        학교명
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  //   let memberId = rows[0].id;
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = {};

  switch (req.method) {
    case 'GET':
      const {year} = {year: process.env.RECRUIT_YEAR};

      let {rows} = await pool.query(
        `
    select	e."universityId"
        ,	u."name" as "universityName"
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
    where	e."isUse" = true
    and		e."recruitYear" = $1
    and		u."name" like '%' || $2 || '%'
    group by e."universityId"
        ,	u."name"
    order by u."name" asc
            `,
        [year, req.query.name],
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
