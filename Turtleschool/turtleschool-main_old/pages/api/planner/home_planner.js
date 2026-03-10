import pool from '../../../lib/pool';

export default async (req, res) => {
  let {rows} = await pool.query(`select
        m.imgpath      as img     --플래너이미지
        ,m.user_name   as name    --플래너이름
        ,m.univ        as univ    --플래너 대학
        ,m.department  as dep     --플래너 전공 
        from members m               
        where m."relationCode" = '70'
        and imgpath is not null
        and imgpath != ''
        order by random() limit 8`);
  res.json({success: true, msg: 'success', data: rows});
  res.statusCode = 200;
  res.end();
};
