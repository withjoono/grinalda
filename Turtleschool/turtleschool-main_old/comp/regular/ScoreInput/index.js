import {FormControl, MenuItem, Select} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {UserAgent} from '@quentin-sommer/react-useragent';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {getSavedScoreFetch, saveBeforeScoreFetch, saveScoreFetch} from '../../../src/api/csat';
import AfterTestTable from './afterInputTable';
import BeforeTestTable from '../../../src/components/molecules/tables/beforeTestTable';
import Advice from '../../Advice';
import * as S from './index.style';

import {gradeInit} from './states/grade';

const specialApplyTypes = [
  {title: '일반 전형', types: ['일반 전형']},
  {title: '특별 전형 정원 내', types: ['대학별 독자적 기준', '고른기회 특별전형', '특기자']},
  {
    title: '특별 전형 정원 외',
    types: [
      '농어촌 학생',
      '특성화고교 졸업자',
      '특성화고 등을 졸업한 재직자',
      '기초생활 수급자, 차상위 계층, 한부모가족 지원대상자',
      '장애인 등 대상자',
      '계약학과',
      '재외국민 및 외국인',
    ],
  },
];

const scoreObject = {
  korSelect: '',
  kor: '',
  matSelect: '',
  mat: '',
  eng: '',
  his: '',
  res1: '',
  res2: '',
  for: '',
};

const ScoreInput = ({isScoreAndTypeSaved, loginData}) => {
  // 성적 발표 전(true), 성적 발표 후(false)
  const [beforeTest, setBeforeTest] = useState(false);
  // 과목(대분류 하위)
  const [subjects, setSubjects] = useState([]);

  const [isApplyTypeCheckd, setIsApplyTypeChecked] = useState(false);
  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const [appliedType, setAppliedType] = useState('');
  const [_savedScore, _setSavedScore] = useState(null);

  console.log('컴포넌트 props', loginData);

  // 내신용 자료
  const [htmlState, setHtmlState] = useState(gradeInit);

  useEffect(() => {
    if (isScoreSaved && isApplyTypeCheckd) isScoreAndTypeSaved(true);
  }, [isScoreSaved, isApplyTypeCheckd]);
  // requests

  const handleCheckBox = ({target}) => {
    if (target.checked) {
      setIsApplyTypeChecked(true);
      setAppliedType(target.id);
    }
  };

  var html_object = {
    grade_1: {
      학기: 0,
      교과: '',
      과목: '',
      점수집합: '',
      성취도및수강자수: '',

      단위수: 0,
      석차등급: 0,
      성취도: '',
      수강자수: 0,
      원점수: 0,
      표준편차: 0,

      비고: '',
    },
    grade_2: {
      학기: 0,
      교과: '',
      과목: '',
      점수집합: '',
      성취도및수강자수: '',
      성취도별분포비율: '',
      단위수: 0,
      석차등급: 0,
      성취도: '',
      수강자수: 0,
      원점수: 0,
      표준편차: 0,

      비고: '',
    },

    출결상황: {
      step: 1,
      학년: 2,
      수업일수: 0,
      결석_질병: 0,
      결석_미인정: 0,
      결석_기타: 0,

      지각_질병: 0,
      지각_미인정: 0,
      지각_기타: 0,

      조퇴_질병: 0,
      조퇴_미인정: 0,
      조퇴_기타: 0,

      결과_질병: 0,
      결과_미인정: 0,
      결과_기타: 0,
      특기사항: '',
    },
    창의적체험활동: {
      영역: '',
      시간: 0,
      특기사항: '',
    },
    봉사활동실적: {
      봉사기간: '',
      주관기간: '',
      내용: '',
      시간: 0,
      누계시간: 0,
    },
    세부능력및특기사항: {
      grade_1: '',
      grade_2: '',
      grade_3: '',
    },
    독서활동: {
      과목: '',
      독서활동: '',
    },
    행동특성: {
      학년: 0,
      내용: '',
    },
  };

  const handleFiles = e => {
    let fileReader = new FileReader();
    let file = e.target.files[0];

    fileReader.readAsText(file);
    let result = '';
    fileReader.onload = () => {
      result = fileReader.result;
      const parser = new DOMParser();
      const doc = parser.parseFromString(result, 'text/html');

      // 1학년 교과학습 발달 상황
      Object.keys(htmlState.main_1[0]).map((item, index) => {
        html_object.grade_1.학기 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP1`,
        );
        html_object.grade_1.교과 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP2`,
        );
        html_object.grade_1.과목 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP3`,
        );
        html_object.grade_1.단위수 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP4`,
        );
        html_object.grade_1.점수집합 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP5`,
        );
        html_object.grade_1.성취도및수강자수 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP6`,
        );
        html_object.grade_1.석차등급 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP7`,
        );
        html_object.grade_1.비고 = doc.getElementById(
          `gen16_${htmlState.main_1[0][item].step}_txbP8`,
        );

        htmlState.main_1[0][item].학기 =
          html_object.grade_1.학기 !== null ? parseInt(html_object.grade_1.학기.textContent) : 0;
        htmlState.main_1[0][item].교과 =
          html_object.grade_1.교과 !== null ? html_object.grade_1.교과.textContent : '';
        htmlState.main_1[0][item].과목 =
          html_object.grade_1.과목 !== null ? html_object.grade_1.과목.textContent : '';
        htmlState.main_1[0][item].단위수 =
          html_object.grade_1.단위수 !== null
            ? parseInt(html_object.grade_1.단위수.textContent)
            : 0;
        htmlState.main_1[0][item].원점수 =
          html_object.grade_1.점수집합 !== null
            ? parseFloat(html_object.grade_1.점수집합.textContent.split('/')[0])
            : 0;
        htmlState.main_1[0][item].과목평균 =
          html_object.grade_1.점수집합 !== null
            ? parseFloat(html_object.grade_1.점수집합.textContent.split('/')[1].split('(')[0])
            : 0;
        htmlState.main_1[0][item].표준편차 =
          html_object.grade_1.점수집합 !== null
            ? parseFloat(
                html_object.grade_1.점수집합.textContent
                  .split('/')[1]
                  .split('(')[1]
                  .replace(')', ''),
              )
            : 0;
        htmlState.main_1[0][item].성취도 =
          html_object.grade_1.성취도및수강자수 !== null
            ? html_object.grade_1.성취도및수강자수.textContent.split('(')[0]
            : '';
        htmlState.main_1[0][item].수강자수 =
          html_object.grade_1.성취도및수강자수 !== null
            ? parseInt(
                html_object.grade_1.성취도및수강자수.textContent.split('(')[1].replace(')', ''),
              )
            : 0;
        htmlState.main_1[0][item].석차등급 =
          html_object.grade_1.석차등급 !== null
            ? parseInt(html_object.grade_1.석차등급.textContent)
            : 0;
        htmlState.main_1[0][item].비고 =
          html_object.grade_1.비고 !== null ? html_object.grade_1.비고.textContent : '';
      });
      // 1학년 예체능 교과학습 발달 사항
      Object.keys(htmlState.main_1[1]).map((item, index) => {
        html_object.grade_1.학기 = doc.getElementById(
          `gen20_${htmlState.main_1[1][item].step}_txbPp1`,
        );
        html_object.grade_1.교과 = doc.getElementById(
          `gen20_${htmlState.main_1[1][item].step}_txbPp2`,
        );
        html_object.grade_1.과목 = doc.getElementById(
          `gen20_${htmlState.main_1[1][item].step}_txbPp3`,
        );
        html_object.grade_1.단위수 = doc.getElementById(
          `gen20_${htmlState.main_1[1][item].step}_txbPp4`,
        );
        html_object.grade_1.성취도및수강자수 = doc.getElementById(
          `gen20_${htmlState.main_1[1][item].step}_txbPp5`,
        );
        html_object.grade_1.비고 = doc.getElementById(
          `gen20_${htmlState.main_1[1][item].step}_txbPp6`,
        );

        htmlState.main_1[1][item].학기 =
          html_object.grade_1.학기 !== null ? parseInt(html_object.grade_1.학기.textContent) : 0;
        htmlState.main_1[1][item].교과 =
          html_object.grade_1.교과 !== null ? html_object.grade_1.교과.textContent : '';
        htmlState.main_1[1][item].과목 =
          html_object.grade_1.과목 !== null ? html_object.grade_1.과목.textContent : '';
        htmlState.main_1[1][item].단위수 =
          html_object.grade_1.단위수 !== null
            ? parseInt(html_object.grade_1.단위수.textContent)
            : 0;
        htmlState.main_1[1][item].성취도 =
          html_object.grade_1.성취도및수강자수 !== null
            ? html_object.grade_1.성취도및수강자수.textContent
            : '';
        htmlState.main_1[1][item].비고 =
          html_object.grade_1.비고 !== null ? html_object.grade_1.비고.textContent : '';
      });

      // 2학년 교과학습 발달 사항
      Object.keys(htmlState.main_2[0]).map((item, index) => {
        html_object.grade_2.학기 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS1`,
        );
        html_object.grade_2.교과 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS2`,
        );
        html_object.grade_2.과목 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS3`,
        );
        html_object.grade_2.단위수 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS4`,
        );
        html_object.grade_2.점수집합 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS5`,
        );
        html_object.grade_2.성취도및수강자수 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS6`,
        );
        html_object.grade_2.석차등급 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS7`,
        );
        html_object.grade_2.비고 = doc.getElementById(
          `gen25_${htmlState.main_2[0][item].step}_txbS8`,
        );

        htmlState.main_2[0][item].학기 =
          html_object.grade_2.학기 !== null ? parseInt(html_object.grade_2.학기.textContent) : 0;
        htmlState.main_2[0][item].교과 =
          html_object.grade_2.교과 !== null ? html_object.grade_2.교과.textContent : '';
        htmlState.main_2[0][item].과목 =
          html_object.grade_2.과목 !== null ? html_object.grade_2.과목.textContent : '';
        htmlState.main_2[0][item].단위수 =
          html_object.grade_2.단위수 !== null
            ? parseInt(html_object.grade_2.단위수.textContent)
            : 0;
        htmlState.main_2[0][item].원점수 =
          html_object.grade_2.점수집합 !== null
            ? parseFloat(html_object.grade_2.점수집합.textContent.split('/')[0])
            : 0;
        htmlState.main_2[0][item].과목평균 =
          html_object.grade_2.점수집합 !== null
            ? parseFloat(html_object.grade_2.점수집합.textContent.split('/')[1].split('(')[0])
            : 0;
        htmlState.main_2[0][item].표준편차 =
          html_object.grade_2.점수집합 !== null
            ? parseFloat(
                html_object.grade_2.점수집합.textContent
                  .split('/')[1]
                  .split('(')[1]
                  .replace(')', ''),
              )
            : 0;
        htmlState.main_2[0][item].성취도 =
          html_object.grade_2.성취도및수강자수 !== null
            ? html_object.grade_2.성취도및수강자수.textContent.split('(')[0]
            : '';
        htmlState.main_2[0][item].수강자수 =
          html_object.grade_2.성취도및수강자수 !== null
            ? parseInt(
                html_object.grade_2.성취도및수강자수.textContent.split('(')[1].replace(')', ''),
              )
            : 0;
        htmlState.main_2[0][item].석차등급 =
          html_object.grade_2.석차등급 !== null
            ? parseInt(html_object.grade_2.석차등급.textContent)
            : 0;
        htmlState.main_2[0][item].비고 =
          html_object.grade_2.비고 !== null ? html_object.grade_2.비고.textContent : '';
      });

      // 2학년 진로선택 과목
      Object.keys(htmlState.main_2[1]).map((item, index) => {
        html_object.grade_2.학기 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC1`,
        );
        html_object.grade_2.교과 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC2`,
        );
        html_object.grade_2.과목 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC3`,
        );
        html_object.grade_2.단위수 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC4`,
        );
        html_object.grade_2.점수집합 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC5`,
        );
        html_object.grade_2.성취도및수강자수 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC6`,
        );
        html_object.grade_2.성취도별분포비율 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC7`,
        );
        html_object.grade_2.비고 = doc.getElementById(
          `gen26_${htmlState.main_2[1][item].step}_txbSC8`,
        );

        // 2학년 진로선택과목
        htmlState.main_2[1][item].학기 =
          html_object.grade_2.학기 !== null ? parseInt(html_object.grade_2.학기.textContent) : 0;
        htmlState.main_2[1][item].교과 =
          html_object.grade_2.교과 !== null ? html_object.grade_2.교과.textContent : '';
        htmlState.main_2[1][item].과목 =
          html_object.grade_2.과목 !== null ? html_object.grade_2.과목.textContent : '';
        htmlState.main_2[1][item].단위수 =
          html_object.grade_2.단위수 !== null
            ? parseInt(html_object.grade_2.단위수.textContent)
            : 0;
        htmlState.main_2[1][item].원점수 =
          html_object.grade_2.점수집합 !== null
            ? parseFloat(html_object.grade_2.점수집합.textContent.split('/')[0])
            : 0;
        htmlState.main_2[1][item].과목평균 =
          html_object.grade_2.점수집합 !== null
            ? parseFloat(html_object.grade_2.점수집합.textContent.split('/')[1])
            : 0;

        htmlState.main_2[1][item].성취도 =
          html_object.grade_2.성취도및수강자수 !== null
            ? html_object.grade_2.성취도및수강자수.textContent.split('(')[0]
            : '';
        htmlState.main_2[1][item].수강자수 =
          html_object.grade_2.성취도및수강자수 !== null
            ? parseInt(
                html_object.grade_2.성취도및수강자수.textContent.split('(')[1].replace(')', ''),
              )
            : 0;

        htmlState.main_2[1][item].성취도_A =
          html_object.grade_2.성취도별분포비율 !== null
            ? parseFloat(
                html_object.grade_2.성취도별분포비율.textContent
                  .split(' ')[0]
                  .split('(')[1]
                  .replace(')', ''),
              )
            : '0';
        htmlState.main_2[1][item].성취도_B =
          html_object.grade_2.성취도별분포비율 !== null
            ? parseFloat(
                html_object.grade_2.성취도별분포비율.textContent
                  .split(' ')[1]
                  .split('(')[1]
                  .replace(')', ''),
              )
            : '0';
        htmlState.main_2[1][item].성취도_C =
          html_object.grade_2.성취도별분포비율 !== null
            ? parseFloat(
                html_object.grade_2.성취도별분포비율.textContent
                  .split(' ')[2]
                  .split('(')[1]
                  .replace(')', ''),
              )
            : '0';

        htmlState.main_2[1][item].비고 =
          html_object.grade_2.비고 !== null ? html_object.grade_2.비고.textContent : '';
      });
      // 2학년 예체능 교과학습 발달 사항
      Object.keys(htmlState.main_2[2]).map((item, index) => {
        html_object.grade_2.학기 = doc.getElementById(
          `gen29_${htmlState.main_2[0][item].step}_txbSs1`,
        );
        html_object.grade_2.교과 = doc.getElementById(
          `gen29_${htmlState.main_2[0][item].step}_txbSs2`,
        );
        html_object.grade_2.과목 = doc.getElementById(
          `gen29_${htmlState.main_2[0][item].step}_txbSs3`,
        );
        html_object.grade_2.단위수 = doc.getElementById(
          `gen29_${htmlState.main_2[0][item].step}_txbSs4`,
        );
        html_object.grade_2.성취도및수강자수 = doc.getElementById(
          `gen29_${htmlState.main_2[0][item].step}_txbSs5`,
        );

        html_object.grade_2.비고 = doc.getElementById(
          `gen29_${htmlState.main_2[0][item].step}_txbSs6`,
        );

        htmlState.main_2[2][item].학기 =
          html_object.grade_2.학기 !== null ? parseInt(html_object.grade_2.학기.textContent) : 0;
        htmlState.main_2[2][item].교과 =
          html_object.grade_2.교과 !== null ? html_object.grade_2.교과.textContent : '';
        htmlState.main_2[2][item].과목 =
          html_object.grade_2.과목 !== null ? html_object.grade_2.과목.textContent : '';
        htmlState.main_2[2][item].단위수 =
          html_object.grade_2.단위수 !== null
            ? parseInt(html_object.grade_2.단위수.textContent)
            : 0;
        htmlState.main_2[2][item].성취도 =
          html_object.grade_2.성취도및수강자수 !== null
            ? html_object.grade_2.성취도및수강자수.textContent
            : '';
        htmlState.main_2[2][item].비고 =
          html_object.grade_2.비고 !== null ? html_object.grade_2.비고.textContent : '';
      });

      Object.keys(htmlState.출결상황).map((item, index) => {
        html_object.출결상황.수업일수 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE2`,
        );
        html_object.출결상황.결석_질병 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE3`,
        );
        html_object.출결상황.결석_미인정 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE4`,
        );
        html_object.출결상황.결석_기타 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE5`,
        );
        html_object.출결상황.지각_질병 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE6`,
        );
        html_object.출결상황.지각_미인정 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE7`,
        );
        html_object.출결상황.지각_기타 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE8`,
        );
        html_object.출결상황.조퇴_질병 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE9`,
        );
        html_object.출결상황.조퇴_미인정 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE10`,
        );
        html_object.출결상황.조퇴_기타 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE11`,
        );
        html_object.출결상황.결과_질병 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txb12`,
        );
        html_object.출결상황.결과_미인정 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE13`,
        );
        html_object.출결상황.결과_기타 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE14`,
        );
        html_object.출결상황.특기사항 = doc.getElementById(
          `gen06_${htmlState.출결상황[item].step}_txbE15`,
        );

        htmlState.출결상황[item].수업일수 =
          html_object.출결상황.수업일수 !== null
            ? parseInt(html_object.출결상황.수업일수.textContent)
            : 0;
        htmlState.출결상황[item].결석_질병 =
          html_object.출결상황.결석_질병 !== null
            ? html_object.출결상황.결석_질병.textContent !== '.'
              ? parseInt(html_object.출결상황.결석_질병.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].결석_미인정 =
          html_object.출결상황.결석_미인정 !== null
            ? html_object.출결상황.결석_미인정.textContent !== '.'
              ? parseInt(html_object.출결상황.결석_미인정.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].결석_기타 =
          html_object.출결상황.결석_기타 !== null
            ? html_object.출결상황.결석_기타.textContent !== '.'
              ? parseInt(html_object.출결상황.결석_기타.textContent)
              : 0
            : 0;

        htmlState.출결상황[item].지각_질병 =
          html_object.출결상황.지각_질병 !== null
            ? html_object.출결상황.지각_질병.textContent !== '.'
              ? parseInt(html_object.출결상황.지각_질병.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].지각_미인정 =
          html_object.출결상황.지각_미인정 !== null
            ? html_object.출결상황.지각_미인정.textContent !== '.'
              ? parseInt(html_object.출결상황.지각_미인정.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].지각_기타 =
          html_object.출결상황.지각_기타 !== null
            ? html_object.출결상황.지각_기타.textContent !== '.'
              ? parseInt(html_object.출결상황.지각_기타.textContent)
              : 0
            : 0;

        htmlState.출결상황[item].조퇴_질병 =
          html_object.출결상황.조퇴_질병 !== null
            ? html_object.출결상황.조퇴_질병.textContent !== '.'
              ? parseInt(html_object.출결상황.조퇴_질병.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].조퇴_미인정 =
          html_object.출결상황.조퇴_미인정 !== null
            ? html_object.출결상황.조퇴_미인정.textContent !== '.'
              ? parseInt(html_object.출결상황.조퇴_미인정.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].조퇴_기타 =
          html_object.출결상황.조퇴_기타 !== null
            ? html_object.출결상황.조퇴_기타.textContent !== '.'
              ? parseInt(html_object.출결상황.조퇴_기타.textContent)
              : 0
            : 0;

        htmlState.출결상황[item].결과_질병 =
          html_object.출결상황.결과_질병 !== null
            ? html_object.출결상황.결과_질병.textContent !== '.'
              ? parseInt(html_object.출결상황.결과_질병.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].결과_미인정 =
          html_object.출결상황.결과_미인정 !== null
            ? html_object.출결상황.결과_미인정.textContent !== '.'
              ? parseInt(html_object.출결상황.결과_미인정.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].결과_기타 =
          html_object.출결상황.결과_기타 !== null
            ? html_object.출결상황.결과_기타.textContent !== '.'
              ? parseInt(html_object.출결상황.결과_기타.textContent)
              : 0
            : 0;
        htmlState.출결상황[item].특기사항 =
          html_object.출결상황.특기사항 !== null ? html_object.출결상황.특기사항.textContent : '';
      });

      Object.keys(htmlState.창의적체험활동).map((item, index) => {
        html_object.창의적체험활동.영역 = doc.getElementById(
          `gen11_1_${htmlState.창의적체험활동[item].step}_txbJ2`,
        );
        if (htmlState.창의적체험활동[item].학년 === 1) {
          html_object.창의적체험활동.시간 = doc.getElementById(
            `gen11_1_${htmlState.창의적체험활동[item].step}_txbJ3`,
          );
          htmlState.창의적체험활동[item].시간 =
            html_object.창의적체험활동.시간 !== null
              ? parseFloat(html_object.창의적체험활동.시간.textContent)
              : 0;
          html_object.창의적체험활동.특기사항 = doc.getElementById(
            `gen11_1_${htmlState.창의적체험활동[item].step}_txbJ4`,
          );
          htmlState.창의적체험활동[item].특기사항 =
            html_object.창의적체험활동.특기사항 !== null
              ? html_object.창의적체험활동.특기사항.textContent
              : '';
        } else {
          html_object.창의적체험활동.시간 = 0;
          htmlState.창의적체험활동[item].시간 = 0;
          if (item === 'step5' || item === 'step8') {
            html_object.창의적체험활동.특기사항 = doc.getElementById(
              `gen11_1_${htmlState.창의적체험활동[item].step}_txbJ5`,
            );
          } else {
            html_object.창의적체험활동.특기사항 = doc.getElementById(
              `gen11_1_${htmlState.창의적체험활동[item].step}_txbJ4`,
            );
          }
          htmlState.창의적체험활동[item].특기사항 =
            html_object.창의적체험활동.특기사항 !== null
              ? html_object.창의적체험활동.특기사항.textContent
              : '';
        }
        htmlState.창의적체험활동[item].영역 =
          html_object.창의적체험활동.영역 !== null
            ? html_object.창의적체험활동.영역.textContent
            : '';
      });

      Object.keys(htmlState.봉사활동실적).map((item, index) => {
        html_object.봉사활동실적.봉사기간 = doc.getElementById(
          `gen12_${htmlState.봉사활동실적[item].step}_txbL2`,
        );
        html_object.봉사활동실적.주관기관 = doc.getElementById(
          `gen12_${htmlState.봉사활동실적[item].step}_txbL4`,
        );
        html_object.봉사활동실적.내용 = doc.getElementById(
          `gen12_${htmlState.봉사활동실적[item].step}_txbL5`,
        );
        html_object.봉사활동실적.시간 = doc.getElementById(
          `gen12_${htmlState.봉사활동실적[item].step}_txbL6`,
        );
        html_object.봉사활동실적.누계시간 = doc.getElementById(
          `gen12_${htmlState.봉사활동실적[item].step}_txbL7`,
        );

        htmlState.봉사활동실적[item].봉사기간 =
          html_object.봉사활동실적.봉사기간 !== null
            ? html_object.봉사활동실적.봉사기간.textContent
            : '';
        htmlState.봉사활동실적[item].주관기관 =
          html_object.봉사활동실적.주관기관 !== null
            ? html_object.봉사활동실적.주관기관.textContent
            : '';
        htmlState.봉사활동실적[item].내용 =
          html_object.봉사활동실적.내용 !== null ? html_object.봉사활동실적.내용.textContent : '';
        htmlState.봉사활동실적[item].시간 =
          html_object.봉사활동실적.시간 !== null
            ? parseFloat(html_object.봉사활동실적.시간.textContent)
            : '';
        htmlState.봉사활동실적[item].누계시간 =
          html_object.봉사활동실적.누계시간 !== null
            ? parseFloat(html_object.봉사활동실적.누계시간.textContent)
            : '';
      });

      Object.keys(htmlState.독서활동).map((item, index) => {
        html_object.독서활동.독서활동 = doc.getElementById(
          `gen41_${htmlState.독서활동[item].step}_txbY3`,
        );

        if (
          doc.getElementById(`gen41_${htmlState.독서활동[item].step}_txbY2`) !== null &&
          doc.getElementById(`gen41_${htmlState.독서활동[item].step}_txbY2`) === ''
        ) {
          htmlState.독서활동[item].과목 = '';
        } else if (
          doc.getElementById(`gen41_${htmlState.독서활동[item].step}_txbY2`) !== null &&
          doc.getElementById(`gen41_${htmlState.독서활동[item].step}_txbY2`) !== ''
        ) {
          html_object.독서활동.과목 = doc.getElementById(
            `gen41_${htmlState.독서활동[item].step}_txbY2`,
          );
          htmlState.독서활동[item].과목 = html_object.독서활동.과목.textContent;
        } else {
          htmlState.독서활동[item].과목 = html_object.독서활동.과목.textContent;
        }

        htmlState.독서활동[item].독서활동 =
          html_object.독서활동.독서활동 !== null ? html_object.독서활동.독서활동.textContent : '';
      });

      Object.keys(htmlState.행동특성).map((item, index) => {
        html_object.행동특성.내용 = doc.getElementById(
          `gen42_${htmlState.행동특성[item].step}_txbZ2`,
        );
        htmlState.행동특성[item].내용 =
          html_object.행동특성.내용 !== null ? html_object.행동특성.내용.textContent : '';
      });

      html_object.세부능력및특기사항.grade_1 = doc.getElementById(`txbQ1`);
      html_object.세부능력및특기사항.grade_2 = doc.getElementById(`txbQq1`);

      htmlState.세부능력및특기사항.grade_1 =
        html_object.세부능력및특기사항.grade_1 !== null
          ? html_object.세부능력및특기사항.grade_1.textContent
          : '';
      htmlState.세부능력및특기사항.grade_2 =
        html_object.세부능력및특기사항.grade_2 !== null
          ? html_object.세부능력및특기사항.grade_2.textContent
          : '';
    };
  };

  const grade_insert = () => {
    axios
      .post(
        '/api/gpa_insert',
        {
          loginData: loginData,
          htmlState: htmlState,
        },
        {
          headers: {
            auth: localStorage.getItem('realuid'),
          },
        },
      )
      .then(res => {
        console.log(res);
        if (res.data.success === true) {
          return alert('내신 성적 저장에 성공했습니다.');
        } else {
          return alert('내신 성적 저장에 실패했습니다. 재시도해주십시오.');
        }
      });
  };

  return (
    <>
      <S.Container>
        <S.RegularContainer>
          <S.ContentTitle>{'수능 성적 입력'}</S.ContentTitle>
          <S.ResultConditionContainer>
            <S.ResultConditionButton
              disabled={true}
              active={beforeTest}
              onClick={() => {
                beforeTest === false && alert('성적 발표 후에서 입력해주세요');
              }}
            >
              {'성적 발표 전'}
            </S.ResultConditionButton>
            <S.ResultConditionButton
              active={!beforeTest}
              onClick={() => {
                beforeTest === true && alert('성적 발표 후(12/9) 입력 할 수 있습니다.');
              }}
            >
              {'성적 발표 후'}
            </S.ResultConditionButton>
          </S.ResultConditionContainer>

          <AfterTestTable
            loginData={loginData}
            onChangeIsScoreSaved={isSaved => isScoreAndTypeSaved(isSaved)}
          />

          <S.HorizontalLine />
        </S.RegularContainer>
        <S.GpaContainer>
          <S.ContentTitle style={{marginBottom: 0}}>{'내신 성적 입력'}</S.ContentTitle>

          <Advice style={{fontSize: '.75rem'}}>
            내신성적은 별도로 입력할 필요없이, 나이스에서 html 파일로 저장한 뒤, 아래 업로드 버튼을
            눌러 파일을 업로드 해주시면 됩니다.
            <br /> 자세한 내용은 html 다운받는법을 참조해주세요.
            <br />
            내신 html 파일 업로드는 수능 성적 발표일인, 12월 9일부터 수능 성적과 함께 업로드
            해주세요
          </Advice>
          <div>
            <input
              type="file"
              accept=".html"
              onChange={e => {
                handleFiles(e);
              }}
            />
            <button onClick={e => grade_insert()}>저장하기</button>
          </div>
        </S.GpaContainer>
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
        .radioBtnBox span,
        .radioBtnBoxOn span {
          font-size: 0.7rem;
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

// const _selectedSubject = {};
// const _score = {
//   korSelect: '',
//   kor: '',
//   matSelect: '',
//   mat: '',
//   eng: '',
//   his: '',
//   res1: '',
//   res2: '',
//   for: '',
// };

// const GpaInput = ({selectedGrade, firstScore, setFirstScore, secondScore, setSecondScore}) => {
//   const [submit, setSubmit] = useState(false);
//   const [subjects, setSubjects] = useState([]);
//   const [majors, setMajors] = useState([]);

//   useEffect(() => {
//     _getGpaSubjects();
//   }, []);

//   useEffect(() => {
//     _getMyGpa();
//   }, [selectedGrade]);

//   const _getMyGpa = () => {
//     axios
//       .get('/api/csat/selectgpa', {
//         headers: {
//           auth: localStorage.getItem('uid'),
//         },
//       })
//       .then(res => {
//         if (res.data.data) {
//           setSubmit(true);
//           setFirstScore(
//             res.data.data
//               .filter(score => score.semester === '1')
//               .filter(score => score.grade === selectedGrade),
//           );
//           setSecondScore(
//             res.data.data
//               .filter(score => score.semester === '2')
//               .filter(score => score.grade === selectedGrade),
//           );
//         }
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };

//   const _getGpaSubjects = () => {
//     axios
//       .get('/api/codes/curriculum_Code', {
//         headers: {
//           auth: localStorage.getItem('uid'),
//         },
//       })
//       .then(res => {
//         setSubjects(res.data.data);
//       })
//       .catch(e => {
//         console.log(e);
//       });

//     axios
//       .get('/api/codes/subject_Code', {
//         headers: {
//           auth: localStorage.getItem('uid'),
//         },
//       })
//       .then(res => {
//         setMajors(res.data.data);
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   };

//   const _postSaveScores = score => {
//     axios
//       .post(
//         '/api/csat/savegpa',
//         {
//           data: score,
//         },
//         {
//           headers: {
//             auth: localStorage.getItem('uid'),
//           },
//         },
//       )
//       .then(res => {})
//       .catch(e => {
//         console.log(e);
//       });
//   };

//   const renderSelect = ({key, items, index, score, setScore}) => {
//     const onChange = ({target}) => {
//       const newArr = score.concat();
//       newArr[index] = {
//         ...newArr[index],
//         [key]: target.value,
//       };
//       setScore([...newArr]);
//     };

//     return (
//       <FormControl
//         disabled={submit}
//         style={{
//           width: '80%',
//           backgroundColor: 'white',
//           fontWeight: 'normal',
//           fontSize: 12,
//         }}
//       >
//         <Select
//           id={key}
//           style={{
//             fontWeight: 'normal',
//             color: score[index][key] === '' ? '#9a9a9a' : '#000000',
//           }}
//           value={score[index][key]}
//           onChange={onChange}
//           displayEmpty
//           inputProps={{'aria-label': 'Without label'}}
//         >
//           <MenuItem style={{fontWeight: 'normal'}} value="" disabled>
//             {'-'}
//           </MenuItem>
//           {items?.map(item => (
//             <MenuItem key={item.code} value={item.code}>
//               {item.name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     );
//   };

//   const onScoreInputChange = ({target}, score, setScore, index) => {
//     const newArr = score.concat();
//     newArr[index] = {
//       ...newArr[index],
//       [target.id]: target.value,
//     };
//     setScore([...newArr]);
//   };

//   const renderScoreInput = (_, index, score, setScore) => (
//     <tr key={`score ${index}`}>
//       <S.GpaTH>
//         {renderSelect({
//           key: 'subjectcode',
//           items: subjects,
//           index,
//           score,
//           setScore,
//         })}
//       </S.GpaTH>
//       <S.GpaTH>
//         {renderSelect({
//           key: 'subjectarea',
//           items: majors.filter(major => major.code[0] === score[index].subjectcode[0]),
//           index,
//           score,
//           setScore,
//         })}
//       </S.GpaTH>
//       <S.GpaTD>
//         <S.RegularInput
//           disabled={submit}
//           id="unit"
//           placeholder="입력"
//           value={score[index].unit}
//           onChange={e => onScoreInputChange(e, score, setScore, index)}
//         />
//       </S.GpaTD>
//       <S.GpaTD>
//         <S.RegularInput
//           disabled={submit}
//           id="rank"
//           placeholder="입력"
//           value={score[index].rank}
//           onChange={e => onScoreInputChange(e, score, setScore, index)}
//         />
//       </S.GpaTD>
//     </tr>
//   );

//   const onAddClick = (setScore, index) => {
//     if (index === 0) {
//       setScore([
//         ...firstScore,
//         {
//           subjectcode: '',
//           subjectarea: '',
//           unit: '',
//           rank: '',
//         },
//       ]);
//     } else {
//       setScore([
//         ...secondScore,
//         {
//           subjectcode: '',
//           subjectarea: '',
//           unit: '',
//           rank: '',
//         },
//       ]);
//     }
//   };

//   const checkRowFilled = scores => {
//     return !scores.some(
//       score =>
//         score.subjectcode === '' ||
//         score.subjectarea === '' ||
//         score.unit === '' ||
//         score.rank === '',
//     );
//   };

//   // GpaInput의 onSubmitClick
//   const onSubmitClick = () => {
//     if (submit) {
//       setSubmit(prev => !prev);
//       return;
//     }

//     if (checkRowFilled(firstScore) && checkRowFilled(secondScore)) {
//       const formatScore = (score, sem) => ({
//         grade: selectedGrade,
//         semester: sem,
//         subjectarea: score.subjectarea,
//         subjectcode: score.subjectcode,
//         unit: score.unit,
//         rank: score.rank,
//       });

//       const formattedFirstScore = firstScore.map(score => formatScore(score, 1));
//       const formattedSecondScore = secondScore.map(score => formatScore(score, 2));
//       _postSaveScores(formattedFirstScore.concat(formattedSecondScore));

//       setSubmit(prev => !prev);
//     } else {
//       alert('교과, 과목, 단위수, 석차등급을 모두 입력해주세요.');
//     }
//   };

//   return (
//     <>
//       <S.ContentTitle>{'1학기'}</S.ContentTitle>
//       <S.MoblieOverflowContainer>
//         <S.GpaTable>
//           <colgroup>
//             <col width="30%" />
//             <col width="30%" />
//             <col width="auto" />
//             <col width="auto" />
//           </colgroup>
//           <thead>
//             <tr>
//               <S.GpaTH>{'교과'}</S.GpaTH>
//               <S.GpaTH>{'과목'}</S.GpaTH>
//               <S.GpaTH>{'단위수'}</S.GpaTH>
//               <S.GpaTH>{'석차등급'}</S.GpaTH>
//             </tr>
//           </thead>
//           <tbody>
//             {firstScore.map((_, index) => renderScoreInput(_, index, firstScore, setFirstScore))}
//             <UserAgent computer>
//               <tr>
//                 <S.GpaTD colSpan="4">
//                   <S.GpaAddButton onClick={() => onAddClick(setFirstScore, 0)}>
//                     {'과목 추가하기'}
//                   </S.GpaAddButton>
//                 </S.GpaTD>
//               </tr>
//             </UserAgent>
//           </tbody>
//         </S.GpaTable>
//       </S.MoblieOverflowContainer>
//       <UserAgent mobile>
//         <S.MoblieAddButtonLayout>
//           <S.GpaAddButton onClick={() => onAddClick(setFirstScore, 0)}>
//             {'과목 추가하기'}
//           </S.GpaAddButton>
//         </S.MoblieAddButtonLayout>
//       </UserAgent>

//       <S.ContentTitle style={{marginTop: 24}}>{'2학기'}</S.ContentTitle>
//       <S.MoblieOverflowContainer>
//         <S.GpaTable>
//           <colgroup>
//             <col width="30%" />
//             <col width="30%" />
//             <col width="auto" />
//             <col width="auto" />
//           </colgroup>
//           <thead>
//             <tr>
//               <S.GpaTH>{'교과'}</S.GpaTH>
//               <S.GpaTH>{'과목'}</S.GpaTH>
//               <S.GpaTH>{'단위수'}</S.GpaTH>
//               <S.GpaTH>{'석차등급'}</S.GpaTH>
//             </tr>
//           </thead>
//           <tbody>
//             {secondScore.map((_, index) => renderScoreInput(_, index, secondScore, setSecondScore))}
//             <UserAgent computer>
//               <tr>
//                 <S.GpaTD colSpan="4">
//                   <S.GpaAddButton onClick={() => onAddClick(setSecondScore, 1)}>
//                     {'과목 추가하기'}
//                   </S.GpaAddButton>
//                 </S.GpaTD>
//               </tr>
//             </UserAgent>
//           </tbody>
//         </S.GpaTable>
//       </S.MoblieOverflowContainer>
//       <UserAgent mobile>
//         <S.MoblieAddButtonLayout style={{marginBottom: 16}}>
//           <S.GpaAddButton onClick={() => onAddClick(setSecondScore, 1)}>
//             {'과목 추가하기'}
//           </S.GpaAddButton>
//         </S.MoblieAddButtonLayout>
//       </UserAgent>
//       <S.RegularButtonContainer>
//         <Button active={submit} onClick={onSubmitClick}>
//           {submit ? '내신 성적 수정하기' : '내신 성적 저장하기'}
//         </Button>
//       </S.RegularButtonContainer>
//     </>
//   );
// };

export default ScoreInput;
