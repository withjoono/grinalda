
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 최근시험결과
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

    switch (req.method) {
        case 'GET':
            const { cls, plnrid, id} = { cls: rows[0].cls, plnrid: rows[0].plnrid, id: rows[0].id}

            rows = await pool.query(`
                    select
                        m1.id ,
                        case when $3 = m1.id then m1.user_name else substring(m1.user_name, 1, 1) || '**' end as user_name,
                        coalesce(avg(p2.score), 0) as score ,
                        p1.cls,
                        RANK () OVER (ORDER BY sum(p2.score)) as rrank
                    from plannermanagement p1
                    left outer join planneritems p2 on p1.id = p2."memberId" and to_char(p2."startDate", 'yyyy-mm-dd') between p1.strdt  and coalesce(p1.enddt, '99991231')  and p2."primaryType" = '학습'
                    left outer join members m1 on p1.id = m1.id
                    where p1.cls = $1
                    and p1.plnrid = $2
                    and p1.useyn = 'Y'
                    and to_char(p2."startDate", 'yyyy-mm-dd') =
                                           (select max(to_char(pb."startDate", 'yyyy-mm-dd'))
                    											  from plannermanagement pa
                    											 	left outer join planneritems pb on pa.id = pb."memberId" and to_char(pb."startDate", 'yyyy-mm-dd') between pa.strdt  and coalesce(pa.enddt, '99991231')
                    											 	and pb."primaryType" = '학습'
                    											  where pa.plnrid = $2
                                            and pa.cls = $1
                                            and pa.useyn = 'Y'
                                            and to_char(p2."startDate", 'yyyy-mm-dd') between to_char(now() - interval '3 month', 'yyyy-mm-dd') and to_char(current_Date, 'yyyy-mm-dd')
                    											 )
                    group by m1.id, m1.user_name, p1.cls
                    order by sum(p2.score), id
                    ;
                `, [cls, plnrid, id]
			)

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
