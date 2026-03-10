import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {useEffect, useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import page from './healthapp';
import Btn from './myclass_btn';

const Health = () => {
  const [notice, setNotice] = useState([]); //1.공지사항
  const [cls, setcls] = useState([]);
  const [run, setRun] = useState([]); //달리기
  const [situps, setSitups] = useState([]); //윗몸일으키기
  const [pushups, setPushups] = useState([]); //팔굽혀펴기
  const today = new Date();
  const dateString =
    today.getFullYear() +
    '-' +
    ('0' + (today.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + today.getDate()).slice(-2);
  const [chartrun, setChartrun] = useState([]); //달리기차트
  const [chartsitups, setChartsitups] = useState([]); //윗몸일으키기차트
  const [chartpushups, setChartpushups] = useState([]); //팔굽혀펴기차트

  //공지사항 && 반명칭 가져오기
  useEffect(() => {
    axios
      .get('/api/planner/notice', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          dvsn: '6',
        },
      })
      .then(res => {
        setNotice(res.data.data);
        if (res.data.data.length != 0) {
          setcls(res.data.data[0].clsnm);
        } else {
          setcls('');
        }
      });
  }, []);

  //달리기 & 윗몸일으키기 & 팔굽혀펴기 가져오기
  useEffect(() => {
    axios
      .get('/api/planner/test', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          //dvsn: '6'
        },
      })
      .then(res => {
        if (res.data.data.length != 0) {
          setRun(res.data.data.filter(o => o.dvsn == '4')); //1.달리기 API 데이터 가져오기
          setSitups(res.data.data.filter(o => o.dvsn == '5')); //1.윗몸일으키기 API 데이터 가져오기
          setPushups(res.data.data.filter(o => o.dvsn == '6')); //1.팔굽혀펴기 API 데이터 가져오기

          changerun(res.data.data.filter(o => o.dvsn == '4'));
          changesitups(res.data.data.filter(o => o.dvsn == '5'));
          changepushups(res.data.data.filter(o => o.dvsn == '6'));
        } else {
          /*
                setRun(''); //1.달리기 API 데이터 가져오기
                setSitups(''); //1.윗몸일으키기 API 데이터 가져오기
                setPushups(''); //1.팔굽혀펴기 API 데이터 가져오기
                */
        }
      });
  }, []);

  //현재일자 가져오기
  const state = {
    //default value of the date time
    date: dateString,
  };

  //1.
  function changerun(param) {
    //if (param.length < 1) return;

    const arr_names = param.map(obj => {
      return obj.user_name;
    });

    const arr_score = param.map(obj => {
      return obj.score * 1;
    });

    setChartrun({
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
        },
      ],
      chart: {
        marginTop: '25',
        height: '450',
      },
      xAxis: {
        categories: arr_names,
        //[param.map(obj => obj.user_name)],
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
        min: 1,
        max: 8,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        endOnTick: false,
        startOnTick: false,
        reversed: false,
      },
      title: {
        text: null,
      },
    });
  }

  //2.
  function changesitups(param) {
    //if (param.length < 1) return;

    const arr_names = param.map(obj => {
      return obj.user_name;
    });

    const arr_score = param.map(obj => {
      return obj.score * 1;
    });

    setChartsitups({
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
        },
      ],
      chart: {
        marginTop: '25',
        height: '450',
      },
      xAxis: {
        categories: arr_names,
        //[param.map(obj => obj.user_name)],
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
        min: 1,
        max: 8,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        endOnTick: false,
        startOnTick: false,
        reversed: false,
      },
      title: {
        text: null,
      },
    });
  }

  //3.
  function changepushups(param) {
    //if (param.length < 1) return;

    const arr_names = param.map(obj => {
      return obj.user_name;
    });

    const arr_score = param.map(obj => {
      return obj.score * 1;
    });

    setChartpushups({
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
        },
      ],
      chart: {
        marginTop: '25',
        height: '450',
      },
      xAxis: {
        categories: arr_names,
        //[param.map(obj => obj.user_name)],
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
        min: 1,
        max: 8,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        endOnTick: false,
        startOnTick: false,
        reversed: false,
      },
      title: {
        text: null,
      },
    });
  }

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
          width: 1920px;
          height: 3233px;
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
          height: 1719px;
        }
        content h1 {
          font-size: 30px;
        }
        .textB {
          margin-top: 30px;

          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .textB h1 {
          position: relative;
          font-size: 30px;
          line-height: 59px;
          left: 40px;
        }
        .num {
          width: 814px;
          height: 447px;
          margin: 25px auto;
          color: #9d9d9d;
          position: relative;
        }
        .num p {
          height: 11.1%;
          width: 10%;
        }
        .num p:nth-of-type(9) {
          float: left;
        }
        .students {
          width: 562px;
          height: 24px;
          float: left;
          text-align: center;
          margin: 18px auto;
        }
        .student {
          float: left;
          width: 20%;
        }
        .line {
          width: 796px;
          height: 409px;
          position: absolute;
          left: 10px;
          top: 15px;
        }
        .line div {
          height: 49px;
          box-sizing: border-box;
          border-top: 1px #ed936f dashed;
        }
        .first {
          margin-top: 40px;
          width: 1280px;
          height: 600.5px;
        }
        .test {
          width: 620px;
          height: 228px;
          background-color: #fc8454;
          box-shadow: 3px 3px 16px #ed936f;
          border-radius: 20px;
          color: white;
        }
        .test h1 {
          width: 246px;
          position: relative;
          font-size: 36px;
          left: 42px;
          top: 28px;
        }
        .testImg {
          margin-top: 17px;
          width: 620px;
          height: 211px;
          background-image: url('https://img.ingipsy.com/assets/test.png');
        }
        .first .left {
          width: 620px;
          float: left;
        }
        .first .right {
          width: 620px;
          height: 468px;
          float: right;
          position: relative;
        }
        .first .right a p {
          font-size: 24px;
          position: absolute;
          right: 12px;
          top: 5px;
          color: #9d9d9d;
        }

        .notice {
          width: 620px;
          height: 468px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          font-size: 18px;
        }
        .notice .text {
          position: relative;
          top: 9px;
          left: 49px;
        }
        .notice .text p {
          margin-top: 48px;
        }
        .second {
          height: 669.5px;
        }
        .second .left .box {
          width: 900px;
          height: 507px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          float: left;
        }
        .second .left {
          width: 900px;
        }
        .second .left #subject {
          font-size: 16px;
          color: #9d9d9d;
        }
        .second .left #testName {
          font-size: 16px;
          color: #9d9d9d;
        }
        ul:nth-of-type(1) {
          color: #ed936f;
          font-size: 14px;
          width: 288.92px;
          height: 32px;
          margin-top: 37px;
        }
        ul:not(:nth-of-type(1)) {
          color: black;
          font-size: 20px;
          width: 288.92px;
          height: 78.5px;
          line-height: 78.5px;
        }
        ul:nth-of-type(1) {
          color: #ed936f;
        }
        ul li:nth-of-type(1) {
          color: #ed936f;
        }

        li {
          float: left;
        }
        li:nth-of-type(1) {
          margin-left: 37.6px;
        }
        li:nth-of-type(2) {
          margin-left: 36px;
        }
        li:nth-of-type(3) {
          margin-left: 99.4px;
        }
        hr {
          margin: auto;
          width: 288.92px;
        }
        .second .right {
          width: 337px;
          height: 507px;
          float: right;
          box-sizing: border-box;
          border: 1px #de6b3d solid;
          border-radius: 32px;
          box-shadow: 3px 3px 16px #ed936f;
        }

        .third {
          height: 669.5px;
        }
        .third .left {
          width: 900px;
        }
        .third .left .box {
          width: 900px;
          height: 507px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          float: left;
        }
        .third .right {
          width: 337px;
          height: 507px;
          float: right;
          box-sizing: border-box;
          border: 1px #de6b3d solid;
          border-radius: 32px;
          box-shadow: 3px 3px 16px #ed936f;
        }
        .third .left #subject {
          font-size: 16px;

          color: #9d9d9d;
        }
        .third .left #testName {
          font-size: 16px;

          color: #9d9d9d;
        }
        .drop {
          display: flex;
        }
        .drop h1 {
          font-size: 30px;
        }
        .drop select {
          margin-left: 41px;
          font-size: 16px;
        }
      `}</style>

      <div className="header">
        <h1>체력 검사</h1>
        <Btn />
      </div>
      <div className="content">
        <div className="textB">
          <h1>{cls}</h1>
        </div>
        <div className="first">
          <div className="left">
            <h1> 진행중인 테스트</h1>
            <div className="test">
              <h1> {state.date} </h1>
            </div>

            <div className="testImg"></div>
          </div>

          <div className="right">
            <h1>공지사항</h1>
            <div className="notice">
              <div className="text">
                {notice != undefined && notice.map(obj => <div className="">{obj.rmk}</div>)}
              </div>
            </div>
          </div>
        </div>

        <div className="second">
          <div className="left">
            <div className="drop">
              <h1>달리기</h1>
              <select name="" id="subject">
                <option value="">2021년</option>
                <option value="">2020년</option>
                <option value="">2019년</option>
              </select>

              <select name="" id="testName">
                <option value="">시험명</option>
              </select>
            </div>
            <div className="box">
              <HighchartsReact highcharts={Highcharts} options={chartrun} allowChartUpdate={true} />
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
                {run != undefined &&
                  run.map(obj => {
                    return (
                      <tr>
                        <td>{obj['rrank']}</td>
                        <td>{obj['user_name']}</td>
                        <td>{obj['score']}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="third">
          <div className="left">
            <div className="drop">
              <h1>윗몸 일으키기</h1>
              <select name="" id="subject">
                <option value="">2021년</option>
              </select>
              <select name="" id="testName">
                <option value="">시험명</option>
              </select>
            </div>
            <div className="box">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartsitups}
                allowChartUpdate={true}
              />
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
                {situps != undefined &&
                  situps.map(obj => {
                    return (
                      <tr>
                        <td>{obj['rrank']}</td>
                        <td>{obj['user_name']}</td>
                        <td>{obj['score']}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="third">
          <div className="left">
            <div className="drop">
              <h1>팔굽혀펴기</h1>
              <select name="" id="subject">
                <option value="">2021년</option>
              </select>
              <select name="" id="testName">
                <option value="">시험명</option>
              </select>
            </div>
            <div className="box">
              <HighchartsReact
                highcharts={Highcharts}
                options={chartpushups}
                allowChartUpdate={true}
              />
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
                {pushups != undefined &&
                  pushups.map(obj => {
                    return (
                      <tr>
                        <td>{obj['rrank']}</td>
                        <td>{obj['user_name']}</td>
                        <td>{obj['score']}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDesktop(Health, page);
