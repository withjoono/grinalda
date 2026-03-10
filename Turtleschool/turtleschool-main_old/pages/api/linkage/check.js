import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select * from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  await pool.query(`delete from tempcode where now() > expire`);
  const {random} = req.query;
  let temp = await pool.query(
    `select memberid , code , expire  from tempcode where code = $1 and now() < expire`,
    [random],
  );

  console.log(temp.rows);
  if (temp.rows.length == 0) {
    res.json({
      success: 'no match',
      msg: '유효하지 않은 코드입니다',
      data: null,
    });
    res.statusCode = 406;
    res.end();
    return;
  }
  let code = await pool.query(
    `select m.*, m."relationCode" as rel from members m inner join tempcode t on t.memberid=$1 and m.account = t.memberid`,
    [temp.rows[0].memberid],
  );
  let bool = await pool.query(
    `select case when count(*) > 0 then 'Y' else 'N' end as yn from accountlinks a where ((memberid = $1 and memberid2 = $2) or (memberid = $2 and memberid2 = $1))`,
    [req.headers.auth, temp.rows[0].memberid],
  );

  console.log(code.rows[0], rows[0]);
  if (bool.rows[0].yn == 'Y') {
    res.json({success: 'over', msg: '이미 연동된 계정입니다', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  if (code.rows.length > 0 && code.rows[0].id == rows[0].id) {
    //자기 자신 연동 일때
    res.json({
      success: 'self',
      msg: '자신과 연동하실수 없습니다',
      data: null,
    });
    res.statusCode = 406;
    res.end();
    return;
  }

  if (code.rows[0].rel > 0 && code.rows[0].rel == rows[0].relationCode) {
    //같은 직종일때

    res.json({
      success: 'overlap',
      msg: '같은 직종끼리 연동할수 없습니다',
      data: null,
    });
    res.statusCode = 406;
    res.end();
    return;
  }

  if (code.rows[0].rel > 0 && code.rows[0].rel == '20') {
    //학부모가 보냈을때
    if (!rows[0].relationCode == '10')
      // 학생이 아닐경우
      res.json({success: 'par', msg: '자녀만 연동가능합니다', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  if (
    code.rows[0].rel > 0 &&
    code.rows[0].rel == '40' &&
    code.rows[0].rel == '50' &&
    code.rows[0].rel == '60' &&
    code.rows[0].rel == '70'
  ) {
    //학부모가 보냈을때
    if (!rows[0].relationCode == '10') {
      // 학생이 아닐경우
      res.json({success: 'teach', msg: '학생만 연동 가능합니다', data: null});
      res.statusCode = 406;
      res.end();
      return;
    }
  }

  res.json({success: true, data: {mento_account: code.rows[0].account, info: rows[0]}});
  res.statusCode = 200;
  res.end();
};
