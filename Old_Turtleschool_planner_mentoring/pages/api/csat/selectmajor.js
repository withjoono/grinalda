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

    switch (req.method) {
        case 'GET':
        case 'POST':
            rows  = await pool.query(`

              select d.id as major_cd, d."name" as major_nm
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
              group by d.id, d."name"
              order by d.id
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
