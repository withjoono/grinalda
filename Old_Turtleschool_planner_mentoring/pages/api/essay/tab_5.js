
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title:
    - params:

*/
export default async (req, res) => {
    let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    let success = false;
    let msg = 'fail'
    let statusCode = 500;
    let data = [];

    let str_year = req.query.year;
    let str_lar_cd = req.query.lar_cd;
    let str_mid_cd = req.query.mid_cd;
    let str_division = req.query.division;

    switch (req.method) {
        case 'GET':
             rows  = await pool.query(`
               select u.name, e.universityid , e.rmk1, e.rmk2, e.rmk3, e.rmk4,
                      coalesce((select name from departments d where cast(d.id as varchar) = e.rmk2 limit 1), e.rmk2) as departmentnm
               from essayetc e
               	,universities u
               where e."year" = $1
               and e.useyn = 'Y'
               and e.lar_cd = $2
               and (
                      ((coalesce($3, '1') = '1') and 1=1) or
                      ((coalesce($3, '1') != '1') and e.mid_cd  = $3)
                    )
               and coalesce(e.division, '0') = $4
               and e.universityid = u.id
               order by u.name, e.universityid
               ;

                `, [str_year, str_lar_cd, str_mid_cd, str_division]
            )

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
    }

    res.json({success: success, msg: msg, data: data});
    res.statusCode = statusCode;
    res.end();
}
