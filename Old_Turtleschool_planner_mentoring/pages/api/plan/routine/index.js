import pool from '../../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	const w = await pool.query(`select * from members where account = $1`, [req.headers.auth])
    if (w.rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }
	if(req.method == 'POST') {
		const {title,starttime,endtime,repeat,date,days} = req.body;
		const a = await pool.query(`insert into routines (title,starttime,endtime,repeat,date,sun,mon,tues,wed,thurs,fri,sat,memberid) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id`,
		[title,starttime,endtime,repeat,date,days[0],days[1],days[2],days[3],days[4],days[5],days[6],req.headers.auth])
		res.json({success: true, msg: 'success',data: a.rows[0].id});
		res.statusCode = 200;
		res.end();
	} else {
		const {rows} = await pool.query(`select * from routines where memberid = $1`,[req.headers.auth])
		res.json({success: true, msg: 'success',data: rows});
		res.statusCode = 200;
		res.end();
	}
	}