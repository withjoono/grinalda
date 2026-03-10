import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import loginContext from '../../contexts/login'
import withDesktop from '../../comp/withdesktop'
import desktop from '../desktop/examgraph'
import pool from '../../lib/pool'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Chart = ({data, labels, title, subtitle, oneToOne, chosen}) => {
	const [options, setOptions] = useState({
		chart: {
			marginTop: 20,
			type:'line',
			height:'100%',
			},
		plotOptions: {
			series: {
				cursor: 'pointer',
			}
		},
		title: {text: title},
		yAxis: [{ // Primary yAxis
		gridLineWidth: 0,
		min: 0,
        labels: {
            format: '{value}점',
        },
        title: {
            text: '점수',
        },

    },{
		gridLineWidth: 0,
        title: {
            text: '전국백분위',
        },
        labels: {
            format: '{value}%',
        },
		max: 100,
		min: 0,
		tickAmount:11,
		reversed: true,
	},		{ // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: '등급',
        },
        labels: {
            format: '{value}등급',
        },
		max: 9,
		min: 1,
		tickAmount:9,
		reversed: true,
		
    }],
		legend: {
			layout: 'vertical',
			align: 'left',
			x: 10,
			verticalAlign: 'top',
			y: 10,
			floating: true,
			backgroundColor:
				Highcharts.defaultOptions.legend.backgroundColor || // theme
				'rgba(255,255,255,0.25)'
		},
	})
	useEffect(() => {
		options.yAxis[0].visible = chosen == 1;
		options.yAxis[1].visible = chosen == 2;
		options.yAxis[2].visible = chosen == 3;
		setOptions({...options, series:{data:data, name:['','표준점수','전국백분위','등급'][chosen], yAxis:parseInt(chosen-1)},xAxis:{categories:labels}})
	},[data])
	return <HighchartsReact highcharts={Highcharts} options={options} allowChartUpdate={true} />
}

const ExamList = ({conv,examcode,subjectArea}) => {
	const [show,setShow] = useState(false)
	const [exams, setExams] = useState();
	const [result, setResult] = useState({});
	const [left, setLeft] = useState(false);
	const [year, setYear] = useState('')
	const [grade, setGrade] = useState('')
	const [type, setType] = useState('')
	const [scoreType, setScoreType] = useState(1)
	const [data, setData] = useState([])
	const [labels, setLabels] = useState([])
	
	const hydrogen = {
		...subjectArea.reduce((a,b) => {a[b.code] = b.code; return a;},{}),
		'국수탐':'total',
		'국수탐영':'total2',
		'국수탐영한':'total3'
	}
	
	const handleGrade = (e) => {
		const {value} = e.target;
		setGrade(value)
	}
	const handleYear = (e) => {
		const {value} = e.target;
		setYear(value)
	}
	
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
	
	useEffect(() => {
		getData('/api/exams', setExams, {type: -1});
	},[]);
	
	useEffect(() => {
		setData(result[hydrogen[type]] ? [...result[hydrogen[type]].scores[scoreType]] : [])
		setLabels(result[hydrogen[type]] ? [...result[hydrogen[type]].labels] : ['3월','6월','9월'])
	},[scoreType, result, type])
	
	useEffect(() => {
		if (exams) {
			let a = {}
			let labels = []
			let scores = []
			let r = {}
			exams.map(e => 
				{
					if (e.typeId == 0 || conv[e.typeId][1] != grade || conv[e.typeId][2] != year) return; 
					if (!a[e.typeId]) a[e.typeId] = [e];
					else {
						a[e.typeId].push(e);
					}
				}
			)
			Object.keys(a).sort((a,b) => {
						let g = conv[a][2] - conv[b][2]
						if (g==0) {
							return conv[a][1] - conv[b][a]
						} else return g;
					}
					).map(key => {
				let sum = [0,0,0,0]
				let sum2 = [0,0,0,0]
				let sum3 = [0,0,0,0]
				let num = [0,0,0]
				a[key].map(e => 
					{
						if (!e.originScore) e.originScore = 0
						if (!e.standardScore) e.standardScore = 0
						if (!e.percentScore) e.percentScore = 0
						if (!e.grade) e.grade = 9
						sum3 = sum3.map((k,i) => k+(parseInt([e.originScore,e.standardScore,e.percentScore,e.grade][i]) || 0))
						if (e.subjectArea != '80') {
							sum2 = sum2.map((k,i) => k+(parseInt([e.originScore,e.standardScore,e.percentScore,e.grade][i]) || 0))
							if (e.grade) num[1] += 1
							if (e.subjectArea != '50') {
								sum = sum.map((k,i) => k+(parseInt([e.originScore,e.standardScore,e.percentScore,e.grade][i]) || 0))
								if (e.grade) num[0] += 1
							}
						}
						if (e.grade) num[2] += 1
						let area = e.subjectArea;
						if (!r[area]) r[area] = {labels: [], scores: [[],[],[],[]]}
						r[area].labels.push(conv[key][0]);
						r[area].scores[0].push(e.originScore);
						r[area].scores[1].push(e.standardScore);
						r[area].scores[2].push(e.percentScore);
						r[area].scores[3].push(e.grade);
					}
				)
				if (r.total) {r.total.labels.push(conv[key]);
					r.total.scores[0].push(sum[0])
					r.total.scores[1].push(sum[1])
					r.total.scores[2].push(sum[2])
					r.total.scores[3].push(sum[3]/num[0])
				} else r.total = {labels:[conv[key]],scores:[[sum[0]],[sum[1]],[sum[2]],[sum[3]/num[0]]]}
				if (r.total2) {r.total2.labels.push(conv[key]);
					r.total2.scores[3].push(sum2[3]/num[1])
				} else r.total2 = {labels:[conv[key]],scores:[[null],[null],[null],[sum2[3]/num[1]]]}
				if (r.total3) {r.total3.labels.push(conv[key]);
					r.total3.scores[3].push(sum3[3]/num[2])
				} else r.total3 = {labels:[conv[key]],scores:[[null],[null],[null],[sum3[3]/num[2]]]}
				})
			
			console.log(r);
			setResult(r);
		}
	},[exams,year,grade]);
	
	const handleClick = (e) => {
		setChosen(e.target.id);
	}
	const handleSwitch = (e) => {
		setLeft(e.target.id == 'sum');
	}
	
	return (<>
		<style jsx>{`
				.mobile_menu > div {
					font: normal normal bold 15px/22px Noto Sans CJK KR;
					letter-spacing: 0px;
					color: #373737;
					opacity: 1;
				}
				.selectbar {
					display: flex;
					margin-right: -8px;
				}
				.selectbar > * {
					height: 40px;
					flex: 1 0 0;
					background: #F4F4F4 0% 0% no-repeat padding-box;
					box-shadow: 0px 3px 6px #00000029;
					border-radius: 5px;
					opacity: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					font: normal normal bold 15px/15px Noto Sans CJK KR;
					margin-right: 8px;
				}
				.plan {
					background: #F7F7F7 0% 0% no-repeat padding-box;
					box-shadow: 3px 3px 16px #9D9D9D52;
					border: 1px solid #9D9D9D;
					border-radius: 10px;
				}
			`}</style>
		<div style={{width:'90%', margin:'0 auto'}}>
			<div className='mobile_menu' onClick={handleSwitch}>
				<button id="sum" className={left ? 'mobile_menuactive' : undefined}>조합별</button>
				<button id="individual" className={!left ? 'mobile_menuactive' : undefined}>과목별</button>
			</div>
			<div className='selectbar'>
				<select defaultValue="" onChange={handleGrade}>
							<option value="" disabled>학년 선택</option>
							<option value='1'>1학년</option>
							<option value='2'>2학년</option>
							<option value='3'>3학년</option>
							<option value='4'>N수생</option>
						</select>
				<select defaultValue="" onChange={handleYear}>
					<option value="">년도 선택</option>
					{[2019,2020,2021].map(e =>  {if (examcode.filter(k => k.id > 0 && k.grade == parseInt(grade) && k.year == e).length) return <option value={e}>{e}</option>})}
				</select>
				<select defaultValue="" onChange={(e) => {setType(e.target.value);}}>
				<option value="">{!left ? '교과' : '조합'} 선택</option>
				{
					
					!left ?
					subjectArea.map(e => {
						return <option value={e.code}>{e.name}</option>
					}) : ['국수탐','국수영탐','국수탐영한'].map(e => {
						return <option value={e}>{e}</option>
					})
				}
				</select>
			</div>
			<div className='mobile_menu'>
				<button className={scoreType == 1 ? 'mobile_menuactive' : ''} onClick={()=>{setScoreType('1')}}>표준점수</button>
				<button className={scoreType == 2 ? 'mobile_menuactive' : ''} onClick={()=>{setScoreType('2')}}>백분위</button>
				<button className={scoreType == 3 ? 'mobile_menuactive' : ''} onClick={()=>{setScoreType('3')}}>등급</button>
			</div>
			<div className='plan'><Chart data={data} labels={labels} oneToOne={true} chosen={scoreType} /></div>
		</div>
	</>
	)
}

export default withDesktop(desktop,ExamList);

export async function getStaticProps() {
	let {rows} = await pool.query(`select * from "codeExams"`)
	const aa = await pool.query(`select * from "codeExams" order by year, grade`)
	const bb = await pool.query(`select * from codes where "groupId" = 6`)
	const cc = bb.rows.reduce((acc,row) => {acc[row.code] = row.name; return acc},{})
	return {props: {examcode: rows, subjectArea:bb.rows, conv: aa.rows.reduce((acc, obj) => {acc[obj['id']] = [obj.type,obj.grade,obj.year]; return acc}, {})}}
}