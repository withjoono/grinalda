import loginContext from '../../contexts/login'
import pool from '../../lib/pool'
import withDesktop from '../../comp/withdesktop'
import desktop from '../desktop/examanalysis'
import React, { useState, useEffect, useContext } from "react";
import styles from "./MyGrade.module.css";
import s from './inputchoice.module.css'
import Link from 'next/link'
import Display from '../../comp/formdisplay'

const MyGrade = ({ personalcode, subjectcode, area, line, recruit_group,examcode}) => {
	const axios = require('axios');
	const ctx = useContext(loginContext);
	const {exams, type} = ctx;
	const [gData, setGData] = useState([])
	const [combine, setCombine] = useState('10')
	const [combineResult, setCombineResult] = useState()
	const [scoreKind, setScoreKind] = useState([])
	const [index, setIndex] = useState(0);
	const [j, setJ] = useState(0);
	const [dat, setDat] = useState({})
	const [info, setInfo] = useState({})
	const [subject,setSubject] = useState({})
	const [grade, setGrade] = useState(1);
	const [year, setYear] = useState(0);
	const [examtype, setExamType] = useState()
	const [name, setName] = useState('')
	const getExams = () => {
		let l =null;
		if (grade == 1) {
			l = examcode.filter(e=>{return e.grade != 3 && e.year==year}).sort((a,b)=>a.id-b.id);
		} else {
			l = examcode.filter(e=>{return e.id != 0 && e.grade == 3 && e.year==year}).sort((a,b)=>a.id-b.id);
		}
		return l;
	}

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

	const postData = (api_url, setData, params) => {
		const get_ = async () => {
			const response = await axios.post(
				api_url,
				params,
				{
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
		postData('/api/sores/combine', setCombineResult, { combine: 10, type: type[0] ? type[0] : 0 })
	}, [combine])
	
	const handleWow = (e) => {
		let byScores = {}
		let byKind = {}
		console.log(dat);
		try {
			dat[e.subjectArea][e.subjectCode][type[0]].map((f,i) => {
				if (!e.answers[i]) e.answers[i] = 0;
				if (!byScores[f[1]]) byScores[f[1]] = {wrong: 0, right: 0}
				if (e.answers[i] == f[0]) byScores[f[1]].right += 1;
				else byScores[f[1]].wrong += 1;
				if (!byKind[f[4]]) byKind[f[4]] = {}
				if (!byKind[f[4]][f[5]]) byKind[f[4]][f[5]] = {wrong: 0, wrongweighted:0, total:0}
				if (e.answers[i] != f[0]) {byKind[f[4]][f[5]].wrong += 1; byKind[f[4]][f[5]].wrongweighted += f[1]}
				byKind[f[4]][f[5]].total += f[1];
			})
		} catch {
			console.log('problem with api omr')
		}
		setInfo({scores: byScores, kinds: byKind})
	}

	useEffect(() => {
		if (!exams[0] || exams[0].length == 0) return;
		console.log(exams[0]);
		let g = exams[0].slice();
		const cmp = {
			'60': 8,
			'70': 7,
			'80': 6,
			'20': 5,
			'10': 5,
			'50': 4,
			'90': 3
		}
		if (g && g[0].typeId > 0 && g[0].typeId < 4) {
			subjectcode[70] = '수학';
			subjectcode[10] = '통합사회';
			subjectcode[20] = '통합과학';
		}
		g.sort((a, b) => {
			return cmp[b.subjectArea] - cmp[a.subjectArea];
		});
		g.map((el, i) => {
			el.subjectName = subjectcode[el.subjectCode]
		})
		console.log('a');
		setGData(g)
	}, [exams[0]])

	const getStuff = () => {
		type[1](examtype)
		if (!exams[0]) getData('/api/exams', exams[1], {type: examtype});
		getData('/api/codes/score_kind', setScoreKind);
		axios.get('/api/omr').then(res => setDat(res.data.data)).catch(err => console.log(err)) 
	}

	return (<>
	<div className="page" style={{color:'#2d2d2d'}}>
		<div style={{padding:'20px'}}>
			<div style={{fontSize:'1.2em'}} style={{margin:'1em 0'}} className={s.bold}>
				<span className={s.orange_txt}>{localStorage.getItem('name')}</span>님의<br/>
				모의고사 정보을 선택해 주세요
			</div>
			<div className={s.gradebuttons}>
				<button className={grade == 1 ? s.active : null} onClick={()=>{setGrade(1)}}><p>✍🏻</p>1,2학년</button>
				<button className={grade == 3 ? s.active : null} onClick={()=>{setGrade(3)}}><p>🙏🏻</p>3학년</button>
				<button className={grade == 4 ? s.active : null} onClick={()=>{setGrade(4)}}>N수생</button>
			</div>
			<div className={s.gradebuttons}>
				<button className={year==2019 ? s.active : null} onClick={()=>{setYear(2019)}}>2019년</button>
				<button className={year==2020 ? s.active : null} onClick={()=>{setYear(2020)}}>2020년</button>
				<button className={year==2021 ? s.active : null} onClick={()=>{setYear(2021)}}>2021년</button>
			</div>
			<div className={s.listbuttons}>
				{getExams().map(e => {return <button className={examtype == e.id ? s.active : null} onClick={()=>{setExamType(e.id); setName(e.type)}}>{e.type.slice(-3) == '3학년' ? e.type.slice(0,e.type.length-3) : e.type}</button>})}
			</div>
			<button className='orangebigbtn' onClick={getStuff} >분석하기</button>
		</div>
							<div style={{fontSize:'1.2em',width:'90%',marginBottom:'1em'}}>
								<span style={{fontWeight:'bold',color:'#fede01'}}>{localStorage.getItem('name')}</span>님의
								<span style={{fontWeight:'bold'}}> 수능 성적</span>
							</div>
							<div className={styles.MyGrade_buttons}>
								{
									gData.length > 0 ? <button onClick={()=>{setIndex(-1)}}>전체</button> : null
								}
								{
									gData.map((el,i) => {
										if (i == index) return <button style={{'background-color':'#fede01',color:'white'}}>{el.subjectCode == 10 ? '통합사회' : el.subjectName}</button>
										else return <button onClick={() => {setIndex(i)}}>{el.subjectCode == 10 ? '통합사회' : el.subjectName}</button>
									})
								}
							</div>
								{gData.length > 0 && index >= 0 ? 
								<div className={styles.MyGrade_grade_table}>
								<div>
									
										<div>
											<span>표준점수</span>
											<span>{gData[index].standardScore}</span>	
										</div>
										<div>
											<span>백분위</span>
											<span>{gData[index].percentScore}</span>	
										</div>
										<div>
											<span>등급</span>
											<span>{gData[index].grade}등급</span>	
										</div>
										<div>
											<span>상위누적</span>
											<span>*준비중입니다</span>	
										</div>
										 
								</div></div> : index == -1 ?
									<Display exams={gData} />
									: null
								}
						<div className={styles.MyGrade_section}>
							<div style={{fontSize:'1.2em',fontWeight:'bold',margin:'1em 0'}}>조합별 점수</div>
							
							<div className={styles.MyGrade_buttons}>
								{
									combineResult ?
									combineResult[0].get_combine_scores.map((e, i) => {
										if (i>=5) return;
										return <button onClick={()=>{setJ(i)}} style={j == i ? {backgroundColor:'#fede01',color:'white', width:'50px'} : {width:'50px'}}>{i+1}순위</button>
									}) : null
								}
							</div>
								{/*<div className={styles.MyGrade_sort_tap}>
									<select onChange={e => setCombine(e.target.value)}>
										{
											scoreKind.map((e, i) => {
												return <option key={i} value={e.code}>{e.name}</option>
											})
										}
									</select>
								</div>*/}
							{
								combineResult ?
										<div className={styles.MyGrade_grade_table}><div>
										<div>
											<span>조합명</span>
											<span>{combineResult[0].get_combine_scores[j].name}</span>	
										</div>
										<div>
											<span>내점수</span>
											<span>{combineResult[0].get_combine_scores[j].score}</span>	
										</div>
										<div>
											<span>상위누적</span>
											<span>{combineResult[0].get_combine_scores[j].acc}</span>	
										</div> 
										</div></div>: null
							}
						</div>
						<div className={styles.MyGrade_section}>
						{
							exams[0] ? <>
							<div style={{fontSize:'30px',marginTop:'100px',marginBottom:'60px','-webkit-text-stroke':'1px'}}>
								배점 및 분야 분석
							</div>
							<div style={{display:'flex',borderBottom:'1px solid #fede01',marginBottom:'26px'}} className={styles.MyGrade_buttons}>
								{
									exams[0].map(e => <button className={subject.subjectCode == e.subjectCode ? "active" : undefined} key={e.subjectCode} onClick={()=>{setSubject(e);handleWow(e)}}>{e.subjectCode == '20' && grade == 1 ? '과학탐구' : subjectcode[e.subjectCode]}</button>)
								}
							</div></>
							: null
						}
						{
							info.scores ? <>
							<div className="spacing titles equal">
								<div>문항 종류</div>
								<div>배점</div>
								<div>오답갯수</div>
								<div>정답율</div>
							</div>
							{Object.keys(info.scores).map(e =>
								<div className="spacing outline equal">
									<div>{e}점 문항</div>
									<div>{(info.scores[e].right + info.scores[e].wrong)*e}</div>
									<div>{info.scores[e].wrong}</div>
									<div>{Math.round(info.scores[e].right / (info.scores[e].right + info.scores[e].wrong ) * 100)}%</div>
								</div>
							)}
							</> : null
						}
						{
							info.scores ?
							<table>
							<thead>
								<td>교과</td>
								<td>분야</td>
								<td>배점</td>
								<td>오답</td>
								<td>정답율</td>
							</thead>
							{
								Object.keys(info.kinds).map((e) => {
									const a = Object.keys(info.kinds[e]).sort();
									console.log(a);
									return a.map((f,i) => 
										<tr style={i == a.length - 1 ? {borderBottom:'1px solid #cccccc'} : undefined}>
											{i == 0 ? <td style={{borderBottom:'1px solid #cccccc'}} rowSpan={a.length}>{e}</td> : null}
											<td>{f}</td>
											<td>{info.kinds[e][f].total}</td>
											<td>{info.kinds[e][f].wrong}</td>
											<td>{Math.round((1 - (info.kinds[e][f].wrongweighted / info.kinds[e][f].total))*100)}%</td>
										</tr>
									)
								})
							}
						</table> : null
						}
						</div>
	</div>
	</>
	);
};

export default withDesktop(desktop,MyGrade);

export async function getStaticProps() {


	let { rows } = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     ("groupId" = $1
	or 		"groupId" = $2
	or 		"groupId" = $3)
    order by "sort" asc
            `, [11, 12, 9])
	const personalcode = rows.reduce((obj, entry) => { obj[entry.name] = entry.code; return obj }, {})
	let dat;
	dat = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `, [1]);
	const area = dat.rows;
			dat = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `, [2]);
	const line = dat.rows;
			dat = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `, [3]);
	const recruit_group = dat.rows;
	dat = await pool.query(`
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
	const subjectcode = dat.rows.reduce((obj, entry) => { obj[entry.areaName] = entry.subjectArea; entry.child.map(v => { obj[v.codeName] = v.subjectCode }); return obj }, {});
	const sc = dat.rows.reduce((obj, entry) => { obj[entry.subjectArea] = entry.areaName; entry.child.map(v => { obj[v.subjectCode] = v.codeName }); return obj }, {});
	dat = await pool.query(`
		select * from "codeExams"
		`);
	const examcode = dat.rows;
	return { props: { personalcode: personalcode, subjectcode: subjectcode,sc:sc, area: area, line: line, recruit_group: recruit_group, examcode: examcode} };
}