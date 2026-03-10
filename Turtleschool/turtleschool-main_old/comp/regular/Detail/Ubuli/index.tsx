import React, {useEffect, useState} from 'react';

import * as S from '../index.style';



const Ubuli =  (props) => {


   const {
        univ
    } = props;

 
      
      return (
        <>
        <S.ContentTitleContainer>
          <S.ContentTitle>{'2. 해당 대학 유불리'}</S.ContentTitle>
        
        </S.ContentTitleContainer>
        <S.InfoTable>
          <thead>
            <tr>
              <S.InfoTH rowSpan={2}>{'대학명'}</S.InfoTH>
              <S.InfoTH rowSpan={2}>{'계열'}</S.InfoTH>
              <S.InfoTH rowSpan={2}>{'모집단위'}</S.InfoTH>
              <S.InfoTH rowSpan={2}>{'대학점수총점'}</S.InfoTH>
              
              <S.InfoTH colSpan={2}>{'내 대학 점수'}</S.InfoTH>
              <S.InfoTH colSpan={2}>{'동점수 평균 대학 점수'}</S.InfoTH>
              <S.InfoTH colSpan={3}>{'해당대학 유불리'}</S.InfoTH>
            </tr>
            <tr>
              <S.InfoTH >{'내 대학별 점수'}</S.InfoTH>
              <S.InfoTH >{'해당대학 누백'}</S.InfoTH>
              <S.InfoTH >{'평균 대학점수'}</S.InfoTH>
              <S.InfoTH >{'평균 누백(표+백)'}</S.InfoTH>
              <S.InfoTH >{'대학점수 차이'}</S.InfoTH>
              <S.InfoTH >{'누백 차이'}</S.InfoTH>
              <S.InfoTH >{'1000점통일환산이익'}</S.InfoTH>
              
            </tr>
          </thead>
          <tbody>
            <tr>
              <S.InfoTD>{univ?.name || '-'}</S.InfoTD>
              <S.InfoTD>{univ?.major_nm || '-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
              <S.InfoTD>{'-'}</S.InfoTD>
            
              
            </tr>
          </tbody>
        </S.InfoTable> 
        </> 
      )
    
  }

  export default Ubuli;