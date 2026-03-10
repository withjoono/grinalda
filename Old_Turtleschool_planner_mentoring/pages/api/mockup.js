
import pool from '../../lib/pool'

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
	if (req.method =='GET') {let dat = await pool.query(`select saved.*, departments.name as "departmentName", universities.name as "universityName"
								from saved inner join universities
								on saved."universityId" = universities.id
								inner join departments
								on saved."departmentId"  = departments.id
								where "memberId" = $1`,[memberId])
	data = dat.rows;
	} else {
		req.body.data.map(async (e) => {
		const {groupCode, rank, universityId, departmentId} = e;
		await pool.query(`
			insert into saved values ($1, $2, $3, $4, $5) on conflict ("memberId", "groupCode", rank) do update set "universityId" = $4, "departmentId" = $5
		`,[memberId, groupCode,rank,universityId, departmentId]).then(res => console.log(res)).catch(err => console.log(err))
		})
	}
	success = true;
    if (success) {
        statusCode = 200;
        msg = 'success';
    }

    res.json({success: success, msg: msg, data: data});
    res.statusCode = statusCode;
    res.end();
}