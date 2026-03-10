import {useState, useEffect, useContext} from 'react'
import loginContext from '../../contexts/login'
import axios from 'axios'

const regularuniversity = () => {
	const [pass, setPass] = useState('nd')
	const [result, setResult] = useState(null);
	const [name, setName] = useState(null);
	const [open, setOpen] = useState(false);
	const [content, setContent] = useState('');
	const {exams, type} = useContext(loginContext);
	const [gpa, setGpa] = useState(0);
	
	useEffect(() => {
		console.log(exams[0])
		if (exams[0]) {
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
				margin: 60px 0 75px;
				text-align: left;
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
			.smalltitle {
				margin: 0 auto 25px;
				text-align: center;
				-webkit-text-stroke: 1px;
			}
			.table {
				display: table;
				width: 100%;
				text-align:center;
				vertical-align:middle;
				margin-bottom: 25px;
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
				height: 70px;
				line-height: 70px;
				display: table-cell;
			}
			.table > * > div:first-child {
				width: 110px;
				background-color: #ececec;
			}
			.label {
				width: 620px;
				height: 40px;
				display: flex;
				align-items:center;
				justify-content:space-between;
				margin: 0 auto 25px;
				padding: 0 50px 0;
				box-sizing: border-box;
				border: 1px solid #707070;
			}
			.bigbtn {
				width: 300px;
				height: 40px;
				margin: 0 auto;
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
		`}</style>
		<div className="page">
			<div style={{width:'1280px',margin:'0 auto'}}>
				<div className="title">
					대학/학과별 검색
				</div>
				<div className="btns">
					<div>대학별 검색</div>
					<div>학과별 검색</div>
				</div>
				<div className="smalltitle">{ name ? `${name[0]}학교 ${name[1]}` : null}</div>
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
				<div className="table">
					<div className="header">
						<div />
						<div>2018년</div>
						<div>2019년</div>
						<div>2020년</div>
					</div>
					<div>
						<div>컷라인</div>
						{result ?
						result.years.map( e => <div>{Math.round(e*100)/100}</div>) : null}
					</div>
					<div>
						<div>내점수와 차이</div>
						{result ?
						result.years.map(e => <div>{Math.round((result.point-e)*100)/100}</div>) : null}
					</div>
				</div>
				<div className="label">
					<p>예측컷/내점수</p>
					<p>{result ? Math.round(result.point-result.v)+'/'+Math.round(result.point) : null}</p>
				</div>
				<div className="label">
					<p>예측컷과의 차이</p>
					<p>{result ? Math.round(result.v) : null}</p>
				</div>
				<div className="bigbtn reject">
					불합격 예상
				</div>
			</div>
		</div></>
	);
}

export default regularuniversity;