
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 내신 성적관리 > 내신성적분석 > 내신 성적변동분석
    - params:

*/
export default async (req, res) => {
    let { rows } = await pool.query(`select id, case when "gradeCode" = 'H1' then '1' when "gradeCode" = 'H2' then '2' else '3' end as grade
                                     from members where account = $1`, [req.headers.auth])
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
            const { id, grade } = { id: rows[0].id, grade: rows[0].grade}

             rows  = await pool.query(`
                    with res as (
                        select m.id, m.user_name , g.grade ,g.semester 
                        , sum(g.unit * g."rank" + 0.00) as averagegradeaa 
                        , sum(g.unit + 0.00) as averagegradeab
                        , sum(case when g.subjectarea in ('60','80','70','10') then g.unit * g."rank" else 0.00 end) averagegradeba
                        , sum(case when g.subjectarea in ('60','80','70','10') then g.unit else 0.00 end) averagegradebb
                        , sum(case when g.subjectarea in ('60','80','70','20') then g.unit * g."rank" else 0.00 end) averagegradeca
                        , sum(case when g.subjectarea in ('60','80','70','20') then g.unit else 0.00 end) averagegradecb
                        , sum(case when g.subjectarea in ('60','80','70','20') and (case when g.subjectarea = '10' then g.subjectcode = '12' else 1=1 end) then g.unit * g."rank" else 0.00 end) averagegradeda
                        , sum(case when g.subjectarea in ('60','80','70','20') and (case when g.subjectarea = '10' then g.subjectcode = '12' else 1=1 end) then g.unit else 0.00 end) averagegradedb
                        , sum(case when g.subjectarea in ('60','80','70','20') and (case when g.subjectarea = '20' then g.subjectcode = '20' else 1=1 end) then g.unit * g."rank" else 0.00 end) averagegradeea
                        , sum(case when g.subjectarea in ('60','80','70','20') and (case when g.subjectarea = '20' then g.subjectcode = '20' else 1=1 end) then g.unit else 0.00 end) averagegradeeb
                        , sum(case when g.subjectarea in ('60','80','70','10','20') then g.unit * g."rank" else 0.00 end) averagegradefa
                        , sum(case when g.subjectarea in ('60','80','70','10','20') then g.unit else 0.00 end) averagegradefb
                        , sum(case when g.subjectarea in ('60','80','70') then g.unit * g."rank" else 0.00 end) averagegradega
                        , sum(case when g.subjectarea in ('60','80','70') then g.unit else 0.00 end) averagegradegb
                            from  gpa g
                                ,members m 
                            where g.accountid = m.id
                            --and m."relationCode" = '10' --학생
                            and m.id = $1
                            --and g.grade = $2
                            --and g.semester = case when to_char(current_date, 'MM') between '01' and '06' then 1 else 2 end
                            group by m.id, m.user_name , g.grade ,g.semester, g.subjectarea , g.subjectcode
                        )
                        select id, user_name, grade, semester
                        , round(sum(averagegradeaa + 0.00) / sum(averagegradeab + 0.00), 1) as averagegradea
                        , round(sum(averagegradeba + 0.00) / sum(averagegradebb + 0.00), 1) as averagegradeb
                        , round(sum(averagegradeca + 0.00) / sum(averagegradecb + 0.00), 1) as averagegradec
                        , round(sum(averagegradeda + 0.00) / sum(averagegradedb + 0.00), 1) as averagegraded
                        , round(sum(averagegradeea + 0.00) / sum(averagegradeeb + 0.00), 1) as averagegradee
                        , round(sum(averagegradefa + 0.00) / sum(averagegradefb + 0.00), 1) as averagegradef
                        , round(sum(averagegradega + 0.00) / sum(averagegradegb + 0.00), 1) as averagegradeg
                        from res
                        group by id, user_name, grade, semester
                        order by grade, semester, id 
                            ;
                `, [id]
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
