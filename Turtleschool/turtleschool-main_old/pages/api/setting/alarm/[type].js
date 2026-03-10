import pool from '../../../../lib/pool';

const getType = type => {
  switch (type) {
    case 'ipsy':
      return 'ipsy_alarm_yn';
    case 'mento':
      return 'mento_alarm_yn';
  }
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
  let resultCode;
  const {type} = req.query;
  const {status} = req.body;

  switch (req.method) {
    case 'PUT':
      resultCode = await pool.query(
        `update members
         set ${getType(type)}=$2
         where id=$1
        `,
        [memberId, status],
      );
      res.send({success: true, msg: 'update success', data: resultCode.rowCount});
      break;
    default:
      break;
  }
};
