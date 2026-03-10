import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title:
    - params:
*/
export default async (req, res) => {

  let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }
        let success = false;
        let msg = 'fail';
        let statusCode = 500;
        let data = [];

    let s_year = req.query.year;
    let s_areacode = req.query.areacode;
    let s_cross_sprt = req.query.cross_sprt;
    let s_recruitment = req.query.recruitment;

    console.log("ㅇ", s_year, s_areacode, s_cross_sprt, s_recruitment)

    switch (req.method) {
        case 'GET':
        case 'POST':
            rows  = await pool.query(`

           select u.id as universityid, u."name" as universitynm
           from csatuscore a
             ,universities u
             ,(select c4.comn_cd , c4.comn_nm
               from commoncode c4
               where c4.comn_grp_cd = 'C00003') d
           where a.universityid = u.id
           and coalesce(a.cross_sprt, 'N') = $4
           and a.accountid = $1
           and a."year" = $2
           and a.useyn = 'Y'
           and a.recruitment = d.comn_cd
           and (((coalesce($3,'1') = '1') and 1=1 ) or
              ((coalesce($3,'1') != '1') and  u."areaCode" in (select unnest(string_to_array($3, '|')) as score)))
           and d.comn_cd = a.recruitment
           and (((coalesce($5,'1') = '1') and 1=1 ) or
              ((coalesce($5,'1') != '1') and  d.comn_nm in (select unnest(string_to_array($5, '|')) as score)))
           group by u.id , u."name"
           order by u."name"
           ;
             `,
                 [req.headers.auth, s_year, s_areacode, s_cross_sprt, s_recruitment]
             );

                if (rows.rows == undefined || rows.rows.length < 1)
                {
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
        console.log("202");
    }

        res.status(statusCode).json({ success: success, msg: msg, data: data });
        res.end();
};
