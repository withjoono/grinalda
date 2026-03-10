
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 내신성적관리 > 교과분석 > 내신평균 > 진로선택
    - params:
*/
export default async (req, res) => {
    let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])
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
        
    switch (req.method) {
        case 'GET':
        const { id } = { id: str_id}

        let { rows } = await pool.query(`
            with res as (
                select 
                    g.accountid as id,
                    case when $3 = g.id then m.user_name else substring(m.user_name, 1, 1) || '**' end as user_name, 
                    achievement,
                    sum(case when achievement = 'A' then 1 else 0 end) as acount,
                    sum(case when achievement = 'B' then 1 else 0 end) as bcount,
                    sum(case when achievement = 'C' then 1 else 0 end) as ccount,
                    sum(case when achievement = 'D' then 1 else 0 end) as dcount,
                    sum(case when achievement = 'E' then 1 else 0 end) as ecount
                from gpa g 
                    ,members m
                where g.achievement is not null
                and g.accountid = $1
                and g.accountid = m.id
                group by g.id, m.user_name, achievement 
                )
                select 
                    id, user_name, achievement,
                    acount / (acount+bcount+ccount+dcount+ecount) * 100 as apercent,
                    bcount / (acount+bcount+ccount+dcount+ecount) * 100 as bpercent,
                    ccount / (acount+bcount+ccount+dcount+ecount) * 100 as cpercent,
                    dcount / (acount+bcount+ccount+dcount+ecount) * 100 as dpercent,
                    ecount / (acount+bcount+ccount+dcount+ecount) * 100 as epercent
                from res
                ;            

            `, [ id ]
        )
        
            success = true;
            data = rows;
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
