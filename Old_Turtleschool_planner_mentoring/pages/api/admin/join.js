import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req,res) => {
	
    let  {rows}  = await pool.query(`select "relationCode" as rel from members m where account = $1`,[req.headers.auth])
 
    let success = 'else'
    console.log(rows)

    if (rows.length < 1) {
		res.json({success: 'none', msg: 'No authorization', data: null});
		res.statusCode = 406;
		res.end();
		return;
	}
    else if (row[0].rel == 70){
        res.json({success: 'planner' , msg: '플래너접속했을때 관리페이지', data: null });
        res.statusCode = 200;
        res.end();
        return;
      
    }
    res.json({success: 'memebers' , msg: '플래너 외 접속했을때 관리페이지', data: null });
        res.statusCode = 200;
        res.end();
}