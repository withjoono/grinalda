import Form from '../../comp/desktopform'
import pool from '../../lib/pool'
import {useState, useEffect} from 'react'
import axios from 'axios'

const examinput = ({subjectcode}) => {
	
	const [info, setInfo] = useState([])
	const [a, setA] = useState(false)
	const [count_blyat, setCount_Blyat] = useState(0);
	
	const btn = {
		width:'180px',
		height:'40px',
		display:'flex',
		border:'2px solid #fede01',
		marginBottom:'-2px',
		alignItems:'center',
		justifyContent:'center',
		marginRight:'5px',
		cursor:'pointer',
	}
	
	const bttn = {
		width: '300px',
		height:'40px',
		display:'flex',
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:'#fede01',
		color:'white',
		margin: '36px auto 0',
		borderRadius:'20px',
		cursor:'pointer',
	}
	
	const getData = (api_url, setData) => {
		const get_ = async () => {
			const response = await axios.get(api_url, {
				headers: {
					'Content-Type': 'application/json',
					'auth': `${localStorage.getItem('uid')}`
				}
			});
	
			return response.data.data
		};

		const set_ = async () => {
			const result = await get_();
			setData(result)
		}

		return set_()
	}
	
	useEffect(() => {
		getData('/api/exams',setInfo);
		console.log(subjectcode);
	},[]);
	
	useEffect(() => {
		if (count_blyat > 1) {
			console.log(info);
			axios.post('/api/exams', {exams: info, type: 0}, {headers: {auth: localStorage.getItem('uid')}});
		}
		setCount_Blyat(count_blyat+1);
	},[info]);
	
	return (
		<div className="page">
			<div style={{width:'1280px', margin: '0 auto'}}>
				<div style={{fontSize:'30px',marginTop:'42px'}}>
					성적 입력
				</div>
				<div style={{margin:'14px 0 34px'}}>
					{localStorage.getItem('name')}님의 수능 성적을 입력해 주세요
				</div>
				<Form disabled={false} subjectcode={subjectcode} information={info} setInformation={setInfo} submitted={a} type={0} grade={3}/>
				<div style={bttn} onClick={()=>{setA(true)}}>완료하기</div>
			</div>
		</div>
	);
}

export default examinput;

export async function getStaticProps() {
		let dat = await pool.query(`
    select	a."code" as "subjectArea"
        ,	a."name" as "areaName"
        ,	array_to_json(array(
                select	row_to_json(tmp)
                from	( 
                            select	sa."code" as "subjectCode"
                                ,	sc."name" as "codeName"
                            from	"codeMaps" sa
                                    inner join "codes" sc
                                    on sa."code" = sc."code" and sa."groupId" = sc."groupId"
                            where	sa."relationId" = 1
                            and		sa."parentGroupId" = b."groupId" 
                            and		sa."parentCode" = b.code 
                            order by sa."sort" asc
                        ) tmp
            )) as child
    from	"codes" a
            inner join (
                select	"parentCode" as "code"
                    ,	"parentGroupId" as "groupId" 
                    ,	max("sort") as "sort"
                from	"codeMaps"
                where	"relationId" = 1
                and		"parentGroupId" = 6
                group by "parentCode", "parentGroupId"
            ) b
            on a."groupId" = b."groupId" and a."code" = b."code"
    order by b."sort" asc
            `)
	const subjectcode = dat.rows.reduce((obj, entry) => {obj[entry.areaName] = entry.subjectArea; entry.child.map(v => {obj[v.codeName] = v.subjectCode}); return obj},{});
	return {props: {subjectcode:subjectcode}}
}