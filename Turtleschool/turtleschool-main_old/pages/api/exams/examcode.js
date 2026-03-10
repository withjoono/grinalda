import pool from '../../../lib/pool';

/*
    - title: 수능 성적 입력
    - params:
{
    "exams": [
        {"subjectArea": "60", "subjectCode": "60", "standardScore": 30, "percentScore": 20, "grade": 3},
        {"subjectArea": "70", "subjectCode": "71", "standardScore": 6, "percentScore": 31, "grade": 4},
        {"subjectArea": "80", "subjectCode": "80", "standardScore": 11, "percentScore": 32, "grade": 5},
        {"subjectArea": "20", "subjectCode": "21", "standardScore": 44, "percentScore": 33, "grade": 6},
        {"subjectArea": "20", "subjectCode": "23", "standardScore": 22, "percentScore": 34, "grade": 7},
        {"subjectArea": "50", "subjectCode": "50", "standardScore": 33, "percentScore": 35, "grade": 8},
        {"subjectArea": "90", "subjectCode": "99", "standardScore": 40, "percentScore": 36, "grade": 9}
    ]
}
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  const {memberId, recruitYear, isFrequent} = {
    memberId: rows[0].id,
    recruitYear: 2020,
    isFrequent: false,
  };
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = -1;
  let type = null;

  switch (req.method) {
    case 'GET':
      type = req.query.type ? parseInt(req.query.type) : 0;
      if (type == -1) {
        let dat = await pool.query(
          `
    select	"subjectArea"
        ,	"subjectCode"
        ,	"areaNo"
		,	"originScore"
        ,	"standardScore"
        ,	"percentScore"
        ,	"grade"
		,	"typeId"
		,	"answers"
    from	"exams"
    where	"memberId"      =   $1
    and     "recruitYear"   =   $2
    and     "isFrequent"    =   $3
            `,
          [memberId, recruitYear, isFrequent],
        );
        data = dat.rows;
      } else {
        let {rows} = await pool.query(
          `
		select	"subjectArea"
			,	"subjectCode"
			,	"areaNo"
			,	"originScore"
			,	"standardScore"
			,	"percentScore"
			,	"grade"
			,	"typeId"
			,	"answers"
		from	"exams"
		where	"memberId"      =   $1
		and     "recruitYear"   =   $2
		and     "isFrequent"    =   $3
		and		"typeId"		=	$4
				`,
          [memberId, recruitYear, isFrequent, type],
        );
        data = rows;
      }

      success = true;
      break;
    case 'POST':
      type = req.body.type ? parseInt(req.body.type) : 0;
      if (req.body.answers) {
        const {rows} = await pool.query(
          `
				select "subjectArea" , "subjectCode" , "typeId" , difficulty , kind , "number" ,
 score , "questionNumber" , one, two , three , four , five, minorkind
  from omr_scores where
				"typeId" = $1 and "subjectArea" = $2 and "subjectCode" = $3 order by "questionNumber"
			`,
          [type, req.body.area, req.body.code],
        );
        let originScore = 0;
        for (var i = 0; i < req.body.answers.length; i++) {
          if (!rows[i]) break;
          if (rows[i].number == req.body.answers[i]) originScore += rows[i].score;
        }
        const whatever = await pool.query(
          `
				select "subjectCode" , "typeId" , "standardScore" , cumulative , "percentScore" , grade ,
"originScore"
 from conversion where "typeId" = $1 and "subjectCode" = $2 and "originScore" = $3
			`,
          [type, req.body.code, originScore],
        );
        let std = null;
        let per = null;
        let gra = null;
        if (whatever.rows.length) {
          std = whatever.rows[0].standardScore;
          per = whatever.rows[0].percentScore;
          gra = whatever.rows[0].grade;
        }
        const results = await pool.query(
          `
    insert into "exams" (
        "memberId"
    ,	"recruitYear"
    ,	"isFrequent"
    ,	"subjectArea"
    ,	"subjectCode"
	,	"originScore"
	,	"standardScore"
	,	"percentScore"
	,	"grade"
    ,	"createDate"
	,	"typeId"
	,	"answers"
    )
    select	$1 as "memberId"
        ,	$2 as "recruitYear"
        ,	$3 as "isFrequent"
        ,	$4 as "subjectArea"
        ,	$5 as "subjectCode"
        ,	$6 as "originScore"
		,	$9 as "standardScore"
		,	$10 as "percentScore"
		,	$11 as "grade"
        ,	timezone('utc'::text, now()) as "createDate"
		,	$7 as "typeId"
		,	$8 as "answers"
		on conflict ("memberId", "subjectArea", "subjectCode", "recruitYear", "isFrequent", "typeId")
			do update set "originScore" = excluded."originScore", "answers" = excluded."answers","createDate" = excluded."createDate"
            `,
          [
            memberId,
            recruitYear,
            isFrequent,
            req.body.area,
            req.body.code,
            originScore,
            type,
            req.body.answers,
            std,
            per,
            gra,
          ],
        );
        if (req.body.area != 10 && req.body.area != 20) {
          await pool.query(
            `delete from exams where "memberId"=$1 and "typeId"=$2 and "subjectArea"=$3 and "subjectCode"!=$4`,
            [memberId, type, req.body.area, req.body.code],
          );
        } else {
          await pool.query(
            `delete from exams where "memberId" = $1 and "typeId" = $2 and ("subjectArea" = '10' or "subjectArea"='20') and id not in (select id from (select id from exams where "memberId" = $1 and "typeId" = $2 and ("subjectArea" = '10' or "subjectArea"='20') order by id desc limit 2) as x) `,
            [memberId, type],
          );
        }
        success = true;
        data = results.rowCount;
      } else {
        const results = await pool.query(
          `
    insert into "exams" (
        "memberId"
    ,	"recruitYear"
    ,	"isFrequent"
    ,	"subjectArea"
    ,	"subjectCode"
    ,   "areaNo"
    ,	"originScore"
    ,	"standardScore"
    ,	"percentScore"
    ,	"grade"
    ,	"accumulate"
    ,	"createDate"
	,	"typeId"
    )
    select	$1 as "memberId"
        ,	$2 as "recruitYear"
        ,	$3 as "isFrequent"
        ,	a."subjectArea"
        ,	a."subjectCode"
        ,	a."areaNo"
        ,	a."originScore"
        ,	a."standardScore"
        ,	a."percentScore"
        ,	a."grade"
        ,	null
        ,	timezone('utc'::text, now()) as "createDate"
		,	$5 as "typeId"
    from	(
                select	a."temp" ->> 'subjectArea' as "subjectArea"
                    ,	a."temp" ->> 'subjectCode' as "subjectCode"
                    ,   cast(a."temp" ->> 'areaNo' as int) as "areaNo"
                    ,	cast(a."temp" ->> 'standardScore' as int) as "standardScore"
                    ,	cast(a."temp" ->> 'percentScore' as int) as "percentScore"
                    ,	cast(a."temp" ->> 'grade' as int) as "grade"
					,	cast(a."temp" ->> 'originScore' as int) as "originScore"
                from	(
                            select  JSONB_ARRAY_ELEMENTS($4::jsonb) as "temp"
                        ) as a
            ) a on conflict ("memberId", "subjectArea", "subjectCode", "recruitYear", "isFrequent", "typeId")
			do update set "standardScore" = excluded."standardScore", "percentScore" = excluded."percentScore", grade = excluded."grade", "createDate" = excluded."createDate", "originScore" = excluded."originScore"
            `,
          [memberId, recruitYear, isFrequent, JSON.stringify(req.body.exams), type],
        );
        req.body.exams.map(async e => {
          if (e.subjectArea != 10 && e.subjectArea != 20) {
            await pool.query(
              `delete from exams where "memberId"=$1 and "typeId"=$2 and "subjectArea"=$3 and "subjectCode"!=$4`,
              [memberId, type, e.subjectArea, e.subjectCode],
            );
          } else {
            await pool.query(
              `delete from exams where "memberId" = $1 and "typeId" = $2 and ("subjectArea" = '10' or "subjectArea"='20') and id not in (select id from (select id from exams where "memberId" = $1 and "typeId" = $2 and ("subjectArea" = '10' or "subjectArea"='20') order by id desc limit 2) as x) `,
              [memberId, type],
            );
          }
        });
        success = true;
        data = results.rowCount;
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
};
