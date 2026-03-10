import Menu from '../../comp/naesinmenu'
import {useState, useEffect} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from 'axios'
import useZnaesin from '../../comp/znaesin'

const Analysis = () => {

	const [btn, setBtn] = useState(1)
	const {
		gpaAsk, setgpaAsk,  chartTwo,  setchartTwo,  radio,  setRadio,  check,  checkBlue,  checkRed
	} = useZnaesin()

	const [tablegpa, setTableGpa] = useState();
	const [chartsemester, setChartSemester] = useState();
	const [chartsubject, setChartSubject] = useState();
	const [editusertype, setEditusertype] = useState("A");
	
    //학기별내신
    useEffect(() => {
		axios.get('/api/gpa/GpaAnalysis',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
				
			}
		}).then(res => {chartone(res.data.data); averageGpa(res.data.data); })
	},[])

	//과목별/조합별성적변동추이 조회조건-과목/조합
    useEffect(() => {
		Selectchartthree("A");
	},[])

	const averageGpa = (e) => {
		let resulta = 0;
		let resultb = 0;
		let resultc = 0;
		let resultd = 0;
		let resulte = 0;
		let resultf = 0;
		let resultg = 0;

		resulta = e.reduce((resulta, item) => resulta + item.averagegradea * 1 + 0.00, 0.00);
		resultb = e.reduce((resultb, item) => resultb + item.averagegradeb * 1 + 0.00, 0.00);
		resultc = e.reduce((resultc, item) => resultc + item.averagegradec * 1 + 0.00, 0.00);
		resultd = e.reduce((resultd, item) => resultd + item.averagegraded * 1 + 0.00, 0.00);
		resulte = e.reduce((resulte, item) => resulte + item.averagegradee * 1 + 0.00, 0.00);
		resultf = e.reduce((resultf, item) => resultf + item.averagegradef * 1 + 0.00, 0.00);
		resultg = e.reduce((resultg, item) => resultg + item.averagegradeg * 1 + 0.00, 0.00);

		const arr_data = [{ averagegradea : Math.ceil(resulta / e.length * 10) /10, 
						    averagegradeb : Math.ceil(resultb / e.length * 10) /10, 
						    averagegradec : Math.ceil(resultc / e.length * 10) /10, 
						    averagegraded : Math.ceil(resultd / e.length * 10) /10, 
						    averagegradee : Math.ceil(resulte / e.length * 10) /10, 
						    averagegradef : Math.ceil(resultf / e.length * 10) /10, 
						    averagegradeg : Math.ceil(resultg / e.length * 10) /10}];
		
		setTableGpa(arr_data);
	}

	const Selectchartthree = (e) => {
		axios.get('/api/gpa/GpaChangesAnalysis',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
				dvsn: e
			}
		}).then(res => {chartthree(res.data.data); })
	}

    //1.
    function chartone(param) {
        const arr_names = param.map(obj => {
            return (
                obj.grade + "학년" + obj.semester + "학기"
            )}) ;
            
        const arr_score = param.map(obj => {
            return (
                obj.averagegradea * 1
            )}) ;

        setChartSemester({
			series: [{
				data: arr_score, 
				showInLegend: false,
				color: '#89C0E3',
				marker: {
					lineColor:'#89C0E3',
					lineWidth:'1',
					color:'#ffffff'
				}
			}],
			chart: {
				marginTop:'25',
				height:'450'
			},
			xAxis: {
				categories: arr_names,
				title: null,
				labels: {
					style: {
						fontSize: '15px',
					}
				}
			},
			yAxis: {
				title: {
					text:null,
					align:'high',
					offset:0,
					rotation:0,
					y: -10,
					style: {
						fontSize: '15px'
					}
				},
				min:1,
				max:8,
				labels: {					
					style: {
						fontSize: '15px',
					}
				},
				endOnTick:false,
				startOnTick:false,
				reversed: false
			},
			title: {
				text: null
			}		
		});
	}

	//1.
    function chartthree(param) {

        const arr_names = ["1학년1학기","1학년2학기","2학년1학기","2학년2학기","3학년1학기","3학년2학기"];
            
        const arr_score = [param[0].averagegradea * 1, 
						   param[0].averagegradeb * 1, 
						   param[0].averagegradec * 1, 
						   param[0].averagegraded * 1, 
						   param[0].averagegradee * 1, 
						   param[0].averagegradef * 1];

        setChartSubject({
			series: [{
				data: arr_score, 
				showInLegend: false,
				color: '#89C0E3',
				marker: {
					lineColor:'#89C0E3',
					lineWidth:'1',
					color:'#ffffff'
				}
			}],
			chart: {
				marginTop:'25',
				height:'450'
			},
			xAxis: {
				categories: arr_names,
				title: null,
				labels: {
					style: {
						fontSize: '15px',
					}
				}
			},
			yAxis: {
				title: {
					text:null,
					align:'high',
					offset:0,
					rotation:0,
					y: -10,
					style: {
						fontSize: '15px'
					}
				},
				min:1,
				max:8,
				labels: {					
					style: {
						fontSize: '15px',
					}
				},
				endOnTick:false,
				startOnTick:false,
				reversed: false
			},
			title: {
				text: null
			}		
		});
	}
	const options = [
		{ value: 'A', label: '전교과' },
		{ value: 'B', label: '국영수사' },
		{ value: 'C', label: '국영수과' },
		{ value: 'D', label: '국영수사+통합과학,통합사회' },
		{ value: 'E', label: '국영수과+통합과학,통합사회' },
		{ value: 'F', label: '국영수사과' },
		{ value: 'G', label: '국영수' },
		{ value: 'H', label: '국어' },
		{ value: 'I', label: '영어' },
		{ value: 'J', label: '수학' },
		{ value: 'K', label: '탐구' },
		{ value: 'L', label: '국영수탐구' }
	  ];

	const handleChange = (e) => {
		setEditusertype(e.target.value);
		Selectchartthree(e.target.value);
	};

	const zNaesin = (
		<>
			<style jsx>{`
				*{
            margin:0px;
            padding:0px;
            font-family: "Noto Sans CJK KR";
        }
        li {
            list-style: none;
        }

        a {
            text-decoration: none;
        }
        body{
            width:100%;
        }
    </style>
    <style>
        .contain{
            width:1280px;
            margin:auto;
        }
        .table h1{
            font-size:30px
        }
        .border{
            width:1280px;
            height:540px;
            border:1px #9D9D9D solid;
            border-radius: 20px;
        }
        .border table{
            font-size:18px;
            font-weight: bold;
            text-align: center;
            width:1220px;
            margin:auto;
            border-collapse: collapse;
            margin-top:30px;
            border-top:1px #363636 solid;
        }
        .border table tr td{
            height:80px;
            width:137.5px;
            border-bottom: 1px #CBCBCB solid;
            border-right: 1px #CBCBCB solid;
        }
        .border table tr td:nth-of-type(1),
        .border table tr:nth-of-type(1) td{
            background-color: #F6F6F6;
           
        }
        .border table tr td:nth-of-type(5)
        {
            background-color: #FFE8E8;
        }
        .border table tr td:nth-of-type(6){
            background-color: #E8F3FF;
        }
        .border table tr:nth-of-type(1) td:nth-of-type(5)
        {
         background-color: #FFD5D5;
        }
        .border table tr:nth-of-type(1) td:nth-of-type(6)
        {
         background-color: #D5E8FF;
        }
		.graph{
            width:1280px;
            margin:40px auto;
        }
        .graph h1{
            font-size:30px;
            font-weight: bold;
        }
        .graph .border{
            width:1280px;
            height:540px;
            border:1px #9D9D9D solid;
            margin-top:10px;
			padding: 30px 45px;
			color: #9D9D9D;
        }
			`}</style>
			 <div className="contain">
        <div className="table">
            <h1>나의 내신 z점수</h1>
            <div className="border">
                <table>
				<thead>
					<tr>
                        <td>조합명</td>
                        <td>내신등급평균</td>
                        <td>내신 백분위</td>
                        <td>내신Z점수</td>
                        <td>내신Z점수<br></br>백분위</td>
                        <td>Z점수<br/>환산내신</td>
                        <td>Z점수분위 환산내신-<br/>내신등급 평균</td>
                    </tr>
				</thead>
				<tbody>
					{
						gpaAsk.map(obj => {
							return(
							<tr>
								<td>{obj['subjectare']}</td>
								<td>{obj['grade1']}</td>
								<td>{obj['grade2']}%</td>
								<td>{obj['grade3']}</td>
								<td>{obj['grade4']}%</td>
								<td>{obj['grade5']}</td>
								<td>{obj['grade6']}</td>
							</tr>
							)
						})
					}
				</tbody>
                </table>
            </div>
        </div>
        <div className="graph">
            <h1>내신 반영 방식</h1>
            <div className="border">
				{/*
				<input type="checkbox" onChange={changetest} name='chk_gubun1' title='내신 등급 평균'  width='30' height='30'/>
				<input type="checkbox" name='chk_gubun2' title='Z내신 등급 평균' width='30' height='30'/>
				*/}
				<span>{checkBlue}내신 등급 평균
				{checkRed} Z내신 등급 평균 <span style={{fontSize:'10px'}}>(연대 기준)</span></span>                
                <HighchartsReact highcharts={Highcharts} options={chartTwo} allowChartUpdate={true} />
            </div>
        </div>
    </div>
		</>
	)

	return (
		<>
		<style jsx>{`
			.f {
				height: 80px;
				display: flex;
				align-items: flex-end;
			}
			.f > div {
				flex: 1 0 0;
				border-radius: 20px 20px 0 0;
				border: 1px solid #9D9D9D;
				-webkit-text-stroke: 1px;
				font-size: 28px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.d {
				height: 80px;
				background-color: white;
				border-bottom: 0 !important;
			}
			.e {
				height: 60px;
				background-color: #E8E8E8;
				color: #9D9D9D;
			}
			div.e:nth-of-type(1) {
				border-radius: 20px 0 0 0;
			}
			div.e:nth-of-type(2) {
				border-radius: 0 20px 0 0;
			}
			
		`}</style>
		<Menu index={1} title='성적분석' />
		<div style={{width:'1280px', margin:'0 auto'}}>
			<div className='menu'>
				<button className={btn == 0 ? 'menu_active' : ''} onClick={() => setBtn(0)}>내신 등급 평균</button>
				<button className={btn == 1 ? 'menu_active' : ''} onClick={() => setBtn(1)}>내신 Z점수</button>
			</div>
			{ btn == 0 ? <>
			<div className='desktop_box' style={{width:'100%'}}>
				<table className='desktop_box_table'>
                        <thead>
                            <tr>
								<td>전교과</td>
								<td>국영수사</td>
								<td>국영수과</td>
								<td><p style={{lineHeight:'initial'}}>국영수사<br/>+통합과학,통합사회</p></td>
								<td><p style={{lineHeight:'initial'}}>국영수과<br/>+통합과학,통합사회</p></td>
								<td>국영수사과</td>
								<td>국영수</td>
                            </tr>
                        </thead>
                        <tbody>
                            {tablegpa != undefined &&
                                tablegpa.map(obj => {
                                    return(
                                    <tr>
                                        <td>{obj["averagegradea"]}</td>
                                        <td>{obj["averagegradeb"]}</td>
                                        <td>{obj["averagegradec"]}</td>
										<td>{obj["averagegraded"]}</td>
										<td>{obj["averagegradee"]}</td>
										<td>{obj["averagegradef"]}</td>
										<td>{obj["averagegradeg"]}</td>
                                    </tr>
                                    )
                                })
                            }
                        </tbody>				
				</table>
			</div>
			<div className='title_left' style={{marginTop:'30px'}}>학기별 내신</div>
			<div className='desktop_box' style={{width:'100%', height:'580px'}}>
				<HighchartsReact highcharts={Highcharts} options={chartsemester} />
			</div>
			<div className='title_left' style={{marginTop:'30px'}}>과목별/조합별 성적 변동 추이</div>
				<select name="" id="" value={editusertype} onChange={handleChange}>
				{
				options.map((option) => (
					<option 
						key={option.value}
						value={option.value}
						name={option.label}
						defaultValue={"A"}
					>
						{option.label}
					</option>
				))}
			</select>
			<div className='desktop_box' style={{width:'100%', height:'580px'}}>
				<HighchartsReact highcharts={Highcharts} options={chartsubject} />
			</div></>
			: zNaesin }
			
		</div>
		</>
	)
}

export default Analysis