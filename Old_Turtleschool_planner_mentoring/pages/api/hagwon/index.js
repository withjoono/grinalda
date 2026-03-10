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
	const {location, district} = req.query
	
	if (req.method = 'GET') {
		if (!district) {
		let {rows} = await pool.query(`
			select "행정구역명" from hagwon_csv where
			"시도교육청명" = $1 group by "행정구역명"
		`,[location])
		res.json({success: true, msg: 'success', data: rows});
		} else {
			let {rows} = await pool.query(`
			select "학원명" from hagwon_csv where
			"시도교육청명" = $1 and
			"행정구역명" = $2
		`,[location, district])
		res.json({success: true, msg: 'success', data: rows});
		}
		res.statusCode = 200;
		res.end();
	} else {
		res.end();
	}
	return;
}