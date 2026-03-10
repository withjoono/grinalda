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

  let s_univ_sub_codes = req.query.univ_sub_codes?.split(',');
  let s_major_line_cd = req.query.major_line_cd

  const sql=`
        select
            univ_sub_code,
            cumulative,
            conversion_score,
            (case when '10' = $2 then cumulative_mungua
                        when '20' = $2 then cumulative_leegua else '100.0' end) as standard_sum_cumulative,
            (case when '10' = $2 then standard_sum_mungua
            when '20' = $2 then standard_sum_leegua else '0' end) as standard_sum
        from ontime_convert_cumulative
        where univ_sub_code = any($1)
        order by conversion_score desc
                     `
  const sql_param = [
                              s_univ_sub_codes,
                              s_major_line_cd
                            ]
  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(sql, sql_param);
      console.log('getcumulativebyunivsubcode sql: ',sql)
      console.log('getcumulativebyunivsubcode sql_param:',sql_param)
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
