import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react';
import {Line} from 'react-chartjs-2';
import Button from '../../../Button';
import * as S from './index.style';
import PropTypes from 'prop-types';
import {
  saveScoreAnalysis,
  getCalculatedConvertScoreByUniv,
  getCutlineScoreByUniv,
  getUnivSubCodeListByRegion,
  getCalculatedConvertScoreByMajor,
  getSavedScoreFetch
} from '../../../../src/api/csat';

const SearchMajor = ({type, selectedUniv, onMajorClick, onMajorsClick}) => {
  const [majorInput, setMajorInput] = useState('');
  const inputRef = useRef('');
  const [searchResult, setSearchResult] = useState([]);

  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);

  const [selectedMajors, setSelectedMajors] = useState({});
  const [majorResult, setMajorResult] = useState([]);
  const [mySubjectScore, setMySubjectScore] = useState([]);

  useEffect(() => {
    _getRegions();
    _getMySubjectScore();
  }, []);

  useEffect(() => {
    if (majorInput !== '') {
      _getSimilarMajor(majorInput);
    }
  }, [majorInput]);
  const _getMySubjectScore = () => {
      getSavedScoreFetch()
        .then(res => {
          setMySubjectScore(res.data.data);
        })
        .catch(e => {
          console.log(e);
        });
  };
  const _getRegions = () => {
    axios
      .get('/api/codes/area', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
      })
      .then(res => {
        setRegions(res.data.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const _getSimilarMajor = input => {
    axios
      .get('/api/csat/selectmajor', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          majornm: input,
        },
      })
      .then(res => {
        if (input == inputRef.current) {
          setSearchResult(res.data.data || []);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const _getSearchMajor = () => {
    let gun_cd = '0';
    if (type == '가') {
      gun_cd = '1';
    } else if (type == '나') {
      gun_cd = '2';
    } else if (type == '다') {
      gun_cd = '3';
    }
    const depart_nms = Object.keys(selectedMajors)
      .filter(major => selectedMajors[major])
      .join(',');
    let major_line_cd = '00'
    mySubjectScore?.forEach((elem, index) => {
        if(elem.lar_subject_cd == '1' && elem.subject_a != '1G') {
            major_line_cd = '10'
        } else if(elem.lar_subject_cd == '2') {
            major_line_cd = '20'
        }
    })
    console.log("major_line_cd",major_line_cd)
    getCalculatedConvertScoreByMajor({
      gun_cd: gun_cd,
      major_line_cd: '10',
      depart_nms: depart_nms,
      myScore: mySubjectScore
    }).then(data => {
      const returnList = [];
      console.log('data', data);
      data?.forEach((elem, index) => {
        const cut_70_first = Math.round(elem.cut_70_first * 100) / 100;
        // 내 점수
        let calculate_score = 0;
        if (elem.calculate_score === undefined) {
          calculate_score = 0;
        } else {
          calculate_score = Math.round(elem.calculate_score * 100) / 100;
        }
        let expected_score_diff = Math.round((calculate_score - cut_70_first) * 100) / 100;
        console.log("expected_score_diff",expected_score_diff)
        const dataSet = {
          division: '1',
          universityid: elem.univ_id,
          name: elem.univ_nm,
          major_cd: elem.depart_id,
          major_nm: elem.depart_nm,
          major: '41',
          selection_type: elem.select_line_cd,
          sml_fld: elem.line_cd,
          score_convert_a: '',
          score_convert_b: '1',
          basic_score: elem.calculate_score,
          basic_score_cumulative: elem.cumulative,
          new_score: '',
          u_jisu: null,
          u_t_jisu: null,
          risk_yn: 'L',
          expected_score_diff: expected_score_diff,
          recruitment: '1',
          expected_score: Math.round(elem.cut_70_first * 100) / 100, // 최초 합 예측 컷
          last70cuts_score: '921.52 ',
          prdctcutnb: Math.round(elem.cut_70_topaccu * 100) / 100, // 최초 합 예측 상위 누적
          kor: '20',
          mat: '40',
          eng: '10',
          exp: '30',
          foreg: '0',
          recruits: elem.recruit_person,
          expected_score_cumulative: null,
          last70cuts_scoretopc: Math.round(elem.cut_70_topaccu * 100) / 100, // 3개년 최종 등록 컷 상위 누적
          final70: Math.round(elem.cut_70_first * 100) / 100, // 3개년 최종 등록 컷
          acceptancerank: '10',
          rv_acceptrank: '14',
          add70cuts_score: '920.15 ',
          addcumulativetop: '0.22 ',
          add_expected_score_diff: '-301.21',
          cut_70: elem.cut_70_first,
          cut_70_topaccu: elem.cut_70_topaccu,
          cut_80: elem.cut_80,
          cut_80_topaccu: elem.cut_80_topaccu,
          cut_95_add: elem.cut_95_add,
          cut_95_topaccu: elem.cut_95_topaccu
        };
        returnList.push(dataSet);
      });
      setMajorResult(returnList || []);
    });
  };

  const onMajorResultClick = ({target}) => {
    setSelectedMajors(prev => ({
      ...prev,
      [target.id]: !prev[target.id],
    }));
  };

  const renderMajorFilter = () => {
    const onSearchChange = ({target}) => {
      setMajorInput(target.value);
      inputRef.current = target.value;
    };

    const onSelectAllClick = ({target}) => {
      const newObj = {};
      searchResult.map(major => {
        newObj[major.major_nm] = target.checked;
      });

      setSelectedMajors(prev => ({
        ...prev,
        ...newObj,
      }));
    };

    const renderMajorItems = () =>
      searchResult.map(major => (
        <S.MajorItemContainer key={major.major_cd}>
          <S.MajorItemInput
            type="checkbox"
            checked={selectedMajors[major.major_nm]}
            onClick={onMajorResultClick}
            id={major.major_nm}
          />
          <S.MajorItemLabel onClick={onMajorResultClick}>{major.major_nm}</S.MajorItemLabel>
        </S.MajorItemContainer>
      ));
    return (
      <S.MajorFilterContainer>
        <S.FilterTitle>{'학과 선택'}</S.FilterTitle>
        <S.MajorFilterContentLayout>
          {/* <S.MajorFilterContent> */}
          <S.MajorInputContainer>
            <S.MajorInputLabel>{'학과명'}</S.MajorInputLabel>
            <S.MajorInputDivider />
            <S.MajorInput onChange={onSearchChange} value={majorInput} />
          </S.MajorInputContainer>
          {/* </S.MajorFilterContent> */}
          <S.MajorFilterContent>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#F4F4F4',
              }}
            >
              <S.MajorContentTitle >{'유사 학과 선택'}</S.MajorContentTitle>
              <S.MajorSelectAllContainer>
                <input type="checkbox" onChange={onSelectAllClick} />
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
  const renderRegionFilter = regions => {
    const onRegionClick = ({target}) => {
      const targetIndex = selectedRegions.findIndex(value => value === target.id);

      if (targetIndex !== -1) {
        const newArr = selectedRegions.concat();
        newArr.splice(targetIndex, 1);
        setSelectedRegions([...newArr]);
      } else {
        setSelectedRegions(prev => [...prev, target.id]);
      }
    };

    return (
      <S.FilterContainer>
        <S.FilterTitle>{'지역 선택'}</S.FilterTitle>
        <S.FilterContentLayout>
          {regions.map(region => (
            <S.FilterContent
              active={selectedRegions.includes(region.code)}
              key={region.code}
              id={region.code}
              onClick={onRegionClick}
            >
              {region.name}
            </S.FilterContent>
          ))}
        </S.FilterContentLayout>
      </S.FilterContainer>
    );
  };

  /*  const renderEmptyIndicator = () => (
    <S.EmptyContaienr>
      <S.EmptyTitle>{'검색할 조건을 먼저 선택해주세요'}</S.EmptyTitle>
      <S.EmptyDescription>
        {'위 대학 검색에서 지역을 선택하면 조건에 맞는 대학교 결과가 보여집니다.'}
      </S.EmptyDescription>
    </S.EmptyContaienr>
  ); */

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
      <hr
        style={{
          margin: '36px 0px',
          border: 'none',
          height: 1,
          color: '#9a9a9a',
          backgroundColor: '#9a9a9a',
        }}
      />
      {/* {renderEmptyIndicator()} */}
      <MajorResult majorResult={majorResult} />
      {majorResult.length !== 0 && (
        <SuitabilityResult
          majorResult={majorResult}
          selectedUniv={selectedUniv}
          onMajorClick={onMajorClick}
          onMajorsClick={onMajorsClick}
        />
      )}
    </S.Container>
  );
};

const MajorResult = ({majorResult}) => {
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
    setLineData(prev => ({
      ...prev,
      labels: majorResult.map(major => [major.name, major.major_nm]),
      datasets: [
        {
          ...prev.datasets[0],
          data: majorResult.map(major => major.basic_score),
        },
        {
          ...prev.datasets[1],
          data: majorResult.map(major => major.expected_score),
        },
      ],
    }));
  }, [majorResult]);

  const renderEmptyIndicator = () => (
    <S.EmptyContaienr>
      <S.EmptyTitle>{'검색할 조건을 먼저 선택해주세요'}</S.EmptyTitle>
      <S.EmptyDescription>
        {'위 대학 검색에서 지역과 계열을 선택하면 조건에 해당하는 학과가 보여집니다.'}
      </S.EmptyDescription>
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
            <div style={{width: lineData.labels.length * 200, paddingTop: 36}}>
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

const SuitabilityResult = ({majorResult, selectedUniv, onMajorClick, onMajorsClick}) => {
  const onSeeDetailClick = data => {
    window.open(
      // process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' + JSON.stringify(data),
      'https://ingipsy.com/regular/detail?data=' + JSON.stringify(data),
      '_blank',
    );
  };

  const renderUnivItem = major => (
    <tr key={`${major.major_cd}-${major.name}-${major.major_nm}`}>
      <S.UnivListTD>{major.name || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.major_nm || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.recruits || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.final70 || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.last70cuts_scoretopc || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.expected_score || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.prdctcutnb || '-'}</S.UnivListTD>

      {/* <S.UnivListTD>{major.basic_score || '-'}</S.UnivListTD> */}
      <S.UnivListTD>{major.basic_score || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.expected_score_diff || '-'}</S.UnivListTD>
      <S.UnivListTD>
        <S.SeeDetailButton onClick={() => onSeeDetailClick(major)}>{'상세보기'}</S.SeeDetailButton>
      </S.UnivListTD>
      <S.UnivListTD>
        <S.CheckBoxInput
          id={`checkbox-${major.universityid}-${major.major_cd}`}
          checked={selectedUniv[`${major.universityid}-${major.major_cd}`]}
          type="checkbox"
          onClick={() => onMajorClick(major)}
        />
        <label htmlFor={`checkbox-${major.universityid}-${major.major_cd}`} />
      </S.UnivListTD>
    </tr>
  );

  const renderTable = majors => {
    console.log('majors', majors);
    console.log('renderUnivItem', renderUnivItem);

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
      {/* <S.ContentTitle>{'적정 or 안정'}</S.ContentTitle>
      <S.SuitabilityContainer>
        <S.SelectAllContainer>
          <S.CheckBoxInput
            id={`selectAll-0`}
            type="checkbox"
            onClick={e =>
              onMajorsClick(
                e,
                majorResult.filter(major => major.risk_yn === 'H'),
              )
            }
          />
          <label htmlFor={`selectAll-0`} />
          <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
        </S.SelectAllContainer>
        {renderTable(majorResult.filter(major => major.risk_yn === 'H'))}
      </S.SuitabilityContainer>
      <S.ContentTitle>{'소신'}</S.ContentTitle>
      <S.SuitabilityContainer>
        <S.SelectAllContainer>
          <S.CheckBoxInput
            id={`selectAll-1`}
            type="checkbox"
            onClick={e =>
              onMajorsClick(
                e,
                majorResult.filter(major => major.risk_yn === '0'),
              )
            }
          />
          <label htmlFor={`selectAll-1`} />
          <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
        </S.SelectAllContainer>
        {renderTable(majorResult.filter(major => major.risk_yn === '0'))}
      </S.SuitabilityContainer> */}
      <S.ContentTitle>{'위험 or 불합'}</S.ContentTitle>
      <S.SuitabilityContainer>
        <S.SelectAllContainer>
          <S.CheckBoxInput
            id={`selectAll-2`}
            type="checkbox"
            onClick={e =>
              onMajorsClick(
                e,
                // majorResult.filter(major => major.risk_yn === 'L'),
                majorResult,
              )
            }
          />
          <label htmlFor={`selectAll-2`} />
          <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
        </S.SelectAllContainer>
        {renderTable(
          majorResult,
          //   majorResult.filter(major => major.risk_yn === 'L')
        )}
      </S.SuitabilityContainer>
    </>
  );
};

SearchMajor.propTypes = {
  type: PropTypes.node.isRequired,
  selectedUniv: PropTypes.node.isRequired,
  onMajorClick: PropTypes.node.isRequired,
  onMajorsClick: PropTypes.node.isRequired,
};

MajorResult.propTypes = {
  majorResult: PropTypes.node.isRequired,
};

SuitabilityResult.propTypes = {
  majorResult: PropTypes.node.isRequired,
  selectedUniv: PropTypes.node.isRequired,
  onMajorClick: PropTypes.node.isRequired,
  onMajorsClick: PropTypes.node.isRequired,
};

export default SearchMajor;
