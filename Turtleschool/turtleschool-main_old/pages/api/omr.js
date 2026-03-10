import pool from '../../lib/pool';

export default async (req, res) => {
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = -1;
  // let type = null;
  let ans = {};
  if (req.method == 'GET') {
    let dat =
      await pool.query(`select "subjectArea" , "subjectCode" , "typeId" , difficulty , kind , "number" ,
 score , "questionNumber" , one, two , three , four , five, minorkind
  from omr_scores as o left join (select major, minor, code from kind) as e on e.code = o.kind`);
    data = dat.rows;
    success = true;
    data.map(e => {
      let a = false;
      while (!a) {
        if (ans[e.subjectArea]) {
          if (ans[e.subjectArea][e.subjectCode]) {
            if (ans[e.subjectArea][e.subjectCode][e.typeId]) {
              ans[e.subjectArea][e.subjectCode][e.typeId][e.questionNumber - 1] = [
                e.number,
                e.score,
                e.difficulty,
                e.kind,
                e.major,
                e.minor,
              ];
              a = true;
            } else {
              ans[e.subjectArea][e.subjectCode][e.typeId] = [];
            }
          } else {
            ans[e.subjectArea][e.subjectCode] = {};
          }
        } else {
          ans[e.subjectArea] = {};
        }
      }
    });
    // const arr = [1, 2];
  } else {
    const {subjectArea, subjectCode, type, data} = req.body;

    data.map(async (e, i) => {
      if (e[0] == '') e[0] = null;
      if (e[1] == '') e[1] = null;

      await pool.query(
        `insert into omr_scores
								values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
								on conflict ("subjectArea", "subjectCode", "typeId", "questionNumber")
								do update set
								number = $6,
								score = $7,
								difficulty = $4,
								kind = $5,
								minorkind = $9;
								`,
        [subjectArea, subjectCode, type, e[2], e[3], e[0], e[1], i + 1, e[4]],
      );
    });
    success = true;
  }
  if (success) {
    statusCode = 200;
    msg = 'success';
  }

  res.json({success: success, msg: msg, data: ans});
  res.statusCode = statusCode;
  res.end();
};
