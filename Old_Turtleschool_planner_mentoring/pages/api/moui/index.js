
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - 지역과 문/이과 구분 및 자기 모의 점수로 대학별 최저/최고점 조회
    - params:
		area: 지역(코드화)
		line: 문/이과
*/

const getRange = (scores, row) => {
	let match = ''
	for(let i=0;i<scores.length;i++){
		if (row.조합 == scores[i].name) {
			return [row.max - scores[i].score, row.min - scores[i].score,row.name,row.id]
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
	const {area, line} = req.query;
    switch (req.method) {
        case 'GET':
			const a = await pool.query(`select max(u.id) as id, u."name",max(m.표점),min(m.표점), m.조합 from universities u inner join "convertUniName" cun
			on u."name" = cun.변환 inner join mouidata m on m.대학 = cun.이투스 where u."areaCode" = $1
			and (m.문이과 = $2 or coalesce ($2, '1') = '') group by u."name", m.조합 order by u."name" desc`,[area,''])
			const z = await pool.query(`select exams.*, "codeExams".year, "codeExams".grade from exams inner join "codeExams" on exams."typeId" = "codeExams".id where "memberId" = $1 and "typeId" != 0`,[memberId])
			console.log(z.rows)
			if (z.rows.length > 0) {
				const temp = z.rows.sort((a,b) => {
					if (a.year < b.year) return 1;
					else if (a.year == b.year) {
						if (a.typeId < b.typeId) return 1;
						else if (a.typeId == b.typeId) return 0;
						else return -1;
					}else return -1;
				})
				console.log(temp)
				const max = temp[0].typeId;
				const exams = z.rows.filter(r => r.typeId == max)
				console.log(max, exams)
				const dd = await pool.query(`SELECT  get_combine_scores($1, $2, $3, $4, $5);
                `, [2020, memberId, false, '10', max])
				console.log(dd.rows[0].get_combine_scores,a.rows)
				data = a.rows.map(r => getRange(dd.rows[0].get_combine_scores, r)).reduce(
					(result,range) => {
						if (result.length == 0) result.push(range);
						else if (result[result.length-1][2] == range[2]) {
							let prev = result.pop()
							result.push([Math.max(prev[0],range[0]),Math.min(prev[1],range[1]),range[2],range[3]])
						} else {
							result.push(range);
						}
						return result;
					},[]
				).sort((a,b) => {
					const first = (a[0]-a[1])/2+a[1]
					const second = (b[0]-b[1])/2+b[1]
					if (first > second) return -1;
					else if (first == second) return 0;
					else return 1;
				})
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
