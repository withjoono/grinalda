import pool from '../../../lib/pool';

/*
    - title: 과목검색
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  /*
  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }
  */
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];
  let s_year = req.query.year;
  let s_recruitment = req.query.recruitment;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

              select c.universityid ,
              		u."name" as universitynm,
              		c.department,
              		d."name" as departmentnm,
              		c.recruitment ,
              		c.aplctdate ,
              		c.totalaplcn ,
              		c.totalrank ,
              		c.imgpath ,
              		c.imgfilenm
              from csatsvexinfrm c
              	,universities u
              	,departments d
              where c.universityid = cast(u.id as varchar)
              and c.department = cast(d.id as varchar)
              and c.accountid = $1
              and c."year" = cast($2 as varchar)
              and c.useyn = 'Y'
              and (((coalesce ($3, '1') ='1') and 1=1) or
                   ((coalesce ($3, '1')!='1') and c.recruitment = $3 ))
                ;
                `,
        [req.headers.auth, s_year, s_recruitment],
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
