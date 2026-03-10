import pool from '../../../lib/pool'
import axios from 'axios'

/****************************************
* 학습현황 / 수업현황
* 주간성취도 그래프
*
****************************************/
export default async (req, res) => {
  let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }

  let success = false;
  let msg = 'fail'
  let statusCode = 500;
  let data = [];

  const str_id = rows[0].id;
  const str_primarytype = req.query.primarytype;
  //const str_pages = req.query.pages;

  switch (req.method) {
      case 'GET':
         rows  = await pool.query(`
           with res as (
        			select
                  to_char(a."startDate", 'yyyy-mm-dd') as start_date
                , to_char(a."endDate", 'yyyy-mm-dd') as end_date
                , "primaryType" as primary_type
                , subject
                , extract(minute from "endDate" - "startDate") * 1 as date_diff_hour
                , "memberId" as memberid
                , cast(progress as numeric) as progress
                , to_char(a."startDate", 'Day') as start_date_day
                , EXTRACT(ISODOW from a."startDate") as start_date_day_cd
              from planneritems a
              where "memberId" = $1 --'154'
              and "primaryType" = $2 --'수업'
              and to_char("startDate", 'yyyy-MM-dd') between to_char(date_trunc('week', current_date), 'yyyy-MM-dd') and to_char(date_trunc('week', current_date) + '6 days'::interval, 'yyyy-MM-dd')
        	)
        	select primary_type,
        		     memberid,
        	       start_date_day,
        	       A.COMN_CD,
        	       A.COMN_NM,
                 coalesce (avg(progress), 0) as avg_progress
        	from (  select 'Monday' as comn_nm,   	1 as comn_cd union all
        			    select 'Tuesday' as comn_nm,  	2 as comn_cd union all
        			    select 'Wednesday' as comn_nm,	3 as comn_cd union all
        		    	select 'Thursday' as comn_nm, 	4 as comn_cd union all
        	    		select 'Friday' as comn_nm,   	5 as comn_cd union all
        	    		select 'Saturday' as comn_nm, 	6 as comn_cd union all
        	    		select 'Sunday' as comn_nm,   	7 as comn_cd) a
        		  left outer join res B on A.COMN_CD = B.start_date_day_cd
        	group by primary_type, memberid, start_date_day, A.COMN_CD, A.COMN_NM
        	order by A.COMN_CD
        	; `, [str_id, str_primarytype]
        )

        if (rows.rows == undefined || rows.rows.length < 1)
        {
          res.status(406).json({success: false, msg: 'No data', data: null});
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
}
