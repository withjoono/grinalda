import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	const w = await pool.query(`select * from members where account = $1`, [req.headers.auth])
    if (w.rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }
	const {rows} = await pool.query(`delete from planneritems where "memberId" = $1 and id = $2`,[w.rows[0].id,req.query.id])
	res.json({success: true, msg: 'success'});
	res.statusCode = 200;
	res.end();
}