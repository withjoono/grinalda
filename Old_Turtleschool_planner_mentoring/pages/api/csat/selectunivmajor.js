import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title:학과검색
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
    let msg = 'fail'
    let statusCode = 500;
    let data = [];
    let s_universitynm = req.query.universitynm;
    let s_majornm = req.query.majornm;
    let s_recruitment = req.query.recruitment;
    let s_pages = req.query.pages;

console.log(s_pages) ;
    switch (req.method) {
        case 'GET':
        case 'POST':

        if(s_pages == "undefined" || s_pages == null || s_pages == "")
        {
          rows  = await pool.query(`

  with res as (
                select d.id as major_cd, d."name" as major_nm,
                      c.universityid as universityid, u."name" as universitynm, max(c2.recruitment) as recruitment
                from csatanlys c
                ,universities u
                ,csatunivdepart c2
                ,departments d
                where c.universityid = u.id
                and c.universityid = cast(c2.universityid as numeric)
                and c.score_convert = c2.score_convert
                and c2.department = cast(d.id as varchar)
               and c.major = c2.major
                and u.name like '%' || coalesce($1, '') || '%'
                and d."name" like '%' || coalesce($2, '') || '%'
                and (((coalesce ($3, '1')  = '1') and (1=1)) or
                  	 ((coalesce ($3, '1') != '1') and (c2.recruitment = $3)))
                group by d.id, d."name", c.universityid, u."name"
   )
         			  select major_cd, major_nm, universityid , universitynm, recruitment ,
         			        round((select count(*) from res) / 30) AS end_pages
         			  from res
                order by universitynm , major_nm
                ;
                  `,
                      [s_universitynm, s_majornm, s_recruitment]
                  );

                  if (rows.rows == undefined || rows.rows.length < 1)
                  {
                    res.json({success: false, msg: 'No data', data: null});
                    res.statusCode = 406;
                    res.end();
                    return;
                  }
        }
        else {
          rows  = await pool.query(`

  with res as (
                select d.id as major_cd, d."name" as major_nm,
                      c.universityid as universityid, u."name" as universitynm, max(c2.recruitment) as recruitment
                from csatanlys c
                ,universities u
                ,csatunivdepart c2
                ,departments d
                where c.universityid = u.id
                and c.universityid = cast(c2.universityid as numeric)
                and c.score_convert = c2.score_convert
                and c2.department = cast(d.id as varchar)
               and c.major = c2.major
                and u.name like '%' || coalesce($1, '') || '%'
                and d."name" like '%' || coalesce($2, '') || '%'
                and (((coalesce ($3, '1')  = '1') and (1=1)) or
                  	 ((coalesce ($3, '1') != '1') and (c2.recruitment = $3)))
                group by d.id, d."name", c.universityid, u."name"
   )
         			  select major_cd, major_nm, universityid , universitynm, recruitment ,
         			        round((select count(*) from res) / 30) AS end_pages
         			  from res
                order by universitynm , major_nm
                limit 30 offset (30) * ($4 - 1)
                ;
                  `,
                      [s_universitynm, s_majornm, s_recruitment, s_pages]
                  );

                  if (rows.rows == undefined || rows.rows.length < 1)
                  {
                    res.json({success: false, msg: 'No data', data: null});
                    res.statusCode = 406;
                    res.end();
                    return;
                  }
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
