import pool from '../../../lib/pool';

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

  let s_year = req.body.data.year;
  let s_array_score = req.body.data.array_score;

  /*
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];
    const subjects = s_array_score.split('|').map((subject) => subject.split(','));
    ubjects);

    const stringfySubjects = (prev, curr, i) => {
        if (curr[0][0] === '6') {
            return prev + `${curr[2]}|`;
        } else if (curr[0] === '1G') {
            return prev + `${curr[4]}|`;
        } else if (curr[0][0] === '7' || curr[0][0] === '1' || curr[0][0] === '2') {
            return prev + `${curr[0]},${curr[2]}|`;
        } else {
            return prev + `${curr[4]}|`;
        }
    };

    axios
        .get('https://ingipsy.com/api/pay/payment', {
            headers: {
                auth: req.headers.auth,
            },
        })
        .then((res) => {
        }).catch(e => {
          console.log('error')
        });
*/

  if (req.method == 'POST') {
    //1.저장전에 삭제
    await pool.query(`delete from csatidscore where memberid = $1 and year = $2 `, [
      req.headers.auth,
      s_year,
    ]);

    //2.삭제후 저장
    //for (var i = 0; i < req.body.data.length; i++)
    //{
    await pool.query(
      `
      insert into csatidscore
      (memberid, division, subject_a, score_a, subject_b, score_b, standardscore, percentage, grade, year, useyn)
      select $1, '1',
         subject_a, score_a, null, null, standardscore,
         case when substring(subject_a, 1, 1) in ('6','7','1','2') and subject_a != '1G' and percentage is null
        	    then cast(( select percentage_score from csatsspu
                    			where division = '2'
                    			and subject = subject_a
                    			and standard_score = cast(standardscore as varchar)
                    			limit 1) as numeric)
        	    else percentage  end as percentage_score ,
          case when grade is null
        	     then cast(( select rating_score from csatsspu
                    			 where division = '2'
                    			 and subject = subject_a
                    			 and standard_score = cast(standardscore as varchar)
                    			 limit 1) as numeric)
        	     else grade  end as grade,
        	cast($2 as varchar),
          'Y'
          from (
              select split_part(score, ',', 1) as subject_a,
                	   cast(case when length(split_part(score, ',', 2)) > 0 then split_part(score, ',', 2) else null end as numeric) as score_a,
                     cast(case when length(split_part(score, ',', 3)) > 0 then split_part(score, ',', 3) else null end as numeric) as standardscore,
                     cast(case when length(split_part(score, ',', 4)) > 0 then split_part(score, ',', 4) else null end as numeric) as percentage,
                	   cast(case when length(split_part(score, ',', 5)) > 0 then split_part(score, ',', 5) else null end as numeric) as grade
                from (--'6F,,90,,|7F,,88,,|81,,,,1|1G,,,,2|10,,50,,|1F,,44,,'
                      select unnest(string_to_array($3, '|')) as score
                			) as z1
          ) as a
          where not exists (select 'X' from csatidscore z
                            where z.memberid = cast($1 as numeric)
                            and z.division = '1'
                            and z.year = cast($2 as varchar)
                            and z.useyn= 'Y')
          ;
  				`,
      [req.headers.auth, s_year, s_array_score],
    );
    //}

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};
