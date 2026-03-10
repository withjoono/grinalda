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
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  let s_division = req.query.division;
  let s_year = req.query.year;
  let s_univ_nm = req.query.univ_nm;
//  let s_univ_sub_code = req.query.univ_sub_code;
  let s_major_line_cd = req.query.major_line_cd;
  let s_major_nm = req.query.major_nm;
  let sql = `
             with univ_sub_codes as (
                select univ_sub_code from ontimeunivmajor
                where univ_nm = $4
                and major_line_cd = $5
                and depart_nm = $6
                group by univ_sub_code
             )
             select univ_sub_code,
                              (select mapping_cd from ontimeunivsubcalculatemapping where univ_sub_code = total.univ_sub_code) as calculate_cd,
                              res_subject_cd,
                              sum(kor_standard_score) as kor_standard_score,
                              sum(mat_standard_score) as mat_standard_score,
                              sum(eng_standard_score) as eng_standard_score,
                              sum(kst_standard_score) as kst_standard_score,
                              res_standard_score,
                              sum(fog_standard_score) as fog_standard_score,

                              sum(kor_percentage_score) as kor_percentage_score,
                              sum(mat_percentage_score) as mat_percentage_score,
                              sum(eng_percentage_score) as eng_percentage_score,
                              sum(kst_percentage_score) as kst_percentage_score,
                              res_percentage_score,
                              sum(fog_percentage_score) as fog_percentage_score,

                              sum(kor_rating_score) as kor_rating_score,
                              sum(mat_rating_score) as mat_rating_score,
                              sum(eng_rating_score) as eng_rating_score,
                              sum(kst_rating_score) as kst_rating_score,
                              res_rating_score,
                              sum(fog_rating_score) as fog_rating_score,

                              sum(kor_conversion_score) as kor_conversion_score,
                              sum(mat_conversion_score) as mat_conversion_score,
                              sum(eng_conversion_score) as eng_conversion_score,
                              sum(kst_conversion_score) as kst_conversion_score,
                              res_conversion_score,
                              sum(fog_conversion_score) as fog_conversion_score
                        from (
                       select
                        univ_sub_code,
                        subject_cd,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.standard_score as numeric) else 0 end) as kor_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.standard_score as numeric) else 0 end) as mat_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.standard_score as numeric) else 0 end) as eng_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.standard_score as numeric) else 0 end) as kst_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.standard_score as numeric) else 0 end) as res_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.standard_score as numeric) else 0 end) as fog_standard_score,

                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.percentage_score as numeric) else 0 end) as kor_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.percentage_score as numeric) else 0 end) as mat_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.percentage_score as numeric) else 0 end) as eng_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.percentage_score as numeric) else 0 end) as kst_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.percentage_score as numeric) else 0 end) as res_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.percentage_score as numeric) else 0 end) as fog_percentage_score,

                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.rating_score as numeric) else 0 end) as kor_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.rating_score as numeric) else 0 end) as mat_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.rating_score as numeric) else 0 end) as eng_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.rating_score as numeric) else 0 end) as kst_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.rating_score as numeric) else 0 end) as res_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.rating_score as numeric) else 0 end) as fog_rating_score,

                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.conversion_score as numeric) else 0 end) as kor_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.conversion_score as numeric) else 0 end) as mat_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.conversion_score as numeric) else 0 end) as eng_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.conversion_score as numeric) else 0 end) as kst_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.conversion_score as numeric) else 0 end) as res_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.conversion_score as numeric) else 0 end) as fog_conversion_score,

                        case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then score.subject_cd else '0' end as res_subject_cd
                        from (select org_score.univ_sub_code, org_score.subject_cd, org_score.standard_score, org_score.percentage_score, org_score.rating_score, org_score.conversion_score,
                                     (select upper_subject_cd_order from subjecttitle where subject_cd = org_score.subject_cd) as upper_subject_order,
                                     (select subject_order from subjecttitle where subject_cd = org_score.subject_cd) as subject_order
                              from
                                (
                                    select univ_sub_code, subject_cd, standard_score, percentage_score, rating_score, conversion_score from ontimepersonconvertscore
                                    where member_id = $1
                                  and univ_sub_code  in (select univ_sub_code from univ_sub_codes)
                                  and year = $3
                                  and division = $2
                                  and use_yn = 'Y'
                                  group by univ_sub_code, subject_cd, standard_score, percentage_score, rating_score, conversion_score
                                ) org_score
                             ) score
                        group by univ_sub_code, subject_cd, standard_score, percentage_score, rating_score, conversion_score, upper_subject_order, subject_order
                        ) total
                        group by univ_sub_code, res_subject_cd, res_standard_score, res_percentage_score, res_rating_score, res_conversion_score

                 `

  let sql_temp = `
               with univ_sub_codes as (
                select univ_sub_code from ontimeunivmajor
                where univ_nm = $4
                and major_line_cd = $5
                group by univ_sub_code
               )
               select univ_sub_code,
                              (select mapping_cd from ontimeunivsubcalculatemapping where univ_sub_code = total.univ_sub_code) as calculate_cd,
                              res_subject_cd,
                              sum(kor_standard_score) as kor_standard_score,
                              sum(mat_standard_score) as mat_standard_score,
                              sum(eng_standard_score) as eng_standard_score,
                              sum(kst_standard_score) as kst_standard_score,
                              res_standard_score,
                              sum(fog_standard_score) as fog_standard_score,

                              sum(kor_percentage_score) as kor_percentage_score,
                              sum(mat_percentage_score) as mat_percentage_score,
                              sum(eng_percentage_score) as eng_percentage_score,
                              sum(kst_percentage_score) as kst_percentage_score,
                              res_percentage_score,
                              sum(fog_percentage_score) as fog_percentage_score,

                              sum(kor_rating_score) as kor_rating_score,
                              sum(mat_rating_score) as mat_rating_score,
                              sum(eng_rating_score) as eng_rating_score,
                              sum(kst_rating_score) as kst_rating_score,
                              res_rating_score,
                              sum(fog_rating_score) as fog_rating_score,

                              sum(kor_conversion_score) as kor_conversion_score,
                              sum(mat_conversion_score) as mat_conversion_score,
                              sum(eng_conversion_score) as eng_conversion_score,
                              sum(kst_conversion_score) as kst_conversion_score,
                              res_conversion_score,
                              sum(fog_conversion_score) as fog_conversion_score
                        from (
                       select
                        univ_sub_code,
                        subject_cd,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.standard_score as numeric) else 0 end) as kor_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.standard_score as numeric) else 0 end) as mat_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.standard_score as numeric) else 0 end) as eng_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.standard_score as numeric) else 0 end) as kst_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.standard_score as numeric) else 0 end) as res_standard_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.standard_score as numeric) else 0 end) as fog_standard_score,

                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.percentage_score as numeric) else 0 end) as kor_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.percentage_score as numeric) else 0 end) as mat_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.percentage_score as numeric) else 0 end) as eng_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.percentage_score as numeric) else 0 end) as kst_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.percentage_score as numeric) else 0 end) as res_percentage_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.percentage_score as numeric) else 0 end) as fog_percentage_score,

                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.rating_score as numeric) else 0 end) as kor_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.rating_score as numeric) else 0 end) as mat_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.rating_score as numeric) else 0 end) as eng_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.rating_score as numeric) else 0 end) as kst_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.rating_score as numeric) else 0 end) as res_rating_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.rating_score as numeric) else 0 end) as fog_rating_score,

                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '6' then cast(score.conversion_score as numeric) else 0 end) as kor_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '7' then cast(score.conversion_score as numeric) else 0 end) as mat_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '8' then cast(score.conversion_score as numeric) else 0 end) as eng_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = 'G' then cast(score.conversion_score as numeric) else 0 end) as kst_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then cast(score.conversion_score as numeric) else 0 end) as res_conversion_score,
                        sum(case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) = '9' then cast(score.conversion_score as numeric) else 0 end) as fog_conversion_score,

                        case when (select upper_subject_cd from subjecttitle where subject_cd = score.subject_cd) in ('1','2') then score.subject_cd else '0' end as res_subject_cd
                        from (select org_score.univ_sub_code, org_score.subject_cd, org_score.standard_score, org_score.percentage_score, org_score.rating_score, org_score.conversion_score,
                                     (select upper_subject_cd_order from subjecttitle where subject_cd = org_score.subject_cd) as upper_subject_order,
                                     (select subject_order from subjecttitle where subject_cd = org_score.subject_cd) as subject_order
                              from
                                (
                                    select univ_sub_code, subject_cd, standard_score, percentage_score, rating_score, conversion_score from ontimepersonconvertscore
                                    where member_id = $1
                                    and univ_sub_code  in (select univ_sub_code from univ_sub_codes)
                                    and year = $3
                                    and division = $2
                                    and use_yn = 'Y'
                                    group by univ_sub_code, subject_cd, standard_score, percentage_score, rating_score, conversion_score
                                ) org_score
                             ) score
                        group by univ_sub_code, subject_cd, standard_score, percentage_score, rating_score, conversion_score, upper_subject_order, subject_order
                        ) total
                        group by univ_sub_code, res_subject_cd, res_standard_score, res_percentage_score, res_rating_score, res_conversion_score

                   `
  let query = [
                          req.headers.auth,
                          s_division,
                          s_year,
                          s_univ_nm,
                          s_major_line_cd,
                          s_major_nm
                        ]
  let query_temp = [
                               req.headers.auth,
                               s_division,
                               s_year,
                               s_univ_nm,
                               s_major_line_cd
                             ]
  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(sql,query);

      if (rows.rows == undefined || rows.rows.length < 1) {
        res.json({success: false, msg: 'No data', data: null});
        res.statusCode = 406;
        res.end();
        return;
      }

      success = true;
      data = rows.rows;
      break;
    default:
      break;
  }

  if (success) {
    statusCode = 200;
    msg = 'success';
  }

  res.status(statusCode).json({success: success, msg: msg, data: data});
  res.end();
};
