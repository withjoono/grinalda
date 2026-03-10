import Menu from '../../comp/susimenu'
import Form from '../gpa/formform'
import {useState, useEffect} from 'react'
import axios from 'axios'
import withDesktop from '../../comp/withdesktop'
import page from '../desktop/earlyinput'
import InputPage from '../early/inputForm'
import { Link } from '@material-ui/core'
import {getData} from '../../comp/data'

const EarlyInput = () => {

	const [data,setData] = useState([])
	const [chosen, setChosen] = useState([])
	const [grade, setGrade] = useState(0)
	const [sem,setSem] = useState(0)
	const [page,setPage] = useState(0)
	const [codeData13, setcodeData13] = useState([])
	const [codeData14, setcodeData14] = useState([])
	useEffect(() => {
		if (!localStorage.getItem('uid')) return;
		getData('/api/codes/[groupName]', setcodeData13, {groupName : 'curriculum_Code'}, localStorage.getItem('realuid'));		
		getData('/api/codes/[groupName]', setcodeData14, {groupName : 'subject_Code'}, localStorage.getItem('realuid'));
		getData(`/api/gpa/Savegpa`, processData, {}, localStorage.getItem('uid'))
	}, [])
	const processData = (d) => {
		setData(d);
	}
	const addData = () => {
		chosen.push(['','','','','','','','',''])
		setChosen([...chosen])
	}
	const chooseData = () => {
		const rows = data.filter(row => row.grade == grade+1 && row.semester == sem+1).map(row => 
			{const converted = Object.keys(row).reduce((acc,key)=>{acc[key] = row[key]== null ? '' : row[key]; return acc},{})
				const {subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, id,aper,bper,cper} = converted;
			return [subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, id,aper,bper,cper]});
		console.log(rows)
			rows.push(['','','','','','','','','','','',''])
		return rows;
	}
	const changeData = (index,i,e) => {
		setChosen(p => {p[index][i] = e.target.value; return [...p]})
	}
	
	const changeGrade = e => {
		setGrade(e.target.value);
	}
	if ((!page==1))
	{
	return (<div className='page' style={{width:'90%',margin:'0 auto'}}>
			<style jsx>{`
					.notice{
						width:400px;
						height:186px;
						margin 10px auto;
						border:1px #9D9D9D solid;
						border-radius:8px;
						margin-top:24px;
						background-color:#F5F5F5;
						font-size:12px;
						line-height:20px;
					

					}
					.notice .color{
						
						color:#DE6B3D;
					}
					.class{
						width:110px;
						height:80px;
						line-height:100px;
						box-shadow:0px 3px 6px rgba(00,00,00,16%);
						text-align:center;
						font-size:15px;
						font-weight:11px;
					}
					.buttonOn{
						width:110px;
						height:80px;
						background-color:#DE6B3D;
						color:#ffffff;
						font-weight:11px;
						text-align:center;
						font-size:15px;
						line-height:100px;
					}
					.class2{
						width:172px;
						height:40px;
						box-shadow:0px 3px 6px rgba(00,00,00,16%);
						text-align:center;
						font-size:15px;
						font-weight:10px;
						line-height:40px;
					}
					.btn2{
						width:172px;
						height:40px;
						box-shadow:0px 3px 6px rgba(00,00,00,16%);
						text-align:center;
						font-size:15px;
						font-weight:10px;
						background-color:#DE6B3D;
						color:#ffffff;
						line-height:40px;
					}
				
				
			`}</style>
			<div style={{height:'40px',width:'100%'}}/>
			<div style={{lineHeight:'30px',fontSize:'22px',marginBottom:'12px',fontWeight:'bold'}}>
			<span style={{color:'#DE6B3D'}}>{localStorage.getItem('name')}</span>님의<br/>
			내신 정보를 선택해 주세요.
			</div>
				<div style={{display:'flex', margin:'12px -10px 12px 0'}}>
				<div className={grade==0 ? 'buttonOn' : 'class'} style={{flex:'1 0 0',marginRight:'10px'}}
				onClick={()=>setGrade(0)}>
				1학년
				</div>
				<div className={grade==1 ? 'buttonOn' : 'class'} style={{flex:'1 0 0',marginRight:'10px'}}
					onClick={()=>setGrade(1)}>
				2학년
				</div>
				<div className={grade==2 ? 'buttonOn' : 'class'} style={{flex:'1 0 0',marginRight:'10px'}}
				onClick={()=>setGrade(2)}>
				3학년
				</div>
			</div>
			<div style={{display:'flex',marginRight:'-10px',marginBottom:'20px'}}>
				<div className={sem==0 ? 'btn2' : 'class2'} style={{flex:'1 0 0',marginRight:'10px'}}
				onClick={()=>setSem(0)}>
				1학기
				</div>
				<div className={sem==1 ? 'btn2' : 'class2'} style={{flex:'1 0 0',marginRight:'10px'}}
				onClick={()=>setSem(1)}>
				2학기
				</div>
			</div>
		
			<div className='orangebigbtn' onClick={()=>{setChosen(chooseData()); setPage(1)}}>
			입력하기
			</div>
		
			<div className='notice'>
				<span className='color'>엑셀 파일로 내신 성적 입력을 원하시는 분은</span><span>웹으로 접속하</span>
				<div>여 이용해주세요.</div>
				<br></br>
				<span className='color'>교과 전형과 논술 전형</span><span>은 단순 내신 평균을 이용하지만 (대학</span>
				<div>마다 학년/과목별 반영 비율 상이)학생부 종합 전형은 내신</div>
				<div>등급에 편차를 고려합니다</div>
				<br></br>
				<span>쉬운 과목만 골라서 들어서 내신이 좋은것인지,아니면 출신</span>
				<div>고교가 내신을 올리기 쉬운 학교인지를 편차를 보고 판단합니다</div>
			
			</div>
			
	
		</div>
	)
	}
	else return (
	
			<div className='page' style={{width:'90%',margin:'0 auto'}}>
			<InputPage grade={grade+1} semester={sem+1} data={chosen} setData={changeData}
			addData={addData} submit={()=>{}} subjectArea={codeData13} subjectCode={codeData14}/>
		</div>
	)
}

export default withDesktop(page,EarlyInput)