import pool from '../../../lib/pool';

/*
    - title:관심대학 설정
    - params:
*/
export default async (req, res) => {
  let rows = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.status(406).json({success: false, msg: 'No authorization', data: null});
    res.end();
    return;
  }

  if (req.method == 'POST') {
    for (var i = 0; i < req.body.data.length; i++) {
      //한번에 입력

      await pool.query(
        `
                  delete from csatinteruniv
        				  where accountid = $1
        				  and universityid = $2
        				  and department = $3
        				  and "year" = cast($4 as varchar)
        				  and useyn = 'Y')
                          `,
        [
          req.headers.auth,
          req.body.data[i].universityid,
          req.body.data[i].department,
          req.body.data[i].year,
        ],
      );
    }

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};
