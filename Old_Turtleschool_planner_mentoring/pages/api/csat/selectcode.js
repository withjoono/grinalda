import pool from '../../../lib/pool';
import axios from 'axios';

/*
    - title: 공통코드조회
    - params:
*/
export default async (req, res) => {

  let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])
/*
  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }
  */
        let success = false;
        let msg = 'fail';
        let statusCode = 500;
        let data = [];
        let s_comn_grp_cd = 'C00011';

    switch (req.method) {
        case 'GET':
            rows  = await pool.query(`

                 select substring(comn_cd, 1, 1) || '0' as area, comn_cd, comn_nm
                 from commoncode c
                 where comn_grp_cd = $1
                 and useyn = 'Y'
                 order by substring(comn_cd, 1, 1)
                 ;
                `,
                    [s_comn_grp_cd]
                );

                if (rows.rows == undefined || rows.rows.length < 1)
                {
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
        console.log("202");
    }

        res.status(statusCode).json({ success: success, msg: msg, data: data });
        res.end();
};
