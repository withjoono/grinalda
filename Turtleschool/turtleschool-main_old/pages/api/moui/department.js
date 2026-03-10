import pool from '../../../lib/pool';

/*
    - 지역, 문/이과, 검색명, 계열을 바탕으로 각 대학 학과의 커트라인
    - params:
        area: 지역코드
		line: 문이과코드
		query: 검색어
		group: 계열
*/

const getRange = (scores, row) => {
  for (let i = 0; i < scores.length; i++) {
    if (row.조합 == scores[i].name) {
      return [row.id, row.name, row.학과, row.표점, scores[i].score];
    }
  }
  return [0, 0];
};

export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let memberId = rows[0].id;
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = {};
  const {area, line, query, group} = req.query;

  const lin = line == '20' ? '자연' : '인문';
  switch (req.method) {
    case 'GET':
      const a = await pool.query(
        `select u."name",u.id,m.학과,m.표점,m.조합 from universities u inner join "convertUniName" cun on u."name" = cun.변환 inner join mouidata m on m.대학 = cun.이투스 where u."areaCode" = $1
and (m.문이과 = $2 or coalesce ($2, '1') = '') and m.학과 like concat('%',$3::text,'%') and m.계열 = $4`,
        [area, lin, query, group],
      );
      const z = await pool.query(
        `select exams.*, "codeExams".year, "codeExams".grade from exams inner join "codeExams" on exams."typeId" = "codeExams".id where "memberId" = $1 and "typeId" != 0`,
        [memberId],
      );
      if (z.rows.length > 0) {
        const temp = z.rows.sort((a, b) => {
          if (a.year < b.year) return 1;
          else if (a.year == b.year) {
            if (a.typeId < b.typeId) return 1;
            else if (a.typeId == b.typeId) return 0;
            else return -1;
          } else return -1;
        });
        const max = temp[0].typeId;
        const dd = await pool.query(
          `SELECT  get_combine_scores($1, $2, $3, $4, $5);
                `,
          [2020, memberId, false, '10', max],
        );
        data = a.rows.map(r => getRange(dd.rows[0].get_combine_scores, r));
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
};
