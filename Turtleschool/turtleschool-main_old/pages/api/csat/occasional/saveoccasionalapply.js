import pool from '../../../../lib/pool';

/*
    - title:
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.status(406).json({success: false, msg: 'No authorization', data: null});
    res.end();
    return;
  }

  let s_occasional_id = req.body.data.occasional_id;

  if (req.method == 'POST') {

    await pool.query(
      `
      insert into occasional_personal
      (occasional_id, member_id) values (
         $1, $2
      );
      `,
      [s_occasional_id, req.headers.auth],
    );
    //}

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};
