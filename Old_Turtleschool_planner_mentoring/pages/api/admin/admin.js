import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req,res) => {
	let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

	let success = false;
    let msg = 'fail'
let statusCode = 500;
    let data = [];

	switch (req.method) {
        case 'GET':
            const { id } = { id: rows[0].id }

             rows  = await pool.query(`
			          select a.memberid, a.memberid2, m.account, m.school, m.user_name, m."relationCode", a.groupname, a.groupid
								from adminclass a
										,members m
								where a.memberid2 = cast(m.id as varchar)
								and a.useyn = 'Y'
								and a.memberid = $1
                order by a.groupname, a.memberid2
                ;
                `, [id]
            )
      
            if (rows.rows.length < 1) {
                res.json({success: false, msg: 'No authorization', data: null});
                res.statusCode = 406;
                res.end();
                return;
            }
            success = true;
            data = rows.rows;
            break;
        default:
            break;
    }

	if (success) {
        statusCode = 200;
        msg = 'success';
    }

    res.json({success: success, msg: msg, data: data});
    res.statusCode = statusCode;
    res.end();
}
