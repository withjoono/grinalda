import pool from '../../../lib/pool';

/*
    - title: 과목검색
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  /*
  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }
  */
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];
  let s_comn_grp_cd = '14';
  let s_code = req.query.code;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

              select case when substring(code, 1, 1) = '6' then '국어'
                         when substring(code, 1, 1) = '7' then '수학'
                         when substring(code, 1, 1) = '8' then '영어'
                         when substring(code, 1, 1) = '9' then '제2외국어'
                         when substring(code, 1, 1) = '1' then '사회탐구'
                         when substring(code, 1, 1) = '2' then '과학탐구'
                         else '' end as lar_subject_nm,
                         substring(code, 1, 1) as lar_subject_cd,
                         c.code as code_cd,
                         c.description as code_nm
                from codes c
                where "groupId" = $1
                and csat_yn = 'Y'
                and c.code not in ('60','70')
                and (((coalesce ($2, '1') ='1') and 1=1) or
                     ((coalesce ($2, '1')!='1') and (substring(code, 1, 1) = coalesce($2, '') )))
                order by code asc
                ;
                `,
        [s_comn_grp_cd, s_code],
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
