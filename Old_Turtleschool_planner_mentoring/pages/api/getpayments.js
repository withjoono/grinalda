import pool from '../../lib/pool'

export default async (req, res) => {
	let d = await pool.query(`select * from paymenttypes`);
	res.send({success: true, data:d.rows});
	res.end();
	return;
}