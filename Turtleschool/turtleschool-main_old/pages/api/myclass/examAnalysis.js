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

  let str_dvcd = req.query.dvcd; //type

  switch (req.method) {
    case 'GET':
      const {dvcd, plnrid, cls, id} = {
        dvcd: str_dvcd,
        plnrid: rows[0].plnrid,
        cls: rows[0].cls,
        id: rows[0].id,
      };

      rows = await pool.query(
        `
                    with res as (
                        select "memberId",
                        --원점수
                            sum(Case when "subjectArea" in ('10','20') then "percentScore"/2
                            else "percentScore" end) as all_score,
                            sum(case when "subjectArea" = '60' then "originScore" else 0 end) as korea_score,
                            sum(case when "subjectArea" = '80' then "originScore" else 0 end) as english_score,
                            sum(case when "subjectArea" = '70' then "originScore" else 0 end) as math_score,
                            sum(case when "subjectArea" = '20' then "originScore" else 0 end) as sci_score,
                            sum(case when "subjectArea" = '10' then "originScore" else 0 end) as soc_score,
                        --등급
                            round(avg("grade"), 1) as all_grade,
                            sum(case when "subjectArea" = '60' then "grade" else 0 end) as korea_grade,
                            sum(case when "subjectArea" = '80' then "grade" else 0 end) as english_grade,
                            sum(case when "subjectArea" = '70' then "grade" else 0 end) as math_grade,
                            sum(case when "subjectArea" = '20' then "grade" else 0 end) as sci_grade,
                            sum(case when "subjectArea" = '10' then "grade" else 0 end) as soc_grade,
                        --표준점수
                            sum(Case when "subjectArea" in ('80') then "standardScore"/2
                            else "percentScore" end) as all_standardScore,
                            sum(case when "subjectArea" = '60' then "standardScore" else 0 end) as korea_standardScore,
                            sum(case when "subjectArea" = '80' then "standardScore" else 0 end) as english_standardScore,
                            sum(case when "subjectArea" = '70' then "standardScore" else 0 end) as math_standardScore,
                            sum(case when "subjectArea" = '20' then "standardScore" else 0 end) as sci_standardScore,
                            sum(case when "subjectArea" = '10' then "standardScore" else 0 end) as soc_standardScore,
                        --
                            count(*) as cc
                        from exams e
                        where "typeId" = $1
                        and "memberId" in (select id from plannermanagement where to_char(current_date, 'yyyyMMdd') between strdt and coalesce(enddt, '99991231') and useyn = 'Y' and plnrid = $2 and cls = $3)
                        group by "memberId"
                    )
                    select b.id, case when $4 = b.id then b.user_name else substring(b.user_name , 1, 1) || '**' end user_name,
                        all_score, korea_score, english_score, math_score, sci_score, soc_score,
                        all_grade, korea_grade, english_grade, math_grade, sci_grade, soc_grade,
                        all_standardScore, korea_standardScore, english_standardScore, math_standardScore, sci_standardScore, soc_standardScore
                    from res a
                        ,members b
                    where a."memberId" = b.id
                    order by a."memberId"
                    ;
                `,
        [dvcd, plnrid, cls, id],
      );

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.json({success: false, msg: 'No data', data: null});
        res.statusCode = 406;
        res.end();
        return;
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
};
