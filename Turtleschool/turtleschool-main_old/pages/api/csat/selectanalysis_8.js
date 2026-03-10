import pool from '../../../lib/pool';

/*
    - title:과목별원점수 입력시 표준점수 등급 조회
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.status(406).json({success: false, msg: 'No authorization', data: null});
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];
  let s_year = req.query.year;
  let s_array_score = req.query.array_score;

  /*
              with res as (
                select c.division ,
                     case when subject_b in ('60') then subject_b else c.subject end as subject,
                     c.original_score_a ,
                     c.original_score_b,
                     c.standard_score,
                     c.percentage_score
                from csatsspu c
                  ,(  select split_part(score, ',', 1) as subject_a, split_part(score, ',', 2) as score_a,
                         split_part(score, ',', 3) as subject_b, split_part(score, ',', 4) as score_b,
                         split_part(score, ',', 5) as percentage_score
                      from (
                        --'6F,74,60,20|7F,69,70,7|81,77|2E,44|2F,233|1G,42'
                    select unnest(string_to_array($1, '|')) as score
                    ) as z1) z
                where c.division = '1' --1표준점수 2등급 백분위
                and c.use_yn = 'Y'
                and c."year" = $2
                and c.subject  = z.subject_a
                and c.original_score_a = z.score_a
                and c.original_score_b = case when substring(c.subject, 1, 1) in ('6', '7') then z.score_b else c.original_score_b end
              )
                select
                  r2.subject,
                  r2.original_score_a , r2.original_score_b,
                  cast(r2.standard_score as numeric) as standard_score,
                  cast(c2.percentage_score as numeric) as percentage_score,
                  c2.rating_score, c2.cumulative
                from res r2
                    ,csatsspu c2
                where c2.division = '2' ----1표준점수 2등급 백분위
                  and c2.use_yn = 'Y'
                  and c2."year" = $2 --$1
                  and r2.subject = c2.subject
                  --and substring(r2.subject , 1, 1) in ('1', '2', '6', '7', '8', '9')
                  and cast(r2.standard_score as numeric) = cast(c2.standard_score as numeric)
      */

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

          select b.division, b.area, a.subject,
                 --b.standard_score, b.percentage_score,
                 case when substring(a.subject, 1, 1) in ('8','9') or a.subject = '1G'
                      then null else b.standard_score end standard_score,
                 case when substring(a.subject, 1, 1) in ('8','9') or a.subject = '1G'
                      then null else b.percentage_score end percentage_score,
                 b.rating_score, b.cumulative,
                 null as original_score_a, null as original_score_b
          from
          (
          	select case when substring(split_part(score, ',', 1), 1, 1) IN ('6', '7') then SUBSTRING(SPLIT_PART(SCORE,',',1), 1, 1) || '0' else split_part(score, ',', 1) end as subject,
          	   	   split_part(score, ',', 2) as standard_score,
          	   	   split_part(score, ',', 3) as rating_score
                   --'6H,135,|7I,139,|81,,2|1G,,1|19,66,|99,,1'
          	from (select unnest(string_to_array($1, '|')) as score) as aa
          ) as a
          , csatsspu b
          where a.subject = b.subject
          and a.standard_score = case when a.subject in ('81', '1G') or substring(a.subject, 1, 1) = '9' then a.standard_score else b.standard_score end
          and a.rating_score = case when a.subject in ('81', '1G') or substring(a.subject, 1, 1) = '9' then b.rating_score else a.rating_score end
          and b.use_yn = 'Y'
          and b.year = $2
          and b.division = '2'
          order by b.division, a.subject
          ;
                `,
        [s_array_score, s_year],
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

  res.status(statusCode).json({success: success, msg: msg, data: data});
  res.end();
};
