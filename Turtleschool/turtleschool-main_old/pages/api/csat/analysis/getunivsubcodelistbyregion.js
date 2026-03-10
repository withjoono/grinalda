import pool from '../../../../lib/pool';

/*
    - title:
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

  let s_area_cd = req.query.area_cd;
  let s_major_line_cd = req.query.major_line_cd;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `
           select univ_sub_code from ontimeunivmajor where univ_id in (
           select text(id) from universities
           where "areaCode" = $1
           )
           and major_line_cd = $2
           group by univ_sub_code
               `,
        [
          s_area_cd,
          s_major_line_cd
        ],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.json({success: false, msg: 'No data', data: null});
        res.statusCode = 406;
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
