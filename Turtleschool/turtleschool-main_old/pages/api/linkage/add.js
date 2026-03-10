import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select id, "relationCode" from members where account = $1`, [
    req.headers.auth,
  ]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  const id = req.query.id;
  // const rot = req.query.rot;
  const myid = rows[0].id;

  await pool.query(`insert into accountlinks values ($1,$2) on conflict do nothing`, [
    req.headers.auth,
    id,
  ]);

  await pool.query(
    `insert into adminclass (memberid , memberid2 , useyn , fsrdtm , lshdtm , groupid, groupname )
                                      values ($1,(select id from members where account = $2),'Y',current_date,current_date,'연동유저', '연동유저') on conflict (memberid, memberid2) DO NOTHING
                                        ;`,
    [myid, id],
  );

  await pool.query(
    `insert into adminclass (memberid , memberid2 , useyn , fsrdtm , lshdtm , groupid, groupname )
                                      values ((select id from members where account = $1),$2,'Y',current_date,current_date,'연동유저', '연동유저') on conflict (memberid, memberid2) DO NOTHING
                                        ;`,
    [id, myid],
  );

  res.json({success: true});
  res.statusCode = 200;
  res.end();
};
