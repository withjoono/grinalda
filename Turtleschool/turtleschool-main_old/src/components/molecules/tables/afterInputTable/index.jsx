// -----------------------------------------------------------------
//
//                        발표후 성적 입력 테이블
//
// -----------------------------------------------------------------

import axios from 'axios';
import * as S from './style';
import {FormControl, MenuItem, Select} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import {UserAgent} from '@quentin-sommer/react-useragent';
import {useEffect, useState} from 'react';

const AfterTestTable = ({subjects}) => {
  const [selectedSubject, setSelectedSubject] = useState({
    kor: '',
    mat: '',
    eng: {
      code_cd: '81',
      code_nm: '공통영어',
      lar_subject_cd: '8',
      lar_subject_nm: '영어',
    },
    his: {code_cd: '1G', code_nm: '한국사'},
    sub1: '',
    sub2: '',
    for: '',
    res1: '',
    res2: '',
  });

  const [score, setScore] = useState({
    kor: '',
    mat: '',
    eng: '',
    his: '',
    res1: '',
    res2: '',
    for: '',
  });

  const [review, setReview] = useState({
    kor: '',
    mat: '',
    eng: '',
    his: '',
    res1: '',
    res2: '',
    for: '',
  });

  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    _getMyScore();
  }, []);

  useEffect(() => {}, [selectedSubject]);

  const _getMyScore = () => {
    axios
      .get('/api/csat/selectanalysis_1', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          division: 1,
          year: '2022',
        },
      })
      .then(res => {
        if (res?.data?.data) {
          setSubmit(true);
          const mapSelectedSubject = data => {
            return {
              code_cd: data.subject_a,
              code_nm: data.lar_subject_nm,
              lar_subject_cd: data.lar_subject_cd,
              lar_subject_nm: data.lar_subject_nm,
            };
          };

          const formattedSubjects = res.data.data.map(mapSelectedSubject);

          setSelectedSubject(prev => {
            onScoreChange(
              {
                kor: formattedSubjects[0],
                mat: formattedSubjects[1],
                eng: prev.eng,
                his: prev.his,
                res1: {
                  ...formattedSubjects[4],
                  code_cd: formattedSubjects[4].lar_subject_cd === '1' ? '2' : '1',
                },
                res2: {
                  ...formattedSubjects[5],
                  code_cd: formattedSubjects[5].lar_subject_cd === '1' ? '2' : '1',
                },
                sub1: {
                  ...formattedSubjects[4],
                  code_nm: 'sub1',
                },
                sub2: {
                  ...formattedSubjects[5],
                  code_nm: 'sub2',
                },
                for: formattedSubjects[6],
              },
              {
                kor: res.data.data[0]?.standardscore,
                mat: res.data.data[1]?.standardscore,
                eng: res.data.data[2]?.grade,
                his: res.data.data[3]?.grade,
                res1: res.data.data[4]?.standardscore,
                res2: res.data.data[5]?.standardscore,
                for: res.data.data[6]?.grade,
              },
            );
            return {
              kor: formattedSubjects[0],
              mat: formattedSubjects[1],
              eng: prev.eng,
              his: prev.his,
              res1: {
                ...formattedSubjects[4],
                code_cd: formattedSubjects[4].lar_subject_cd === '1' ? '2' : '1',
              },
              res2: {
                ...formattedSubjects[5],
                code_cd: formattedSubjects[5].lar_subject_cd === '1' ? '2' : '1',
              },
              sub1: {
                ...formattedSubjects[4],
                code_nm: 'sub1',
              },
              sub2: {
                ...formattedSubjects[5],
                code_nm: 'sub2',
              },
              for: formattedSubjects[6],
            };
          });
          setScore({
            kor: res.data.data[0].standardscore,
            mat: res.data.data[1].standardscore,
            eng: res.data.data[2].grade,
            his: res.data.data[3].grade,
            res1: res.data.data[4].standardscore,
            res2: res.data.data[5].standardscore,
            for: res.data.data[6].grade,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const _postSaveAfter = query => {
    axios
      .post(
        '/api/csat/saveafterP',
        {
          data: {
            year: '2022',
            array_score: query,
            division: selectedSubject.res1?.code_cd[0] === '2' ? 0 : 1,
          },
        },
        {
          headers: {
            auth: localStorage.getItem('uid'),
          },
        },
      )
      .then(res => {})
      .catch(e => {
        console.log(e);
      });
  };

  const _postSaveScore = query => {
    axios
      .post(
        '/api/csat/savescore',
        {
          data: {
            year: '2022',
            array_score: query,
          },
        },
        {
          headers: {
            auth: localStorage.getItem('uid'),
          },
        },
      )
      .then(res => {})
      .catch(e => {
        console.log(e);
      });
  };

  const _getScoreReview = (query, subjects) => {
    axios
      .get('/api/csat/selectanalysis_8', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          year: '2022',
          array_score: query,
        },
      })
      .then(res => {
        setReview(prev => ({
          ...prev,
          kor: res.data?.data?.find(score => score.subject[0] === '6'),
          mat: res.data?.data?.find(score => score.subject[0] === '7'),
          eng: res.data?.data?.find(score => score.subject === '81'),
          his: res.data?.data?.find(score => score.subject === '1G'),
          res1: res.data?.data?.find(score => score.subject === subjects.sub1?.code_cd),
          res2: res.data?.data?.find(score => score.subject === subjects.sub2?.code_cd),
          for: res.data?.data?.find(score => score.subject === subjects.for?.code_cd),
        }));
      })
      .catch(e => {
        console.log(e);
      });
  };

  const checkSubjectSelection = (score, callback) => {
    if (typeof score.kor !== typeof score.korSelect) {
      alert('국어 공통과목과 선택과목 모두 입력해주세요');
    } else if (typeof score.mat !== typeof score.matSelect) {
      alert('수학 공통과목과 선택과목 모두 입력해주세요');
    } else {
      callback();
    }
  };

  // AfterTestTable의 onSubmitClick
  const onSubmitClick = submit => {
    if (!submit) {
      const selectedSubjects = Object.values(selectedSubject).filter(
        subject => subject?.code_nm !== '사회탐구' && subject?.code_nm !== '과학탐구',
      );
      const _score = Object.values(score);

      // _postSaveAfter(selectedSubjects.reduce(stringifyScores, '').slice(1));

      const stringifyReviewScores = (prev, curr, i) => {
        if (_score[i] === '' || _score[i] === undefined) {
          return prev;
        } else {
          let reviewScore;

          if (curr?.code_cd[0] === '6' || curr?.code_cd[0] === '7') {
            reviewScore = Object.values(review).find(
              review => review?.subject[0] === curr.code_cd[0],
            );
          } else {
            reviewScore = Object.values(review).find(review => review?.subject === curr.code_cd);
          }

          if (reviewScore) {
            return (
              prev +
              `${curr.code_cd},,${reviewScore.standard_score || ''},${
                reviewScore.percentage_score || ''
              },${reviewScore.rating_score || ''}|`
            );
          } else {
            return prev + `${curr.code_cd},|`;
          }
        }
      };

      // const stringfyMyScore = (prev, curr, i) => {
      //     if (_score[i] === '' || _score[i] === undefined) {
      //         return prev;
      //     } else {
      //         let reviewScore;

      //         if (curr?.code_cd[0] === '6') {
      //             reviewScore = Object.values(review).find((review) => review?.subject[0] === curr?.code_cd[0]);
      //             return prev + `${reviewScore.standard_score}|`
      //         } else if (curr?.code_cd === '1G') {
      //             reviewScore = Object.values(review).find((review) => review?.subject === curr.code_cd);
      //             return prev + `${reviewScore.rating_score}|`
      //         } else if (curr?.code_cd[0] === '7' || curr?.code_cd[0] === '1' || curr?.code_cd[0] === '2') {
      //             if (curr?.code_cd[0] === '7') {
      //                 reviewScore = Object.values(review).find((review) => review?.subject[0] === curr.code_cd[0]);
      //             } else {
      //                 reviewScore = Object.values(review).find((review) => review?.subject === curr.code_cd);
      //             }
      //             return prev + `${curr.code_cd},${reviewScore.standard_score}|`
      //         } else {
      //             reviewScore = Object.values(review).find((review) => review?.subject === curr.code_cd);
      //             return prev + `${reviewScore.rating_score}|`
      //         }
      //     }
      // }

      _postSaveScore(selectedSubjects.reduce(stringifyReviewScores, '').slice(0, -1));
      _postSaveAfter(selectedSubjects.reduce(stringifyReviewScores, '').slice(0, -1));
    } else {
      setScore(scoreObject);
    }
    setSubmit(prev => !prev);
  };

  // AfterTestTable 성적 수정 시, 진입
  const onScoreChange = (subjects, scores) => {
    const selectedSubjects = Object.values(subjects).filter(
      subject => subject?.code_nm !== '사회탐구' && subject?.code_nm !== '과학탐구',
    );
    const score = Object.values(scores);
    const stringifyScores = (prev, curr, i) => {
      if (score[i] === '' || score[i] === undefined) {
        return prev;
      } else if (
        curr?.lar_subject_cd === '6' ||
        curr?.lar_subject_cd === '7' ||
        curr?.lar_subject_cd === '1' ||
        curr?.lar_subject_cd === '2'
      ) {
        return prev + `|${curr.code_cd},${score[i]},`;
      } else {
        return prev + `|${curr.code_cd},,${score[i]}`;
      }
    };

    _getScoreReview(selectedSubjects.reduce(stringifyScores, '').slice(1), subjects);
  };

  const getMajors = subject => {
    return subjects.filter(sub => sub.lar_subject_nm === subject);
  };

  const renderSelect = ({key, items, selectedSubject}) => {
    const onChange = ({target}) => {
      const object = items.find(subject => subject.code_cd === target.value);

      setSelectedSubject(prev => {
        onScoreChange(
          {
            ...prev,
            [key]: object,
          },
          score,
        );

        return {
          ...prev,
          [key]: object,
        };
      });
    };

    const getPlaceholder = key => {
      switch (key) {
        case 'for':
          return '제2 외국어';
        case 'res1':
          return '탐구1 선택';
        case 'res2':
          return '탐구2 선택';
        case 'sci':
          return '과학탐구 선택';
        case 'soc':
          return '사회탐구 선택';
        default:
          return '선택';
      }
    };

    return (
      <FormControl
        disabled={submit}
        style={{
          width: '80%',
          backgroundColor: 'white',
          fontWeight: 'normal',
          fontSize: 12,
        }}
      >
        <Select
          id={key}
          style={{
            fontWeight: 'normal',
            fontSize: 12,
            color: selectedSubject[key] === '' ? '#9a9a9a' : '#000000',
          }}
          value={selectedSubject[key]?.code_cd || ''}
          onChange={onChange}
          displayEmpty
          inputProps={{'aria-label': 'Without label'}}
        >
          <MenuItem style={{fontWeight: 'normal', fontSize: 12}} value="" disabled>
            {getPlaceholder(key)}
          </MenuItem>
          {items.map(item => (
            <MenuItem key={item.code_cd} value={item.code_cd}>
              {item.code_nm}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };

  const onScoreInputChange = ({target}) => {
    let max = 100;

    switch (target.id) {
      case 'kor':
        max = 150;
        break;
      case 'korSelect':
        max = 24;
        break;
      case 'mat':
        max = 149;
        break;
      case 'matSelect':
        max = 26;
        break;
      case 'eng':
        max = 9;
        break;
      case 'for':
        max = 9;
        break;
      case 'his':
        max = 9;
        break;
      default:
        max = 75;
        break;
    }
    const result = target.value === '' ? '' : Math.min(Math.max(parseInt(target.value), 0), max);
    setScore(prev => {
      onScoreChange(selectedSubject, {
        ...prev,
        [target.id]: result,
      });
      return {
        ...prev,
        [target.id]: result,
      };
    });
  };

  const renderScore = data => {
    const keys = Object.keys(data);
    return Object.values(data).map((value, index) => (
      <S.RegularTD
        key={keys[index]}
        colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}
      >
        {value}
      </S.RegularTD>
    ));
  };

  const renderStandardScore = data => {
    const keys = Object.keys(data);
    return Object.values(data).map((value, index) => (
      <S.RegularTD key={keys[index]}>{value?.standard_score}</S.RegularTD>
    ));
  };

  const renderHundredScore = data => {
    const keys = Object.keys(data);
    return Object.values(data).map((value, index) => (
      <S.TDDimmed key={keys[index]}>{value?.percentage_score}</S.TDDimmed>
    ));
  };

  const renderGrade = data => {
    const keys = Object.keys(data);
    return Object.values(data).map((value, index) => (
      <S.RegularTD key={keys[index]}>{value?.rating_score}</S.RegularTD>
    ));
  };

  const onSelectBoxClick = (key, value) => {
    setSelectedSubject(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  //   console.log('data come check ', _savedScore);

  return (
    <>
      <S.MoblieOverflowContainer>
        <S.RegularTable>
          <tbody>
            {/* <tr>
              <S.RegularTH rowSpan={2}>{'구분'}</S.RegularTH>
              <S.RegularTH>{'국어'}</S.RegularTH>
              <S.RegularTH>{'수학'}</S.RegularTH>
              <S.RegularTH rowSpan={2}>{'영어'}</S.RegularTH>
              <S.RegularTH rowSpan={2}>{'한국사'}</S.RegularTH>
              <S.RegularTH>
                {renderSelect({
                  key: 'res1',
                  items: resSelection,
                  selectedSubject: selectedSubject,
                })}
              </S.RegularTH>
              <S.RegularTH>
                {renderSelect({
                  key: 'res2',
                  items: resSelection,
                  selectedSubject: selectedSubject,
                })}
              </S.RegularTH>
              <S.RegularTH rowSpan={2}>
                {renderSelect({
                  key: 'for',
                  items: getMajors('제2외국어'),
                  selectedSubject: selectedSubject,
                })}
              </S.RegularTH>
            </tr> */}
            <tr>
              <S.RegularTH>
                {renderSelect({
                  key: 'kor',
                  items: getMajors('국어'),
                  selectedSubject: selectedSubject,
                })}
                {/* <S.SelectBoxContainer>
                  {getMajors('국어').map(subject => (
                    <S.SelectBox
                      active={selectedSubject.kor.code_cd === subject.code_cd}
                      onClick={() => onSelectBoxClick('kor', subject)}
                    >
                      {subject.code_nm}
                    </S.SelectBox>
                  ))}
                </S.SelectBoxContainer> */}
              </S.RegularTH>
              <S.RegularTH>
                <S.SelectBoxContainer>
                  {renderSelect({
                    key: 'math',
                    items: getMajors('수학'),
                    selectedSubject: selectedSubject,
                  })}
                  {/* {getMajors('수학').map(subject => (
                    <S.SelectBox
                      active={selectedSubject.mat.code_cd === subject.code_cd}
                      onClick={() => onSelectBoxClick('mat', subject)}
                    >
                      {subject.code_nm}
                    </S.SelectBox>
                  ))} */}
                </S.SelectBoxContainer>
              </S.RegularTH>
              <S.RegularTH>
                {renderSelect({
                  key: 'sub1',
                  items: getMajors(selectedSubject.res1.code_nm),
                  selectedSubject: selectedSubject,
                })}
              </S.RegularTH>
              <S.RegularTH>
                {renderSelect({
                  key: 'sub2',
                  items: getMajors(selectedSubject.res2.code_nm),
                  selectedSubject: selectedSubject,
                })}
              </S.RegularTH>
            </tr>
            <tr>
              <S.RegularTD>{'표준점수'}</S.RegularTD>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={100}
                  disabled={selectedSubject.kor === '' || submit}
                  id={'kor'}
                  value={score['kor']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={100}
                  disabled={selectedSubject.mat === '' || submit}
                  id={'mat'}
                  value={score['mat']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
              <S.TDDimmed>{review.eng?.standard_score}</S.TDDimmed>
              <S.TDDimmed>{review.his?.standard_score}</S.TDDimmed>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={50}
                  disabled={selectedSubject.res1 === '' || submit}
                  id={'res1'}
                  value={score['res1']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={50}
                  disabled={selectedSubject.res2 === '' || submit}
                  id={'res2'}
                  value={score['res2']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
              <S.TDDimmed>{review.for?.standard_score}</S.TDDimmed>
            </tr>
            <tr>
              <S.RegularTD>{'백분위'}</S.RegularTD>
              {renderHundredScore(review)}
            </tr>
            <tr>
              <S.RegularTD>{'등급'}</S.RegularTD>
              <S.TDDimmed>{review.kor?.rating_score}</S.TDDimmed>
              <S.TDDimmed>{review.mat?.rating_score}</S.TDDimmed>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={9}
                  disabled={selectedSubject.eng === '' || submit}
                  id={'eng'}
                  value={score['eng']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={9}
                  disabled={selectedSubject.his === '' || submit}
                  id={'his'}
                  value={score['his']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
              <S.TDDimmed>{review.res1?.rating_score}</S.TDDimmed>
              <S.TDDimmed>{review.res2?.rating_score}</S.TDDimmed>
              <S.RegularTD>
                <S.RegularInput
                  type="number"
                  min={0}
                  max={100}
                  disabled={selectedSubject.for === '' || submit}
                  id={'for'}
                  value={score['for']}
                  onChange={onScoreInputChange}
                  placeholder="입력"
                />
              </S.RegularTD>
            </tr>
          </tbody>
        </S.RegularTable>
      </S.MoblieOverflowContainer>
      {/* <Advice>
        {'원점수를 입력하시면 표준점수, 백분위, 등급이 자동으로 계산되어 보여집니다.'}
      </Advice> */}
      <S.RegularButtonContainer>
        {/* <Button active={submit} onClick={() => onSubmitClick(submit)}>
          {submit ? '수능 성적 수정하기' : '수능 성적 저장하기'}
        </Button> */}
      </S.RegularButtonContainer>
    </>
  );
};

export default AfterTestTable;
