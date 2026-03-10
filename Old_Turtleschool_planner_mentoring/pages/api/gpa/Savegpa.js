
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 내신성적관리 > 성적입력 > 수정하기, 엑셀업로드
    - params:
*/
export default async (req, res) => {
	
	let { rows } = await pool.query(`select id, account from members where account = $1`, [req.headers.auth])
    if (rows.length < 1) {
        res.json({success: false, msg: 'No authorization2', data: null});
        res.statusCode = 200;
        res.end();
        return;
    }

    if (req.method == 'POST') {
		console.log(req.body)
		if (req.body.delete) {
			await pool.query(`delete from gpa where accountid = $1`,[rows[0].id])
		}
		else if (!req.body.data) { //하나씩				
			const { grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper } 
			= {grade: req.body.grade, semester: req.body.semester, subjectarea: req.body.subjectarea, subjectcode: req.body.subjectcode, unit: req.body.unit, 
				originscore: req.body.originscore, averagescore: req.body.averagescore, standarddeviation: req.body.standarddeviation, achievement: req.body.achievement, 
				persons: req.body.persons, rank: req.body.rank, aper: req.body.aper, bper: req.body.bper, cper: req.body.cper}
			await pool.query(`insert into gpa
			(grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper, accountid)
								values ($2,$3,$4,$5,$6,round($7, 2),round($8, 2),round($9, 2),$10,$11,$12,$13,$14,$15,$1)
			`,[rows[0].id, grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper]) //.then(res=>console.log(res)).catch(res=>console.log(res))
		} else {
			for (var i=0;i<req.body.data.length;i++){//한번에 입력
				const { grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper, id } 
				= {grade: req.body.data[i].grade, semester: req.body.data[i].semester, subjectarea: req.body.data[i].subjectarea, subjectcode: req.body.data[i].subjectcode, unit: req.body.data[i].unit, 
					originscore: req.body.data[i].originscore, averagescore: req.body.data[i].averagescore, standarddeviation: req.body.data[i].standarddeviation, achievement: req.body.data[i].achievement, 
					persons: req.body.data[i].persons, rank: req.body.data[i].rank, aper: req.body.data[i].aper, bper: req.body.data[i].bper, cper: req.body.data[i].cper, id: req.body.data[i].id}
				if (!id) { // 새로운 정보
					await pool.query(`insert into gpa
					(grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper, accountid)
										values ($2,$3,$4,$5,$6,round($7, 2),round($8, 2),round($9, 2),$10,$11,$12,$13,$14,$15,$1) on conflict on constraint gpa_un
					do update
						set (unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper) = ($6,round($7, 2),round($8, 2),round($9, 2),$10,$11,$12,$13,$14,$15)
					`,[rows[0].id, grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper]) //.then(res=>console.log(res)).catch(res=>console.log(res))
				} else { // 이미 db에 있던걸 수정하는 경우
					await pool.query(`insert into gpa
					(id, grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper, accountid)
										values ($1, $2,$3,$4,$5,$6,round($7, 2),round($8, 2),round($9, 2),$10,$11,$12,$13,$14,$15,$16) on conflict (id)
					do update
						set (grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper, accountid) = ($2,$3,$4,$5,$6,round($7, 2),round($8, 2),round($9, 2),$10,$11,$12,$13,$14,$15,$16)
					`,[id, grade, semester, subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, aper, bper, cper, rows[0].id]) //.then(res=>console.log(res)).catch(res=>console.log(res))
				}
			}
		}
		res.json({success: true, msg: 'success2'});
		res.statusCode = 200;
		res.end();
	} else if (req.method == 'GET') {
		const data = await pool.query(`select * from gpa where accountid = $1
				`,[rows[0].id])
		data.rows.sort((a,b) => {
			if (a.subjectarea > b.subjectarea) return -1;
			else if (a.subjectarea == b.subjectarea) {
				if (a.subjectcode > b.subjectcode) return -1;
				else if (a.subjectcode == b.subjectcode) return 0;
				else return 1;
	
			}
			else return 1;
			})
		res.json({success: true, msg: 'success2',data:data.rows});
		res.statusCode = 200;
		res.end();
	}
    
}
