import pool from '../../../lib/pool';

export default async (req, res) => {
  const {keyword} = req.query;
  const {rows} = await pool.query(
    "select id, title, page  from books where title like '%" + keyword + "%'",
  );

  res.json({success: true, msg: 'success', data: rows});
  res.statusCode = 200;
  res.end();
};
