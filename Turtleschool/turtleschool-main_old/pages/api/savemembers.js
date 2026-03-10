import pool from '../../lib/pool';

/*
    - title:
    - params:
*/
export default async (req, res) => {
  /*
  let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])

  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }
*/

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  if (req.method == 'POST' || req.method == 'GET') {
    let s_username = req.body.data.username;
    let s_cellphone = req.body.data.cellphone;
    let s_email = req.body.data.email;
    let s_gradecode = req.body.data.gradecode;
    let s_grdtnplanyear = req.body.data.grdtnplanyear;
    let s_region = req.body.data.region;
    let s_school = req.body.data.school;
    let s_prsnlinprd = req.body.data.prsnlinprd;
    let s_relationcode = req.body.data.relationcode;
    let s_candnumber = req.body.data.candnumber;

    await pool.query(
      `
          with upsert as (
              update members
              set user_name       =   $2  --이름
              ,   cellphone       =   $3  --핸드폰번호
              ,   email           =   $4  --이메일
              ,   "gradeCode"     =   $5
              ,   grdtnplanyear   =   $6  --졸업예정년도
              ,   region          =   $7  --직원
              ,   school          =   $8  --출신고교
              ,   prsnlinprd      =   $9  --플래너번호
              ,	"relationCode"	  =	  $10 --학생코드
              ,   candnumber      =   $11 --수험번호
              ,   "updateDate"    =   timezone('utc'::text, now())
              where account = $1
              returning * )
              insert into members
              (account,
               cellphone,
               cert_path,
               email,
               "gradeCode",
               "isPay",
               join_date,
               "payDate",
               push_token,
               "relationCode",
               school,
               "updateDate",
               user_name,
               imp_uid,
               merchant_uid,
               grdtnplanyear,
               region,
               prsnlinprd,
               candnumber
              )
              select $1,
                     $3,
                     'kk',
                     $4,
                     $5,
                     false,
                     timezone('utc'::text, now()),
                     null,
                     null,
                     $10,
                     $8,
                     timezone('utc'::text, now()),
                     $2,
                     '',
                     '',
                     $6,
                     $7,
                     $8,
                     $11
              where not exists(select 'X' from upsert);
        ;
				`,
      [
        req.headers.auth,
        s_username,
        s_cellphone,
        s_email,
        s_gradecode,
        s_grdtnplanyear,
        s_region,
        s_school,
        s_prsnlinprd,
        s_relationcode,
        s_candnumber,
      ],
    );

    let {rows} = await pool.query(
      `
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
        `,
      [req.headers.auth],
    );

    if (rows == undefined || rows.length < 1) {
      res.json({success: false, msg: 'No data', user: null});
      res.statusCode = 406;
      res.end();
      return;
    }

    success = true;
    data = rows;

    if (success) {
      statusCode = 200;
      msg = 'success';
    }

    res.status(statusCode).json({success: success, msg: msg, user: data});
    res.end();
  }
};
