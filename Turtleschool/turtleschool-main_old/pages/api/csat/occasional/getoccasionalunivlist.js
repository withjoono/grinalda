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
  let s_univ_nm = req.query.univ_nm?.split(',');
  let s_recruit_contents_a = req.query.recruit_contents?.split(',');
  let s_recruit_type = req.query.recruit_type?.split(',');


  let sql =
          `
            select
              occasional_id,
              univ."id" as univ_id,
              univ."name" as univ_nm,
              recruit_contents_a as recruit_contents,
              recruit_type,
              major_nm
             from occasional o, "convertUniName" co, universities univ
            where o.univ_nm = co."이투스"
              and co."변환" = univ."name"   `

          if(s_univ_nm != null) {
            sql += `
              and univ.name = Any($1)
            `
          }
          if(s_recruit_contents_a != null) {
            sql += `
                and recruit_contents_a = Any($2)
            `
          }
          if(s_recruit_type != null) {
            sql += `
              and recruit_type = Any($3)
            `
          }
          sql += `;`


          let sql_params = []
          if(s_univ_nm != null) {
            sql_params.push(s_univ_nm)
          }
          if(s_recruit_contents_a != null) {
            sql_params.push(s_recruit_contents_a)
          }
          if(s_recruit_type != null) {
            sql_params.push(s_recruit_type)
          }

  switch (req.method) {
    case 'GET':
      rows = await pool.query(sql, sql_params);
      console.log("sql: " + sql)
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
