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
  let s_division = req.query.division;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `
          select
            score.subject_a as subject_cd,
            (select
                c.title_c
               from codes c
              where c.code = score.subject_a
                and "groupId" = 14
            ) as subject_nm from csatidscore score
             where memberid = $1
               and useyn = 'Y'
               and division = $2
               and year = $3;
                `,
        [req.headers.auth, s_division, s_year],
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
