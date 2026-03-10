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
  let s_recruitment = req.body.data.recruitment;

  if (req.method == 'POST') {
    //1.저장전에 삭제
    await pool.query(
      `delete from csatsvexinfrm
                      where accountid = $1 and year = $2
                      and useyn = 'Y' and recruitment = $3`,
      [req.headers.auth, s_year, s_recruitment],
    );

    //2.삭제후 저장
    //for (var i = 0; i < req.body.data.length; i++)
    //{
    await pool.query(
      `
          insert into csatsvexinfrm
          (recruitment , universityid , department , aplctdate , totalaplcn , totalrank ,
	         imgpath , imgfilenm , accountid , "year" , useyn )
          values
          ($1 , $2 , $3 , $4 , $5 , $6 ,
           $7 , $8 , $9 , $10 , 'Y' )
        ;
				`,
      [
        req.body.data.recruitment,
        req.body.data.universityid,
        req.body.data.department,
        req.body.data.aplctdate,
        req.body.data.totalaplcn,
        req.body.data.totalrank,
        req.body.data.imgpath,
        req.body.data.imgfilenm,
        req.headers.auth,
        req.body.data.year,
      ],
    );
    //}

    res.status(200).json({success: true, msg: 'success'});
    res.end();
  }
};
