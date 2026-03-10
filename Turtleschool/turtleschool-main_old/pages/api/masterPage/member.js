import pool from '../../../lib/pool';

//회원정보
export default async (req, res) => {
  const {rows} = await pool.query(
    `select id from members m where "relationCode" ='99'
    and account =$1`,
    [req.headers.auth],
  );
  if (rows.length < 1) {
    res.json({success: false, msg: 'not authorized', data: []});
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method == 'GET') {
    let {rows} = await pool.query(`select
                                     user_name  as name
                                    ,cellphone  as cell
                                    ,email      as email
                                    ,join_date
                                    from members
                                    where cellphone is not null
                                    and email is not null
                                    and user_name is not null
                                    and user_name !=''
                                    order by join_date desc;`);
    if (rows.length < 1) {
      res.json({success: false, msg: 'No authorization', data: null});
      res.statusCode = 406;
      res.end();
      return;
    }
    res.json({success: true, msg: 'success', data: rows});
    res.statusCode = 200;
    res.end();
  }
};
