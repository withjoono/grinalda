import pool from '../../../../lib/pool';

/**
  *  사용자의 저장된 과목코드, 과목명 조회(GET)
  */
export default async (req, res) => {

  // 로그인 사용자 인증
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
  let s_year = req.query.year;
  let s_occasional_id = req.query.occasional_id;

  switch (req.method) {
    case 'DELETE':
      rows = await pool.query(
        `
        delete from occasional_personal
        where member_id = $1
        and occasional_id = $2
                `,
        [req.headers.auth, s_occasional_id],
      );
      console.log("rows", rows)
      if (rows.rowCount == undefined || rows.rowCount < 1) {
        res.json({success: false, msg: 'No data', data: null});
        res.statusCode = 406;
        res.end();
        return;
      }
      console.log("data", data)
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
