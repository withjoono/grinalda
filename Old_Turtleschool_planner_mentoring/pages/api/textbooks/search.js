import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	const {keyword} = req.query;
	console.log(keyword)
	const {rows} = await pool.query("select * from books where title like '%"+keyword+"%'")
	console.log(rows)
	res.json({success: true, msg: 'success', data: rows});
	res.statusCode = 200;
	res.end();
}