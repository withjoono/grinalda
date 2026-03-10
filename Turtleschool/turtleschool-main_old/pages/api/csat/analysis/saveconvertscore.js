import pool from '../../../../lib/pool';

/*
    - title:
    - params:
*/
export default async (req, res) => {
  let rows = await pool.query(`select id from members where account = $1`, [req.headers.auth]);

  if (rows.length < 1) {
    res.status(406).json({success: false, msg: 'No authorization', data: null});
    res.end();
    return;
  }

  let s_univ_sub_code = req.body.data.univ_sub_code;
  let s_major_line_cd = req.body.data.major_line_cd;
  let s_calculate_score = req.body.data.calculate_score;

  if (req.method == 'POST') {
    //1.저장전에 삭제
    await pool.query(`delete from ontimepersoncalculatescore_mapping where member_id = $1 and univ_sub_code = $2 and major_line_cd = $3`, [
      req.headers.auth,
      s_univ_sub_code,
      s_major_line_cd
    ]);

    //2.삭제후 저장
    //for (var i = 0; i < req.body.data.length; i++)
    //{
    await pool.query(
      `
        insert into ontimepersoncalculatescore_mapping
        (univ_sub_code, major_line_cd, member_id, calculate_score, ontimeunivmajor_id)
        select univ_sub_code, major_line_cd, $3, $4, ontimeunivmajor_id
          from ontimeunivmajor
         where univ_sub_code = $1
           and major_line_cd = $2
				`,
      [s_univ_sub_code, s_major_line_cd, req.headers.auth, s_calculate_score],
    );
    //}

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};











