import {useState, useEffect} from 'react'

const grade = (props) => {
	const {disabled, subjectcode, type, grade, conv} = props;
	const {information, setInformation} = props;
	const {submitted} = props;
	const studies = ["생활과 윤리", "윤리와 사상", "한국지리", "세계지리", "동아시아사", "세계사", "정치와 법", "경제", "사회·문화", "물리학Ⅰ", "화학Ⅰ", "생명과학Ⅰ", "지구과학Ⅰ", "물리학Ⅱ", "화학Ⅱ", "생명과학Ⅱ", "지구과학Ⅱ"]
	const languages = ["한문Ⅰ","독일어Ⅰ","프랑스어Ⅰ","스페인어Ⅰ","아랍어Ⅰ","일본어Ⅰ","중국어Ⅰ","러시아어Ⅰ","베트남어Ⅰ"]
	const c = {
			[subjectcode['국어']]:'kr',
			[subjectcode['수학']]:'ma',
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
		for(var i in info) {
			info[i] = defaultinfostate[i];
		}
		console.log(information);
		information.map((e) => {
			if (e.subjectArea == '10' || e.subjectArea == '20'){
				if (info.r1) info.r2 = e;
				else info.r1 = e;
			} else {
				info[c[e.subjectArea]] = e;
			}
		})
		setInfo({...info});
		console.log(subjectcode)
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
			if (!info['r1'] && e.target.name == 'r1') {
				info['r1'] = {}
				info['r1']['subjectCode'] = 10
			} else if (!info['r2'] && e.target.name == 'r2') {
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
		if (dataType == 'originScore' && cpy[name]['subjectCode'] && conv[cpy[name]['subjectCode']] && conv[cpy[name]['subjectCode']][value]) {
			cpy[name]['percentScore'] = conv[cpy[name]['subjectCode']][value][1] ;
			cpy[name]['standardScore'] = conv[cpy[name]['subjectCode']][value][0];
			cpy[name]['grade'] = conv[cpy[name]['subjectCode']][value][2];
		}
		setInfo(cpy);
	}
		return (
			<div style={{position:'relative'}}>
			<style jsx>{`
				table {
					width: 100%;
					text-align:center;
					vertical-align:middle;
					border-collapse: collapse;
					table-layout: fixed;
				}
				table > tr:first-child {
					background-color:#e8e8e8;
				}
				table > tr > th {
					height:79px;
					width: 25%;
				}
				table > tr > th:first-child {
					margin: 0;
					padding-left: 120px;
					text-align:left;
				}
				table > tr > td:first-child > * {
					border: 1px solid #e8e8e8;
					border-radius: 4px;
				}
				td {
					border-bottom: 1px solid #e8e8e8;
					padding: 20px 0;
				}
				.subject {
					width: 240px;
					height:45px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					box-shadow: 0 3px 6px 0 rgba(0,0,0,0.1);
				}
				.input {
					width: 140px;
					height: 45px;
					box-sizing: border-box;
					border: '1px solid #e8e8e8';
					padding: 0;
					text-align: center;
					box-shadow: '0 3px 6px 0 rgba(0,0,0,0.1)';
				}
				.disabled {
					opacity: 50%;
					position: absolute;
					height: 100%;
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 30px;
					-webkit-text-stroke: 1px;
					background-color: white;
					z-index: 1;
				}
			`}</style>
			{
				disabled ? <div className='disabled'>
				조건을 선택해주세요
				</div> : null
			}
			<table>
				<tr>
				<th>과목</th>
				{ type != 0 ? <th>원점수</th> : null }
				<th>표준점수</th>
				<th>전국백분위</th>
				<th>등급</th>
				</tr>
				
				<tr>
				<td>
				<div className="subject">
					{ grade == 3 ?
						<select data-type="subjectCode" name={'kr'} onChange={updateKr} value={info['kr'] ? info['kr'].subjectCode : '0'}>
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
				<input className="input" name={'kr'} data-type="originScore" value={info['kr'] ? info['kr'].originScore || '' : ''} onChange={updateKr} placeholder="입력"/>
				</td> : null }
				<td>
				<input className="input" name={'kr'} data-type="standardScore" value={info['kr'] ? info['kr'].standardScore || '' : ''} onChange={updateKr} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'kr'} data-type="percentScore" value={info['kr'] ? info['kr'].percentScore || '' : ''} onChange={updateKr} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'kr'} data-type="grade" value={info['kr'] ? info['kr'].grade || '' : ''} onChange={updateKr}  placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className="subject">
					{ grade == 3 ?
						<select data-type="subjectCode" name={'ma'} onChange={update} value={info['ma'] ? info['ma'].subjectCode : '0'}>
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
				<input className="input" name={'ma'} data-type="originScore" value={info['ma'] ? info['ma'].originScore || '' : ''} onChange={updateMath} placeholder="입력"/>
				</td> : null }
				<td>
				<input className="input" name={'ma'} data-type="standardScore" value={info['ma'] ? info['ma'].standardScore : ''} onChange={updateMath} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'ma'} data-type="percentScore" value={info['ma'] ? info['ma'].percentScore : ''} onChange={updateMath} placeholder="입력" placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'ma'} data-type="grade" value={info['ma'] ? info['ma'].grade : ''} onChange={updateMath} placeholder="입력" placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className="subject">영어</div>
				</td>
				{ type != 0 ?
				<td>
				<input className="input" name={'en'} data-type="originScore" value={info['en'] ? info['en'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input disabled className="input" name={'en'} data-type="standardScore" value={info['en'] ? info['en'].standardScore || '' : ''} onChange={update} placeholder="-"/>
				</td>
				<td>
				<input disabled className="input" name={'en'} data-type="percentScore" value={info['en'] ? info['en'].percentScore || '' : ''} onChange={update} placeholder="-"/>
				</td>
				<td>
				<input disabled className="input" name={'en'} data-type="grade" value={info['en'] ? info['en'].grade || '' : ''} onChange={update} placeholder="자동"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className="subject">
					{ grade > 1 ?
						<select data-type="subjectCode" name={'r1'} onChange={update} value={info['r1'] ? info['r1'].subjectCode : '0'}>
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
				<input className="input" name={'r1'} data-type="originScore" value={info['r1'] ? info['r1'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input className="input" name={'r1'} data-type="standardScore" value={info['r1'] ? info['r1'].standardScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'r1'} data-type="percentScore" value={info['r1'] ? info['r1'].percentScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'r1'} data-type="grade" value={info['r1'] ? info['r1'].grade : ''} onChange={update} placeholder="입력"/>
				</td>
				</tr>
				
				<tr>
				<td>
				<div className="subject">
					{grade > 1 ?
						<select data-type="subjectCode" name={'r2'} onChange={update} value={info['r2'] ? info['r2'].subjectCode : '0'}>
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
				<input className="input" name={'r2'} data-type="originScore" value={info['r2'] ? info['r2'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input className="input" name={'r2'} data-type="standardScore" value={info['r2'] ? info['r2'].standardScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'r2'} data-type="percentScore" value={info['r2'] ? info['r2'].percentScore : ''} onChange={update}  placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'r2'} data-type="grade" value={info['r2'] ? info['r2'].grade : ''} onChange={update}  placeholder="입력"/>
				</td>
				</tr>
				
				{/* type == 0 || type > 6 ?
				<tr>
				<td>
				<div className="subject">
					<select data-type="subjectCode" name={'la'} onChange={update} value={info['la'] ? info['la'].subjectCode : '0'}>
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
				<input className="input" name={'la'} data-type="standardScore" value={info['la'] ? info['la'].standardScore : ''} onChange={update} placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'la'} data-type="percentScore" value={info['la'] ? info['la'].percentScore : ''} onChange={update}  placeholder="입력"/>
				</td>
				<td>
				<input className="input" name={'la'} data-type="grade" value={info['la'] ? info['la'].grade : ''} onChange={update}  placeholder="입력"/>
				</td>
				</tr> : null */}
				
				<tr>
				<td>
				<div className="subject">한국사</div>
				</td>
				{ type != 0 ?
				<td>
				<input className="input" name={'hi'} data-type="originScore" value={info['hi'] ? info['hi'].originScore || '' : ''} onChange={update} placeholder="입력"/>
				</td> : null }
				<td>
				<input disabled className="input" name={'hi'} data-type="standardScore" value={info['hi'] ? info['hi'].standardScore || '' : ''} onChange={update} placeholder="-"/>
				</td>
				<td>
				<input disabled className="input" name={'hi'} data-type="percentScore" value={info['hi'] ? info['hi'].percentScore || '' : ''} onChange={update} placeholder="-"/>
				</td>
				<td>
				<input disabled className="input" name={'hi'} data-type="grade" value={info['hi'] ? info['hi'].grade || '' : ''} onChange={update} placeholder="자동"/>
				</td>
				</tr>
			</table>
		</div>
		);
}

export default grade;