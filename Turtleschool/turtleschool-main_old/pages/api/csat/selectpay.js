import pool from '../../../lib/pool';

/*
    - title: 결제여부 조회
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
  let s_typesid = req.query.typesid;
  let s_id = rows[0].id;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

              select case when count(*) > 0 then 'Y' else 'N' end as pay_yn
              from payments p
              where accountid = $1
              and typesid = $2
              and to_char(current_date, 'yyyy-MM-dd') between to_char(time, 'yyyy-MM-dd') and to_char(time + '6 month', 'yyyy-MM-dd')
              ;
                `,
        [s_id, s_typesid],
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
