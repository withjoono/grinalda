import pool from '../../../../lib/pool';
import logger from '../../../../src/utils/logger'

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

  let s_year = req.body.data.year;
  let s_division = req.body.data.division;

  if (req.method == 'POST') {
    //1.저장전에 삭제
    await pool.query(`delete from ontimepersonconvertscore where member_id = $1 and year = $2 and division = $3`, [
      req.headers.auth,
      s_year,
      s_division
    ]);
    let sql = `
                      with my_score as ( --점수 과목별 조회
                      	select
                      		division,
                      		memberId as member_id,
                      		year,
                      		(select upper_subject_cd from subjecttitle where subject_cd = subject_a) as upper_subject_cd,
                      		(case when (select upper_subject_cd from subjecttitle where subject_cd = subject_a) = '6' then '60' else subject_a end) as subject_cd_convert,
                      	    subject_a as subject_cd,
                      		(score_a + (case when (coalesce(score_b, 0) > 0 and score_b != 999) then score_b else 0 end)) as original_score,
                      		standardscore as standard_score,
                      		percentage as percentage_score,
                      		grade as rating_score
                      	  from csatidscore
                      	 where memberId = $1
                      	   and year = $2
                      	   and division = $3
                      )
                      , univ_score as (
                      	select
                      		so.member_id,
                      		so.division,
                      		so.year as year,
                      		so.subject_cd,
                      		so.standard_score,
                      	 	so.percentage_score,
                      		so.rating_score,
                      		conv.univ_sub_code,
                      		conv.conversion_score,
                      		(select upper_subject_cd_order from subjecttitle where subject_cd = so.subject_cd) as upper_order
                      	from my_score so, ontimesubjectconversionbyuniv conv
                      	where conv.subject_cd = so.subject_cd_convert
                      	  and coalesce(conv.standard_score,'999') = case when conv.standard_score is null then coalesce(conv.standard_score, '999') else text(so.standard_score) end
                      	  and conv.rating_score = case when conv.standard_score is null then text(so.rating_score) else conv.rating_score end
                      	  and conv.year = '2023'
                      -- 	  order by univ_sub_code asc, upper_order asc
                      )
                      insert into ontimepersonconvertscore
                                (division, subject_cd, univ_sub_code, univ_id, depart_id, major_line_cd, select_line_cd,
                      line_cd, gun_cd, area_cd, conversion_score, select_subject_cd, reflect_cd, combination_cd, standard_score,
                      percentage_score, rating_score, use_yn, year, member_id, is_cross_apply)
                      	select
                      		so.division,
                      		so.subject_cd,
                      		so.univ_sub_code,
                      		maj.univ_id,
                      		maj.depart_id,
                      		maj.major_line_cd,
                      		maj.select_line_cd,
                      		maj.line_cd,
                      		maj.gun_cd,
                      		maj.area_cd,
                      		so.conversion_score,
                      		select_subject_cd,
                      		maj.reflect_cd,
                      		maj.combination_cd,
                      		so.standard_score,
                      		so.percentage_score,
                      		so.rating_score,
                      		'Y' as use_yn,
                      		so.year,
                      		so.member_id,
                      		(case when ((maj.major_line_cd = '10' and line_cd = '5') or (maj.major_line_cd = '20' and line_cd = '4'))
                      			then 'Y' else 'N' end) as is_cross_apply
                      	from univ_score so, ontimeunivmajor maj
                      	where maj.univ_sub_code = so.univ_sub_code
              				`
    let query = [req.headers.auth, s_year, s_division]
    logger.info(sql)
    //2.삭제후 저장
    //for (var i = 0; i < req.body.data.length; i++)
    //{
    await pool.query(sql
      ,query

    );
    //}

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};











