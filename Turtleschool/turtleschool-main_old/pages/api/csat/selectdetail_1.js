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
  // let s_division = req.query.division;
  let s_department = req.query.department;
  let s_departmentnm = req.query.departmentnm;
  let s_universityid = req.query.universityid;
  let s_universitynm = req.query.universitynm;
  let s_major = req.query.major;
  let s_cross_sprt = req.query.cross_sprt;

  switch (req.method) {
    case 'GET':
      rows = await pool.query(
        `
            select c.universityid ,
            u."name" as universitynm,
            	c.major ,
            	(select comn_nm from commoncode c2 where c2.comn_grp_cd = 'C00008' and c2.comn_cd = c.major) as major_nm,
            	department ,
            	d."name" as departmentnm,
            	kor,
            	mat,
            	eng,
            	khistory as khis,
            	exp as expl,
            	totalscore as totalsum,
            	(select score from csatuscore c3
            	where c3.division = c.division
            	and c3.universityid = cast(c.universityid as numeric)
            	and c3.major = c.major
            	and c3.score_convert_a = c.score_convert
            	and c3.useyn = 'Y'
            	and c3."year" = cast($2 as numeric)
            	and c3.accountid = $1
              and c3.division in (select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                                 from csatidscore c
                                 where memberid = cast($1 as numeric)
                                 and year = cast($2 as varchar)
                                 and useyn = 'Y'
                                 )
            	limit 1) as score,
                (select (select comn_nm from commoncode c where comn_grp_cd = 'C00007' and c.comn_cd = c3.test_combination) as aa
                from csatuscore c3
            	where c3.division = c.division
            	and c3.universityid = cast(c.universityid as numeric)
            	and c3.major = c.major
            	and c3.score_convert_a = c.score_convert
              and c3.useyn = 'Y'
            	and c3."year" = cast($2 as numeric)
            	and c3.accountid = $1
              limit 1) as scrnnmthd
          	, e1, e2, e3, e4, e5, e6, e7, e8, e9
          	, h1, h2, h3, h4, h5, h6, h7, h8, h9
            , c.recruits as exstnprsnl
            , null as grtfrprsnl
            , c.recruits
            , c.addrecruits as addrecruits --추가모집인원
            , round(cast(c.addrecruits as numeric) / cast(c.recruits as numeric), 2) as addrcrtmrate --addrecruits / exstnprsnl
            , c.finalcmrt
            ,z.frcstcut as final70
            ,z.prdctcutnb as cumulativetop
            ,RANK () OVER (ORDER BY (select score from csatuscore c3
            	where c3.division = c.division
            	and c3.universityid = cast(c.universityid as numeric)
            	and c3.major = c.major
            	and c3.score_convert_a = c.score_convert
            	and c3.useyn = 'Y'
            	and c3."year" = cast($2 as numeric)
            	and c3.accountid = $1
            	limit 1)) as rrank
            ,(cast((select score from csatuscore c3
                    where c3.division = c.division
                    and c3.universityid = cast(c.universityid as numeric)
                    and c3.major = c.major
                    and c3.score_convert_a = c.score_convert
                    and c3.useyn = 'Y'
                    and c3."year" = cast($2 as numeric)
                    and c3.accountid = $1
                    and (((coalesce ($8, '1') ='1') and c3.division in ((select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                                   from csatidscore c5
                                   where memberid = cast($1 as numeric)
                                   and year = cast($2 as varchar)
                                   and useyn = 'Y'
                                   ))) or
                     ((coalesce ($8, '1')!='1') and c3.division not in ((select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                                   from csatidscore c5
                                   where memberid = cast($1 as numeric)
                                   and year = cast($2 as varchar)
                                   and useyn = 'Y'
                                   ))))
                    limit 1) as numeric) -
             public.selectanalysis_6_ubul(cast(c.division as varchar), cast(c.universityid as numeric), cast(c.major as varchar),
                                          cast(c.score_convert as varchar), cast($1 as numeric), cast($2 as varchar)
                                        )) as new_score
            ,public.selectanalysis_6_ubul(cast(c.division as varchar), cast(c.universityid as numeric), cast(c.major as varchar),
                                          cast(c.score_convert as varchar), cast($1 as numeric), cast($2 as varchar))
                                        * cast(coalesce(c.u_jisu, '1') as numeric
                                         ) as u_t_jisu
            from csatunivdepart c
            	,universities u
            	,departments d
                ,csatanlys z
            where c.universityid = cast(u.id as varchar)
            and c.department = cast(d.id as varchar)
            and c.universityid = cast(z.universityid as varchar)
            and c.major = z.major
            and c.score_convert = z.score_convert
            and c.division = z.division
            and (((coalesce($4, '1') = '1') and 1=1) or
                 ((coalesce($4, '1') != '1') and c.universityid = $4))
            and (((coalesce($3, '1') = '1') and 1=1) or
                 ((coalesce($3, '1') != '1') and c.department = $3))
            and (((coalesce($6, '1') = '1') and 1=1) or
                 ((coalesce($6, '1') != '1') and u."name" like '%' || coalesce($6, '') || '%'))
            and (((coalesce($7, '1') = '1') and 1=1) or
                 ((coalesce($7, '1') != '1') and d."name" like '%' || coalesce($7, '') || '%'))
            and (((coalesce($5, '1') = '1') and 1=1) or
                 ((coalesce($5, '1') != '1') and c.major = cast($5 as varchar)))
/*
            and c.division =(
           select case when (select count(*)
                             from csatidscore c2
                             where memberid = $1
                             and year = cast($2 as varchar)
                             and useyn = 'Y'
                             and substring(subject_a, 1, 1) = '2') > 0 then '1' else '0' end as aa)
            and c.use_yn = 'Y'
            and c.year = cast($2 as varchar)
*/
    and (((coalesce ($8, '1') ='1') and c.division in ((select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                   from csatidscore c5
                   where memberid = cast($1 as numeric)
                   and year = cast($2 as varchar)
                   and useyn = 'Y'
                   ))) or
     ((coalesce ($8, '1')!='1') and c.division not in ((select max(case when substring(subject_a ,1,1) = '2' then '1' else '0' end) as sss
                   from csatidscore c5
                   where memberid = cast($1 as numeric)
                   and year = cast($2 as varchar)
                   and useyn = 'Y'
                   ))))
            ;
             `,
        [
          req.headers.auth,
          s_year,
          s_department,
          s_universityid,
          s_major,
          s_universitynm,
          s_departmentnm,
          s_cross_sprt,
        ],
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
