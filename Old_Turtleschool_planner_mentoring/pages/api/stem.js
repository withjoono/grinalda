import pool from '../../lib/pool'

// req params: department id and college id

export default async (req, res) => {
	const {universityId, departmentId} = req.query;
	const {rows} = await pool.query(`select "lineCode" from entrances where "universityId" = $1 and "departmentId" = $2`,[universityId, departmentId]);
	if (rows.length < 1) {
		res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
	} else {
		console.log(rows[0]);
		res.send({r: rows[0]});
		res.end();
	}
}