import React, { useState, useEffect } from 'react';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';
import Link from 'next/link';

import * as S from './index.style';
import { Bar } from 'react-chartjs-2';
import Advice from '../../Advice';
import axios from 'axios';

const Analyse = () => {
    return (
        <UserAgentProvider ua={window.navigator.userAgent}>
            <S.Container>
                <MyScore />
                <Percentage />
                <Combination />
                <Link href="/regular/firstConsulting">
                    <S.NavButton>{'가군 컨설팅 바로가기'}</S.NavButton>
                </Link>
            </S.Container>
        </UserAgentProvider>
    );
};

const MyScore = () => {
    const [myScore, setMyScore] = useState([]);

    useEffect(() => {
        _getMyScore();
    }, []);

    const _getMyScore = () => {
        axios
            .get('/api/csat/selectanalysis_1', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    year: '2022',
                },
            })
            .then((res) => {
                console.log('/api/csat/selectanalysis_1', res);
                setMyScore(res.data.data || []);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderStandardScore = () => {
        return (
            <tr>
                <S.MyScoreTD>{'표준점수'}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[0]?.standardscore}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[1]?.standardscore}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[4]?.standardscore}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[5]?.standardscore}</S.MyScoreTD>
                <S.MyScoreTD>{parseInt(myScore[4]?.standardscore) + parseInt(myScore[5]?.standardscore) || ''}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[2]?.standardscore}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[3]?.standardscore}</S.MyScoreTD>
                <S.MyScoreTD>{myScore[6]?.standardscore}</S.MyScoreTD>
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
                <S.MyScoreTD>{(parseInt(myScore[4]?.percentage) + parseInt(myScore[5]?.percentage)) / 2 || ''}</S.MyScoreTD>
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
                <S.MyScoreTD>{(parseInt(myScore[4]?.grade) + parseInt(myScore[5]?.grade)) / 2 || ''}</S.MyScoreTD>
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
                <S.MyScoreTD>{''}</S.MyScoreTD>
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
                        <S.MyScoreTH>{'탐구1'}</S.MyScoreTH>
                        <S.MyScoreTH>{'탐구2'}</S.MyScoreTH>
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
                data: [],
                backgroundColor: '#67AAC7',
                maxBarThickness: 25,
            },
        ],
    });

    useEffect(() => {
        _getAnalysis();
    }, []);

    const _getAnalysis = () => {
        axios
            .get('/api/csat/selectanalysis_2', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    year: '2022',
                },
            })
            .then((res) => {
                console.log('/api/csat/selectanalysis_2', res);
                setMyScore(res.data.data);

                const data = res.data.data.filter((score) => score.cumulative).map((score) => [parseInt(score.cumulative), 100]);
                console.log(data);
                setLineTestData((prev) => ({
                    ...prev,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data,
                        },
                    ],
                }));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderGroup = (title, index) => {
        return (
            <>
                <tr>
                    <S.AnalyseTD style={{ width: 40, padding: '0px 4px' }} rowSpan={2}>
                        {title}
                    </S.AnalyseTD>
                    <S.AnalyseTH>{'반영비율'}</S.AnalyseTH>
                    <S.AnalyseTD>{myScore[index]?.korea_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index]?.math_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index]?.ex_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index]?.sum_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index]?.cumulative ? `${myScore[index]?.cumulative}%` : ''}</S.AnalyseTD>
                </tr>
                <tr>
                    <S.AnalyseTD>{'내점수'}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index + 1]?.korea_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index + 1]?.math_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index + 1]?.ex_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index + 1]?.sum_standard}</S.AnalyseTD>
                    <S.AnalyseTD>{myScore[index + 1]?.cumulative ? `${myScore[index + 1]?.cumulative}%` : ''}</S.AnalyseTD>
                </tr>
            </>
        );
    };
    return (
        <S.Content>
            <S.ContentTitle>{'반영비율 차이에 따른 분석(국수탐(2) 기준)'}</S.ContentTitle>
            <S.RowLayout>
                <UserAgent computer>
                    <S.ContentTable style={{ width: '64%' }}>
                        <tr>
                            <S.AnalyseTH colSpan={2} style={{ width: '30%' }}>
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
                            <S.AnalyseTD>{myScore[0]?.cumulative ? `${myScore[0]?.cumulative}%` : ''}</S.AnalyseTD>
                        </tr>
                        {renderGroup('A그룹\n(중앙대, 성대 등)', 1)}
                        {renderGroup('B그룹\n(가톨릭대 등)', 3)}
                        {renderGroup('C그룹\n(서강대 등)', 5)}
                        {renderGroup('D그룹\n(서울대 등)', 7)}
                    </S.ContentTable>
                </UserAgent>
                <UserAgent mobile>
                    <S.MoblieOverflowContainer>
                        <S.ContentTable style={{ width: '200%' }}>
                            <tr>
                                <S.AnalyseTH colSpan={2} style={{ width: '25%' }}>
                                    {'조합'}
                                </S.AnalyseTH>
                                <S.AnalyseTH style={{ width: '10%' }}>{'국어'}</S.AnalyseTH>
                                <S.AnalyseTH style={{ width: '10%' }}>{'수학'}</S.AnalyseTH>
                                <S.AnalyseTH style={{ width: '10%' }}>{'탐구'}</S.AnalyseTH>
                                <S.AnalyseTH style={{ width: '10%' }}>{'합계'}</S.AnalyseTH>
                                <S.AnalyseTH style={{ width: '10%' }}>{'상위누적'}</S.AnalyseTH>
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
                    <S.LineContainer style={{ width: '34%' }}>
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
                <UserAgent mobile>
                    <S.LineContainer style={{ width: '100%', height: 420, marginTop: 16 }}>
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
            <Advice>{"영어, 한국사 반영방식 등에 따라 대학별 유불리 정도는 다르게 나오기 때문에, 대학별 정확한 유불리 정도는 '관심대학 유불리파악' 페이지에서 정확하게 파악하시기 바랍니다"}</Advice>
        </S.Content>
    );
};

const Combination = () => {
    const [myScore, setMyScore] = useState([]);
    const [barData, setBarData] = useState({
        labels: ['국영수탐(2) + 한국사', '국영수탐(1) + 한국사', '국영수탐(2)', '국영수탐(1)', '국수탐(2)', '국수탐(1)', '국영수', '국수'],
        datasets: [
            {
                data: [
                ],
                backgroundColor: '#67AAC7',
                maxBarThickness: 25,
            },
        ],
    });

    useEffect(() => {
        _getCombination();
    }, []);

    const _getCombination = () => {
        axios
            .get('/api/csat/selectanalysis_3', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    year: '2022',
                },
            })
            .then((res) => {
                console.log('/api/csat/selectanalysis_3', res);
                res.data.data.sort((a, b) => parseInt(a.sort) - parseInt(b.sort));
                console.log('sorted analysis_3', res.data.data);
                setMyScore(res.data.data);

                const labels = res.data.data.map((score) => score.name);
                const data = res.data.data.map((score) => [parseInt(score.cumulative), 100]);

                setBarData((prev) => ({
                    labels,
                    datasets: [
                        {
                            ...prev.datasets[0],
                            data,
                        },
                    ],
                }));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderAnaylysis = () => {
        return myScore.map((score) => (
            <tr key={score.name}>
                <S.AnalyseTH>{score.name}</S.AnalyseTH>
                <S.AnalyseTD>{score.standardscore}</S.AnalyseTD>
                <S.AnalyseTD>{score.percentage}</S.AnalyseTD>
                <S.AnalyseTD>{score.grade}</S.AnalyseTD>
                <S.AnalyseTD>{score.cumulative ? `${score.cumulative}%` : ""}</S.AnalyseTD>
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
                            <col width='20%' />
                            <col width='10%' />
                            <col width='10%' />
                            <col width='10%' />
                            <col width='10%' />
                            <col width='10%' />
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
                <S.ContentTitle>{'조합별 상위누적'}</S.ContentTitle>
                <S.MoblieOverflowContainer>
                    <S.LineContainer style={{ width: '200%', height: 400 }}>
                        <Bar
                            data={barData}
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
                </S.MoblieOverflowContainer>
            </S.Content>
        </>
    );
};

export default Analyse;
