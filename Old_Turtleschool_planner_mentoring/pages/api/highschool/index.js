import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
    let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }
	const {location} = req.query
	
	if (req.method = 'GET') {
		let {rows} = await pool.query(`
			select "학교명" from highschool_csv where
			"소재지명" = $1 and
			"학교종류명" = '고등학교'
		`,[location])
		res.json({success: true, msg: 'success', data: rows});
		res.statusCode = 200;
		res.end();
	} else {
		res.end();
	}
	return;
}