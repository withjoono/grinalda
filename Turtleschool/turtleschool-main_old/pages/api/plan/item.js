import pool from '../../../lib/pool';

export default async (req, res) => {
  const w = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (w.rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  if (req.method == 'POST') {
    const {
      title,
      step,
      subject,
      startday,
      endday,
      type,
      material,
      amount,
      person,
      finished,
      isitem,
      starttime,
      endtime,
    } = req.body;

    if (!req.body.id) {
      const a = await pool.query(
        `insert into plans (title,step,subject,range,type,material,total,person,done,memberid,isitem,starttime,endtime)
			values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id
			`,
        [
          title,
          step,
          subject,
          '[' + startday + ',' + endday + ']',
          type == 'textbook' ? 1 : 0,
          material ? material : null,
          amount ? amount : null,
          person ? person : null,
          finished,
          w.rows[0].account,
          isitem,
          starttime,
          endtime,
        ],
      );

      res.json({success: true, msg: 'success', data: a.rows[0].id});
      res.statusCode = 200;
      res.end();
    } else {
      const a = await pool.query(
        `update plans set (title,step,subject,range,type,material,total,person,done,memberid,isitem,starttime,endtime) =
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$12,$13,$14) where id = $11
			`,
        [
          title,
          step,
          subject,
          '[' + startday + ',' + endday + ']',
          type == 'textbook' ? 1 : 0,
          material ? material : null,
          amount ? amount : null,
          person ? person : null,
          finished,
          w.rows[0].account,
          req.body.id,
          isitem,
          starttime,
          endtime,
        ],
      );

      res.json({success: true, msg: 'success'});
      res.statusCode = 200;
      res.end();
    }
  } else {
    const {rows} = await pool.query(
      `select id, "range" , memberid , title , subject , step , starttime , endtime , "type" ,
done , total , person, material , isitem , isitemdone
 from plans where memberid = $1 and starttime is not null`,
      [req.headers.auth],
    );
    const yea = rows.map(obj => {
      if (!!obj.material)
        obj.study = {
          title: obj.material,
          amount: obj.total,
          finished: obj.done,
          person: obj.person,
          type: obj.type ? 'textbook' : 'lecture',
        };
      return obj;
    });

    res.json({success: true, msg: 'success', data: yea});
    res.statusCode = 200;
    res.end();
  }
};
