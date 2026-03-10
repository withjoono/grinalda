import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
 
	const {school, year, month, index} = req.query
	
	if (req.method = 'GET') {
		let data = await pool.query(`select * from highschool_csv where "학교명" = $1`,[school])
		if (data.rows.length < 1) {
			res.json({success: false, msg: 'Invalid school name', data: null});
			res.statusCode = 406;
			res.end();
			return;
		}
		await axios.get('https://open.neis.go.kr/hub/SchoolSchedule',{
			params: {
				KEY: process.env.NEXT_PUBLIC_NEIS_API_KEY,
				Type: 'json',
				pIndex: index ? index : 1,
				pSize: 1000,
				ATPT_OFCDC_SC_CODE: data.rows[0]['시도교육청코드'],
				SD_SCHUL_CODE: data.rows[0]['표준학교코드'],
				AA_YMD: ''+year+(month.toString().padStart(2,'0'))
			}
		}).then(response => {
			if (response.data['RESULT']) {
				res.json({success: false, msg: response.data['RESULT']['MESSAGE']});
				res.statusCode = 200;
			} else {
				res.json({success: true, msg: 'success', data: response.data.SchoolSchedule});
				res.statusCode = 200;
			}	
			res.end();
		}
		).catch(err => {
			console.log(err);
			res.json({success: false, msg: err});
			res.statusCode = 406;
			res.end();
		}
		)
	} else {
		res.end();
	}
	return;
}