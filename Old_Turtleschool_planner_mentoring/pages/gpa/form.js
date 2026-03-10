import s from './form.module.css'
import {useState, useEffect} from 'react'

const grade = ({type, desktop, info, setInfo, count, setCount}) => {
	const [en, setEn] = useState({subjectArea:'영어'})
	const [kr, setKr] = useState({subjectArea:'국어'})
	const [ma, setMa] = useState({subjectArea:'수학'})
	const [sc, setSc] = useState({subjectArea:'과학'})
	const [so, setSo] = useState({subjectArea:'사회'})
	const [others, setOthers] = useState([]);
	
	useEffect(() => {
		let apply = [false,false,false,false,false]
		setKr({subjectArea:'국어'})
		setEn({subjectArea:'영어'})
		setMa({subjectArea:'수학'})
		setSc({subjectArea:'과학'})
		setSo({subjectArea:'사회'})
		setOthers([])
		info.map(e => {
			if (e.subjectArea == '국어') {if (apply[0]) {setOthers(p => {p.push(e); return p})} else {apply[0] = true; setKr(e);}}
			else if (e.subjectArea == '영어') {if (apply[1]) {setOthers(p => {p.push(e); return p})} else {apply[1] = true; setEn(e);}}
			else if (e.subjectArea == '수학') {if (apply[2]) {setOthers(p => {p.push(e); return p})} else {apply[2] = true; setMa(e);}}
			else if (e.subjectArea == '사회') {if (apply[3]) {setOthers(p => {p.push(e); return p})} else {apply[3] = true; setSo(e);}}
			else if (e.subjectArea == '과학') {if (apply[4]) {setOthers(p => {p.push(e); return p})} else {apply[4] = true; setSc(e);}}
			else setOthers(p => {p.push(e); return p});
		})
	}, [info]);
	
	useEffect(()=>{
		console.log(type,kr);
	},[kr])
	
	const handleSubmit = () => {
		const a = [en,kr,ma,sc,so]
		let b = []
		a.map(e=> {if (e.unitNumber || e.achieve || e.rank) b.push(e)});
		setInfo([...b, ...others]);
		setCount(count+1);
	}
	
	if (desktop) {
		return (<>
		<div style={{textAlign:'center'}}>{type[1]}학기</div>
		<div className={s.card} style={{borderRadius:'0px',boxShadow:'0px 0px'}}>
		<div className={s.contents}>
			<div style={{margin:'45px 0 30px'}}>
				<div className={s.subjecttitle}>
					교과
				</div>
				<div className={s.inputtitle}>
					세부과목
				</div>
				<div className={s.inputtitle}>
					단위수
				</div>
				<div className={s.inputtitle}>
					성취도
				</div>
				<div className={s.inputtitle}>
					등급
				</div>
			</div>
			<div>
				<div className={s.subject}>
					국어
				</div>
				<input className={s.input} value={kr.subjectName || ''} placeholder="입력" onChange={e => setKr({...kr, subjectName : e.target.value}) } />
				<input className={s.input} value={kr.unitNumber || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,unitNumber: e.target.value})}}/>
				<input className={s.input} value={kr.achieve || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,achieve: e.target.value})}}/>
				<input className={s.input} value={kr.rank || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					수학 ▼
				</div>
				<input className={s.input} value={ma.subjectName || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,subjectName: e.target.value})}}/>
				<input className={s.input} value={ma.unitNumber || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,unitNumber: e.target.value})}}/>
				<input className={s.input} value={ma.achieve || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,achieve: e.target.value})}}/>
				<input className={s.input} value={ma.rank || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					영어 ▼
				</div>
				<input className={s.input} value={en.subjectName || ''} placeholder="입력" onChange={(e)=>{setEn({...en,subjectName: e.target.value})}}/>
				<input className={s.input} value={en.unitNumber || ''} placeholder="입력" onChange={(e)=>{setEn({...en,unitNumber: e.target.value})}}/>
				<input className={s.input} value={en.achieve || ''} placeholder="입력" onChange={(e)=>{setEn({...en,achieve: e.target.value})}}/>
				<input className={s.input} value={en.rank || ''} placeholder="입력" onChange={(e)=>{setEn({...en,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					사회 ▼
				</div>
				<input className={s.input} value={so.subjectName || ''} placeholder="입력" onChange={(e)=>{setSo({...so,subjectName: e.target.value})}}/>
				<input className={s.input} value={so.unitNumber || ''} placeholder="입력" onChange={(e)=>{setSo({...so,unitNumber: e.target.value})}}/>
				<input className={s.input} value={so.achieve || ''} placeholder="입력" onChange={(e)=>{setSo({...so,achieve: e.target.value})}}/>
				<input className={s.input} value={so.rank || ''} placeholder="입력" onChange={(e)=>{setSo({...so,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					과학 ▼
				</div>
				<input className={s.input} value={sc.subjectName || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,subjectName: e.target.value})}}/>
				<input className={s.input} value={sc.unitNumber || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,unitNumber: e.target.value})}}/>
				<input className={s.input} value={sc.achieve || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,achieve: e.target.value})}}/>
				<input className={s.input} value={sc.rank || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,rank: e.target.value})}}/>
			</div>
			{
				others.map((e,i) => {
					return (
						<div>
							<input className={s.input} value={e.subjectArea ||''} placeholder="입력" onChange={(e)=>{others[i].subjectArea = e.target.value;}}/>
							<input className={s.input} value={e.subjectName || ''} placeholder="입력" onChange={(e)=>{others[i].subjectName = e.target.value}}/>
							<input className={s.input} value={e.unitNumber || ''} placeholder="입력" onChange={(e)=>{others[i].unitNumber = e.target.value}}/>
							<input className={s.input} value={e.achieve || ''} placeholder="입력" onChange={(e)=>{others[i].achieve = e.target.value}}/>
							<input className={s.input} value={e.rank || ''} placeholder="입력" onChange={(e)=>{others[i].rank = e.target.value}}/>
						</div>
					)
				})
			}
			<div>
				<div className={s.subject} style={{fontSize:'30px', lineHeight:'40px'}} onClick={() => {setOthers([...others, {}])}}>
					+
				</div>
			</div>
		</div>
		<div className={s.button} style={{borderRadius:'0px', fontWeight:'normal'}} onClick={handleSubmit}>수정하기</div>
	</div></>
	)
	} else {
	return (
	<div className={s.card}>
		<div className={s.title}>{type[0]}학년 {type[1]}학기</div>
		<div className={s.contents}>
			<div>
				<div className={s.subjecttitle}>
					교과
				</div>
				<div className={s.inputtitle}>
					과목
				</div>
				<div className={s.inputtitle}>
					단위수
				</div>
				<div className={s.inputtitle}>
					성취도
				</div>
				<div className={s.inputtitle}>
					등급
				</div>
			</div>
			<div>
				<div className={s.subject}>
					국어
				</div>
				<input className={s.input} value={kr.subjectName || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,subjectName: e.target.value})}}/>
				<input className={s.input} value={kr.unitNumber || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,unitNumber: e.target.value})}}/>
				<input className={s.input} value={kr.achieve || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,achieve: e.target.value})}}/>
				<input className={s.input} value={kr.rank || ''} placeholder="입력" onChange={(e)=>{setKr({...kr,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					수학 ▼
				</div>
				<input className={s.input} value={ma.subjectName || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,subjectName: e.target.value})}}/>
				<input className={s.input} value={ma.unitNumber || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,unitNumber: e.target.value})}}/>
				<input className={s.input} value={ma.achieve || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,achieve: e.target.value})}}/>
				<input className={s.input} value={ma.rank || ''} placeholder="입력" onChange={(e)=>{setMa({...ma,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					영어 ▼
				</div>
				<input className={s.input} value={en.subjectName || ''} placeholder="입력" onChange={(e)=>{setEn({...en,subjectName: e.target.value})}}/>
				<input className={s.input} value={en.unitNumber || ''} placeholder="입력" onChange={(e)=>{setEn({...en,unitNumber: e.target.value})}}/>
				<input className={s.input} value={en.achieve || ''} placeholder="입력" onChange={(e)=>{setEn({...en,achieve: e.target.value})}}/>
				<input className={s.input} value={en.rank || ''} placeholder="입력" onChange={(e)=>{setEn({...en,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					사회 ▼
				</div>
				<input className={s.input} value={so.subjectName || ''} placeholder="입력" onChange={(e)=>{setSo({...so,subjectName: e.target.value})}}/>
				<input className={s.input} value={so.unitNumber || ''} placeholder="입력" onChange={(e)=>{setSo({...so,unitNumber: e.target.value})}}/>
				<input className={s.input} value={so.achieve || ''} placeholder="입력" onChange={(e)=>{setSo({...so,achieve: e.target.value})}}/>
				<input className={s.input} value={so.rank || ''} placeholder="입력" onChange={(e)=>{setSo({...so,rank: e.target.value})}}/>
			</div>
			<div>
				<div className={s.subject}>
					과학 ▼
				</div>
				<input className={s.input} value={sc.subjectName || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,subjectName: e.target.value})}}/>
				<input className={s.input} value={sc.unitNumber || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,unitNumber: e.target.value})}}/>
				<input className={s.input} value={sc.achieve || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,achieve: e.target.value})}}/>
				<input className={s.input} value={sc.rank || ''} placeholder="입력" onChange={(e)=>{setSc({...sc,rank: e.target.value})}}/>
			</div>
			{
				others.map((e,i) => {
					return (
						<div>
							<input className={s.input} value={e.subjectArea || ''} placeholder="입력" onChange={(e)=>{others[i].subjectArea = e.target.value}}/>
							<input className={s.input} value={e.subjectName || ''} placeholder="입력" onChange={(e)=>{others[i].subjectName = e.target.value}}/>
							<input className={s.input} value={e.unitNumber || ''} placeholder="입력" onChange={(e)=>{others[i].unitNumber = e.target.value}}/>
							<input className={s.input} value={e.achieve || ''} placeholder="입력" onChange={(e)=>{others[i].achieve = e.target.value}}/>
							<input className={s.input} value={e.rank || ''} placeholder="입력" onChange={(e)=>{others[i].rank = e.target.value}}/>
						</div>
					)
				})
			}
			<div>
				<div className={s.subject} style={{fontSize:'30px', lineHeight:'40px'}} onClick={() => {setOthers([...others, {}])}}>
					+
				</div>
			</div>
		</div>
		<div className={s.button} style={{color:'#000000 !important'}} onClick={handleSubmit}>수정하기</div>
	</div>
	);}
}

export default grade;