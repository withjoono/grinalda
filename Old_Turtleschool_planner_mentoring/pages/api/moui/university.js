import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - 각 대학의 학과의 커트라인을 자기 점수와 비교
    - params:
        univ: 대학 id
*/

const getRange = (scores, row) => {
	let match = ''
	for(let i=0;i<scores.length;i++){
		if (row.조합 == scores[i].name) {
			return [row.학과,row.조합,row.표점,scores[i].score]
		}
	}
	return [0,0]
}

export default async (req, res) => {
    let { rows } = await pool.query(`select id from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }

    let memberId = rows[0].id
    let success = false;
    let msg = 'fail'
    let statusCode = 500;
    let data = {};
	const {univ} = req.query;
    switch (req.method) {
        case 'GET':
			const a = await pool.query(`select m.* from universities u inner join "convertUniName" cun
			on u."name" = cun.변환 inner join mouidata m on m.대학 = cun.이투스 where u.id = $1`,[univ])
			const z = await pool.query(`select exams.*, "codeExams".year, "codeExams".grade from exams inner join "codeExams" on exams."typeId" = "codeExams".id where "memberId" = $1 and "typeId" != 0`,[memberId])
			if (z.rows.length > 0) {
				const temp = z.rows.sort((a,b) => {
					if (a.year < b.year) return 1;
					else if (a.year == b.year) {
						if (a.typeId < b.typeId) return 1;
						else if (a.typeId == b.typeId) return 0;
						else return -1;
					}else return -1;
				})
				const max = temp[0].typeId;
				const exams = z.rows.filter(r => r.typeId == max)
				const dd = await pool.query(`SELECT  get_combine_scores($1, $2, $3, $4, $5);
                `, [2020, memberId, false, '10', max])
				data = a.rows.map(r => getRange(dd.rows[0].get_combine_scores, r))
				console.log(data)
				success = true;
				msg = 'success';
			}
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
