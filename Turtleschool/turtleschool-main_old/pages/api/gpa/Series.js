import pool from '../../../lib/pool';

export default async (req, res) => {
  const {large_cd, middle_cd, small_cd} = req.query;

  let {rows} = await pool.query(
    `
    select 
    m.id,
    m.user_name,    --전공쌤
    m.univ          --대학
    ,m.department   --과
    ,m.imgpath      --이미지
    from members m 
    join teachers t on m.id=t.id
    where t.large_cd =$1
    and m.imgpath is not null
    and m.imgpath != ''
    and t.use_yn ='Y'
    and ((concat($2::text, '1')='1' and 1=1) or (concat($2::text, '1')!='1' and  t.middle_cd = $2))
    and ((concat($3::text, '1')='1' and 1=1) or (concat($3::text, '1')!='1' and  t.small_cd = $3))
	group by m.id,m.user_name,m.univ,m.department,m.imgpath
    order by random();`,
    [large_cd, middle_cd, small_cd],
  );

  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }
  res.json({success: true, msg: 'success', data: rows});
  res.statusCode = 200;
  res.end();
};
