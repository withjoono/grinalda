import React, {useState, useEffect, useContext} from 'react'
import styles from './personalform.module.css'
import pool from '../../lib/pool'
import axios from 'axios'
import {useRouter} from 'next/router'
import Search from '../../comp/search'
import loginContext from '../../contexts/login'

const personalform = (props) => {

	const router = useRouter();
	const {personalcode} = props;
	const {title, container, inputs} = styles;
	const locations = ['서울특별시','경기도','인천광역시','세종특별자치시','대전광역시','충청북도','충청남도','강원도','광주광역시','전라북도','전라남도','부산광역시','울산광역시','경상북도','경상남도','제주특별자치도','재외한국학교교육청']
	const hagwonlocations = locations.map(e => e+'교육청')
	const [schools, setSchools] = useState([])
	const [school, setSchool] = useState('')
	const [hagwons, setHagwons] = useState([])
	const [hagwonLocation, setHagwonLocation] = useState('')
	const [districts, setDistricts] = useState([])
	const [hagwon, setHagwon] = useState('')
	const {info} = useContext(loginContext) 
	
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
	
	const handleSubmit = async (e) => {
		axios.post('/api/members', infoData[0], {headers: {auth: localStorage.getItem('uid')}}).then(() => {router.back();})
		info[1](infoData[0]);
	}
	
	const handleSchool = e => {
		setSchool(e);
		setInfoData(prev => {let a = prev.slice(); a[0]['school'] = e; return a;})
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
		setInfoData(prev => {let a = prev.slice(); a[0]['hagwon'] = e; return a;})
	}
	
	const searchStyle = {
		container: {
			marginBottom:'35px',
		},
		input: {
			width:'100%',
			height:'20px'
		},
		suggestionsList: {
			position:'absolute',
			display:'flex',
			flexDirection:'column',
			listStyleType:'none',
			margin:0,
			padding:0,
			backgroundColor:'white',
		},
		suggestionHighlighted: {
			color:'#fede01',
			cursor:'pointer',
		}
	}
	
	const personalChangeHandler = (e) => {
		let n = e.target.name;
		let v = e.target.value;
		setInfoData(prevState => {let b = infoData.slice();
									b[0][n] = v;
									console.log(b)
									return b;});
	}
	
	const [infoData, setInfoData] = React.useState([{userName: '', relationCode: '', gradeCode: '', school: '', cellphone: '', email: '', hagwon: ''}])
	
	useEffect(() => {
		if (info[0]) setInfoData([info[0]])
	}, [info[0]])
	
	useEffect(() => {
		console.log(infoData)
	}, [infoData])
	
	return (
		<div className="page">
			<div className={title}>회원정보 수정</div>
			<div className={container} style={{marginLeft:'39.6%'}}>
				<div>수험생 이름</div>
				<div>수험생과의 관계</div>
				<div>학년</div>
				<div>출신고교</div>
				<div />
				<div>추천학원</div>
				<div />
				{hagwons.length > 0 ? <div /> : null}
				<div>핸드폰 번호</div>
				<div>이메일 주소</div>
			</div>
			<div className={inputs}>
				<input value={infoData[0].userName || ''} name="userName" onChange={personalChangeHandler}/>
				<div style={{marginBottom:'37px'}}>
				<input type="radio" value="10" name="relationCode" id="4" onClick={personalChangeHandler} checked={infoData[0].relationCode == '10'}/>
				<label htmlFor="4">학생</label>
				<input type="radio" value="20" name="relationCode" id="5" onClick={personalChangeHandler} checked={infoData[0].relationCode == '20'}/>
				<label htmlFor="5">학부모</label>
				<input type="radio" value="30" name="relationCode" id="6" onClick={personalChangeHandler} checked={infoData[0].relationCode == '30'}/>
				<label htmlFor="6">학교 선생님</label>
				<input type="radio" value="40" name="relationCode" id="7" onClick={personalChangeHandler} checked={infoData[0].relationCode == '40'}/>
				<label htmlFor="7">그외 선생님</label>
				<input type="radio" value="50" name="relationCode" id="8" onClick={personalChangeHandler} checked={infoData[0].relationCode == '50'}/>
				<label htmlFor="8">거북스쿨 멘토</label>
			
				</div>
				<div style={{marginBottom:'37px'}}>
				<input type="radio" value="H1" name="gradeCode" id="0" onClick={personalChangeHandler} checked={infoData[0].gradeCode == 'H1'}/>
				<label htmlFor="0">고1</label>
				<input type="radio" value="H2" name="gradeCode" id="1" onClick={personalChangeHandler} checked={infoData[0].gradeCode == 'H2'}/>
				<label htmlFor="1">고2</label>
				<input type="radio" value="H3" name="gradeCode" id="2" onClick={personalChangeHandler} checked={infoData[0].gradeCode == 'H3'}/>
				<label htmlFor="2">고3</label>
				<input type="radio" value="HN" name="gradeCode" id="3" onClick={personalChangeHandler} checked={infoData[0].gradeCode == 'HN'}/>
				<label htmlFor="3">N수</label>
				</div>
				<select defaultValue='' onChange={handleLocation} >
					<option value=''>선택</option>
					{locations.map(e => <option value={e} key={e}>{e}</option>)}
				</select>
				{schools.length > 0 ? <Search majors={schools} val={[school, handleSchool]} name="학교명" holder="학교를 입력하세요" theme={searchStyle}/> : <input disabled value={infoData[0]['school'] || '입력된 학교 없음'} />}
				<select defaultValue='' onChange={handleHagwonLocation} >
					<option disabled value=''>선택</option>
					{hagwonlocations.map(e => <option value={e} key={e}>{e}</option>)}
				</select>
				{districts.length > 0 ?
				<select defaultValue="-" onChange={handleHagwonDistrict} >
					<option disabled value='-'>선택</option>
					{districts.map(e => <option value={e['행정구역명']} key={e['행정구역명']}>{e['행정구역명']}</option>)}
				</select> : null
				}
				{hagwons.length > 0 ? <Search majors={hagwons} val={[hagwon, handleHagwon]} name="학원명" holder="학원을 입력하세요" theme={searchStyle}/> : <input disabled value={infoData[0]['hagwon'] || '입력된 학원 없음'} />}
				<input value={infoData[0].cellphone || ''} name="cellphone" onChange={personalChangeHandler}/>
				<input value={infoData[0].email || ''} name="email" onChange={personalChangeHandler}/>
			</div>
			<div onClick={handleSubmit} style={{backgroundColor:'#fede01',width:'220px',height:'40px',color:'white',margin:'0 auto',display:'flex',justifyContent:'center',alignItems:'center',fontWeight:400,fontSize:'15px',boxSizing:'border-box'}}>완료하기</div>
		</div>
	
	);

}

export default personalform;

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