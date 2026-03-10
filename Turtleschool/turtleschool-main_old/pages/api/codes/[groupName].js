import pool from '../../../lib/pool';

/*
    - title: 코드 조회
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: []});
    res.statusCode = 406;
    res.end();
    return;
  }

  let memberId = rows[0].id;
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = {};

  let groupId = 0;
  switch (req.query.groupName) {
    case 'student_relation': // 수험생과의 관계
      groupId = 11;
      break;
    case 'grade': // 학년코드
      groupId = 12;
      break;
    case 'score_kind': // 조합별 점수 분류
      groupId = 9;
      break;
    case 'area': //   지역
      groupId = 1;
      break;
    case 'line': //   문이과
      groupId = 2;
      break;
    case 'recruit_group': //   모집군
      groupId = 3;
      break;
    case 'curriculum_Code': //20210702 황인선 추가(엑셀업로드)
      groupId = 13; //내신교과코드
      break;
    case 'subject_Code': //20210702 황인선 추가(엑셀업로드)
      groupId = 14; //내신과목코드
      break;
  }

  switch (req.method) {
    case 'GET':
      let {rows} = await pool.query(
        `
    select	"code"
        ,	"name"
        ,   description 
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `,
        [groupId],
      );

      success = true;
      data = rows;
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
