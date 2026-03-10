
import pool from '../../lib/pool'
import axios from 'axios'

/*
    - title:
    - params:
*/
export default async (req, res) => {

    let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

    if (rows.length < 1) {
        res.status(406).json({success: false, msg: 'No authorization', data: null});
        res.end();
        return;
    }
    let success = false;
    let msg = 'fail';
    let statusCode = 500;
    let data = [];

    switch (req.method) {
        case 'GET':
        case 'POST':
            rows  = await pool.query(`
          select	user_name as username
            , "relationCode" as relationcode
            , "gradeCode" as gradecode
            , m.school
            , cellphone
            , email
      			,	grdtnplanyear
      			,	region
      			,	prsnlinprd
      			,	univ
      			,	department
            , candnumber
            , case when (select count(*) from csatidscore c2 where cast(c2.memberid as varchar) = m.account) > 0
            		then 'true' else 'false' end code
            , (
                select case when count(*) > 0 then 'Y' else 'N' end as pay_yn
                from payments p
                where accountid = m.id
                and typesid = '9'
                and to_char(current_date, 'yyyy-MM-dd') between to_char(time, 'yyyy-MM-dd') and to_char(time + '6 month', 'yyyy-MM-dd')
              ) as csatpayyn
          from	members m
          where m.account = $1;
        ;
				`,[req.headers.auth]);

                if (rows.rows == undefined || rows.rows.length < 1)
                {
                  res.json({success: false, msg: 'No data', user: null});
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
        console.log("202");
    }

        res.status(statusCode).json({ success: success, msg: msg, user: data });
        res.end();
};
