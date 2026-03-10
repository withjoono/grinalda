import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import * as S from './index.style';
import { Line } from 'react-chartjs-2';

const Detail = () => {
    const router = useRouter();

    const [formula, setFormula] = useState([]);
    const [univ, setUniv] = useState({});

    useEffect(() => {
        console.log('query', router.query);
        if (router?.query?.data) {
            setUniv(JSON.parse(router.query.data));
        }
    }, [router]);

    useEffect(() => {
        if (univ?.name) {
            _getFormula();
        }
    }, [univ]);

    const _getFormula = () => {
        axios
            .get('/api/csat/selectdetail_1', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    year: '2022',
                    departmentnm: univ?.major_nm,
                    department: univ?.major_cd,
                    universitynm: univ?.name,
                    universityid: univ?.universityid,
                    major: univ?.major,
                    cross_sprt: univ?.cross ? "Y" : null
                },
            })
            .then((res) => {
                console.log('_getFormula', res);
                if (res.data.data) {
                    setFormula(res.data.data || []);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <S.Container>
            <Information univ={univ} formula={formula} />
            <Prediction univ={univ} />
            <YearAnalysis formula={formula} />
            <UnivAnalysis univ={univ} />
        </S.Container>
    );
};

const Information = ({ univ, formula }) => {
    // 가장 상단 대학 정보와 산출 방법, 환산점수표 컴포넌트
    const [score, setScore] = useState([]);
    const [headerInfo, setHeaderInfo] = useState({});

    const renderFormulaTable = (formula) => {
        return (
            <>
                <S.InfoTableTitle>{'수능 성적 산출 방법'}</S.InfoTableTitle>
                <S.InfoTable>
                    <tbody>
                        <tr>
                            <S.InfoTH>{'전형방식'}</S.InfoTH>
                            <S.InfoTH>{'국어'}</S.InfoTH>
                            <S.InfoTH>{'수학'}</S.InfoTH>
                            <S.InfoTH>{'영어'}</S.InfoTH>
                            <S.InfoTH>{'한국사'}</S.InfoTH>
                            <S.InfoTH>{'탐구'}</S.InfoTH>
                            <S.InfoTH>{'전형총점'}</S.InfoTH>
                            <S.InfoTH>{'내점수'}</S.InfoTH>
                        </tr>
                        {formula?.length > 0 ? (
                            <>
                                <tr>
                                    <S.InfoTD rowSpan={2}>{formula[0]?.scrnnmthd}</S.InfoTD>
                                    <S.InfoTD>{formula[0]?.kor}</S.InfoTD>
                                    <S.InfoTD>{formula[0]?.math}</S.InfoTD>
                                    <S.InfoTD>{formula[0]?.eng}</S.InfoTD>
                                    <S.InfoTD>{formula[0]?.khis}</S.InfoTD>
                                    <S.InfoTD>{formula[0]?.expl}</S.InfoTD>
                                    <S.InfoTD rowSpan={2}>{formula[0]?.totalsum}</S.InfoTD>
                                    <S.InfoTD rowSpan={2}>{formula[0]?.score}</S.InfoTD>
                                </tr>
                                <tr>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                </tr>
                            </>
                        ) : (
                            <>
                                <tr>
                                    <S.InfoTD rowSpan={2}>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD rowSpan={2}>{'-'}</S.InfoTD>
                                    <S.InfoTD rowSpan={2}>{'-'}</S.InfoTD>
                                </tr>
                                <tr>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                    <S.InfoTD>{'-'}</S.InfoTD>
                                </tr>
                            </>
                        )}
                    </tbody>
                </S.InfoTable>
            </>
        );
    };

    const renderScoreTable = (scores) => {
        return (
            <>
                <S.InfoTableTitle>{'영어 및 한국사 등급별 환산점수표'}</S.InfoTableTitle>
                <S.InfoTable>
                    <tbody>
                        <tr>
                            <S.InfoTH>{''}</S.InfoTH>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <S.InfoTH key={`${num}등급`}>{`${num}등급`}</S.InfoTH>
                            ))}
                        </tr>
                        <tr>
                            <S.InfoTD>{'영어'}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                        </tr>
                        <tr>
                            <S.InfoTD>{'한국사'}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                            <S.InfoTD>{"-"}</S.InfoTD>
                        </tr>
                        {/* <tr>
                            <S.InfoTD>{'영어'}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e1}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e2}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e3}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e4}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e5}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e6}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e7}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e8}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.e9}</S.InfoTD>
                        </tr>
                        <tr>
                            <S.InfoTD>{'한국사'}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h1}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h2}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h3}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h4}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h5}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h6}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h7}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h8}</S.InfoTD>
                            <S.InfoTD>{formula[0]?.h9}</S.InfoTD>
                        </tr> */}
                    </tbody>
                </S.InfoTable>
            </>
        );
    };

    return (
        <S.InfoContainer>
            <S.InfoHeader>
                <S.RowBox style={{ alignItems: 'flex-end' }}>
                    <S.InfoUnivName>{univ?.name}</S.InfoUnivName>
                    <S.InfoUnivMajor>{univ?.major_nm}</S.InfoUnivMajor>
                </S.RowBox>
                <S.InfoType>{'정시'}</S.InfoType>
            </S.InfoHeader>
            <S.InfoSubHeader>
                <S.RowBox>
                    <S.InfoSubContent>{`기존 정원 : ${univ?.recruits || '?'}명`}</S.InfoSubContent>
                    <S.InfoSubContent>{`수시이월 정원 : ${formula[0]?.grtfrprsnl || `12월말 발표`}`}</S.InfoSubContent>
                    <S.InfoSubContent>{`모집 인원 : ${parseInt(univ?.recruits || 0) + parseInt(formula[0]?.grtfrprsnl || 0) || '?'}명`}</S.InfoSubContent>
                </S.RowBox>
                <S.RowBox>
                    <S.InfoSubContent>{`추가모집 인원(3개년 평균) : ${formula[0]?.addrecruits || `미발표`}`}</S.InfoSubContent>
                    <S.InfoSubContent>{`추가모집 충원율 : ${formula[0]?.addrcrtmrate || `미발표`}`}</S.InfoSubContent>
                </S.RowBox>
            </S.InfoSubHeader>
            {renderFormulaTable(formula)}
            {formula?.length > 0 && renderScoreTable(score)}
        </S.InfoContainer>
    );
};

const Prediction = ({ univ }) => {
    // 1. 합격예측
    const [summary, setSummary] = useState({});

    const _getPrediction = () => {
        axios
            .get('/api/csat/selectdetail_3', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {},
            })
            .then((res) => {
                console.log('_getPrediction', res);
                setSummary(res.data.data || {});
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const getAnalysis = (diff) => {
        if (!diff) {
            return '-';
        }

        if (diff < -5) {
            return '안정';
        } else if (diff < 0) {
            return '소신';
        } else {
            return '위험';
        }

        // H 안정
        // 0 소신
        // L 위험
    };

    return (
        <S.ContentContainer>
            <S.ContentTitleContainer>
                <S.ContentTitle>{'1. 합격예측'}</S.ContentTitle>
            </S.ContentTitleContainer>
            <S.InfoTable>
                <thead>
                    <tr>
                        <S.InfoTH rowSpan={2}>{'내점수'}</S.InfoTH>
                        <S.InfoTH colSpan={2}>{'3개년평균최종등록70%컷'}</S.InfoTH>
                        <S.InfoTH colSpan={2}>{'최초합 예측점수'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'최초합 예측점수와 내점수 차이'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'해당대학유불리'}</S.InfoTH>
                        <S.InfoTH style={{ backgroundColor: '#E6ECF3' }} rowSpan={2}>
                            {'진단'}
                        </S.InfoTH>
                    </tr>
                    <tr>
                        <S.InfoTH>{'점수'}</S.InfoTH>
                        <S.InfoTH>{'상위누적'}</S.InfoTH>
                        <S.InfoTH>{'점수'}</S.InfoTH>
                        <S.InfoTH>{'상위누적'}</S.InfoTH>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <S.InfoTD>{univ?.basic_score || '-'}</S.InfoTD>
                        <S.InfoTD>{univ?.final70 || '-'}</S.InfoTD>
                        <S.InfoTD>{univ?.last70cuts_scoretopc || '-'}</S.InfoTD>
                        <S.InfoTD>{univ?.expected_score || '-'}</S.InfoTD>
                        <S.InfoTD>{univ?.prdctcutnb || '-'}</S.InfoTD>
                        <S.InfoTD>{univ?.expected_score_diff || '-'}</S.InfoTD>
                        <S.InfoTD>{univ?.new_score || '-'}</S.InfoTD>
                        <S.InfoTD>{'모의지원 현황을 참고'}</S.InfoTD>
                    </tr>
                </tbody>
            </S.InfoTable>
            <S.Tip>{'*예측점수는 모의지원결과, 수시이월인원수에 따라 계속 업데이트됩니다. 지속적인 관찰 바랍니다.'}</S.Tip>
        </S.ContentContainer>
    );
};

const YearAnalysis = ({ formula }) => {
    // 2. 3개년 입시 결과 분석

    const [summary, setSummary] = useState({});

    const _getAnalysis = () => {
        axios
            .get('/api/csat/selectdetail_4', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {},
            })
            .then((res) => {
                console.log('_getAnalysis', res);
                setSummary(res.data.data || {});
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <S.ContentContainer>
            <S.ContentTitleContainer>
                <S.ContentTitle>{'2. 3개년 입시 결과 평균 분석'}</S.ContentTitle>
                <S.ContentSubTitle>{'추가모집 포함 실질경쟁률과 컷 비교분석'}</S.ContentSubTitle>
            </S.ContentTitleContainer>
            <S.InfoTable>
                <thead>
                    <tr>
                        <S.InfoTH rowSpan={2}>{'년도'}</S.InfoTH>
                        {/* <S.InfoTH rowSpan={2}>{'기존정원'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'수시이월'}</S.InfoTH> */}
                        <S.InfoTH rowSpan={2}>{'모집인원'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'경쟁률'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'추가모집인원'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'충원율'}</S.InfoTH>
                        <S.InfoTH rowSpan={2}>{'추가모집인원 포함 정원'}</S.InfoTH>
                        <S.InfoTH style={{ color: '#BF3752' }} rowSpan={2}>
                            {'추가모집인원 합산 경쟁률'}
                        </S.InfoTH>
                        <S.InfoTH style={{ color: '#4572E4' }} colSpan={2}>
                            {'최종등록자 70%컷'}
                        </S.InfoTH>
                    </tr>
                    <tr>
                        <S.InfoTH style={{ color: '#4572E4' }}>{'점수'}</S.InfoTH>
                        <S.InfoTH style={{ color: '#4572E4' }}>{'상위누적'}</S.InfoTH>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <S.InfoTD>{'평균'}</S.InfoTD>
                        {/* <S.InfoTD>{formula[0]?.exstnprsnl || '-'}</S.InfoTD>
                        <S.InfoTD>{formula[0]?.grtfrprsnl || '-'}</S.InfoTD> */}
                        <S.InfoTD>{formula[0]?.recruits || '-'}</S.InfoTD>
                        <S.InfoTD>{formula[0]?.finalcmrt || '-'}</S.InfoTD>
                        <S.InfoTD>{formula[0]?.addrecruits || '-'}</S.InfoTD>
                        <S.InfoTD>{formula[0]?.addrcrtmrate || '-'}</S.InfoTD>
                        <S.InfoTD>{(parseInt(formula[0]?.recruits) + parseInt(formula[0]?.addrecruits))  || '-'}</S.InfoTD>
                        <S.InfoTD>{((parseInt(formula[0]?.recruits) * parseInt(formula[0]?.finalcmrt)) / (parseInt(formula[0]?.recruits + parseInt(formula[0]?.addrecruits)))).toFixed(2) || '-'}</S.InfoTD>
                        <S.InfoTD>{formula[0]?.final70 || '-'}</S.InfoTD>
                        <S.InfoTD>{formula[0]?.cumulativetop || '-'}</S.InfoTD>
                    </tr>
                </tbody>
            </S.InfoTable>
        </S.ContentContainer>
    );
};

const UnivAnalysis = ({ univ }) => {
    // 3. 타대학/타학과 입시 결과 분석
    const [diffMajorLineData, setDiffMajorLineData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                fill: false,
                borderColor: '#BF3752',
                tension: 0,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#BF3752',
                pointBorderWidth: 2,
            },
        ],
    });

    const [sameMajorLineData, setSameMajorLineData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                fill: false,
                borderColor: '#BF3752',
                tension: 0,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#BF3752',
                pointBorderWidth: 2,
            },
        ],
    });

    const [diffMajorUniv, setDiffMajorUniv] = useState([]);
    const [sameMajorUniv, setSameMajorUniv] = useState([]);

    useEffect(() => {
        if (univ?.universityid) {
            _getAnalysis();
        }
    }, [univ]);

    const _getAnalysis = () => {
        axios
            .get('/api/csat/selectdetail_1', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    year: '2022',
                    universityid: univ?.universityid,
                },
            })
            .then((res) => {
                console.log('_getAnalysis DiffMajor', res);
                setDiffMajorUniv(res.data.data || []);

                const labels = res.data.data.map((univ) => `${univ.major_nm}`);
                const data = res.data.data.map((univ) => univ.final70);

                setDiffMajorLineData((prev) => ({
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

        axios
            .get('/api/csat/selectdetail_1', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    year: '2022',
                    department: univ?.major_cd,
                },
            })
            .then((res) => {
                console.log('_getAnalysis SameMajor', res);
                setSameMajorUniv(res.data.data || []);

                const labels = res.data.data.map((univ) => `${univ.universitynm} ${univ.major_nm}`);
                const data = res.data.data.map((univ) => univ.final70);

                setSameMajorLineData((prev) => ({
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

    const renderUniv = (univ) => {
        return (
            <tr key={`${univ?.universitynm}-${univ?.departmentnm}`}>
                <S.InfoTD>{univ?.rrank || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.universitynm || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.departmentnm || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.recruits || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.finalcmrt || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.addrecruits || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.addrcrtmrate || '-'}</S.InfoTD>
                <S.InfoTD>{(parseInt(univ?.recruits || 0) + parseInt(univ?.addrecruits || 0)) || '-'}</S.InfoTD>
                <S.InfoTD>{((parseInt(univ?.recruits || 0) * parseInt(univ?.finalcmrt || 0)) / (parseInt(univ?.recruits || 0) + parseInt(univ?.addrecruits || 0))).toFixed(2) || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.final70 || '-'}</S.InfoTD>
                <S.InfoTD>{univ?.cumulativetop || '-'}</S.InfoTD>
            </tr>
        );
    };

    return (
        <S.ContentContainer>
            <S.ContentTitleContainer>
                <S.ContentTitle>{'3. 타대학/타학과 입시 결과 평균 분석'}</S.ContentTitle>
                <S.ContentSubTitle>{'추가모집 포함 실질경쟁률과 컷 비교분석'}</S.ContentSubTitle>
            </S.ContentTitleContainer>
            <S.TopicContainer>
                <S.RowBox style={{ marginBottom: 16 }}>
                    <S.ContentTopic>{'동일대학/타학과 입시 결과 분석'}</S.ContentTopic>
                    <S.ContentSubTitle>{'추가모집 포함 실질경쟁률과 컷 비교분석'}</S.ContentSubTitle>
                </S.RowBox>
                <S.OverflowContainer style={{ marginBottom: 16 }}>
                    <div style={{ width: diffMajorLineData.labels.length * 150, paddingTop: 36 }}>
                        <Line
                            redraw={true}
                            data={diffMajorLineData}
                            width={diffMajorLineData.labels.length * 150}
                            height={350}
                            options={{
                                legend: {
                                    display: false,
                                },
                                maintainAspectRatio: false,
                                tooltips: {
                                    enabled: false,
                                },
                                scales: {
                                    xAxes: [
                                        {
                                            ticks: {
                                                fontSize: 14.5,
                                                fontColor: 'black',
                                                fontStyle: 'bold',
                                            },
                                        },
                                    ],
                                    yAxes: [
                                        {
                                            ticks: {
                                                beginAtZero: true,
                                                max: 1000,
                                            },
                                        },
                                    ],
                                },
                            }}
                        />
                    </div>
                </S.OverflowContainer>
                <S.InfoTable>
                    <thead>
                        <tr>
                            <S.InfoTH rowSpan={2}>{'컷순위'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'대학명'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'학과명'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 모집인원'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 경쟁률'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 추가모집인원'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 충원율'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 추가모집인원 포함 정원'}</S.InfoTH>
                            <S.InfoTH style={{ color: '#BF3752' }} rowSpan={2}>
                                {'3개년 평균 추가모집인원 합산 경쟁률'}
                            </S.InfoTH>
                            <S.InfoTH style={{ color: '#4572E4' }} colSpan={2}>
                                {'3개년 평균 최종 등록자 70%컷'}
                            </S.InfoTH>
                        </tr>
                        <tr>
                            <S.InfoTH style={{ color: '#4572E4' }}>{'점수'}</S.InfoTH>
                            <S.InfoTH style={{ color: '#4572E4' }}>{'상위누적'}</S.InfoTH>
                        </tr>
                    </thead>
                    <tbody>{diffMajorUniv.map(renderUniv)}</tbody>
                </S.InfoTable>
            </S.TopicContainer>
            <S.TopicContainer>
                <S.RowBox style={{ marginBottom: 16 }}>
                    <S.ContentTopic>{'타대학/동일학과 입시 결과 분석'}</S.ContentTopic>
                    <S.ContentSubTitle>{'추가모집 포함 실질경쟁률과 컷 비교분석'}</S.ContentSubTitle>
                </S.RowBox>
                <S.OverflowContainer style={{ marginBottom: 16 }}>
                    <div style={{ width: sameMajorLineData.labels.length * 150, paddingTop: 36 }}>
                        <Line
                            redraw={true}
                            data={sameMajorLineData}
                            width={sameMajorLineData.labels.length * 150}
                            height={350}
                            options={{
                                legend: {
                                    display: false,
                                },
                                maintainAspectRatio: false,
                                tooltips: {
                                    enabled: false,
                                },
                                scales: {
                                    xAxes: [
                                        {
                                            ticks: {
                                                fontSize: 14.5,
                                                fontColor: 'black',
                                                fontStyle: 'bold',
                                            },
                                        },
                                    ],
                                    yAxes: [
                                        {
                                            ticks: {
                                                beginAtZero: true,
                                                max: 1000,
                                            },
                                        },
                                    ],
                                },
                            }}
                        />
                    </div>
                </S.OverflowContainer>
                <S.InfoTable>
                    <thead>
                        <tr>
                            <S.InfoTH rowSpan={2}>{'컷순위'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'대학명'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'학과명'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 모집인원'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 경쟁률'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 추가모집인원'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 충원율'}</S.InfoTH>
                            <S.InfoTH rowSpan={2}>{'3개년 평균 추가모집인원 포함 정원'}</S.InfoTH>
                            <S.InfoTH style={{ color: '#BF3752' }} rowSpan={2}>
                                {'3개년 평균 추가모집인원 합산 경쟁률'}
                            </S.InfoTH>
                            <S.InfoTH style={{ color: '#4572E4' }} colSpan={2}>
                                {'3개년 평균 최종 등록자 70%컷'}
                            </S.InfoTH>
                        </tr>
                        <tr>
                            <S.InfoTH style={{ color: '#4572E4' }}>{'점수'}</S.InfoTH>
                            <S.InfoTH style={{ color: '#4572E4' }}>{'상위누적'}</S.InfoTH>
                        </tr>
                    </thead>
                    <tbody>{sameMajorUniv.map(renderUniv)}</tbody>
                </S.InfoTable>
            </S.TopicContainer>
        </S.ContentContainer>
    );
};

export default Detail;
