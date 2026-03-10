import styles from './form.module.css'
import {useState, useEffect} from 'react'

const grade = (props) => {
	const {disabled, subjectcode, type, grade, conv} = props;
	const {information, setInformation} = props;
const {submitted} = props;
	const studies = ["생활과 윤리", "윤리와 사상", "한국지리", "세계지리", "동아시아사", "세계사", "정치와 법", "경제", "사회·문화", "물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ", "생명과학Ⅱ", "지구과학Ⅱ"]
	const languages = ["한문Ⅰ","독일어Ⅰ","프랑스어Ⅰ","스페인어Ⅰ","아랍어Ⅰ","일본어Ⅰ","중국어Ⅰ","러시아어Ⅰ","베트남어Ⅰ"]
	const c = {
			[subjectcode['국어']]:'kr',
			[subjectcode['수학-가']]:'ma',
			[subjectcode['영어']]:'en',
			[subjectcode['한국사']]:'hi',
			[subjectcode['제2외']]:'la',
		};
		const defaultinfostate = {
			kr:null,
			ma:null,
			en:{subjectCode:subjectcode['영어']},
			hi:{subjectCode:subjectcode['한국사']},
			r1:null,r2:null,
	la:null}
	const [info, setInfo] = useState(defaultinfostate);
	
	useEffect(() => {
		console.log('information',information);
		for(var i in info) {
			info[i] = defaultinfostate[i];
		}
		information.map((e) => {
			if (e.subjectArea == '10' || e.subjectArea == '20'){
				if (info.r1) info.r2 = e;
				else info.r1 = e;
			} else {
				info[c[e.subjectArea]] = e;
			}
		})
		setInfo({...info});
	}, [information])
	
	useEffect(() => {
		if (submitted) {
			let res = []
			for (var key in info) {
				if (info[key] != null && info[key].subjectCode){
					const area = Math.floor(info[key].subjectCode/10)*10
					if (info[key].originScore || info[key].standardScore || info[key].percentScore || info[key].grade) {
						res.push({...info[key], subjectArea: area})
					}
				}
			}
			setInformation(res);
		}
	},[submitted])
	
	const update = (e) => {
		if (grade == 1) {
			if (e.target.name == 'r1') {
				info['r1'] = {}
				info['r1']['subjectCode'] = 10
			} else if (e.target.name == 'r2') {
				info['r2'] = {}
				info['r2']['subjectCode'] = 20
			}
		}
		addInfo(e.target);
	}
	const updateMath = (e) => {
		if (!info['ma'] && grade < 3) {
			info['ma'] = {}
			info['ma']['subjectCode'] = 69+parseInt(grade);
		}
		addInfo(e.target)
	}
	const updateKr = (e) => {
		if (!info['kr'] && grade < 3) {
			info['kr'] = {}
			info['kr']['subjectCode'] = 59+parseInt(grade);
		}
		addInfo(e.target)
	}

	
	const addInfo = (e) => {
		const {name, value} = e;
		const dataType = e.getAttribute('data-type')
		console.log(name,dataType,value);
		let cpy = {...info}
		let a = {};
		a[dataType] = value;
		if (!cpy[name]) cpy[name] = a;
		else cpy[name][dataType] = value;
		if (dataType == 'originScore' && cpy[name]['subjectCode'] && conv[cpy[name]['subjectCode']][value]) {
			if (dataType == 'originScore' && cpy[name]['subjectCode'] && conv[cpy[name]['subjectCode']][value]) {
			cpy[name]['percentScore'] = conv[cpy[name]['subjectCode']][value][1] ;
			cpy[name]['standardScore'] = conv[cpy[name]['subjectCode']][value][0];
			cpy[name]['grade'] = conv[cpy[name]['subjectCode']][value][2];
		}
		}
		setInfo(cpy);
	}

	if (disabled) {
		return (
		<div className={styles['home-board']}>
			<table style={{backgroundColor:'white'}}>
				<tr>
				<th style={{width:'30%'}}>과목</th>
				{ type != 0 ? <th>원점수</th> : null }
				<th>표준점수</th>
				<th>전국백분위</th>
				<th>등급</th>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.red].join(' ')}>국어</div>
				</td>
				{ type != 0 ?
				<td>
				<div className={styles.input}>{info['kr'] ? info['kr'].originScore : '입력'}</div>
				</td> : null }
				<td>
				<div className={styles.input}>{info['kr'] ? info['kr'].standardScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['kr'] ? info['kr'].percentScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['kr'] ? info['kr'].grade : '입력'}</div>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.yellow].join(' ')}>수학 <span style={{fontSize:'0.4em',verticalAlign:'middle'}}>▼</span></div>
				</td>
				{ type != 0 ?
				<td>
				<div className={styles.input}>{info['ma'] ? info['ma'].originScore : '입력'}</div>
				</td> : null }
				<td>
				<div className={styles.input}>{info['ma'] ? info['ma'].standardScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['ma'] ? info['ma'].percentScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['ma'] ? info['ma'].grade : '입력'}</div>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.gold].join(' ')}>영어</div>
				</td>
				{ type != 0 ?
				<td>
				<div className={styles.input}>{info['en'] ? info['en'].originScore : '입력'}</div>
				</td> : null }
				<td>
				<div className={styles.input}>-</div>
				</td>
				<td>
				<div className={styles.input}>-</div>
				</td>
				<td>
				<div className={styles.input}>{info['en'] ? info['en'].grade : '입력'}</div>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.blue].join(' ')}>탐구1 <span style={{fontSize:'0.4em',verticalAlign:'middle'}}>▼</span></div>
				</td>
				{ type != 0 ?
				<td>
				<div className={styles.input}>{info['r1'] ? info['r1'].originScore : '입력'}</div>
				</td> : null }
				<td>
				<div className={styles.input}>{info['r1'] ? info['r1'].standardScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['r1'] ? info['r1'].percentScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['r1'] ? info['r1'].grade : '입력'}</div>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.blue].join(' ')}>탐구2 <span style={{fontSize:'0.4em',verticalAlign:'middle'}}>▼</span></div>
				</td>
				{ type != 0 ?
				<td>
				<div className={styles.input}>{info['r2'] ? info['r2'].originScore : '입력'}</div>
				</td> : null }
				<td>
				<div className={styles.input}>{info['r2'] ? info['r2'].standardScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['r2'] ? info['r2'].percentScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['r2'] ? info['r2'].grade : '입력'}</div>
				</td>
				</tr>
				
				{/*<tr>
				<td>
				<div className={styles.subject}>제2외국어 <span style={{fontSize:'0.4em',verticalAlign:'middle'}}>▼</span></div>
				</td>
				<td>
				<div className={styles.input}>{info['la'] ? info['la'].standardScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['la'] ? info['la'].percentScore : '입력'}</div>
				</td>
				<td>
				<div className={styles.input}>{info['la'] ? info['la'].grade : '입력'}</div>
				</td>
				</tr>*/}
				
				<tr>
				<td>
				<div className={[styles.subject,styles.purple].join(' ')}>한국사</div>
				</td>
				{ type != 0 ?
				<td>
				<div className={styles.input}>{info['hi'] ? info['hi'].originScore : '입력'}</div>
				</td> : null }
				<td>
				<div className={styles.input}>-</div>
				</td>
				<td>
				<div className={styles.input}>-</div>
				</td>
				<td>
				<div className={styles.input}>{info['hi'] ? info['hi'].grade : '입력'}</div>
				</td>
				</tr>
			</table>
		</div>
		);
	} else {
		return (
			<div className={styles['home-board']}>
			<table>
				<tr>
				<th style={{width:'30%'}}>과목</th>
				{ type != 0 ? <th>원점수</th> : null }
				<th>표준점수</th>
				<th>전국백분위</th>
				<th>등급</th>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.red].join(' ')}>
					{ grade == 3 ?
						<select data-type="subjectCode" name={'kr'} onChange={updateKr} value={info['kr'] ? info['kr'].subjectCode : '0'} className={styles.red}>
							<option disabled value="0" disabled selected>국어</option>
							<option value={subjectcode["언어와 매체"]}>언어와 매체</option>
							<option value={subjectcode["화법과 작문"]}>화법과 작문</option>
						</select> :
						'국어'
					}
				</div>
				</td>
				{ type != 0 ?
				<td>
				<input className={styles.input} name={'kr'} data-type="originScore" value={info['kr'] ? info['kr'].originScore || '' : ''} onChange={updateKr} placeholder="입력"/>
				</td> : null }
				<td>
				<input className={styles.input} name={'kr'} data-type="standardScore" value={info['kr'] ? info['kr'].standardScore || '' : ''} onChange={updateKr} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'kr'} data-type="percentScore" value={info['kr'] ? info['kr'].percentScore || '' : ''} onChange={updateKr} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'kr'} data-type="grade" value={info['kr'] ? info['kr'].grade || '' : ''} onChange={updateKr}  placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.yellow].join(' ')}>
					{ grade == 3 ?
						<select data-type="subjectCode" name={'ma'} onChange={update} value={info['ma'] ? info['ma'].subjectCode : '0'} className={styles.yellow}>
							<option disabled value="0" disabled selected>수학</option>
							<option value={subjectcode["확률과 통계"]}>확률과 통계</option>
							<option value={subjectcode["미적분"]}>미적분</option>
							<option value={subjectcode["기하"]}>기하</option>
						</select> :
						'수학'
					}
				</div>
				</td>
				{ type != 0 ?
				<td>
				<input className={styles.input} name={'ma'} data-type="originScore" value={info['ma'] ? info['ma'].originScore || '' : ''} onChange={updateMath} placeholder="입력"/>
				</td> : null }
				<td>
				<input className={styles.input} name={'ma'} data-type="standardScore" value={info['ma'] ? info['ma'].standardScore : ''} onChange={updateMath} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'ma'} data-type="percentScore" value={info['ma'] ? info['ma'].percentScore : ''} onChange={updateMath} placeholder="입력" placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'ma'} data-type="grade" value={info['ma'] ? info['ma'].grade : ''} onChange={updateMath} placeholder="입력" placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.gold].join(' ')}>영어</div>
				</td>
				{ type != 0 ?
				<td>
				<input className={styles.input} name={'en'} data-type="originScore" value={info['en'] ? info['en'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input disabled className={styles.input} name={'en'} data-type="standardScore" value="-"/>
				</td>
				<td>
				<input disabled className={styles.input} name={'en'} data-type="percentScore" value="-"/>
				</td>
				<td>
				<input className={styles.input} name={'en'} data-type="grade" value={info['en'] ? info['en'].grade || '' : ''} onChange={update} placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.blue].join(' ')}>
					{ grade > 1 ?
						<select data-type="subjectCode" name={'r1'} onChange={update} value={info['r1'] ? info['r1'].subjectCode : '0'} className={styles.blue}>
							<option disabled value="0">탐구1</option>
							{
								studies.map(
									(e,i) => {
										if (grade == 2 && parseInt(subjectcode[e]) > 24 && parseInt(subjectcode[e]) < 30) return;
										return <option key={i} value={subjectcode[e]}>{e}</option>
									}
								)
							}
						</select>
						: '통합사회'
					}
				</div>
				</td>
				{ type != 0 ?
				<td>
				<input className={styles.input} name={'r1'} data-type="originScore" value={info['r1'] ? info['r1'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input className={styles.input} name={'r1'} data-type="standardScore" value={info['r1'] ? info['r1'].standardScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'r1'} data-type="percentScore" value={info['r1'] ? info['r1'].percentScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'r1'} data-type="grade" value={info['r1'] ? info['r1'].grade : ''} onChange={update} placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className={[styles.subject,styles.blue].join(' ')}>
					{ grade > 1 ?
						<select data-type="subjectCode" name={'r2'} onChange={update} value={info['r2'] ? info['r2'].subjectCode : '0'} className={styles.blue}>
							<option disabled value="0">탐구2</option>
							{
								studies.map(
									(e,i) => {
										if (grade == 2 && parseInt(subjectcode[e]) > 24 && parseInt(subjectcode[e]) < 30) return;
										return <option key={i} value={subjectcode[e]}>{e}</option>
									}
								)
							}
						</select>
						: '통합과학'
					}
				</div>
				</td>
				{ type != 0 ?
				<td>
				<input className={styles.input} name={'r2'} data-type="originScore" value={info['r2'] ? info['r2'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input className={styles.input} name={'r2'} data-type="standardScore" value={info['r2'] ? info['r2'].standardScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'r2'} data-type="percentScore" value={info['r2'] ? info['r2'].percentScore : ''} onChange={update}  placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'r2'} data-type="grade" value={info['r2'] ? info['r2'].grade : ''} onChange={update}  placeholder="입력"/>
				</td>
				</tr>
				
				{/* type == 0 || type > 6 ?
				<tr>
				<td>
				<div className={styles.subject}>
					<select data-type="subjectCode" name={'la'} onChange={(e)=>{update}} value={info['la'] ? info['la'].subjectCode : '0'}>
						<option disabled value="0">제2외국어</option>
						{
							languages.map(
								(e,i) => {
									return <option key={i} value={subjectcode[e]}>{e}</option>
								}
							)
						}
					</select>
				</div>
				</td>
				<td>
				<input className={styles.input} name={'la'} data-type="standardScore" value={info['la'] ? info['la'].standardScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'la'} data-type="percentScore" value={info['la'] ? info['la'].percentScore : ''} onChange={update}  placeholder="입력"/>
				</td>
				<td>
				<input className={styles.input} name={'la'} data-type="grade" value={info['la'] ? info['la'].grade : ''} onChange={update}  placeholder="입력"/>
				</td>
				</tr> : null */}
				
				<tr>
				<td>
				<div className={[styles.subject,styles.purple].join(' ')}>한국사</div>
				</td>
				{ type != 0 ?
				<td>
				<input className={styles.input} name={'hi'} data-type="originScore" value={info['hi'] ? info['hi'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input disabled className={styles.input} name={'hi'} data-type="standardScore" value="-"/>
				</td>
				<td>
				<input disabled className={styles.input} name={'hi'} data-type="percentScore" value="-"/>
				</td>
				<td>
				<input className={styles.input} name={'hi'} data-type="grade" value={info['hi'] ? info['hi'].grade || '' : ''} onChange={update} placeholder="입력"/>
				</td>
				</tr>
			</table>
		</div>
		);
	}
}

export default grade;