
import pool from '../../lib/pool'

export default async (req, res) => {
    let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    let success = false;
    let msg = 'fail'
    let statusCode = 500;
    let data = -1;
	let type = null;
	let dat = await pool.query(`select * from "codeExams"`)
	data = dat.rows;
	success = true;
	let ans = {}
	data.map(e => {ans[e.id] = [e.type,e.year,e.grade]})
    if (success) {
        statusCode = 200;
        msg = 'success';
    }

    res.json({success: success, msg: msg, data: ans});
    res.statusCode = statusCode;
    res.end();
}
