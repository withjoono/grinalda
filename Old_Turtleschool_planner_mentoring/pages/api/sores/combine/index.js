
import pool from '../../../../lib/pool'
import axios from 'axios'

/*
    - title: 조합별 점수 조회
    - params:

*/
export default async (req, res) => {
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
        case 'POST':
            const { combine, type } = req.body;
			console.log(combine, type);
            const { memberId, recruitYear, isFrequent } = { memberId: rows[0].id, recruitYear: 2020, isFrequent: false }

            data = await pool.query(`
    SELECT  get_combine_scores($1, $2, $3, $4, $5);
                `, [recruitYear, memberId, isFrequent, combine, type]
            )

            success = true;
            data = data.rows;
			const conv = {
				10:'kmr2',
				20:'kmr1',
				30:'kr1',
				40:'kmr2c2',
				50:'kmr1c2',
				60:'kmc1r1',
				70:'kr2',
			}
			console.log(data)
			let ans = {get_combine_scores:[]}
			for (const r of data[0].get_combine_scores) {
				if (!conv[r.code]) continue;
				const {rows} = await pool.query(`select min(cast(acc as numeric)) as acc from score_csv_new where ${conv[r.code]}<=$1`,[r.score])
				const a = {...r, acc: rows[0].acc}
				ans.get_combine_scores.push(a);
			}
			data = [ans]
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
