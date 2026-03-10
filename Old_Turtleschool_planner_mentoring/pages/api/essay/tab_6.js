
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title:
    - params:

*/
export default async (req, res) => {
    try {
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

    let str_univers = req.query.univers;
    let str_grade = req.query.grade;

    switch (req.method) {
        case 'GET':
             rows  = await pool.query(`

select * from
(
      select u.name, e.universityid, '1' as gubu, e.a, e.b, e.c, e.d, e.e, e.f, e.g, e.h, e.i
       , RANK () OVER ( ORDER BY case when $2=1 then a when $2=2 then b when $2=3 then c
                      when $2=4 then d when $2=5 then e when $2=6 then f
                      when $2=7 then g when $2=8 then h when $2=9 then i else b end, name, universityid ) as rrank
      from essaycollegegs e
       ,universities u
      where e.useyn = 'Y'
      and cast(e.universityid as numeric) = u.id
      union all
      select u.name, e.universityid, '2' as gubu, case when e.a = 0 then 0 else 300 end - e.a, e.a - e.b, e.b- e.c, e.c - e.d, e.d - e.e, e.e - e.f, e.f - e.g, e.g - e.h, e.h - e.i
       , RANK () OVER (ORDER BY case when $2=1 then a when $2=2 then b when $2=3 then c
                      when $2=4 then d when $2=5 then e when $2=6 then f
                      when $2=7 then g when $2=8 then h when $2=9 then i else b end, name, universityid )
      from essaycollegegs e
       ,universities u
      where e.useyn = 'Y'
      and cast(e.universityid as numeric) = u.id
      ) as aa
      where (((coalesce($1, '1') = '1') and 1=1) or ((coalesce($1, '1') != '1') and cast(aa.universityid as varchar) in (select split_part(unnest(string_to_array($1, '|')), ',', 1))  ))
      order by rrank desc, name, universityid, gubu
      ;
                `, [str_univers, str_grade]
            )
/*
            if (rows.rows == undefined || rows.rows.length < 1)
            {
              res.json({success: false, msg: 'No data', data: null});
              res.statusCode = 406;
              res.end();
              return;
            }
*/
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
}catch (err) {
    console.log(err);
}
}
