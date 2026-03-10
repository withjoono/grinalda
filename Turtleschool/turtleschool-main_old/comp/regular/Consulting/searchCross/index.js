import axios from 'axios';
import * as Annotation from 'chartjs-plugin-annotation';
import {Chart} from 'chart.js/auto';
import DevChart from "./Chart";
import React, {useEffect, useState} from 'react';
import {Bar, Line} from 'react-chartjs-2';
import Button from '../../../Button';
import * as S from './index.style';
import PropTypes from 'prop-types';
import {
  saveScoreAnalysis,
  getCalculatedConvertScoreByUniv,
  getCutlineScoreByUniv,
  getUnivSubCodeListByRegion,
  getOccasionalUnivList,
  getSavedScoreFetch,
} from '../../../../src/api/csat';
import Advice from '../../../Advice';
import { ResultConditionContainer } from '../../ScoreInput/afterInputTable/style';
import { regionSearchUnivData,majorSearchUnivData,교차지원_문이과구분 } from '../../../../common/univStandard/calc';
import { mainData } from '../../../../common/subjectCalc/calc';
import { codeTable,codeNameTable } from '../../../../common/code';


import MinMaxChart from './MinMaxChart';



const SearchUniv = ({type, selectedUniv, onMajorClick, onMajorsClick,loginData,userScore,loading,setLoading, loadingBar}) => {
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [univ, setUniv] = useState([]);
  const [majorResult, setMajorResult] = useState([]);
 

 
  const [lineData, setLineData] = useState({
    labels: [],
    datasets: [
      {
        label: '내 점수',
        data: [],
        fill: false,
        borderColor: '#C86F4C',
        tension: 0,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#C86F4C',
        pointBorderWidth: 2,
      },
      {
        label: '해당 대학 누백',
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



  const calcMyScore = (title,type) => {

    let schoolData = {
      학교 : title,
    이문과 : type,
      국어: { 과목: "", 표준점수: 0 }, // not null
      수학: { 과목: "", 표준점수: 0 }, // not null
      영어: { 과목: "", 표준점수: 0 }, // not null
      한국사: { 과목: "", 표준점수: 0 }, // nullable
      과탐1: { 과목: "", 표준점수: 0 }, // nullable 없으면 사탐1
      과탐2: { 과목: "", 표준점수: 0 }, // nullable 없으면 사탐2
      사탐1: { 과목: "", 표준점수: 0 }, // nullable 없으면 과탐1 
      사탐2: { 과목: "", 표준점수: 0 }, // nullable 없으면 과탐2
      제2외국어: { 과목: "", 표준점수: 0} // nullable
    };

   
  
   if(userScore){
    for(let i = 0;  i< userScore.length; i++){
      
       
            if(userScore[i].title === '국어' || userScore[i].title === '수학' ){
             

              schoolData[userScore[i].title].과목 = userScore[i].subject_a;
              schoolData[userScore[i].title].표준점수 = parseInt(userScore[i].standardscore);
            }
            if(userScore[i].title === '사탐'){
             
              
             
              if(schoolData.사탐1.과목 === ''){
                schoolData.사탐1.과목 = userScore[i].subject_a;
                schoolData.사탐1.표준점수 = parseInt(userScore[i].standardscore);
              }else {
                schoolData.사탐2.과목 = userScore[i].subject_a;
                schoolData.사탐2.표준점수 = parseInt(userScore[i].standardscore);

              }
            }
            if(userScore[i].title === '과탐'){
        
              
    
              if(schoolData.과탐1.과목 === ''){
                schoolData.과탐1.과목 = userScore[i].subject_a;
                schoolData.과탐1.표준점수 = parseInt(userScore[i].standardscore);
              }else {
                schoolData.과탐2.과목 = userScore[i].subject_a;
                schoolData.과탐2.표준점수 = parseInt(userScore[i].standardscore);
              }
            }
            if(userScore[i].title === '영어' || userScore[i].title === '한국사' || userScore[i].title === '제2외국어'){
              
              
              schoolData[userScore[i].title].과목 = userScore[i].subject_a;
              schoolData[userScore[i].title].표준점수 = parseInt(userScore[i].grade);
           
            } 
          
    }



   }

   Object.keys(schoolData).map((item,index)=> {
    if(item !== '학교' &&  item !== '이문과' && schoolData[item].과목 === ''){
      delete schoolData[item];

    }
    else {          
    }
 });


   let myData = {
    내점수 : 0,
    퍼센트순위 : 0,
    
   };
   if(mainData({...schoolData}).success === true){
    myData.내점수 = mainData({...schoolData}).내점수;
    myData.퍼센트순위 = mainData({...schoolData}).퍼센트순위;
    
   }else {
    myData.내점수 = 0;
    myData.퍼센트순위 = 100;
   }

   return myData
  }
    useEffect(() => {
      setLineData(prev => ({
        ...prev,
        labels: majorResult.map(major => `${major.대학교} ${major.모집단위}`),
        datasets: [
          {
            ...prev.datasets[0],
            data: majorResult.map(major => calcMyScore(major.점수환산,major.계열)),

          },
          {
            ...prev.datasets[1],
            data: majorResult.map(major => Math.floor(major.대학점수_85 * 100) / 100) ,
           
            
          },



        ],
      }));
    }, [majorResult]);

  useEffect(() => {
    _getRegions();
  }, []);

  const _getRegions = () => {
    setLoading(true);
    axios
      .get('/api/codes/area', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
      })
      .then(res => {
        setRegions(res.data.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const _getSearchUniv = () => {
    setLoading(true);
    setUniv(regionSearchUnivData(교차지원_문이과구분(userScore), type, selectedRegions));
    setLoading(false);

  
  };


  const renderFilter = regions => {

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
          {loading === true ?
          
          loadingBar() : 
          
          
          regions.map(region => (
            <S.FilterContent
              active={selectedRegions.includes(region.code)}
              key={region.code}
              id={region.code}
              onClick={onRegionClick}
            >
              {region.name}
            </S.FilterContent>
          ))
          
          }
         


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
      <hr style={{margin: '36px 0px'}} />
      <UnivResult
        type={type}
        result={univ}
        majorResult={majorResult}
        setMajorResult={setMajorResult}
        setLineData={setLineData}
        selectedRegions={selectedRegions}
        userScore={userScore}
        loading={loading}
        setLoading={setLoading}
        loadingBar={loadingBar}
      />
      <hr style={{margin: '36px 0px'}} />
      <MajorResult 
        lineData={lineData} 
        result={univ} 
        loading={loading}
        setLoading={setLoading}
        loadingBar={loadingBar}
      />
      {majorResult.length !== 0 && (
        <SuitabilityResult
          result={univ}
          majorResult={majorResult}
          selectedUniv={selectedUniv}
          onMajorClick={onMajorClick}
          onMajorsClick={onMajorsClick}
          calcMyScore={calcMyScore}
          loading={loading}
          setLoading={setLoading}
          loadingBar={loadingBar}
        />
      )}
    </S.Container>
  );
};

const UnivResult = ({type, result, setMajorResult, selectedRegions, setLineData,userScore, loading, setLoading, loadingBar}) => {

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
  const [majorData,setMajorData] = useState([]);

  useEffect(() => {
    setLoading(true);
    setChartData(prev => {
      const labels = result.map(univ => univ.대학명);
      
      const data = result.map(univ => [
        parseFloat(univ.min),
        parseFloat(univ.max),
      ]);
      
      return {
        labels,
        datasets: [
          {
            label: '대학의 학과별 누적 백분위의 최고점과 최저점',
            data,
            backgroundColor: '#67AAC7',
            maxBarThickness: 25,
          },
        ],
      };
    });
    setLoading(false);
    
  }, [result]);


  const onMajorSearchClick = async({target}) => {
    const univName = target.id;
    await setMajorResult([]);

      var returnList = majorSearchUnivData(교차지원_문이과구분(userScore),univName,type);
      if (returnList && returnList.length > 0) {
        setLineData(prev => ({
          ...prev,
          labels: returnList.map(major => 
              
            `${major.대학교} ${major.모집단위}`
            
            ),
          datasets: [
            {
              ...prev.datasets[0],
            },
            {
              ...prev.datasets[1],
              data: parseInt(returnList.map(major => major.대학점수_85)),
            },
          ],
        }));
      }
   
      setMajorResult(returnList );
      returnList = [];
 
  };

  const renderEmptyIndicator = () => (
    <S.EmptyContainer>
      <S.EmptyTitle>{'검색할 조건을 먼저 선택해주세요'}</S.EmptyTitle>
      <S.EmptyDescription>
        {'위 대학 검색에서 지역을 선택하면 조건에 맞는 대학교 결과가 보여집니다.'}
      </S.EmptyDescription>
    </S.EmptyContainer>
  );



  const renderUnivList = names => {
    return (
      <S.UnivSelectTable>
        <tr>
          <S.UnivListTH>{'학교명'}</S.UnivListTH>
          <S.UnivListTH>{'학과검색'}</S.UnivListTH>
        </tr>
        {names.map(name => (
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
            <div style={{width: chartData.labels.length * 90}}>
              
              {/* < MinMaxChart /> */}
              <Bar
                redraw={true}
                data={chartData}
                height={250}
                plugins={[Annotation]}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  legend: {display: true},
                  scales: {
                    xAxes: [
                      {
                        ticks: {
                          fontSize: '.75rem',
                          fontColor: 'black',
                          fontStyle: 'bold',
                        },
                      },
                    ],
                    yAxes: [
                      {
                        
                        ticks: {
                          display: true,
                          reverse : true,
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

const MajorResult = ({lineData,result,majorData}) => {
  const renderEmptyIndicator = () => (
    <S.EmptyContainer>
      <S.EmptyTitle>{'학교 검색 결과에서 원하는 학교를 선택하세요'}</S.EmptyTitle>
      <S.EmptyDescription>
        {'학교 검색 결과에서 원하는 대학교를 선택하면 해당 학교의 학과 리스트가 나옵니다.'}
      </S.EmptyDescription>
    </S.EmptyContainer>
  );



  return (
    <>
      <S.ContentTitle>{'해당 학교 학과'}</S.ContentTitle>
      {/* {renderEmptyIndicator()} */}
      {lineData.labels.length !== 0 ? (
        <>
          <Advice style={{marginBottom: '1.8rem', fontSize: '1rem'}}>
            대학마다 대학별 총점과 반영방식이 다르기 때문에, 대학별로 상위누적백분위로 학과별
            최고점과 최저점의 범위를 나타낸 표입니다. 본인 점수라인 대비, 각 학교들의 컷 수준을
            한눈에 파악하기 쉽습니다.
            <br />
            단, 대학별 점수 방식이 다르기 때문에, 아래처럼 일괄로 줄 세우기 방식은 정확하지
            않습니다.
            <br />
            정확한 합격 예측은 대학별, 학과별 세부내역에서 '꼭!' 확인하시기 바랍니다.
          </Advice>
          <S.LineContainer>
        

            <S.OverflowContainer>
              <div style={{width: lineData.labels.length * 300, paddingTop: 36}}>

                <DevChart data={lineData} result={result} majorData={majorData}/>
               
              </div>
            </S.OverflowContainer>
          </S.LineContainer>
        </>
      ) : (
        renderEmptyIndicator()
      )}
    </>
  );
};

const SuitabilityResult = ({result,majorResult, selectedUniv, onMajorClick, onMajorsClick, calcMyScore}) => {

  
  

  const onSeeDetailClick = data => {
    let 내점수 = Math.floor(calcMyScore(data?.점수환산,data?.계열).내점수 * 100) / 100;
    let 퍼센트순위 = Math.floor(calcMyScore(data?.점수환산,data?.계열).퍼센트순위 * 100) / 100;


    data['내점수'] = 내점수;
    data['퍼센트순위'] = 퍼센트순위;

   window.open(
        // process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' + JSON.stringify(data),
        'https://ingipsy.com/regular/detail?data=' + JSON.stringify(data),
        '_blank',
      );
  };

  const RiskyCode = {
    H: '안정',
  };

  const renderUnivItem = major => (
    
    <tr key={`${major.대학교}`}>
      <S.UnivListTD>{major.대학교 || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.계열 || '-'}</S.UnivListTD>
      <S.UnivListTD>{major.모집단위 || '-'}</S.UnivListTD>
      <S.UnivListTD style={{ color : '#FF3232',fontWeight : 900}}>{Math.floor(calcMyScore(major.점수환산,major.계열).내점수 * 100) / 100 || '-'}</S.UnivListTD>
      <S.UnivListTD>{calcMyScore(major.점수환산,major.계열).퍼센트순위 || '-'}</S.UnivListTD>
      <S.UnivListTD>{Math.floor(major.대학점수_70 * 100) / 100 || '-'}</S.UnivListTD>
      <S.UnivListTD>{Math.floor(major.대학누백_70 * 100) / 100 || '-'}</S.UnivListTD>
      <S.UnivListTD style={{ color : '#FF3232',fontWeight : 900}}>{Math.floor(major.대학점수_85 * 100) / 100 || '-'}</S.UnivListTD>
      <S.UnivListTD>{Math.floor(major.대학누백_85 * 100) || '-'}</S.UnivListTD>
      <S.UnivListTD>{Math.floor(major.대학점수_100 * 100) / 100 || '-'}</S.UnivListTD>
      <S.UnivListTD>{Math.floor(major.대학누백_100 * 100) || '-'}</S.UnivListTD>
      <S.UnivListTD style={{ color : '#FF3232',fontWeight : 900}}>
      
      {Math.floor((calcMyScore(major.점수환산,major.계열).내점수 - major.대학점수_85) * 100  ) / 100  }
      </S.UnivListTD>
      <S.UnivListTD>
        <S.SeeDetailButton onClick={() => onSeeDetailClick(major)}>{'상세보기'}</S.SeeDetailButton>
      </S.UnivListTD>
      <S.UnivListTD>
        <S.CheckBoxInput
           id={`checkbox-${major.대학교}-${major.모집단위}`}
           checked={selectedUniv[`${major.대학교}-${major.모집단위}`]}
          type="checkbox"
          onClick={() => onMajorClick(major)}
        />
        <label htmlFor={`checkbox-${major.대학교}-${major.모집단위}`} />
      </S.UnivListTD>
    </tr>
  );
  const renderTable = majors => {
    return (
      <S.UnivListTable>
        <tr>
          <S.UnivListTH rowSpan={2}>{'대학명'}</S.UnivListTH>
          <S.UnivListTH rowSpan={2}>{'계열'}</S.UnivListTH>
          <S.UnivListTH rowSpan={2}>{'모집단위'}</S.UnivListTH>
          <S.UnivListTH colSpan={2}>{'내 점수'}</S.UnivListTH>
          <S.UnivListTH colSpan={2}>{'적정(추합포함70%컷)'}</S.UnivListTH>
          <S.UnivListTH colSpan={2}>{'소신(추합포함85%컷)'}<br/><span style={{ color : '#FF3232', fontSize : 12, fontWeight : 900}}>{'(예측컷)'}</span></S.UnivListTH>
          <S.UnivListTH colSpan={2}>{'위험(추합포함100%컷)'}</S.UnivListTH>
          <S.UnivListTH rowSpan={2}>{'내점수와 예측컷의 차이'}</S.UnivListTH>
          <S.UnivListTH rowSpan={2}>{'상세보기'}</S.UnivListTH>
          <S.UnivListTH rowSpan={2}>{'선택'}</S.UnivListTH>
        </tr>
        <tr>
          <S.UnivListTH>{'대학점수'}</S.UnivListTH>
          <S.UnivListTH>{'누백'}</S.UnivListTH>
          <S.UnivListTH>{'대학점수'}</S.UnivListTH>
          <S.UnivListTH>{'누백'}</S.UnivListTH>
          <S.UnivListTH>{'대학점수'}</S.UnivListTH>
          <S.UnivListTH>{'누백'}</S.UnivListTH>
          <S.UnivListTH>{'대학점수'}</S.UnivListTH>
          <S.UnivListTH>{'누백'}</S.UnivListTH>
          
          
         
        </tr>
        {majors.map(renderUnivItem)}
      </S.UnivListTable>
    );
  };

  return (
    <>
      <S.SuitabilityContainer>
        <S.SelectAllContainer>
          <S.CheckBoxInput
            id={`selectAll-2`}
            type="checkbox"
            onClick={e => onMajorsClick(e, majorResult)}
          />
          <label htmlFor={`selectAll-2`} />
          <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
        </S.SelectAllContainer>
        {renderTable(majorResult)}
      </S.SuitabilityContainer>
    </>
  );
};

SearchUniv.propTypes = {
  type: PropTypes.node.isRequired,
  selectedUniv: PropTypes.node.isRequired,
  onMajorClick: PropTypes.node.isRequired,
  onMajorsClick: PropTypes.node.isRequired,
  userScore :  PropTypes.node.isRequired,
};

UnivResult.propTypes = {
  type: PropTypes.node.isRequired,
  result: PropTypes.node.isRequired,
  setMajorResult: PropTypes.node.isRequired,
  userScore : PropTypes.node.isRequired,
};

MajorResult.propTypes = {
  majorResult: PropTypes.node.isRequired,
  result: PropTypes.node.isRequired,
  majorData: PropTypes.node.isRequired,
  
};

SuitabilityResult.propTypes = {
  result: PropTypes.node.isRequired,
  majorResult: PropTypes.node.isRequired,
  selectedUniv: PropTypes.node.isRequired,
  onMajorClick: PropTypes.node.isRequired,
  onMajorsClick: PropTypes.node.isRequired,
  calcMyScore :  PropTypes.node.isRequired,
};

export default SearchUniv;
