import pool from '../../../lib/pool';

/*
    - title: 학교검색결과
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
  let s_recruitment = req.query.recruitment;
  let s_area = req.query.area;
  let s_cross_sprt = req.query.cross_sprt;

  switch (req.method) {
    case 'GET':
    case 'POST':
      rows = await pool.query(
        `

              select u.name as universityid_nm,        --대학명
                     u.id as universityid_cd,  --대학코드
                     recruitment,   --1가 2나 3다군
                     lar_fld,       --인문 자연
                     standard_score_i , --표준편차_최소
                     standard_score_a , --표준편차_최대
                     b.user_score       --내점수
              from public.csatunivsco a
              , universities u
              ,(select sum(case when score_b = '999' then score_a else score_a + score_b end) as user_score,
                	   max(case when subject.upper_subject_cd = '1' then 1 else 0 end) as subject_division
                  from (select subject_a, score_a, score_b from csatidscore
                	     where memberid = $1
                	       and division = $2) score,
                	   (select subject_cd, upper_subject_cd from subjecttitle
                	     where upper_subject_cd in ('1','2','6','7')) subject
                 where score.subject_a = subject.subject_cd
               ) b
              where 1=1
              and (((coalesce ($5, '1') ='1') and (a.lar_fld = case when b.subject_division = '1' then '자연' else '인문' end)) or
                   ((coalesce ($5, '1')!='1') and (a.lar_fld = case when b.subject_division = '1' then '인문' else '자연' end)))
              and cast(a.universityid as numeric) = u.id
              and a.recruitment = $3 --'1'
              and (((coalesce ($4, '1') ='1') and (1=1)) or
                	 ((coalesce ($4, '1')!='1') and (u."areaCode" IN (select unnest(string_to_array($4, ',')) as score))))
              order by u.name
                `,
        [req.headers.auth, s_division, s_recruitment, s_area, s_cross_sprt],
      );

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
