import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import {useEffect, useState} from 'react';
import withPayment from '../../comp/paymentwrapper';
import withDesktop from '../../comp/withdesktop';
import Btn from './myclass_btn';
import page from './schooldistrictapp';

const SimulatedTest = () => {
  const [exam, setExam] = useState(['1']); //모의고사시험내역
  const [grade, setGrade] = useState('1'); //학년
  const [optionsexam, setOptionsExam] = useState([]); //모의고사시험내역전체
  const [examrank1, setExamRank1] = useState([]);
  const [examrank2, setExamRank2] = useState([]);
  const [plclass, setPlclass] = useState([]);
  const [grapallsubject, setGrapAllSubject] = useState([]);
  const [grapsubject, setGrapSubjec] = useState([]);

  const [switcha, setSwitcha] = useState('P');
  const [switchb, setSwitchb] = useState('K');
  const [switchc, setSwitchc] = useState('P');
  const [allsubject, setallsubject] = useState([]);
  const [subject, setsubject] = useState([]);
  const [jisuButton, setJisuButton] = useState('P');
  const [gradeButton, setGradeButton] = useState('K');
  useEffect(() => {
    SelectExamTest(grade);
    Classinfo();
    //SelectExamRank();
    handleClick();
    //SelectSubject();

    //handleChangeExam();
    //handleChangeGrade();
  }, []);

  useEffect(() => {
    selectgrapallsubject(allsubject);
  }, [switcha]);

  useEffect(() => {
    selectgrapsubject(subject);
  }, [switchb, switchc]);
  useEffect(() => {}, [grapsubject]);

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
        setPlclass(res.data.data);
      });
  };

  //모의고사 조회
  const SelectExamTest = e => {
    axios
      .get('/api/myclass/codeexam', {
        headers: {
          auth: localStorage.getItem('realuid'),
        },
        params: {
          gradecd: e,
        },
      })
      .then(res => {
        if (res.data.data == null) {
          setOptionsExam([{id: 'nd', type: '해당년도 모의고사 내역이 없습니다'}]);
        } else {
          setOptionsExam(res.data.data);
          SelectExamRank(res.data.data[0].id);
        }
      });
  };

  //1그래프
  const SelectExamRank = e => {
    axios
      .get('/api/myclass/examAnalysis', {
        headers: {
          auth: localStorage.getItem('realuid'),
        },
        params: {
          dvcd: e,
        },
      })
      .then(res => {
        if (res.data.data != null && res.data.data.length != 0) {
          setallsubject(res.data.data);
          selectgrapallsubject(res.data.data);
        }
      });
  };

  //2그래프
  const SelectSubject = e => {
    axios
      .get('/api/myclass/examAnalysis', {
        headers: {
          auth: localStorage.getItem('realuid'),
        },
        params: {
          dvcd: e,
        },
      })
      .then(res => {
        if (res.data.data != null && res.data.data.length != 0) {
          setsubject(res.data.data);
          selectgrapsubject(res.data.data);
        }
      });
  };

  //학년 변경시 키이벤트
  const handleChangeGrade = e => {
    setGrade(e.target.value);
    SelectExamTest(e.target.value);
  };

  //모의고사 변경시 키이벤트
  const handleChangeExam = e => {
    setExam(e.target.value);
    SelectExamRank(e.target.value);
  };

  const optionsgrade = [
    {value: '1', label: '1학년'},
    {value: '2', label: '2학년'},
    {value: '3', label: '3학년'},
  ];

  //1 chart
  function selectgrapallsubject(param) {
    let mindata = 100;
    let maxdata = 800;
    let tickamount = 0;

    const arr_names = param.map(obj => {
      return obj.user_name;
    });

    let arr_score;

    if (switcha == 'P') {
      //표준점수
      mindata = 0;
      maxdata = 450;
      tickamount = 10;
      arr_score = param.map(obj => {
        return obj.all_standardscore * 1.0;
      });
    } else if (switcha == 'O') {
      //백분위
      mindata = 0;
      maxdata = 300;
      tickamount = 4;
      arr_score = param.map(obj => {
        return obj.all_score * 1.0;
      });
    } else if (switcha == 'G') {
      //등급
      mindata = 1;
      maxdata = 9;
      tickamount = 9;
      arr_score = param.map(obj => {
        return obj.all_grade * 1.0;
      });
    }
    setGrapAllSubject({
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
        min: mindata,
        max: maxdata,
        tickAmount: tickamount ? tickamount : undefined,
        reversed: switcha == 'G' ? true : false,
        labels: {
          style: {
            fontSize: '15px',
          },
        },
        endOnTick: false,
        startOnTick: false,
        //reversed: true
      },
      title: {
        text: null,
      },
    });
  }

  //2 chart
  function selectgrapsubject(param) {
    let mindata = 100;
    let maxdata = 800;
    let tickamount = 0;

    const arr_names = param.map(obj => {
      return obj.user_name;
    });

    let arr_score;

    if (switchb == 'K') {
      if (switchc == 'P') {
        mindata = 0;
        maxdata = 450;
        tickamount = 10;
        arr_score = param.map(obj => {
          return obj.korea_score * 1.0;
        });
      } else if (switchc == 'G') {
        mindata = 1;
        maxdata = 9;
        tickamount = 9;
        arr_score = param.map(obj => {
          return {y: (obj.korea_grade * 1.0) % 9 || 9, low: 9};
        });
      } else if (switchc == 'O') {
        mindata = 0;
        maxdata = 300;
        tickamount = 4;
        arr_score = param.map(obj => {
          return obj.korea_standardscore * 1.0;
        });
      }
    } else if (switchb == 'E') {
      if (switchc == 'P') {
        mindata = 0;
        maxdata = 450;
        tickamount = 10;
        arr_score = param.map(obj => {
          return obj.english_score * 1.0;
        });
      } else if (switchc == 'G') {
        mindata = 1;
        maxdata = 9;
        tickamount = 9;
        arr_score = param.map(obj => {
          return {y: (obj.english_grade * 1.0) % 9 || 9, low: 9};
        });
      } else if (switchc == 'O') {
        mindata = 0;
        maxdata = 300;
        tickamount = 4;
        arr_score = param.map(obj => {
          return obj.english_standardscore * 1.0;
        });
      }
    } else if (switchb == 'M') {
      if (switchc == 'P') {
        mindata = 0;
        maxdata = 450;
        tickamount = 10;
        arr_score = param.map(obj => {
          return obj.math_score * 1.0;
        });
      } else if (switchc == 'G') {
        mindata = 1;
        maxdata = 9;
        tickamount = 9;
        arr_score = param.map(obj => {
          return {y: (obj.math_grade * 1.0) % 9 || 9, low: 9};
        });
      } else if (switchc == 'O') {
        mindata = 0;
        maxdata = 300;
        tickamount = 4;
        arr_score = param.map(obj => {
          return obj.math_standardscore * 1.0;
        });
      }
    }
    if (switchb == 'A') {
      if (switchc == 'P') {
        mindata = 0;
        maxdata = 450;
        tickamount = 10;
        arr_score = param.map(obj => {
          return obj.soc_score * 1.0;
        });
      } else if (switchc == 'G') {
        mindata = 1;
        maxdata = 9;
        tickamount = 9;
        arr_score = param.map(obj => {
          return {y: (obj.soc_grade * 1.0) % 9 || 9, low: 9};
        });
      } else if (switchc == 'O') {
        mindata = 0;
        maxdata = 300;
        tickamount = 4;
        arr_score = param.map(obj => {
          return obj.soc_standardscore * 1.0;
        });
      }
    }
    setGrapSubjec({
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
        type: 'column',
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

        min: mindata,
        max: maxdata,
        tickAmount: tickamount ? tickamount : undefined,
        reversed: switchc == 'G' ? true : false,

        labels: {
          style: {
            fontSize: '15px',
          },
        },

        endOnTick: false,
        startOnTick: false,
      },
      title: {
        text: null,
      },
    });
  }

  const handleClick = e => {
    if (e == 'O') {
      setSwitcha('O');
    } else if (e == 'G') {
      setSwitcha('G');
    } else if (e == 'P') {
      setSwitcha('P');
    }
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
          height: 2921px;
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
          width: 1200px;
          height: 24px;
          float: left;
          text-align: center;
          margin: 18px auto;
          font-size: 16px;
        }
        .student {
          float: left;
          width: 20%;
        }
        .line {
          width: 796px;
          height: 409px;
          position: absolute;
          left: 30px;
          top: 15px;
        }
        .line div {
          height: 49px;
          box-sizing: border-box;
          border-top: 1px #ed936f dashed;
        }
        .menu ul {
          height: 50px;
        }
        .menu li {
          float: left;
          width: 120px;
          height: 36px;
          margin-top: 16px;
          margin-left: 25px;
        }
        .menu .p:nth-of-type(1) {
          line-height: 39px;
          width: 70px;
        }
        .menu .p:nth-of-type(1) {
          line-height: 39px;
          width: 70px;
        }
        .menu li:nth-of-type(2) {
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
        }
        .menu li:nth-of-type(2):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .menu li:nth-of-type(3) {
          margin-left: 8px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
        }
        .menu li:nth-of-type(3):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .menu li:nth-of-type(4) {
          margin-left: 8px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
        }
        .menu li:nth-of-type(4):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .menu li:nth-of-type(5) {
          margin-left: 8px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
        }
        .menu li:nth-of-type(5):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .graph1 {
          margin: 30px;
          width: 1280px;
          height: 767.3px;
        }
        .graph1 .box {
          margin-top: 14px;
          width: 1290px;
          height: 540px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .graph1 .num {
          width: 1222px;
          height: 447px;
          margin: 25px auto;
          color: #9d9d9d;
          position: relative;
        }
        .graph1 .line {
          width: 1199px;
          position: absolute;
        }
        .graph1 .students {
          height: 24px;
          float: left;
          text-align: center;
          margin: 18px auto;
        }
        .graph1 .student {
          float: left;
          width: 20%;
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
        .graph2 {
          margin: 30px;
          width: 1280px;
          height: 767.3px;
        }
        .graph2 .box {
          margin-top: 14px;
          width: 620.3px;
          height: 540px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .graph2 .num {
          width: 562px;
          height: 447px;
          margin: 25px auto;
          color: #9d9d9d;
          position: relative;
        }
        .graph2 .line {
          width: 544px;
          position: absolute;
        }
        .graph2 .students {
          width: 425px;
          height: 24px;
          float: left;
          text-align: center;
          margin: 16px auto;
        }
        .graph2 .student {
          float: left;
          width: 25%;
        }
        .left {
          width: 620.3px;
          float: left;
        }
        .right {
          width: 620px;
          float: right;
        }
        .menu li:nth-of-type(1) {
          line-height: 39px;
          width: 70px;
        }

        .menu li:nth-of-type(2) {
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
          width: 66px;
        }
        .menu li:nth-of-type(2):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .menu li:nth-of-type(3) {
          margin-left: 8px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
          width: 66px;
        }
        .menu li:nth-of-type(3):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .menu li:nth-of-type(4) {
          margin-left: 8px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
          width: 66px;
        }
        .menu li:nth-of-type(4):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
        .menu li:nth-of-type(5) {
          margin-left: 8px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
          text-align: center;
          line-height: 36px;
          width: 66px;
        }
        .menu li:nth-of-type(5):hover {
          background-color: #de6b3d;
          cursor: pointer;
        }
      `}</style>

      <div className="header">
        <h1>모의고사 관리</h1>
        <Btn />
      </div>
      <div className="content">
        <div className="textB">
          {plclass.map(f => (
            <h1>{f.clsnm}</h1>
          ))}
        </div>

        <div className="graph1">
          <div className="drop">
            <h1>교육청 모의 순위(전과목)</h1>
            <select name="" id="" value={grade} onChange={handleChangeGrade}>
              {optionsgrade && optionsgrade.length > 0
                ? optionsgrade.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      name={option.label}
                      defaultValue={'1'}
                    >
                      {option.label}
                    </option>
                  ))
                : null}
            </select>

            <select name="" id="" value={exam} onChange={handleChangeExam}>
              {optionsexam && optionsexam.length > 0
                ? optionsexam.map(option => (
                    <option key={option.id} value={option.id} name={option.type} defaultValue={''}>
                      {option.type}
                    </option>
                  ))
                : null}
            </select>
          </div>
          <div className="menu">
            <ul>
              <li>지수 점수</li>
              <li className="P" onClick={e => setSwitcha('P')}>
                표준
              </li>
              <li className="G" onClick={e => setSwitcha('G')}>
                등급
              </li>
              <li className="O" onClick={e => setSwitcha('O')}>
                백분위
              </li>
            </ul>
          </div>
          <div className="box">
            <div className="num">
              <HighchartsReact
                highcharts={Highcharts}
                options={grapallsubject}
                allowChartUpdate={true}
              />
            </div>
          </div>
        </div>

        <div className="graph1">
          <h1>과목별 모의 순위(과목별)</h1>

          <div className="menu">
            <ul>
              <li>과목 선택</li>
              <li onClick={() => setSwitchb('K')}>국어</li>
              <li onClick={() => setSwitchb('M')}>수학</li>
              <li onClick={() => setSwitchb('E')}>영어</li>
              <li onClick={() => setSwitchb('A')}>탐구</li>
            </ul>

            <ul>
              <li>지수 선택</li>
              <li onClick={() => setSwitchc('O')}>표준</li>
              <li onClick={() => setSwitchc('G')}>등급</li>
              <li onClick={() => setSwitchc('P')}>백분위</li>
            </ul>
          </div>

          <div className="box">
            <div className="num">
              <HighchartsReact
                highcharts={Highcharts}
                options={grapsubject}
                allowChartUpdate={true}
              />
            </div>
          </div>
        </div>
        {/* <div className="graph2">
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
            </div> */}
      </div>
    </div>
  );
};

export default withPayment(withDesktop(SimulatedTest, page), null, '플래너');
