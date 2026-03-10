import pool from '../../../lib/pool';

/*
    - title: 플래너모의고사시험
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(
    `
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
                    and m.account = $1 `,
    [req.headers.auth],
  );
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  if (rows[0].payyn != 'Y') {
    res.json({success: false, msg: 'No Account', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];
  const str_dvsn = req.query.dvsn;

  switch (req.method) {
    case 'GET':
      const {plnrid, dvsn, cls, gradecode, id} = {
        plnrid: rows[0].plnrid,
        dvsn: str_dvsn,
        cls: rows[0].cls,
        gradecode: rows[0].gradecode,
        id: rows[0].id,
      };

      let {rows} = await pool.query(
        `
                    with res as (
                        select --학생정보
                            '1' as gubun,
                            p.id, 				--학생id
                            m.user_name ,		--학생명
                            p.plnrid , 			--플래너id
                            p."gradeCode" , 	--학년
                            p.cls ,				--반코드
                            case when e."subjectArea" = '60' then e."percentScore" --국어
                                when e."subjectArea" = '70' then e."percentScore" --수학
                                when e."subjectArea" = '10' or e."subjectArea" = '20' then e."percentScore" --탐구
                                when e."subjectArea" = '80' then e.grade --영어
                                else 0 end as score
                            , z."type"
                            , e."originScore"
                            , e."standardScore"
                            , e."percentScore"
                            , e.grade
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
                        and m.id = $5
                        and p."gradeCode" = $1
                        and e."typeId" = z.id
                        and z."year" = cast(to_char(current_date, 'yyyy') as float)
                        and z.id in (select id from "codeExams" ce where year = cast(to_char(current_date, 'yyyy') as float) and grade = $1)
                        and ((coalesce($4, '1')='1' and e."subjectArea" in ('10', '20', '60', '70', '80'))
                        or (coalesce($4, '1') in ('10', '20') and e."subjectArea" in ('10', '20')) --탐구
                        or (coalesce($4, '1') not in ('1', '10', '20') and e."subjectArea" = $4))

                        union all --플래너정보

                        select '0' as gubun,
                            m2.id, 				--학생id
                            m2.user_name ,		--학생명
                            m2.id , 			--플래너id
                            '' gradeCode , 	--학년
                            '' cls ,				--반코드
                            case when e2."subjectArea" = '60' then e2."percentScore" --국어
                                when e2."subjectArea" = '70' then e2."percentScore" --수학
                                when e2."subjectArea" = '10' or e2."subjectArea" = '20' then e2."percentScore" --탐구
                                when e2."subjectArea" = '80' then e2.grade --영어
                                else 0 end as score
                            , z2."type"
                            , e2."originScore"
                            , e2."standardScore"
                            , e2."percentScore"
                            , e2.grade
                        from exams e2
                            ,members m2
                            ,"codeExams" z2
                        where m2.id = $3
                        and e2."memberId" = m2.id
                        and m2."relationCode" = '70'
                        and e2.grade = $1
                        and e2."typeId" = z2.id
                        and z2."year" = cast(to_char(current_date, 'yyyy') as float)
                        and z2.id in (select id from "codeExams" ce where year = cast(to_char(current_date, 'yyyy') as float) and grade = $1)
                        and ((coalesce($4, '1')='1' and e2."subjectArea" in ('10', '20', '60', '70', '80'))
                        or (coalesce($4, '1') in ('10', '20') and e2."subjectArea" in ('10', '20')) --탐구
                        or (coalesce($4, '1') not in ('1', '10', '20') and e2."subjectArea" = $4))
                    )
                    select gubun, id, plnrid , "gradeCode" , cls,
                    case when $5 = id then user_name else substring(user_name, 1, 1) || '**' end as user_name,
                    sum(score) as score,
                    RANK () OVER (ORDER BY sum(score)) as rrank
                    /*
                        sum(case when "type" like '3%' then score else 0 end) as m_march_s,         --3월 과목별모의점수
                        sum(case when "type" like '6%' then score else 0 end) as m_june_s,          --6월 과목별모의점수
                        sum(case when "type" like '9%' then score else 0 end) as m_september_s,     --9월 과목별모의점수
                        sum(case when "type" like '11%' then score else 0 end) as m_november_s,     --11월 과목별모의점수
                        sum(case when "type" like '3%' then "originScore" else 0 end) as m_march_o,   --3월 원점수
                        sum(case when "type" like '6%' then "originScore" else 0 end) as m_june_o,    --6월 원점수
                        sum(case when "type" like '9%' then "originScore" else 0 end) as m_september_o,--9월 원점수
                        sum(case when "type" like '11%' then "originScore" else 0 end) as m_november_o,--11월 원점수
                        sum(case when "type" like '3%' then "standardScore" else 0 end) as m_march_t,
                        sum(case when "type" like '6%' then "standardScore" else 0 end) as m_june_t,
                        sum(case when "type" like '9%' then "standardScore" else 0 end) as m_september_t,
                        sum(case when "type" like '11%' then "standardScore" else 0 end) as m_november_t,
                        sum(case when "type" like '3%' then "percentScore" else 0 end) as m_march_p,
                        sum(case when "type" like '6%' then "percentScore" else 0 end) as m_june_p,
                        sum(case when "type" like '9%' then "percentScore" else 0 end) as m_september_p,
                        sum(case when "type" like '11%' then "percentScore" else 0 end) as m_november_p,
                        sum(case when "type" like '3%' then grade else 0 end) as m_march_g,         --3월 등급
                        sum(case when "type" like '6%' then grade else 0 end) as m_june_g,          --6월 등급
                        sum(case when "type" like '9%' then grade else 0 end) as m_september_g,     --9월 등급
                        sum(case when "type" like '11%' then grade else 0 end) as m_november_g      --11월 등급
                    */
                    from res a
                    group by gubun, id, case when $5 = id then user_name else substring(user_name, 1, 1) || '**' end, plnrid , "gradeCode" , cls
                    order by gubun, sum(score), id
                    ;
                `,
        [gradecode, cls, plnrid, dvsn, id],
      );

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
};
