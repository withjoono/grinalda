import {useState,useEffect} from 'react';
import pool from '../../lib/pool'
import withDesktop from '../../comp/withdesktop'
import desktop from '../desktop/examuniversity'
import axios from 'axios'

const University = (props) => {
	const {area, line, recruit_group,departmentGroup} = props;
	const [type, setType] = useState(0);
	const [data, setData] = useState([])
	const [totalRange, setTotalRange] = useState([0,0]);
	const [chosen, setChosen] = useState('')
	const [univData, setUnivData] = useState([])
	const [areaCode, setAreaCode] = useState('')
	const [lineCode, setLineCode] = useState('')
	const [group,setGroup] = useState('')
	const [searchQuery, setSearchQuery] = useState('')
	const search = () => {
		axios.get('/api/moui',{
			headers:{
				auth: localStorage.getItem('uid')
			},
			params:{
				area:areaCode,
				line:lineCode
			}
		}).then(r => {
			setTotalRange([Math.max(0,Math.max.apply(Math, r.data.data.map(d => d[0]))), Math.min(0,Math.min.apply(Math, r.data.data.map(d => d[1])))])
			setData(r.data.data)
			})
	}
	
	const searchTwo = () => {
		axios.get('/api/moui/department',{
			headers:{
				auth: localStorage.getItem('uid')
			},
			params:{
				area:areaCode,
				line:lineCode,
				query:searchQuery,
				group:group
				
			}
		}).then(r => {
			setTotalRange([Math.max(0,Math.max.apply(Math, r.data.data.map(d => d[3]-d[4]))), Math.min(0,Math.min.apply(Math, r.data.data.map(d => d[3]-d[4])))])
			setData(r.data.data)
			})
	}
	
	const click = (e) => {
		setChosen(e.target.value)
		axios.get('/api/moui/university',{
			headers:{
				auth: localStorage.getItem('uid')
			},
			params:{
				univ:e.target.value
			}
		}).then(r => {
			setUnivData(r.data.data)
			})
	}
	
	const getRange = (min,max) => {
		const a = (min - totalRange[1]) / (totalRange[0] - totalRange[1]) * 100
		const b = (totalRange[0] - max) / (totalRange[0] - totalRange[1]) * 100
		return (<>
			<style jsx>{`
				div {
				background: transparent linear-gradient(180deg, #D8DC6A 0%, #FD8492 100%) 0% 0% no-repeat padding-box;
				border-radius: 5px;
				opacity: 1;
				height: calc( 100% - 10px );
				width: calc(100% - ${b}% - ${a}%);
				margin: 5px ${b}% 5px ${a}%;
				}
			`}</style>
			<div />
		</>)
	}
	const getRangeTwo = (value) => {
		const a = (value - totalRange[1]) / (totalRange[0] - totalRange[1]) * 100
		return (<>
			<style jsx>{`
				div {
				background: transparent linear-gradient(180deg, #D8DC6A 0%, #FD8492 100%) 0% 0% no-repeat padding-box;
				border-radius: 10px;
				opacity: 1;
				height: 20px;
				width: 20px;
				margin: auto;
				margin-left: calc(${a}% - 20px);
				}
			`}</style>
			<div />
		</>)
	}
	
	return (
		<div style={{width:'90%', margin:'20px auto',position:'relative'}}>
			<div className='mobile_menu' onClick={(e) => setType(e.target.value)}>
				<button className={type == 0 ? 'mobile_menuactive' : ''} value={0}>대학별 검색</button>
				<button className={type == 1 ? 'mobile_menuactive' : ''} value={1}>학과별 검색</button>
			</div>
			<style jsx>{`
			.selectbar {
				display: flex;
				margin-right: -8px;
				margin-bottom: 15px;
			}
			.selectbar > * {
				flex: 1 0 0;
				margin-right: 8px;
				height: 40px;
			}
			select {
				background: #F4F4F4 0% 0% no-repeat padding-box;
				box-shadow: 0px 3px 6px #00000029;
				border-radius: 5px;
				opacity: 1;
				text-align: center;
				font: normal normal bold 15px/40px Noto Sans CJK KR;
				letter-spacing: 0px;
				color: #373737;
				opacity: 1;
			}
			input {
				background: #F4F4F4 0% 0% no-repeat padding-box;
				box-shadow: 0px 3px 6px #00000029;
				border-radius: 5px;
				opacity: 1;
				text-align: center;
				font: normal normal bold 15px/40px Noto Sans CJK KR;
				letter-spacing: 0px;
				color: #373737;
				opacity: 1;
				width: 100%;
				height: 40px;
				margin-bottom: 8px;
			}
			.s {
				text-align: left;
				font: normal normal bold 15px/22px Noto Sans CJK KR;
				letter-spacing: 0px;
				color: #373737;
				opacity: 1;
				margin: 15px 0;
			}
			.univ {
				display: flex;
				flex-wrap: wrap;
				margin-right: -15px;
				overflow: visible;
			}
			.univ > * {
				flex: 1 0 26%;
				max-width: calc(33.3333% - 15px);
				margin-right: 15px;
				margin-bottom: 8px;
				height: 37px;
				background: 0% 0% no-repeat padding-box;
				box-shadow: 0px 3px 6px #00000029;
				border-radius: 5px;
				font: normal normal normal 15px/22px Noto Sans CJK KR;
				color: #2d2d2d;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.univ_active {
				background-color: #F56262 !important;
				color: white !important;
			}
			.divider {
				width: 100vw;
				position: relative;
				left: -10%;
				margin: 20px 0;
				background-color: #EDEEED;
				height: 10px;
			}
			.tbl {
				background: #F7F7F7 0% 0% no-repeat padding-box;
				box-shadow: 3px 3px 16px #9D9D9D52;
				border: 1px solid #9D9D9D;
				border-radius: 10px;
				opacity: 0.5;
				display: table;
				border-collapse: collapse;
				width: 100%;
				position: relative;
			}
			th:first-child {
				width: 30%;
			}
			td:first-child {
				width: 30%;
			}
			.tbl th {
				height: 44px;
				text-align: center;
				font: normal normal bold 16px/6px Noto Sans CJK KR;
				letter-spacing: 0px;
				color: #2D2D2D;
				opacity: 1;
				border: 1px solid #9D9D9D;
			}
			.tbl td {
				text-align: center;
				font: normal normal medium 14px/18px Noto Sans CJK KR;
				letter-spacing: 0px;
				color: #2D2D2D;
				opacity: 1;
				height: 60px;
				border: 1px solid #9D9D9D;
			}
			.tbl .line {
				position: absolute;
				left: calc(30% + 1px);
				margin-left: ${-totalRange[1] / (totalRange[0] - totalRange[1])}%;
				width: 1px;
				background-color: red;
				height: calc(100% - 44px);
			}
			.tbl .line:before {
				content: '내위치';
				display: inline-block;
				font-size: 12px;
				width: fit-content;
				padding: 4px;
				transform: translate(-50%,-100%);
				border-radius: 4px;
				background-color: red;
				min-width: 44px;
			}
			`}
			</style>
			{type == 0 ? // 대학별 검색
			<>
			<div className='selectbar'>
				<select value={areaCode} onChange={e => setAreaCode(e.target.value)}>
					<option value=''>지역</option>
					{
						area.map(a => <option value={a.code} key={a.code}>{a.name}</option>)
					}
				</select>
				<select value={lineCode} onChange={e => setLineCode(e.target.value)}>
					<option value=''>수학 선택</option>
					{
						line.map(a => <option value={a.code} key={a.code}>{a.name}</option>)
					}
				</select>
			</div>
			  <div className='orangebigbtn' onClick={search}>검색하기</div>
			  <div className='divider' />
			  <div className='univ'>
			  {
				data.map(d => <button className={chosen == d[3] ? 'univ_active' : ''} value={d[3]} onClick={click}>{d[2]}</button>)
			  }
			  </div>
			  <table className='tbl'>
				<tr>
					<th>대학명</th>
					<th>예측</th>
				</tr>
				<div className='line'/>
				{
				data.map(d => (<tr>
					<td>{d[2]}</td>
					<td>{getRange(d[1],d[0])}</td>
				</tr>))
				}
			  </table>
			  <table className='mobile_table'>
				<tr>
					<th>학과</th>
					<th>학과 합격 예측</th>
				</tr>
				{
					univData.length ?
					univData.map(r => (
						<tr>
							<td>{r[0]}</td>
							<td>{r[3]+'점/'+r[2]+'점'} - {r[3] >= r[2] ? '합격' : '불합격'}</td>
						</tr>
					)) : <tr><td>-</td><td>-</td></tr>
				}
			  </table></>
			: //학과별 검색
			<>
			<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
			<div className='selectbar'>
				<select value={areaCode} onChange={e => setAreaCode(e.target.value)}>
					<option value=''>지역</option>
					{
						area.map(a => <option value={a.code} key={a.code}>{a.name}</option>)
					}
				</select>
				<select value={lineCode} onChange={e => setLineCode(e.target.value)}>
					<option value=''>수학 선택</option>
					{
						line.map(a => <option value={a.code} key={a.code}>{a.name}</option>)
					}
				</select>
				<select value={group} onChange={e => setGroup(e.target.value)}>
					<option value=''>계열 선택</option>
					{
						departmentGroup.map(a => <option value={a.name} key={a.name}>{a.name}</option>)
					}
				</select>
			</div>
			  <div className='orangebigbtn' onClick={searchTwo}>검색하기</div>
			  <div className='divider' />
			  <table className='tbl'>
				<tr>
					<th>대학명</th>
					<th>예측</th>
				</tr>
				<div className='line'/>
				{
				data.map(d => (<tr>
					<td><p>{d[1]}</p><p>{d[2]}</p></td>
					<td>{getRangeTwo(d[3]-d[4])}</td>
				</tr>))
				}
			  </table>
			  </>
			  /*<table className='mobile_table'>
				<tr>
					<th>학과</th>
					<th>학과 합격 예측</th>
				</tr>
				{
					univData.length ?
					univData.map(r => (
						<tr>
							<td>{r[0]}</td>
							<td>{r[3]+'점/'+r[2]+'점'} - {r[3] >= r[2] ? '합격' : '불합격'}</td>
						</tr>
					)) : <tr><td>-</td><td>-</td></tr>
				}
			  </table>*/
			}
		</div>
	)
}

export default withDesktop(desktop,University);

export async function getStaticProps() {

	let dat;
	dat = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `, [1]);
	const area = dat.rows;
			dat = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `, [2]);
	const line = dat.rows;
			dat = await pool.query(`
    select	"code"
        ,	"name"
    from	"codes"
    where	"isUse" = true
    and     "groupId" = $1
    order by "sort" asc
            `, [3]);
	const recruit_group = dat.rows;
	const { year } = { year: 2021 }
	let {rows} = await pool.query(`
		select * from "codeExams"
	`)
	let aa = await pool.query(`
	select "계열" as name from mouidata group by 계열 order by 계열 asc
	`)
	return { props: { 'area': area, line: line, recruit_group: recruit_group, examcode: rows, departmentGroup: aa.rows} };
}