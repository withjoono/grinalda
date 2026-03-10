
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 내신 성적관리 > 내신 성적변동분석 > 성적 변동 추이
    - title: 내신 성적관리 > 교과분석 > 내신평균 > 학기별내신, 과목별/조합별 성적 변동 추이
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
    let str_dvsn = req.query.dvsn;  //조회구분자

    switch (req.method) {
        case 'GET':
            const { id, dvsn } = { id: rows[0].id, dvsn: str_dvsn }

        rows = await pool.query(`
                        with res as (
                            select m.id, m.user_name , g.grade ,g.semester , round(sum(g.unit * g."rank" + 0.00) / sum(g.unit + 0.00), 1) as averagegrade
                            from  gpa g
                                ,members m 
                            where g.accountid = m.id 
                            --and m."relationCode" = '10' --학생
                            and m.id = $1
                            and (
                                (($2='A') and (1=1)) --1.전교과
                                or (($2='B') and (g.subjectarea in ('60','80','70','10'))) --2.국영수사 
                                or (($2='C') and (g.subjectarea in ('60','80','70','20')))  --3.국영수과
                                or (($2='D') and (g.subjectarea in ('60','80','70','20') and case when g.subjectarea = '10' then g.subjectcode = '12' else 1=1 end)) --4.국영수사+통합과학,통합사회
                                or (($2='E') and (g.subjectarea in ('60','80','70','20') and case when g.subjectarea = '20' then g.subjectcode = '20' else 1=1 end)) --5.국영수과+통합과학,통합사회
                                or (($2='F') and (g.subjectarea in ('60','80','70','10','20'))) --6.국영수사과
                                or (($2='G') and (g.subjectarea in ('60','80','70'))) --7.국영수
                                or (($2='H') and (g.subjectarea = '60' )) --8.국어
                                or (($2='I') and (g.subjectarea = '80' )) --9.영어
                                or (($2='J') and (g.subjectarea = '70' )) --10.수학
                                or (($2='K') and (g.subjectarea in ('10','20'))) --11.탐구
                                or (($2='L') and (g.subjectarea in ('60','80','70','10','20') )) --11.국영수탐구
                               )
                            group by m.id, m.user_name , g.grade ,g.semester
                        ) 
                        select id, user_name 
                            ,sum(case when grade = '1' and semester = '1' then averagegrade else 0.00 end) as averagegradea
                            ,sum(case when grade = '1' and semester = '2' then averagegrade else 0.00 end) as averagegradeb
                            ,sum(case when grade = '2' and semester = '1' then averagegrade else 0.00 end) as averagegradec
                            ,sum(case when grade = '2' and semester = '2' then averagegrade else 0.00 end) as averagegraded
                            ,sum(case when grade = '3' and semester = '1' then averagegrade else 0.00 end) as averagegradee
                            ,sum(case when grade = '3' and semester = '2' then averagegrade else 0.00 end) as averagegradef
                            from res
                        group by id, user_name
                        order by id
                        ;
                `, [id, dvsn]
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
