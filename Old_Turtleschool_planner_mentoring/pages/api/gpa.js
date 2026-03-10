import pool from '../../lib/pool'

export default async(req, res) => {
	const {uid, mid} = req.query;
	const {rows} = await pool.query(`select gpa from entrances where "universityId" = $1 and "departmentId" = $2`,[uid,mid]);
	console.log(rows);
	res.send({gpa: rows[0].gpa});
}