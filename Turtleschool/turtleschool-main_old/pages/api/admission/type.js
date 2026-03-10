import pool from '../../../lib/pool';

/*
    - title: 수시 전형, 대학명, 학과, 전형으로 상세 정보 가져오기
    - params:
        수시전형
		대학명
		학과
		전형
*/
export default async (req, res) => {
  let {rows} = await pool.query(`select id from members where account = $1`, [req.headers.auth]);
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let memberId = rows[0].id;
  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = {};

  switch (req.method) {
    case 'GET':
      const {type, universityName, departmentName, admissionName} = req.query;
      let {rows} = await pool.query(
        `
    select	e.*, raw."활용지표",
	raw.영역수 as 수능영역수,raw.국어반영 as 수능국어반영,
	raw.국어선택 as 수능국어선택,raw.수학반영 as 수능수학반영,
	raw.수학선택 as 수능수학선택,raw.영어 as 수능영어,
	raw.탐구반영 as 수능탐구반영, raw.탐구선택 as 수능탐구선택,
	raw."제2외국어/한문" as 수능외국어, raw.한국사 as 수능한국사,
	raw.탐구반영수 as 수능탐구반영수, raw.탐구지정과목 as 수능탐구지정과목,
	raw.면접기준,raw.면접방법,raw.논술유형,raw.출제방식,
	rawd.영역수 as 최저수능영역수,rawd.국어반영 as 최저수능국어반영,
	rawd.국어선택 as 최저수능국어선택,rawd.수학반영 as 최저수능수학반영,
	rawd.수학선택 as 최저수능수학선택,rawd.영어 as 최저수능영어,
	rawd.탐구반영 as 최저수능탐구반영, rawd.탐구선택 as 최저수능탐구선택,
	rawd."제2외국어/한문" as 최저수능외국어, rawd.한국사 as 최저수능한국사,
	rawd.세부내용 as 최저세부내용
    from	반영 as e
	inner join "convertUniName" cun on
	cun."변환" = $2
	inner join admission a on
	a."minortype" = $4
	left join raw on
	e."정/수시" = raw."정/수시"
	and e."대학명" = raw."대학명"
	and e."학과" = raw."학과"
	and e."전형" = raw."전형"
	left join rawd on
	raw."정/수시" = rawd."정/수시"
	and raw."대학명" = rawd."대학명"
	and raw."학과" = rawd."학과"
	and raw."전형" = rawd."전형"
    where	a."majortype" like concat('%',$1::varchar,'%')
	and		cun."대교협" = e."대학명"
	and		e."학과" = $3
	and		e."전형" = $4
            `,
        [type, universityName, departmentName, admissionName],
      );
      success = true;
      let rr = [];
      rows.map(r => {
        const ans = {};
        if (
          r['1단계학생부'] ||
          r['1단계면접'] ||
          r['1단계실기'] ||
          r['1단계서류'] ||
          r['1단계수능'] ||
          r['1단계기타'] ||
          r['논술반영'] ||
          r['논술학생부반영']
        ) {
          ans['1단계'] = {
            h: r['1단계학생부'] || r['논술학생부반영'],
            m: r['1단계면접'],
            s: r['1단계실기'],
            p: r['1단계서류'],
            c: r['1단계수능'],
            o: r['1단계기타'],
            n: r['논술반영'],
          };
          if (r['1단계배수']) {
            ans['1단계'].b = r['1단계배수'];
            if (
              r['2단계학생부'] ||
              r['2단계면접'] ||
              r['2단계실기'] ||
              r['2단계서류'] ||
              r['2단계수능'] ||
              r['2단계기타']
            ) {
              ans['2단계'] = {
                h: r['2단계학생부'],
                m: r['2단계면접'],
                s: r['2단계실기'],
                p: r['2단계서류'],
                c: r['2단계수능'],
                o: r['2단계기타'],
                b: r['2단계배수'],
              };
              if (r['2단계배수'] > 100) {
                ans['3단계'] = {
                  h: r['3단계학생부'],
                  m: r['3단계면접'],
                  s: r['3단계실기'],
                };
              }
            }
          }
        }
        if (r['전교과'] != null) {
          ans['교과반영'] = {};
          if (r['전교과']) {
            ans['교과반영'] = {전교과: true};
          } else {
            [
              '국어',
              '수학',
              '영어',
              '사회',
              '과학',
              '통합사회',
              '통합과학',
              '한국사',
              '제2외국어',
              '한문',
            ].map(w => {
              if (r[w] != '  ') {
                const kk = Math.floor(parseInt(r[w]) / 10 - 1);
                if (!ans['교과반영'][kk]) {
                  ans['교과반영'][kk] = [];
                  ans['교과반영'][kk][parseInt(r[w]) % 10] = [w];
                } else {
                  if (!ans['교과반영'][kk][parseInt(r[w]) % 10])
                    ans['교과반영'][kk][parseInt(r[w]) % 10] = [w];
                  else {
                    ans['교과반영'][kk][parseInt(r[w]) % 10].push(w);
                  }
                }
              }
            });
          }
        }
        if (r['공통학년'] || r['1학년'] || r['2학년'] || r['2+3학년']) {
          ans['학년반영'] = [r['공통학년'], r['1학년'], r['2학년'], r['2+3학년']];
        }
        if (r['수능영역수'] && r['수능영역수'] != '') {
          ans['수능반영'] = [
            r['활용지표'],
            r['수능영역수'],
            r['수능국어반영'],
            r['수능국어선택'],
            r['수능수학반영'],
            r['수능수학선택'],
            r['수능영어'],
            r['수능탐구반영'],
            r['수능탐구선택'],
            r['수능탐구반영수'],
            r['수능탐구지정과목'],
            r['수능외국어'],
            r['수능한국사'],
          ];
        }
        if (r['면접기준']) {
          ans['면접'] = [r['면접기준'], r['면접방법']];
        }
        if (r['논술유형']) {
          ans['논술'] = [r['논술유형'], r['출제방식']];
        }
        if (r['최저수능영역수']) {
          ans['수능최저'] = [
            r['최저수능영역수'],
            r['최저수능국어반영'],
            r['최저수능국어선택'],
            r['최저수능수학반영'],
            r['최저수능수학선택'],
            r['최저수능영어'],
            r['최저수능탐구반영'],
            r['최저수능탐구선택'],
            r['최저수능외국어'],
            r['최저수능한국사'],
            r['최저세부내용'],
          ];
        }
        rr.push(ans);
      });
      data = rr;
      break;
  }

  if (success) {
    statusCode = 200;
    msg = 'success';
  }

  res.json({success: success, msg: msg, data: data});
  res.statusCode = statusCode;
  res.end();
};
