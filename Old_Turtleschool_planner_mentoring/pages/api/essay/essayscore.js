import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title:
    - params:

*/
export default async (req, res) => {
        let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth]);

        console.log('fdfd');
        if (rows.length < 1) {
            res.status(406).json({ success: false, msg: 'No authorization', data: null });
            res.end();
            return;
        }

        let success = false;
        let msg = 'fail';
        let statusCode = 500;
        let data = [];

        let kor = req.query.kor;
        let eng = req.query.eng;
        let mat1 = req.query.mat1;
        let mat2 = req.query.mat2;
        let soc1 = req.query.soc1;
        let soc2 = req.query.soc2;
        let sci1 = req.query.sci1;
        let sci2 = req.query.sci2;
        let khistory = req.query.khistory;
        //let str_univers = req.query.univers;

        let str_division = req.query.division;
        let str_year = req.query.year;
        let str_month = req.query.month;

    switch (req.method) {
        case 'GET':
             rows  = await pool.query(`

            select u.name , e.university, t.total_score, max(highscore) as highscore, min(lowscore) as lowscore
                , case when max(highscore) is not null and total_score > max(highscore) then '0'
                       else '1' end pass_result
               from essaypercentage e
                  ,universities u
                  ,( select sum(case when subject in ('11', '12', '21', '22') then cast(score as numeric) / 2
                          when subject in ('80', '99') then 0 else cast(score as numeric) end) as total_score
                   from
                   (
                     select '60' as subject, coalesce($1, '0') as score union all
                     select '80' as subject, coalesce($2, '0') as score union all
                     select '71' as subject, coalesce($3, '0') as score union all
                     select '72' as subject, coalesce($4, '0') as score union all
                     select '11' as subject, coalesce($5, '0') as score union all
                     select '12' as subject, coalesce($6, '0') as score union all
                     select '21' as subject, coalesce($7, '0') as score union all
                     select '22' as subject, coalesce($8, '0') as score union all
                     select '99' as subject, coalesce($9, '0') as score
                   ) as aa ) t
              where cast(e.university as numeric) = u.id
              and division = $10
              and year = $11
              and month = $12
              and e.useyn = 'Y'
              group by e.university , u."name", t.total_score
              order by u.name
                ;
                `,
                    [kor, eng, mat1, mat2, soc1, soc2, sci1, sci2, khistory, str_division, str_year, str_month]
                );

                if (rows.rows == undefined || rows.rows.length < 1) {
                    res.status(406).axiosjson({ success: false, msg: 'No data', data: null });
                    res.end();
                    return;
                }

                success = true;
                data = rows.rows;
                console.log(data);
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
