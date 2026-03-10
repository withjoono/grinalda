import axios from 'axios';
import pool from '../../../lib/pool';

export default async (req, res) => {
  const {school, year, month, index} = req.query;

  if ((req.method = 'GET')) {
    let data = await pool.query(
      `select 시도교육청코드 , 시도교육청명 , 표준학교코드 , 학교명, 영문학교명, 학교종류명, 소재지명, 관할조직명, 설립명,
	도로명우편번호, 도로명주소, 도로명상세주소, 전화번호, 홈페이지주소, 남녀공학구분명, 팩스번호, 고등학교구분명,
	산업체특별학급존재여부, 고등학교일반실업구분명 , 특수목적고등학교계열명 , 입시전후기구분명 , 주야구분명 , 설립일자 , 개교기념일 , 적재일시
   from highschool_csv where "학교명" = $1`,
      [school],
    );
    if (data.rows.length < 1) {
      res.json({success: false, msg: 'Invalid school name', data: null});
      res.statusCode = 406;
      res.end();
      return;
    }
    await axios
      .get('https://open.neis.go.kr/hub/SchoolSchedule', {
        params: {
          KEY: process.env.NEXT_PUBLIC_NEIS_API_KEY,
          Type: 'json',
          pIndex: index ? index : 1,
          pSize: 1000,
          ATPT_OFCDC_SC_CODE: data.rows[0]['시도교육청코드'],
          SD_SCHUL_CODE: data.rows[0]['표준학교코드'],
          AA_YMD: '' + year + month.toString().padStart(2, '0'),
        },
      })
      .then(response => {
        if (response.data['RESULT']) {
          res.json({success: false, msg: response.data['RESULT']['MESSAGE']});
          res.statusCode = 200;
        } else {
          res.json({
            success: true,
            msg: 'success',
            data: response.data.SchoolSchedule,
          });
          res.statusCode = 200;
        }
        res.end();
      })
      .catch(err => {
        res.json({success: false, msg: err});
        res.statusCode = 406;
        res.end();
      });
  } else {
    res.end();
  }
  return;
};
