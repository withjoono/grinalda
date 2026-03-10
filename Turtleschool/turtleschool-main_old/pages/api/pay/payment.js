import pool from '../../../lib/pool';

export default async (req, res) => {
  //클릭했을때 결제했는지
  let {rows} = await pool.query(
    `select m.id as id, p2.id as typeid     --유료 페이지에 결제했는지 구분
      from members m
       left join payments p on p.accountid = m.id
       inner join paymenttypes p2 on p2.id = p.typesid where account = $1`,
    [req.headers.auth],
  );
  const {type} = req.query;
  const typeId =
    type == '정시' ? 8 : type == '수시' ? 1 : type == '플래너' ? 2 : type == '논술' ? 9 : null;

  let success = false;

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].typeid == typeId) {
      success = true;
      break;
    }
  }
  if (!typeId) success = true;
  if (!success) {
    res.json({
      success: false,
      msg: '결제가 필요한 페이지 입니다',
      data: null,
    });
    res.statusCode = 200;
    res.end();
    return;
  }

  res.json({success: true, msg: '결제했음', data: rows});
  res.statusCode = 200;
  res.end();
  return;
};
