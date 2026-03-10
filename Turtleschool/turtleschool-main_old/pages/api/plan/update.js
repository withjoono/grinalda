import pool from '../../../lib/pool';

export default async (req, res) => {
  const w = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (w.rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  const {id, done, itemid} = req.query;
  const a = await pool.query(
    `select id, "range" , memberid , title , subject , step , starttime , endtime , "type" ,
done , total , person, material , isitem , isitemdone
 from plans where id = $1`,
    [itemid],
  );

  if (id) {
    if (!a.rows[0].isitemdone) {
      const {rows} = await pool.query(
        `update plans p set done = p.done + $3 where memberid = $1 and id = $2 returning done`,
        [req.headers.auth, id, parseInt(done)],
      );
    } else {
      const {rows} = await pool.query(
        `update plans p set done = p.done - $3 where memberid = $1 and id = $2 returning done`,
        [req.headers.auth, id, parseInt(done)],
      );
    }
    await pool.query(
      `update plans p set isitemdone = not isitemdone where memberid = $1 and id = $2`,
      [req.headers.auth, itemid],
    );
    res.json({success: true, msg: 'success'});
    res.statusCode = 200;
    res.end();
  } else {
    await pool.query(
      `update plans p set isitemdone = not isitemdone where memberid = $1 and id = $2`,
      [req.headers.auth, itemid],
    );
    res.json({success: true, msg: 'success'});
    res.statusCode = 200;
    res.end();
  }
};
