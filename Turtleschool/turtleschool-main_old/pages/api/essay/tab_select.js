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

  let str_division = req.query.division;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `

          select a.universityid   as universityid,
            	   b.name           as universitynm,
            	   null             as lowseparaid,
            	   null             as lowseparanm,
            	   a.departmentid   as departmentid,
            	   (select name
                    from departments d
                   where d.id = a.departmentid)		as departmentnm,
            	   a.rcrtmunitid    as rcrtmunitid,
            	   (select comn_nm
                    from commoncode c
                   where c.comn_grp_cd = 'E00001'
                     and c.comn_cd = cast(a.rcrtmunitid as varchar) limit 1)		as rcrtmunitnm,
            	   a.essaya         as essaya,
            	   a.essayb         as essayb,
            	   a.essayc         as essayc,
            	   a.recruits       as recruits,
            	   a.recruitdate    as recruitdate,
            	   a.rmk            as rmk,
                 a.rmka           as rmk1
            from essayuser a
              ,universities b
            where a.id = $1
            and a.division = $2
            and a.useyn = 'Y'
            and a.universityid = b.id
            order by universityid, departmentid
            ; `,
        [req.headers.auth, str_division],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.status(406).json({success: false, msg: 'No data', data: null});
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

  res.json({success: success, msg: msg, data: data});
  res.statusCode = statusCode;
  res.end();
};
