import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import * as S from './index.style';
import Button from '../../../Button';
import { Bar, Line } from 'react-chartjs-2';
import * as Annotation from 'chartjs-plugin-annotation';

const SearchCross = ({ type, selectedUniv, onMajorClick, onMajorsClick }) => {
    const [regions, setRegions] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);
    const [univ, setUniv] = useState([]);
    const [majorResult, setMajorResult] = useState([]);

    useEffect(() => {
        _getRegions();
    }, []);

    const _getRegions = () => {
        axios
            .get('/api/codes/area', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                setRegions(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    const _getSearchUniv = () => {
        _postSaveCross(() => {
            // axios
            //     .get('/api/csat/selectcrosssprtuniv', {
            //         headers: {
            //             auth: localStorage.getItem('uid'),
            //         },
            //         params: {
            //             year: 2022,
            //             recruitment: type,
            //             cross_sprt: 'Y',
            //             areacode: selectedRegions.join('|'),
            //         },
            //     })
            //     .then((res) => {
            //         console.log('searchUniv: ', res);
            //         setUniv(res.data.data);
            //     })
            //     .catch((e) => {
            //         console.log(e);
            //     });

            axios
            .get('/api/csat/selectanalysis_4', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    recruitment: 1,
                    area: selectedRegions.length > 0 ? selectedRegions.join(',') : ['SE', 'HG', 'GW', 'DC', 'CB', 'GJ', 'JB', 'DG', 'BW', 'JJ'].join(","),
                    cross_sprt: "Y"
                },
            })
            .then((res) => {
                console.log('searchUniv: ', res);
                setUniv(res.data.data || []);
            })
            .catch((e) => {
                console.log(e);
            });
        });
    };

    const _postSaveCross = (callback) => {
        axios
            .post(
                '/api/csat/savecrosssprt',
                {
                    data: {
                        year: '2022',
                    },
                },
                {
                    headers: {
                        auth: localStorage.getItem('uid'),
                    },
                }
            )
            .then((res) => {
                console.log('savecrosssprt: ', res);
                callback();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderFilter = (regions) => {
        const onRegionClick = ({ target }) => {
            const targetIndex = selectedRegions.findIndex((value) => value === target.id);

            if (targetIndex !== -1) {
                const newArr = selectedRegions.concat();
                newArr.splice(targetIndex, 1);
                setSelectedRegions([...newArr]);
            } else {
                setSelectedRegions((prev) => [...prev, target.id]);
            }
        };

        return (
            <S.FilterContainer>
                <S.FilterTitle>{'지역 선택'}</S.FilterTitle>
                <S.FilterContentLayout>
                    {regions.map((region) => (
                        <S.FilterContent active={selectedRegions.includes(region.code)} key={region.code} id={region.code} onClick={onRegionClick}>
                            {region.name}
                        </S.FilterContent>
                    ))}
                </S.FilterContentLayout>
            </S.FilterContainer>
        );
    };

    return (
        <S.Container>
            <S.ContentTitle>{'대학 검색'}</S.ContentTitle>
            {renderFilter(regions)}
            <S.FilterButtonLayout>
                <Button onClick={_getSearchUniv}>{'선택 조건으로 검색하기'}</Button>
            </S.FilterButtonLayout>
            <hr style={{ margin: '36px 0px' }} />
            <UnivResult type={type} result={univ} majorResult={majorResult} setMajorResult={setMajorResult} />
            <hr style={{ margin: '36px 0px' }} />
            <MajorResult majorResult={majorResult} />
            {majorResult.length !== 0 && <SuitabilityResult majorResult={majorResult} selectedUniv={selectedUniv} onMajorClick={onMajorClick} onMajorsClick={onMajorsClick} />}
        </S.Container>
    );
};

const UnivResult = ({ type, result, majorResult, setMajorResult }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: '#67AAC7',
                maxBarThickness: 25,
            },
        ],
    });

    const [myScore, setMyScore] = useState(0);

    useEffect(() => {
        setChartData((prev) => {
            const labels = result.map((univ) => univ.universityid_nm);
            const data = result.map((univ) => [parseInt(univ.standard_score_i), parseInt(univ.standard_score_a)]);

            return {
                labels,
                datasets: [
                    {
                        data,
                        backgroundColor: '#67AAC7',
                        maxBarThickness: 25,
                    },
                ],
            };
        });

        setMyScore(result[0]?.user_score);
    }, [result]);

    const onMajorSearchClick = ({ target }) => {
        console.log('search: ', target.id);
        const univName = target.id;

        axios
            .get('/api/csat/selectanalysis_6', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    year: 2022,
                    universitynm: univName,
                    recruitment: type,
                    cross_sprt: "Y"
                },
            })
            .then((res) => {
                console.log('/api/csat/selectanalysis_6', res);
                setMajorResult(res.data.data || []);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderEmptyIndicator = () => (
        <S.EmptyContainer>
            <S.EmptyTitle>{'검색할 조건을 먼저 선택해주세요'}</S.EmptyTitle>
            <S.EmptyDescription>{'위 대학 검색에서 지역을 선택하면 조건에 맞는 대학교 결과가 보여집니다.'}</S.EmptyDescription>
        </S.EmptyContainer>
    );

    const renderUnivRow = (name) => (
        <tr>
            <S.UnivListTD>{name}</S.UnivListTD>
            <S.UnivListTD>
                <S.UnivListButton>{'학과검색'}</S.UnivListButton>
            </S.UnivListTD>
        </tr>
    );

    const renderUnivList = (names) => {
        return (
            <S.UnivSelectTable>
                <tr>
                    <S.UnivListTH>{'학교명'}</S.UnivListTH>
                    <S.UnivListTH>{'학과검색'}</S.UnivListTH>
                </tr>
                {names.map((name) => (
                    <tr key={name}>
                        <S.UnivListTD>{name}</S.UnivListTD>
                        <S.UnivListTD>
                            <S.UnivListButton id={name} onClick={onMajorSearchClick}>
                                {'학과검색'}
                            </S.UnivListButton>
                        </S.UnivListTD>
                    </tr>
                ))}
            </S.UnivSelectTable>
        );
    };
    return (
        <>
            <S.ContentTitle>{'학교 검색 결과'}</S.ContentTitle>
            {result.length !== 0 ? (
                <S.UnivResultContainer>
                    <S.ChartContainer>
                        <div style={{ width: chartData.labels.length * 120 }}>
                            <Bar
                                redraw={true}
                                data={chartData}
                                height={250}
                                plugins={[Annotation]}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    legend: { display: false },
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
                                                    display: false,
                                                },
                                            },
                                        ],
                                    },
                                    annotation: {
                                        annotations: [
                                            {
                                                type: 'line',
                                                mode: 'horizontal',
                                                scaleID: 'y-axis-0',
                                                borderColor: '#BF3752',
                                                value: myScore,
                                                label: {
                                                    content: '내 위치',
                                                    color: 'white',
                                                    backgroundColor: '#BF3752',
                                                    enabled: true,
                                                    fontStyle: 'bold',
                                                    fontSize: 12,
                                                    position: 'left',
                                                },
                                            },
                                        ],
                                    },
                                }}
                            />
                        </div>
                    </S.ChartContainer>
                    <S.UnivListContainer>{renderUnivList(chartData.labels)}</S.UnivListContainer>
                </S.UnivResultContainer>
            ) : (
                renderEmptyIndicator()
            )}
        </>
    );
};

const MajorResult = ({ majorResult }) => {
    const [lineData, setLineData] = useState({
        labels: [],
        datasets: [
            {
                label: '해당 대학 내 점수',
                data: [],
                fill: false,
                borderColor: '#C86F4C',
                tension: 0,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#C86F4C',
                pointBorderWidth: 2,
            },
            {
                label: '최초합 예측 점수',
                data: [],
                fill: false,
                borderColor: '#4572E4',
                tension: 0,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#4572E4',
                pointBorderWidth: 2,
            },
        ],
    });

    useEffect(() => {
        setLineData((prev) => ({
            ...prev,
            labels: majorResult.map((major) => `${major.name} ${major.major_nm}`),
            datasets: [
                {
                    ...prev.datasets[0],
                    data: majorResult.map((major) => major.basic_score),
                },
                {
                    ...prev.datasets[1],
                    data: majorResult.map((major) => major.expected_score),
                },
            ],
        }));
    }, [majorResult]);

    const renderEmptyIndicator = () => (
        <S.EmptyContainer>
            <S.EmptyTitle>{'학교 검색 결과에서 원하는 학교를 선택하세요'}</S.EmptyTitle>
            <S.EmptyDescription>{'학교 검색 결과에서 원하는 대학교를 선택하면 해당 학교의 학과 리스트가 나옵니다.'}</S.EmptyDescription>
        </S.EmptyContainer>
    );

    return (
        <>
            <S.ContentTitle>{'해당 학교 학과'}</S.ContentTitle>
            {/* {renderEmptyIndicator()} */}
            {lineData.labels.length !== 0 ? (
                <S.LineContainer>
                    <S.LineLegendContainer>
                        <S.LineLegendContent>
                            <S.LineLegendIcon color={lineData.datasets[0].pointBorderColor} />
                            <S.LineLegendText>{'해당 대학 내 점수'}</S.LineLegendText>
                        </S.LineLegendContent>
                        <S.LineLegendContent>
                            <S.LineLegendIcon color={lineData.datasets[1].pointBorderColor} />
                            <S.LineLegendText>{'최초합 예측 점수'}</S.LineLegendText>
                        </S.LineLegendContent>
                    </S.LineLegendContainer>
                    <S.OverflowContainer>
                        <div style={{ width: lineData.labels.length * 200, paddingTop: 36 }}>
                            <Line
                                data={lineData}
                                width={lineData.labels.length * 200}
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
                </S.LineContainer>
            ) : (
                renderEmptyIndicator()
            )}
        </>
    );
};

const SuitabilityResult = ({ majorResult, selectedUniv, onMajorClick, onMajorsClick }) => {

    const onSeeDetailClick = (data) => {
        window.open(process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' +  JSON.stringify({...data, cross: true}), '_blank')
    }

    const renderUnivItem = (major) => (
        <tr key={`${major.name} ${major.major_nm}`}>
            <S.UnivListTD>{major.name || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.major_nm || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.recruits || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.final70 || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.last70cuts_scoretopc || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.expected_score || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.prdctcutnb || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.basic_score || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.expected_score_diff || '-'}</S.UnivListTD>
            <S.UnivListTD>{major.new_score || '-'}</S.UnivListTD>
            <S.UnivListTD>
                <S.SeeDetailButton onClick={() => onSeeDetailClick(major)}>{'상세보기'}</S.SeeDetailButton>
            </S.UnivListTD>
            <S.UnivListTD>
                <S.CheckBoxInput id={`checkbox-${major.universityid}-${major.major_cd}`} checked={selectedUniv[`${major.universityid}-${major.major_cd}`]} type='checkbox' onClick={() => onMajorClick(major)} />
                <label htmlFor={`checkbox-${major.universityid}-${major.major_cd}`} />
            </S.UnivListTD>
        </tr>
    );

    const renderTable = (majors) => {
        return (
            <S.UnivListTable>
                <tr>
                    <S.UnivListTH rowSpan={2}>{'대학명'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'학과명'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'22 모집정원'}</S.UnivListTH>
                    <S.UnivListTH colSpan={2}>{'3개년평균최종등록70%컷'}</S.UnivListTH>
                    <S.UnivListTH colSpan={2}>{'최초합 예측점수'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'내점수'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'예측점수와 내점수 차이'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'대학유불리'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'상세보기'}</S.UnivListTH>
                    <S.UnivListTH rowSpan={2}>{'선택'}</S.UnivListTH>
                </tr>
                <tr>
                    <S.UnivListTH>{'점수'}</S.UnivListTH>
                    <S.UnivListTH>{'상위누적'}</S.UnivListTH>
                    <S.UnivListTH>{'점수'}</S.UnivListTH>
                    <S.UnivListTH>{'상위누적'}</S.UnivListTH>
                </tr>
                {majors.map(renderUnivItem)}
            </S.UnivListTable>
        );
    };

    return (
        <>
            <S.ContentTitle>{'적정 or 안정'}</S.ContentTitle>
            <S.SuitabilityContainer>
                <S.SelectAllContainer>
                    <S.CheckBoxInput
                        id={`selectAll-0`}
                        type='checkbox'
                        onClick={(e) =>
                            onMajorsClick(
                                e,
                                majorResult.filter((major) => major.risk_yn === 'H')
                            )
                        }
                    />
                    <label htmlFor={`selectAll-0`} />
                    <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
                </S.SelectAllContainer>
                {renderTable(majorResult.filter((major) => major.risk_yn === 'H'))}
            </S.SuitabilityContainer>
            <S.ContentTitle>{'소신'}</S.ContentTitle>
            <S.SuitabilityContainer>
                <S.SelectAllContainer>
                    <S.CheckBoxInput
                        id={`selectAll-1`}
                        type='checkbox'
                        onClick={(e) =>
                            onMajorsClick(
                                e,
                                majorResult.filter((major) => major.risk_yn === '0')
                            )
                        }
                    />
                    <label htmlFor={`selectAll-1`} />
                    <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
                </S.SelectAllContainer>
                {renderTable(majorResult.filter((major) => major.risk_yn === '0'))}
            </S.SuitabilityContainer>
            <S.ContentTitle>{'위험 or 불합'}</S.ContentTitle>
            <S.SuitabilityContainer>
                <S.SelectAllContainer>
                    <S.CheckBoxInput
                        id={`selectAll-2`}
                        type='checkbox'
                        onClick={(e) =>
                            onMajorsClick(
                                e,
                                majorResult.filter((major) => major.risk_yn === 'L')
                            )
                        }
                    />
                    <label htmlFor={`selectAll-2`} />
                    <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
                </S.SelectAllContainer>
                {renderTable(majorResult.filter((major) => major.risk_yn === 'L'))}
            </S.SuitabilityContainer>
        </>
    );
};

export default SearchCross;
