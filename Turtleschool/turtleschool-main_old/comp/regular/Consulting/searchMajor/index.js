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
import { regionSearchUnivData,majorSearchUnivData,문이과구분,regionSearchMajorData,학과검색최종데이터 } from '../../../../common/univStandard/calc';
import { mainData } from '../../../../common/subjectCalc/calc';
import { codeTable,codeNameTable } from '../../../../common/code';
import DevChart from "./Chart";
import {내성적계산,평균대학점수계산,평균대학누백계산,유불리_점수통일,유불리_대학총점계산} from '../../../../common/scoreCalc';


const SearchMajor = ({type, selectedUniv, onMajorClick, onMajorsClick,userScore,loading,setLoading, loadingBar}) => {
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
  
  }, []);

  useEffect(() => {
    if (majorInput !== '') {
      _getSimilarMajor(majorInput);
    }
  }, [majorInput]);


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
    setSearchResult([]);
   
  
    

          if (input !== '') {

       
          setSearchResult(regionSearchMajorData(문이과구분(userScore), type, selectedRegions,input));
        }else {
          setSearchResult([]);
        }
    
  };

  const _getSearchMajor = async() => {
    await setMajorResult([]);
  
   
    let major_array = [];
    Object.keys(searchResult).map((item,index)=> {

      Object.keys(selectedMajors).map((item2,index2)=> {
        if(selectedMajors[item2]=== true && searchResult[item].모집단위 === item2){
        
          major_array.push(searchResult[item].모집단위);
        }
     });

    })
    
  
      setMajorResult(학과검색최종데이터(문이과구분(userScore), type, selectedRegions,majorInput,major_array));

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
        newObj[major.모집단위] = target.checked;
      });

      setSelectedMajors(prev => ({
        ...prev,
        ...newObj,
      }));
    };

    const renderMajorItems = () =>
      searchResult.map(major => (
        <S.MajorItemContainer key={major.모집단위}>
          <S.MajorItemInput
            type="checkbox"
            checked={selectedMajors[major.모집단위]}
            onClick={onMajorResultClick}
            id={major.모집단위}
          />
          <S.MajorItemLabel onClick={onMajorResultClick}>{major.모집단위}</S.MajorItemLabel>
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
              <S.MajorContentTitle>{'유사 학과 선택'}</S.MajorContentTitle>
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
      setSearchResult([]);
      const targetIndex = selectedRegions.findIndex(value => value === target.id);

      if (targetIndex !== -1) {
        const newArr = selectedRegions.concat();
        newArr.splice(targetIndex, 1);
        setSelectedRegions([...newArr]);
      } else {
        setSelectedRegions(prev => [...prev, target.id]);
      }

      if (majorInput !== '') {

       
        setSearchResult(regionSearchMajorData(문이과구분(userScore), type, selectedRegions,majorInput));
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
      <div style={{ height : 30}}></div>
      <span style={{color : '#FF3232' , fontWeight : 900, fontSize  : 16, }}> * 학과명과 지역선택 두가지 모두를 선정하셔야 유사학과가 보여집니다.</span>
      <S.FilterButtonLayout>
        <Button onClick={onSubmitClick}>
        <div style={{display : 'flex', flexDirection : 'row'}}>{loading === true ? loadingBar() : '선택 조건으로 검색하기'}</div>
        </Button>
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
      <MajorResult majorResult={majorResult} userScore={userScore} calcMyScore={calcMyScore}/>
      {majorResult.length !== 0 && (
        <SuitabilityResult
          majorResult={majorResult}
          selectedUniv={selectedUniv}
          onMajorClick={onMajorClick}
          onMajorsClick={onMajorsClick}
          calcMyScore={calcMyScore}
        />
      )}
    </S.Container>
  );
};

const MajorResult = ({majorResult,userScore,calcMyScore,loading,setLoading, loadingBar}) => {
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
  }, [majorResult,userScore]);

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
          
          <S.OverflowContainer>
            <div style={{width: lineData.labels.length * 200, paddingTop: 36}}>
            {lineData.labels.length > 0 ? 
               <DevChart key={lineData} data={lineData} />
              : null
            }
           
          
            </div>
          </S.OverflowContainer>
        </S.LineContainer>
      ) : (
        renderEmptyIndicator()
      )}
    </>
  );
};

const SuitabilityResult = ({majorResult, selectedUniv, onMajorClick, onMajorsClick,calcMyScore,loading,setLoading, loadingBar }) => {


  const onSeeDetailClick = data => {
    window.open(
      // process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' + JSON.stringify(data),
      'https://ingipsy.com/regular/detail?data=' + JSON.stringify(data),
      '_blank',
    );
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
     
      <S.ContentTitle></S.ContentTitle>
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
  calcMyScore :  PropTypes.node.isRequired,
  loading : PropTypes.node.isRequired,
  setLoading : PropTypes.node.isRequired,
  loadingBar  : PropTypes.node.isRequired,

};

MajorResult.propTypes = {
  majorResult: PropTypes.node.isRequired,
  calcMyScore :  PropTypes.node.isRequired,
  loading : PropTypes.node.isRequired,
  setLoading : PropTypes.node.isRequired,
  loadingBar  : PropTypes.node.isRequired,
};

SuitabilityResult.propTypes = {
  majorResult: PropTypes.node.isRequired,
  selectedUniv: PropTypes.node.isRequired,
  onMajorClick: PropTypes.node.isRequired,
  onMajorsClick: PropTypes.node.isRequired,
  calcMyScore :  PropTypes.node.isRequired,
  loading : PropTypes.node.isRequired,
  setLoading : PropTypes.node.isRequired,
  loadingBar  : PropTypes.node.isRequired,
};

export default SearchMajor;
