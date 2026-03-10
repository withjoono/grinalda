
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 내신성적관리 > 교과분석 > 내신Z점수 > 나의 내신 Z점수, 내신 반영 방식
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
    
    /*
    let str_subject = req.query.subject;  //조회구분자    
    let str_gradecode = req.query.gradecode;  //조회구분자    
    let str_semester = req.query.semester;  //조회구분자    
    let str_id = req.query.id;  //조회구분자    
    let str_school = req.query.school;  //조회구분자
    */
    let str_dvcd = req.query.dvcd;  //조회구분자

    switch (req.method) {
        case 'GET': //Z내신
        const { id, dvcd } = { id: req.headers.auth, dvcd:str_dvcd }

        let { rows } = await pool.query(`
                    with res as (
                        select
                            m.account as accountid,
                            g.grade, --학년
                            g.semester, --학기
                            g.subjectarea ,
                            g.subjectcode , --과목코드
                            g."rank", --등급
                            g.unit ,	--단위
                            cast(g.grade as varchar) || cast(g.semester as varchar) as gseme,
                            round(cast(sum((g.originscore - g.averagescore + 0.00) / g.standarddeviation + 0.00) as numeric ), 1) as ccc --(원점수-평균점수 / 표준편차)
                        from gpa g
                            ,members m 
                        where m.account = $1
                        and g.accountid = m.id
                        and (g.originscore is not null and g.originscore != '0')                        
                        and (g.averagescore is not null and g.averagescore != '0')
                        and (g.standarddeviation is not null and g.standarddeviation != '0')
                        group by m.account, g.grade, g.semester, g.subjectarea , g.subjectcode , g."rank" , g.unit
                    )
                    , res2 as (
                        select 
                        a.accountid, 
                        a.grade, --학년
                        a.semester --학기
                        --1-1 내신등급평균전과목
                        , sum(a.unit * a."rank" + 0.00) averageaa
                        , sum(a.unit) averageab
                        --2-1 내신등급평균국영수사 한국사포함
                        , sum(case when a.subjectarea in ('60','80','70','10') then a.unit * a."rank" else 0.00 end) averageba
                        , sum(case when a.subjectarea in ('60','80','70','10') then a.unit else 0.00 end) averagebb
                        --3-1 내신등급평균국영수사과
                        , sum(case when a.subjectarea in ('60','80','70','10','20') and a.subjectcode != '1G' then a.unit * a."rank" else 0.00 end) averageca
                        , sum(case when a.subjectarea in ('60','80','70','10','20') and a.subjectcode != '1G' then a.unit else 0.00 end) averagecb                        
                        --4-1 내신등급평균국영수사 한국사제외
                        , sum(case when a.subjectarea in ('60','80','70','10') and a.subjectcode != '1G' then a.unit * a."rank" else 0.00 end) averageda
                        , sum(case when a.subjectarea in ('60','80','70','10') and a.subjectcode != '1G' then a.unit else 0.00 end) averagedb
                        --5-1 내신등급평균국영수과
                        , sum(case when a.subjectarea in ('60','80','70','20') then a.unit * a."rank" else 0.00 end) averageea
                        , sum(case when a.subjectarea in ('60','80','70','20') then a.unit else 0.00 end) averageeb                        
                        --1-2 Z내신환산내신
                        , sum(get_zscoretograde(cast(a.ccc as varchar)) * a.unit + 0.00) zaverageaa
                        , sum(a.unit + 0.00) zaverageab
                        --2-2 Z내신환산내신국영수사 한국사포함
                        , sum(case when a.subjectarea in ('60','80','70','10') then get_zscoretograde(cast(a.ccc as varchar)) * a.unit + 0.00 else 0.00 end) zaverageba
                        , sum(case when a.subjectarea in ('60','80','70','10') then a.unit + 0.00 else 0.00 end) zaveragebb
                        --3-2 Z내신환산내신국영수사과
                        , sum(case when a.subjectarea in ('60','80','70','10','20') then get_zscoretograde(cast(a.ccc as varchar)) * a.unit + 0.00 else 0.00 end) zaverageca
                        , sum(case when a.subjectarea in ('60','80','70','10','20') then a.unit + 0.00 else 0.00 end) zaveragecb                        
                        --4-2 Z내신환산내신국영수사 한국사제외
                        , sum(case when a.subjectarea in ('60','80','70','10') and a.subjectcode != '1G' then get_zscoretograde(cast(a.ccc as varchar)) * a.unit + 0.00 else 0.00 end) zaverageda
                        , sum(case when a.subjectarea in ('60','80','70','10') and a.subjectcode != '1G' then a.unit + 0.00 else 0.00 end) zaveragedb
                        --5-2 Z내신환산내신국영수과
                        , sum(case when a.subjectarea in ('60','80','70','20') then get_zscoretograde(cast(a.ccc as varchar)) * a.unit + 0.00 else 0.00 end) zaverageea
                        , sum(case when a.subjectarea in ('60','80','70','20') then a.unit + 0.00 else 0.00 end) zaverageeb
                        --1-3 Z내신점수전과목
                        , avg(a.ccc) zaverjuma
                        --2-3 Z내신점수국영수사 한국사포함
                        , avg(case when a.subjectarea in ('60','80','70','10') and a.subjectcode != '1G' then a.ccc else 0.00 end) zaverjumb
                        --3-3 Z내신점수내신국영수사과
                        , avg(case when a.subjectarea in ('60','80','70','20') then a.ccc else 0.00 end) zaverjumc
                        --4-3 Z내신점수국영수사 한국사제외
                        , avg(case when a.subjectarea in ('60','80','70','10') then a.ccc else 0.00 end) zaverjumd
                        --5-3 Z내신점수국영수과
                        , avg(case when a.subjectarea in ('60','80','70','10','20') then a.ccc else 0.00 end) zaverjume
                        from res a
                        --where gseme != '32' 
                        group by a.accountid, a.grade, a.semester 
                    )
                    , res3 as (
                        select a.accountid
                            , (select count(*) from res2 z2 where z2.accountid = a.accountid) as cc --등급합
                            , a.grade --학년
                            , a.semester
                            , round(sum(averageaa / NULLIF(averageab, 0) + 0.00), 2) as avera --내신전교과
                            , round(sum(averageba / NULLIF(averagebb, 0) + 0.00), 2) as averb --내신국영수사과한국사
                            , round(sum(averageca / NULLIF(averagecb, 0) + 0.00), 2) as averc --내신국영수사과
                            , round(sum(averageda / NULLIF(averagedb, 0) + 0.00), 2) as averd --내신국영수사
                            , round(sum(averageea / NULLIF(averageeb, 0) + 0.00), 2) as avere --내신국영수과                            
                            , round(sum(zaverageaa / NULLIF(zaverageab, 0) + 0.00), 2) as averf --Z백분위환산내신전교과
                            , round(sum(zaverageba / NULLIF(zaveragebb, 0) + 0.00), 2) as averg --Z백분위환산내신국영수사과한국사
                            , round(sum(zaverageca / NULLIF(zaveragecb, 0) + 0.00), 2) as averh --Z백분위환산내신국영수사과
                            , round(sum(zaverageda / NULLIF(zaveragedb, 0) + 0.00), 2) as averi --Z백분위환산내신국영수사
                            , round(sum(zaverageea / NULLIF(zaverageeb, 0) + 0.00), 2) as averj --Z백분위환산내신국영수과
                            , round(avg(zaverjuma), 2) as averk --Z내신점수
                            , round(avg(zaverjumb), 2) as averl --Z내신점수
                            , round(avg(zaverjumc), 2) as averm --Z내신점수
                            , round(avg(zaverjumd), 2) as avern --Z내신점수
                            , round(avg(zaverjume), 2) as avero --Z내신점수
                        from res2 a
                        group by a.accountid, a.grade, a.semester
                    )
                    , res4 as (
                    select m.id, 
                    case when cast(a.accountid as varchar) = m.account then '0' else '1' end as gubun,
                    case when cast(a.accountid as varchar) = m.account then m.user_name else substring(m.user_name, 1, 1) || '**' end as user_name, 
                    --Z백분위환산내신
                    sum(	
                        case when cc = '5' or cc = '6' then cast(averf as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                            when cc = '4' then cast(averf as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '3' then cast(averf as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '2' then cast(averf as float) / 2
                            else cc end 
                    ) as z_grade1, --전교과
                    sum(	
                        case when cc = '5' or cc = '6' then cast(averg as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                            when cc = '4' then cast(averg as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '3' then cast(averg as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '2' then cast(averg as float) / 2
                            else cc end 
                    ) as z_grade2, --국영수사과한국사
                    sum(	
                        case when cc = '5' or cc = '6' then cast(averh as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                            when cc = '4' then cast(averh as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '3' then cast(averh as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '2' then cast(averh as float) / 2
                            else cc end 
                    ) as z_grade3, --국영수사과
                    sum(	
                        case when cc = '5' or cc = '6' then cast(averi as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                            when cc = '4' then cast(averi as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '3' then cast(averi as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '2' then cast(averi as float) / 2
                            else cc end 
                    ) as z_grade4, --국영수사
                    sum(	
                        case when cc = '5' or cc = '6' then cast(averj as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.4 end
                            when cc = '4' then cast(averj as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '3' then cast(averj as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                            when cc = '2' then cast(averj as float) / 2
                            else cc end 
                    ) as z_grade5 --국영수과
                    --내신
                    , sum(case when cc = '5' or cc = '6' then cast(avera as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(avera as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(avera as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(avera as float) / 2
                               else cc end ) as avera --전교과
                    , sum(case when cc = '5' or cc = '6' then cast(averb as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(averb as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(averb as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(averb as float) / 2
                               else cc end ) as averb --국영수사과한국사
                    , sum(case when cc = '5' or cc = '6' then cast(averc as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(averc as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(averc as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(averc as float) / 2
                               else cc end ) as averc --국영수사과
                    , sum(case when cc = '5' or cc = '6' then cast(averd as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(averd as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(averd as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(averd as float) / 2
                               else cc end ) as averd --국영수사
                    , sum(case when cc = '5' or cc = '6' then cast(avere as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(avere as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(avere as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(avere as float) / 2
                               else cc end ) as avere --국영수과
                    --Z내신점수                                              
                    , sum(case when cc = '5' or cc = '6' then cast(averk as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(averk as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(averk as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(averk as float) / 2
                               else cc end) as averk --내신Z점수
                    , sum(case when cc = '5' or cc = '6' then cast(averl as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(averl as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(averl as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(averl as float) / 2
                               else cc end) as averl
                    , sum(case when cc = '5' or cc = '6' then cast(averm as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(averm as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(averm as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(averm as float) / 2
                               else cc end) as averm
                    , sum(case when cc = '5' or cc = '6' then cast(avern as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(avern as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(avern as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(avern as float) / 2
                               else cc end) as avern
                    , sum(case when cc = '5' or cc = '6' then cast(avero as float) / case when a.grade = '3' then 1 else 2 end * case when a.grade = '1' then 0.20 else 0.40 end
                               when cc = '4' then cast(avero as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '3' then cast(avero as float) / 2 * case when a.grade = '1' then 2/6 else 4/6 end
                               when cc = '2' then cast(avero as float) / 2
                               else cc end) as avero
                    from res3 a
                        ,members m
                    where cast(a.accountid as varchar) = m.account
                    group by m.id, a.accountid, m.account, m.user_name 
                    )
                    select --Z백분위환산내신
                            b.subjectare,
                            b.code,
                            a.id,
                            a.user_name,  
                            --내신등급평균
                            round(case when b.subjectare = '전교과' then cast(avera as numeric)
                                when b.subjectare = '국영수사과한' then cast(averb as numeric)
                                when b.subjectare = '국영수사과' then cast(averc as numeric)
                                when b.subjectare = '국영수사' then cast(averd as numeric)
                                when b.subjectare = '국영수과' then cast(avere as numeric) else 0 end, 2) as grade1,
                            --내신백분위
                            round(cast(case when b.subjectare = '전교과' then get_gradetopercent(cast(avera as float)) + 0.00
                                when b.subjectare = '국영수사과한' then get_gradetopercent(cast(averb as float)) + 0.00
                                when b.subjectare = '국영수사과' then get_gradetopercent(cast(averc as float)) + 0.00
                                when b.subjectare = '국영수사' then get_gradetopercent(cast(averd as float)) + 0.00
                                when b.subjectare = '국영수과' then get_gradetopercent(cast(avere as float)) + 0.00 else 0.00 end as numeric), 2) as grade2,
                            --내신Z점수
                            round(case when b.subjectare = '전교과' then cast(averk as numeric)
                                when b.subjectare = '국영수사과한' then cast(averl as numeric)
                                when b.subjectare = '국영수사과' then cast(averm as numeric)
                                when b.subjectare = '국영수사' then cast(avern as numeric)
                                when b.subjectare = '국영수과' then cast(avero as numeric) else 0 end, 2) as grade3,
                            --Z점수백분위
                            round(cast(case when b.subjectare = '전교과' then gert_zpercent(round(cast(averk as numeric), 1))
                                when b.subjectare = '국영수사과한' then gert_zpercent(round(cast(averl as numeric), 1))
                                when b.subjectare = '국영수사과' then gert_zpercent(round(cast(averm as numeric), 1))
                                when b.subjectare = '국영수사' then gert_zpercent(round(cast(avern as numeric), 1))
                                when b.subjectare = '국영수과' then gert_zpercent(round(cast(avero as numeric), 1)) else 0.00 end as numeric), 2) as grade4,
                            --Z점수환산내신
                            round(cast(case when b.subjectare = '전교과' then z_grade1
                                when b.subjectare = '국영수사과한' then z_grade2
                                when b.subjectare = '국영수사과' then z_grade3
                                when b.subjectare = '국영수사' then z_grade4
                                when b.subjectare = '국영수과' then z_grade5 else 0 end as numeric), 2) as grade5,
                            --Z점수분위 환산내신-내신등급 평균
                            round(cast(case when b.subjectare = '전교과' then z_grade1
                                when b.subjectare = '국영수사과한' then z_grade2
                                when b.subjectare = '국영수사과' then z_grade3
                                when b.subjectare = '국영수사' then z_grade4
                                when b.subjectare = '국영수과' then z_grade5 else 0 end - 
                            case when b.subjectare = '전교과' then avera
                                when b.subjectare = '국영수사과한' then averb
                                when b.subjectare = '국영수사과' then averc
                                when b.subjectare = '국영수사' then averd
                                when b.subjectare = '국영수과' then avere else 0 end as numeric), 2) as grade6 
                    from res4 a
                        ,(select '전교과'     as subjectare, 'B' as code union all
                        select '국영수사과한' as subjectare, 'C' as code union all
                        select '국영수사과'  as subjectare, 'D' as code union all
                        select '국영수사'    as subjectare, 'E' as code union all
                        select '국영수과'    as subjectare, 'F' as code ) b
                    where ((coalesce($2, 'A') = 'A' and (1=1)) or (coalesce($2, 'A') != 'A' and (b.code = $2)))
                    ;

            `, [ id, dvcd ]
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
