import pool from '../../../../lib/pool';

/**
  *  사용자가 입력한 내용과 계산된 표준편차,백분율 등을 저장(POST)
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

  let s_year = req.body.data.year;
  let s_division = req.body.data.division;
  let save_scores = req.body.data.data;

  const insertQuery =
      `
           insert into csatidscore(
              memberid,
              year,
              division,
              useyn,
              subject_a,
              score_a,
              subject_b,
              score_b,
              standardscore,
              percentage,
              grade,
              cumulative
              ) values (
            $1, $2, $3, 'Y', $4, $5, $6, $7, $8, $9, $10, $11
           );
              `;

  const deleteQuery =
        `
             delete from csatidscore
             where memberId = $1
               and year = $2
               and division = $3;
                `;
  if (req.method == 'POST') {
      pool.connect((err, client, done) => {
        const shouldAbort = err => {
            if (err) {
                console.error('Error in transaction', err.stack)
                client.query('ROLLBACK', err => {
                    if (err) {
                        console.error('Error rolling back client', err.stack)
                        res.status(200).json({success: false});
                        res.end();
                    }
                    // release the client back to the pool
                    done()
                })
                res.status(200).json({success: false});
                res.end();
            }
            return !!err
        }

        client.query('BEGIN', err => {
            if (shouldAbort(err)) return

            client.query(deleteQuery, [
                req.headers.auth,
                s_year,
                s_division
            ], (err, res) => {
                if (shouldAbort(err)) return
            })
            save_scores.forEach((elem,index) => {
                Object.keys(elem).forEach((key) => {
                    if(elem[key] == '') {
                        elem[key] = null
                    }
                })
                if(elem != 'undefined') {
                    client.query(insertQuery, [
                        req.headers.auth,
                        s_year,
                        s_division,
                        elem.subject,
                        elem.org_score,
                        elem.common_subject,
                        elem.common_score,
                        elem.standard_score,
                        elem.percentage_score,
                        elem.rating_score,
                        elem.cumulative
                    ], (err, res) => {
                        if (shouldAbort(err)) return
                    })
                }
            });

            client.query('COMMIT', err => {
                if (err) {
                    console.error('Error committing transaction', err.stack)
                    res.status(200).json({success: false});
                    res.end();
                }
                console.log("success..")
                done()
                res.status(200).json({success: true});
                res.end();
            })
        })
      })
  }
};
