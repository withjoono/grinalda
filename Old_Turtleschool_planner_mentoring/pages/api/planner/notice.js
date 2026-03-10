
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

    let str_dvsn = req.query.dvsn;    
    let str_plnrid = req.query.plnerid;
    let str_cls = req.query.cls;

    if(str_plnrid == undefined || str_plnrid == null)
    {
        str_plnrid = rows[0].plnrid;
    }

    if(str_cls == undefined || str_cls == null)
    {
        str_cls = rows[0].cls;
    }

    switch (req.method) {
        case 'GET':
            const { plnrid, dvsn, cls} = { plnrid: str_plnrid,  dvsn: str_dvsn, cls: str_cls}

            let { rows } = await pool.query(`
                    select 
                        p2.plnrid   as plnrid,
                        p2.cls      as cls,
                        c.comn_nm   as clsnm,
                        p2.seq      as seq,
                        p2.rmk      as rmk,
                        p2.dvsn     as dvsn
                    from plannernotice p2
                        ,commoncode c 
                    where p2.plnrid = $1
                    and p2.useyn = 'Y'
                    and to_char(current_date, 'yyyyMMdd') between p2.strdt and coalesce(p2.enddt, '99991231')
                    and c.comn_grp_cd = 'P00004'
                    and c.comn_cd = p2.cls
                    and (((coalesce($2, 'A') = 'A') and 1=1) or ((coalesce($2, 'A') != 'A') and p2.dvsn = $2))
                    and p2.cls = $3
                    order by p2.dvsn, p2.seq desc
                    ;
                `, [plnrid, dvsn, cls]
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
    console.log('value:');
    console.log('value:'+data);
    res.json({success: success, msg: msg, data: data});
    res.statusCode = statusCode;
    res.end();
}
