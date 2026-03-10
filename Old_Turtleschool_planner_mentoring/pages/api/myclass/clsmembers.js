
import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
    let { rows } = await pool.query(`
                    select m.id, m.user_name, p.cls, p.plnrid, p."gradeCode" as gradecode,
                        case when ( select count(*) from payments p
                        where accountid = m.id
                        and to_char(current_date, 'yyyy-MM-dd') between to_char(time, 'yyyy-MM-dd') and to_char(time + '1 month', 'yyyy-MM-dd')
                        and typesid = '2' limit 1
                        ) > 0 then 'Y' else 'N' end payyn
                    from members m
                        ,plannermanagement p
                    where m.id = p.id
                    and p.useyn = 'Y'
                    and to_char(current_date, 'yyyyMMdd') between p.strdt and coalesce(p.enddt, '99991231')
                    and m.account = $1 `, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    if(rows[0].payyn != "Y")
    {
        res.json({success: false, msg: 'No Account', data: null});
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
            const { plnrid, cls } = { plnrid: rows[0].plnrid, cls: rows[0].cls }

            rows = await pool.query(`
                    select a.id, b.user_name
                    from plannermanagement a
                      ,members b
                    where a.id = b.id
                    and to_char(current_date, 'yyyyMMdd') between strdt and coalesce(enddt, '99991231')
                    and a.useyn = 'Y'
                    and a.plnrid = $1
                    and a.cls = $2
                    `, [plnrid, cls]
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
