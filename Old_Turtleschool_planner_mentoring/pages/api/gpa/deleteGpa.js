import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
    
    let { rows } = await pool.query(`select id, account from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization2', data: null});
        res.statusCode = 200;
        res.end();
        return;
    }
    console.log(req.method, req.body)
    if(req.method=='POST')
    {
                const {id}= {id:req.body.data.id}
                await pool.query(`delete from gpa where accountid =$1 and id = $2`,[rows[0].id,id])
                res.json({success: true, msg: 'deleted', data: null});
                res.statusCode = 200;
                res.end();
    }

 

}