
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 플래너 일반내신성적
    - params:
*/
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

    let str_subject = req.query.subject; //과목
    let str_dvsn = req.query.dvsn;  //학기
    let str_grade = req.query.grade;
    let str_gubun = req.query.gubun; //일반내신과 Z내신
    let str_id = req.query.id;

    if(str_id == null || str_id.length < 1)
    {
      str_id = rows[0].id;
    }

    if(str_gubun == null || str_gubun.length < 1)
    {
        str_gubun = 'L';
    }

    /*
    1	과목선택 null 전과목 null 아닐경우 국영수사과
    2	학년
    3	학기
    4	학생id
    5	플래너id
    6   플래너반
    */
    switch (req.method) {
        case 'GET': //일반내신
        let { subject, gradecode, dvsn, id, plnrid, cls, sid } = { subject: str_subject, gradecode: str_grade, dvsn: str_dvsn, id: rows[0].id, plnrid: rows[0].plnrid, cls: rows[0].cls }

        if(str_gubun == "L")
        {
            rows  = await pool.query(`
                with res as (
                        select
                            '1' as gubun,
                            g.accountid,
                            round((sum(("rank" * unit) + 0.00) / sum(unit + 0.00)), 2) as score
                        from gpa g
                        where ((coalesce($1, '1')='1' and 1=1) or (coalesce($1, '1')!='1' and g.subjectarea in ('10','20','60','70','80')))
                        and ((coalesce($2, '1')='1' and 1=1) or (coalesce($2, '1')!='1' and g.grade = cast($2 as numeric)))
                        and ((coalesce($3, '1')='1' and 1=1) or (coalesce($3, '1')!='1' and g.semester = cast($3 as numeric)))
                        --and ((coalesce($4, '1')='1' and 1=1) or (coalesce($4, '1')!='1' and g.accountid = cast($4 as numeric)))
                        and g.accountid in (select p.id from plannermanagement p where p.plnrid = $5 and p.cls = $6 and p.useyn = 'Y' and to_char(current_date, 'yyyyMMdd') between p.strdt and coalesce(p.enddt, '99991231'))
                        and (g.originscore is not null and g.originscore != '0')
                        and (g.averagescore is not null and g.averagescore != '0')
                        and (g.standarddeviation is not null and g.standarddeviation != '0')
                        group by g.accountid
                        union all
                        select '0' as gubun,
                            g.accountid,
                            round((sum(("rank" * unit) + 0.00) / sum(unit + 0.00)), 2) as score
                        from gpa g
                        where g.accountid = $5
                        and ((coalesce($1, '1')='1' and 1=1) or (coalesce($1, '1')!='1' and g.subjectarea in ('10','20','60','70','80')))
                        and ((coalesce($2, '1')='1' and 1=1) or (coalesce($2, '1')!='1' and g.grade = cast($2 as numeric)))
                        and ((coalesce($3, '1')='1' and 1=1) or (coalesce($3, '1')!='1' and g.semester = cast($3 as numeric)))
                        and (g.originscore is not null and g.originscore != '0')
                        and (g.averagescore is not null and g.averagescore != '0')
                        and (g.standarddeviation is not null and g.standarddeviation != '0')
                        group by g.accountid
                    )
                    , res2 as (
                        select a.gubun, a.accountid as id, a.score, RANK () OVER (ORDER BY a.score) as rrank
                            , case when $4 = a.accountid then m.user_name else substring(m.user_name, 1, 1) || '**' end as user_name
                        from res a
                            ,members m
                        where a.accountid = m.id
                    )
                    select gubun, id, score, rrank,
                        user_name, round(coalesce((select score from res2 where rrank = '1' limit 1), 0) - score +0.00, 2) as score_diff
                    from res2 y
                    order by gubun, rrank
                    ;
                    `, [subject, gradecode, dvsn, id, plnrid, cls]
                )
            }
            else if(str_gubun == "R")
            {
                console.log("B");
                rows  = await pool.query(`
                with res as (
                    select
                        g.accountid,
                        g.grade, --학년
                        g.semester, --학기
                        g.subjectcode , --과목코드
                        g."rank", --등급
                        g.unit ,	--단위
                        round(cast(sum((g.originscore - g.averagescore + 0.00) / g.standarddeviation + 0.00) as numeric ), 1) as ccc --(원점수-평균점수 / 표준편차)
                    from gpa g
                    where ((coalesce($1, '1')='1' and 1=1) or (coalesce($1, '1')!='1' and g.subjectarea in ('10','20','60','70','80')))
                    and ((coalesce($2, '1')='1' and 1=1) or (coalesce($2, '1')!='1' and g.grade = cast($2 as numeric)))
                    and ((coalesce($3, '1')='1' and 1=1) or (coalesce($3, '1')!='1' and g.semester = cast($3 as numeric)))
                    and g.accountid in (select p.id from plannermanagement p where p.plnrid = $5 and p.cls = $6 and p.useyn = 'Y' and to_char(current_date, 'yyyyMMdd') between p.strdt and coalesce(p.enddt, '99991231'))
                    and (g.originscore is not null and g.originscore != '0')
                    and (g.averagescore is not null and g.averagescore != '0')
                    and (g.standarddeviation is not null and g.standarddeviation != '0')
                    group by g.accountid, g.grade, g.semester, g.subjectcode , g."rank" , g.unit
                    union all
                    select
                    g.accountid,
                        g.grade, --학년
                        g.semester, --학기
                        g.subjectcode , --과목코드
                        g."rank", --등급
                        g.unit ,	--단위
                        round(cast(sum((g.originscore - g.averagescore + 0.00) / g.standarddeviation + 0.00) as numeric ), 1) as ccc --(원점수-평균점수 / 표준편차)
                    from gpa g
                    where ((coalesce($1, '1')='1' and 1=1) or (coalesce($1, '1')!='1' and g.subjectarea in ('10','20','60','70','80')))
                    and ((coalesce($2, '1')='1' and 1=1) or (coalesce($2, '1')!='1' and g.grade = cast($2 as numeric)))
                    and ((coalesce($3, '1')='1' and 1=1) or (coalesce($3, '1')!='1' and g.semester = cast($3 as numeric)))
                    and (g.originscore is not null and g.originscore != '0')
                    and (g.averagescore is not null and g.averagescore != '0')
                    and (g.standarddeviation is not null and g.standarddeviation != '0')
                    and g.accountid = $5
                    group by g.accountid, g.grade, g.semester, g.subjectcode , g."rank" , g.unit
                )
                , res2 as (
                    select
                    a.accountid as id,
                    a.grade, --학년
                    a.semester, --학기
                    round((sum( case when cast(c.comn_nm as float) between 0.00 and 0.04 then 1
                                    when cast(c.comn_nm as float) between 0.04 and 0.11 then 2
                                    when cast(c.comn_nm as float) between 0.11 and 0.23 then 3
                                    when cast(c.comn_nm as float) between 0.23 and 0.40 then 4
                                    when cast(c.comn_nm as float) between 0.40 and 0.60 then 5
                                    when cast(c.comn_nm as float) between 0.60 and 0.77 then 6
                                    when cast(c.comn_nm as float) between 0.77 and 0.89 then 7
                                    when cast(c.comn_nm as float) between 0.89 and 0.96 then 8
                                    else 9 end * a.unit) + 0.00) / (sum(a.unit) + 0.00), 2) as a1 --이수*Z등급
                    from res a
                        ,commoncode c
                    where cast(a.ccc as float) = cast(c.comn_cd  as float)
                    and c.comn_grp_cd = 'Z0001'
                    group by a.accountid, a.grade, a.semester
                )
                , res3 as (
                    select a.id
                        , (select trunc(sum(z1.a1)) from res2 z1 where z1.id = a.id) as dd --등급합
                        , (select count(*) from res2 z2 where z2.id = a.id) as cc --등급합
                        , a.grade --학년
                        , sum(a.a1) as a1 --등급
                    from res2 a
                    group by a.id, a.grade
                )
                ,res4 as (
                    select a.id,
                        case when $5 = a.id then '0' else '1' end as gubun,
                        case when $4 = a.id then m.user_name else substring(m.user_name, 1, 1) || '**' end as user_name,
                        sum(
                            case when cc = '5' or cc = '6' then cast(a.a1 as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                                when cc = '4' then cast(a.a1 as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                                when cc = '3' then cast(a.a1 as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                                when cc = '2' then cast(a.a1 as float) / 2
                                else cc end
                        ) as z_grade, --총등급
                        RANK () OVER (ORDER BY sum(
                            case when cc = '5' or cc = '6' then cast(a.a1 as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                                when cc = '4' then cast(a.a1 as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                                when cc = '3' then cast(a.a1 as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                                when cc = '2' then cast(a.a1 as float) / 2
                                else cc end
                        )) as rrank
                    from res3 a
                        ,members m
                    where a.id = m.id
                    group by a.id, m.user_name
                )
                select gubun, user_name, round(z_grade::numeric, 2) as score, rrank,
                            round(coalesce((select z_grade from res4 where rrank = 1 limit 1) - round(z_grade::numeric, 2))::numeric, 2) as score_diff
                from res4
                ; `, [subject, gradecode, dvsn, id, plnrid, cls]
                )
            }
            else if(str_gubun == "D")
            {
                rows  = await pool.query(`
                    with res as (
                            select
                                g.semester,
                                g.accountid,
                                round((sum(("rank" * unit) + 0.00) / sum(unit + 0.00)), 2) as score
                            from gpa g
                            where g.subjectarea = $1
                            and g.grade = $2
                            and g.accountid = $3
                            and (g.originscore is not null and g.originscore != '0')
                            and (g.averagescore is not null and g.averagescore != '0')
                            and (g.standarddeviation is not null and g.standarddeviation != '0')
                            group by g.semester, g.accountid
                        )
                        select a.accountid as id,
                            sum(case when a.semester = '1' then score else 0 end) as ascore, --1학기
                            sum(case when a.semester = '2' then score else 0 end) as bscore --2학기
                        from res a
                            ,members m
                        where a.accountid = m.id
                        group by a.accountid
                        `, [subject, gradecode, str_id]
                    )
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
