import pool from '../../../lib/pool';

/*
    - title:
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id, account from members where account = $1`, [
    req.headers.auth,
  ]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization2', data: null});
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method == 'POST') {
    for (var i = 0; i < req.body.data.length; i++) {
      //한번에 입력
      await pool.query(
        `update csatuscore
                           set score = cast($5 as varchar)
                           where accountid = $1
                           and score_convert_a = $2
                           and score_convert_b = $3
                           and useyn = 'Y'
                           and year = cast($4 as numeric) ;`,
        [
          req.headers.auth,
          req.body.data[i].score_convert_a,
          req.body.data[i].score_convert_b,
          req.body.data[i].year,
          req.body.data[i].score,
        ],
      );
    }
  }

  res.json({success: true, msg: 'success2'});
  res.statusCode = 200;
  res.end();
};
