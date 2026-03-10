import React, {useEffect, useState} from 'react';

import * as S from '../index.style';



const RealUnivCut =  (props) => {


   const {
        univ
    } = props;

    const data = props?.univ;

    let 대학점수_70 = Math.floor(data.대학점수_70 * 100) / 100;
    let 대학점수_85 = Math.floor(data.대학점수_85 * 100) / 100;
    let 대학점수_100 = Math.floor(data.대학점수_100 * 100) / 100;
    
    let 대학누백_70 = Math.floor(data.대학누백_70 * 100) / 100;
    let 대학누백_85 = Math.floor(data.대학누백_85 * 100) / 100;
    let 대학누백_100 = Math.floor(data.대학누백_100 * 100) / 100;

      return (
        <S.ContentContainer>
        <S.ContentTitleContainer>
          <S.ContentTitle>{'2. 대학 발표 실제컷'}</S.ContentTitle>
        
        </S.ContentTitleContainer>
        <S.InfoTable>
          <thead>
            <tr>
              <S.InfoTH colSpan={10}>{'전과목 컷(최종등록자)'}</S.InfoTH>
              {/* <S.InfoTH colSpan={5}>{'영역별 컷(최종등록자)'}</S.InfoTH> */}
            
            </tr>
            <tr>
               <S.InfoTH colSpan={5}>{'백분위'}</S.InfoTH>
              <S.InfoTH colSpan={5}>{'대학별 환산점수'}</S.InfoTH>
              {/* <S.InfoTH colSpan={5}>{'70%컷 백분위'}</S.InfoTH> */}
             
            
            </tr>
            <tr>
             
              <S.InfoTH >{'70%컷'}</S.InfoTH>
              <S.InfoTH >{'85%컷'}</S.InfoTH>
              <S.InfoTH >{'100%컷(최저)'}</S.InfoTH>
             
              <S.InfoTH >{'최고점'}</S.InfoTH>
              <S.InfoTH >{'평균'}</S.InfoTH>
             
              <S.InfoTH >{'70%컷'}</S.InfoTH>
            
              <S.InfoTH >{'85%컷'}</S.InfoTH>
              <S.InfoTH >{'100%컷(최저)'}</S.InfoTH>
              <S.InfoTH >{'최고점'}</S.InfoTH>
              <S.InfoTH >{'평균'}</S.InfoTH>
              
              
              {/* <S.InfoTH >{'국어'}</S.InfoTH>
              <S.InfoTH >{'수학'}</S.InfoTH>
              <S.InfoTH >{'탐구'}</S.InfoTH>
              <S.InfoTH >{'평균'}</S.InfoTH>
              <S.InfoTH >{'영어 등급'}</S.InfoTH> */}

              
            </tr>
          </thead>
          <tbody>
            <tr>
             
           
              <S.InfoTD>{대학누백_70}</S.InfoTD>
              <S.InfoTD>{대학누백_85}</S.InfoTD>
              <S.InfoTD>{대학누백_100}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{대학점수_70}</S.InfoTD>
              <S.InfoTD>{대학점수_85}</S.InfoTD>
              <S.InfoTD>{대학점수_100}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
   
           
              
            </tr>
          </tbody>
        </S.InfoTable> 
        </S.ContentContainer> 
      )
    
  }

  export default RealUnivCut;