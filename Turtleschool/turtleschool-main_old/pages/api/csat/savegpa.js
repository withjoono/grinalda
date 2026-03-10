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
    //await pool.query(`delete from csatgpa where accountid = $1`,[req.headers.auth])

    for (var i = 0; i < req.body.data.length; i++) {
      //한번에 입력

      //values ($1, $2, $3, $4, $5, $6, $7)
      await pool.query(
        `insert into csatgpa (grade, semester, subjectarea, subjectcode, unit, rank, accountid)
    								        select cast($1 as numeric), cast($2 as numeric), cast($3 as varchar), cast($4 as varchar), cast($5 as varchar), cast($6 as numeric), cast($7 as numeric)
														where not exists (select 'X' from csatgpa z
																							where z.accountid = $7
																						  and z.grade = $1
																						  and z.semester = $2
																						  and z.subjectcode = $4) ;`,
        [
          req.body.data[i].grade,
          req.body.data[i].semester,
          req.body.data[i].subjectarea,
          req.body.data[i].subjectcode,
          req.body.data[i].unit,
          req.body.data[i].rank,
          req.headers.auth,
        ],
      );
    }
  }

  res.json({success: true, msg: 'success2'});
  res.statusCode = 200;
  res.end();
};
