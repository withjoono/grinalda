import Link from 'next/link'
import withDesktop from '../../comp/withdesktop'
import page from './schoolgradesapp'
import withPayment from '../../comp/paymentwrapper'
import axios from 'axios'
import {useState, useEffect} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Button } from '@material-ui/core'
import Btn from './myclass_btn'

const SchoolGrades = () => {

    const [cls, setcls] = useState([]) //반명칭
    const [grade, setgrade] = useState("1"); //1학년
    const [grade2, setgrade2] = useState("1"); //1학기
    const [subject, setSubject] = useState("60"); //국어
    const [semester, setsemester] = useState("1");
    const [exam, setExam] = useState([]) //통합내신
    const [semester1, setSemester1] = useState([]) //학기별내신순위1
    const [semester2, setSemester2] = useState([]) //학기별내신순위2
    const [semester3, setSemester3] = useState([]) //학기별내신순위2
    const [grapsemester1, setGrpSemester1] = useState([]) //학기별내신순위1
    const [grapsemester2, setGrpSemester2] = useState([]) //학기별내신순위2
    const [grapsemester3, setGrpSemester3] = useState([]) //학기별내신순위2
    const [topswitch, setTopSwitch] = useState('L');
    const [downswitch, setDownSwitch] = useState('L');
    const [members, setMembers] = useState([]);
    const [memberid, setMembersId] = useState([]);

    //공지사항 && 반명칭 가져오기
    // useEffect(() => {
    //     axios.get('/api/planner/notice',{
	// 		headers: {
	// 			auth: localStorage.getItem('uid')
	// 		},
	// 		params: {
    //             dvsn: '6'
	// 		}
	// 	}).then(res =>{ console.log(res.data);
    //         if(res.data.data.length != 0)   
    //         {setcls(res.data.data[0].clsnm)};
    //         })
	// },[])

    useEffect(() =>{
        Classinfo();

    },[])
    const Classinfo = (e) => {
        axios.get('/api/planner/planners',{
            headers: {
                auth:localStorage.getItem('uid')
            },
            params:{
                dvsn:null
            }
            
        }).then(res => {console.log('dddd',res.data.data);
           
                setcls(res.data.data);
        })
    }

    //통합내신
    useEffect(() => {

        selectExam1({subject:null, dvsn:null, grade:null, gubun:'L'});

        selectExam2({subject:null, dvsn:semester, grade:grade, gubun:'L'});

        selectExam3({subject:subject, grade:grade2, gubun:'D'});

        selectMembers();
	},[])

  const selectMembers = (e) => {
    axios.get('/api/myclass/clsmembers',{
      headers: {
            auth: localStorage.getItem('uid')
      },
      params: {
      }
    }).then(res => {
      if(res.data.data == null) {
				setMembers([{id: 'nd', user_name: '해당학생이 없습니다'}]);
			}
			else {
				setMembers(res.data.data);
			}
    })
  }

    const selectExam1 = (e) => {
        const l_switch = topswitch;
        axios.get('/api/myclass/gpaselect',{
			headers: {
				    auth: localStorage.getItem('uid')
			},
			params: {
            subject: e.subject,
            dvsn: null,
            grade: null,
            gubun: l_switch
			}
		}).then(res => {setExam(res.data.data); changeGrpSemester1(res.data.data)})
    }

    const selectExam2 = (e) => {
        const l_switch = downswitch;
        axios.get('/api/myclass/gpaselect',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
                subject: e.subject,
                dvsn: e.dvsn,
                grade: e.grade,
                gubun: l_switch
			}
		}).then(res => { setSemester2(res.data.data); changeGrpSemester2(res.data.data)})
    }

    const selectExam3 = (e) => {
        axios.get('/api/myclass/gpaselect',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
                subject: e.subject,
                dvsn: null,
                grade: e.grade,
                gubun: 'D',
                id: memberid
			}
		}).then(res => { changeGrpSemester3(res.data.data)})
    }

    const UpdateTopSwitch = (e) => {
        setTopSwitch(e);
    }

    const UpdateDownSwitch = (e) => {
        setDownSwitch(e);
    }

    const options1 = [
  		{ value: '1', label: '1학년' },
  		{ value: '2', label: '2학년' },
  		{ value: '3', label: '3학년' }
	  ];

    const options2 = [
  		{ value: '1', label: '1학기' },
  		{ value: '2', label: '2학기' }
	  ];

    const options3 = [
  		{ value: '60', label: '국어' },
  		{ value: '80', label: '영어' },
      { value: '70', label: '수학' },
      { value: '10', label: '사회' },
      { value: '20', label: '과학' },
	  ];

	const handleChangegrade = (e) => {
		  setgrade(e.target.value);
      selectExam2({subject:null, dvsn:semester, grade:e.target.value, gubun:downswitch});
	};

  const handleChangesemester = (e) => {
		  setsemester(e.target.value);
      selectExam2({subject:null, dvsn:e.target.value, grade:grade, gubun:downswitch});
	};

  const handleChangegrade2 = (e) => {
	    setgrade2(e.target.value);
      selectExam3({subject:subject, dvsn:null, grade:e.target.value, gubun:'D'});
	};

  const handleChangesubject = (e) => {
	    setSubject(e.target.value);
      selectExam3({subject:e.target.value, dvsn:null, grade:grade2, gubun:'D'});
	};

  const handleChangeId = (e) => {
      setMembersId(e.target.value);
      selectExam3({subject:subject, dvsn:null, grade:grade2, gubun:'D'});
  }

    function changeGrpSemester1(param) {
        const arr_names = param?.map(obj => {
            return (
                obj.user_name
            )}) ;

        const arr_score = param?.map(obj => {
            return (
                obj.score * 1
            )}) ;

        setGrpSemester1({
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

    function changeGrpSemester2(param) {
        const arr_names = param?.map(obj => {
            return (
                obj.user_name
            )}) ;

        const arr_score = param?.map(obj => {
            return (
                obj.score * 1
            )}) ;

        setGrpSemester2({
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

    function changeGrpSemester3(param) {
        console.log(param);
        const arr_names = ['1학기', '2학기'];

        let arr_score = [0, 0];
        if(param == null || param.length < 1)
        {

        }
        else
        {
            arr_score = [param[0].ascore * 1, param[0].bscore * 1];
        }

        setGrpSemester3({
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

	return (
    <div className="contaner" style={{width:'100%'}}>
		<style jsx>{`
			 a:link { color: red; text-decoration: none;}
     a:visited { color: black; text-decoration: none;}
     a:hover { color: blue; text-decoration: underline;}

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
        height:2807px;
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
  
    .content{
            margin:0 auto;
            width:1280px;
            height:2118px;
    }
    .content h1{
        font-size: 30px;
        font-family: "Noto Sans CJK KR";
    }
    .textB{
            height:59px;
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
            width:562px;
            height: 24px;
            float:left;
            text-align: center;
            margin:18px auto;

        }
        .student{

            float:left;
            width:20%;

        }
        .line{
            width: 796px;
            height:409px;
            position: absolute;
            left:10px;
            top:15px;
        }
        .line div{
            height:49px;
            box-sizing: border-box;
            border-top:1px #ED936F dashed;
        }
        .first{
            height:802.1px;
            margin-top:40px;
        }
        .first .left .box{
            width:900px;
            height:507px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            float:left;
            margin-top:14px;
        }
        .first .left{
            width:900px;
            position: relative;
        }
        .first .left #subject{
            font-size: 16px;
            position:absolute;
            left:231px;
            top:15px;
            color:#9D9D9D;
        }
        .first .left #testName{
            font-size: 16px;
            position:absolute;
            left:320px;
            top:15px;
            color:#9D9D9D;
        }
        .right{
            position: relative;
        }
        .right .line{
            width: 274.64px;
            height:409px;
            position: absolute;
            left:32.3px;
            top:70px;
        }
        .right .line div{

            height:84.5px;
            box-sizing: border-box;
            border-top:1px #ffffff solid;
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
            width:96px;

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
            margin-left:56px;
            line-height: 39px;
            width:96px;
        }
        .menu li:nth-of-type(5){
            margin-left:24px;
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
        .menu li:nth-of-type(6){
            margin-left:8px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            text-align: center;
            line-height: 36px;
        }
        .menu li:nth-of-type(6):hover{
            background-color: #DE6B3D;
            cursor:pointer;
        }
        .right ul{
            color:black;
            font-size: 20px;
            width:336.99px;
            height: 78.5px;
            line-height: 78.5px;
        }


        .right li{
            float:left;
            font-size:14px;
        }

        .right li:nth-of-type(1)
        {
            margin-left:41.0px;

        }
        .right li:nth-of-type(2)
        {
            margin-left:25px;

        }
        .right li:nth-of-type(3)
        {
            margin-left:67.0px;
        }
        .right li:nth-of-type(4)
        {
            margin-left:61.0px;
        }
        hr{
            margin:auto;
            width:288.92px;
        }
        .first .right{
            margin-top:14px;
            width:337px;
            height:507px;
            float:right;
            box-sizing: border-box;
            border: 1px #DE6B3D solid;
            border-radius: 32px;
            box-shadow: 3px 3px 16px #ED936F;
            background-color: #FC8454;
        }
        table{
            width:337px;
            height: 507px;
            border-spacing:26.9px;
        }
        table th{
            width:25%;
            font-size:14px;
        }
    
        table td{
            text-align: center;
         
        }
        table td:nth-of-type(1){
            font-size:20px;
        }
        .second{
            height:802.1px;
        }
        .second .left{
            width:900px;
            position: relative;
        }
        .second .left .box{
            width:900px;
            height:507px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            float:left;
            margin-top:14px;
        }
        .second .right{

            width:337px;
            height:507px;
            float:right;
            box-sizing: border-box;
            border: 1px #DE6B3D solid;
            border-radius: 32px;
            box-shadow: 3px 3px 16px #ED936F;
            background-color: #FC8454;
            margin-top:14px;
        }
        .second .left #subject{
            font-size: 16px;
            position:absolute;
            left:251px;
            top:15px;
            color:#9D9D9D;
        }
        .second .left #testName{
            font-size: 16px;
            position:absolute;
            left:330px;
            top:15px;
            color:#9D9D9D;
        }
        .third{
            width:1280px;
            height:802.1px;

        }
       .third .box{
           margin-top:14px;
           width:1290px;
           height:540px;
           box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
       }
       .third .num{
            width:1222px;
            height:447px;
            margin:25px auto;
            color:#9D9D9D;
            position: relative;

        }
       .third .line{
           width:1204px;
           position:absolute;
       }
       .third .students{
            width:860px;
            height: 24px;
            float:left;
            text-align: center;
            margin:18px auto;

        }
        .third .student{

            float:left;
            width:25%;

        }
        .third{
            position: relative;
        }
        .third #subject{
            font-size: 16px;
            position:absolute;
            left:251px;
            top:15px;
            color:#9D9D9D;
        }
        .third #testName{
            font-size: 16px;
            position:absolute;
            left:330px;
            top:15px;
            color:#9D9D9D;
        }
        .third #class{
            font-size: 16px;
            position:absolute;
            left:409px;
            top:15px;
            color:#9D9D9D;
        }
		`}</style>
        <div className="header">
            <h1>내신관리</h1>
         <Btn index= 'grade'/>
        </div>
        <div className="content">
            <div className="textB">
                     {
                        cls?.map(f =>(
                        <h1>
                            {f.clsnm}
                        </h1>
                        ))
                    }
            </div>
            <div className="first">

                <div className="left">
                    <h1>통합 내신 순위</h1>
                    <div className="menu">
                        <ul>
                            <li>과목선택</li>
                            <li onClick={(e) => selectExam1({subject:'1', dvsn:null, grade:null, gubun:topswitch})}>전 과목 평균</li>
                            <li onClick={(e) => selectExam1({subject:'2', dvsn:null, grade:null, gubun:topswitch})}>국영수탐</li>
                            <li>지수선택</li>
                            <li onClick={(e) => UpdateTopSwitch("L")}>내신 등급</li>
                            <li onClick={(e) => UpdateTopSwitch("R")}>편차 지수 등급</li>
                        </ul>
                    </div>

                    <div className="box">
                        <div className="num">
                            <HighchartsReact highcharts={Highcharts} options={grapsemester1} allowChartUpdate={true} />
                        </div>
                    </div>
                </div>

                <div className="right">
                    <div>
      
                            <div style={{height:'84.5px',lineHeight:'84.5px',display:'flex',justifyContent:'space-around'}}>
                                <span>순위</span>
                                <span>학생</span>
                                <span>내신</span>
                                <span>차이</span>
                            </div>
                       
                      
                            {exam != undefined &&
                                exam?.map(obj => {
                              
                                    return(
                                        <div style={{height:'84.5px',lineHeight:'60.5px',display:'flex',justifyContent:'space-around'}}>
                                        <span>{obj['rrank']}</span>
                                        <span>{obj['user_name']}</span>
                                        <span>{obj['score']}</span>
                                        <span>{obj['score_diff']}</span>
                                    </div>
                                    )
                                })
                            }
                      
                    </div>
                    <div className="line">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                 </div>
              </div>
            <div className="second">

                <div className="left">
                    <h1>학기별 내신 순위</h1>
                    <select name="" id="" value={grade} onChange={handleChangegrade}>
                        {
                        options1?.map((option) => (
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

                    <select name="" id="" value={semester} onChange={handleChangesemester}>
                        {
                        options2?.map((option) => (
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

                    <div className="menu">
                        <ul>
                            <li >과목선택</li>
                            <li onClick={(e) => selectExam2({subject:'1', dvsn:semester, grade:grade, gubun:downswitch})}>전 과목 평균</li>
                            <li onClick={(e) => selectExam2({subject:'2', dvsn:semester, grade:grade, gubun:downswitch})}>국영수탐</li>
                            <li>지수선택</li>
                            <li onClick={(e) => UpdateDownSwitch("L")}>내신 등급</li>
                            <li onClick={(e) => UpdateDownSwitch("R")}>편차 지수 등급</li>
                        </ul>
                    </div>
                    <div className="box">
                        <div className="num">
                            <HighchartsReact highcharts={Highcharts} options={grapsemester2} allowChartUpdate={true} />
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div>
                
                    <div style={{height:'84.5px',lineHeight:'84.5px',display:'flex',justifyContent:'space-around'}}>
                                <span>순위</span>
                                <span>학생</span>
                                <span>내신</span>
                                <span>차이</span>
                            </div>
                 
                            {semester2 != undefined &&
                                semester2?.map(obj => {
                                    return(
                                        <div style={{height:'84.5px',lineHeight:'60.5px',display:'flex',justifyContent:'space-around'}}>
                                        <span>{obj['rrank']}</span>
                                        <span>{obj['user_name']}</span>
                                        <span>{obj['score']}</span>
                                        <span>{obj['score_diff']}</span>
                                    </div>
                                    )
                                })
                            }
                   
                    </div>
                   <div className="line">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
             </div>
                <div className="third">
                        <h1>학기별 내신 순위 </h1>

                        <select name="" id="" value={memberid} onChange={handleChangeId}>
                        {
                            members?.map((option) => (
                                <option
                                    key={option.id}
                                    value={option.id}
                                    name={option.user_name}
                                    defaultValue={""}
                                >
                                    {option.user_name}
                                </option>
                            ))}
                        </select>
                        <select name="" id="" value={grade2} onChange={handleChangegrade2}>
                        {
                            options1?.map((option) => (
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
                        <select name="" id="" value={subject} onChange={handleChangesubject}>
                        {
                            options3?.map((option) => (
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
                        <div className="box">

                            <div className="num">
                                <HighchartsReact highcharts={Highcharts} options={grapsemester3} allowChartUpdate={true} />
                            </div>
                        </div>
                    </div>
            </div>
        </div>
)
}

export default withPayment(withDesktop(SchoolGrades,page),null,'플래너');
