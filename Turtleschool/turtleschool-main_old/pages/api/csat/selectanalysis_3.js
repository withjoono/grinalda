import pool from '../../../lib/pool';

/*
    - title:
    - params:
*/
// csatinteruniv;
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
  //let s_division = req.query.division;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

        with res as (
        	select case when c2.subject_a = '1G' then '1G' else substring(c2.subject_a , 1, 1) || '0' end as subject,
        		c2.division as division ,
        		c2.standardscore as standardscore ,
        		c2.percentage as percentage ,
        		c2.grade as grade ,
        		round(c3.cumulative, 1) as cumulative
        	from csatidscore c2
        	,(
        		select c.subject_a , cast((select cumulative from csatsspu z
        		  where z.subject = case when substring(c.subject_a, 1, 1) = '6' then '60' else c.subject_a end
        		  and cast(z.standard_score as numeric) = case when c.subject_a in ('81', '1G') or substring(c.subject_a, 1, 1) = '9' then cast(z.standard_score as numeric) else c.standardscore end
        				  and z.rating_score = case when c.subject_a in ('81', '1G') or substring(c.subject_a, 1, 1) = '9' then cast(c.grade as varchar) else z.rating_score end
        				  and z.use_yn = 'Y'
        				  and z.year = $2
        				  and z.division = '2'
        			          limit 1
        				  ) as numeric)
        		  from csatidscore c
        		  where memberid = $1 --'1957244068'
        		  and division = '1' --발표전
        		  and year = $2 --'2022'
        		  and useyn = 'Y'
        	) as c3
        	where c2.memberid = $1 --'1957244068'
        	  and c2.division = '1' --발표전
        	  and c2.year = $2 --'2022'
        	  and c2.useyn = 'Y'
        	  and c2.subject_a = c3.subject_a
        	 group by case when c2.subject_a = '1G' then '1G' else substring(c2.subject_a , 1, 1) || '0' end, c2.division
          , c2.standardscore , c2.percentage, c2.grade, round(c3.cumulative, 1)
         )
        , res2 as (
         select b.sort, b.name,
         sum(case when b.sort = '1' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.standardscore, 0)
         	  	  when b.sort = '2' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.standardscore, 0)
        	  	  when b.sort = '3' and a.subject in ('60','80','70','10','20') then coalesce(a.standardscore, 0)
         	  	  when b.sort = '4' and a.subject in ('60','80','70','10','20') then coalesce(a.standardscore, 0)
         	  	  when b.sort = '5' and a.subject in ('60','70','10','20') then coalesce(a.standardscore, 0)
         	  	  when b.sort = '6' and a.subject in ('60','70','10','20') then coalesce(a.standardscore, 0)
         	  	  when b.sort = '7' and a.subject in ('60','80','70') then coalesce(a.standardscore, 0)
         	  	  when b.sort = '8' and a.subject in ('60','70') then coalesce(a.standardscore, 0)
         else 0 end)
         -
         min(case when b.sort in ('2','4','6') and a.subject in ('10','20') then coalesce(standardscore, 0)
                  when b.sort not in ('2','4','6') and a.subject in ('10','20') then 0 else 200 end) as standardscore,
          sum(case when b.sort = '1' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.percentage , 0)
         	  	  when b.sort = '2' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.percentage, 0)
        	  	  when b.sort = '3' and a.subject in ('60','80','70','10','20') then coalesce(a.percentage, 0)
         	  	  when b.sort = '4' and a.subject in ('60','80','70','10','20') then coalesce(a.percentage, 0)
         	  	  when b.sort = '5' and a.subject in ('60','70','10','20') then coalesce(a.percentage, 0)
         	  	  when b.sort = '6' and a.subject in ('60','70','10','20') then coalesce(a.percentage, 0)
         	  	  when b.sort = '7' and a.subject in ('60','80','70') then coalesce(a.percentage, 0)
         	  	  when b.sort = '8' and a.subject in ('60','70') then coalesce(a.percentage, 0)
         else 0 end)
         -
         min(case when b.sort in ('2','4','6') and a.subject in ('10','20') then coalesce(percentage, 0)
         			    when b.sort not in ('2','4','6') and a.subject in ('10','20') then 0 else 200 end) as percentage,
          sum(case when b.sort = '1' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.grade, 0)
         	  	  when b.sort = '2' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.grade, 0)
        	  	  when b.sort = '3' and a.subject in ('60','80','70','10','20') then coalesce(a.grade, 0)
         	  	  when b.sort = '4' and a.subject in ('60','80','70','10','20') then coalesce(a.grade, 0)
         	  	  when b.sort = '5' and a.subject in ('60','70','10','20') then coalesce(a.grade, 0)
         	  	  when b.sort = '6' and a.subject in ('60','70','10','20') then coalesce(a.grade, 0)
         	  	  when b.sort = '7' and a.subject in ('60','80','70') then coalesce(a.grade, 0)
         	  	  when b.sort = '8' and a.subject in ('60','70') then coalesce(a.grade, 0)
         else 0 end)
         -
         min(case when b.sort in ('2','4','6') and a.subject in ('10','20') then coalesce(grade, 0)
                  when b.sort not in ('2','4','6') and a.subject in ('10','20') then 0 else 200 end) as grade,
          sum(case when b.sort = '1' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.cumulative, 0)
         	  	  when b.sort = '2' and a.subject in ('60','80','70','10','20','1G') then coalesce(a.cumulative, 0)
        	  	  when b.sort = '3' and a.subject in ('60','80','70','10','20') then coalesce(a.cumulative, 0)
         	  	  when b.sort = '4' and a.subject in ('60','80','70','10','20') then coalesce(a.cumulative, 0)
         	  	  when b.sort = '5' and a.subject in ('60','70','10','20') then coalesce(a.cumulative, 0)
         	  	  when b.sort = '6' and a.subject in ('60','70','10','20') then coalesce(a.cumulative, 0)
         	  	  when b.sort = '7' and a.subject in ('60','80','70') then coalesce(a.cumulative, 0)
         	  	  when b.sort = '8' and a.subject in ('60','70') then coalesce(a.cumulative, 0)
         else 0 end)
         -
         min(case when b.sort in ('2','4','6') and a.subject in ('10','20') then coalesce(cumulative, 0)
         		      when b.sort not in ('2','4','6') and subject in ('10','20') then 0 else 200 end) as cumulative
         from res a
         left outer join (select '1' as sort, '국영수탐(2) + 한국사' as name union all
          select '2' as sort, '국영수탐(1) + 한국사' as name union all
          select '3' as sort, '국영수탐(2)' as name union all
          select '4' as sort, '국영수탐(1)' as name union all
          select '5' as sort, '국수탐(2)' as name union all
          select '6' as sort, '국수탐(1)' as name union all
          select '7' as sort, '국영수' as name union all
          select '8' as sort, '국수' as name) b on 1=1
         --where b.sort = '1'
         group by b.sort, b.name
         )
         select sort, name, standardscore , percentage , grade, cumulative ,
         RANK () OVER ( ORDER by standardscore desc) as rank_d
         from res2
         order by sort
         ;              `,
        [req.headers.auth, s_year],
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
