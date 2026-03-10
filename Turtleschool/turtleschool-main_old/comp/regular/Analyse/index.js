import {UserAgent, UserAgentProvider} from '@quentin-sommer/react-useragent';
import axios from 'axios';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import Advice from '../../Advice';
import * as S from './index.style';

import {Chart, registerables, CategoryScale} from 'chart.js/auto';
import {Bar} from 'react-chartjs-2';
import {codeNameTable, codeTable} from '../../../common/code';

const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};

const Analyse = (props) => {
  

  const userScore = props?.userScore.userScore;
  return (
    <UserAgentProvider ua={window.navigator.userAgent}>
      <S.Container>
        <MyScore userScore={userScore}/>
        <Percentage />
        <Combination />
      </S.Container>
    </UserAgentProvider>
  );
};

const MyScore = (userScore) => {

  console.log('userScore : ', userScore);
  const [myScore, setMyScore] = useState([]);

  useEffect(() => {
    _getMyScore();
  }, []);

  const _getMyScore = () => {
    const url = '/api/csat/selectanalysis_1';
    const params = {division: 1, year: '2022'};

    axios
      .get(url, {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: params,
      })
      .then(res => {
        console.log('data : ', res?.data.data);
        const response = {api: url, msg: res.data.data};
        setMyScore(res.data.data || []);
      })
      .catch(e => {
        console.log(e);
      });
  };



    if(userScore.userScore){
      for(let i =0; i < userScore.userScore.length; i++){
     
        Object.keys(codeNameTable).map((item,index) => {
          
          if(userScore.userScore[i].subject_a === item){
           
            userScore.userScore[i].subject_a = codeNameTable[item];
           
            Object.keys(codeTable.과목코드).map((item2,index2)=> {
              for(let j=0; j < codeTable.과목코드[item2].length; j++){
                if(item === codeTable.과목코드[item2][j]){
                  userScore.userScore[i].title = item2;
                }
              }
            })
          
          
          }

        })
      }
    }


    if(myScore.length > 0){
      for(let i =0; i < myScore.length; i++){
     
        Object.keys(codeNameTable).map((item,index) => {
          
          if(myScore[i].subject_a === item){
           
            myScore[i].subject_a = codeNameTable[item];
           
            Object.keys(codeTable.과목코드).map((item2,index2)=> {
              for(let j=0; j < codeTable.과목코드[item2].length; j++){
                if(item === codeTable.과목코드[item2][j]){
                  myScore[i].title = item2;
                }
              }
            })
          
          
          }

        })
      }
    }
  

  console.log('userScore : ', userScore);
  console.log('myScore : ', myScore);

    

  

  const renderStandardScore = () => {
    return (
      <tr>
        <S.MyScoreTD>{'표준점수'}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[0]?.standardscore}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[1]?.standardscore}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[4]?.standardscore}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[5]?.standardscore}</S.MyScoreTD>
        <S.MyScoreTD>
          {parseInt(myScore[4]?.standardscore) + parseInt(myScore[5]?.standardscore) || ''}
        </S.MyScoreTD>
        <S.MyScoreTD>-</S.MyScoreTD>
        <S.MyScoreTD>-</S.MyScoreTD>
        <S.MyScoreTD>-</S.MyScoreTD>
      </tr>
    );
  };

  const renderPercentage = () => {
    return (
      <tr>
        <S.MyScoreTD>{'백분위'}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[0]?.percentage}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[1]?.percentage}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[4]?.percentage}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[5]?.percentage}</S.MyScoreTD>
        <S.MyScoreTD>
          {(parseInt(myScore[4]?.percentage) + parseInt(myScore[5]?.percentage)) / 2 || ''}
        </S.MyScoreTD>
        <S.MyScoreTD>{myScore[2]?.percentage}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[3]?.percentage}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[6]?.percentage}</S.MyScoreTD>
      </tr>
    );
  };

  const renderGrade = () => {
    return (
      <tr>
        <S.MyScoreTD>{'등급'}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[0]?.grade}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[1]?.grade}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[4]?.grade}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[5]?.grade}</S.MyScoreTD>
        <S.MyScoreTD>
          {(parseInt(myScore[4]?.grade) + parseInt(myScore[5]?.grade)) / 2 || ''}
        </S.MyScoreTD>
        <S.MyScoreTD>{myScore[2]?.grade}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[3]?.grade}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[6]?.grade}</S.MyScoreTD>
      </tr>
    );
  };

  const renderCumulative = () => {
    return (
      <tr>
        <S.MyScoreTD>{'상위누적'}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[0]?.cumulative}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[1]?.cumulative}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[4]?.cumulative}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[5]?.cumulative}</S.MyScoreTD>
        <S.MyScoreTD>{(parseFloat(myScore[4]?.cumulative) + parseFloat(myScore[5]?.cumulative) ) / 2}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[2]?.cumulative}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[3]?.cumulative}</S.MyScoreTD>
        <S.MyScoreTD>{myScore[6]?.cumulative}</S.MyScoreTD>
      </tr>
    );
  };
  return (
    <S.Content>
      <S.ContentTitle>{'내 성적'}</S.ContentTitle>
      <S.MoblieOverflowContainer>
        <S.ContentTable>
          <tr>
            <S.MyScoreTH rowSpan={2}>{'구분'}</S.MyScoreTH>
            <S.MyScoreTH rowSpan={2}>{'국어'}</S.MyScoreTH>
            <S.MyScoreTH rowSpan={2}>{'수학'}</S.MyScoreTH>
            <S.MyScoreTH colSpan={3}>{'탐구'}</S.MyScoreTH>
            <S.MyScoreTH rowSpan={2}>{'영어'}</S.MyScoreTH>
            <S.MyScoreTH rowSpan={2}>{'한국사'}</S.MyScoreTH>
            <S.MyScoreTH rowSpan={2}>{'제2외국어'}</S.MyScoreTH>
          </tr>
          <tr>
            <S.MyScoreTH>{myScore[4]?.lar_subject_nm}<br/>[{myScore[4]?.subject_a}]</S.MyScoreTH>
            <S.MyScoreTH>{myScore[5]?.lar_subject_nm}<br/>[{myScore[5]?.subject_a}]</S.MyScoreTH>
            <S.MyScoreTH>{'탐구합'}</S.MyScoreTH>
          </tr>
          {renderStandardScore()}
          {renderPercentage()}
          {renderGrade()}
          {renderCumulative()}
        </S.ContentTable>
      </S.MoblieOverflowContainer>
    </S.Content>
  );
};

const Percentage = () => {
  const [myScore, setMyScore] = useState([]);
  const [lineTestData, setLineTestData] = useState({
    labels: ['A그룹', 'B그룹', 'C그룹', 'D그룹'],
    datasets: [
      {
        label: '상위누적',
        data: [20, 20, 10, 20, 30],
        borderColor: '#656565',
        backgroundColor: '#00000090',
      },
    ],
  });

  useEffect(() => {
    _getAnalysis();
  }, []);

  const _getAnalysis = () => {
    const url = '/api/csat/selectanalysis_2';
    const params = {division: 1, year: '2022'};
    axios
      .get(url, {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: params,
      })
      .then(res => {
        if (res.data.success) {
          const response = {api: url, data: res.data?.data};
        }
        setMyScore(res.data.data);

        const data = res.data.data
          .filter(score => score.cumulative)
          .map(score => [parseInt(score.cumulative), 100]);
        setLineTestData(prev => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data,
            },
          ],
        }));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const renderGroup = (title, index) => {
    return (
      <>
        <tr>
          <S.AnalyseTD style={{width: 40, padding: '0px 4px'}} rowSpan={2}>
            {title}
          </S.AnalyseTD>
          <S.AnalyseTH>{'반영비율'}</S.AnalyseTH>
          <S.AnalyseTD>{myScore[index]?.korea_standard}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index]?.math_standard}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index]?.ex_standard}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index]?.sum_standard}</S.AnalyseTD>
          <S.AnalyseTD>
            {myScore[index]?.cumulative ? `${myScore[index]?.cumulative}%` : ''}
          </S.AnalyseTD>
        </tr>
        <tr>
          <S.AnalyseTD>{'내점수'}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index + 1]?.korea_standard}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index + 1]?.math_standard}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index + 1]?.ex_standard}</S.AnalyseTD>
          <S.AnalyseTD>{myScore[index + 1]?.sum_standard}</S.AnalyseTD>
          <S.AnalyseTD>
            {myScore[index + 1]?.cumulative ? `${myScore[index + 1]?.cumulative}%` : ''}
          </S.AnalyseTD>
        </tr>
      </>
    );
  };
  return (
    <S.Content>
      <S.ContentTitle>{'반영비율 차이에 따른 분석(국수탐(2) 기준)'}</S.ContentTitle>
      <S.RowLayout>
        <UserAgent computer>
          <S.ContentTable style={{width: '64%'}}>
            <tr>
              <S.AnalyseTH colSpan={2} style={{width: '30%'}}>
                {'조합'}
              </S.AnalyseTH>
              <S.AnalyseTH>{'국어'}</S.AnalyseTH>
              <S.AnalyseTH>{'수학'}</S.AnalyseTH>
              <S.AnalyseTH>{'탐구'}</S.AnalyseTH>
              <S.AnalyseTH>{'합계'}</S.AnalyseTH>
              <S.AnalyseTH>{'상위누적'}</S.AnalyseTH>
            </tr>
            <tr>
              <S.AnalyseTD colSpan={2}>{'가중치 적용전 내 점수'}</S.AnalyseTD>
              <S.AnalyseTD>{myScore[0]?.korea_standard}</S.AnalyseTD>
              <S.AnalyseTD>{myScore[0]?.math_standard}</S.AnalyseTD>
              <S.AnalyseTD>{myScore[0]?.ex_standard}</S.AnalyseTD>
              <S.AnalyseTD>{myScore[0]?.sum_standard}</S.AnalyseTD>
              <S.AnalyseTD>
                {myScore[0]?.cumulative ? `${myScore[0]?.cumulative}%` : ''}
              </S.AnalyseTD>
            </tr>
            {renderGroup('A그룹\n(중앙대, 성대 등)', 1)}
            {renderGroup('B그룹\n(가톨릭대 등)', 3)}
            {renderGroup('C그룹\n(서강대 등)', 5)}
            {renderGroup('D그룹\n(서울대 등)', 7)}
          </S.ContentTable>
        </UserAgent>
        <UserAgent mobile>
          <S.MoblieOverflowContainer>
            <S.ContentTable style={{width: '200%'}}>
              <tr>
                <S.AnalyseTH colSpan={2} style={{width: '25%'}}>
                  {'조합'}
                </S.AnalyseTH>
                <S.AnalyseTH style={{width: '10%'}}>{'국어'}</S.AnalyseTH>
                <S.AnalyseTH style={{width: '10%'}}>{'수학'}</S.AnalyseTH>
                <S.AnalyseTH style={{width: '10%'}}>{'탐구'}</S.AnalyseTH>
                <S.AnalyseTH style={{width: '10%'}}>{'합계'}</S.AnalyseTH>
                <S.AnalyseTH style={{width: '10%'}}>{'상위누적'}</S.AnalyseTH>
              </tr>
              <tr>
                <S.AnalyseTD colSpan={2}>{'가중치 적용전 내 점수'}</S.AnalyseTD>
              </tr>
              {renderGroup('A그룹\n(중앙대, 성대 등)')}
              {renderGroup('B그룹 (가톨릭대 등)')}
              {renderGroup('C그룹 (서강대 등)')}
              {renderGroup('D그룹 (서울대 등)')}
            </S.ContentTable>
          </S.MoblieOverflowContainer>
        </UserAgent>
        <UserAgent computer>
          <S.LineContainer style={{width: '34%'}}>
            <Bar
              data={lineTestData}
              options={{
                legend: {display: false},
                tooltips: {enabled: false},
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                  //   legend: {position: 'top'},
                  title: {
                    display: true,
                    text: '상위누적 (국수탐(2) 기준)',
                  },
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontSize: 12,
                        fontColor: 'black',
                        fontStyle: 'bold',
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        reverse: true,
                        beginAtZero: true,
                        max: 100,
                        callback: function (label, index, labels) {
                          return label + '%';
                        },
                      },
                    },
                  ],
                },
              }}
            />
          </S.LineContainer>
        </UserAgent>
        <UserAgent mobile>
          <S.LineContainer style={{width: '100%', height: 420, marginTop: 16}}>
            <Bar
              data={lineTestData}
              options={{
                legend: {
                  display: false,
                },
                maintainAspectRatio: false,
                responsive: true,
                tooltips: {
                  enabled: false,
                },
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontSize: 12,
                        fontColor: 'black',
                        fontStyle: 'bold',
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        reverse: true,
                        beginAtZero: true,
                        max: 100,
                        callback: function (label, index, labels) {
                          return label + '%';
                        },
                      },
                    },
                  ],
                },
              }}
            />
          </S.LineContainer>
        </UserAgent>
      </S.RowLayout>
      <Advice>
        {
          "영어, 한국사 반영방식 등에 따라 대학별 유불리 정도는 다르게 나오기 때문에, 대학별 정확한 유불리 정도는 '관심대학 유불리파악' 페이지에서 정확하게 파악하시기 바랍니다"
        }
      </Advice>
    </S.Content>
  );
};

const Combination = () => {
  const [myScore, setMyScore] = useState([]);
  const [barData, setBarData] = useState({
    labels: [
      '국영수탐(2) + 한국사',
      '국영수탐(1) + 한국사',
      '국영수탐(2)',
      '국영수탐(1)',
      '국수탐(2)',
      '국수탐(1)',
      '국영수',
      '국수',
    ],
    datasets: [
      {
        label: '상위누적',
        data: [],
        backgroundColor: '#67AAC7',
        maxBarThickness: 25,
      },
    ],
  });

  useEffect(() => {
    _getCombination();
  }, []);

  const _getCombination = () => {
    const url = '/api/csat/selectanalysis_3';
    const params = {division: 1, year: '2022'};

    axios
      .get(url, {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: params,
      })
      .then(res => {
        const response = {api: url, msg: res.data.data};

        // 백분위, 등급, 상위 누적등이 max를 넘는 문제 수정. 별도로 문의 후, 원복 여부 결정하겠음.
        res.data.data.forEach((elem, index) => {
          if (elem.sort == 1 || elem.sort == 2) {
            elem.percentage = Math.round(elem.percentage / 6);
            elem.grade = Math.round(elem.grade / 6);
            elem.cumulative = Math.round(elem.cumulative / 6);
          } else if (elem.sort == 3 || elem.sort == 4) {
            elem.percentage = Math.round(elem.percentage / 5);
            elem.grade = Math.round(elem.grade / 5);
            elem.cumulative = Math.round(elem.cumulative / 5);
          } else if (elem.sort == 5 || elem.sort == 6) {
            elem.percentage = Math.round(elem.percentage / 4);
            elem.grade = Math.round(elem.grade / 4);
            elem.cumulative = Math.round(elem.cumulative / 4);
          } else if (elem.sort == 7) {
            elem.percentage = Math.round(elem.percentage / 3);
            elem.grade = Math.round(elem.grade / 3);
            elem.cumulative = Math.round(elem.cumulative / 3);
          } else if (elem.sort == 8) {
            elem.percentage = Math.round(elem.percentage / 2);
            elem.grade = Math.round(elem.grade / 2);
            elem.cumulative = Math.round(elem.cumulative / 2);
          }
        });

        res.data.data.sort((a, b) => parseInt(a.sort) - parseInt(b.sort));
        setMyScore(res.data.data);

        const labels = res.data.data.map(score => score.name);
        const data = res.data.data.map(score => [parseInt(score.cumulative), 100]);

        setBarData(prev => ({
          labels,
          datasets: [
            {
              ...prev.datasets[0],
              data,
            },
          ],
        }));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const renderAnaylysis = () => {
    return myScore.map(score => (
      <tr key={score.name}>
        <S.AnalyseTH>{score.name}</S.AnalyseTH>
        <S.AnalyseTD>{score.standardscore}</S.AnalyseTD>
        <S.AnalyseTD>{score.percentage}</S.AnalyseTD>
        <S.AnalyseTD>{score.grade}</S.AnalyseTD>
        <S.AnalyseTD>{score.cumulative ? `${score.cumulative}%` : ''}</S.AnalyseTD>
        <S.AnalyseTD>{score.rank_d}</S.AnalyseTD>
      </tr>
    ));
  };

  return (
    <>
      <S.Content>
        <S.ContentTitle>{'조합별 분석'}</S.ContentTitle>
        <S.MoblieOverflowContainer>
          <S.ContentTable>
            <colgroup>
              <col width="20%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
              <col width="10%" />
            </colgroup>
            <thead>
              <tr>
                <S.AnalyseTH>{'조합'}</S.AnalyseTH>
                <S.AnalyseTH>{'표준점수'}</S.AnalyseTH>
                <S.AnalyseTH>{'백분위'}</S.AnalyseTH>
                <S.AnalyseTH>{'등급'}</S.AnalyseTH>
                <S.AnalyseTH>{'상위누적'}</S.AnalyseTH>
                <S.AnalyseTH>{'순위'}</S.AnalyseTH>
              </tr>
            </thead>
            <tbody>{renderAnaylysis()}</tbody>
          </S.ContentTable>
        </S.MoblieOverflowContainer>
      </S.Content>
      <S.Content>
        <S.ContentTitle>{'과목 조합별 상위누적'}</S.ContentTitle>
        <S.MoblieOverflowContainer>
          <S.LineContainer style={{width: '100%', height: 400}}>
            <Bar
              data={barData}
              options={{
                legend: {display: false},
                maintainAspectRatio: false,
                responsive: true,
                tooltips: {enabled: false},
                scales: {
                  xAxes: [
                    {
                      ticks: {
                        fontSize: 12,
                        fontColor: 'black',
                        fontStyle: 'bold',
                      },
                    },
                  ],
                  yAxes: [
                    {
                      ticks: {
                        reverse: true,
                        beginAtZero: true,
                        max: 100,
                        callback: function (label, index, labels) {
                          return label + '%';
                        },
                      },
                    },
                  ],
                },
              }}
            />
          </S.LineContainer>
        </S.MoblieOverflowContainer>
      </S.Content>
    </>
  );
};

export default Analyse;
