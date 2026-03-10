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
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `
      				 select grade, semester ,
      				 		subjectarea ,
      				 		(select "name" from codes c where c."groupId" = '14' and c.code = z.subjectarea limit 1) as subjectareaname,
      				 		subjectcode ,
      				 		(select "name" from codes c where c."groupId" = '13' and c.code = z.subjectcode limit 1) as subjectname,
      				 		unit ,
      				 		originalscore , averagescore , standarddeviation , "rank"
      				 from csatgpa z
      				 where accountid = $1 --'112350065540225109373'
      				 ;
        `,
        [req.headers.auth],
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
