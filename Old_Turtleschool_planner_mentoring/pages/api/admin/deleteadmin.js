import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
    let { rows } = await pool.query(`select account from members where account = $1`, [req.headers.auth])
   
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    let data = await pool.query(`select account from members where id = $1`,[req.body.id])
    console.log(data.rows, req.body.id)
    const myid = rows[0].account;
    const id = data.rows[0].account;
    console.log(myid);
    console.log(id);
	await pool.query(`delete from adminclass a 
                        where ((a.memberid = (select m.id::varchar from members m where m.account = $1) and 
                        a.memberid2	= (select m.id::varchar from members m where m.account = $2)) or
                         (a.memberid = (select m.id::varchar from members m where m.account = $2) and
                        a.memberid2=(select m.id::varchar from members m where m.account = $1)));`,[myid, id])
                 
                           
	await pool.query(`delete from accountlinks
                          where ((memberid = $1 and memberid2 = $2) or
                          (memberid = $2 and memberid2 = $1))
                           ;`,[myid, id])

    res.json({success: true});
    res.statusCode = 200;
	res.end();
}