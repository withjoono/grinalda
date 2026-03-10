
import pool from '../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	
	try {
		const uid = req.headers.auth;
		
		let success = true;
		let msg = 'fail'
		let statusCode = 200;


		if (success) {
			statusCode = 200;
			msg = 'success';
		}
		
		if (req.method == 'POST'){
			const {push} = req.body;
			const {rows} = await pool.query(`update members set push_token = $1 where account = $2`,[push, uid]);
		} else if (req.method == 'GET') {
			const {rows} = await pool.query(`select push_token from members where account = $1`,[uid]);
			msg = rows;
		}

		res.json({success: success, msg: msg});
		res.statusCode = statusCode;
		res.end();
	} catch (e) {
		console.log(e);
		res.statusCode = 400;
		res.end();
	}
}
