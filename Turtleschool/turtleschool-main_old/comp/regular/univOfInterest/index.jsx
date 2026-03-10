import {FormControl, MenuItem, Select} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {UserAgent} from '@quentin-sommer/react-useragent';
import axios from 'axios';
import React, {useEffect, useLayoutEffect,useState} from 'react';
import {getSavedScoreFetch, saveBeforeScoreFetch, saveScoreFetch} from '../../../src/api/csat';
import AfterTestTable from '../../../src/components/molecules/tables/afterInputTable';
import BeforeTestTable from '../../../src/components/molecules/tables/beforeTestTable';
import Advice from '../../Advice';
import * as S from './index.style';
import { mainData } from '../../../common/subjectCalc/calc';
import { codeTable,codeNameTable } from '../../../common/code';
import { 내성적계산,평균대학점수계산,평균대학누백계산,유불리_점수통일,유불리_대학총점계산,관심대학_작년경쟁률 } from '../../../common/interestScoreCalc';
import styled from 'styled-components';
import { CollectionsOutlined } from '@material-ui/icons';

export const CustomButton = styled.button`
  box-sizing: border-box;
  border: 1px solid #000000;
  padding: 0.3rem 0.6rem;
  font-weight: normal;
  font-size: 0.4rem;
  line-height: 0.45rem;
  word-break: keep-all;
`;

const UnivOfInterest = ({loginInfo,userScore,univInterest,setUnivInterest,loginData}) => {

  const [chartList, setChartList] = useState({array : []})

  useEffect(()=>{
   

  },[univInterest])




  const calcMyScore = (title,type,userScore) => {

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

    let myData = {
      내점수 : 0,
      퍼센트순위 : 0,
      표점합 : 0,
  
     };

  
   if(userScore){
    for(let i = 0;  i< userScore.length; i++){
      Object.keys(userScore[i]).map((item,index)=> {
        Object.keys(codeTable.과목코드).map((codeItem,codeIndex)=> {
          codeTable.과목코드[codeItem].forEach((subject_name) => {
          if(userScore[i].subject_a === subject_name){
            if(codeItem === '국어' || codeItem === '수학' ){
              schoolData[codeItem].과목 = userScore[i].subject_a;
              schoolData[codeItem].표준점수 = parseInt(userScore[i].standardscore);
            
            }
            if(codeItem === '사탐'){
              
              if(schoolData.사탐1.과목 === ''){
                schoolData.사탐1.과목 = userScore[i].subject_a;
                schoolData.사탐1.표준점수 = parseInt(userScore[i].standardscore);
              }else {
                schoolData.사탐2.과목 = userScore[i].subject_a;
                schoolData.사탐2.표준점수 = parseInt(userScore[i].standardscore);
              

              }
            }
            if(codeItem === '과탐'){
              
              if(schoolData.과탐1.과목 === ''){
                schoolData.과탐1.과목 = userScore[i].subject_a;
                schoolData.과탐1.표준점수 = parseInt(userScore[i].standardscore);
              
              }else {
                schoolData.과탐2.과목 = userScore[i].subject_a;
                schoolData.과탐2.표준점수 = parseInt(userScore[i].standardscore);
              
              }
            }
            if(codeItem === '영어' || codeItem === '한국사' || codeItem === '제2외국어'){
              schoolData[codeItem].과목 = userScore[i].subject_a;
              schoolData[codeItem].표준점수 = parseInt(userScore[i].grade);
              
            } 
          }else {
          }
          });
        })
      })
    }
   }

   Object.keys(schoolData).map((item,index)=> {
      if(item !== '학교' &&  item !== '이문과' && schoolData[item].과목 === ''){
        delete schoolData[item];

      }
      else {

        if(item !== '학교' &&  item !== '이문과'){
          schoolData[item].과목 = codeNameTable[schoolData[item].과목] ;
        }
                
        
      }
   });

   if(mainData({...schoolData}).success === true){
    myData.내점수 = mainData({...schoolData}).내점수;
    myData.퍼센트순위 = mainData({...schoolData}).퍼센트순위;

    Object.keys(schoolData).map((item,index)=> {
      if(item === '국어' || item === '수학' || item === '사탐1' || item === '사탐2' || item === '과탐1' || item === '과탐2'){
        myData.표점합 = myData.표점합 + schoolData[item].표준점수;
      }else{

      }
    
    });
    
   
    
   }else {
    myData.내점수 = 0;
    myData.퍼센트순위 = 100;
   }

   return myData
  }

 

  const onSeeDetailClick = data => {
    data.내점수 = Math.floor(내성적계산(data.점수환산,data.계열,userScore).내점수 * 100) / 100;
    data.퍼센트순위 = Math.floor(내성적계산(data.점수환산,data.계열,userScore).퍼센트순위 * 100) / 100;
    window.open(
      // process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' + JSON.stringify(data),
      'https://ingipsy.com/regular/detail?data=' + JSON.stringify(data),
      '_blank',
    );
  };

  const onClickDelBtn = async (index, data) => {
    
    univInterest[data.모집군].data.splice(index, 1);
    if(data.모집군 === '가'){
      setUnivInterest({...univInterest, 가 : {type : '가', data :  univInterest[data.모집군].data }})
    }
    if(data.모집군 === '나'){
      setUnivInterest({...univInterest, 나 : {type : '나', data :  univInterest[data.모집군].data }})
    }
    if(data.모집군 === '다'){
      setUnivInterest({...univInterest, 다 : {type : '다', data :  univInterest[data.모집군].data }})
    }
    await grade_delete(data);
    
    

  };


  const grade_delete = async (_analysisUniv) => {
    return await axios.post(
      '/api/useful/delete',
      {
        loginData: loginData,
        data : _analysisUniv,
      },
      {
        headers: {
          auth: localStorage.getItem('realuid'),
        },
      },
    ).then(res => {
      if(res.data.success === true){
        return alert('삭제했습니다.');
        
      }else { 
        return alert('유불리 분석에 실패했습니다. 재시도해주십시오.');
      }
    })
  }


 
  const interestUnivData = (type) => {
    
    return (
    
       univInterest[type].data.length > 0 && univInterest[type].data.map((item,index) => {
        return (
          <tr key={index}>
              <S.RegularTD>{item.대학교}</S.RegularTD>
              <S.RegularTD>{item.계열}</S.RegularTD>
              <S.RegularTD>{item.모집단위}</S.RegularTD>
              <S.RegularTD>{Math.floor(내성적계산(item.점수환산,item.계열,userScore).내점수 * 100) / 100}점</S.RegularTD>
            <S.RegularTD>{Math.floor(item.대학점수_85 * 100) / 100}점</S.RegularTD>
            <S.RegularTD>{Math.floor((내성적계산(item.점수환산,item.계열,userScore).내점수 - item.대학점수_85) * 100) / 100}점</S.RegularTD>
              <S.RegularTD>{(내성적계산(item.점수환산,item.계열,userScore).내점수 - 평균대학점수계산(item.점수환산,item.계열, 내성적계산(item.점수환산,item.계열,userScore).표점합)).toFixed(2)}점</S.RegularTD>
              <S.RegularTD>{(평균대학누백계산(item.점수환산,item.계열, 내성적계산(item.점수환산,item.계열,userScore).표점합) - Math.floor(내성적계산(item.점수환산,item.계열,userScore).퍼센트순위 * 100) / 100).toFixed(2)}%</S.RegularTD>
       
            <S.RegularTD>{ Math.floor(((( (내성적계산(item.점수환산,item.계열,userScore).내점수) - 평균대학점수계산(item.점수환산,item.계열, 내성적계산(item.점수환산,item.계열,userScore).표점합)).toFixed(2)) *  유불리_점수통일(item.점수환산,item.계열)) * 100) / 100}점</S.RegularTD> 

              <S.RegularTD>
                <CustomButton onClick={() => onSeeDetailClick(item)}>
                  {'상세보기'}
                </CustomButton>
              </S.RegularTD>
              <S.RegularTD>
                <CustomButton onClick={() => onClickDelBtn(index,univInterest[type].data[index])}>
                  {'삭제'}
                </CustomButton>
              </S.RegularTD>

              <S.RegularTD>
              <CustomButton
                onClick={()=>{
                  let emptyArray = chartList.array;
                  emptyArray.push(item);
                  setChartList({array : emptyArray});
                }}
              >
                지원조합전략이동
              </CustomButton>
              </S.RegularTD>
          </tr>

          )
            
          })
    )
  }

  const 지원조합전략표 = () => {

    return (
      chartList.array.map((item,index) => (
        <tr key = {index}>
          <S.RegularTD>{item.모집군}</S.RegularTD>
          <S.RegularTD>{item.대학교}</S.RegularTD>
          <S.RegularTD>{item.모집단위}</S.RegularTD>
          <S.RegularTD>{item.정원}명</S.RegularTD>
          
          <S.RegularTD>{관심대학_작년경쟁률(item.대학교,item.모집군,item.모집단위)}</S.RegularTD>
          <S.RegularTD>{Math.floor(내성적계산(item.점수환산,item.계열,userScore).내점수 * 100) / 100}점</S.RegularTD>
          <S.RegularTD>{Math.floor(item.대학점수_85 * 100) / 100}점</S.RegularTD>
          <S.RegularTD>{Math.floor((내성적계산(item.점수환산,item.계열,userScore).내점수 - item.대학점수_85) * 100) / 100}점</S.RegularTD>
          <S.RegularTD>
            <CustomButton
              onClick={()=> {
                let emptyArray = chartList.array;
                emptyArray.splice(index,1);
                setChartList({array : emptyArray})
              }}
            >
              삭제
            </CustomButton>
          </S.RegularTD>

        </tr>
      ))
    )
  }

  const 모집군_공통타이틀 = () => {
    return (
      <>
      <tr>
        <S.RegularTH rowSpan={2}>{'대학명'}</S.RegularTH>
        <S.RegularTH rowSpan={2}>{'계열'}</S.RegularTH>
        <S.RegularTH rowSpan={2}>{'모집단위'}</S.RegularTH>
        <S.RegularTH colSpan={3}>{'합격 예측'}</S.RegularTH>
        <S.RegularTH colSpan={3}>{'대학 유불리'}</S.RegularTH>
        <S.RegularTH rowSpan={2}>{'상세보기'}</S.RegularTH>
        <S.RegularTH rowSpan={2}>{'삭제'}</S.RegularTH>
        <S.RegularTH rowSpan={2}>{'지원조합전략이동'}</S.RegularTH>
      </tr>
      <tr>
        <S.RegularTD>{'내 점수'}</S.RegularTD>
        <S.RegularTD>{'예측컷'}</S.RegularTD>
        <S.RegularTD>{'차이'}</S.RegularTD>
      
      
        <S.RegularTD>{'대학점수 차이'}</S.RegularTD>
        <S.RegularTD>{'누백 차이'}</S.RegularTD>
        <S.RegularTD>{'1000점통일 환산이익'}</S.RegularTD>
      </tr>
      </>

    )
  }




  return (
    <>
      <S.Container>
        <S.RegularContainer>
          <S.ContentTitle>{'관심 대학'}</S.ContentTitle>
          <S.MoblieOverflowContainer>
            <S.SubTitle>{'가군'}</S.SubTitle>
            <S.RegularTable>
              <tbody>
               {모집군_공통타이틀()}
              {interestUnivData('가')}
                

              </tbody>
            </S.RegularTable>
            <S.SubTitle>{'나군'}</S.SubTitle>
            <S.RegularTable>
              <tbody>
              {모집군_공통타이틀()}
              
                {interestUnivData('나')}
              </tbody>
            </S.RegularTable>
            <S.SubTitle>{'다군'}</S.SubTitle>
            <S.RegularTable>
              <tbody>
                {모집군_공통타이틀()}
                {interestUnivData('다')}
              </tbody>
            </S.RegularTable>
            {/* <S.SubTitle>{'지원대학 우선조합'}</S.SubTitle>
            <S.RegularTable>
              <tbody>
                <tr>
                  <S.RegularTH rowSpan={2}>{'군'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'유불리 순위'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'대학명'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'계열'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'예측컷'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'모집단위'}</S.RegularTH>
                  <S.RegularTH colSpan={5}>{'예측컷'}</S.RegularTH>
                  <S.RegularTH colSpan={3}>{'유불리'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'상세보기'}</S.RegularTH>
                  <S.RegularTH rowSpan={2}>{'저장삭제'}</S.RegularTH>
                </tr>
                <tr>
                  <S.RegularTD>{'대학별 점수'}</S.RegularTD>
                  <S.RegularTD>{'안정'}</S.RegularTD>
                  <S.RegularTD>{'적정'}</S.RegularTD>
                  <S.RegularTD>{'소신'}</S.RegularTD>
                  <S.RegularTD>{'안정도'}</S.RegularTD>

                  <S.RegularTD>{'누백이익'}</S.RegularTD>
                  <S.RegularTD>{'대학환산점수이익'}</S.RegularTD>
                  <S.RegularTD>{'1000점이익'}</S.RegularTD>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
              </tbody>
            </S.RegularTable> */}
            <S.SubTitle>{'지원 조합 전략'}</S.SubTitle>
            <S.RegularTable>
              <tbody>
                <tr>
                  <S.RegularTH style={{width: '25%'}}>{'군'}</S.RegularTH>
                 

                  <S.RegularTH>{'대학'}</S.RegularTH>
                  <S.RegularTH>{'모집단위'}</S.RegularTH>
                  <S.RegularTH>{'모집인원'}</S.RegularTH>
                  <S.RegularTH>{'작년 경쟁률'}</S.RegularTH>
                  <S.RegularTH>{'내점수'}</S.RegularTH>
                  <S.RegularTH>{'예측컷'}</S.RegularTH>
                  <S.RegularTH>{'내점수와의차이'}</S.RegularTH>
                  <S.RegularTH>{'삭제'}</S.RegularTH>
                  
                </tr>
                {지원조합전략표()}
               
              </tbody>
            </S.RegularTable>
          </S.MoblieOverflowContainer>
        </S.RegularContainer>
      </S.Container>
      <style jsx>{`
        .inputFile {
          font-size: 1rem;
        }
        .typename {
          display: flex;
          margin: 1rem 0;
          font-size: 1.5rem;
          /* width: 25rem;
          height: 2.5rem; */
        }
        .radioBtnBox {
          width: 12rem;
          height: 2.5rem;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 0.7rem;
          border: 1px solid #3d94de;
          margin: 0 1rem 1rem 0;
          box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
          transition: 300ms ease-in-out;
        }
        .radioBtnBoxOn {
          width: 12rem;
          height: 2.5rem;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0 0.7rem;
          border: 1px solid #3d94de;
          margin: 0 1rem 1rem 0;
          box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
          transition: 300ms ease-in-out;
          background-color: #3d94de50;
        }
        .radioBtnBox span {
          font-size: 0.75rem;
        }
        .radioBtnBox:hover {
          transform: translate(3px, -3px);
        }
        .radioBtnBox input,
        .radioBtnBoxOn input {
          margin: 0 0.5rem 0 0;
        }
        .typeBox {
          display: flex;
          flex-wrap: wrap;
          width: 40rem;
        }
        @media (max-width: 1024px) {
          .typeBox {
            width: 100%;
          }
          .radioBtnBoxOn {
            width: 90vw;
          }
          .radioBtnBox {
            width: 30vw;
          }
        }
      `}</style>
    </>
  );
};

export default UnivOfInterest;
