import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import React, {useState} from 'react';
import Menu from '../../comp/mouimenu';
import SideNavPage from '../../comp/template/SideNavPageSusi';


if (typeof Highcharts === 'object') {
  HighchartsMore(Highcharts);
}

const Examuniversity = props => {
  const {area, line, recruit_group, departmentGroup} = props;
  const [left, setLeft] = useState(true);
  const [data, setData] = useState([]);
  const [totalRange, setTotalRange] = useState([0, 0]);
  const [chosen, setChosen] = useState('');
  const [univData, setUnivData] = useState([]);
  const [areaCode, setAreaCode] = useState('');
  const [lineCode, setLineCode] = useState('');
  const [group, setGroup] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const search = () => {
    axios
      .get('/api/moui', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          area: areaCode,
          line: lineCode,
        },
      })
      .then(r => {
        setTotalRange([
          Math.max(
            0,
            Math.max.apply(
              Math,
              r.data.data.map(d => d[0]),
            ),
          ),
          Math.min(
            0,
            Math.min.apply(
              Math,
              r.data.data.map(d => d[1]),
            ),
          ),
        ]);
        setData(r.data.data);
      });
  };

  const searchTwo = () => {
    axios
      .get('/api/moui/department', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          area: areaCode,
          line: lineCode,
          query: searchQuery,
          group: group,
        },
      })
      .then(r => {
        setTotalRange([
          Math.max(
            0,
            Math.max.apply(
              Math,
              r.data.data.map(d => d[3] - d[4]),
            ),
          ),
          Math.min(
            0,
            Math.min.apply(
              Math,
              r.data.data.map(d => d[3] - d[4]),
            ),
          ),
        ]);
        setData(r.data.data);
      });
  };

  const click = e => {
    setChosen(e.target.value);
    axios
      .get('/api/moui/university', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          univ: e.target.value,
        },
      })
      .then(r => {
        setUnivData(r.data.data);
      });
  };

  const getRange = (min, max) => {
    const a = ((min - totalRange[1]) / (totalRange[0] - totalRange[1])) * 100;
    const b = ((totalRange[0] - max) / (totalRange[0] - totalRange[1])) * 100;
    return (
      <div className="a">
        <style jsx>{`
          .a {
            height: 100%;
            width: 33%;
            position: relative;
          }
          .b {
            position: absolute;
            background: #89c0e3 0% 0% no-repeat padding-box;
            top: ${b}%;
            height: calc(100% - ${b}% - ${a}%);
            width: 100%;
          }
        `}</style>
        <div className="b" />
      </div>
    );
  };
  const getRangeTwo = value => {
    const a = ((value - totalRange[1]) / (totalRange[0] - totalRange[1])) * 100;
    return (
      <div className="a">
        <style jsx>{`
          .a {
            width: 33%;
            margin: 0 auto;
            position: relative;
            display: flex;
            justify-content: center;
          }
          .b {
            position: absolute;
            background: #89c0e3 0% 0% no-repeat padding-box;
            height: 20px;
            width: 20px;
            border-radius: 20px;
            bottom: ${a}%;
          }
        `}</style>
        <div className="b" />
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .btns {
          display: flex;
          border-bottom: 1px solid #fede01;
          margin-right: -5px;
          margin-bottom: 25px;
        }
        .btns > div {
          margin-right: 5px;
          margin-bottom: -1px;
          border: 1px solid #fede01;
          width: 180px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .searchbtns {
          display: flex;
          margin-right: -40px;
          margin-bottom: 30px;
          justify-content: center;
        }
        .searchbtns > div {
          margin-right: 40px;
        }
        .bigbtn {
          width: 240px;
          height: 51px;
          background: transparent linear-gradient(135deg, var(---de6b3d_main) 0%, #d86132 100%) 0%
            0% no-repeat padding-box;
          background: transparent linear-gradient(135deg, #de6b3d 0%, #d86132 100%) 0% 0% no-repeat
            padding-box;
          box-shadow: 3px 3px 12px #ed936fa0;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font: normal normal medium 18px/27px Noto Sans CJK KR;
          letter-spacing: 0px;
          color: #ffffff;
          margin: 40px auto 40px;
        }
        .unibtns {
          display: flex;
          margin-right: -40px;
          border-bottom: 1px solid #eeeeee;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .unibtns > div {
          flex: 1 0 21%;
          margin-right: 40px;
          margin-bottom: 40px;
          border: 1px solid #fede01;
          width: 180px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .results {
          display: flex;
          max-width: 470px;
          flex-direction: column;
          margin: 66px auto 60px;
        }
        .results > div {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 17px;
        }
        .unibtn {
          background-color: #fede01;
          height: 40px;
          width: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          cursor: pointer;
          color: white;
        }
        .active {
          color: white;
          background-color: #fede01;
        }
        .bars {
          margin: 0;
          width: 290px;
          padding: 3px 0 12px;
        }
        .bars > div {
          border-top: 1px solid rgb(230, 230, 230);
        }
        .bars > div:last-child {
          border-bottom: 1px solid rgb(230, 230, 230);
        }
        .cell {
          margin-right: 35px;
        }
        .univTable {
          width: 100%;
          border: 1px solid #cbcbcb;
          border-top: 2px solid #cbcbcb;
        }
        .univTable > * {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #cbcbcb;
          height: 45px;
        }
        .first {
          font: normal normal bold 18px/27px Noto Sans CJK KR;
          flex: 0 0 130px;
          text-align: center;
        }
        .rest {
          font: normal normal normal 16px/24px Noto Sans CJK KR;
          flex: 0 0 110px;
          text-align: center;
        }
        .ace {
          font: normal normal bold 16px/24px Noto Sans CJK KR;
          letter-spacing: 0px;
          color: #de6b3d;
        }
        .tt {
          display: flex;
          height: 646px;
        }
        .tt > *:first-child {
          flex: 0 0 70%;
          margin-right: 25px;
        }
        .tt > *:nth-child(2) {
          flex: 0 0 30%;
        }
        .graph {
          overflow-x: scroll;
          overflow-y: hidden;
          width: 100%;
          background-color: white;
          height: 100%;
        }
        .gridarea {
          display: flex;
          height: calc(100% - 60px);
        }
        .grid {
          flex: 0 0 120px;
          height: 100%;
          border-right: 1px solid #9d9d9d;
          display: flex;
          justify-content: center;
        }
        .bottom {
          display: flex;
        }
        .bottom > * {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          font: normal normal medium 16px/24px Noto Sans CJK KR;
          letter-spacing: 0px;
          color: #2d2d2d;
          flex: 0 0 120px;
        }
        .smm {
          width: 96px;
          height: 23px;
          background: var(---ffffff_wh) 0% 0% no-repeat padding-box;
          border: 1px solid var(---de6b3d_main);
          background: #ffffff 0% 0% no-repeat padding-box;
          border: 1px solid #de6b3d;
          border-radius: 4px;
          cursor: pointer;
        }
        .groups {
          background-color: white;
          overflow-y: scroll;
          overflow-x: hidden;
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 300px !important;
        }
        .groups > * {
          font: normal normal bold 18px/27px Noto Sans CJK KR;
          letter-spacing: 0px;
        }
        .in {
          padding: 0 30px;
          font: normal normal normal 16px/24px Noto Sans CJK KR;
          width: 100%;
        }
      `}</style>
    <SideNavPage 
    routes={['']}
    navTitle="교과/비교과 분석"
    navSubs={[
      {title: '1.채점하기/점수 입력', url: '/mockup/inputchoice '},
      {title: '2.성적 분석', url: '/mockup/mygrade'},
      {title: '3.오답 분석', url: '/mockup/graph'},
      {title: '4.대학 예측 및 검색', url: '/mockup/university'},
      {title: '5.목표대학', url: '/mockup/prediction'},
    ]}
  >
      
      <Menu index={3} />
      <div style={{width: '1280px', margin: '0 auto 60px'}}>
        <div className="menu">
          <button className={left ? 'menu_active' : 'menu_inactive'} onClick={() => setLeft(true)}>
            대학별 검색
          </button>
          <button className={left ? 'menu_inactive' : 'menu_active'} onClick={() => setLeft(false)}>
            학과별 검색
          </button>
        </div>
        <div className="title_left">대학 검색</div>
        <div className="univTable">
          <div>
            <div className="first">지역 선택</div>
            {area.map(a => (
              <button
                value={a.code}
                className={areaCode == a.code ? 'rest ace' : 'rest'}
                onClick={e => setAreaCode(e.target.value)}
              >
                {a.name}
              </button>
            ))}
          </div>
          <div>
            <div className="first">수리 선택</div>
            {line.map(a => (
              <button
                value={a.code}
                className={lineCode == a.code ? 'rest ace' : 'rest'}
                onClick={e => setLineCode(e.target.value)}
              >
                {a.name}
              </button>
            ))}
          </div>
          {!left ? (
            <>
              <div>
                <input
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                  }}
                  placeholder="학과 입력 하세요"
                  className="in"
                />
              </div>
              <div className="groups">
                {departmentGroup.map(a => (
                  <button
                    value={a.name}
                    className={group == a.name ? 'orange_txt' : ''}
                    onClick={e => setGroup(e.target.value)}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
        <div className="bigbtn" onClick={left ? search : searchTwo}>
          선택 조건으로 검색하기
        </div>
        {data.length ? (
          data[0].length == 4 ? (
            <>
              <div className="tt">
                <div className="desktop_box">
                  <div className="graph">
                    <div className="gridarea">
                      {data.map(d => (
                        <div className="grid">{getRange(d[1], d[0])}</div>
                      ))}
                    </div>
                    <div className="bottom">
                      {data.map(d => (
                        <div>{d[2]}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="desktop_box" style={{overflowX: 'hidden', overflowY: 'scroll'}}>
                  <table className="desktop_box_table">
                    <tr>
                      <th>대학</th>
                      <th>학과 합격 예측</th>
                    </tr>
                    {data.map(r => (
                      <tr>
                        <td>{r[2]}</td>
                        <td>
                          <button className="smm" value={r[3]} onClick={click}>
                            학과 합격 예측
                          </button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="tt">
                <div className="desktop_box">
                  <div className="graph">
                    <div className="gridarea">
                      {data.map(d => (
                        <div className="grid">{getRangeTwo(d[3] - d[4])}</div>
                      ))}
                    </div>
                    <div className="bottom">
                      {data.map(d => (
                        <div>
                          <p>{d[1]}</p>
                          <p>{d[2]}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="desktop_box" style={{overflowX: 'hidden', overflowY: 'scroll'}}>
                  <table className="desktop_box_table">
                    <tr>
                      <th>대학</th>
                      <th>학과 합격 예측</th>
                    </tr>
                    {data.map(d => (
                      <tr>
                        <td>
                          <p>{d[1]}</p>
                          <p>{d[2]}</p>
                        </td>
                        <td>
                          {d[4] + '점/' + d[3] + '점'} - {d[4] >= d[3] ? '합격' : '불합격'}
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </>
          )
        ) : null}
        <div style={{width: '100%', height: '60px'}} />
        {univData.length ? (
          <>
            <div className="tt" style={{marginTop: '60px'}}>
              <div className="desktop_box">
                <div className="graph">
                  <div className="gridarea">
                    {univData.map(d => (
                      <div className="grid">{getRangeTwo(d[2] - d[3])}</div>
                    ))}
                  </div>
                  <div className="bottom">
                    {univData.map(d => (
                      <div>{d[0]}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="desktop_box" style={{overflowX: 'hidden', overflowY: 'scroll'}}>
                <table className="desktop_box_table">
                  <tr>
                    <th>학과</th>
                    <th>학과 합격 예측</th>
                  </tr>
                  {univData.map(r => (
                    <tr>
                      <td>{r[0]}</td>
                      <td>
                        {r[3] + '점/' + r[2] + '점'} - {r[3] >= r[2] ? '합격' : '불합격'}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
      </SideNavPage>
    </>
  );
};

export default Examuniversity;
