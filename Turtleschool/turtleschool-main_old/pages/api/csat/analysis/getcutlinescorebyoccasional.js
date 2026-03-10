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

  let s_univ_nm = req.query.univ_nm;
  let s_major_line_cd = req.query.major_line_cd;
  let s_major_nm = req.query.major_nm;


  const sql=`
                 select
                    maj.univ_sub_code,
                    maj.univ_id,
                    maj.univ_nm,
                    maj.depart_id,
                    maj.depart_nm,
                    maj.select_line_cd,
                    maj.line_cd,
                    maj.cut_70_first,
                    maj.cut_95_add,
                    maj.cut_70_topaccu,
                    maj.cut_95_topaccu,
                    rec.recruit_person
                 from ontimeunivmajor maj,
                 (select etoos_univ_nm, univ_name from vw_univ_convert_etoos) etoos,
                 ontimerecruit rec
                 where etoos.univ_name = maj.univ_nm
                 and etoos.etoos_univ_nm = rec.univ_nm
                 and maj.depart_nm = rec.major_nm
                 and maj.line_nm = rec.major_line_nm
                 and maj.gun = rec.gun_nm
                 and maj.univ_nm = $1
                 and maj.major_line_cd = $2
                 and maj.depart_nm = $3
                     `
  const sql_param = [
                              s_univ_nm,
                              s_major_line_cd,
                              s_major_nm
                            ]
  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(sql, sql_param);
      console.log('getcutlinescorebyuniv sql: ',sql)
      console.log('getcutlinescorebyuniv sql_param:',sql_param)
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
