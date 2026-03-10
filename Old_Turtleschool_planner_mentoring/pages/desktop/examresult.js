import {useState, useEffect, useContext} from 'react'
import loginContext from '../../contexts/login'
import axios from 'axios'

const regularuniversity = () => {
	const [pass, setPass] = useState('nd')
	const [result, setResult] = useState(null);
	const [name, setName] = useState(null);
	const [open, setOpen] = useState(false);
	const {exams, type} = useContext(loginContext);
	const [gpa, setGpa] = useState(0);
	const [extra, setExtra] = useState(null);
	const [names, setNames] = useState(null);
	
	useEffect(() => {
		console.log(exams[0])
		if (exams[0]) {
			if (sessionStorage.getItem('multi')) {
				const {id, name} = JSON.parse(sessionStorage.getItem('multi'))
				setName([name,''])
				getUniScores(id, name)
				
				return;
			}
			const info = JSON.parse(sessionStorage.getItem('info'));
			const temp = JSON.parse(sessionStorage.getItem('temp'));
			setName([temp.name, temp.major, info.maxscore]);
			setGpa(info.gpa);
			let params = {}
			params.name1 = info.name1;
			params.name2 = info.name2;
			params.bb = info.bb;
			const conv = {
				60:7,
				70:8,
				71:9,
				80:10,
				50:11,
				20:12,
				24:13,
				22:14,
				26:15,
				23:16,
				27:17,
				21:18,
				25:19,
				17:20,
				15:21,
				19:22,
				11:23,
				16:24,
				14:25,
				12:26,
				18:27,
				13:28,
				91:29,
				96:30,
				98:31,
				93:32,
				97:33,
				95:34,
				94:35,
				92:36,
				99:37
			};
			exams[0].map((e) => {
				if (e.subjectCode != 80 && e.subjectCode != 50)params['aa'+conv[e.subjectCode]] = e.standardScore;
				else params['aa'+conv[e.subjectCode]] = e.grade;
				})
			const g = async () => {
				const res = await axios.get('https://web-api-vplbp.run.goorm.io/api/v1/school',{params}); console.log(res); setResult(res.data)
				}
			g();
		} else {
			f();
		}
	},[exams[0]]);
	
	const handle = async (uni, maj, uname, mname) => {
		let stem = await axios.get(`/api/stem`,{params: {universityId: uni, departmentId: maj}});
		stem = stem.data.r;
		if (stem.lineCode == '10') stem = '문과';
		else if (stem.lineCode == '20') stem = '이과';
		let r = await axios.get(`/api/conv`, {params: {uname: uname, mname: mname}});
		const {name, major, maxscore} = r.data;
		const info = {name1:name, name2: major, bb: stem}
		const conv = {
				60:7,
				61:7,
				62:7,
				70:8,
				71:9,
				73:8,
				74:9,
				75:8,
				80:10,
				50:11,
				20:12,
				24:13,
				22:14,
				26:15,
				23:16,
				27:17,
				21:18,
				25:19,
				17:20,
				15:21,
				19:22,
				11:23,
				16:24,
				14:25,
				12:26,
				18:27,
				13:28,
				91:29,
				96:30,
				98:31,
				93:32,
				97:33,
				95:34,
				94:35,
				92:36,
				99:37
			};
			exams[0].map((e) => {
				if (e.subjectCode != 80 && e.subjectCode != 50) info['aa'+conv[e.subjectCode]] = e.standardScore;
				else info['aa'+conv[e.subjectCode]] = e.grade;
				})
			const g = async () => {
				const res = await axios.get('https://web-api-vplbp.run.goorm.io/api/v1/school',{params: info}); console.log(res);
				return res.data;
				}
			return g();
	}
	
	const getUniScores = async (id, name) => {
		const response = await axios.get(`/api/universities/departments/${id}`, {
					headers: {
						'Content-Type': 'application/json',
						'auth': `${localStorage.getItem('uid')}`
					},
				});
		let promises = [];
		let mid = response.data.data[0].departmentId
		let a = response.data.data.map(r => r.departmentName)
		setNames(a);
		response.data.data.map(e => {
			promises.push(handle(id, e.departmentId, name, e.departmentName));
		})
		Promise.all(promises).then(async (res) => {
			setResult(res[0]);
			let {data} = await axios.get(`/api/gpa`,{params: {uid: id, mid: mid}});
			if (data.gpa) setGpa(data.gpa);
			setExtra(res);
			console.log(res);
		})
	}
	
	useEffect(() => {
		if (!!result) {
			if (result.v > 3) setPass('pass')
			else if (result.v < -3) setPass('nonpass')
		}
	},[result]);
	
	const f = async () => {
				const response = await axios.get('/api/exams', {
					headers: {
						'Content-Type': 'application/json',
						'auth': `${localStorage.getItem('uid')}`
					}, params : {
						type: type ? type : 0
					}
				});
				await exams[1](response.data.data);
				return;
			}

	return (<>
		<style jsx>{`
			.title {
				font-size:30px;
				margin: 60px 0 15px;
				text-align: left;
				-webkit-text-stroke:1px;
			}
			.btns {
				display: flex;
				border-bottom: 1px solid #fede01;
				margin-right: -5px;
				margin-bottom: 90px;
				justify-content: center;
			}
			.btns > div {
				margin-right: 5px;
				margin-bottom: -1px;
				border: 1px solid #fede01;
				width: 180px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.smalltitle {
				margin: 0 auto 35px;
				text-align: center;
				border-bottom: 1px solid #fede01;
			}
			.table {
				display: table;
				width: 100%;
				text-align:center;
				vertical-align:middle;
				background-color: white;
			}
			.table > * {
				display: table-row;
			}
			.table > .header {
				height:40px !important;
			}
			.table > .header > * {
				height: 40px !important;
				line-height: 40px !important;
				background-color: #ececec;
			}
			.table > * > div {
				height: 170px;
				line-height: 170px;
				display: table-cell;
			}
			.table > * > div:first-child {
				width: 110px;
				background-color: #ececec;
			}
			.table > *:first-child > div{
				height: 70px;
				line-height: 70px;
			}
			.table > *:last-child > div{
				height: 110px;
				line-height: 110px;
			}
			.bigbtn {
				width: 300px;
				height: 40px;
				margin: 60px auto;
				background-color:#fede01;
				border-radius: 13px;
				color: white;
				-webkit-text-stroke: 1px;
				box-shadow: 0 3px 6px 0 rgba(0,0,0,0.1);
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 18px;
			}
			.reject {
				background-color:#b8b8b8;
			}
			.le {
				display: flex;
				margin-right: -40px;
			}
			.le > div {
				margin-right: 40px;
				flex: 1 0 0;
				min-width: 40%;
			}
			.le > div:last-child {
				display: flex;
				flex-direction: column;
			}
			.le > div:last-child > * {
				flex: 1 0 0;
				margin-bottom: 20px;
			}
			.label {
				border: 1px solid #fede01;
				border-radius: 10px;
				padding: 29px 65px 23px;
				display: table;
				box-sizing: border-box;
				width: 100%;
				background-color:white;
			}
			.label > div {
				display: table-row;
				text-align: center;
			}
			.label > div > div {
				display: table-cell;
				padding-bottom: 20px;
			}
			.label > div > div:first-child {
				text-align: left;
			}
			.label > div > div:last-child {
				text-align: right;
			}
			
			.label > div:first-child > div {
				padding-bottom: 43px;
			}
			.label > div:last-child > div {
				padding: 0;
			}
			.label > p {
				display: inline-block;
			}
			.extra {
				display: table;
				text-align: center;
				width: 100%;
			}
			.extra > div{
				display: table-row;
			}
			.extra > div > * {
				display: table-cell;
				padding: 30px auto;
			}
			.extra > div:first-child > * {
				background-color: #ececec;
				-webkit-text-stroke: 1px;
			}
			.purple {
				background-color:#2c2b57;
				width:100%;
				min-height: 95vh;
			}
		`}</style>
		<div className="page">
			<div style={{width:'1280px',margin:'0 auto'}}>
				<div className="title">
					희망 대학 검색
				</div>
				<div style={{marginBottom:'50px'}}>결과 레포트</div>
			</div>
			<div className="purple">
				<div style={{width:'1280px',margin:'0 auto'}}>
				{ name ? <div style={{color:'white','textAlign':'center',margin:'30px auto 30px',paddingTop:'30px'}}>{name[0]}학교 {name[1]}</div> : null}
				<div className="table">
					<div className="header">
						<div />
						{result ?
							Object.keys(result.scores).map( e =>
							<div>{e}</div>) : null
						}
						{ gpa ?
							<div>내신</div> : null
						}
						<div>전체 총점</div>
					</div>
					<div>
						<div>내점수</div>
						{result ?
							Object.keys(result.scores).map( e =>
							<div>{result.scores[e][0]}</div>) : null
						}
						{ gpa ?
							<div>0</div> : null
						}
						{result ?
							<div>{result.point}</div> : null
						}
					</div>
					<div>
						<div>총점</div>
						{result ?
							Object.keys(result.scores).map( e =>
							<div>{result.scores[e][1]}</div>) : null
						}
						{ gpa ?
							<div>{gpa}</div> : null
						}
						{result ?
							<div>{result.maxscore}</div> : null
						}
					</div>
				</div>
				
				{result && !extra ? <>
				<div className="bigbtn reject">
					불합격 예상
				</div>
				<div className="le">
				
					<div>
						<div className="label">
							<div><div>과거 커트라인</div><div>컷라인</div><div>내점수와 차이</div></div>
							<div><div>2020년</div><div>{Math.round(result.years[2])}</div><div>{Math.round((result.point-result.years[2])*100)/100}</div></div>
							<div><div>2019년</div><div>{Math.round(result.years[1])}</div><div>{Math.round((result.point-result.years[1])*100)/100}</div></div>
							<div><div>2018년</div><div>{Math.round(result.years[0])}</div><div>{Math.round((result.point-result.years[0])*100)/100}</div></div>
						</div>
					</div>
					<div>
						<div className="label">
						<p>예측컷/내점수</p><p style={{float:'right'}}>{Math.round(result.point-result.v)+'/'+Math.round(result.point)}</p>
						</div>
						<div className="label">
							<p>예측컷과의 차이</p>
							<p style={{float:'right'}}>{result ? Math.round(result.v) : null}</p>
						</div>
					</div>
				</div></> : null}
				{extra ?
				<div className="extra">
					<div>
						<p>학과명</p>
						<p>커트라인</p>
						<p>내점수</p>
						<p>차이</p>
						<p>합불예측</p>
						<p>목표대학 지점</p>
					</div>
				{extra.map((result,it) => { 
				return(
					<div>
						<p>{names[it]}</p>
						<p>{Math.round(result.point-result.v)}</p>
						<p>{Math.round(result.point)}</p>
						<p>{Math.round(result.v)}</p>
						<p>{result.v >= 0 ? '합격' : '불합격'}</p>
						<div style={{backgroundColor:'#fede01'}}>지정</div>
					</div>
				)})}</div> : null}
				</div>
			</div>
		</div></>
	);
}

export default regularuniversity;