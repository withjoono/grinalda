import pool from '../../../lib/pool';

/*
    - title: 대학검색
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
  let s_universitynm = req.query.universitynm;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

                select id as universityid,
                     name as universitynm,
                     description,
                     "areaCode" as areaCode
                from universities u
                where name like '%' || coalesce($1, '') || '%'
                and csat_yn = 'Y'
                ;
                `,
        [s_universitynm],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.status(406).json({success: false, msg: 'No data', data: null});
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
