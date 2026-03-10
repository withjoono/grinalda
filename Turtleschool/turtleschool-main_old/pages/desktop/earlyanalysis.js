import React, {useState} from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import withPayment from '../../comp/paymentwrapper';
import Menu from '../../comp/analysismenu';
import useZnaesin from '../../comp/znaesin';
import SideNavPage from '../../comp/template/SideNavPageSusi';
import Buttons from '../early/Buttons/Buttons';

const Analysis = () => {
  const [btn, setBtn] = useState(1);
  const [chosen, setChosen] = useState(1);
  const {gpaAsk, setgpaAsk, chartTwo, setchartTwo, radio, setRadio, check, checkBlue, checkRed} =
    useZnaesin();

  const zNaesin = (
    <>
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
        body {
          width: 100%;
        }
        </style > <style > .contain {
          width: 100%;
          margin: auto;
        }
        .table h1 {
          font-size: 30px;
        }
        .border {
          width: 100%;
          height: 540px;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .border table {
          font-size: 15px;
          font-weight: bold;
          text-align: center;
          width: 90%;
          margin: auto;
          border-collapse: collapse;
          margin-top: 30px;
          border-top: 1px #363636 solid;
        }
        .border table tr td {
          height: 80px;
          width: 137.5px;
          border-bottom: 1px #cbcbcb solid;
          border-right: 1px #cbcbcb solid;
        }
        .border table tr td:nth-of-type(1),
        .border table tr:nth-of-type(1) td {
          background-color: #f6f6f6;
        }
        .border table tr td:nth-of-type(5) {
          background-color: #ffe8e8;
        }
        .border table tr td:nth-of-type(6) {
          background-color: #e8f3ff;
        }
        .border table tr:nth-of-type(1) td:nth-of-type(5) {
          background-color: #ffd5d5;
        }
        .border table tr:nth-of-type(1) td:nth-of-type(6) {
          background-color: #d5e8ff;
        }
        .graph {
          width: 100%;
          margin: 40px auto;
        }
        .graph h1 {
          font-size: 30px;
          font-weight: bold;
        }
        .graph .border {
          width: 100%;
          height: 540px;
          border: 1px #9d9d9d solid;
          margin-top: 10px;
          padding: 30px 45px;
          color: #9d9d9d;
        }
      `}</style>
      <div className="contain">
        <div className="table">
          <h1>편차분석(내신Z점수)</h1>
          <div className="border">
            <table>
              <thead>
                <tr>
                  <td>조합명</td>
                  <td>내신등급평균</td>
                  <td>내신백분위</td>
                  <td>내신Z점수</td>
                  <td>
                    Z점수
                    <br />
                    백분위
                  </td>
                  <td>
                    Z점수
                    <br />
                    환산내신
                  </td>
                  <td>
                    Z점수분위 환산내신-
                    <br />
                    내신등급 평균
                  </td>
                </tr>
              </thead>
              <tbody>
                {gpaAsk.map((obj, i) => {
                  return (
                    <tr key={i}>
                      <td>{obj['subjectare']}</td>
                      <td>{obj['grade1']}</td>
                      <td>{obj['grade2']}%</td>
                      <td>{obj['grade3']}</td>
                      <td>{obj['grade4']}%</td>
                      <td>{obj['grade5']}</td>
                      <td>{obj['grade6']}</td>
                    </tr>
                  );
                })}
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
            <span>
              {checkBlue} 내신 등급 평균 &nbsp;
              {checkRed} Z내신 등급 평균 <span style={{fontSize: '10px'}}>(연대 기준)</span>
            </span>
            <HighchartsReact highcharts={Highcharts} options={chartTwo} allowChartUpdate={true} />
          </div>
          <Buttons prevPage="early/input" nextPage="/early/graph" />
        </div>
      </div>
    </>
  );

  return (
    <>
      <SideNavPage
        routes={['홈', '수시 컨설팅', '교과/비교과 분석']}
        navTitle="교과/비교과 분석"
        navSubs={[
          {title: '1.교과/비교과 분석', url: '/early/input'},
          {title: '2.유리한 조건 찾기', url: '/early/jungsi-predict'},
          {title: '3.학종 컨설팅', url: '/early/Consulting1'},
          {title: '4.교과 컨설팅', url: '/early/Consulting2'},
          {title: '5.논술 컨설팅', url: '/nonsul/sci'},
          {title: '6.전략수립 및 모의지원', url: '/early/strategy'},
        ]}
      >
        <style jsx>{`
          .f {
            height: 80px;
            display: flex;
            align-items: flex-end;
          }
          .f > div {
            flex: 1 0 0;
            border-radius: 20px 20px 0 0;
            border: 1px solid #9d9d9d;
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
            background-color: #e8e8e8;
            color: #9d9d9d;
          }
          div.e:nth-of-type(1) {
            border-radius: 20px 0 0 0;
          }
          div.e:nth-of-type(2) {
            border-radius: 0 20px 0 0;
          }
        `}</style>
        <Menu index={1} title="교과/비교과 분석" />
        <div style={{width: '100%', margin: '0 auto'}}>
          <div className="menu">
            <button className={btn == 0 ? 'menu_active' : ''} onClick={() => setBtn(0)}>
              내신 분석
            </button>
            <button className={btn == 1 ? 'menu_active' : ''} onClick={() => setBtn(1)}>
              편차분석(내신Z점수)
            </button>
          </div>
          {btn == 0 ? (
            <>
              <div className="desktop_box" style={{width: '100%'}}>
                <table className="desktop_box_table">
                  <tr>
                    <th>전교과</th>
                    <th>국영수사</th>
                    <th>국영수과</th>
                    <th>
                      <p style={{lineHeight: 'initial'}}>
                        국영수사
                        <br />
                        +통합과학,통합사회
                      </p>
                    </th>
                    <th>
                      <p style={{lineHeight: 'initial'}}>
                        국영수과
                        <br />
                        +통합과학,통합사회
                      </p>
                    </th>
                    <th>국영수사과</th>
                    <th>국영수</th>
                  </tr>
                  <tr>
                    <td>1등급</td>
                    <td>1등급</td>
                    <td>1등급</td>
                    <td>1등급</td>
                    <td>1등급</td>
                    <td>1등급</td>
                    <td>1등급</td>
                  </tr>
                </table>
              </div>
              <div className="title_left" style={{marginTop: '30px'}}>
                학기별 내신
              </div>
              <div className="desktop_box" style={{width: '100%', height: '580px'}}>
                <HighchartsReact highcharts={Highcharts} />
              </div>
              <div className="title_left" style={{marginTop: '30px'}}>
                과목별/조합별 성적 변동 추이
              </div>
              <div className="f">
                <div className="d">과목별</div>
                <div className="e">조합별</div>
              </div>
              <div
                className="desktop_box"
                style={{
                  width: '100%',
                  height: '649px',
                  paddingTop: 0,
                  borderTop: 0,
                  borderRadius: '0 0 20px 20px',
                }}
              >
                <HighchartsReact highcharts={Highcharts} />
              </div>
            </>
          ) : (
            zNaesin
          )}
        </div>
      </SideNavPage>
    </>
  );
};

export default withPayment(Analysis, null, '수시');
