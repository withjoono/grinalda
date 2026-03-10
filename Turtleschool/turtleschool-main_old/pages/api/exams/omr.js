import pool from '../../../lib/pool';

export default async (req, res) => {
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = -1;
  let type = null;
  let ans = {};

  switch (req.method) {
    case 'GET':
      let dat = await pool.query(
        `select o."subjectArea" , o."subjectCode" , o.difficulty , o.kind ,
                                  			   o."number" , o.score , o."questionNumber",
                                  			   o.one, o.two, o.three, o.four, o.five,
                                  			   e.major, e.minor, e.code
                                    from omr_scores o
                                    left outer join kind e on e.code = o.kind
                                    where o."typeId" = $1
                                    and o."subjectCode" = $2
                                    order by o."questionNumber"`,
        [req.query.typeid, req.query.subjectcode],
      );
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
      const arr = [1, 2];
  }

  if (success) {
    statusCode = 200;
    msg = 'success';
  }

  res.json({success: success, msg: msg, data: data});
  res.statusCode = statusCode;
  res.end();
};
