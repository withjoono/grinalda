import React, { useState, useEffect, useContext, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link'
import Search from '../../comp/search'
import {useRouter} from 'next/router'
import loginContext from '../../contexts/login'

const regularuniversity = ({area,line,majors}) => {
	
	const [open, setOpen] = React.useState(false);
	const router = useRouter()
	const recruit_group = [{code:'10',name:'가군'},{code:'20',name:'나군'},{code:'30',name:'다군'},{code:'90',name:'군외'}]
	const {exams, type} = useContext(loginContext);
	const handleOpen = async (uni, maj, uname, mname) => {
		let stem = await axios.get(`/api/stem`,{params: {universityId: uni, departmentId: maj}});
		stem = stem.data.r;
		if (stem.lineCode == '10') stem = '문과';
		else if (stem.lineCode == '20') stem = '이과';
		let r = await axios.get(`/api/conv`, {params: {uname: uname, mname: mname}});
		const ress = await axios.get('/api/gpa', {params: {uid: uni, mid: maj}});
		const {name, major, maxscore} = r.data;
		const info = {name1:name, name2: major, bb: stem, maxscore: maxscore, gpa: ress.data.gpa}
		sessionStorage.setItem('info', JSON.stringify(info));
		sessionStorage.setItem('temp', JSON.stringify({name: uname, major: mname}));
		const {data} = await axios.get('/api/paid',{headers: {auth: `${localStorage.getItem('uid')}`}});
		if (true) {
			router.push(`/regular/result`);
		} else setOpen(true);
	  };
	
	const handle = async (uni, maj, uname, mname) => {
		let stem = await axios.get(`/api/stem`,{params: {universityId: uni, departmentId: maj}});
		stem = stem.data.r;
		if (stem.lineCode == '10') stem = '문과';
		else if (stem.lineCode == '20') stem = '이과';
		let r = await axios.get(`/api/conv`, {params: {uname: uname, mname: mname}});
		const {name, major, maxscore} = r.data;
		const info = {name1:name, name2: major, bb: stem}
			const g = async () => {
				const res = await axios.get('https://web-api-vplbp.run.goorm.io/api/v1/school',{params: info}); console.log(res);
				return res.data;
				}
			return g();
		const {data} = await axios.get('/api/paid',{headers: {auth: `${localStorage.getItem('uid')}`}});
	}
	
	const handleClose = () => {
		setOpen(false);
	};

	const axios = require('axios');

	const [univ_selected, setUnivSelected] = useState({})
	const [univ_searched, setUnivSearched] = useState([])
	const [univ_univList, setUnivList] = useState(null)
	
	const [department_value, setDepartmentValue] = useState('')
	
	const [resultList, setResultList] = useState([])
	const [left, setLeft] = useState(false);
	
	useEffect(() => {
		if (univ_univList && univ_univList.length > 0 && univ_univList[0] != undefined) getData(`/api/universities/departments/${univ_univList[0]}`, setResultList, univ_selected)
	},[univ_univList]);

	const getData = (api_url, setData, params, isPost) => {
		const get_ = async () => {
			if (!isPost) {
				const response = await axios.get(api_url, {
					headers: {
						'Content-Type': 'application/json',
						'auth': `${localStorage.getItem('uid')}`
					},
					params: params
				});
				return response.data.data
			} else {
				const response = await axios.post(api_url, {search: params},{
					headers: {
						'Content-Type': 'application/json',
						'auth': `${localStorage.getItem('uid')}`
					} }
				);
				return response.data.data
			}
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
	
	const searchStyle = {
		container: {
			marginRight: '40px',
			border: '2px solid #fede01',
			display:'flex',
			flexDirection:'column',
			height:'40px',
			flex: '1 0 0'
		},
		input: {
			width:'100%',
			height:'40px',
			backgroundColor:'transparent',
			border:'0',
			boxSizing:'border-box',
			minHeight:'40px'
		},
		suggestionsList: {
			display:'flex',
			flexDirection:'column',
			listStyleType:'none',
			margin:0,
			padding:0,
		},
		suggestion: {
			 fontSize:'0.8em',
			 color:'#707070'
		},
		suggestionHighlighted: {
			color:'#fede01',
		}
	}
	
	return (<>
		<style jsx>{`
			.title {
				font-size:30px;
				margin: 37px 0 75px;
				text-align: left;
				-webkit-text-stroke:1px;
				font-weight: normal;
			}
			.btns {
				display: flex;
				border-bottom: 2px solid #fede01;
				margin-right: -5px;
				margin-bottom: 25px;
			}
			.btns > div {
				margin-right: 5px;
				margin-bottom: -2px;
				border: 2px solid #fede01;
				width: 180px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.searchbtns {
				display: flex;
				margin-right: -40px;
				margin-bottom: 30px;
			}
			.searchbtns > div {
				margin-right: 40px;
				border: 2px solid #fede01;
				align-items: center;
				justify-content: center;
				display:flex;
				height:40px;
				flex: 1 0 0;
			}
			.sel {
				position: relative;
			}
			.sel > select {
				appearance: none;
			  // Additional resets for further consistency
			  background-color: transparent;
			  border: none;
			  padding: 0;
			  margin: 0 auto;
			  height: 100%;
			  line-height: inherit;
			  text-align: center;
			  text-align-last: center;
			  font-size: inherit;
			  outline: none;
			}
			.bigbtn {
				border-radius: 20px;
				background-color: #fede01;
				width: 300px;
				height: 40px;
				display:flex;
				align-items: center;
				justify-content:center;
				color: white;
				-webkit-text-stroke: 1px;
				box-shadow: 0 3px 6px 0 rgba(0,0,0,0.1);
				margin: 0 auto 50px;
			}
			.unibtns {
				display: flex;
				margin-right: -40px;
				border-bottom: 1px solid #eeeeee;
				margin-bottom: 20px;
				flex-wrap: wrap;
			}
			.unibtns > div {
				flex: 1 0 21%;
				margin-right: 40px;
				margin-bottom: 40px;
				border: 2px solid #fede01;
				width: 180px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.results {
				display: flex;
				max-width: 470px;
				flex-direction: column;
				margin:66px auto 60px;
				
			}
			.results > div {
				display: flex;
				justify-content:space-between;
				align-items: center;
				margin-bottom: 17px;
			}
			.results > div > div {
				background-color:#fede01;
				height:40px;
				width: 110px;
				display: flex;
				align-items: center;
				justify-content: center;
				box-shadow: 0 3px 6px 0 rgba(0,0,0,0.1);
				border-radius: 4px;
			}
			.active {
				color: white;
				background-color:#fede01;
			}
		`}</style>
		<div className="page">
			<div style={{width:'1280px',margin:'0 auto'}}>
				<div className="title">
					대학/학과별 검색
				</div>
				<div className="btns">
					<div className={left ? "active" : undefined} onClick={()=>setLeft(true)}>대학별 검색</div>
					<div className={left ? undefined : "active"} onClick={()=>setLeft(false)}>학과별 검색</div>
				</div>
				<div className="searchbtns">
				{left ? <>
					<div className="sel">
					<select defaultValue="" onChange={e => setUnivSelected({...univ_selected, areaCode: e.target.value})}>
						<option value="" disabled>지역 ▼</option>
						{
							area.map((e, i) => {
								return(<option key={i} value={e.code}>{e.name}</option>)
							})
						}
					</select>
					</div>
					<div className="sel">
						<select defaultValue="" onChange={e => setUnivSelected({...univ_selected, groupCode: e.target.value})}>
							<option value="" disabled>모집군 ▼</option>
							{
								recruit_group.map((e, i) => {
									return(<option key={i} value={e.code}>{e.name}</option>)
								})
							}
						</select>
					</div>
					<div className="sel">
						<select defaultValue="" onChange={e => setUnivSelected({...univ_selected, lineCode: e.target.value})}>
							<option value="" disabled>미적/기벡&과탐 ▼</option>
							{
								line.map((e, i) => {
									return(<option key={i} value={e.code}>{e.name}</option>)
								})
							}
						</select>
					</div> </> : <>
					<Search majors={majors} val={[department_value,setDepartmentValue]} theme={searchStyle}/>
					<div className="sel">
					<select defaultValue="" onChange={e => setUnivSelected({...univ_selected, areaCode: e.target.value})}>
						<option value="" disabled >지역 ▼</option>
						{
							area.map((e, i) => {
								return(<option key={i} value={e.code}>{e.name}</option>)
							})
						}
					</select>
					</div>
					<div className="sel">
						<select defaultValue="" onChange={e => setUnivSelected({...univ_selected, groupCode: e.target.value})}>
							<option value="" disabled>모집군 ▼</option>
							{
								recruit_group.map((e, i) => {
									return(<option key={i} value={e.code}>{e.name}</option>)
								})
							}
						</select>
				</div></>}
				</div>
				<div className="bigbtn" onClick={() => {
					if (left) getData('/api/universities/search', setUnivSearched, univ_selected, true)
					else {setUnivList([]);
							setUnivSearched([]);
							getData(`/api/departments/${department_value}/universities`, setResultList, univ_selected)}
					}}>
					검색하기
				</div>
				{univ_searched ? 
				<div className="unibtns">
				{
					univ_searched.map((e,i) => (<div
						onClick={()=>{setUnivList([e.universityId, e.universityName])}}
						name={e.universityName}
						value={e.universityId}
						key={i}>{e.universityName}</div>))
				}
				</div> : null }
				{
					resultList ?
					<div className="results">
						{resultList.map(e=> {
							let university = (univ_univList.length == 2 ? univ_univList[1] : e.universityName)
							let department = (left ? e.departmentName : e.departmentName)
							let universityId = (univ_univList.length == 2 ? univ_univList[0] : e.universityId)
							let departmentId = (left ? e.departmentId : e.departmentId)
							return (
								<div>
									<p>{left ? department : university+' '+department}</p><div onClick={()=>{handleOpen(universityId, departmentId, university, department)}}>결과 확인</div>
								</div>
							)
						})}
					</div> : null
				}
			</div>
		</div></>
	);
}

export default regularuniversity;