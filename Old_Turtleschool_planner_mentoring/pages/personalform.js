import styles from './main/InfoForm.module.css'
import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import pool from '../lib/pool'
import axios from 'axios'
import withDesktop from '../comp/withdesktop'
import page from './desktop/personalform'
import Search from '../comp/search'
import {useContext} from 'react'
import loginContext from '../contexts/login'


const personalform = (props) => {

	const [ready, setReady] = React.useState(false);
	const [personalInfo, setPersonalInfo] = React.useState();
	const router = useRouter();
	const {personalcode} = props;
	const locations = ['서울특별시','경기도','인천광역시','세종특별자치시','대전광역시','대구광역시','충청북도','충청남도','강원도','광주광역시','전라북도','전라남도','부산광역시','울산광역시','경상북도','경상남도','제주특별자치도','재외한국학교교육청']
	const hagwonlocations = locations.map(e => e+'교육청')
	const [schools, setSchools] = useState([])
	const [school, setSchool] = useState('')
	const [hagwons, setHagwons] = useState([])
	const [hagwonLocation, setHagwonLocation] = useState('')
	const [districts, setDistricts] = useState([])
	const [hagwon, setHagwon] = useState('')
	const {info} = useContext(loginContext)
	
	const handleSubmit = async (e) => {
		setPersonalInfo(prevState => {let b = Object.assign({},prevState);
									b['cellphone'] = b['cell1']+b['cell2']+b['cell3'];
									setReady(true);
									return b;});
	}
	
	useEffect(() => {
		if (ready) {
			axios.post('/api/members', personalInfo, {headers: {auth: localStorage.getItem('uid')}}).then(() => {router.back();})
			info[1](personalInfo);
		}
	},[ready])
	
	const searchStyle = {
		input: {
			height:'18px'
		},
		suggestionsList: {
			position:'absolute',
			display:'flex',
			flexDirection:'column',
			listStyleType:'none',
			margin:0,
			padding:0,
			backgroundColor:'white',
			maxHeight:'300px',
			overflow:'scroll',
			zIndex: 1,
			width: '100%'
		},
		suggestionHighlighted: {
			color:'#fede01',
			cursor:'pointer',
		}
	}
	
	const personalChangeHandler = (e) => {
		let n = e.target.name;
		let v = e.target.value;
		setPersonalInfo(prevState => {let b = Object.assign({},prevState);
									b[n] = v;
									return b;});
		console.log(personalInfo);
	}
	
	const [infoData, setInfoData] = React.useState([{userName: '', relationCode: '', gradeCode: '', school: '', cellphone: '', email: '', hagwon: ''}])
	
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
	
	const handleSchool = e => {
		setSchool(e);
		setPersonalInfo(prev => {let a = Object.assign({},prev); a['school'] = e; return a;})
	}
	
	const handleLocation = (e) => {
		const {value} = e.target
		getData(`/api/highschool?location=${value}`, setSchools)
	}
	const handleHagwonLocation = (e) => {
		const {value} = e.target
		setHagwonLocation(value)
		getData(`/api/hagwon?location=${value}`, setDistricts)
	}
	const handleHagwonDistrict = e => {
		const {value} = e.target
		getData(`/api/hagwon?location=${hagwonLocation}&district=${value}`, setHagwons)
	}
	const handleHagwon = e => {
		setHagwon(e)
		setPersonalInfo(prev => {let a = Object.assign({},prev); a['hagwon'] = e; return a;})
	}
	
	useEffect(() => {
		if (info[0]) setInfoData([info[0]])
	}, [info[0]])

	useEffect(() => {
		var infoList = [...infoData]
		if(infoList[0].cellphone) {
			infoList[0].cell1 = infoList[0].cellphone.slice(0,3)
			infoList[0].cell2 = infoList[0].cellphone.slice(3,7)
			infoList[0].cell3 = infoList[0].cellphone.slice(7,11)
		}
		setPersonalInfo(infoList[0])
	},[infoData])
	
	return (<>
		<div className="header"></div>
		<div className={styles.InfoForm_info}>
							<p className={styles.InfoForm_info_title} style={{color:'#555555'}}>내 정보 입력</p>
							<div className={styles.InfoForm_info_table}>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>수험생 이름</div>
									<div>
										<input className={styles.InfoForm_name_input} value={personalInfo ? personalInfo.userName : ''} name="userName" onChange={personalChangeHandler} required/>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>수험생과의 관계</div>
									<div className={styles.InfoForm_contents_radio} >
										<input id={personalcode['본인']} value={personalcode['본인']} type="radio" name="relationCode" onClick={personalChangeHandler} required defaultChecked={personalInfo ? personalInfo.relationCode=="10" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['본인']}>본인</label>
										<input id={personalcode['학생모']} value={personalcode['학생모']} type="radio" name="relationCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.relationCode=="20" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['학생모']}>학생모</label>
										<input id={personalcode['학생부']} value={personalcode['학생부']} type="radio" name="relationCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.relationCode=="30" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['학생부']}>학생부</label>
										<input id={personalcode['학교관계자']} value={personalcode['본인']} type="radio" name="relationCode" onClick={personalChangeHandler} required defaultChecked={personalInfo ? personalInfo.relationCode=="40" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['본인']}>학교관계자</label>
										<input id={personalcode['학원관계자']} value={personalcode['학생모']} type="radio" name="relationCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.relationCode=="50" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['학원관계자']}>학원관계자</label>
										<input id={personalcode['기타']} value={personalcode['기타']} type="radio" name="relationCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.relationCode=="60" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['기타']}>기타</label>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>학년</div>
									<div className={styles.InfoForm_contents_radio}>
										<input id={personalcode['고1']} value={personalcode['고1']} type="radio" name="gradeCode" onClick={personalChangeHandler} required defaultChecked={personalInfo ? personalInfo.gradeCode=="H1" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['고1']}>고1</label>
										<input id={personalcode['고2']} value={personalcode['고2']} type="radio" name="gradeCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.gradeCode=="H2" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['고2']}>고2</label>
										<input id={personalcode['고3']} value={personalcode['고3']} type="radio" name="gradeCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.gradeCode=="H3" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['고3']}>고3</label>
										<input id={personalcode['N수']} value={personalcode['N수']} type="radio" name="gradeCode" onClick={personalChangeHandler} defaultChecked={personalInfo ? personalInfo.gradeCode=="HN" : null}/>
										<label className={styles.InfoForm_relation_btn} htmlFor={personalcode['N수']}>N수</label>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>출신 고교</div>
									<div>
										<select defaultValue='' onChange={handleLocation} >
											<option value=''>선택</option>
											{locations.map(e => <option value={e} key={e}>{e}</option>)}
										</select>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>- 고교 입력</div>
									<div>
										{schools.length > 0 ? <Search majors={schools} val={[school, handleSchool]} name="학교명" holder="학교를 입력하세요" theme={searchStyle}/> : <input disabled value={infoData[0]['school'] || '입력된 학교 없음'} />}
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>추천 학원</div>
									<div>
										<select defaultValue='' onChange={handleHagwonLocation} >
											<option disabled value=''>선택</option>
											{hagwonlocations.map(e => <option value={e} key={e}>{e}</option>)}
										</select>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>- 지역 입력</div>
									{districts.length > 0 ?
										<select defaultValue="-" onChange={handleHagwonDistrict} >
											<option disabled value='-'>선택</option>
											{districts.map(e => <option value={e['행정구역명']} key={e['행정구역명']}>{e['행정구역명']}</option>)}
										</select> : null
										}
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>- 학원 이름 입력</div>
									{hagwons.length > 0 ? <Search majors={hagwons} val={[hagwon, handleHagwon]} name="학원명" holder="학원을 입력하세요" theme={searchStyle}/> : <input disabled value={infoData[0]['hagwon'] || '입력된 학원 없음'} />}
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>핸드폰 번호</div>
									<div>
										<input className={styles.InfoForm_tel_input} value={personalInfo ? personalInfo.cell1 : ''} name="cell1" pattern="[0-9]{3}" onChange={personalChangeHandler} required/>
									-
									<input className={styles.InfoForm_tel_input} value={personalInfo ? personalInfo.cell2 : ''} name="cell2" pattern="[0-9]{3-4}" onChange={personalChangeHandler} required/>
									-
									<input className={styles.InfoForm_tel_input} value={personalInfo ? personalInfo.cell3 : ''} name="cell3" pattern="[0-9]{3-4}"onChange={personalChangeHandler} required/>
									</div>
								</div>
								<div className={styles.InfoForm_table_contents}>
									<div className={styles.InfoForm_contents_title}>이메일 주소</div>
									<div>
										<input className={styles.InfoForm_email_input} value={personalInfo ? personalInfo.email : ''} name="email" onChange={personalChangeHandler} pattern="\w+@\w+.\w+" required/>
									</div>
								</div>
							</div>
						</div>
						<div className={styles.InfoForm_btn_tab}>
								<button className={styles.InfoForm_complete_btn} onClick={handleSubmit}>완료하기</button>
							</div>
							</>
	)
}

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
	return {props: {personalcode: personalcode}}
}

export default withDesktop(page,personalform);