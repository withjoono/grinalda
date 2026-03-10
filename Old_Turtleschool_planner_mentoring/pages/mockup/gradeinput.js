import Form from '../../comp/form'
import pool from '../../lib/pool'
import {useState, useEffect} from 'react'
import axios from 'axios'

const infoform = ({subjectcode}) => {
	const [info,setInfo] = useState([])
	const [disabled, setDisabled] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const [count_blyat, setCount_Blyat] = useState(0);
	const [conv,setConv] = useState({})
	const type = sessionStorage.getItem('type');
	const grade = sessionStorage.getItem('grade');
	
	const getData = (api_url, setData, params) => {
		const get_ = async () => {
			const response = await axios.get(api_url, {
				headers: {
					'Content-Type': 'application/json',
					'auth': `${localStorage.getItem('uid')}`
				},
				params: params
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
		getData('/api/exams',setInfo, {type:type});
		axios.get('/api/convertscore',
				{
					params:{typeId:type}
				}).then(res =>
				{
					setConv(
						res.data.data.reduce((acc, obj) => {
								if (!acc[obj['subjectCode']]) acc[obj['subjectCode']] = {};
								acc[obj['subjectCode']][obj['originScore']] = [obj['standardScore'],obj['percentScore'],obj['grade']]
								return acc;
							},{})
					)
				})
	},[]);
	
	useEffect(() => {
		console.log(info, type);
		if (count_blyat > 1) {
			console.log('suka')
			axios.post('/api/exams', {exams: info, type: type}, {headers: {auth: localStorage.getItem('uid')}});
			setDisabled(true);
			setSubmitted(false);
		}
		setCount_Blyat(count_blyat+1);
	},[info]);
	return (
	<div className="page">
		<div className="container" style={{marginTop:'1.2em'}}>
			<Form disabled={disabled} subjectcode={subjectcode} information={info} setInformation={setInfo} submitted={submitted} type={type} grade={grade} conv={conv}/>
			<button className="orangebigbtn" style={{margin:'20px 20px',width:'calc(100% - 40px)'}} onClick={disabled ? ()=>{setDisabled(false)} : ()=>{setSubmitted(true)}}>{disabled ? '수정하기' : '완료하기'}</button>
		</div>
		</div>
	);
}

export default infoform;

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