
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 플래너모의고사시험
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
    const str_dvsn = req.query.dvsn;
    const str_type = req.query.type;
    const str_year = req.query.year;

    switch (req.method) {
        case 'GET':
            const { plnrid, dvsn, cls, gradecode, typecode, yearcode, id} = { plnrid: rows[0].plnrid,  dvsn: str_dvsn, cls: rows[0].cls, gradecode: rows[0].gradecode, typecode: str_type, yearcode: str_year, id: rows[0].id}

            let { rows } = await pool.query(`
                with res as (
                    select '1' as gubun
                        , p.id 				--학생id
                        , m.user_name 		--학생명
                        , p.plnrid  		--플래너id
                        , p."gradeCode"  	--학년
                        , p.cls 			--반코드
                        , e."originScore"	--원점수
                        , e."standardScore"	--표준점수
                        , e."percentScore"	--백분위
                        , e.grade 			--등급
                        , case when e."subjectArea" = '60'                           then coalesce(e."originScore", 0)   else 0 end as "nlos"   --국어원점수
                        , case when e."subjectArea" = '70'                           then coalesce(e."originScore", 0)   else 0 end as "maos"   --수학원점수
                        , case when e."subjectArea" = '10' or e."subjectArea" = '20' then coalesce(e."originScore", 0)   else 0 end as "exos"   --탐구원점수
                        , case when e."subjectArea" = '60'                           then coalesce(e.grade, 0)           else 0 end as "nlg"    --국어등급
                        , case when e."subjectArea" = '70'                           then coalesce(e.grade, 0)           else 0 end as "mag"	--수학등급
                        , case when e."subjectArea" = '10' or e."subjectArea" = '20' then coalesce(e.grade, 0)           else 0 end as "exg"	--탐구등급
                        , case when e."subjectArea" = '80'                           then coalesce(e.grade, 0)           else 0 end as "eng"	--영어등급
                        , case when e."subjectArea" = '60'                           then coalesce(e."standardScore", 0) else 0 end as "nlss"	--국어표준점수
                        , case when e."subjectArea" = '70'                           then coalesce(e."standardScore", 0) else 0 end as "mass"	--수학표준점수
                        , case when e."subjectArea" = '10' or e."subjectArea" = '20' then coalesce(e."standardScore", 0) else 0 end as "exss"	--탐구표준점수
                        , case when e."subjectArea" = '60'                           then coalesce(e."percentScore", 0)  else 0 end as "nlp"	--국어백분위
                        , case when e."subjectArea" = '70'                           then coalesce(e."percentScore", 0)  else 0 end as "map"	--수학백분위
                        , case when e."subjectArea" = '10' or e."subjectArea" = '20' then coalesce(e."percentScore", 0)  else 0 end as "exp"	--탐구백분위
                    from plannermanagement p
                        ,exams e
                        ,members m
                        ,"codeExams" z
                    where p.cls = $2
                    and p.plnrid = $3
                    and p.useyn = 'Y'
                    and p.id = e."memberId"
                    and p.id = m.id
                    and m."relationCode" != '70'
                    and ((coalesce($6, '1')='1' and 1=1) or (coalesce($6, '1')!='1' and z.year = $6))
                    and z.grade = $1
                    and z.id = e."typeId"
                    and ((coalesce($5, '1')='1' and 1=1) or (coalesce($5, '1')!='1' and z.id = $5))

                    union all
                    select '0' as gubun
                        , m2.id 				--학생id
                        , m2.user_name 		--학생명
                        , m2.id  		--플래너id
                        , '' gradeCode  	--학년
                        , '' cls 			--반코드
                        , e2."originScore"	--원점수
                        , e2."standardScore"	--표준점수
                        , e2."percentScore"	--백분위
                        , e2.grade 			--등급
                        , case when e2."subjectArea" = '60'                           then coalesce(e2."originScore", 0)   else 0 end as "nlos"   --국어원점수
                        , case when e2."subjectArea" = '70'                           then coalesce(e2."originScore", 0)   else 0 end as "maos"   --수학원점수
                        , case when e2."subjectArea" = '10' or e2."subjectArea" = '20' then coalesce(e2."originScore", 0)   else 0 end as "exos"   --탐구원점수
                        , case when e2."subjectArea" = '60'                           then coalesce(e2.grade, 0)           else 0 end as "nlg"    --국어등급
                        , case when e2."subjectArea" = '70'                           then coalesce(e2.grade, 0)           else 0 end as "mag"	--수학등급
                        , case when e2."subjectArea" = '10' or e2."subjectArea" = '20' then coalesce(e2.grade, 0)           else 0 end as "exg"	--탐구등급
                        , case when e2."subjectArea" = '80'                           then coalesce(e2.grade, 0)           else 0 end as "eng"	--영어등급
                        , case when e2."subjectArea" = '60'                           then coalesce(e2."standardScore", 0) else 0 end as "nlss"	--국어표준점수
                        , case when e2."subjectArea" = '70'                           then coalesce(e2."standardScore", 0) else 0 end as "mass"	--수학표준점수
                        , case when e2."subjectArea" = '10' or e2."subjectArea" = '20' then coalesce(e2."standardScore", 0) else 0 end as "exss"	--탐구표준점수
                        , case when e2."subjectArea" = '60'                           then coalesce(e2."percentScore", 0)  else 0 end as "nlp"	--국어백분위
                        , case when e2."subjectArea" = '70'                           then coalesce(e2."percentScore", 0)  else 0 end as "map"	--수학백분위
                        , case when e2."subjectArea" = '10' or e2."subjectArea" = '20' then coalesce(e2."percentScore", 0)  else 0 end as "exp"	--탐구백분위
                    from exams e2
                        ,members m2
                        ,"codeExams" z2
                    where e2."memberId" = m2.id
                    and m2.id = $3
                    and m2."relationCode" = '70'
                    and ((coalesce($6, '1')='1' and 1=1) or (coalesce($6, '1')!='1' and z2.year = $6))
                    and z2.grade = $1
                    and z2.id = e2."typeId"
                    and ((coalesce($5, '1')='1' and 1=1) or (coalesce($5, '1')!='1' and z2.id = $5))
                    )
                    select id, plnrid , "gradeCode" , cls,
                           case when $7 = id then user_name else substring(user_name, 1, 1) || '**' end as user_name,
                           case when $4 = 'A' then sum("nlos") + sum("maos") + sum("exos")
                                when $4 = 'B' then sum("nlg") + sum("eng") + sum("mag") + sum("exg")
                                when $4 = 'C' then sum("nlss") + sum("mass") + sum("exss")
                                when $4 = 'D' then sum("nlp") + sum("map") + (sum("exp") / 2)
                                else 0 end as "score"
                    from res a
                    group by gubun, id, case when $7 = id then user_name else substring(user_name, 1, 1) || '**' end, plnrid , "gradeCode" , cls
                    order by gubun, score, id
                    ;
                `, [gradecode, cls, plnrid, dvsn, typecode, yearcode, id]
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
