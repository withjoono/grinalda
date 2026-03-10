// --------------------------------------------------
//
//                 성적 발표 전 입력
//
// --------------------------------------------------

import {useState, useEffect} from 'react';
import * as S from './style';
import styled from 'styled-components';
import {
  getCalculatedSubjectScoreFromOrgScore,
  getSavedScoreFetch,
  saveCalculatedSubjectScoreList,
} from '../../../../api/csat';
import SubjectSelect from '../../../atoms/subjectSelect';

import {useInput} from '../../../../hooks/useInput';
import {
  comKorCond,
  comMatCond,
  engCond,
  fiftyNumCond,
  korCond,
  matCond,
} from '../../../../utils/inputConditions';

const Button = styled.button`
  cursor: pointer;
  padding: 7px 40px;
  background-color: ${props => (props.active ? 'white' : '#c86f4c')};
  color: ${props => (props.active ? '#c86f4c' : 'white')};
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 26px;
  border: ${props => (props.active ? '#c86f4c solid 1px' : 'none')};
  box-sizing: border-box;

  @media screen and (max-width: 420px) {
    width: 100%;
  }
`;

const BeforeTestTable = ({onChangeIsScoreSaved}) => {
  const korean = useInput('', korCond);
  const comKorean = useInput('', comKorCond);
  const math = useInput('', matCond);
  const comMath = useInput('', comMatCond);
  const eng = useInput('', engCond);
  const korHistory = useInput('', fiftyNumCond);
  const selectOne = useInput('', fiftyNumCond);
  const selectTwo = useInput('', fiftyNumCond);
  const foreignLanguage = useInput('', fiftyNumCond);

  const [isScoreSaved, setIsScoreSaved] = useState(false);

  const [saveScoreParams, setSaveScoreParams] = useState([]);
  const [ressType, setRessType] = useState({res1: '', res2: ''});
  const [selectedSubjectCode, setSelectedSubjectCode] = useState({
    kor: '',
    mat: '',
    res1: '',
    res2: '',
    for: '',
    korHistory: '1G',
    eng: '81',
  });

  const orgScoreInputs = [
    {subjectKey: 'kor', input: korean},
    {subjectKey: 'comKor', input: comKorean},
    {subjectKey: 'mat', input: math},
    {subjectKey: 'comMath', input: comMath},
    {subjectKey: 'eng', input: eng},
    {subjectKey: 'korHistory', input: korHistory},
    {subjectKey: 'res1', input: selectOne},
    {subjectKey: 'res2', input: selectTwo},
    {subjectKey: 'for', input: foreignLanguage},
  ];

  const [calcScoreFromOrgScore, setCalcScoreFromOrgScore] = useState({
    kor: {standard: '', percent: '', grade: ''},
    mat: {standard: '', percent: '', grade: ''},
    eng: {standard: '', percent: '', grade: ''},
    korHistory: {standard: '', percent: '', grade: ''},
    res1: {standard: '', percent: '', grade: ''},
    res2: {standard: '', percent: '', grade: ''},
    for: {standard: '', percent: '', grade: ''},
  });

  useEffect(() => {
    getSaveScore();
  }, []);

  const getSaveScore = async () => {
    const {data} = await getSavedScoreFetch();

    if (data.success) {
      onChangeIsScoreSaved(true);
      setIsScoreSaved(true);
      applyToTable(data.data);
    }
  };

  const applyToTable = scores => {
    let isFirstSaved = false;
    scores.forEach(score => {
      switch (score.lar_subject_nm) {
        case '국어':
          korean.setValue(score.score_a);
          comKorean.setValue(score.score_b);
          setSelectedSubjectCode(prev => {
            return {...prev, kor: score.subject_a};
          });
          setCalcScoreFromOrgScore(prev => {
            return {
              ...prev,
              kor: {standard: score.standardscore, percent: score.percentage, grade: score.grade},
            };
          });
          break;
        case '수학':
          math.setValue(score.score_a);
          comMath.setValue(score.score_b);
          setSelectedSubjectCode(prev => {
            return {...prev, mat: score.subject_a};
          });
          setCalcScoreFromOrgScore(prev => {
            return {
              ...prev,
              mat: {
                standard: score.standardscore,
                percent: score.percentage,
                grade: score.grade,
              },
            };
          });
          break;
        case '영어':
          eng.setValue(score.score_a);
          setCalcScoreFromOrgScore(prev => {
            return {
              ...prev,
              eng: {
                grade: score.grade,
              },
            };
          });
          break;
        case '한국사':
          korHistory.setValue(score.score_a);
          setCalcScoreFromOrgScore(prev => {
            return {
              ...prev,
              korHistory: {
                grade: score.grade,
              },
            };
          });
          break;
        case '사회탐구':
        case '과학탐구':
          if (isFirstSaved === false) {
            isFirstSaved = true;
            selectOne.setValue(score.score_a);
            setRessType(prev => {
              return {...prev, res1: score.lar_subject_nm === '사회탐구' ? 'soci' : 'sci'};
            });
            setSelectedSubjectCode(prev => {
              return {...prev, res1: score.subject_a};
            });
            setCalcScoreFromOrgScore(prev => {
              return {
                ...prev,
                res1: {
                  standard: score.standardscore,
                  percent: score.percentage,
                  grade: score.grade,
                },
              };
            });
          } else {
            selectTwo.setValue(score.score_a);
            setRessType(prev => {
              return {...prev, res2: score.lar_subject_nm === '사회탐구' ? 'soci' : 'sci'};
            });
            setSelectedSubjectCode(prev => {
              return {...prev, res2: score.subject_a};
            });
            setCalcScoreFromOrgScore(prev => {
              return {
                ...prev,
                res2: {
                  standard: score.standardscore,
                  percent: score.percentage,
                  grade: score.grade,
                },
              };
            });
          }
          break;
        case '제2외국어':
          foreignLanguage.setValue(score.score_a);
          setSelectedSubjectCode(prev => {
            return {...prev, for: score.subject_a};
          });
          setCalcScoreFromOrgScore(prev => {
            return {
              ...prev,
              for: {
                standard: score.standardscore,
                percent: score.percentage,
                grade: score.grade,
              },
            };
          });
          break;
      }
    });
  };

  const handleScoreSaveBtn = () => {
    if (isScoreSaved) {
      setIsScoreSaved(false);
      onChangeIsScoreSaved(false);
    } else {
      setIsScoreSaved(true);

      setSaveScoreParams([]);
      orgScoreInputs.forEach(async (subject, index, _arr) => {
        switch (subject.subjectKey) {
          case 'kor':
            await calcSubjectScoreFromOrgScore(
              subject.subjectKey,
              subject.input.value,
              comKorean.value,
            );
            break;
          case 'mat':
            await calcSubjectScoreFromOrgScore(
              subject.subjectKey,
              subject.input.value,
              comMath.value,
            );
            break;
          default:
            if (subject.subjectKey !== 'comKor' && subject.subjectKey !== 'comMath') {
              await calcSubjectScoreFromOrgScore(subject.subjectKey, subject.input.value);
            }
            break;
        }
      });
    }
  };
  const calcSubjectScoreFromOrgScore = async (subjectKey, score, comScore) => {
    let params = {
      subject: selectedSubjectCode[subjectKey],
      score,
    };
    if (subjectKey === 'mat' || subjectKey === 'kor') {
      params.is_common = true;
      params.common_score = comScore;
    }

    const {data} = await getCalculatedSubjectScoreFromOrgScore(params);

    if (data.data) {
      setSaveScoreParams(prev => [...prev, {...data.data[0], ...data.params}]);
    }

    // saveScoreParams.current.push(data[0]);
  };

  const onChangeSelectSubject = value => {
    const _selectedSubjectCode = {...selectedSubjectCode};
    switch (value.name) {
      case 'kor':
        _selectedSubjectCode[value.name] = value.value;
        break;
      case 'mat':
        _selectedSubjectCode[value.name] = value.value;
        break;
      case 'soci':
      case 'sci':
        _selectedSubjectCode[value.isFrist ? 'res1' : 'res2'] = value.value;
        break;
      case 'for':
        _selectedSubjectCode[value.name] = value.value;
        break;
    }

    setSelectedSubjectCode(_selectedSubjectCode);
  };

  useEffect(() => {
    const requestCount = 7 - Object.values(selectedSubjectCode).includes('');
    if (saveScoreParams.length === requestCount) {
      saveScore();
    }
  }, [saveScoreParams]);

  const saveScore = async () => {
    const params = [];
    saveScoreParams.forEach(param => {
      const tempParam = {
        subject: param.subject_cd,
        org_score: param.score,
        standard_score: param.standard_score,
        percentage_score: param.percentage_score,
        rating_score: param.rating_score,
        cumulative: param.cumulative,
        common_score: param.common_score,
        is_common: param.common_score === 999 ? false : true,
      };

      params.push(tempParam);
    });

    const {data} = await saveCalculatedSubjectScoreList(params);

    if (data.success) {
      onChangeIsScoreSaved(true);
      getSaveScore();
    }
  };

  return (
    <>
      <S.MoblieOverflowContainer>
        <S.RegularTable>
          <tbody>
            <tr>
              <S.RegularTH rowSpan={2}>{'구분'}</S.RegularTH>
              <S.RegularTH colSpan={2}>{'국어'}</S.RegularTH>
              <S.RegularTH colSpan={2}>{'수학'}</S.RegularTH>
              <S.RegularTH rowSpan={2}>{'영어'}</S.RegularTH>
              <S.RegularTH rowSpan={2}>{'한국사'}</S.RegularTH>
              <S.RegularTH>
                <SubjectSelect
                  subjectKey="res1"
                  onChangeSelectSubject={target => setRessType({...ressType, res1: target.value})}
                  isScoreSaved={isScoreSaved}
                  savedCode={ressType.res1}
                />
              </S.RegularTH>
              <S.RegularTH>
                <SubjectSelect
                  subjectKey="res2"
                  onChangeSelectSubject={target => setRessType({...ressType, res2: target.value})}
                  isScoreSaved={isScoreSaved}
                  savedCode={ressType.res2}
                />
              </S.RegularTH>
              <S.RegularTH rowSpan={2}>
                <SubjectSelect
                  subjectKey="for"
                  onChangeSelectSubject={onChangeSelectSubject}
                  savedCode={selectedSubjectCode.for}
                  isScoreSaved={isScoreSaved}
                />
              </S.RegularTH>
            </tr>
            <tr>
              <S.RegularTH>
                <SubjectSelect
                  subjectKey="kor"
                  onChangeSelectSubject={onChangeSelectSubject}
                  savedCode={selectedSubjectCode.kor}
                  isScoreSaved={isScoreSaved}
                />
              </S.RegularTH>
              <S.RegularTH>공통</S.RegularTH>
              <S.RegularTH>
                <SubjectSelect
                  subjectKey="mat"
                  isScoreSaved={isScoreSaved}
                  onChangeSelectSubject={onChangeSelectSubject}
                  savedCode={selectedSubjectCode.mat}
                />
              </S.RegularTH>
              <S.RegularTH>공통</S.RegularTH>
              <S.RegularTH>
                <SubjectSelect
                  subjectKey={ressType.res1}
                  isFrist
                  onChangeSelectSubject={onChangeSelectSubject}
                  savedCode={selectedSubjectCode.res1}
                  isScoreSaved={isScoreSaved}
                />
              </S.RegularTH>
              <S.RegularTH>
                <SubjectSelect
                  subjectKey={ressType.res2}
                  isFrist={false}
                  onChangeSelectSubject={onChangeSelectSubject}
                  savedCode={selectedSubjectCode.res2}
                  isScoreSaved={isScoreSaved}
                />
              </S.RegularTH>
            </tr>
            <tr>
              <S.RegularTD>{'원점수'}</S.RegularTD>
              {orgScoreInputs.map(rawScore => {
                return (
                  <S.RegularTD key={rawScore.subjectKey}>
                    <S.RegularInput
                      type="number"
                      min={0}
                      disabled={isScoreSaved}
                      id={rawScore.subjectKey}
                      placeholder="입력"
                      {...rawScore.input}
                    />
                  </S.RegularTD>
                );
              })}
            </tr>
            <tr>
              <S.RegularTD>{'표준점수'}</S.RegularTD>
              {Object.keys(calcScoreFromOrgScore).map(key => {
                return (
                  <S.RegularTD
                    colSpan={key === 'kor' || key === 'mat' ? 2 : 1}
                    key={'score standard' + key.toString()}
                  >
                    <S.RegularInput
                      type="number"
                      min={0}
                      value={calcScoreFromOrgScore[key].standard}
                      disabled
                      //   id={key}
                    />
                  </S.RegularTD>
                );
              })}
              {/* {calcScoreFromOrgScore.map((score, index) => {
                return (
                  <div />
                  //   <S.RegularTD key={'score standard' + index.toString()}>
                  //     <S.RegularInput
                  //       type="number"
                  //       min={0}
                  //       value={score.standard}
                  //       disabled
                  //       id={score.subjectKey}
                  //     />
                  //   </S.RegularTD>
                );
              })} */}
            </tr>
            <tr>
              <S.RegularTD>{'백분위'}</S.RegularTD>
              {Object.keys(calcScoreFromOrgScore).map(key => {
                return (
                  <S.RegularTD
                    key={'score standard' + key.toString()}
                    colSpan={key === 'kor' || key === 'mat' ? 2 : 1}
                  >
                    <S.RegularInput
                      colSpan={2}
                      type="number"
                      min={0}
                      value={calcScoreFromOrgScore[key].percent}
                      disabled
                    />
                  </S.RegularTD>
                );
              })}
            </tr>
            <tr>
              <S.RegularTD>{'등급'}</S.RegularTD>
              {Object.keys(calcScoreFromOrgScore).map(key => {
                return (
                  <S.RegularTD
                    key={'score standard' + key.toString()}
                    colSpan={key === 'kor' || key === 'mat' ? 2 : 1}
                  >
                    <S.RegularInput
                      colSpan={key === 'kor' || key === 'mat' ? 2 : 1}
                      type="number"
                      min={0}
                      value={calcScoreFromOrgScore[key].grade}
                      disabled
                    />
                  </S.RegularTD>
                );
              })}
            </tr>
          </tbody>
        </S.RegularTable>
      </S.MoblieOverflowContainer>
      {/* <Advice>
        {'원점수를 입력하시면 표준점수, 백분위, 등급이 자동으로 계산되어 보여집니다.'}
      </Advice> */}
      <S.RegularButtonContainer>
        <Button
          active={isScoreSaved}
          //   onClick={onSubmitClick}
          onClick={handleScoreSaveBtn}
        >
          {isScoreSaved ? '수능 성적 수정하기' : '수능 성적 저장하기'}
        </Button>
      </S.RegularButtonContainer>
    </>
  );
}; // BeforeTestTable end

export default BeforeTestTable;
