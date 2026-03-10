import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, {useEffect, useState} from 'react';
import withPayment from '../../comp/paymentwrapper';
import withDesktop from '../../comp/withdesktop';
import {useLoginCheck} from '../../src/hooks/useLoginCheck';
import Btn from './myclass_btn';
import page from './plannerapp';

const Planner = () => {
  useLoginCheck();
  const [cls, setcls] = useState([]);
  const [daylist, setDayList] = useState([]);
  const [weeklist, setWeekList] = useState([]);
  const [monthlist, setMonthList] = useState([]);
  const [chartday, setChartDay] = useState([]);
  const [chartweek, setChartWeek] = useState([]);
  const [chartmonth, setChartMonth] = useState([]);

  const today = new Date();
  const dateString =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);

  useEffect(() => {
    Classinfo();
  }, []);

  //임시 반 정보
  const Classinfo = e => {
    axios
      .get('/api/planner/planners', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          dvsn: null,
        },
      })
      .then(res => {
        setcls(res.data.data);
      });
  };

  //1.일간
  useEffect(() => {
    axios
      .get('/api/planner/rank', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          //dvsn: '3',
          str_dwm: 'D',
        },
      })
      .then(res => {
        setDayList(res.data.data);
        chartOptionD(res.data.data);
        // if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);}
      });
  }, []);

  //2.주간
  useEffect(() => {
    axios
      .get('/api/planner/rank', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          //dvsn: '3',
          str_dwm: 'W',
        },
      })
      .then(res => {
        setWeekList(res.data.data);
        chartOptionW(res.data.data);
        // if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);}
      });
  }, []);

  //3.월간
  useEffect(() => {
    axios
      .get('/api/planner/rank', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          //dvsn: '3',
          str_dwm: 'M',
        },
      })
      .then(res => {
        setMonthList(res.data.data);
        chartOptionM(res.data.data);
        // if(res.data.data.length != 0) {setcls(res.data.data[0].clsnm);} else {setcls('');}
      });
  }, []);

  //1.
  function chartOptionD(param) {
    //if (param.length < 1) return;

    const arr_names = param?.map(obj => {
      return obj.user_name;
    });

    const arr_score = param?.map(obj => {
      return obj.totalscore * 1;
    });

    setChartDay({
      series: [
        {
          data: arr_score,
          showInLegend: false,
          color: '#89C0E3',
          marker: {
            lineColor: '#89C0E3',
            lineWidth: '1',
            color: '#ffffff',
          },
          pointWidth: 30,
        },
      ],
      chart: {
        type: 'column',
        marginTop: '25',
        //height:'100%',
        backgroundColor: 'transparent',
      },
      xAxis: {
        categories: arr_names,
        title: null,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
      },
      yAxis: {
        title: {
          text: null,
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          style: {
            fontSize: '15px',
          },
        },
        min: 0,
        max: 5,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        tickAmount: 6,
        endOnTick: false,
        startOnTick: false,
      },
      title: {
        text: null,
      },
    });
  }

  //1.
  function chartOptionW(param) {
    //if (param.length < 1) return;

    const arr_names = param?.map(obj => {
      return obj.user_name;
    });

    const arr_score = param?.map(obj => {
      return obj.totalscore * 1;
    });

    setChartWeek({
      series: [
        {
          data: arr_score,
          showInLegend: false,
          color: '#89C0E3',
          marker: {
            lineColor: '#89C0E3',
            lineWidth: '1',
            color: '#ffffff',
          },
          pointWidth: 30,
        },
      ],
      chart: {
        type: 'column',
        marginTop: '25',
        //height:'100%',
        backgroundColor: 'transparent',
      },
      xAxis: {
        categories: arr_names,
        title: null,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
      },
      yAxis: {
        title: {
          text: null,
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          style: {
            fontSize: '15px',
          },
        },
        min: 0,
        max: 35,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        tickAmount: 8,
        endOnTick: false,
        startOnTick: false,
        //reversed: true,
      },
      title: {
        text: null,
      },
    });
  }

  //1.
  function chartOptionM(param) {
    //if (param.length < 1) return;

    const arr_names = param?.map(obj => {
      return obj.user_name;
    });

    const arr_score = param?.map(obj => {
      return obj.totalscore * 1;
    });

    setChartMonth({
      series: [
        {
          data: arr_score, //[3,4,6,78,4,3,2,3,4]
          showInLegend: false,
          color: '#89C0E3',
          marker: {
            lineColor: '#89C0E3',
            lineWidth: '1',
            color: '#ffffff',
          },
          pointWidth: 30,
        },
      ],
      chart: {
        type: 'column',
        marginTop: '25',
        //height:'100%',
        backgroundColor: 'transparent',
      },
      xAxis: {
        categories: arr_names,
        title: null,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
      },
      yAxis: {
        title: {
          text: null,
          align: 'high',
          offset: 0,
          rotation: 0,
          y: -10,
          style: {
            fontSize: '15px',
          },
        },
        min: 0,
        max: 150,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        tickAmount: 16,
        endOnTick: false,
        startOnTick: false,
        //reversed: true,
      },
      title: {
        text: null,
      },
    });
  }

  const state = {
    //default value of the date time
    date: dateString,
  };

  return (
    <div className="contaner">
      <style jsx>{`
        * {
          margin: 0px;

          padding: 0px;
        }
        li {
          list-style: none;
        }
        a {
          text-decoration: none;
        }
        select {
          border: none;
          border-radius: 0;
          -webkit-appearance: none;
          -moz-appearance: none;
        }
        .contaner {
          width: 100%;
        }
        .main {
          height: 100.5px;
          background-color: orange;
        }
        .header {
          background-color: #fcbf77;
          height: 300px;
        }
        .footer {
          width: 1920px;
          height: 219px;
          background-color: orchid;
        }
        .header h1 {
          color: #ffffff;
          text-align: center;
          line-height: 300px;
          font-size: 36px;
          height: 230px;
        }

        .content {
          margin: 0 auto;
          width: 1280px;
          margin-bottom: 50px;
        }
        .textB {
          margin-top: 40px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .textB h1 {
          position: relative;
          font-size: 30px;
          line-height: 89px;
          left: 40px;
        }

        .graph {
          width: 1280px;
        }
        .date {
          width: 100%;
        }
        .date select {
          margin-top: 45px;
          margin-left: 30px;
          width: 80px;
          height: 40px;
          font-size: 16px;
        }
        .date h1 {
          margin-top: 40px;
          width: 100%;
        }
        .block {
          overflow: auto;
        }
        .day {
          width: 784px;
          height: 398px;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          float: left;
        }
        .num {
          width: 100%;
          height: 100%;
          padding: 33px 0;
          color: #9d9d9d;
          position: relative;
        }
        .num p {
          height: 12.5%;
          width: 10%;
        }
        .num p:nth-of-type(8) {
          float: left;
        }
        .students {
          width: 562px;
          height: 24px;
          float: left;
          text-align: center;
          margin: 18px auto;
        }
        \ .student {
          float: left;
          width: 20%;
        }
        .line {
          width: 692px;
          height: 301px;
          position: absolute;
          left: 10px;
          top: 15px;
        }
        .line div {
          height: 49px;
          box-sizing: border-box;
          border-top: 1px #ed936f dashed;
        }
        .box {
          width: 475px;
          height: 398px;
          background-color: #fc8454;
          float: right;
          border-radius: 32px;
          text-align: center;
        }
        .box table td {
          text-align: center;
        }
        .list-start {
          width: 371px;
          height: 18px;
          margin: 34px auto;
          line-height: 18px;
        }
        .list {
          display: inline-block;
          font-size: 12px;
          color: white;
          margin-right: -4px;
        }

        .list:nth-of-type(2) {
          margin-left: 35px;
        }
        .list:nth-of-type(3) {
          margin-left: 31px;
        }
        .list:nth-of-type(4) {
          margin-left: 31px;
        }
        .list:nth-of-type(5) {
          margin-left: 32px;
        }
        .list:nth-of-type(6) {
          margin-left: 32px;
        }
        hr {
          margin: 0 auto;
          width: 392.69px;
          background-color: #ffffff;

          opacity: 60%;
        }
        .list-section {
          height: 64px;
          text-align: left;

          margin-left: 47px;
          color: white;
          font-size: 14px;
        }
        .section {
          width: 16.6%;
          display: inline-block;
          color: white;
          margin-right: -4px;
        }
        .section:nth-of-type(1) {
          font-size: 20px;
        }
      `}</style>
      <div className="header">
        <h1>플래너 검사</h1>
        <Btn index="pla" />
      </div>
      <div className="content">
        <div className="textB">
          {cls?.map((f, i) => (
            <h1 key={i}>{f.clsnm}</h1>
          ))}
        </div>
        <div className="graph">
          <div className="date">
            <h1>일간 학업성취도</h1>
          </div>
          <div className="block">
            <div className="day">
              <div className="num">
                <HighchartsReact
                  highcharts={Highcharts}
                  containerProps={{style: {height: '100%'}}}
                  options={chartday}
                  allowChartUpdate={true}
                />
              </div>
            </div>

            <div className="box">
              <table>
                <thead>
                  <tr>
                    <td className="list-start">순위</td>
                    <td className="list-start">학생</td>
                    <td className="list-start">학업성취도</td>
                  </tr>
                </thead>
                <tbody>
                  {daylist != undefined &&
                    daylist?.map((obj, i) => {
                      return (
                        <tr key={i}>
                          <td className="list-section">{obj['rrank']}</td>
                          <td className="list-section">{obj['user_name']}</td>
                          <td className="list-section">{obj['acdmcscore']}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="graph">
          <div className="date">
            <h1>주간 학업성취도</h1>
          </div>
          <div className="block">
            <div className="day">
              <div className="num">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartweek}
                  containerProps={{style: {height: '100%'}}}
                  allowChartUpdate={true}
                />
              </div>
            </div>
            <div className="box">
              <table>
                <thead>
                  <tr>
                    <td className="list-start">순위</td>
                    <td className="list-start">학생</td>
                    <td className="list-start">학업성취도</td>
                  </tr>
                </thead>
                <tbody>
                  {weeklist != undefined &&
                    weeklist?.map((obj, i) => {
                      return (
                        <tr key={i}>
                          <td className="list-section">{obj['rrank']}</td>
                          <td className="list-section">{obj['user_name']}</td>
                          <td className="list-section">{obj['acdmcscore']}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="graph">
          <div className="date">
            <h1>월간 학업성취도</h1>
          </div>
          <div className="block">
            <div className="day">
              <div className="num">
                <HighchartsReact
                  highcharts={Highcharts}
                  options={chartmonth}
                  containerProps={{style: {height: '100%'}}}
                  allowChartUpdate={true}
                />
              </div>
            </div>
            <div className="box">
              <table>
                <thead>
                  <tr>
                    <td className="list-start">순위</td>
                    <td className="list-start">학생</td>
                    <td className="list-start">학업성취도</td>
                  </tr>
                </thead>
                <tbody>
                  {monthlist != undefined &&
                    monthlist?.map((obj, i) => {
                      return (
                        <tr key={i}>
                          <td className="list-section">{obj['rrank']}</td>
                          <td className="list-section">{obj['user_name']}</td>
                          <td className="list-section">{obj['acdmcscore']}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPayment(withDesktop(Planner, page), null, '플래너');
