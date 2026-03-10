import pool from '../../../lib/pool';

/*
    - title: 사용자 정보 수정
    - params:
*/

export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = -1;

  let s_cellphone = req.query.cellphone;
  let s_candnumber = req.query.candnumber;

  switch (req.method) {
    case 'GET':
    case 'POST':
      let {rows} = await pool.query(
        `

          select case when count(*) > 0 then 'true' else 'false' end code
          from members
          where replace(cellphone, '-', '') = replace($1, '-', '')
          and candnumber = $2
                `,
        [s_cellphone, s_candnumber],
      );

      success = true;
      data = rows;
      break;
    default:
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
