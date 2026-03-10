import pool from '../../../lib/pool';

/*
    - title:
    - params:

*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  let str_year = req.query.year;
  let str_lar_cd = req.query.lar_cd;
  let str_universa = req.query.universa;
  let str_universb = req.query.universb;
  let str_universc = req.query.universc;
  let str_universd = req.query.universd;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `

      select universityid,
        	   universitynm,
        	   lowseparaid,
        	   lowseparanm,
        	   departmentid,
        	   departmentnm,
        	   rcrtmunitid,
        	   rcrtmunitnm,
        	   essaya,
        	   essayb,
        	   essayc,
        	   recruits,
        	   recruitdate,
        	   rmk,
             (select rmk from essayrecruitment e1
        	    where e1.year = $1
              and e1.division = $2
              and e1.useyn = 'Y'
              and cast(e1.university as numeric) = a.universityid
              and e1.rcrtmunit = a.rcrtmunitid
              limit 1) as rmk1,
              coalesce(e2.mathc, '') as mathc,
              coalesce(e2.math, '') as math,
              coalesce(e2.mathp, '') as mathp,
              coalesce(e2.mathd, '') as mathd,
              coalesce(e2.mathg, '') as mathg,
              coalesce(e2.scncc, '') as scncc,
              case when a.universityid = '241' then coalesce(a.scncpa, '') else coalesce(e2.scncpa, '') end as scncpa,
              case when a.universityid = '241' then coalesce(a.scncca, '') else coalesce(e2.scncca, '') end as scncca,
              case when a.universityid = '241' then coalesce(a.scncba, '') else coalesce(e2.scncba, '') end as scncba,
              case when a.universityid = '241' then coalesce(a.scncea, '') else coalesce(e2.scncea, '') end as scncea,
              case when a.universityid = '355' then coalesce(a.scncpb, '') else coalesce(e2.scncpb, '') end as scncpb,
              case when a.universityid = '355' then coalesce(a.scnccb, '') else coalesce(e2.scnccb, '') end as scnccb,
              case when a.universityid = '355' then coalesce(a.scncbb, '') else coalesce(e2.scncbb, '') end as scncbb,
              case when a.universityid = '355' then coalesce(a.scnceb, '') else coalesce(e2.scnceb, '') end as scnceb
        from (
          select e.universityid	as universityid,
        		   u.name			      as universitynm,
        		   null			        as lowseparaid,
        		   null		          as lowseparanm,
        		   e.departmentid	  as departmentid,
        		   (select name from departments d where cast(d.id as varchar) = e.departmentid)		as departmentnm,
        		   e.rcrtmunit		  as rcrtmunitid,
        		   (select comn_nm from commoncode c where c.comn_grp_cd = 'E00001' and c.comn_cd = e.rcrtmunit limit 1)		as rcrtmunitnm,
        		   e.essaya ,
        		   e.essayb ,
        		   e.essayc ,
        		   e.recruits ,
        		   e.recruitdate ,
        		   e.rmk,
               e.scncpa as scncpa,
               e.scncca as scncca,
               e.scncba as scncba,
               e.scncea as scncea,
               e.scncpb as scncpb,
               e.scnccb as scnccb,
               e.scncbb as scncbb,
               e.scnceb as scnceb
        	from essay e
        		,universities u
        	where e."year" = $1
        	and e.lar_cd = $2
        	and e.mid_cd = '1' --일반
          and e.useyn = 'Y'
        	and e.universityid = u.id
          and (((coalesce($3, '1') = '1') and 1=1) or
               ((coalesce($3, '1') != '1') and cast(e.universityid as varchar) ||','|| cast(e.sml_cd as varchar) in
               (select rmk
                 from ( select split_part(unnest(string_to_array($3, '|')), ',', 1) as university, unnest(string_to_array($3, '|')) as rmk
											) as a
								 where university in (select unnest(string_to_array($6, '|')))
               )
              ))
          union all ----이차 교차지원 논술 1
          select e.universityid	as universityid,
        		   u.name			      as universitynm,
        		   null			        as lowseparaid,
        		   null		          as lowseparanm,
        		   e.departmentid	  as departmentid,
        		   (select name from departments d where cast(d.id as varchar) = e.departmentid)		as departmentnm,
        		   e.rcrtmunit		  as rcrtmunitid,
        		   (select comn_nm from commoncode c where c.comn_grp_cd = 'E00001' and c.comn_cd = e.rcrtmunit limit 1)		as rcrtmunitnm,
        		   e.essaya ,
        		   e.essayb ,
        		   e.essayc ,
        		   e.recruits ,
        		   e.recruitdate ,
        		   e.rmk,
               e.scncpa as scncpa,
               e.scncca as scncca,
               e.scncba as scncba,
               e.scncea as scncea,
               e.scncpb as scncpb,
               e.scnccb as scnccb,
               e.scncbb as scncbb,
               e.scnceb as scnceb
        	from essay e
        		,universities u
        	where e."year" = $1
        	and e.lar_cd = $2
        	and e.mid_cd = '0' --일반
          and e.useyn = 'Y'
        	and e.universityid = u.id
          and coalesce($2, '0') = '0'
          and (((coalesce($4, '1') = '1') and 1=1) or
               ((coalesce($4, '1') != '1') and cast(e.universityid as varchar) ||','|| cast(e.departmentid as varchar) in (select unnest(string_to_array($4, '|')))  ))

          union all --이차 교차지원 논술 2
        	select e.universityid	as universityid,
        		   u.name			      as universitynm,
        		   null			        as lowseparaid,
        		   null		          as lowseparanm,
        		   e.departmentid	  as departmentid,
        		   (select name from departments d where cast(d.id as varchar) = e.departmentid)		as departmentnm,
        		   e.rcrtmunit		  as rcrtmunitid,
        		   (select comn_nm from commoncode c where c.comn_grp_cd = 'E00001' and c.comn_cd = e.rcrtmunit limit 1)		as rcrtmunitnm,
        		   e.essaya ,
        		   e.essayb ,
        		   e.essayc ,
        		   e.recruits ,
        		   e.recruitdate ,
        		   e.rmk,
               e.scncpa as scncpa,
               e.scncca as scncca,
               e.scncba as scncba,
               e.scncea as scncea,
               e.scncpb as scncpb,
               e.scnccb as scnccb,
               e.scncbb as scncbb,
               e.scnceb as scnceb
        	from essay e
        		,universities u
        	where e."year" = $1
        	and e.lar_cd = $2
        	and e.mid_cd = '4' --일반
          and e.useyn = 'Y'
        	and e.universityid = u.id
          and coalesce($2, '0') = '0'
          and (((coalesce($5, '1') = '1') and 1=1) or
               ((coalesce($5, '1') != '1') and cast(e.universityid as varchar) ||','|| cast(e.departmentid as varchar) in (select unnest(string_to_array($5, '|')))  ))
        ) as a
        left outer join essaysbjctunvrs e2
        on a.universityid = e2.university
        and e2.year = $1
        and e2.division = $2
        and a.departmentid = e2.department
        where departmentid is not null
        group by universityid,
        	   universitynm,
        	   lowseparaid,
        	   lowseparanm,
        	   departmentid,
        	   departmentnm,
        	   rcrtmunitid,
        	   rcrtmunitnm,
        	   essaya,
        	   essayb,
        	   essayc,
        	   recruits,
        	   recruitdate,
        	   rmk,
             mathc, math, mathp, mathd, mathg, scncc,
             case when a.universityid = '241' then coalesce(a.scncpa, '') else coalesce(e2.scncpa, '') end,
             case when a.universityid = '241' then coalesce(a.scncca, '') else coalesce(e2.scncca, '') end,
             case when a.universityid = '241' then coalesce(a.scncba, '') else coalesce(e2.scncba, '') end,
             case when a.universityid = '241' then coalesce(a.scncea, '') else coalesce(e2.scncea, '') end,
             case when a.universityid = '355' then coalesce(a.scncpb, '') else coalesce(e2.scncpb, '') end,
             case when a.universityid = '355' then coalesce(a.scnccb, '') else coalesce(e2.scnccb, '') end,
             case when a.universityid = '355' then coalesce(a.scncbb, '') else coalesce(e2.scncbb, '') end,
             case when a.universityid = '355' then coalesce(a.scnceb, '') else coalesce(e2.scnceb, '') end
        order by recruitdate, universityid, rcrtmunitid, departmentid
        ;
                `,
        [str_year, str_lar_cd, str_universa, str_universb, str_universc, str_universd],
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
