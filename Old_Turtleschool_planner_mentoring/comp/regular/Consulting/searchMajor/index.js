import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

import * as S from './index.style';
import Button from '../../../Button';

const SearchMajor = ({ type, selectedUniv, onMajorClick, onMajorsClick }) => {
    const [majorInput, setMajorInput] = useState('');
    const inputRef = useRef('');
    const [searchResult, setSearchResult] = useState([]);

    const [regions, setRegions] = useState([]);
    const [selectedRegions, setSelectedRegions] = useState([]);

    const [selectedMajors, setSelectedMajors] = useState({});
    const [majorResult, setMajorResult] = useState([]);

    useEffect(() => {
        _getRegions();
    }, []);

    useEffect(() => {
        if (majorInput !== '') {
            _getSimilarMajor(majorInput);
        }
    }, [majorInput]);

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

    const _getSimilarMajor = (input) => {
        axios
            .get('/api/csat/selectmajor', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    majornm: input,
                },
            })
            .then((res) => {
                if (input == inputRef.current) {
                    setSearchResult(res.data.data || []);
                }
            })
            .catch((e) => {
                if (axios.isCancel(e)) {
                    console.log('request canceled');
                }
                console.log(e);
            });
    };

    const _getSearchMajor = () => {
        axios
            .get('/api/csat/selectanalysis_6', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    year: '2022',
                    recruitment: type,
                    areacode: selectedRegions.length > 0 ? selectedRegions.join(',') : ['SE', 'HG', 'GW', 'DC', 'CB', 'GJ', 'JB', 'DG', 'BW', 'JJ'].join(','),
                    departmentnm: Object.keys(selectedMajors)
                        .filter((major) => selectedMajors[major])
                        .join(','),
                },
            })
            .then((res) => {
                console.log('searchMajor: ', res);
                setMajorResult(res.data.data || []);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onMajorResultClick = ({ target }) => {
        setSelectedMajors((prev) => ({
            ...prev,
            [target.id]: !prev[target.id],
        }));
    };

    const renderMajorFilter = () => {
        const onSearchChange = ({ target }) => {
            setMajorInput(target.value);
            inputRef.current = target.value;
        };

        const onSelectAllClick = ({ target }) => {
            const newObj = {};
            searchResult.map((major) => {
                newObj[major.major_nm] = target.checked;
            });

            setSelectedMajors((prev) => ({
                ...prev,
                ...newObj,
            }));
        };

        const renderMajorItems = () =>
            searchResult.map((major) => (
                <S.MajorItemContainer key={major.major_cd}>
                    <S.MajorItemInput type='checkbox' checked={selectedMajors[major.major_nm]} onClick={onMajorResultClick} id={major.major_nm} />
                    <S.MajorItemLabel>{major.major_nm}</S.MajorItemLabel>
                </S.MajorItemContainer>
            ));
        return (
            <S.MajorFilterContainer>
                <S.FilterTitle>{'학과 선택'}</S.FilterTitle>
                <S.MajorFilterContentLayout>
                    <S.MajorFilterContent>
                        <S.MajorInputContainer>
                            <S.MajorInputLabel>{'학과명'}</S.MajorInputLabel>
                            <S.MajorInputDivider />
                            <S.MajorInput onChange={onSearchChange} value={majorInput} />
                        </S.MajorInputContainer>
                    </S.MajorFilterContent>
                    <S.MajorFilterContent>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F4F4F4' }}>
                            <S.MajorContentTitle>{'유사 학과 선택'}</S.MajorContentTitle>
                            <S.MajorSelectAllContainer>
                                <input type='checkbox' onChange={onSelectAllClick} />
                                <S.MajorSelectAllTitle>{'전체 선택'}</S.MajorSelectAllTitle>
                            </S.MajorSelectAllContainer>
                        </div>
                        <S.OverflowConatiner>
                            <S.MajorListContainer>{renderMajorItems()}</S.MajorListContainer>
                        </S.OverflowConatiner>
                    </S.MajorFilterContent>
                </S.MajorFilterContentLayout>
            </S.MajorFilterContainer>
        );
    };
    const renderRegionFilter = (regions) => {
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

    const renderEmptyIndicator = () => (
        <S.EmptyContaienr>
            <S.EmptyTitle>{'검색할 조건을 먼저 선택해주세요'}</S.EmptyTitle>
            <S.EmptyDescription>{'위 대학 검색에서 지역을 선택하면 조건에 맞는 대학교 결과가 보여집니다.'}</S.EmptyDescription>
        </S.EmptyContaienr>
    );

    const onSubmitClick = () => {
        _getSearchMajor();
    };

    return (
        <S.Container>
            <S.ContentTitle>{'학과 검색'}</S.ContentTitle>
            {renderMajorFilter()}
            {renderRegionFilter(regions)}
            <S.FilterButtonLayout>
                <Button onClick={onSubmitClick}>{'선택 조건으로 검색하기'}</Button>
            </S.FilterButtonLayout>
            <hr style={{ margin: '36px 0px', border: 'none', height: 1, color: '#9a9a9a', backgroundColor: '#9a9a9a' }} />
            {/* {renderEmptyIndicator()} */}
            <MajorResult majorResult={majorResult} />
            {majorResult.length !== 0 && <SuitabilityResult majorResult={majorResult} selectedUniv={selectedUniv} onMajorClick={onMajorClick} onMajorsClick={onMajorsClick} />}
        </S.Container>
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
            labels: majorResult.map((major) => [major.name, major.major_nm]),
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
        <S.EmptyContaienr>
            <S.EmptyTitle>{'검색할 조건을 먼저 선택해주세요'}</S.EmptyTitle>
            <S.EmptyDescription>{'위 대학 검색에서 지역과 계열을 선택하면 조건에 해당하는 학과가 보여집니다.'}</S.EmptyDescription>
        </S.EmptyContaienr>
    );

    return (
        <>
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
                                redraw={true}
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
        window.open(process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' +  JSON.stringify(data), '_blank')
    }

    const renderUnivItem = (major) => (
        <tr key={`${major.major_cd}-${major.name}-${major.major_nm}`}>
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

export default SearchMajor;
