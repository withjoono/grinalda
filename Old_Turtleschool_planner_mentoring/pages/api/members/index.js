
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 사용자 정보 수정
    - params:
{
  userName: '테스터',
  relationCode: '10',
  gradeCode: 'H1',
  school: '서울고등학교',
  cellphone: '010-2222-3333',
  email: 'master@ingipsy.com'
}
*/

export default async (req, res) => {
    let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    let memberId = rows[0].id
    let success = false;
    let msg = 'fail'
    let statusCode = 500;
    let data = -1;

    switch (req.method) {
        case 'GET':
            case 'GET':
                let { rows } = await pool.query(`
        select	user_name as "userName"
            ,   "relationCode"
            ,   "gradeCode"
            ,   m.school
            ,   cellphone
            ,   email
			,	grdtnplanyear
			,	region
			,	prsnlinprd
			,	univ
			,	department
			,	c.name as childname
			,	c.grade as childgrade
			,	c.year as childyear
			,	c.school as childschool
			,	c.parentid
      , m.candnumber
        from	"members" m left join children c
		on c.parentid = m.id
        where	m.id  =   $1
                `, [memberId])

                success = true;
                data = rows;
            break;
        case 'POST':
			let results = {}
			switch(req.body.relationCode) {
				case '10':
					results = await pool.query(`UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   "gradeCode"     =   $5
                ,   grdtnplanyear =   $6
                ,   region          =   $7
                ,   school          =   $8
                ,   prsnlinprd      =   $9
                ,   candnumber      =   $10
				,	"relationCode"	=	'10'
                ,   "updateDate"    =   timezone('utc'::text, now())
                WHERE   id          =   $1 `
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.gradeCode,req.body.grdtnPlanYear,
                 req.body.region, req.body.school,
                 req.body.prsnlInprd, req.body.candnumber])
					break;
				case '20':
					results = await pool.query(`UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   "gradeCode"     =   $5
                ,   grdtnplanyear =   $6
                ,   region          =   $7
                ,   school          =   $8
                ,   prsnlinprd      =   $9
                ,   candnumber      =   $10
				,	"relationCode"	=	'20'
                ,   "updateDate"    =   timezone('utc'::text, now())
                WHERE   id          =   $1
				returning id`
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.gradeCode,req.body.grdtnPlanYear,
                 req.body.region, req.body.school,
                 req.body.prsnlInprd, req.body.candnumber])
				 const id = results.rows[0].id
					await req.body.children.map(async (d) => {
						await pool.query(`INSERT INTO children (parentid, name, grade, year, school)
							values ($1,$2,$3,$4,$5)`, [id, d.name, d.grade, d.year, d.highschool])
					})
					break;
				 case '40':
					results = await pool.query(`UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   prsnlinprd      =   $5
				,	"relationCode"	=	'40'
                ,   "updateDate"    =   timezone('utc'::text, now())
                    WHERE   id          =   $1`
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.prsnlInprd])
					break;
				case '70':
					results = await pool.query(`UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   "highschool"    =   $6
                ,   school          =   $5
                ,   univ            =   $7
                ,   department      =   $8
                ,   prsnlinprd      =   $9
				,	"relationCode"	=	'70'
                ,   "updateDate"    =   timezone('utc'::text, now())
                WHERE   id          =   $1`
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.highschool,req.body.school,
                 req.body.univ, req.body.department,
                 req.body.prsnlInprd])
					break;
			}
            /*학생 업데이트 경우
            UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   "gradeCode"     =   $5
                ,   "grdtnPlanYear" =   $6
                ,   region          =   $7
                ,   school          =   $8
                ,   prsnlInprd      =   $9
                ,   "updateDate"    =   timezone('utc'::text, now())
                WHERE   id          =   $1
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.gradeCode,req.body.grdtnPlanYear,
                 req.body.region, req.body.school,
                 req.body.prsnlInprd])
            */
                      /* 학교 선생님 업데이트 경우
            UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   prsnlInprd      =   $7
                ,   "updateDate"    =   timezone('utc'::text, now())
                    WHERE   id          =   $1
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.prsnlInprd])
            */
                      /* 그 외 선생님 업데이트 경우
            UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   prsnlInprd      =   $5
                ,   "updateDate"    =   timezone('utc'::text, now())
                    WHERE   id          =   $1
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.prsnlInprd])
            */
                   /*멘토 업데이트 경우
            UPDATE  members
            SET     user_name       =   $2
                ,   cellphone       =   $3
                ,   email           =   $4
                ,   "highschool"    =   $5
                ,   school          =   $6
                ,   univ            =   $7
                ,   department      =   $8
                ,   prsnlInprd      =   $9
                ,   "updateDate"    =   timezone('utc'::text, now())
                WHERE   id          =   $1
                , [memberId, req.body.userName,req.body.cellphone,
                 req.body.email,req.body.highschool,req.body.school,
                 req.body.univ, req.body.department,
                 req.body.prsnlInprd])
            */


            success = true;
            data = results.rowCount;
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
