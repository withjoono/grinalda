
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 학생점수랭킹
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
    const str_dvsn = req.query.dvsn;
    const str_dwm = req.query.str_dwm;

    switch (req.method) {
        case 'GET':
            const { cls, dvsn, dwm, plnrid, id} = { cls: rows[0].cls, dvsn: str_dvsn, dwm: str_dwm, plnrid: rows[0].plnrid, id: rows[0].id}

            rows = await pool.query(`
                    select
                        id,
                        case when $4 = id then user_name else substring(user_name, 1, 1) || '**' end as user_name,
                        strdt ,
                        clsnm,
                        coalesce(acdmcScore, 0) as acdmcscore,
                        coalesce(testScores, 0) as testscores,
                        coalesce(ftnsScore, 0) as ftnsscore,
                        coalesce(totalScore, 0) as totalscore,
                        RANK () OVER (ORDER BY totalScore) as rrank
                    from
                    (select
                        m1.id, --학생id
                        m1.user_name, --학생nm
                        p1.strdt ,
                        c.comn_nm   as clsnm,
                        ROUND(sum(p2.score), 2) as acdmcScore, --학업점수
                        ROUND(sum(cast(p2.test as numeric)), 2) as testScores, --시험점수
                        0 as ftnsScore, --체력점수
                        ROUND(sum(p2.score), 2) +
                        ROUND(sum(cast(p2.test as numeric)), 2) +
                        0 as totalScore
                    from plannermanagement p1 --플래너학생관리
                        ,members m1 --플래너학생
                        ,planneritems p2
                        ,commoncode c
                    where p1.cls = $1
                    and p1.plnrid = $3
                    and p1.useyn = 'Y'
                    and p1.id = m1.id
                    and p1.id = p2."memberId"
                    and to_char(p2."startDate", 'yyyy-mm-dd') between p1.strdt  and coalesce(p1.enddt, '99991231')
                    and p2."primaryType" = '학습'
                    and c.comn_grp_cd = 'P00004'
                    and c.comn_cd = p1.cls
                    --일간
                    and (($2 = 'D'
                        and to_char(p2."startDate", 'yyyymmdd') = to_char(current_date, 'yyyyMMdd') )
                    --주간
                        or ($2 = 'W'
                        and to_char(p2."startDate", 'yyyymmdd') between to_char(date_trunc('week', current_date::timestamp)::date, 'yyyyMMdd')
                        and to_char((date_trunc('week', current_date::timestamp) + '6 days'::interval)::date, 'yyyyMMdd') )
                    --월간
                        or ($2 = 'M'
                        and to_char(p2."startDate", 'yyyymmdd') like to_char(current_date, 'yyyyMM') || '%' ))
                    --and p2.dvsn = $2 --in ('1', '3', '4', '5', '6') --학업성취도 3 --달리기 4 --윗몸일으키기 5 --팔굽혀펴기 6 --시험 1
                    group by m1.id, m1.user_name, p1.strdt, c.comn_nm
                    ) as a
                    order by totalScore
                    ;
                `, [cls, dwm, plnrid, id]
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
