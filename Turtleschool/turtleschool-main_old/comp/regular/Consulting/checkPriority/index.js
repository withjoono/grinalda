import axios from 'axios';
import React, {useEffect, useState} from 'react';
import Advice from '../../../Advice';
import * as S from './index.style';
import PropTypes from 'prop-types';
import {savePersonConvertScore} from '../../../../src/api/csat';
import {useCheckPriority} from './useCheckPriority';

import {내성적계산,평균대학점수계산,평균대학누백계산,유불리_점수통일,유불리_대학총점계산} from '../../../../common/scoreCalc';

const CheckPriority = ({type,selectedUniv,loginData,userScore, }) => {
  const {filteredUniv,setFilteredUniv, analysisUniv,setAnalysisUniv, onClickAnaylsisBtn, onClickDelBtn, onClickSaveBtn,onClickAnaylsisAllBtn} =
    useCheckPriority(selectedUniv,loginData);

      // 가군, 나군, 다군 별로 데이터 찾기
  const grade_find = async (loginData,type) => {
    return await axios.post(
      '/api/useful/find',
      {
        loginData: loginData,
        type : type,
      },
      {
        headers: {
          auth: localStorage.getItem('realuid'),
        },
      },
    ).then(res => {
        console.log('resData : ', res.data.data);
      return res.data.data;
    })
  }

    useEffect(async ()=> {
      if(grade_find) {
        const a = await grade_find(loginData,type);
        if(a)  {
          a.map((item, index) => {
            let i = JSON.parse(item.useful_data);
            
              if(!JSON.stringify(filteredUniv).includes(JSON.stringify(i))) {
                setFilteredUniv(filteredUniv.concat(i));
              }
              if(!JSON.stringify(analysisUniv).includes(JSON.stringify(i))) {
              
                setAnalysisUniv(analysisUniv.concat(i));

              }
          })
        }
      }
  

 


    },[useCheckPriority])

   
  return (
    <S.Container>
      <Advice style={{marginBottom: '1.8rem', fontSize: '.8rem'}}>
        <b> 1. 내 점수의 대학별 누적 백분위?</b> <br />
        대학별 내점수를 상위누적백분위로 나타낸 수치입니다. 대학마다 내 누적백분위가 모두 다른데,
        가장 낮은 수치가 가장 유리한 대학입니다.
        <br /> <br />
        <b>2. 대학별 유불리 지수?</b> <br />
        대학별 유불리를 보여주는 일반적인 방식이 대학별 누적 백분위이지만, 백분위로 보여줄 때,
        유불리한 정도가 와닿지가 않기 때문에, 각 대학에서 내 점수와 동일한 성적 학생들의 평균치와의
        차이점을 보여주는 지수가 '대학별 유불리 지수'입니다. (대학별 유불리 지수 = '대학별 내 점수'
        - 내 표점과 동일 표점의 '해당 대학의 평균' 점수) 수치가 '-'로 나오면, 이 대학은 나에게
        불리하다는 말이며, '+'로 나오고, 수치가 클수록 나에게 유리하다는 뜻입니다.
        <br /> <br />
        <b>3. 1000점 통일 유불리 지수?</b> <br />
        대학별 유불리지수를 알더라도, 각 대학별 점수의 총점이 다르기 때문에, 대학별로 비교 자체가
        어렵습니다. 이런 부분을 보완하기 위해서, 대학별 유불리지수를 1000점만점으로 통일함으로써,
        대학간 유불리 지수를 보다 수월하게 비교할 수 있도록 만든 지수입니다. 내 점수의 대학별 누적
        백분위, 대학별 유불리 지수, 1000점 통일 유불리 지수는 계산할 부분이 많아서, 부하가 걸리기
        쉽습니다, 11월 17일(수능일)~11월말의 기간에, 트래픽 양이 가장 많기 때문에, 이 기간을
        피해서-이 기간엔 공란으로 나옵니다-, 11월말 이후부터 보여짐을 양해 부탁드립니다.
      </Advice>

      <ListTable
        title={type === '가' ? '가군 필터링 대학' : type==='나'? '나군 필터링 대학' : '다군 필터링 대학'}
        univs={filteredUniv}
        userScore={userScore}
        onClickAnaylsisBtn={onClickAnaylsisBtn}
        onClickAnaylsisAllBtn={onClickAnaylsisAllBtn}
        onClickDelBtn={onClickDelBtn}
      />
      <AdvantageousTable
        title="대학별 유불리 분석"
        univs={analysisUniv}
        onClickSaveBtn={onClickSaveBtn}
        onClickDelBtn={onClickDelBtn}
        userScore={userScore}
      />
    </S.Container>
  );
};

const AdvantageousTable = ({title, univs, onClickSaveBtn, onClickDelBtn,userScore}) => {
  const onSeeDetailClick = data => {
  
      data.내점수 = Math.floor(내성적계산(data.점수환산,data.계열,userScore).내점수 * 100) / 100;
      data.퍼센트순위 = Math.floor(내성적계산(data.점수환산,data.계열,userScore).퍼센트순위 * 100) / 100;
    window.open(
      // process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' + JSON.stringify(data),
      'https://ingipsy.com/regular/detail?data=' + JSON.stringify(data),
      '_blank',
    );
  };

  let ageResult; 
  ageResult = univs.sort((a,b) => {
    return   (((내성적계산(b.점수환산,b.계열,userScore).내점수) - 평균대학점수계산(b.점수환산,b.계열, 내성적계산(b.점수환산,b.계열,userScore).표점합)).toFixed(2)) *  유불리_점수통일(b.점수환산,b.계열) - (((내성적계산(a.점수환산,a.계열,userScore).내점수) - 평균대학점수계산(a.점수환산,a.계열, 내성적계산(a.점수환산,a.계열,userScore).표점합)).toFixed(2)) *  유불리_점수통일(a.점수환산,a.계열) 
  })

  return (
    <S.ListContainer>
      <S.ListHeaderContainer>
        <S.ContentTitle>{title}</S.ContentTitle>
      </S.ListHeaderContainer>
      <S.MoblieOverflowContainer>
        <S.ListTable>
          <tr>
            <S.ListTH rowSpan={2}>{'해당 대학 유불리순위'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'대학명'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'계열'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'모집단위'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'대학점수총점'}</S.ListTH>
            <S.ListTH colSpan={2}>{'내 대학 점수'}</S.ListTH>
            <S.ListTH colSpan={2}>{'동점수 평균 대학 점수'}</S.ListTH>
            <S.ListTH colSpan={3}>{'해당대학 유불리'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'상세보기'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'삭제'}</S.ListTH>
          </tr>
          <tr>
            <S.ListTH>{'내 대학별 점수'}</S.ListTH>
            <S.ListTH>{'해당대학 누백'}</S.ListTH>
            <S.ListTH>{'평균 대학점수'}</S.ListTH>
            <S.ListTH>{'평균 누백(표+백)'}</S.ListTH>
            <S.ListTH>{'대학점수 차이'}</S.ListTH>
            <S.ListTH>{'누백 차이'}</S.ListTH>
            <S.ListTH style={{ color : '#FF3232' , fontWeight : 900}}>{'1000점통일유불리'}</S.ListTH>
          </tr>
          {ageResult.map((univ, index) => (
            <tr key={`${univ.대학교}-${univ.모집단위}`}>
              <S.ListTD>{index + 1}</S.ListTD>
              <S.ListTD>{univ.대학교 || '-'}</S.ListTD>
              <S.ListTD>{univ.계열}</S.ListTD>
              <S.ListTD>{univ.모집단위}</S.ListTD>
              <S.ListTD>{유불리_대학총점계산(univ.점수환산,univ.계열)}점</S.ListTD>
              <S.ListTD>{Math.floor(내성적계산(univ.점수환산,univ.계열,userScore).내점수 * 100) / 100}점</S.ListTD>
              
              <S.ListTD>{Math.floor(내성적계산(univ.점수환산,univ.계열,userScore).퍼센트순위 * 100) / 100}%</S.ListTD>
              <S.ListTD>{평균대학점수계산(univ.점수환산,univ.계열, 내성적계산(univ.점수환산,univ.계열,userScore).표점합)}점</S.ListTD>
              <S.ListTD>{평균대학누백계산(univ.점수환산,univ.계열, 내성적계산(univ.점수환산,univ.계열,userScore).표점합)}%</S.ListTD>
              <S.ListTD>{((내성적계산(univ.점수환산,univ.계열,userScore).내점수) - 평균대학점수계산(univ.점수환산,univ.계열, 내성적계산(univ.점수환산,univ.계열,userScore).표점합)).toFixed(2)}점 </S.ListTD>
              <S.ListTD>{(평균대학누백계산(univ.점수환산,univ.계열, 내성적계산(univ.점수환산,univ.계열,userScore).표점합)-Math.floor(내성적계산(univ.점수환산,univ.계열,userScore).퍼센트순위 * 100) / 100).toFixed(2)}%</S.ListTD>
              <S.ListTD style={{fontWeight : 900, backgroundColor : '#fff',color : '#FF3232'}}>{(((내성적계산(univ.점수환산,univ.계열,userScore).내점수) - 평균대학점수계산(univ.점수환산,univ.계열, 내성적계산(univ.점수환산,univ.계열,userScore).표점합)).toFixed(2)) *  유불리_점수통일(univ.점수환산,univ.계열)  }점</S.ListTD>
              <S.ListTD>
                <S.SeeDetailButton onClick={() => onSeeDetailClick(univ)}>
                  {'상세보기'}
                </S.SeeDetailButton>
              </S.ListTD>
              <S.ListTD>
                {/* <S.SaveBtn onClick={onClickSaveBtn}>저장</S.SaveBtn> */}
                <S.DelBtn onClick={() => onClickDelBtn(index, 'anaylsis')}>삭제</S.DelBtn>
              </S.ListTD>
            </tr>
          ))}
        </S.ListTable>
      </S.MoblieOverflowContainer>
    </S.ListContainer>
  );
  
};

const ListTable = ({title, univs, onClickAnaylsisBtn, onClickDelBtn,userScore,onClickAnaylsisAllBtn}) => {
  const onSeeDetailClick = data => {
   
   
    data.내점수 = Math.floor(내성적계산(data.점수환산,data.계열,userScore).내점수 * 100) / 100;
    data.퍼센트순위 = Math.floor(내성적계산(data.점수환산,data.계열,userScore).퍼센트순위 * 100) / 100;
    window.open(
      // process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' + JSON.stringify(data),
      'https://ingipsy.com/regular/detail?data=' + JSON.stringify(data),
      '_blank',
    );
  };

  return (
    <S.ListContainer>
      <S.ListHeaderContainer>
        <S.ContentTitle>{title}</S.ContentTitle>
      </S.ListHeaderContainer>
      <S.MoblieOverflowContainer>
        <S.ListTable>
          <tr>
            <S.ListTH rowSpan={2}>{'위험도 순위'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'대학명'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'계열'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'모집단위'}</S.ListTH>
            <S.ListTH colSpan={2}>{'내 점수'}</S.ListTH>
            <S.ListTH colSpan={2}>{'적정(추합포함 70%컷)'}</S.ListTH>
            <S.ListTH colSpan={2}>{'소신(추합포함 85%컷)'}<br/><span style={{ color : '#FF3232', fontSize : 12, fontWeight : 900}}>{'(예측컷)'}</span></S.ListTH>
            <S.ListTH colSpan={2}>{'위험(추합포함 100%컷)'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'내점수와 예측컷의 차이'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'상세보기'}</S.ListTH>
            <S.ListTH rowSpan={2}>{'유불리 분석 or 삭제'}<br/>
                <S.SaveBtn onClick={() => onClickAnaylsisAllBtn(univs)}>전체분석</S.SaveBtn>
            </S.ListTH>
          </tr>
          <tr>
            <S.ListTH>{'대학점수'}</S.ListTH>
            <S.ListTH>{'누백'}</S.ListTH>
            <S.ListTH>{'대학점수'}</S.ListTH>
            <S.ListTH>{'누백'}</S.ListTH>
            <S.ListTH>{'대학점수'}</S.ListTH>
            <S.ListTH>{'누백'}</S.ListTH>
            <S.ListTH>{'대학점수'}</S.ListTH>
            <S.ListTH>{'누백'}</S.ListTH>
          </tr>
          {univs.map((univ, index) => (
             <tr key={`${univ.대학교}-${univ.모집단위}`}>
              <S.ListTD>{'1단계'}</S.ListTD>
              <S.ListTD>{univ.대학교 || '-'}</S.ListTD>
              <S.ListTD>{univ.계열 || '-'}</S.ListTD>
              <S.ListTD>{univ.모집단위}</S.ListTD>
              <S.ListTD style={{ color : '#FF3232' , fontWeight : 900}}>{Math.floor(내성적계산(univ.점수환산,univ.계열,userScore).내점수 * 100) / 100}</S.ListTD>
              <S.ListTD>{Math.floor(내성적계산(univ.점수환산,univ.계열,userScore).퍼센트순위 * 100) / 100}</S.ListTD>
              <S.ListTD>{Math.floor(univ.대학점수_70 * 100) / 100 }</S.ListTD>
              <S.ListTD>{Math.floor(univ.대학누백_70 * 100) / 100 }</S.ListTD>
              <S.ListTD style={{ color : '#FF3232' , fontWeight : 900}}>{Math.floor(univ.대학점수_85 * 100) / 100 }</S.ListTD>
              <S.ListTD>{Math.floor(univ.대학누백_85 * 100) / 100 }</S.ListTD>
              <S.ListTD>{Math.floor(univ.대학점수_100 * 100) / 100 }</S.ListTD>
              <S.ListTD>{Math.floor(univ.대학누백_100 * 100) / 100 }</S.ListTD>
              <S.ListTD style={{ color : '#FF3232' , fontWeight : 900}}>{Math.floor((내성적계산(univ.점수환산,univ.계열,userScore).내점수 - univ.대학점수_85) * 100  ) / 100  }</S.ListTD>
              <S.ListTD>
                <S.SeeDetailButton onClick={() => onSeeDetailClick(univ)}>
                  {'상세보기'}
                </S.SeeDetailButton>
              </S.ListTD>
              <S.ListTD>
                <S.SaveBtn onClick={() => onClickAnaylsisBtn(univ)}>분석</S.SaveBtn>
                <S.DelBtn onClick={() => onClickDelBtn(index, 'filtered')}>삭제</S.DelBtn>
              </S.ListTD>
            </tr>
          ))}
        </S.ListTable>
      </S.MoblieOverflowContainer>
    </S.ListContainer>
  );
};

CheckPriority.propTypes = {
  selectedUniv: PropTypes.node.isRequired,
  userScore : PropTypes.node.isRequired,
};

ListTable.propTypes = {
  title: PropTypes.node.isRequired,
  univs: PropTypes.node.isRequired,
  userScore : PropTypes.node.isRequired,
  onClickAnaylsisAllBtn : PropTypes.node.isRequired,
};

export default CheckPriority;
