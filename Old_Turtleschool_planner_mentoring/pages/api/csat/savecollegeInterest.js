
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title:관심대학 설정
    - params:
*/
export default async (req, res) => {

  let { rows } = await pool.query(`select * from members where account = $1`, [req.headers.auth])

  if (rows.length < 1) {
      res.status(406).json({success: false, msg: 'No authorization', data: null});
      res.end();
      return;
  }


      let success = false;
      let msg = 'fail';
      let statusCode = 500;
      let data = [];

  if (req.method == 'POST') {

    for (var i=0; i<req.body.data.length; i++){//한번에 입력

        await pool.query(`
                  insert into csatinteruniv
                  (accountid , universityid, department, major, year, useyn )
                  select cast($1 as varchar), cast($2 as varchar), cast($3 as varchar), cast($4 as varchar), cast($5 as varchar), 'Y'
                  where not exists (select * from csatinteruniv c
                  				  where c.accountid = cast($1 as varchar)
                  				  and c.universityid = cast($2 as varchar)
                  				  and c.department = cast($3 as varchar)
                  				  and c."year" = cast($5 as varchar)
                  				  and c.useyn = 'Y')
                          `
              ,[req.headers.auth, req.body.data[i].universityid, req.body.data[i].department, req.body.data[i].major,
                req.body.data[i].year])
      }


      		res.status(200).json({success: true, msg: 'success'});
      		res.end();
  }
}
