import React, { useState, useEffect, useContext, useRef } from "react";
import styles from "./infoform.module.css";
import d from './dialog.module.css'
import useLogin from '../../comp/loginwrapper'
import Redirect from '../redirect'
import loginContext from '../../contexts/login'
import { useRouter } from 'next/router'
import axios from 'axios'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import pool from '../../lib/pool'

const Popup = (props) => {
	const {list, grade, open, handleClose} = props;
	let l;
	if (grade == 1){
		l = list.filter(e => (e.id > 0 && e.id < 4))
	} else if (grade == 2) {
		l = list.filter(e => (e.id > 3 && e.id < 7))
	} else {
		l = list.filter(e => (e.id > 7 || e.id == 0))
	}
	console.log(l);
	return (
		<Dialog open={open} onClose={handleClose} fullWidth={true}>
		<div className={d.dialogtitle}>시험 선택</div>
		{
			l.map(e => {
				return <div className={d.dialog} onClick={() => {handleClose(e.id)}}>{e.type}</div>
			})
		}
		</Dialog>
	);
}

function Info ({subjectcode, examcode}) {
	const society = ["생활과 윤리", "윤리와 사상", "한국지리", "세계지리", "동아시아사", "세계사", "정치와 법", "경제", "사회·문화"]
	const science = ["물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ", "생명과학Ⅱ", "지구과학Ⅱ"]
	const language = ["한문Ⅰ","독일어Ⅰ","프랑스어Ⅰ","스페인어Ⅰ","아랍어Ⅰ","일본어Ⅰ","중국어Ⅰ","러시아어Ⅰ","베트남어Ⅰ"]
	const career = ["농업이해", "농업기초기술", "공업일반", "기초제도", "상업경제", "회계원리", "해양의이해", "수산·해운산업기초", "인간발달생활", "서비스산업의이해"]
	const [subject, checkSubject] = useState()
	const ctx = useContext(loginContext)
	const [ready2, setReady2] = useState(false);
	const [grade, setGrade] = useState(1);
	const [open, setOpen] = useState(false);
	const [type, setType] = useState(null);
	const krpercent = useRef();
	const krgrade = useRef();
	const mapercent = useRef();
	const magrade = useRef();
	const repercent = useRef();
	const regrade = useRef();
	const repercent2 = useRef();
	const regrade2 = useRef();
	
	const [exams, setExams] = useState([]);
	const [subjectList, setSubjectList] = useState([]);
	const [study, setStudy] = useState({subjectArea: subjectcode['사회탐구']});
	
	const router = useRouter();
	
	const studyHandler = (e,f) => {
		let n = e.target.name;
		let v = e.target.value;
		if (!f) f = subject;
		setStudy(prev => {
			let p = Object.assign({},prev);
			p['subjectArea'] = f === 'society' ? subjectcode['사회탐구'] : f === 'science' ? subjectcode['과학탐구']: f === 'career' ? subjectcode['직업탐구'] : null;
			if (type > 0 && type < 4) p['subjectCode'] = p['subjectArea']
			p[n] = v;
			return p;
			});
	}
	
	const [study2, setStudy2] = useState({subjectArea: subjectcode['사회탐구']});
	
	const studyHandler2 = (e, f) => {
		let n = e.target.name;
		let v = e.target.value;
		if (!f) f = subject;
		setStudy2(prev => {
			let p = Object.assign({},prev);
			p['subjectArea'] = f === 'society' ? subjectcode['사회탐구'] : f === 'science' ? subjectcode['과학탐구']: f === 'career' ? subjectcode['직업탐구'] : null;
			if (type > 0 && type < 4) p['subjectCode'] = p['subjectArea']
			p[n] = v;
			return p;
			});
	}
	
	const handleDialogClose = (e) => {
		setType(e);
		setOpen(false);
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setExams(prev => { let p = prev.filter((a) => {return a.subjectCode != ""})
			if (Object.keys(study).length == 5 || Object.keys(study).length == 6) p.push(study);
			if (Object.keys(study2).length == 5 || Object.keys(study2).length == 6) p.push(study2);
			setReady2(true);
			return p;
		});
		sessionStorage.clear();
	}
	
	useEffect( () => {
		if (ready2) {
			const exam = axios.post('/api/exams', {exams: exams, type: type}, {headers: {auth: localStorage.getItem('uid')}});
			Promise.all([exam]).then(() => {
				ctx.type = type
				router.push('/mockup/mygrade')
			}).catch(err => console.log(err));
		}
	}, [ready2]);
	
	const subjectChangeHandler = (e, subjectarea) => {
		subjectarea = subjectcode[subjectarea];
		let n = e.target.name;
		let v = e.target.value;
		adder(n,v,subjectarea);
	}
	
	const adder = (n, v, subjectarea) => {
		setExams(prevState => {
			let tempState = prevState.slice(); 
			let t = false;
			tempState.map(obj => {
			if (obj.subjectArea == subjectarea) {
				t = true;
				obj[n] = v;
				}
			});
			if (!t) {
				let a = {subjectArea: subjectarea, subjectCode: subjectarea};
				a[n] = v;
				tempState.push(a);
			}
			return tempState;
		});
		console.log(exams);
	}
	const [gradeData, setGradeData] = useState([])

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

	const findExamsIndex = (num) => {
		return exams[exams.findIndex(e => e.subjectArea === num)]
	}
	
	const handleConvert = async (percent, grade, subjectCode, score, qual) => {
		if (type == 0 || type > 6 || !score) return;
		if (type > 3 && qual) {
			if (qual == 1) subjectCode = study.subjectCode;
			else subjectCode = study2.subjectCode;
		}
		const res = await axios.get('/api/convertscore',{params: {typeId: type, subjectCode: subjectCode, score: score}});
		const data = res.data;
		if (data.length == 0) return;
		if (!'percentScore' in data[0]) data[0].percentScore = 0;
		percent.current.value = data[0].percentScore
		grade.current.value = data[0].grade
		if (!qual) {
			const a = findExamsIndex(subjectCode)
			a.percentScore = data[0].percentScore;
			a.grade = data[0].grade;
		} else if (qual == 1) {
			study.percentScore = data[0].percentScore;
			study.grade = data[0].grade;
		} else {
			study2.percentScore = data[0].percentScore;
			study2.grade = data[0].grade;
		}
		
	}
	

	console.log(exams)
	console.log(study,'stud')
	return (
	<>
		<form onSubmit={handleSubmit}>
			<div className={styles.InfoForm_page}>
				<div className={styles.InfoForm_content}>
					<div className={styles.InfoForm_detail}>
						
						<div className={styles.InfoForm_grade}>
							<div className={styles.InfoForm_grade_title}>
								수능 성적 입력
							</div>
							
							<div className={styles.InfoForm_grade_subtitle}>
								<span className={styles.InfoForm_subtitle}>*가채점 결과를 입력해주세요.</span>
							</div>
							<div className={styles.InfoForm_contents_radio} >
										<input type="radio" id="1st" name="grade" onClick={() => {setGrade(1)}} required defaultChecked={grade ? grade==1 : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor="1st">1학년</label>
										<input type="radio" id="2nd" name="grade" onClick={() => {setGrade(2)}} defaultChecked={grade ? grade==2 : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor="2nd">2학년</label>
										<input type="radio" id="3rd" name="grade" onClick={() => {setGrade(3)}} defaultChecked={grade ? grade==3 : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor="3rd">3학년</label>
									</div>
							<button className={styles.InfoForm_complete_btn} onClick = {(e) => {e.preventDefault(); setOpen(true)}}>시험 선택</button>
							{ type || type === 0 ? <>
							<div className={styles.InfoForm_table_contents_title}>
								<div className={styles.InfoForm_contents_subject_title}>과목</div>
								<div className={styles.InfoForm_contents_input_title}>표준점수</div>
								<div className={styles.InfoForm_contents_input_title}>백분위</div>
								<div className={styles.InfoForm_contents_input_title}>등급</div>
							</div>
							<div className={styles.InfoForm_grade_table}>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>국어</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} onBlur={(e) => {handleConvert(krpercent,krgrade,'60',e.target.value)}} defaultValue={findExamsIndex('60') ? findExamsIndex('60').standardScore : ''} onChange={(e) => {subjectChangeHandler(e,'국어')}} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100" required/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={krpercent} defaultValue={findExamsIndex('60') ? findExamsIndex('60').percentScore : ''} onChange={(e) => {subjectChangeHandler(e,'국어')}} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100" required />
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={krgrade} defaultValue={findExamsIndex('60') ? findExamsIndex('60').grade : ''} onChange={(e) => {subjectChangeHandler(e,'국어')}} name="grade" placeholder="등급 입력" pattern="[1-9]" required/>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>
										<select defaultValue={""} required className={styles.InfoForm_contents_select} name="subjectCode" onChange={(e) => {subjectChangeHandler(e,'수학')}}>
											<option value="">수학 가/나</option>
											<option value={subjectcode["수학-가"]} selected={findExamsIndex('70') ? findExamsIndex('70').subjectCode === subjectcode["수학-가"]: null}>수학 가</option>
											<option value={subjectcode["수학-나"]} selected={findExamsIndex('70') ? findExamsIndex('70').subjectCode === subjectcode["수학-나"]: null}>수학 나</option>
										</select>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} onBlur={(e) => {handleConvert(mapercent,magrade,'70',e.target.value)}} defaultValue={findExamsIndex('70') ? findExamsIndex('70').standardScore : ''} onChange={(e) => {subjectChangeHandler(e,'수학')}} name="standardScore" placeholder="표준점수 입력"  pattern="\d{1,2,3}|100" required/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={mapercent} defaultValue={findExamsIndex('70') ? findExamsIndex('70').percentScore : ''} onChange={(e) => {subjectChangeHandler(e,'수학')}} name="percentScore" placeholder="백분위 입력"  pattern="\d{1,2}|100" required/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={magrade} defaultValue={findExamsIndex('70') ? findExamsIndex('70').grade : ''} onChange={(e) => {subjectChangeHandler(e,'수학')}} name="grade" placeholder="등급 입력" pattern="[1-9]" required/>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>영어</div>
										{/*<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('80') ? findExamsIndex('80').standardScore : ''} onChange={(e) => {subjectChangeHandler(e,'영어')}} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100" required/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('80') ? findExamsIndex('80').percentScore : ''} onChange={(e) => {subjectChangeHandler(e,'영어')}} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100" required/>
</div>*/}
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('80') ? findExamsIndex('80').grade : ''} onChange={(e) => {subjectChangeHandler(e,'영어')}} name="grade" placeholder="등급 입력" pattern="[1-9]" required/>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>한국사</div>
										{/*<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('50') ? findExamsIndex('50').standardScore : ''} onChange={(e) => {subjectChangeHandler(e,'한국사')}} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100" required/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('50') ? findExamsIndex('50').percentScore : ''} onChange={(e) => {subjectChangeHandler(e,'한국사')}} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100" required/>
										</div>*/}
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('50') ? findExamsIndex('50').grade : ''} onChange={(e) => {subjectChangeHandler(e,'한국사')}} name="grade" placeholder="등급 입력" pattern="[1-9]" required/>
									</div>
								</div>
								{ grade != 1 ?
								<>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_sub_check}>
										<input type="radio" name="subject" value="society" onChange={e => {checkSubject(e.target.value)}} checked={subject === 'society'}/>
										<span>사회탐구</span>
									</div>
									<div className={styles.InfoForm_contents_sub_check}>
										<input type="radio" name="subject" value="science" onChange={e => {checkSubject(e.target.value)}} checked={subject === 'science'}/>
										<span>과학탐구</span>
									</div>
									<div className={styles.InfoForm_contents_sub_check}>
										<input type="radio" name="subject" value="career" onChange={e => checkSubject(e.target.value)} checked={subject === 'career'}/>
										<span>직업탐구</span>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>
										
										<select defaultValue={""} required className={styles.InfoForm_contents_select} name="subjectCode" onChange={studyHandler}>
											<option value="">탐구 1</option>
											{
												subject === 'society' ?
													society.map((e, i) => {
														return (
															<option key={i} value={subjectcode[e]} selected={study ? study.subjectCode === subjectcode[e]: false}>{e}</option>
														)
													}) :
													subject === 'science' ?
														science.map((e, i) => {
															return (
																<option key={i} value={subjectcode[e]} selected={study ? study.subjectCode === subjectcode[e]: false}>{e}</option>
															)
														}) :
													subject === 'career' ?
														career.map((e, i) => {
															return (
																<option key={i} value={subjectcode[e]} selected={study ? study.subjectCode === subjectcode[e]: false}>{e}</option>
															)
														}): null
											}
										</select>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} onBlur={(e) => {handleConvert(repercent,regrade,subject == 'society' ? '10' : '20',e.target.value,1)}} defaultValue={study ? study.standardScore : ''} onChange={studyHandler} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={repercent} defaultValue={study ? study.percentScore : ''} onChange={studyHandler} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={regrade} defaultValue={study ? study.grade : ''} onChange={studyHandler} name="grade" placeholder="등급 입력" pattern="[1-9]"/>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>
										<select defaultValue={""} required className={styles.InfoForm_contents_select} name="subjectCode" onChange={studyHandler2}>
											<option value="">탐구 2</option>
											{
												subject === 'society' ?
													society.map((e, i) => {
														return (
															<option key={i} value={subjectcode[e]} selected={study2 ? study2.subjectCode === subjectcode[e]: false}>{e}</option>
														)
													}) :
													subject === 'science' ?
														science.map((e, i) => {
															return (
																<option key={i} value={subjectcode[e]} selected={study2 ? study2.subjectCode === subjectcode[e]: false}>{e}</option>
															)
														}) :
													subject === 'career' ?
														career.map((e, i) => {
															return (
																<option key={i} value={subjectcode[e]} selected={study2 ? study2.subjectCode === subjectcode[e]: false}>{e}</option>
															)
														}): null
											}
										</select>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} onBlur={(e) => {handleConvert(repercent2,regrade2,subject == 'society' ? '10' : '20',e.target.value,2)}} defaultValue={study2 ? study2.standardScore : ''} onChange={studyHandler2} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={repercent2} defaultValue={study2 ? study2.percentScore : ''} onChange={studyHandler2} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={regrade2} defaultValue={study2 ? study2.grade : ''} onChange={studyHandler2} name="grade" placeholder="등급 입력" pattern="[1-9]" />
									</div>
								</div>
								{ grade != 2 ? <div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>
										<select defaultValue={""} className={styles.InfoForm_contents_select} name="subjectCode" onChange={e=>{subjectChangeHandler(e,'제2외')}}>
											<option value="">제2외국어</option>
											{
												language.map((e, i) => {
													return (<option key={i} value={subjectcode[e]} selected={findExamsIndex('90') ? findExamsIndex('90').subjectCode === subjectcode[e]: ''}>{e}</option>);
												})
											}
										</select>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('90') ? findExamsIndex('90').standardScore : ''} onChange={(e) => {subjectChangeHandler(e,'제2외')}} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('90') ? findExamsIndex('90').percentScore : ''} onChange={(e) => {subjectChangeHandler(e,'제2외')}} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} defaultValue={findExamsIndex('90') ? findExamsIndex('90').grade : ''} onChange={(e) => {subjectChangeHandler(e,'제2외')}} name="grade" placeholder="등급 입력" pattern="[1-9]" />
									</div>
								</div> : null} </> :
								<>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>
										통합사회
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} onBlur={(e) => {handleConvert(repercent,regrade,'10',e.target.value,1)}} defaultValue={findExamsIndex('90') ? findExamsIndex('90').standardScore : ''} onChange={e => studyHandler(e,'society')} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={repercent} defaultValue={findExamsIndex('90') ? findExamsIndex('90').percentScore : ''} onChange={e => studyHandler(e,'society')} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={regrade} defaultValue={findExamsIndex('90') ? findExamsIndex('90').grade : ''} onChange={e => studyHandler(e,'society')} name="grade" placeholder="등급 입력" pattern="[1-9]" />
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_subject}>
										통합과학
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} onBlur={(e) => {handleConvert(repercent2,regrade2,'20',e.target.value,2)}} defaultValue={findExamsIndex('90') ? findExamsIndex('90').standardScore : ''} onChange={e => studyHandler2(e,'science')} name="standardScore" placeholder="표준점수 입력" pattern="\d{1,2,3}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={repercent2} defaultValue={findExamsIndex('90') ? findExamsIndex('90').percentScore : ''} onChange={e => studyHandler2(e,'science')} name="percentScore" placeholder="백분위 입력" pattern="\d{1,2}|100"/>
									</div>
									<div className={styles.InfoForm_contents_input}>
										<input className={styles.InfoForm_grade_input} ref={regrade2} defaultValue={findExamsIndex('90') ? findExamsIndex('90').grade : ''} onChange={e => studyHandler2(e,'science')} name="grade" placeholder="등급 입력" pattern="[1-9]" />
									</div>
								</div> </>
								}
							</div>
							{/* <div className={styles.InfoForm_grade_input_link}>
								<span>내신성적 입력하기</span>
							</div> */}
							</> : null }
							</div>
							{ type || type == 0 ? 
							<div className={styles.InfoForm_btn_tab}>
								<button className={styles.InfoForm_complete_btn}>완료하기</button>
							</div> : null }
					</div>
				</div>
			</div>
		</form>
		<Popup open={open} handleClose={handleDialogClose} list={examcode} grade={grade} />
		</>
	);
};

export default useLogin(Info,Redirect);

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
            `, [11,12,9])
	const personalcode = rows.reduce((obj, entry) => {obj[entry.name] = entry.code; return obj}, {})
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
	const subjectcode = dat.rows.reduce((obj, entry) => {entry.child.map(v => {obj[v.codeName] = v.subjectCode}); return obj},{});
	const subjectarea = dat.rows.reduce((obj, entry) => {obj[entry.areaName] = entry.subjectArea; return obj},{});
	dat = await pool.query(`
	select * from "codeExams"
	`);
	
	const examcode = dat.rows;
  return { props: {subjectarea: subjectarea, subjectcode: subjectcode, examcode: examcode }};
}
