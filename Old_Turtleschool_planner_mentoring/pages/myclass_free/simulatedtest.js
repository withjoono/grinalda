import Link from 'next/link'
import withDesktop from '../../comp/withdesktop'
import page from './schooldistrictapp'
import withPayment from '../../comp/paymentwrapper'
import axios from 'axios'
import {useState, useEffect} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const SimulatedTest = () => {

	const [exam, setExam] = useState(['1']) //모의고사시험내역
	const [grade, setGrade] = useState('1'); //학년
	const [optionsexam, setOptionsExam] = useState([]); //모의고사시험내역전체
	const [examrank1, setExamRank1] = useState([]);
	const [examrank2, setExamRank2] = useState([]);
    const [plclass,setPlclass] = useState([]);
	const [grapallsubject, setGrapAllSubject] = useState([]);
	const [grapsubject, setGrapSubjec] = useState([]);

	const [switcha, setSwitcha] = useState("O");
	const [switchb, setSwitchb] = useState("K");

	const [allsubject, setallsubject] = useState([]);
	const [subject, setsubject] = useState([]);

	//공지사항 && 반명칭 가져오기
	useEffect(() => {
		SelectExamTest();
        Classinfo();
		SelectExamRank();
        handleClick();
        SelectSubject();
	},[])

    useEffect(() => {selectgrapallsubject(allsubject)},[switcha])

    useEffect(() => {selectgrapsubject(subject)},[switchb])
    useEffect(() => {console.log(grapsubject)},[grapsubject])

    const Classinfo = (e) => {
        axios.get('/api/planner/planners',{
            headers: {
                auth:localStorage.getItem('uid')
            },
            params:{
                dvsn:null
            }
            
        }).then(res => {console.log('dddd',res.data.data);
           
                setPlclass(res.data.data);
        })

    }

 	//모의고사 조회
	const SelectExamTest = (e) => {
		axios.get('/api/myclass/codeexam',{
			headers: {
					auth: localStorage.getItem('realuid')
			},
			params: {
					gradecd: grade
			}
		}).then(res => {
			if(res.data.data == null) {
				setOptionsExam([{id: 'nd', type: '해당년도 모의고사 내역이 없습니다'}]);
			}
			else {
				setOptionsExam(res.data.data);
			} })
	}

	//1그래프
	const SelectExamRank = (e) => {
			axios.get('/api/myclass/examAnalysis',{
				headers: {
						auth: localStorage.getItem('realuid')
				},
				params: {
						dvcd: '1'
				}
			}).then(res => { console.log('AAAAAAAAAAA'); console.log(exam); console.log(res.data.data);
			if(res.data.data != null && res.data.data.length != 0) {
				setallsubject(res.data.data);
				selectgrapallsubject(res.data.data);
			}})
	}

    //2그래프
    const SelectSubject = (e) => {
        axios.get('/api/myclass/examAnalysis',{
            headers: {
                    auth: localStorage.getItem('realuid')
            },
            params: {
                    dvcd: '1'
            }
        }).then(res => {console.log('bb'); console.log(exam); console.log( res.data.data);
        if(res.data.data != null && res.data.data.length != 0) {
            setsubject(res.data.data);
            selectgrapsubject(res.data.data);
        }})
}


	//학년 변경시 키이벤트
	const handleChangeGrade = (e) => {
		setGrade(e.target.value);
		SelectExamTest();
	}

	//모의고사 변경시 키이벤트
	const handleChangeExam = (e) => {
		setExam(e.target.value);
		SelectExamRank();
	}

	const optionsgrade = [
		{ value: '1', label: '1학년' },
		{ value: '2', label: '2학년' },
		{ value: '3', label: '3학년' }
	];

		//1 chart
		function selectgrapallsubject(param) {
				let mindata = 100;
				let maxdata = 800;
                let tickamount = 0;

				const arr_names = param.map(obj => {
						return (
								obj.user_name
						)}) ;

						let arr_score;

						if(switcha == "O")
						{
							mindata = 0;
							maxdata = 800;
							arr_score = param.map(obj => {
									return (obj.all_score * 1.00
									)}) ;
						 }
						else if(switcha == "G")
						{
							mindata = 1;
							maxdata = 9;
                            tickamount = 9;
							arr_score = param.map(obj => {
									return (obj.all_grade * 1.00
									)}) ;
                            console.log(arr_score)
						 }
						else if(switcha == "P")
						{
							mindata = 0;
							maxdata = 400;
							arr_score = param.map(obj => {
									return (obj.all_standardScore * 1.00
									)}) ;
						 }

				setGrapAllSubject({
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
				min:mindata,
				max:maxdata,
                tickAmount: tickamount ? tickamount : undefined,
                reversed: switcha == 'G' ? true : false,
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

	//2 chart
	function selectgrapsubject(param) {
			const arr_names = param.map(obj => {
					return (
							obj.user_name
					)}) ;

			let arr_score;

			if(switchb == 'K')
			{
				arr_score = param.map(obj => {
						return {y: (obj.korea_grade * 1.00 % 9
						) || 9, low: 9}}) ;
			 }
			else if(switchb == 'E')
			{
                arr_score = param.map(obj => {
                    
                    return  {y: (obj.english_grade * 1.00 % 9
                    ) || 9, low: 9}}) ;
			 }
			else if(switchb == 'M')
			{
                arr_score = param.map(obj => {
                    return {y: (obj.math_grade * 1.00
                    ) || 9, low: 9}}) ;
			 }
             if(switchb == 'A')
             {
                arr_score = param.map(obj => {
                    return {y: (obj.soc_grade * 1.00
                    ) || 9, low: 9}}) ;
              }
			setGrapSubjec({
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
			height:'450',
            type:'column'

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
			max:9,
            tickAmount: 9,
            reversed:true,
			labels: {
				style: {
					fontSize: '15px',
				}
			},
			endOnTick:false,
			startOnTick:false,
		},
		title: {
			text: null
		}
	});
}

	const handleClick = (e) => {
		
        if(e == "O")
		{
			setSwitcha("O");
		}
		else if(e == "G")
		{
			setSwitcha("G");
		}
		else if (e == "P")
		{
			setSwitcha("P");
		}
	}


	return (
    <div className="contaner">
		<style jsx>{`
			*{

            margin:0px;

            padding:0px;
            font-family:"Noto Sans CJK KR";
        }
        li{
            list-style:none;
        }
        a{
            text-decoration: none;

        }
            select{
               border:none;
               border-radius: 0;
               -webkit-appearance: none;
               -moz-appearance: none;

            }
        .contaner{
            width:1920px;
            height:2921px;
        }

        .main{
            height:100.5px;
            background-color: orange;
        }
        .header{

            background-color:#FCBF77;
            height:300px;

        }
        .footer{
            width:1920px;
            height:219px;
            background-color: orchid;
        }
        .header h1{
            color:#ffffff;
             text-align: center;
             line-height: 300px;
             font-size:36px;
             height:230px;
        }
        .btn{
            width:1280px;
            margin:0 auto;
            display:flex;
            justify-content: space-around;
        }
        .btn input{

            width:168px;
            height:56px;
            border-radius: 12px;
            box-shadow:0px 3px 12px #DE6B3D;
            border:0;
            background-color:#ffffff;

        }
        .btn input:hover{
            color:red;
        }
        .btn input:active{
            color:red;
        }
        .content{
                margin:0 auto;
                width:1280px;
                height:1719px;

        }
        content h1{
            font-size: 30px;
            font-family: "Noto Sans CJK KR";
        }
        .textB{

                margin-top:30px;

                box-sizing: border-box;
                border: 1px #9D9D9D solid;
                border-radius: 20px;

         }
        .textB h1{
                position: relative;
                font-size: 30px;
                line-height:59px;
                left:40px;
        }
        .num{
                width:814px;
                height:447px;
                margin:25px auto;
                color:#9D9D9D;
                position: relative;

            }
            .num p{
               height:11.1%;
               width:10%;
            }
            .num p:nth-of-type(9)
            {
                float:left;
            }
            .students{
                width:1200px;
                height: 24px;
                float:left;
                text-align: center;
                margin:18px auto;
                font-size:16px;
            }
            .student{

                float:left;
                width:20%;

            }
            .line{
                width: 796px;
                height:409px;
                position: absolute;
                left: 30px;
                top:15px;
            }
            .line div{
                height:49px;
                box-sizing: border-box;
                border-top:1px #ED936F dashed;
            }
            .menu ul{
                height:50px;
            }
            .menu li{
            float:left;
            width:120px;
            height:36px;
            margin-top:16px;
            margin-left:25px
        }
        .menu li:nth-of-type(1)
        {
            line-height: 39px;
            width:70px;

        }
        .menu li:nth-of-type(2){
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
        }
        .menu li:nth-of-type(2):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .menu li:nth-of-type(3){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
        }
        .menu li:nth-of-type(3):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .menu li:nth-of-type(4){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
        }
        .menu li:nth-of-type(4):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .menu li:nth-of-type(5){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
        }
        .menu li:nth-of-type(5):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .graph1{
            margin:30px;
            width:1280px;
            height: 767.3px;

        }
       .graph1 .box{
           margin-top:14px;
           width:1290px;
           height:540px;
           box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;

       }
       .graph1 .num{
            width:1222px;
            height:447px;
            margin:25px auto;
            color:#9D9D9D;
            position: relative;

        }
       .graph1 .line{

           width:1199px;
           position:absolute;
       }
       .graph1 .students{

            height: 24px;
            float:left;
            text-align: center;
            margin:18px auto;

        }
        .graph1 .student{

            float:left;
            width:20%;

        }

        .drop{
            display: flex;
        }
        .drop h1{
            font-size: 30px;
        }
        .drop select{
            margin-left:41px;
            font-size:16px;
        }

        .graph2{
            margin:30px;
            width:1280px;
            height: 767.3px;

        }
        .graph2 .box{
           margin-top:14px;
           width:620.3px;
           height:540px;
           box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
       }
       .graph2 .num{
            width:562px;
            height:447px;
            margin:25px auto;
            color:#9D9D9D;
            position: relative;

        }
       .graph2 .line{
           width:544px;
           position:absolute;
       }
       .graph2 .students{
            width:425px;
            height: 24px;
            float:left;
            text-align: center;
            margin:16px auto;

        }
        .graph2 .student{

            float:left;
            width:25%;

        }
       .left{
         width:620.3px;
         float:left;
       }
       .right{
           width:620px;
           float:right;
       }
       .menu li:nth-of-type(1)
        {
            line-height: 39px;
            width:70px;

        }
        .menu li:nth-of-type(2){
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
            width:66px;

        }
        .menu li:nth-of-type(2):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .menu li:nth-of-type(3){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
            width:66px;
        }
        .menu li:nth-of-type(3):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .menu li:nth-of-type(4){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
            width:66px;
        }
        .menu li:nth-of-type(4):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .menu li:nth-of-type(5){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
            width:66px;
        }
        .menu li:nth-of-type(5):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
		`}</style>

        <div className="header">
            <h1>모의고사 관리</h1>
            <div className="btn">
          
                   <Link href='/myclass_free/planner'><input type="button" value="플래너검사"/></Link>
                   <Link href='/myclass_free/schoolgrades'><input type="button" value="내신관리"/></Link>
                   <Link href='/myclass_free/simulatedtest'><input type="button" value="모의고사 관리"/></Link>
                   <Link href='/myclass_free/test'><input type="button" value="테스트"/></Link>
                   <Link href='/myclass_free/health'><input type="button" value="체력검사"/></Link>
                
            </div>
        </div>
        <div className="content">
            <div className="textB">
	            
                    {
                        plclass.map(f =>(
                        <h1>
                            {f.clsnm}
                        </h1>
                        ))
                    }
              

			</div>

            <div className="graph1">
                <div className="drop">
                <h1>교육청 모의 순위(전과목)</h1>
                <select name="" id="" value={grade} onChange={handleChangeGrade}>
							{optionsgrade && optionsgrade.length > 0 &&
									optionsgrade.map((option) => (
											<option
													key={option.value}
													value={option.value}
													name={option.label}
													defaultValue={"1"}
											>
													{option.label}
											</option>
									))}
							</select>

							<select name="" id="" value={exam} onChange={handleChangeExam}>
							{optionsexam && optionsexam.length > 0 &&
									optionsexam.map((option) => (
											<option
													key={option.id}
													value={option.id}
													name={option.type}
													defaultValue={""}
											>
													{option.type}
											</option>
									))}
							</select>

                </div>
                <div className="menu">
                    <ul>
                        <li>지수 점수</li>
                        <li onClick={(e) => handleClick("O")}>원점수</li>
                        <li onClick={(e) => handleClick("G")}>등급</li>
                        <li onClick={(e) => handleClick("P")}>표준점수</li>
                    </ul>
                </div>
                <div className="box">

                    <div className="num">
                        <HighchartsReact highcharts={Highcharts} options={grapallsubject} allowChartUpdate={true} />
                   
                </div>
                </div>
            </div>

            <div className="graph1">

                <h1>과목별 모의 순위(과목별)</h1>


                <div className="menu">
                    <ul>
                        <li>지수 선택</li>
                        <li onClick={()=> setSwitchb('K')}>국어</li>
                        <li onClick={()=> setSwitchb('M')}>수학</li>
                        <li onClick={()=> setSwitchb('E')}>영어</li>
                        <li onClick={()=> setSwitchb('A')}>탐구</li>
                    </ul>
                </div>
                <div className="box">

                    <div className="num">
                        <HighchartsReact highcharts={Highcharts} options={grapsubject} allowChartUpdate={true} />
            
                </div>
                </div>
            </div>
            <div className="graph2">
                <div className="left">

                <div className="drop">
                <h1>모의 성적 변동 추이(전과목)</h1>
                <select name="" id="subject">
                    <option value="">이름</option>
                </select>
                <select name="" id="testName">
                    <option value="">학년</option>
                </select>
                <select name="" id="testName">
                    <option value="">시험명</option>
                </select>

                </div>
                <div className="menu">
                    <ul>
                        <li>지수점수</li>
                        <li>원점수</li>
                        <li>등급</li>
                        <li>표준점수</li>
                    </ul>
                </div>
                <div className="box">

                    <div className="num">
                        <p>1</p>
                        <p>2</p>
                        <p>3</p>
                        <p>4</p>
                        <p>5</p>
                        <p>6</p>
                        <p>7</p>
                        <p>8</p>
                        <p>9</p>
                        <div className="students">
                        <div className="student">3월</div>
                        <div className="student">6월</div>
                        <div className="student">9월</div>
                        <div className="student">12월</div>

                        </div>
                 
                </div>
                </div>
                </div>
                <div className="right">


                    <div className="drop">
                    <h1>모의 성적 변동 추이(과목별)</h1>

                        <select name="" id="subject">
                            <option value="">이름</option>
                        </select>
                        <select name="" id="testName">
                            <option value="">학년</option>
                        </select>
                        <select name="" id="class">
                            <option value="">시험명</option>
                        </select>
                    </div>
                    <div className="menu">
                        <ul>
                        <li>지수 선택</li>
                        <li>국어</li>
                        <li>수학</li>
                        <li>영어</li>
                        <li>탐구</li>
                        </ul>
                    </div>
                    <div className="box">

                        <div className="num">
                            <p>1</p>
                            <p>2</p>
                            <p>3</p>
                            <p>4</p>
                            <p>5</p>
                            <p>6</p>
                            <p>7</p>
                            <p>8</p>
                            <p>9</p>
                            <div className="students">
                                <div className="student">3월</div>
                                <div className="student">6월</div>
                                <div className="student">9월</div>
                                <div className="student">12월</div>
                            </div>
                        <div className="line">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    </div>
                    </div>
            </div>
            </div>
        </div>
		)
	}

    export default withDesktop(SimulatedTest,page,null,'플래너');
