
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 플래너공지사항
    - params:
*/
export default async (req, res) => {
    let { rows } = await pool.query(`
                    select m.id, m.user_name, p.cls, p.plnrid,
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
    const str_plnrid = req.query.plnrid;

    switch (req.method) {
        case 'GET':
            const { plnrid, cls, id} = { plnrid: str_plnrid, cls: rows[0].cls, id: rows[0].id}

            let { rows } = await pool.query(`
                        select m.id, 
                            --case when $3 = m.id then m.user_name else substring(m.user_name, 1, 1) || '**' end as user_name, 
                            m.user_name,
                            p.cls, m.school
                            from plannermanagement p 
                            ,members m 
                        where p.useyn  = 'Y'
                        and to_char(current_date, 'yyyyMMdd') between p.strdt and coalesce(p.enddt, '99991231')
                        --and p.cls = 'A1'
                        and ((coalesce($2, '1')='1' and 1=1) or (coalesce($2, '1')!='1' and p.cls = $2))
                        and p.plnrid = $1
                        and p.id = m.id 
                        order by p.cls, p.id
                        ;
                `, [plnrid, cls]
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
