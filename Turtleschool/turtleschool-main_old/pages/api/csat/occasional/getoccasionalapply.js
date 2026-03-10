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

  switch (req.method) {
    case 'GET':
      const sql = `
          with my_score as (
                select tit.upper_subject_cd
                  from csatidscore sco, subjecttitle tit
                 where text(sco.memberId) = text($1)
                   and sco.subject_a = tit.subject_cd
                 group by tit.upper_subject_cd
            )
            select
              occasional_id,
              univ."id" as univ_id,
              univ."name" as univ_nm,
              recruit_contents_a as recruit_contents,
              recruit_type,
              major_convert_nm as major_nm,
              (select case when upper_subject_cd = '1' then '10'
                           when upper_subject_cd = '2' then '20' else '00' end
                 from my_score where upper_subject_cd in ('1','2')
              ) as major_line_cd
             from occasional o, "convertUniName" co, universities univ
            where o.univ_nm = co."이투스"
              and co."변환" = univ."name"
              and occasional_id in (
                select cast(occasional_id as numeric) from occasional_personal
                where member_id = $1
              )
                `
      const query = [req.headers.auth]

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
