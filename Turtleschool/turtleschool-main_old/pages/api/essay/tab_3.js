import pool from '../../../lib/pool';

/*
    - title:
    - params:

*/
export default async (req, res) => {
  try {
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

    let str_univers = req.query.univers;
    let str_year = req.query.year;
    let str_division = req.query.division;
    let str_lar_cd = req.query.lar_cd;

    switch (req.method) {
      case 'GET':
        rows = await pool.query(
          `

            	select cast(y.universityid as varchar) as universityid, --대학코드
                     u."name" as universitynm, --대학명
                     rmk1 as examseriesid, --고사계열코드
                     c.comn_nm as examseriesnm, --고사명
                     Case when length(rmk2) > 0 then 'O' else 'X' end as examyn,
                     rmk3           as exam, 			   --문제
                     Case when length(rmk4) > 0 then 'O' else 'X' end as englishexam   --영어제시문
              	from essayetc y
              		  ,universities u
              		    ,commoncode c
            	 where y."year" = $1
            	 and y.division = $2 --0문과
            	 and y.lar_cd = $3 --2수리논술
            	 and y.mid_cd = '3'
            	 and y.useyn = 'Y'
            	 and y.universityid = u.id
            	 and c.comn_grp_cd = 'E00004'
            	 and y.rmk1 = c.comn_cd
                 --and (rmk2 != 'X' and rmk4 != 'X')
                --and (((coalesce($4, '1') = '1') and 1=1) or
               	--((coalesce($4, '1') != '1') and cast(y.universityid as varchar) ||'|'|| cast(rmk1 as varchar) in (select unnest(string_to_array($4, ',')))  ))
               order by u."name", c.comn_nm

            ;
                `,
          [str_year, str_division, str_lar_cd /*str_univers*/],
        );

        if (rows.rows == undefined || rows.rows.length < 1) {
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

    res.status(statusCode).json({success: success, msg: msg, data: data});
    res.end();
  } catch (error) {
    console.log(error);
  }
};
