import pool from '../../../lib/pool';

/*
    - title: 플래너에 학생등록
    - params:
*/
export default async (req, res) => {
  let {rows} = await pool.query(
    `select m.id ,
                                        case when m."gradeCode" = 'H1' then '1' when m."gradeCode" = 'H2' then '2' else '3' end as grade,
                                        case when ( select count(*) from payments p
                                        where accountid = m.id
                                        and to_char(current_date, 'yyyy-MM-dd') between to_char(time, 'yyyy-MM-dd') and to_char(time + '1 month', 'yyyy-MM-dd')
                                        and typesid = '2' limit 1
                                        ) > 0 then 'Y' else 'N' end payyn
                                     from members m
                                     where m.account = $1`,
    [req.headers.auth],
  );
  if (rows.length < 1) {
    res.json({success: false, msg: 'No authorization', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  if (false && rows[0].payyn != 'Y') {
    res.json({success: false, msg: 'No Account', data: null});
    res.statusCode = 406;
    res.end();
    return;
  }

  let success = false;
  let msg = 'fail';
  let statusCode = 500;
  let data = [];

  const str_cls = req.body.cls;
  const str_plnrid = req.body.plnrid;

  switch (req.method) {
    case 'POST':
      const {id, cls, gradecd, plnrid} = {
        id: rows[0].id,
        cls: str_cls,
        gradecd: rows[0].grade,
        plnrid: str_plnrid,
      };
      //기존플랜너정보 사용중지
      await pool.query(
        `
                    update plannermanagement
                    set enddt = to_char(current_date - 1, 'yyyyMMdd'),
                        useyn = 'N',
                        lshdtm = current_date
                    where id = $1
                    --and plnrid = $2
                    and useyn = 'Y'
                    and to_char(current_date, 'yyyyMMdd') between strdt and coalesce(enddt, '99991231')
                `,
        [id /*plnrid*/],
      );
      success = true;

      //신규플래너정보 사용시작
      await pool.query(
        `insert into plannermanagement
            (id, strdt, enddt, plnrid, "gradeCode", cls, useyn, fsrdtm, lshdtm)
                                values ($1, to_char(current_date, 'yyyyMMdd'), null, $2, $3, $4, 'Y', current_date, current_date) on conflict on constraint plannermanagement_pk
            do update
                set (enddt, plnrid, "gradeCode", cls, useyn, lshdtm) = (null, $2, $3, $4, 'Y', current_date)
            `,
        [id, plnrid, gradecd, cls],
      );

      success = true;
      break;
    default:
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
