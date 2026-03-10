
import pool from '../../../lib/pool'
import axios from 'axios'

/*
    - title: 플래너정보
    - params:
*/
export default async (req, res) => {
	let { rows } = await pool.query(`select m.id, m.user_name, p.cls, p.plnrid,
										case when ( select count(*) from payments p
										where accountid = m.id
										and to_char(current_date, 'yyyy-MM-dd') between to_char(time, 'yyyy-MM-dd') and to_char(time + '1 month', 'yyyy-MM-dd')
										and typesid = '2' limit 1
										) > 0 then 'Y' else 'N' end payyn
									from members m 
										left outer join plannermanagement p on m.id = p.id and p.useyn = 'Y' and to_char(current_date, 'yyyyMMdd') between p.strdt and coalesce(p.enddt, '99991231')
									where m.account = $1`,[req.headers.auth])

	if (rows.length < 1) {
		res.json({success: false, msg: 'not authorized', data: []});
		res.statusCode = 200;
		res.end();
		return;
	} 

	let success = false;
	let msg = 'fail'
	let statusCode = 500;
	let data = [];

    const str_dvsn = req.query.dvsn;
	const str_id = rows[0].id;
	let str_cls = rows[0].cls;
	let str_plnrid = rows[0].plnrid;

	if(str_dvsn == "A" && str_dvsn != null) //전체조회
	{
		str_cls = null;
		str_plnrid = null;
	}
	
    switch (req.method) {
        case 'GET':
            const { cls, plnrid, id, dvsn} = { cls: str_cls, plnrid: str_plnrid, id: str_id, dvsn: str_dvsn}
			let { rows } = await pool.query(`
						select 
							m.id, m.highschool , m.univ , m.department 
							, m.account
							--, case when $3 = m.id then m.user_name else substring(m.user_name, 1, 1) || '**' end as user_name
							, m.user_name
							, extract(YEAR FROM age(substring(birthday, 1, 6)::date)) as aage
							, m.cellphone
							, m.email
							, m.region
							, m.imgpath
							, p.cls
							, c.comn_nm as clsnm
							, m.school
							, (select count(*) from plannerclass p1 where p1.plnrid = p.plnrid and p1.useyn = 'Y' and to_char(current_date, 'yyyyMMdd') between p1.strdt and coalesce(p1.enddt, '99991231')) as clscout
							, (select count(*) from plannermanagement p2 where p2.plnrid = p.plnrid  and p2.useyn = 'Y' and p2.cls = p.cls and to_char(current_date, 'yyyyMMdd') between p2.strdt and coalesce(p2.enddt, '99991231')) as memcout
						from plannerclass p 
							,members m 
							,commoncode c 
						where p.useyn = 'Y'
						and to_char(current_date, 'yyyyMMdd') between p.strdt and coalesce(p.enddt, '99991231')
						and ((coalesce($2, '1') = '1' and 1=1) or (coalesce($2, '1') != '1' and p.plnrid = $2::numeric))
						and ((coalesce($1, '1') = '1' and 1=1) or (coalesce($1, '1') != '1' and p.cls = $1))
						--and m."relationCode" = '70'
						and p.plnrid = m.id 
						and p.cls = c.comn_cd 
						and c.comn_grp_cd = 'P00004'
						and c.useyn = 'Y'
						and m.imgpath is not null;
						;
				`, [cls, plnrid /*,id*/]
			)
			
            success = true;
            data = rows;
			
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

}
