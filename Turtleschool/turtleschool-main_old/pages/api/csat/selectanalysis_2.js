import pool from '../../../lib/pool';

/*
    - title:
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
  let s_division = req.query.division;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

            with res as (
              select
              	 sum(case when substring(subject_a, 1, 1) = '6' then standardscore else 0 end) as korea_standard,
              	 sum(case when substring(subject_a, 1, 1) = '6' then percentage else 0 end) as korea_percentage,
              	 sum(case when substring(subject_a, 1, 1) = '7' then standardscore else 0 end) as math_standard,
              	 sum(case when substring(subject_a, 1, 1) = '7' then percentage else 0 end) as math_percentage,
              	 sum(case when substring(subject_a, 1, 1) in ('1', '2') then standardscore else 0 end) as ex_standard,
              	 sum(case when substring(subject_a, 1, 1) in ('1', '2') then percentage else 0 end) as ex_percentage,
                 (select max(case when substring(subject_a, 1, 1) = '1' then '0'
          			  when substring(subject_a, 1, 1) = '2' then '1'
          			  else '' end) as division
          from csatidscore z where z.memberid = $1 and division = $2 and year = cast($3 as varchar) and subject_a != '1G') as division
              from csatidscore c
              where memberid = $1
              and division = $2 --발표전
              and year = cast($3 as varchar)
              and useyn = 'Y'
              and coalesce(subject_a, '*') not in ('1G')
              and coalesce(subject_b, '*') not in ('1G')
            )
            select '1' as sort,
            	   round(korea_standard, 1) as korea_standard, round(korea_percentage, 1) as korea_percentage,
            	   round(math_standard, 1) as math_standard, round(math_percentage, 1) as math_percentage,
            	   round(ex_standard, 1) as ex_standard, round(ex_percentage, 1) as ex_percentage,
            	   round(korea_standard + math_standard + ex_standard, 1) as sum_standard,
            	   round(korea_percentage + math_percentage + ex_percentage, 1) as sum_percentage,
                 get_sumstandard_cumulative(korea_standard + math_standard + ex_standard, '1') as cumulative
            from res
            union all
            select '2' as sort,
            	   25 as korea_standard, 25 as korea_percentage,
            	   40 as math_standard, 40 as math_percentage,
            	   35 as ex_standard, 35 as ex_percentage,
            	   null as sum_standard,
            	   null as sum_percentage,
                 null
            union all
            select '3' as sort,
            	   round(korea_standard * 0.25 * 3, 1), round(korea_percentage * 0.25 * 3, 1),
            	   round(math_standard * 0.40 * 3, 1), round(math_percentage * 0.40 * 3, 1),
            	   round(ex_standard * 0.35, 1), round(ex_percentage * 0.35, 1),
            	   round(korea_standard * 0.25 * 3 + math_standard * 0.40 * 3 + ex_standard * 0.35 * 3, 1) as sum_standard,
            	   round(korea_percentage * 0.25 * 3 + math_percentage * 0.40 * 3 + ex_percentage * 0.35 * 3, 1) as sum_percentage,
                 get_sumstandard_cumulative(round(korea_standard * 0.25 * 3 + math_standard * 0.40 * 3 + ex_standard * 0.35 * 3, 1), '1') as cumulative
            from res
            union all
            select '4' as sort,
            	   30 as korea_standard, 30 as korea_percentage,
            	   40 as math_standard, 40 as math_percentage,
            	   30 as ex_standard, 30 as ex_percentage,
            	   null as sum_standard,
            	   null as sum_percentage,
                 null
            union all
            select '5' as sort,
            	   round(korea_standard * 0.30 * 3, 1), round(korea_percentage * 0.30 * 3, 1),
            	   round(math_standard * 0.40 * 3, 1), round(math_percentage * 0.40 * 3, 1),
            	   round(ex_standard * 0.30 * 3, 1), round(ex_percentage * 0.30 * 3, 1),
            	   round(korea_standard * 0.30 * 3 + math_standard * 0.40 * 3 + ex_standard * 0.30 * 3, 1) as sum_standard,
            	   round(korea_percentage * 0.30 * 3 + math_percentage * 0.40 * 3 + ex_percentage * 0.30 * 3, 1) as sum_percentage,
                 get_sumstandard_cumulative(round(korea_standard * 0.30 * 3 + math_standard * 0.40 * 3 + ex_standard * 0.30 * 3, 1), '1') as cumulative
            from res
            union all
            select '6' as sort,
            	   36.7 as korea_standard, 36.7 as korea_percentage,
            	   43.3 as math_standard, 43.3 as math_percentage,
            	   20 as ex_standard, 20 as ex_percentage,
            	   null as sum_standard,
            	   null as sum_percentage,
                 null
            union all
            select '7' as sort,
            	   round(korea_standard * 0.367 * 3, 1), round(korea_percentage * 0.367 * 3, 1),
            	   round(math_standard * 0.433 * 3, 1), round(math_percentage * 0.433 * 3, 1),
            	   round(ex_standard * 0.20 * 3, 1), round(ex_percentage * 0.20 * 3, 1),
            	   round(korea_standard * 0.367 * 3 + math_standard * 0.433 * 3 + ex_standard * 0.20 * 3, 1) as sum_standard,
            	   round(korea_percentage * 0.367 * 3 + math_percentage * 0.433 * 3 + ex_percentage * 0.20 * 3, 1) as sum_percentage,
                 get_sumstandard_cumulative(round(korea_standard * 0.367 * 3 + math_standard * 0.433 * 3 + ex_standard * 0.20 * 3, 1), '1') as cumulative
            from res
            union all
            select '8' as sort,
            	   33.33 as korea_standard, 33.33 as korea_percentage,
            	   40 as math_standard, 40 as math_percentage,
            	   26.67 as ex_standard, 26.67 as ex_percentage,
            	   null as sum_standard,
            	   null as sum_percentage,
                 null
            union all
            select '9' as sort,
            	   round(korea_standard * 0.3333 * 3, 1), round(korea_percentage * 0.3333 * 3, 1),
            	   round(math_standard * 0.40 * 3, 1), round(math_percentage * 0.40 * 3, 1),
            	   round(ex_standard * 0.2667 * 3, 1), round(ex_percentage * 0.2667 * 3, 1),
            	   round(korea_standard * 0.3333 * 3 + math_standard * 0.40 * 3 + ex_standard * 0.2667 * 3, 1) as sum_standard,
            	   round(korea_percentage * 0.3333 * 3 + math_percentage * 0.40 * 3 + ex_percentage * 0.2667 * 3, 1) as sum_percentage,
                 get_sumstandard_cumulative(round(korea_standard * 0.3333 * 3 + math_standard * 0.40 * 3 + ex_standard * 0.2667 * 3, 1), '1') as cumulative
            from res
            order by sort
                `,
        [req.headers.auth, s_division, s_year],
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
