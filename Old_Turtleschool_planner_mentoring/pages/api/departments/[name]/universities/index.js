import pool from '../../../../../lib/pool'
import axios from 'axios'

/*
    - title: 학부명으로 대학 및 학부 조회하기
    - params:
        학부명
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
    let data = {};

    switch (req.method) {
        case 'GET':
            const { year } = { year: process.env.RECRUIT_YEAR }
			const {name, groupCode, areaCode} = req.query;
            let { rows } = await pool.query(`
    select	e."universityId"
        ,	u."name" as "universityName"
        ,	e."departmentId"
        ,	d."name" as "departmentName" 
    from	entrances as e
            inner join universities as u
            on e."universityId" = u."id"
            inner join departments as d
            on e."departmentId" = d."id"
    where	e."isUse" = true 
    and		e."recruitYear" = $1
    and		d."name" like '%' || $2 || '%'
	and		e."areaCode" = $4
	and		e."groupCode" = $3
    group by e."universityId"
        ,	u."name"
        ,	e."departmentId"
        ,	d."name"
    order by u."name" asc, d."name" asc
            `, [year, name, groupCode, areaCode])    

            success = true;
            data = rows;
			console.log(rows)
            break;
    }

    if (success) {
        statusCode = 200;
        msg = 'success';
    }
	
	console.log(req.query);

    res.json({success: success, msg: msg, data: data});
    res.statusCode = statusCode;
    res.end();
}
