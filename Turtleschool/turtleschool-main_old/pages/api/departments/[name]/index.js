import pool from '../../../../lib/pool';

/*
    - title: 학부명으로 학부명 목록 조회하기
    - params:
        학부명
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
      const {year} = {year: 2020};

      let {rows} = await pool.query(
        `
    select	d."name" as "departmentName" 
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
            inner join departments as d
            on e."departmentId" = d."id"
    where	e."isUse" = true 
    and		e."recruitYear" = $1
    and		d."name" like '%' || $2 || '%'
    group by d."name"
    order by d."name" asc
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
