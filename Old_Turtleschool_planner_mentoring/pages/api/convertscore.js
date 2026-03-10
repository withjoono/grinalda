import pool from '../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	const {typeId, subjectCode, score,wow} = req.query
	console.log(req.query);
	if (subjectCode) {
		const {rows} = await pool.query(`select * from conversion where "typeId" = $1 and "subjectCode" = $2 and "originScore" = $3`,[parseInt(typeId),subjectCode,parseInt(score)])
		res.json({data:rows});
	} else if (!subjectCode) {
		const {rows} = await pool.query(`select * from conversion where "typeId" = $1`,[parseInt(typeId)])
		res.json({data:rows});
	}
	res.end()
}