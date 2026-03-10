import pool from '../../../lib/pool';

export default async (req, res) => {
  if (req.method == 'GET') {
    const {query} = req.query;
    const q = query;
    const result = await pool.query(
      `
	  	select id as id, title as title, teacher as person
	  	from lectures where teacher 
		  like concat('%',$1::text,'%') 
			or title 
			like concat('%',$1::text,'%')`,
      [q],
    );

    res.json({success: true, msg: 'success', data: result.rows});
    res.statusCode = 200;
    res.end();
  }
};
