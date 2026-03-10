import OMR from '../../comp/omr'
import s from './omrinput.module.css'
import {useState, useContext, useEffect} from 'react'
import pool from '../../lib/pool'
import loginContext from '../../contexts/login'
import axios from 'axios'

const omrInput = ({subjectcode}) => {
	const lengths= {
		60:45,
		70:30,
		80:45,
		50:20,
		10:20,
		20:20
	}
	const [area, setArea] = useState(0)
	const [code, setCode] = useState(0)
	const [d, setD] = useState([])
	const type = sessionStorage.getItem('type')
	const grade = sessionStorage.getItem('grade')
	const ctx = useContext(loginContext);
	const [answers, setAnswers] = useState([])
	
	useEffect(() => {
		axios.get('/api/exams',
			{
				headers: {
				'Content-Type': 'application/json',
				'auth': `${localStorage.getItem('uid')}`
				},
				params:{type:type}
			}).then(res =>
			{
				ctx.exams[1](res.data.data);
				ctx.type[1](type);
			})
	},[])
	
	const sorty = (l) => {
		const cc = {
			60: 0,
			70: 1,
			80: 2,
			10: 3,
			20: 4,
			50: 5
		}
		return l.filter(e => e != undefined).sort((a,b) => {return cc[Math.floor(parseInt(a[1])/10)*10] - cc[Math.floor(parseInt(b[1])/10)*10]})
	}
	
	const get = () => {
		let obj = {0:[],10:[[],[],[]],20:[[],[],[]],50:[[],[],[]],60:[[],[],[]],70:[[],[],[]],80:[[],[],[]]};
		Object.keys(subjectcode).map(e => {
			let cod = parseInt(subjectcode[e])
			if (cod%10 == 0 && cod< 90 && e != '고1국어' && e != '고1수학' && e !='통합과학' && e != '통합사회') obj[0].push([e,subjectcode[e]])
			if (cod == 60 && e !='국어') obj[60][0].push([e,subjectcode[e]])
			if (cod == 61) obj[60][1].push([e,subjectcode[e]])
			if (cod > 61 && cod < 70) obj[60][2].push([e,subjectcode[e]])
			if (cod == 70 && e !='수학') obj[70][0].push([e,subjectcode[e]])
			if (cod == 71) obj[70][1].push([e,subjectcode[e]])
			if (cod > 72 && cod < 80) obj[70][2].push([e,subjectcode[e]])
			if (cod == 80 || cod == 50) {obj[cod][0].push([e,subjectcode[e]]);obj[cod][1].push([e,subjectcode[e]]);obj[cod][2].push([e,subjectcode[e]]);}
			if (cod >= 10 && cod < 20) {if (cod==10 && e != '통합사회') obj[10][0].push([e,subjectcode[e]]); if (cod>10) {obj[10][1].push([e,subjectcode[e]]); obj[10][2].push([e,subjectcode[e]])}}
			if (cod >= 20 && cod < 30) {if (cod==20 && e != '통합과학') obj[20][0].push([e,subjectcode[e]]); if (cod>20) {if (cod < 25) {obj[20][1].push([e,subjectcode[e]])} obj[20][2].push([e,subjectcode[e]])}}
		})
		Object.keys(obj).map(e => {
			if (e==0) obj[0] = sorty(obj[0]);
		})
		return obj;
	}
	const cc = get()
	
	const handleCode = (e) => {
		setCode(e);
		ctx.exams[0].map(f => {
			if (f.subjectArea == area && f.subjectCode == e && Array.isArray(f.answers)) setD(f.answers);
		})
	}
	useEffect(() => {
		if (answers.length > 0) setAnswers([])
	},[code])
	
	const handleSubmit = async () => {
			await axios.post('/api/exams', {answers: d, type: type, area: area, code: code}, {headers: {auth: localStorage.getItem('uid')}});
			axios.get('/api/exams',
					{
						headers: {
						'Content-Type': 'application/json',
						'auth': `${localStorage.getItem('uid')}`
						},
						params:{type:type}
					}).then(res =>
					{
						ctx.exams[1](res.data.data);
						ctx.type[1](type);
					})
			axios.get('/api/omr').then(res =>
			{
				try{
					setAnswers(res.data.data[area][code][type].map(e=>e[0]));
				} catch {
					console.log('problem with omr data')
				}
			})
	}
	
	return (
		<div className="page">
			<div style={{width:'90%', margin:'0 auto', color:'#2d2d2d'}}>
				<div className={s.buttons}>
					{
						cc[0].map((e)=>{return <div className={area == e[1] ? s.active : null} onClick={()=>{setArea(e[1]); setD(Array(lengths[e[1]]).fill());}}>{e[0]}</div>})
					}
				</div>
				<div className={s.buttons}>
					{
						area ? cc[area][grade-1].map((e)=>{return <div className={code == e[1] ? s.active : null} onClick={() => {handleCode(e[1])}}>{e[0]}</div>}) : null
					}
				</div>
				{
					area && code != 0 ?
					<OMR input={[d, setD]} answers={answers} multi={area == 70 ? [22,23,24,25,26,27,28,29,30] : []}/> : null
				}
					<div className={s.submit} onClick={handleSubmit}>완료하기</div>
			</div>
		</div>
	);
}

export default omrInput;

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
	
	return {props: {subjectcode: subjectcode}}
}