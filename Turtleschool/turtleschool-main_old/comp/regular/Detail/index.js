import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import * as S from './index.style';
import PropTypes from 'prop-types';
//import { Info } from '@material-ui/icons';
import {Chart} from 'chart.js/auto';
import {Line} from 'react-chartjs-2';
import { ConstructionOutlined } from '@mui/icons-material';
// Chart.register(...registerables);
import SearchMajor from '../Common/SearchMajor';
import DevChart from './Chart';
import Ubuli from './Ubuli';
import YearAnalysis from './YearAnalysis';
import RealUnivCut from './RealUnivCut';
import FixUnivChart from './FixUnivChart';
import DiffrentUnivChart from './DiffrentUnivChart';

import { 관심대학_작년경쟁률 } from '../../../common/interestScoreCalc';
import { 내성적계산,상세보기_변환,majorSearchUnivData, 문이과구분,regionSearchMajorData,학과검색최종데이터 ,majorDiffSearchUnivData} from '../../../common/univStandard/calc';

const Detail = () => {
  const router = useRouter();

  const [formula, setFormula] = useState([]);
  const [univ, setUniv] = useState({});


  useEffect(() => {
    if (router?.query?.data) {
      setUniv(JSON.parse(router.query.data));
    }
   
  }, [router]);



  
  



  return (
    <S.Container>
      <Information univ={univ} formula={formula} />
      <Prediction univ={univ} />
      {/* <YearAnalysis formula={formula} /> */}
      <RealUnivCut univ={univ}/>
      <UnivAnalysis univ={univ} />
      
    </S.Container>
  );
};

const Information = ({univ, formula}) => {
  // 가장 상단 대학 정보와 산출 방법, 환산점수표 컴포넌트
  const [score, setScore] = useState([]);
  //const [headerInfo, setHeaderInfo] = useState({});

  const renderFormulaTable = formula => {
    return (
      <>
        <S.InfoTableTitle>{'성적 반영 방식'}</S.InfoTableTitle>
        <S.InfoTable>
          <tbody>
            <tr>
            
            <S.InfoTH colSpan={3}>{'수능영역별 활용점수'}</S.InfoTH>
            <S.InfoTH >{'국어'}</S.InfoTH>
            <S.InfoTH colSpan={4}>{'수학'}</S.InfoTH>
            <S.InfoTH colSpan={2}>{'팀구'}</S.InfoTH>
            <S.InfoTH >{'특이사항'}</S.InfoTH>

          </tr>
            <tr>
           
              <S.InfoTH>{'국어'}</S.InfoTH>
              <S.InfoTH>{'수학'}</S.InfoTH>
              <S.InfoTH>{'탐구'}</S.InfoTH>
              <S.InfoTH>{'선택과목'}</S.InfoTH>
              <S.InfoTH>{'선택과목'}</S.InfoTH>
              <S.InfoTH>{'확통'}<br/>{'가산점'}</S.InfoTH>
              <S.InfoTH>{'미적'}<br/>{'가산점'}</S.InfoTH>
              <S.InfoTH>{'기하'}<br/>{'가산점'}</S.InfoTH>
              <S.InfoTH>{'유형'}</S.InfoTH>
              <S.InfoTH>{'과학'}<br/>{'가산점'}</S.InfoTH>
              <S.InfoTH>{'특이사항'}</S.InfoTH>
            </tr>
           
             
                <tr>
                 

                  <S.InfoTD>{상세보기_변환('국어활용점수',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('수학활용점수',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('탐구활용점수',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('국어 선택과목',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('수학 선택과목',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('확통가산점',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('미적가산점',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('기하가산점',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('탐구 유형',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('과학가산점',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('수능특이사항',univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                
                </tr>
              
       
         
          </tbody>
        </S.InfoTable>

        <S.InfoTable style={{marginTop : 30}}>
          <tbody>
            <tr> 
            <S.InfoTH rowSpan={2}>{'수능조합'}</S.InfoTH>
            <S.InfoTH rowSpan={2}>{'탐구 지정 과목'}</S.InfoTH>
            <S.InfoTH rowSpan={2}>{'수능'}<br/>{'반영'}<br/>{'총점'}</S.InfoTH>
            <S.InfoTH colSpan={6}>{'수능 반영 비율'}</S.InfoTH>
          </tr>
            <tr>
           
              <S.InfoTH>{'국어'}</S.InfoTH>
              <S.InfoTH>{'수학'}</S.InfoTH>
              <S.InfoTH>{'영어'}</S.InfoTH>
              <S.InfoTH>{'탐구'}</S.InfoTH>
              <S.InfoTH>{'제2외국어'}</S.InfoTH>
              <S.InfoTH>{'한국사'}</S.InfoTH>
              
            
            </tr>

                <tr>
                  <S.InfoTD>{상세보기_변환('수능조합',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('탐구지정과목',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('전형총점',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('국어비율',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('수학비율',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('영어비율',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('탐구비율',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('제2외국어비율',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                  <S.InfoTD>{상세보기_변환('한국사비율',univ?.대학교,univ?.모집군,univ?.모집단위 )}</S.InfoTD>
                
                </tr>
        
          </tbody>
        </S.InfoTable>
      </>
    );
  };

  return (
    <S.InfoContainer>
      <S.InfoTableTitle>{'정시'}</S.InfoTableTitle>

      <S.InfoTable style={{marginBottom : 20,}}>
         
         <tr>
             <S.InfoTH style={{color : ''}}>{univ?.대학교}</S.InfoTH>
             <S.InfoTH >{univ?.모집단위}</S.InfoTH>
         </tr>
      
     </S.InfoTable>

      <S.InfoTable>
         
           
            <tr>
                <S.InfoTH >기존 정원</S.InfoTH>
                <S.InfoTH >수시이월 인원</S.InfoTH>
                <S.InfoTH >모집 인원<br/>(수시 이월포함)</S.InfoTH>
                <S.InfoTH >작년 경쟁률</S.InfoTH>
                <S.InfoTH >작년 추가모집 인원</S.InfoTH>
                <S.InfoTH >작년 추가모집 충원율</S.InfoTH>
            </tr>
            <tr>
                <S.InfoTD >{univ?.정원}명</S.InfoTD>
                <S.InfoTD >{`12월말 발표`}</S.InfoTD>

                <S.InfoTD >{univ?.정원}명</S.InfoTD>
                
                <S.InfoTD >{관심대학_작년경쟁률(univ?.대학교,univ?.모집군,univ?.모집단위)}</S.InfoTD>
                <S.InfoTD >-</S.InfoTD>
                <S.InfoTD >-</S.InfoTD>
            </tr>

        </S.InfoTable>
        <p style={{marginTop : 20, fontSize : 14}}>* 수시 이월 인원이 반영되지 않았을 경우, 아래를 참조하세요<br/>
  대학들이 수시 이월 정원을, 보통 원서 접수 받기 직전에 발표하거나, 
  아니면 대학별 지원 현황 페이지에서, - 수시 이월 정원을 추가해서 - 바로, 모집단위 인원으로 보여주는 경우가 있습니다.<br/>
  수시 이월 인원이 반영되지 않았을 경우, 거북스쿨의 대학 실시간 경쟁률 페이지를 참조하세요  <a href='https://www.turtleschool.kr/jungsi_compe/'>바로가기</a></p>
      

      {renderFormulaTable(formula)}

      {formula?.length > 0 && renderScoreTable(score)}
    </S.InfoContainer>

    

  );
};

const Prediction = ({univ}) => {

  return (
    <S.ContentContainer>
      <S.ContentTitleContainer>
        <S.ContentTitle>{'1. 합격예측'}</S.ContentTitle>
      </S.ContentTitleContainer>
      <S.InfoTable>
      <thead>
          <tr>
            <S.InfoTH rowSpan={2} >대학명</S.InfoTH>
            <S.InfoTH rowSpan={2}>계열</S.InfoTH>
            <S.InfoTH rowSpan={2}>모집단위</S.InfoTH>
            <S.InfoTH colSpan={2}>내 점수</S.InfoTH>
            <S.InfoTH colSpan={2}>적정(추합포함70%컷)</S.InfoTH>
            <S.InfoTH colSpan={2}>소신(추합포함85%컷)<br/><span style={{ color : '#FF3232', fontSize : 12, fontWeight : 900}}>{'(예측컷)'}</span></S.InfoTH>
            <S.InfoTH colSpan={2}>위험(추합포함100%컷)</S.InfoTH>
            <S.InfoTH colSpan={2} rowSpan={2}>내점수와예측컷의차이</S.InfoTH>
            
          </tr>
          <tr>
            <S.InfoTH>{'대학점수'}</S.InfoTH>
            <S.InfoTH>{'누백'}</S.InfoTH>
            <S.InfoTH>{'대학점수'}</S.InfoTH>
            <S.InfoTH>{'누백'}</S.InfoTH>
            <S.InfoTH>{'대학점수'}</S.InfoTH>
            <S.InfoTH>{'누백'}</S.InfoTH>
            <S.InfoTH>{'대학점수'}</S.InfoTH>
            <S.InfoTH>{'누백'}</S.InfoTH>
          </tr>
        </thead>

        <tbody>
          <tr>
            <S.InfoTD>{univ?.대학교 || '-'}</S.InfoTD>
            <S.InfoTD>{univ?.계열 || '-'}</S.InfoTD>
            <S.InfoTD>{univ?.모집단위 || '-'}</S.InfoTD>
            <S.InfoTD style={{ color : '#FF3232',fontWeight : 900}}>{univ?.내점수 || '-'}</S.InfoTD>
            <S.InfoTD>{univ?.퍼센트순위 || '-'}</S.InfoTD>
            <S.InfoTD>{Math.floor(univ?.대학점수_70 * 100) / 100 || '-'}</S.InfoTD>
            <S.InfoTD>{Math.floor(univ?.대학누백_70 * 100) / 100 || '-'}</S.InfoTD>
            <S.InfoTD style={{ color : '#FF3232',fontWeight : 900}}>{Math.floor(univ?.대학점수_85 * 100) / 100 || '-'}</S.InfoTD>
            <S.InfoTD>{Math.floor(univ?.대학누백_85 * 100) / 100 || '-'}</S.InfoTD>
            <S.InfoTD>{Math.floor(univ?.대학점수_100 * 100) / 100 || '-'}</S.InfoTD>
            <S.InfoTD>{Math.floor(univ?.대학누백_100 * 100) / 100 || '-'}</S.InfoTD>
            <S.InfoTD style={{ color : '#FF3232',fontWeight : 900}}>{Math.floor((univ?.내점수 - univ?.대학점수_85) * 100) / 100}</S.InfoTD>
          </tr>
        </tbody>
      </S.InfoTable>


      <S.Tip>
        {
          '*예측점수는 모의지원결과, 수시이월인원수에 따라 계속 업데이트됩니다. 지속적인 관찰 바랍니다.'
        }
      </S.Tip>

      <DevChart univ={univ}/>
    

      
      
    </S.ContentContainer>
  );
};

const UnivAnalysis = ({univ}) => {
  // 3. 타대학/타학과 입시 결과 분석
  const [diffMajorLineData, setDiffMajorLineData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: '#BF3752',
        tension: 0,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#BF3752',
        pointBorderWidth: 2,
      },
    ],
  });

  const [sameMajorLineData, setSameMajorLineData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: '#BF3752',
        tension: 0,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#BF3752',
        pointBorderWidth: 2,
      },
    ],
  });

  const [diffMajorUniv, setDiffMajorUniv] = useState([]);
  const [sameMajorUniv, setSameMajorUniv] = useState([]);

  useEffect(() => {
    동일대학타학과데이터()
    타대학동일학과데이터()
    window.addEventListener("copy", (e) => {
      alert("보안 정책에 의해 복사를 허용하지 않습니다.");
      e.preventDefault();
      e.clipboardData.clearData("Text"); // 클립보드에 저장된 컨텐츠 삭제
    });
  }, [univ]);

  const 동일대학타학과데이터 = async() => {
    await setSameMajorUniv([]);

    await setSameMajorUniv(majorSearchUnivData(univ?.계열,univ?.대학교,univ?.모집군));
  }
  const 타대학동일학과데이터 = async() => {
    await setDiffMajorLineData([]);

    await setDiffMajorUniv(majorDiffSearchUnivData(univ?.계열,univ?.모집군,univ?.모집단위));
  }




  const renderUniv = data => {
    return (
      <tr key={`${data.대학교}-${data.모집단위}`}>
        <S.InfoTD>{data.대학교 || '-'}</S.InfoTD>
        <S.InfoTD>{data.계열 || '-'}</S.InfoTD>
        <S.InfoTD>{data.모집단위 || '-'}</S.InfoTD>
        <S.InfoTD style={{ color : '#FF3232', fontWeight : 900}}>{univ?.내점수}</S.InfoTD>
        <S.InfoTD>{univ?.퍼센트순위 || '-'}</S.InfoTD>
       
        <S.InfoTD>{Math.floor(data.대학점수_70 * 100) / 100}</S.InfoTD>
        <S.InfoTD>{Math.floor(data.대학누백_70 * 100) / 100}</S.InfoTD>
        <S.InfoTD style={{ color : '#FF3232', fontWeight : 900}}>{Math.floor(data.대학점수_85 * 100) / 100}</S.InfoTD>
        <S.InfoTD>{Math.floor(data.대학누백_85 * 100) / 100}</S.InfoTD>
        <S.InfoTD>{Math.floor(data.대학점수_100 * 100) / 100}</S.InfoTD>
        <S.InfoTD>{Math.floor(data.대학누백_100 * 100) / 100}</S.InfoTD>
        <S.InfoTD style={{ color : '#FF3232', fontWeight : 900}}>{Math.floor((univ?.내점수 - data.대학점수_85) * 100) / 100}</S.InfoTD>
     
      </tr>
    );
  };

  return (
    <>
    <S.ContentContainer>
      <S.ContentTitleContainer>
        <S.ContentTitle>{'3. 동일대학/타학과 입시 결과 평균 분석'}</S.ContentTitle>
        <S.ContentSubTitle>{'추가모집 포함 실질경쟁률과 컷 비교분석'}</S.ContentSubTitle>
      </S.ContentTitleContainer>
      <S.TopicContainer>
      
        <S.OverflowContainer style={{marginBottom: 16}}>
          <div
            style={{
              width: sameMajorUniv.length * 150,
              paddingTop: 36,
            }}
          > 

          {sameMajorUniv.length > 0 ? 
           <FixUnivChart key={sameMajorUniv} data={sameMajorUniv} myScore={univ?.내점수} />
           : null
          }
           
       
          </div>
        </S.OverflowContainer>
        <S.InfoTable>
          <thead>
          <tr>
          <S.InfoTH rowSpan={2}>{'대학명'}</S.InfoTH>
          <S.InfoTH rowSpan={2}>{'계열'}</S.InfoTH>
          <S.InfoTH rowSpan={2}>{'모집단위'}</S.InfoTH>
          <S.InfoTH colSpan={2}>{'내 점수'}</S.InfoTH>
          <S.InfoTH colSpan={2}>{'적정(추합포함70%컷)'}</S.InfoTH>
          <S.InfoTH colSpan={2}>{'소신(추합포함85%컷)'}<br/><span style={{ color : '#FF3232', fontSize : 12, fontWeight : 900}}>{'(예측컷)'}</span></S.InfoTH>
          <S.InfoTH colSpan={2}>{'위험(추합포함100%컷)'}</S.InfoTH>
          <S.InfoTH rowSpan={2}>{'내점수와 예측컷의 차이'}</S.InfoTH>
     
        </tr>
        <tr>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
      </tr>
          </thead>
          <tbody>{sameMajorUniv.map(renderUniv)}</tbody>
        </S.InfoTable>
      </S.TopicContainer>


      <S.TopicContainer>
        <S.RowBox style={{marginBottom: 16}}>
          <S.ContentTopic>{'4. 타대학/동일학과 입시 결과 분석'}</S.ContentTopic>
     
        </S.RowBox>
        <S.OverflowContainer style={{marginBottom: 16}}>
          <div
            style={{
              width: diffMajorUniv.length * 150,
              paddingTop: 36,
            }}
          > 

          {diffMajorUniv.length > 0 ? 
           <DiffrentUnivChart key={diffMajorUniv} data={diffMajorUniv} myScore={univ?.내점수} />
           : null
          }
           
       
          </div>
        </S.OverflowContainer>
        <S.InfoTable>
        <tr>
          <S.InfoTH rowSpan={2}>{'대학명'}</S.InfoTH>
          <S.InfoTH rowSpan={2}>{'계열'}</S.InfoTH>
          <S.InfoTH rowSpan={2}>{'모집단위'}</S.InfoTH>
          <S.InfoTH colSpan={2}>{'내 점수'}</S.InfoTH>
          <S.InfoTH colSpan={2}>{'적정(추합포함70%컷)'}</S.InfoTH>
          <S.InfoTH colSpan={2}>{'소신(추합포함85%컷)'}<br/><span style={{ color : '#FF3232', fontSize : 12, fontWeight : 900}}>{'(예측컷)'}</span></S.InfoTH>
          <S.InfoTH colSpan={2}>{'위험(추합포함100%컷)'}</S.InfoTH>
          <S.InfoTH rowSpan={2}>{'내점수와 예측컷의 차이'}</S.InfoTH>
     
        </tr>
        <tr>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
          <S.InfoTH>{'대학점수'}</S.InfoTH>
          <S.InfoTH>{'누백'}</S.InfoTH>
      </tr>

          <tbody>{diffMajorUniv.map(renderUniv)}</tbody>
        </S.InfoTable>
      </S.TopicContainer>

    
    </S.ContentContainer>
    </>
  );
};

Information.propTypes = {
  univ: PropTypes.node.isRequired,
  formula: PropTypes.node.isRequired,
};

UnivAnalysis.propTypes = {
  univ: PropTypes.node.isRequired,
};
YearAnalysis.propTypes = {
  formula: PropTypes.node.isRequired,
};


Prediction.protoTypes = {
  univ: PropTypes.node.isRequired,
};

export default Detail;
