
import React, {useEffect, useState} from 'react';

import * as S from '../index.style';
import PropTypes from 'prop-types';

const YearAnalysis =  (props) => {


    const {
        formula
     } = props;

    


     return (
    <S.ContentContainer>
        <S.ContentTitleContainer>
        <S.ContentTitle>{'3. 최근 3개년 실질경쟁율과 컷 변화'}</S.ContentTitle>
       
      </S.ContentTitleContainer>
      <S.InfoTable>
        <thead>
          <tr>
            <S.InfoTH >{'년도'}</S.InfoTH>
            <S.InfoTH >{'모집인원'}</S.InfoTH>
            <S.InfoTH >{'경쟁률'}</S.InfoTH>
            <S.InfoTH >{'추가모집인원'}</S.InfoTH>
            <S.InfoTH >{'충원율'}</S.InfoTH>
            <S.InfoTH>{'추가모집인원 포함 정원'}</S.InfoTH>
            <S.InfoTH >{'추가모집인원 포함 경쟁률'}</S.InfoTH>
            <S.InfoTH style={{color: '#BF3752'}}>{'컷라인'}</S.InfoTH>
            <S.InfoTH style={{color: '#4572E4'}}>{'누백'}</S.InfoTH>
          </tr>
        </thead>
        <tbody> 
          <tr>
            <S.InfoTD>{'2020'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
          </tr>
          <tr>
            <S.InfoTD>{'2021'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
          </tr>
          <tr>
            <S.InfoTD>{'2022'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
            <S.InfoTD>{'-'}</S.InfoTD>
          </tr>
          <tr>
            <S.InfoTD>{'평균'}</S.InfoTD>
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

      </S.ContentContainer>
      )
}


export default YearAnalysis;