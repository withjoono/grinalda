import {useState, useEffect, useContext} from 'react'
import loginContext from '../../contexts/login'
import axios from 'axios'

const getData = (api_url, setData, params) => {
        const get_ = async () => {
            const response = await axios.get(api_url, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth': `${localStorage.getItem('uid')}`
                },
                params: params
            });

            return response.data.data
        };

        const set_ = async () => {
            const result = await get_();
            setData(result)
        }

        return set_()
    }

const Card = ({className, onClick, edit, group, univ, chosen, setChosen}) => {
	const [dep, setDep] = useState({})
	const [dep1, setDep1] = useState({})
	const [dep2, setDep2] = useState({})
	const [list, setList] = useState([])
	const [list1, setList1] = useState([])
	const [list2, setList2] = useState([])
	
	useEffect(() => {
		chosen.map(e => {
			if (e.rank == 1) setDep(e)
			else if (e.rank == 2) setDep1(e)
			else if (e.rank == 3) setDep2(e)
		})
	},[chosen])
	
	useEffect(() => {
		if (!dep.universityId) return;
		getData(`/api/universities/departments/${dep.universityId}`, setList, {groupCode: 10})
	},[dep])
	useEffect(() => {
		if (!dep1.universityId) return;
		getData(`/api/universities/departments/${dep1.universityId}`, setList1, {groupCode: 20})
	},[dep1])
	useEffect(() => {
		if (!dep2.universityId) return;
		getData(`/api/universities/departments/${dep2.universityId}`, setList2, {groupCode: 30})
	},[dep2])
	
	const rara = (a, b, c, d, r) => {
		return (<>
			<select defaultValue={a.universityId || ''} onChange={ee =>{
				setChosen(prev => {
					if (Object.keys(a).length == 0) return [...chosen, {rank: r, groupCode: t, universityId: ee.target.value}]
					return prev.map((e,i) => {
					if (e.rank == r && parseInt(e.groupCode) == t) {
						prev[i] = {...prev[i],universityId:ee.target.value}
						return prev[i];
					} else return prev[i];
				})})
			}
			}>
				<option value="" disabled>대학 선택</option>
				{
					univ.map((e,i) => <option key={i} value={e.universityId}>{e.universityName}</option>)
				}
			</select>
			<select defaultValue={a.departmentId || ''} onChange={
				ee => {
					setChosen(prev => prev.map((e,i) => {
					if (e.rank == r && parseInt(e.groupCode) == t) {
						prev[i] = {...prev[i],departmentId:ee.target.value}
						return prev[i];
					} else return prev[i];
				}))
				}
			}>
				<option value="" disabled>과 선택</option>
				{
					c.map((e,i) => <option key={i} value={e.departmentId}>{e.departmentName}</option>)
				}
			</select></>
		)
	}
	
	return (
		<>
			<style jsx>{`
				.card {
					padding: 47px 40px 42px;
					border-radius: 20px;
					background-color: white;
					width: 480px;
					min-height: 602px;
					box-shadow: 25px 50px 6px 0px rgba(0,0,0,0.1);
					box-sizing: border-box;
					position: absolute;
					transition: transform 0.5s;
				}
				.head {
					-webkit-text-stroke: 1px;
					font-size: 24px;
					margin-bottom: 10px;
				}
				.contain {
					display: flex;
					flex-direction: column;
				}
				.contain > div {
					display: flex;
					padding: 0 35px;
					justify-content: space-between;
					margin-bottom: 24px;
				}
				.d {
					flex-basis: 145px;
					flex-shrink: 0;
					height: 145px;
					border-radius: 100px;
					background-color:#ececec;
				}
				.centered {
					display: flex;
					justify-content: center;
					align-items:center;
				}
				.a {
					width: 64px;
					height: 30px;
					color: #fede01;
					border: 1px solid #fede01;
					border-radius: 15px;
				}
				.b {
					padding: 20px 0;
				}
				.c {
					width: 145px;
					height: 40px;
					background-color: #fede01;
					border-radius: 20px;
					box-shadow: 0px 3px 0.5px 0px rgba(0,0,0,0.1);
				}
				.snap {
					scroll-snap-align: center;
					position: relative !important;
					width: 320px;
					margin-left: 10px;
				}
				.left {
					transform: scale(0.9) translateX(-50%);
				}
				.leftleft {
					transform: scale(0.8) translateX(-100%);
					z-index: -1;
				}
				.right {
					transform: scale(0.9) translateX(50%);
				}
				.rightright {
					transform: scale(0.8) translateX(100%);
					z-index: -1;
				}
				.focus {
					transform: 0;
					z-index: 1;
				}
			`}</style>
			<div className={`card ${className}`} onClick={onClick}>
				
				{edit ? <><div className="head">
					{group}군
				</div>
				<div className="contain">
					<div>
						{className != 'snap'  ? <div className="d"/> : null
						}
						<div>
							<div className="a centered">1순위</div>
							<div className="b">
							{rara(dep,setDep,list,setList, 1)}
							</div>
							<div className="c centered">리포트 보기</div>
						</div>
					</div>
					<div>
						{className != 'snap'  ? <div className="d"/> : null
						}
						<div>
							<div className="a centered">2순위</div>
							<div className="b">
								{rara(dep1,setDep1,list1,setList1, 2)}
							</div>
							<div className="c centered">리포트 보기</div>
						</div>
					</div>
					<div>
						{className != 'snap'  ? <div className="d"/> : null
						}
						<div>
							<div className="a centered">3순위</div>
							<div className="b">{rara(dep2,setDep2,list2,setList2, 3)}</div>
							<div className="c centered">리포트 보기</div>
						</div>
					</div>
				</div></> : <>
				<div className="head">
				{group}군
				</div>
				<div className="contain">
					<div>
						{className != 'snap'  ? <div className="d"/> : null
						}
						<div>
							<div className="a centered">1순위</div>
							<div className="b"><span style={{'-webkit-text-stroke':'1px'}}>{dep ? dep.universityName : ''}</span>{dep ? dep.departmentName : ''}</div>
							<div className="c centered">리포트 보기</div>
						</div>
					</div>
					<div>
						{className != 'snap'  ? <div className="d"/> : null
						}
						<div>
							<div className="a centered">2순위</div>
							<div className="b"><span style={{'-webkit-text-stroke':'1px'}}>{dep1 ? dep1.universityName : ''}</span>{dep1 ? dep1.departmentName : ''}</div>
							<div className="c centered">리포트 보기</div>
						</div>
					</div>
					<div>
						{className != 'snap'  ? <div className="d"/> : null
						}
						<div>
							<div className="a centered">3순위</div>
							<div className="b"><span style={{'-webkit-text-stroke':'1px'}}>{dep2 ? dep2.universityName : ''}</span>{dep2 ? dep2.departmentName : ''}</div>
							<div className="c centered">리포트 보기</div>
						</div>
					</div>
				</div></>}
			</div>
		</>
	)
}

const mockup = () => {
	
	const [a, setA] = useState(0)
	const [q, qq] = useState(1)
	const [classes, setClasses] = useState(['left trans','focus trans','right trans'])
	const [univ1, setUniv1] = useState([]);
	const [univ2, setUniv2] = useState([]);
	const [univ3, setUniv3] = useState([]);
	const {exams, type} = useContext(loginContext);
	const [raw, setRaw] = useState([])
	const [dep, setDep] = useState([])
	const [dep1, setDep1] = useState([])
	const [dep2, setDep2] = useState([])
	const [edit, setEdit] = useState(false)
	
	useEffect(() => {
		getData('/api/universities', setUniv1, {groupCode: 10});
		getData('/api/universities', setUniv2, {groupCode: 20});
		getData('/api/universities', setUniv3, {groupCode: 30});
		if (!exams[0] || type && type > 0) {
			getData('/api/exams', exams[1], {type: 0});
			type[1](0);
		}
	},[])
	
	useEffect(() => {
		getData(`/api/mockup`,setRaw)
	},[])
	
	useEffect(() => {
		if (raw.length > 0) {
			let a = []
			let b = []
			let c = []
			raw.map(e => {
				if (e.groupCode == '10') a.push(e);
				else if (e.groupCode == '20') b.push(e);
				else if (e.groupCode == '30') c.push(e);
			})
			setDep(a)
			setDep1(b)
			setDep2(c)
		}
	},[raw])
	
	const ff = [<Card className={classes[0]} onClick={()=>{qq(0)}} edit={edit} univ={univ1} chosen={dep} setChosen={setDep} group="가"/>,
				<Card className={classes[1]} onClick={()=>{qq(1)}} edit={edit} univ={univ2} chosen={dep1} setChosen={setDep1} group="나"/>,
				<Card className={classes[2]} onClick={()=>{qq(2)}} edit={edit} univ={univ3} chosen={dep2} setChosen={setDep2} group="다"/>]
				
	useEffect(() => {
		if (q == 0) {
			setClasses(['focus trans','right trans','rightright trans'])
		} else if (q == 1) {
			setClasses(['left trans','focus trans','right trans'])
		} else {
			setClasses(['leftleft trans', 'left trans', 'focus trans'])
		}
	},[q])
	
	const handleSubmit = () => {
		let ans = [].concat(dep,dep1,dep2);
		setRaw(ans)
		axios.post('/api/mockup',{data: ans}, {headers:{'Content-Type': 'application/json','auth': `${localStorage.getItem('uid')}`}})
	}
	
	return (
		<div className="page">
			<style jsx>{`
				.bigtitle {
					width: 1280px;
					margin: 37px auto 0;
					font-size: 30px;
					-webkit-text-stroke: 1px;
				}
				.smalltitle {
					width: 1280px;
					margin: 14px auto 73px;
				}
				.purple {
					width: 100%;
					height: 75vh;
					background-color:#2c2b57;
					padding-top: 80px;
				}
				.semipurple {
					width: 100%;
					height: 40vh;
					background-color:#2c2b57;
					padding-top: 40px;
					display: flex;
					flex-direction: column;
					align-items: center;
					position:relative;
					z-index: 0;
				}
				.btn {
					background-color:#fede01;
					width:300px;
					height:40px;
					border-radius:20px;
					display:flex;
					justify-content:center;
					align-items:center;
					margin: 0 auto;
				}
				.hbtn {
					border:1px solid #fede01;
					width:300px;
					height:40px;
					border-radius:20px;
					display:flex;
					justify-content:center;
					align-items:center;
					margin: 17% auto 0;
				}
				.veil {
					display: flex;
					position: absolute;
					justify-content:center;
				}
				.result {
					display: flex;
					flex-direction: column;
					width: fit-content;
					margin: 0 auto;
					align-items: center;
				}
				.result > *:first-child {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 33px;
				}
				.result > *:last-child {
					margin-top: 28px;
					width: 654px;
					border-bottom-left-radius: 20px;
					border-bottom-right-radius: 20px;
					border: 1px solid #fede01;
					border-top: 10px solid #fede01;
					background-color: white;
					padding: 4px 80px 12px;
					
				}
				.q {
					display: table;
					width: 100%;
					text-align: center;
				}
				.q > div {
					display: table-row;
				}
				.q > div:first-child {
					-webkit-text-stroke:1px;
				}
				.q > div > div {
					display: table-cell;
					padding: 33px 0;
				}
				.a {
					width: 145px;
					height: 145px;
					background-color:#ececec;
					border-radius: 100px;
					margin-right: 30px;
				}
				.s {
					background-color: white;
					width: 620px;
					height: 40px;
					padding: 0 80px;
					border-radius: 10px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 12px;
				}
			`}</style>
			<div className="bigtitle">모의지원</div>
			<div className="smalltitle">{localStorage.getItem('uid')}님의 모의지원 현황이 없습니다</div>
			{a == 0 ?
				<div className="purple">
					<div className="btn" onClick={()=>{setA(1)}}>모의지원 입력하기</div>
				</div> : a == 1 ? <>
				<div className="semipurple">
				<div className="veil">
				{ff.map(e => e)}
				</div>
				</div>
				<div className="hbtn" onClick={()=>{if (edit==true) handleSubmit(); setEdit(!edit)}}>{!edit ? '모의지원 수정하기' : '모의지원 입력하기'}</div>
				</>
				:
				<div className="purple" style={{'paddingTop':'68px'}}>
					<div className="result">
					<div>
						<div className="a" />
						<div style={{color:'white'}}>
						<span style={{'-webkit-text-stroke':'1px'}}>건국대학교</span> 수학과</div>
					</div>
					<div className="s">
						<p>예측컷</p><p>300</p>
					</div>
					<div className="s">
						<p>예측컷</p><p>300</p>
					</div>
					<div className="s">
						<p>예측컷</p><p>300</p>
					</div>
					<div className="s">
						<p>예측컷</p><p>300</p>
					</div>
					<div>
						<div className="q">
							<div>
								<div>모집 인원</div>
								<div>지원자 수</div>
								<div>나의 점수</div>
							</div>
							<div>
								<div>100</div>
								<div>333</div>
								<div>6등</div>
							</div>
						</div>
					</div>
					</div>
				</div>
			}
		</div>
	);
}

export default mockup;
export {Card};