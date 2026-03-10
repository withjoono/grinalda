import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	if (req.method == 'GET') {
		const {query} = req.query
		const q = query
		console.log(q)
		const result = await pool.query(`select id as id, title as title, teacher as person from lectures where teacher like concat('%',$1::text,'%') or title like concat('%',$1::text,'%')`,[q])
		console.log(result.rows)
		res.json({success: true, msg: 'success', data:result.rows});
		res.statusCode = 200;
		res.end();
	}
}