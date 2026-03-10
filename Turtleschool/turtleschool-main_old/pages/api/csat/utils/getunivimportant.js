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
  let s_mapping_cd = req.query.mapping_cd;
  let s_univ_sub_code = req.query.univ_sub_code;

  switch (req.method) {
    case 'GET':
      const sql = `
          select importance
          from ontimeunivsubcalculatemapping calm, ontimeunivlinecut cut, ontime_univ_importance imp
          where calm.univ_sub_name = cut.univ_line_title_b
          and imp.univ_nm = cut.univ_title_a
          and imp.major_nm = cut.major_nm
          and mapping_cd = $1
          and univ_sub_code = $2;
                `
      const query = [s_mapping_cd, s_univ_sub_code]

      console.log("execute query. sql:",sql,"query:",query)
      rows = await pool.query(sql, query);

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
