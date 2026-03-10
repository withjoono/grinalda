import pool from '../../../lib/pool'
import axios from 'axios'

export default async (req, res) => {
	const w = await pool.query(`select * from members where account = $1`, [req.headers.auth])
    if (w.rows.length < 1) {
        res.json({success: false, msg: 'No authorization', data: null});
        res.statusCode = 406;
        res.end();
        return;
    }
	if (req.method == 'POST') {

		const {primaryType,subject,teacher,title,startDate,endDate,rRule,late,absent,description,progress,score,rank,mentor_rank,mentor_desc,mentor_test,studyType,studyContent,exDate,start_page,end_page,start_secssion,end_secssion} = req.body;
		const arr = [w.rows[0].id,primaryType,subject,teacher,title,startDate,endDate,rRule,late,absent,description,progress,score,rank,mentor_rank,mentor_desc,mentor_test,studyType,studyContent,exDate,start_page,end_page,start_secssion,end_secssion]
		if (!req.body.id) {
			console.log(arr)
			const a = await pool.query(`
				insert into planneritems
				("memberId", "primaryType", subject, teacher, title,
				 "startDate", "endDate", "rRule", late, absent,
				 description, progress, score, rank, mentor_rank,
				 mentor_desc, mentor_test, "studyType", "studyContent", "exDate",
				 start_page, end_page, start_secssion, end_secssion)
			values ($1,$2,$3,$4,$5,
				      $6,$7,$8,$9,$10,
							$11,$12,$13,$14,$15,
							$16,$17,$18,$19,$20,
							$21,$22,$23,$24) returning id
			`,arr)

			res.json({success: true, msg: 'success', data:a.rows[0].id});
			res.statusCode = 200;
			res.end();
		} else {
			arr.push(req.body.id)
			const a = await pool.query(`
				update planneritems
				set ("memberId", "primaryType", subject, teacher, title,
						 "startDate", "endDate", "rRule", late, absent,
						 description, progress, score, rank, mentor_rank,
						 mentor_desc, mentor_test, "studyType", "studyContent", "exDate",
						 start_page, end_page, start_secssion, end_secssion) =
			 ($1,$2,$3,$4,$5,
				$6,$7,$8,$9,$10,
				$11,$12,$13,$14,$15,
				$16,$17,$18,$19,$20,
				$21,$22,$23,$24)
				where id = $21
			`,arr)

			res.json({success: true, msg: 'success'});
			res.statusCode = 200;
			res.end();
		}
	} else {
		const {rows} = await pool.query(`select * from planneritems where "memberId" = $1`,[w.rows[0].id])
		res.json({success: true, msg: 'success', data:rows});
		res.statusCode = 200;
		res.end();
	}
}
