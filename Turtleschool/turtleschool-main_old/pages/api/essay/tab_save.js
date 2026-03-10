import pool from '../../../lib/pool';

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

  if (req.method == 'POST') {
    //1.저장전에 삭제
    await pool.query(`delete from essayuser where id = $1`, [req.headers.auth]);

    //2.삭제후 저장
    for (var i = 0; i < req.body.data.length; i++) {
      await pool.query(
        `

          insert into essayuser
  				(
             id ,
             division ,
             universityid ,
             departmentid ,
             rcrtmunitid ,--5
             essaya ,
             essayb ,
             essayc ,
             recruits ,
             recruitdate ,--10
             rmk ,
             rmka ,
             useyn ,
             fsrdtm ,
             lshdtm--15
          )
          values
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10,
            $11,
            $12,
            'Y',
            current_date,
            current_date
          )
				`,
        [
          req.headers.auth,
          req.body.data[i].division,
          req.body.data[i].universityid,
          req.body.data[i].departmentid,
          req.body.data[i].rcrtmunitid,
          req.body.data[i].essaya,
          req.body.data[i].essayb,
          req.body.data[i].essayc,
          req.body.data[i].recruits,
          req.body.data[i].recruitdate,
          req.body.data[i].rmk,
          req.body.data[i].rmk1,
        ],
      );
    }

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};
