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
  let s_subject = req.query.subject;
  let s_score = req.query.score;
  let s_common_score = req.query.common_score;

  const sql = `
                            with div1 as (
                              select subject, standard_score, percentage_score, rating_score, cumulative from csatsspu
                                 where subject = $2
                                   and division = $5
                                   and year = $1
                                   and original_score_a = $3
                                   and original_score_b = $4
                                   and use_yn = 'Y'
                            )
                            select
                               score.subject as subject_cd,
                               (select c.title_c from codes c where c.code = score.subject and "groupId" = 14 ) as subject_nm,
                               score.standard_score as standard_score,
                               score.percentage_score as percentage_score,
                               score.rating_score as rating_score,
                               score.cumulative as cumulative
                            from div1 score;
                              `;
  const sql_params = [s_year, s_subject, s_score, s_common_score, s_division]
  switch (req.method) {
    case 'GET':
      rows = await pool.query(sql
        ,sql_params
      );

      console.log("orgscoretocalculatedscore sql:",sql)
      console.log("orgscoretocalculatedscore sql params:",sql_params)

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
