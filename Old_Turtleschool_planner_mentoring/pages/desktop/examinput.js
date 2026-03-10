import OMR from '../../comp/omr'
import {useState} from 'react'

const examinput = () => {
	
	const [examtype, setExamtype] = useState([])
	const [grade, setGrade] = useState(0);
	const [year, setYear] = useState(0);
	const [type, setType] = useState(null);
	
	const btn = {
		width:'180px',
		height:'40px',
		display:'flex',
		border:'2px solid #fede01',
		marginBottom:'-2px',
		alignItems:'center',
		justifyContent:'center',
		marginRight:'5px'
	}
	
	const handleGrade = (e) => {
		const {value} = e.target;
		setGrade(value)
		setExamtype(examcode.filter(e => e.grade == parseInt(value) && e.year == year).sort((a,b)=>a.id-b.id))
	}
	const handleYear = (e) => {
		const {value} = e.target;
		setYear(value)
		setExamtype(examcode.filter(e => e.grade == grade && e.year == parseInt(value)).sort((a,b)=>a.id-b.id))
	}
	
	return (
		<div className="page">
		<style jsx>{`
			.bigbtn { 
				margin: 50px auto 150px;
				width: 300px;
				height: 40px;
				display: flex;
				align-items:center;
				justify-content:center;
				border-radius: 20px;
				background-color:#fede01;
				color: white;
				-webkit-text-stroke: 1px;
			}
			.active {
				background-color:#fede01 !important;
				color:white !important;
			}
		`}</style>
			<div style={{width:'1280px', margin: '0 auto'}}>
				<div style={{fontSize:'30px',marginTop:'42px'}}>
					성적 입력
				</div>
				<div style={{margin:'14px 0 34px'}}>
					최지웅님의 모의고사 성적을 입력해 주세요
				</div>
				<div style={{display:'flex',borderBottom:'1px solid #fede01',marginBottom:'26px'}}>
				<div style={btn}>OMR 카드로 입력하기</div>
				<div style={btn} className="active">점수로 입력하기</div>
				</div>
				<div style={{display:'flex', justifyContent:'center'}}>
				<div style={{...btn, marginRight:'40px'}}>학년 선택</div>
				<div style={{...btn, marginRight:'40px'}}>모의고사 선택</div>
				<div style={btn}>과목 선택</div>
				</div>
				<div style={{display:'flex',marginTop:'50px'}}>
				<div style={{width:'50%'}}><OMR /></div>
				<div style={{width:'50%'}}><OMR /></div>
				</div>
				<div className="bigbtn">완료하기</div>
			</div>
		</div>
	);
}

export default examinput;