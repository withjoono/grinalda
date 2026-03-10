import {useState, useEffect} from 'react'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from 'axios'

const Planner = () => {

	const [cls, setcls] = useState([])
	const [daylist, setDayList] = useState([])
	const [weeklist, setWeekList] = useState([])
	const [monthlist, setMonthList] = useState([])
	const [chartday, setChartDay] = useState([])
	const [chartweek, setChartWeek] = useState([])
	const [chartmonth, setChartMonth] = useState([])

    const today = new Date();
	const dateString = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)  + '-' + ('0' + today.getDate()).slice(-2);

    //1.
	function chartOptionD(param) {
        //if (param.length < 1) return;
    
                const arr_names = param.map(obj => {
                        return (
                                obj.user_name
                        )}) ;
    
                const arr_score = param.map(obj => {
                        return (
                                obj.totalscore * 1
                        )}) ;
    
                setChartDay({
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
                //height:'100%',
                backgroundColor:'transparent'
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
                tickAmount:8,
                endOnTick:false,
                startOnTick:false,
                reversed: true
            },
            title: {
                text: null
            }
        });
        }
    
        //1.
        function chartOptionW(param) {
        //if (param.length < 1) return;
    
                const arr_names = param.map(obj => {
                        return (
                                obj.user_name
                        )}) ;
    
                const arr_score = param.map(obj => {
                        return (
                                obj.totalscore * 1
                        )}) ;
    
                setChartWeek({
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
                //height:'100%',
                backgroundColor:'transparent'
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
                tickAmount:8,
                endOnTick:false,
                startOnTick:false,
                reversed: true
            },
            title: {
                text: null
            }
        });
        }
    
        //1.
        function chartOptionM(param) {
        //if (param.length < 1) return;
    
                const arr_names = param.map(obj => {
                        return (
                                obj.user_name
                        )}) ;
    
                const arr_score = param.map(obj => {
                        return (
                                obj.totalscore * 1
                        )}) ;
    
                setChartMonth({
            series: [{
                data: arr_score, //[3,4,6,78,4,3,2,3,4]
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
                //height:'100%',
                backgroundColor:'transparent'
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
                tickAmount:8,
                endOnTick:false,
                startOnTick:false,
                reversed: true
            },
            title: {
                text: null
            }
        });
        }
    
        const state = {
                //default value of the date time
                date: dateString,
            };

    //1.일간
	useEffect(() => {
        axios.get('/api/planner/rank',{
            headers: {
                auth: localStorage.getItem('uid')
            },
            params: {
                                //dvsn: '3',
                                str_dwm : 'D'
            }
        }).then(res => {console.log(res.data.data); setDayList(res.data.data);
                chartOptionD(res.data.data);
                if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);} })
        },[])
    
        //2.주간
        useEffect(() => {
        axios.get('/api/planner/rank',{
            headers: {
                auth: localStorage.getItem('uid')
            },
            params: {
                                //dvsn: '3',
                                str_dwm : 'W'
            }
        }).then(res => {console.log(res.data.data); setWeekList(res.data.data);
                    chartOptionW(res.data.data);
                    if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);} })
        },[])
    
        //3.월간
        useEffect(() => {
        axios.get('/api/planner/rank',{
            headers: {
                auth: localStorage.getItem('uid')
            },
            params: {
                                //dvsn: '3',
                                str_dwm : 'M'
            }
        }).then(res => {console.log(res.data.data); setMonthList(res.data.data);
                    chartOptionM(res.data.data);
                    if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);} else {setcls('');}  })
        },[])

	return (
    <div className="wrap">
		<style jsx>{`
		* {
            margin: 0px;
            padding: 0px;
            font-family: "Noto Sans CJK KR";
        }

        li {
            list-style: none;
        }

        a {
            text-decoration: none;
        }

        .wrap {
            width: 100%;
            height: 2754px;
        }

        .header {
            background-color: black;
            width: 400px;
            height: 50px;
            margin:auto;
        }

        .main {
            background-color: blue;
            height: 60px;
        }
        .content {
            width: 400px;
            height: 2644px;
            margin:auto;

        }

        .day_content {
            width: 352px;
            height: 856px;
            margin: auto;

        }

        .day_content h1:nth-of-type(1) {
            height: 53px;
            font-size: 22px;
            line-height: 53px;
            text-align: center;
        }

        .day_content h1:nth-of-type(2) {
            height: 13px;
            font-size: 17px;
            line-height: 2  3px;
            text-align: left;
        }

        .day_content hr {
            background-color: #DE6B3D;
            width: 175.53px;
            height: 4px;
            border-radius: 20px;
            margin: auto;
        }

        .day_content .selectBox {
           
            width:100%
        }

        .day_content select {

            width: 108px;
            height: 40px;
            text-align-last: center;
            border-radius: 5px;
            background-color: #FFFFFF;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }
        .day_content select:not(:nth-of-type(1))
        {
            margin-left: 10px;
        }
      
        .day_graph {
            
            width: 352px;
      
            border: 1px #9D9D9D solid;
            margin-top: 25px;
            border-collapse: collapse;
        }

        .day_content .line {
            width: 100%;
            height: 20%;
            border-bottom: 1px #9D9D9D solid;
            font-size: 10px;
            color:#9D9D9D;
        }

        .day_content .students ul {
            display: flex;
            width: 80%;
            font-size: 16px;
            margin: auto;

        }

        .day_content .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 15px 31px 0px;


        }

        .day_content .table {
            width: 352px;
            height: 299px;
            margin-top:30px;
        }

        .day_content table {
            width: 100%;
            border-collapse: collapse;
            height: 299px;
            text-align: center;
            font-size: 14px;
        }

        .day_content tr:nth-of-type(1) {
            background-color: #EFEDED;
        }

        .day_content td:nth-of-type(1) {
            width: 32px;
            background-color: #DEDEDE;
        }

        .day_content td:nth-of-type(2) {
            width: 45.3px;
        }

        .day_content td,
        .day_content tr {
            border-top: 1px #363636 solid;
            border-left: 1px #DEDEDE solid;
            border-bottom: 0.5px #DEDEDE solid;
            border-right: 0.5px #DEDEDE solid;
        }

        .day_content .sell {
            width: 400px;
            height: 10px;
            background-color: #EDEEED;
        }
        .week_content {
            width: 352px;
            height: 855px;
            margin: auto;

        }


        .week_content h1 {
            height: 53px;
            font-size: 17px;
            line-height: 53px;
            text-align: left;
        }

        .week_content hr {
            background-color: #DE6B3D;
            width: 175.53px;
            height: 4px;
            border-radius: 20px;
            margin: auto;
        }


        .week_content select {

            width: 108px;
            height: 40px;
            text-align-last: center;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%)

        }

        .week_content select:not(:nth-of-type(1))
        {
            margin-left: 10px;
        }
      
        .week_content .week_graph {
            width: 352px;
            height: 365px;
            border: 1px #9D9D9D solid;
            margin-top: 25px;
            border-collapse: collapse;
        }

        .week_content .line {
            width: 100%;
            height: 16.69999999999%;
            border-bottom: 1px #9D9D9D solid;
            font-size: 10px;
            color:#9D9D9D;
        }

        .week_content .students ul {
            display: flex;
            width: 80%;
            font-size: 16px;
            margin: auto;

        }

        .week_content .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 15px 31px 0px;


        }
        
        .week_content .table {
            width: 352px;
            height: 299px;
        }

        .week_content table {
            width: 100%;
            border-collapse: collapse;
            height: 299px;
            text-align: center;
            font-size: 14px;

        }

        .week_content tr:nth-of-type(1) {
            background-color: #EFEDED;
        }

        .week_content td:nth-of-type(1) {
            width: 32px;
            background-color: #DEDEDE;
        }

        .week_content td:nth-of-type(2) {
            width: 45.3px;
        }
        .week_content td:nth-of-type(3), .week_content td:nth-of-type(4){
            width: 80.0px;
        }
        .week_content td:nth-of-type(5){
            width:71px;
        }
        .week_content td,
        .week_content tr {
            border-top: 1px #363636 solid;
            border-left: 1px #DEDEDE solid;
            border-bottom: 0.5px #DEDEDE solid;
            border-right: 0.5px #DEDEDE solid;
        }

        .sell {
            width: 400px;
            height: 10px;
            background-color: #EDEEED;
        }
        .month_content {
            width: 352px;
            height: 55px;
            margin: auto;
        }
        .month_content h1{
            height: 53px;
            font-size: 17px;
            line-height: 53px;
            text-align: left;
        }
        .month_content select:not(:nth-of-type(1)) {
            margin-left: 15px;
        }
        .month_content select{
            width:165px;
            height:38px;
            text-align-last: center;
            border-radius: 5px;
            background-color: #FFFFFF;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
           
        
        }
        .month_graph {
            width: 352px;
            height: 282px;
            border: 1px #9D9D9D solid;
            margin-top: 25px;
            border-collapse: collapse;
        }
        
        .month_content .line {
            width: 100%;
            height: 11.1999%;
            border-bottom: 1px #9D9D9D solid;
            font-size: 10px;
            color:#9D9D9D;
            line-height: 31.36px;
        }

        .month_content .students ul {
            display: flex;
            width: 80%;
            font-size: 16px;
            margin: auto;

        }

        .month_content .students li {
            display: flex;
            font-size: 16px;
            padding: 10px 15px 31px 0px;
        }
        .month_content .table {
            width: 352px;
            height: 299px;
        }

        .month_content table {
            width: 100%;
            border-collapse: collapse;
            height: 299px;
            text-align: center;
            font-size: 14px;

        }
        
        .month_content tr:nth-of-type(1) {
            background-color: #EFEDED;
        }

        .month_content td:nth-of-type(1) {
           
            background-color: #DEDEDE;
        }
       
       
    
        .month_content td,
        .month_content tr {
            border-top: 1px #363636 solid;
            border-left: 1px #DEDEDE solid;
            border-bottom: 0.5px #DEDEDE solid;
            border-right: 0.5px #DEDEDE solid;
        }
		`}</style>
        <div className="content">
            <div className="day_content">
                <h1>고1 서울대반</h1>
                <hr/>
                <h1>일간 학업 성취도</h1>
               {/* <div className="selectBox">
                    <select name="" id="">
                        <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">5월&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select>
                        <option value="">23일&nbsp;&nbsp;&nbsp;&#9660; </option>
                    </select>
                </div>
                */}
                <div className="day_graph">
                <HighchartsReact highcharts={Highcharts} containerProps={{ style: { height: "100%" } }} options={chartday}allowChartUpdate={true} />
                </div>
                <div className="students">

 
                </div>
                <div className="table">
                    <table>
                        <tr>
                            <td>순위</td>
                            <td>학생</td>
                            <td>학업성취도</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>A학생</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>B학생</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>C학생</td>
                            <td>5</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>D학생</td>
                            <td>5️</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>E학생</td>
                            <td>5</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div className="sell"></div>
            <div className="week_content">
 
                <h1>주간 학업 성취도</h1>
                <div className="selectBox">
                    <select name="" id="">
                        <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select name="" id="">
                        <option value="">5월&nbsp;&nbsp;&nbsp;&#9660;</option>
                    </select>
                    <select>
                        <option value="">첫째주&nbsp;&nbsp;&nbsp;&#9660; </option>
                    </select>
                </div>
                <div className="week_graph">
                    <div className="line">30</div>
                    <div className="line">25</div>
                    <div className="line">20</div>
                    <div className="line">15</div>
                    <div className="line">10</div>
                    <div className="line">5</div>
                </div>
                <div className="students">
                    <ul>
                        <li>A학생</li>
                        <li>B학생</li>
                        <li>C학생</li>
                        <li>D학생</li>
                        <li>E학생</li>
                    </ul>
                </div>
                <div className="table">
                    <table>
                        <tr>
                            <td>순위</td>
                            <td>학생</td>
                            <td>월</td>
                            <td>화</td>
                            <td>수</td>
                            <td>합계</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>A학생</td>
                            <td>5</td>
                            <td>5</td>
                            <td>5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>B학생</td>
                            <td>5</td>
                            <td>5</td>
                            <td>5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>C학생</td>
                            <td>5</td>
                            <td>5</td>
                            <td>5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>D학생</td>
                            <td>5️</td>
                            <td>5</td>
                            <td>5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td>E학생</td>
                            <td>5</td>
                            <td>5</td>
                            <td>5</td>
                            <td></td>
                        </tr>
                    </table>
                </div>
              </div>
            <div className="sell"></div>
            <div className="month_content">
                    <h1>월간 학업 성취도</h1>
                    <div className="selectBox">
                        
                        <select name="" id="">
                            <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
                        </select>
                        <select name="" id="">
                            <option value="">5월&nbsp;&nbsp;&nbsp;&#9660;</option>
                        </select>

                    </div>
                    <div className="month_graph">
                        <div className="line">&nbsp;&nbsp;50</div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </div>
                    <div className="students">
                        <ul>
                            <li>A학생</li>
                            <li>B학생</li>
                            <li>C학생</li>
                            <li>D학생</li>
                            <li>E학생</li>
                        </ul>
                    </div>
                    <div className="dayTable">
                        <table>
                            <tr>
                                <td>순위</td>
                                <td>학생</td>
                                <td>1주</td>
                                <td>2주</td>
                                <td>3주</td>
                                <td>4주</td>
                                <td>5주</td>
                                <td>합계</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>A학생</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>B학생</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>C학생</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>D학생</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>5</td>
                                <td>E학생</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                    </div>
                </div>
                
            </div>

        </div>)
}

export default Planner