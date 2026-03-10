import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from 'highcharts/highcharts-more';
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import Menu from '../../comp/mouimenu'

const Chart = ({data, labels, title, subtitle, oneToOne, chosen}) => {
	const ref = useRef(null)
	const [options, setOptions] = useState({
		chart: {
			marginTop: 20,
			type:'line',
			height:'800',
			},
		plotOptions: {
			series: {
				cursor: 'pointer',
			}
		},
		title: {text: title},
		yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}점',
        },
        title: {
            text: '점수',
        },
        opposite: true

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
			x: 120,
			verticalAlign: 'top',
			y: 55,
			floating: true,
			backgroundColor:
				Highcharts.defaultOptions.legend.backgroundColor || // theme
				'rgba(255,255,255,0.25)'
		},
	})
	useEffect(() => {
		setOptions({...options, series:{data:data, name:['','표준점수','전국백분위','등급'][chosen], yAxis:parseInt(chosen-1)},xAxis:{categories:labels}})
	},[data])
	return <HighchartsReact ref={ref} highcharts={Highcharts} options={options} allowChartUpdate={true} />
}

const examgraph = ({examcode,conv,subjectArea}) => {
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
	
	return (
		<>
			<style jsx>{`
				.bigtitle {
					font-size: 30px;
					margin: 60px 0 75px;
					-webkit-text-stroke:1px;
				}
				.btn {
					display: flex;
					margin: 0 0 18px;
					border-bottom: 1px solid #fede01;
				}
				.btn > div {
					width: 180px;
					height:40px;
					margin-right: 5px;
					display: flex;
					justify-content: center;
					align-items: center;
					border: 1px solid #fede01;
					margin-bottom: -2px;
					cursor:pointer;
				}
				.divide {
					padding: 20px 0;
					border-top: 1px solid #fede01;
					margin-top: 120px;
				}
				.searchbtn {
					display: flex;
					margin-right: -40px;
					flex-wrap: wrap;
				}
				.searchbtn > div {
					flex: 1 0 0;
					flex-basis: 100px;
					height:40px;
					max-width: 200px;
					display: flex;
					justify-content:center;
					align-items:center;
					margin-right:40px;
					border:1px solid #fede01;
					margin-bottom: 70px;
					cursor:pointer;
				}
				.bigbtn {
					width: 260px;
					height: 47px;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #DE6B3D;
					border-radius: 25px;
					-webkit-text-stroke: 1px;
					color: white;
					margin: 40px auto 80px;
					cursor:pointer;
				}
				.triangle {
					background-color: #fede01;
					clip-path: polygon(50% 0, 100% 100%, 0 100%);
					width: 22px;
					height: 22px;
				}
				.infocontainer {
					border: 2px solid #fede01;
					padding: 50px 2px;
					display: flex;
					flex-direction: column;
					margin-bottom: 110px;
				}
				.infocontainer > div {
					padding: 0 70px;
					display: flex;
					justify-content: space-between;
					align-items:center;
					height:74px;
					border-radius: 13px;
					border: 1px solid #e9e9e9;
					margin-bottom: 14px;
				}
				.infocontainer > div:first-child {
					-webkit-text-stroke: 1px;
					border: 0;
					margin-bottom: 0;
				}
				.active {
					color: white;
					background-color:#fede01;
				}
				.selectbar {
				display: flex;
				padding-right: 0;
			}
			select {
				flex:1 0 0;
				margin-right: 30px;
				border:1px solid #707070;
				border-radius: 4px;
				background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png) no-repeat right #fff;
				background-position-x: calc(100% - 1em);
				height:46px;
				padding: 0 1em;
			}
			.types {
				display: flex;
			}
			.types > * {
				display: flex;
				justify-content: center;
				align-items: center;
				flex: 0 0 120px;
				height: 36px;
				border: 1px solid #9D9D9D;
				border-radius: 20px;
				margin-right: 8px;
				font: normal normal normal 16px/24px Noto Sans CJK KR;
				letter-spacing: 0px;
				color: #9D9D9D;
			}
			.types > *:first-child {
				display: flex;
				padding: 0 30px;
				font: normal normal normal 18px/27px Noto Sans CJK KR;
				flex: 0 0 auto;
				color: #2d2d2d;
				border: 0;
			}
			`}</style>
			<div className="page">
				<Menu index={2} title='성적 변동 추이 및 멘토링' />
				<div style={{width:'1280px',margin:'0 auto'}}>
					<div className='menu' onClick={handleSwitch}>
						<button id="sum" className={left ? 'menu_active' : undefined}>조합별</button>
						<button id="individual" className={!left ? 'menu_active' : undefined}>과목별</button>
					</div>
					<div className='desktop_box selectbar'>
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
					<div className='types'>
						<div>지수 선택</div>
						<button className={scoreType == 1 ? 'white_txt orange' : ''} onClick={()=>{setScoreType('1')}}>표준점수</button>
						<button className={scoreType == 2 ? 'white_txt orange' : ''} onClick={()=>{setScoreType('2')}}>백분위</button>
						<button className={scoreType == 3 ? 'white_txt orange' : ''} onClick={()=>{setScoreType('3')}}>등급</button>
					</div>
					<Chart data={data} labels={labels} oneToOne={true} chosen={scoreType} />
				</div>
			</div>
		</>
	
	);
}

export default examgraph;