import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
    let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }
	const data = await pool.query(`select * from accountlinks where memberid = $1`,[req.headers.auth])
	const d = await Promise.all(data.rows.map(async e => {
		const r = await pool.query(`select * from members where account = $1`,[e.memberid2])
		if (r.rows[0]) return r.rows[0]
	}))
	d.unshift(rows[0])
	res.json({success: true, data: d.filter(r => r)});
    res.statusCode = 200;
	res.end();
}

