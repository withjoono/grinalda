import pool from '../../../lib/pool';

/*
    - title: 내신성적관리 > 교과분석 > 내신평균 > 진로선택
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

  switch (req.method) {
    case 'GET':
    case 'POST':
      await pool.query(
        `
          delete from examsinu
          where membersid = $1
        ;
				`,
        [rows[0].id],
      );

      await pool.query(
        `
          insert into examsinu
          (membersid, universityid, departmentid)
          values
          ($1, $2, $3)
          ;
          `,
        [rows[0].id, req.body.universityid, req.body.departmentid],
      );

    default:
      break;
  }

  res.json({success: true, msg: 'success2'});
  res.statusCode = 200;
  res.end();
};
