import Link from 'next/link'
import withDesktop from '../../comp/withdesktop'
import page from './testapp'
import withPayment from '../../comp/paymentwrapper'
import axios from 'axios'
import {useState, useEffect} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Test = () => {
    const [notice, setNotice] = useState([]) //1.공지사항
    const [cls, setcls] = useState([])
    const [recenttest, setRecenttest] = useState([]) //최근시험
    const [monthtest, setMonthtest] = useState([]) //월간시험
    const today = new Date();
    const dateString = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)  + '-' + ('0' + today.getDate()).slice(-2);
    
    const [chartOptionsa, setChartOptionsa] = useState([]); //최근시험차트
    const [chartOptionsb, setChartOptionsb] = useState([]); //월간시험차트
    
    //공지사항 && 반명칭 가져오기
    useEffect(() => {
        console.log(localStorage.getItem('uid'));
		axios.get('/api/planner/notice',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
                dvsn: '5'
			}
		}).then(res => {console.log(res.data.data); setNotice(res.data.data); 
            if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);} else {setcls('');}  })
	},[])

    //최근시험 가져오기
    useEffect(() => {
		axios.get('/api/planner/recenttest',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
			}
		}).then(res => { 
            if(res.data.data.length != 0) {
                setRecenttest(res.data.data);
                changetesta(res.data.data);
            } 
            else {
                /*
                setRecenttest('');
                changetesta('');
                */
            } 
        })
	},[])

    //월간시험 가져오기
    useEffect(() => {
        console.log("월간시험 시작");
		axios.get('/api/planner/rank',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
                str_dwm: 'M',
                dvsn: '1'
			}
		}).then(res => { 
            if(res.data.data.length != 0) {
                setMonthtest(res.data.data);
                changetestb(res.data.data);
            } else {
                /*
                setMonthtest('');
                changetestb('');
                */
            }
        })
	},[])

    const state = {
        //default value of the date time
        date: dateString,
      };

    function changetesta(param) {
		//if (param.length < 1) return;

        const arr_names = param.map(obj => {
            return (
                obj.user_name
            )}) ;

        const arr_score = param.map(obj => {
            return (
                obj.score * 1
            )}) ;

		setChartOptionsa({
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
                //[param.map(obj => obj.user_name)],
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

    function changetestb(param) {
		//if (param.length < 1) return;

        const arr_names = param.map(obj => {
            return (
                obj.user_name
            )}) ;

        const arr_score = param.map(obj => {
            return (
                obj.testscores * 1
            )}) ;

		setChartOptionsb({
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
                //[param.map(obj => obj.user_name)],
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
        height:2628px;
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
         height:230px
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
            margin-top:40px;
            width:1280px;
            height:600.5px;
        }
        .test{
            width:620px;
            height:228px;
            background-color:#FC8454;
            box-shadow:3px 3px 16px #ED936F;
            border-radius: 20px;
            color:white;
        }
        .test h1{
            width:246px;
            position: relative;
            font-size: 36px;
            left:42px;
            top:28px;

        }
        .testImg{
            margin-top:17px;
            width:620px;
            height:211px;
            background-image: url(../public/assets/test.png);
        }
        .first .left{
            width:620px;
            float:left;
        }
        .first .right{
            width:620px;
            height:468px;
            float:right;
            position:relative;
        }
        .first .right a p{
            font-size: 24px;
            position:absolute;
            right:12px;
            top:5px;
            color:#9D9D9D;
        }
        
        .notice{
            width:620px;
            height:468px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px; 
            font-size:18px;    
        }
        .notice .text{
           position: relative;
           top:9px;
           left:49px;
        }
        .notice .text p{
            margin-top:48px;
        }
        .second{
            height:669.5px;
        }
        .second .left .box{
            width:900px;
            height:507px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            float:left;
           
        }
        .second .left{
            width:900px;
            position: relative;
        }
        .second .left #subject{
            font-size: 16px;
            position:absolute;
            left:231px;
            top:15px;
            color:#9D9D9D;
        }
        .second .left #testName{
            font-size: 16px;
            position:absolute;
            left:320px;
            top:15px;
            color:#9D9D9D;
        }
        ul:nth-of-type(1)
        {
            color:#ED936F;
            font-size: 14px;
            width:288.92px;
            height: 32px;
            margin-top:37px;       
        }
        ul:not(:nth-of-type(1)){
            color:black;
            font-size: 20px;
            width:288.92px;
            height: 78.5px;
            line-height: 78.5px;
        }
        ul:nth-of-type(1)
        {
            color:#ED936F;
            
        }
        ul li:nth-of-type(1)
        {
            color:#ED936F;
        }

        li{
            float:left;  
        }
        li:nth-of-type(1)
        {
            margin-left:37.6px;
        }
        li:nth-of-type(2)
        {
            margin-left:36px;
        }
        li:nth-of-type(3)
        {
            margin-left:99.4px;
        }
        hr{
            margin:auto;
            width:288.92px;
        }
        .second .right{
            width:337px;
            height:507px;
            float:right;
            box-sizing: border-box;
            border: 1px #DE6B3D solid;
            border-radius: 32px;
            box-shadow: 3px 3px 16px #ED936F;
       
        }
        
        .third{
            height:669.5px;
         
        }
        .third .left{
            width:900px;
            position: relative;
        }
        .third .left .box{
            width:900px;
            height:507px;
            box-sizing: border-box;
            border: 1px #9D9D9D solid;
            border-radius: 20px;
            float:left;
           
        }
        .third .right{
            width:337px;
            height:507px;
            float:right;
            box-sizing: border-box;
            border: 1px #DE6B3D solid;
            border-radius: 32px;
            box-shadow: 3px 3px 16px #ED936F;
            
        }
        .third .left #subject{
            font-size: 16px;
            position:absolute;
            left:231px;
            top:15px;
            color:#9D9D9D;
        }
        .third .left #testName{
            font-size: 16px;
            position:absolute;
            left:320px;
            top:15px;
            color:#9D9D9D;
        }
	 `}</style>
  
        <div className="header">
            <h1>테스트</h1>
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
            <h1>{cls}</h1>
            </div>
            <div className="first">
                
                <div className="left">
                    <h1>진행중인 테스트</h1>
                <div className="test">
                   <h1> {state.date} </h1>
                </div>
                <div className="testImg">

                </div>
            </div>
            
            <div className="right">       
                    <h1>공지사항</h1>
                    <a href=""><p>더보기</p></a>             
                    <div className="notice"> 
                    <div className="text">
                        {notice != undefined &&
                            notice.map(obj => 
                            <div className="">{obj.rmk}</div>)
                        }
                       </div>
                    </div>  
                </div>
            </div>

            <div className="second">
                
                <div className="left">
                    <h1>최근 시험 결과</h1>
                    <select name="" id="subject">
                        <option value="">과목명</option>
                    </select>
                    <select name="" id="testName">
                        <option value="">시험명</option>
                    </select>
                    <div className="box">
                        <HighchartsReact highcharts={Highcharts} options={chartOptionsa} allowChartUpdate={true} />
                    </div>
                </div>
                    <div className="right">
                    <table>
                    <thead>
                        <tr>
                            <td>순위</td>
                            <td>학생</td>
                            <td>점수</td>
                        </tr>
                    </thead>
                    <tbody>
                        {recenttest != undefined &&
                            recenttest.map(obj => {
                                return(
                                <tr>
                                    <td>{obj['rrank']}</td>
                                    <td>{obj['user_name']}</td>
                                    <td>{obj['score']}</td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                    </table>
                 </div>
                
            </div>
            <div className="third">
              
                <div className="left">
                    <h1>월간 시험 결과</h1>
                    <select name="" id="subject">
                        <option value="">{ ('0' + (today.getMonth() + 1)).slice(-2) }</option>
                    </select>
                    <select name="" id="testName">
                        <option value="">시험명</option>
                    </select>
                    <div className="box">
                        <HighchartsReact highcharts={Highcharts} options={chartOptionsb} allowChartUpdate={true} />
                    </div>
                </div>
                <div className="right">
                <table>
                    <thead>
                        <tr>
                            <td>순위</td>
                            <td>학생</td>
                            <td>점수</td>
                        </tr>
                    </thead>
                    <tbody>
                        {monthtest != undefined &&
                            monthtest.map(obj => {
                                return(
                                <tr>
                                    <td>{obj['rrank']}</td>
                                    <td>{obj['user_name']}</td>
                                    <td>{obj['testscores']}</td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                    </table>
                </div>
            </div>
           
        </div>
    </div>)
}

export default withDesktop(Test,page,null,'플래너');