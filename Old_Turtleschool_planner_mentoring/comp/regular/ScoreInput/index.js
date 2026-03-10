import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';
import Link from 'next/link';
import * as S from './index.style';
import Advice from '../../Advice';
import Button from '../../Button';
import axios from 'axios';

const resSelection = [
    {
        code_nm: '과학탐구',
        code_cd: '1',
    },
    { code_nm: '사회탐구', code_cd: '2' },
];

const ScoreInput = () => {
    const [beforeTest, setBeforeTest] = useState(false);

    const [subjects, setSubjects] = useState([]);

    const [haveGpaScore, setHaveGpaScore] = useState(false);

    const [selectedGrade, setSelectedGrade] = useState('1');

    const [firstGradeScore, setFirstGradeScore] = useState([[], []]);
    const [secondGradeScore, setSecondGradeScore] = useState([[], []]);
    const [thirdGradeScore, setThirdGradeScore] = useState([[], []]);

    useEffect(() => {
        _getSubjects();
        _getSavedScores();
    }, []);

    // requests

    const _getSavedScores = () => {
        axios
            .get('/api/csat/selectanalysis_7', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
                params: {
                    division: 1,
                    year: '2022',
                },
            })
            .then((res) => {
                console.log('_7: ', res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _getSubjects = () => {
        axios
            .get('/api/csat/selectsubject', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                console.log('regular-getSubject: ', res);
                setSubjects(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onGradeClick = ({ target }) => {
        setSelectedGrade(target.id);
    };

    const getData = (selectedGrade) => {
        switch (selectedGrade) {
            case '1':
                return {
                    selectedGrade,
                    firstScore: firstGradeScore[0],
                    setFirstScore: (score) =>
                        setFirstGradeScore((prev) => {
                            return [score, prev[1]];
                        }),
                    secondScore: firstGradeScore[1],
                    setSecondScore: (score) =>
                        setFirstGradeScore((prev) => {
                            return [prev[0], score];
                        }),
                };
            case '2':
                return {
                    selectedGrade,
                    firstScore: secondGradeScore[0],
                    setFirstScore: (score) =>
                        setSecondGradeScore((prev) => {
                            return [score, prev[1]];
                        }),
                    secondScore: secondGradeScore[1],
                    setSecondScore: (score) =>
                        setSecondGradeScore((prev) => {
                            return [prev[0], score];
                        }),
                };
            case '3':
                return {
                    selectedGrade,
                    firstScore: thirdGradeScore[0],
                    setFirstScore: (score) =>
                        setThirdGradeScore((prev) => {
                            return [score, prev[1]];
                        }),
                    secondScore: thirdGradeScore[1],
                    setSecondScore: (score) =>
                        setThirdGradeScore((prev) => {
                            return [prev[0], score];
                        }),
                };
        }
    };

    return (
        <S.Container>
            <S.RegularContainer>
                <S.ContentTitle>{'수능 성적 입력'}</S.ContentTitle>
                <S.ResultConditionContainer>
                    <S.ResultConditionButton active={!beforeTest} onClick={() => setBeforeTest(false)}>
                        {'수능 발표 후'}
                    </S.ResultConditionButton>
                    <S.ResultConditionButton disabled={true} active={beforeTest} onClick={() => setBeforeTest(true)}>
                        {'수능 발표 전'}
                    </S.ResultConditionButton>
                </S.ResultConditionContainer>
                {beforeTest ? <BeforeTestTable subjects={subjects} /> : <AfterTestTable subjects={subjects} />}
                <S.HorizontalLine />
            </S.RegularContainer>
            <S.GpaContainer>
                <S.GpaHeaderContainer style={{ marginBottom: 8 }}>
                    <S.ContentTitle style={{ marginBottom: 0 }}>{'내신 성적 입력'}</S.ContentTitle>
                    <S.GpaHeaderButtonConatiner>
                        <S.GpaHeaderButton active={!haveGpaScore} onClick={() => setHaveGpaScore(false)}>
                            {'내신 입력하지 않기'}
                        </S.GpaHeaderButton>
                        <S.GpaHeaderButton active={haveGpaScore} onClick={() => setHaveGpaScore(true)}>
                            {'내신 입력하기'}
                        </S.GpaHeaderButton>
                    </S.GpaHeaderButtonConatiner>
                </S.GpaHeaderContainer>
                {!haveGpaScore && <Advice>{'일부 대학에서 내신 성적을 포함해 정시를 치릅니다. 필요하신 경우 우측 상단 버튼을 활성화시켜 내신을 입력하세요.'}</Advice>}

                {haveGpaScore && (
                    <>
                        <S.ResultConditionContainer>
                            <S.ResultConditionButton id='1' onClick={onGradeClick} active={selectedGrade === '1'}>
                                {'1학년'}
                            </S.ResultConditionButton>
                            <S.ResultConditionButton id='2' onClick={onGradeClick} active={selectedGrade === '2'}>
                                {'2학년'}
                            </S.ResultConditionButton>
                            <S.ResultConditionButton id='3' onClick={onGradeClick} active={selectedGrade === '3'}>
                                {'3학년'}
                            </S.ResultConditionButton>
                        </S.ResultConditionContainer>
                        <GpaInput {...getData(selectedGrade)} />
                    </>
                )}
                <Link href="/regular/analyse">
                    <S.NavButton>{'성적분석 바로가기'}</S.NavButton>
                </Link>
            </S.GpaContainer>
        </S.Container>
    );
};

const BeforeTestTable = ({ subjects }) => {
    const [selectedSubject, setSelectedSubject] = useState({
        korSelect: '',
        kor: { code_cd: '60', code_nm: '국어', lar_subject_cd: '6', lar_subject_nm: '국어' },
        matSelect: '',
        mat: { code_cd: '70', code_nm: '수학', lar_subject_cd: '7', lar_subject_nm: '수학' },
        eng: { code_cd: '81', code_nm: '공통영어', lar_subject_cd: '8', lar_subject_nm: '영어' },
        his: { code_cd: '1G', code_nm: '한국사' },
        sub1: '',
        sub2: '',
        for: '',
        res1: '',
        res2: '',
    });

    const [score, setScore] = useState({
        korSelect: '',
        kor: '',
        matSelect: '',
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

    const _postSaveAfter = (query) => {
        axios
            .post(
                '/api/csat/saveafterP',
                {
                    data: {
                        year: '2022',
                        array_score: query,
                        division: '0',
                    },
                },
                {
                    headers: {
                        auth: localStorage.getItem('uid'),
                    },
                }
            )
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _postSaveScore = (query) => {
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
                }
            )
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _getScoreReview = (query) => {
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
            .then((res) => {
                console.log('_8: ', res);
                setReview((prev) => ({
                    ...prev,
                    kor: res.data?.data?.find((score) => score.subject[0] === '6'),
                    mat: res.data?.data?.find((score) => score.subject[0] === '7'),
                    eng: res.data?.data?.find((score) => score.subject === '81'),
                    his: res.data?.data?.find((score) => score.subject === '1G'),
                    res1: res.data?.data?.find((score) => score.subject === selectedSubject.sub1.code_cd),
                    res2: res.data?.data?.find((score) => score.subject === selectedSubject.sub2.code_cd),
                    for: res.data?.data?.find((score) => score.subject === selectedSubject.for.code_cd),
                }));
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const checkSubjectSelection = (score, callback) => {
        console.log(score.kor, score.korSelect);
        console.log(score.mat, score.matSelect);
        if (typeof score.kor !== typeof score.korSelect) {
            alert('국어 공통과목과 선택과목 모두 입력해주세요');
        } else if (typeof score.mat !== typeof score.matSelect) {
            alert('수학 공통과목과 선택과목 모두 입력해주세요');
        } else {
            callback();
        }
    };

    const onSubmitClick = () => {
        checkSubjectSelection(score, () => {
            const selectedSubjects = Object.values(selectedSubject).filter((subject) => subject?.code_nm !== '사회탐구' && subject?.code_nm !== '과학탐구');
            const _score = Object.values(score);

            const stringifyScores = (prev, curr, i) => {
                if (_score[i] === '' || _score[i] === undefined) {
                    return prev;
                } else if (curr.code_cd === '60' || curr.code_cd === '70') {
                    return prev + `,${curr.code_cd},${_score[i]}`;
                } else {
                    return prev + `|${curr.code_cd},${_score[i]}`;
                }
            };

            console.log('result', selectedSubjects.reduce(stringifyScores, '').slice(1));
            // _postSaveAfter(selectedSubjects.reduce(stringifyScores, '').slice(1));

            const stringifyReviewScores = (prev, curr, i) => {
                const reviews = Object.values(review);

                if (_score[i] === '' || _score[i] === undefined) {
                    return prev;
                } else if (i === 0 || i === 2) {
                    return prev + `${curr.code_cd},${_score[i]},`;
                } else {
                    const reviewScore = Object.values(review).find((review) => review?.subject[0] === curr.code_cd[0]);
                    if (reviewScore) {
                        return prev + `${curr.code_cd},${_score[i]},${reviewScore.standard_score},${reviewScore.percentage_score},${reviewScore.rating_score}|`;
                    } else {
                        return prev + `${curr.code_cd},${_score[i]}|`;
                    }
                }
            };
            console.log('result2', selectedSubjects.reduce(stringifyReviewScores, '').slice(0, -1));
            _postSaveScore(selectedSubjects.reduce(stringifyReviewScores, '').slice(0, -1));
            _postSaveAfter(selectedSubjects.reduce(stringifyReviewScores, '').slice(0, -1));
            setSubmit((prev) => !prev);
        });
    };

    const onScoreChange = (subjects, scores) => {
        const selectedSubjects = Object.values(subjects).filter((subject) => subject?.code_nm !== '사회탐구' && subject?.code_nm !== '과학탐구');
        const score = Object.values(scores);

        const stringifyScores = (prev, curr, i) => {
            if (score[i] === '' || score[i] === undefined) {
                return prev;
            } else if (curr.code_cd === '60' || curr.code_cd === '70' || curr.code_cd) {
                return prev + `,${curr.code_cd},${score[i]}`;
            } else {
                return prev + `|${curr.code_cd},${score[i]}`;
            }
        };

        _getScoreReview(selectedSubjects.reduce(stringifyScores, '').slice(1));
    };

    const getMajors = (subject) => {
        return subjects.filter((sub) => sub.lar_subject_nm === subject);
    };

    const renderSelect = ({ key, items, selectedSubject }) => {
        const onChange = ({ target }) => {
            const object = items.find((subject) => subject.code_cd === target.value);

            console.log(target.value, object, items);
            setSelectedSubject((prev) => {
                onScoreChange(
                    {
                        ...prev,
                        [key]: object,
                    },
                    score
                );

                return {
                    ...prev,
                    [key]: object,
                };
            });
        };

        const getPlaceholder = (key) => {
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
            <FormControl disabled={submit} style={{ width: '80%', backgroundColor: 'white', fontWeight: 'normal', fontSize: 12 }}>
                <Select id={key} style={{ fontWeight: 'normal', fontSize: 12, color: selectedSubject[key] === '' ? '#9a9a9a' : '#000000' }} value={selectedSubject[key].code_cd || ''} onChange={onChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem style={{ fontWeight: 'normal', fontSize: 12 }} value='' disabled>
                        {getPlaceholder(key)}
                    </MenuItem>
                    {items.map((item) => (
                        <MenuItem key={item.code_cd} value={item.code_cd}>
                            {item.code_nm}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };

    const onScoreInputChange = ({ target }) => {
        let max = 100;

        switch (target.id) {
            case 'kor':
                max = 100;
                break;
            case 'mat':
                max = 100;
                break;
            case 'eng':
                max = 100;
                break;
            default:
                max = 50;
                break;
        }
        const result = target.value === '' ? '' : Math.min(Math.max(parseInt(target.value), 0), max);
        setScore((prev) => {
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

    const renderScore = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => (
            <S.RegularTD key={keys[index]} colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}>
                {value}
            </S.RegularTD>
        ));
    };

    const renderStandardScore = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => (
            <S.RegularTD key={keys[index]} colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}>
                {value?.standard_score}
            </S.RegularTD>
        ));
    };

    const renderHundredScore = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => (
            <S.RegularTD key={keys[index]} colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}>
                {value?.percentage_score}
            </S.RegularTD>
        ));
    };

    const renderGrade = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => (
            <S.RegularTD key={keys[index]} colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}>
                {value?.rating_score}
            </S.RegularTD>
        ));
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
                            <S.RegularTH>{renderSelect({ key: 'res1', items: resSelection, selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'res2', items: resSelection, selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH rowSpan={2}>{renderSelect({ key: 'for', items: getMajors('제2외국어'), selectedSubject: selectedSubject })}</S.RegularTH>
                        </tr>
                        <tr>
                            <S.RegularTH>{renderSelect({ key: 'korSelect', items: getMajors('국어'), selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH>공통</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'matSelect', items: getMajors('수학'), selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH>공통</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'sub1', items: getMajors(selectedSubject.res1.code_nm), selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'sub2', items: getMajors(selectedSubject.res2.code_nm), selectedSubject: selectedSubject })}</S.RegularTH>
                        </tr>
                        <tr>
                            <S.RegularTD>{'원점수'}</S.RegularTD>
                            {Object.keys(score).map((key) => {
                                if (key === 'korSelect') {
                                    const optionSelected = selectedSubject.korSelect === '';

                                    return (
                                        <S.RegularTD key={key}>
                                            <S.RegularInput type='number' min={0} max={24} disabled={optionSelected || submit} id={key} value={score[key]} onChange={onScoreInputChange} placeholder='입력' />
                                        </S.RegularTD>
                                    );
                                } else if (key === 'matSelect') {
                                    const optionSelected = selectedSubject.matSelect === '';

                                    return (
                                        <S.RegularTD key={key}>
                                            <S.RegularInput type='number' min={0} max={26} disabled={optionSelected || submit} id={key} value={score[key]} onChange={onScoreInputChange} placeholder='입력' />
                                        </S.RegularTD>
                                    );
                                } else if (key === 'kor') {
                                    return (
                                        <S.RegularTD key={key}>
                                            <S.RegularInput type='number' min={0} max={76} disabled={submit} id={key} value={score[key]} onChange={onScoreInputChange} placeholder='입력' />
                                        </S.RegularTD>
                                    );
                                } else if (key === 'mat') {
                                    return (
                                        <S.RegularTD key={key}>
                                            <S.RegularInput type='number' min={0} max={74} disabled={submit} id={key} value={score[key]} onChange={onScoreInputChange} placeholder='입력' />
                                        </S.RegularTD>
                                    );
                                } else if (key === 'eng') {
                                    return (
                                        <S.RegularTD key={key}>
                                            <S.RegularInput type='number' min={0} max={100} disabled={submit} id={key} value={score[key]} onChange={onScoreInputChange} placeholder='입력' />
                                        </S.RegularTD>
                                    );
                                } else
                                    return (
                                        <S.RegularTD key={key}>
                                            <S.RegularInput type='number' min={0} max={50} disabled={submit} id={key} value={score[key]} onChange={onScoreInputChange} placeholder='입력' />
                                        </S.RegularTD>
                                    );
                            })}
                        </tr>
                        <tr>
                            <S.RegularTD>{'표준점수'}</S.RegularTD>
                            {renderStandardScore(review)}
                        </tr>
                        <tr>
                            <S.RegularTD>{'백분위'}</S.RegularTD>
                            {renderHundredScore(review)}
                        </tr>
                        <tr>
                            <S.RegularTD>{'등급'}</S.RegularTD>
                            {renderGrade(review)}
                        </tr>
                    </tbody>
                </S.RegularTable>
            </S.MoblieOverflowContainer>
            <Advice>{'원점수를 입력하시면 표준점수, 백분위, 등급이 자동으로 계산되어 보여집니다.'}</Advice>
            <S.RegularButtonContainer>
                <Button active={submit} onClick={onSubmitClick}>
                    {submit ? '수능 성적 수정하기' : '수능 성적 저장하기'}
                </Button>
            </S.RegularButtonContainer>
        </>
    );
};

const AfterTestTable = ({ subjects }) => {
    const [selectedSubject, setSelectedSubject] = useState({
        kor: '',
        mat: '',
        eng: { code_cd: '81', code_nm: '공통영어', lar_subject_cd: '8', lar_subject_nm: '영어' },
        his: { code_cd: '1G', code_nm: '한국사' },
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

    useEffect(() => {
        console.log('selectedSubject', selectedSubject);
    }, [selectedSubject]);

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
            .then((res) => {
                console.log('/api/csat/selectanalysis_1', res);

                if (res?.data?.data) {
                    setSubmit(true);
                    const mapSelectedSubject = (data) => {
                        return {
                            code_cd: data.subject_a,
                            code_nm: data.lar_subject_nm,
                            lar_subject_cd: data.lar_subject_cd,
                            lar_subject_nm: data.lar_subject_nm,
                        };
                    };

                    const formattedSubjects = res.data.data.map(mapSelectedSubject);

                    setSelectedSubject((prev) => {
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
                            }
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
            .catch((e) => {
                console.log(e);
            });
    };

    const _postSaveAfter = (query) => {
        console.log('after', selectedSubject);
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
                }
            )
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _postSaveScore = (query) => {
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
                }
            )
            .then((res) => {
                console.log(res);
            })
            .catch((e) => {
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
            .then((res) => {
                console.log('_8: ', res);
                setReview((prev) => ({
                    ...prev,
                    kor: res.data?.data?.find((score) => score.subject[0] === '6'),
                    mat: res.data?.data?.find((score) => score.subject[0] === '7'),
                    eng: res.data?.data?.find((score) => score.subject === '81'),
                    his: res.data?.data?.find((score) => score.subject === '1G'),
                    res1: res.data?.data?.find((score) => score.subject === subjects.sub1?.code_cd),
                    res2: res.data?.data?.find((score) => score.subject === subjects.sub2?.code_cd),
                    for: res.data?.data?.find((score) => score.subject === subjects.for?.code_cd),
                }));
                console.log('review save: ', {
                    kor: res.data?.data?.find((score) => score.subject[0] === '6'),
                    mat: res.data?.data?.find((score) => score.subject[0] === '7'),
                    eng: res.data?.data?.find((score) => score.subject === '81'),
                    his: res.data?.data?.find((score) => score.subject === '1G'),
                    res1: res.data?.data?.find((score) => score.subject === subjects.sub1.code_cd),
                    res2: res.data?.data?.find((score) => score.subject === subjects.sub2.code_cd),
                    for: res.data?.data?.find((score) => score.subject === subjects.for.code_cd),
                });
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const checkSubjectSelection = (score, callback) => {
        console.log(score.kor, score.korSelect);
        console.log(score.mat, score.matSelect);
        if (typeof score.kor !== typeof score.korSelect) {
            alert('국어 공통과목과 선택과목 모두 입력해주세요');
        } else if (typeof score.mat !== typeof score.matSelect) {
            alert('수학 공통과목과 선택과목 모두 입력해주세요');
        } else {
            callback();
        }
    };

    const onSubmitClick = (submit) => {
        if (!submit) {
        const selectedSubjects = Object.values(selectedSubject).filter((subject) => subject?.code_nm !== '사회탐구' && subject?.code_nm !== '과학탐구');
        const _score = Object.values(score);

        // _postSaveAfter(selectedSubjects.reduce(stringifyScores, '').slice(1));

        const stringifyReviewScores = (prev, curr, i) => {
            console.log(review);

            if (_score[i] === '' || _score[i] === undefined) {
                return prev;
            } else {
                let reviewScore;

                if (curr?.code_cd[0] === '6' || curr?.code_cd[0] === '7') {
                    reviewScore = Object.values(review).find((review) => review?.subject[0] === curr.code_cd[0]);
                } else {
                    reviewScore = Object.values(review).find((review) => review?.subject === curr.code_cd);
                }

                console.log('rs', reviewScore);
                if (reviewScore) {
                    return prev + `${curr.code_cd},,${reviewScore.standard_score || ''},${reviewScore.percentage_score || ''},${reviewScore.rating_score || ''}|`;
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
    }
    setSubmit((prev) => !prev);
    };

    const onScoreChange = (subjects, scores) => {
        const selectedSubjects = Object.values(subjects).filter((subject) => subject?.code_nm !== '사회탐구' && subject?.code_nm !== '과학탐구');
        const score = Object.values(scores);

        console.log(selectedSubjects);
        const stringifyScores = (prev, curr, i) => {
            if (score[i] === '' || score[i] === undefined) {
                return prev;
            } else if (curr?.lar_subject_cd === '6' || curr?.lar_subject_cd === '7' || curr?.lar_subject_cd === '1' || curr?.lar_subject_cd === '2') {
                return prev + `|${curr.code_cd},${score[i]},`;
            } else {
                return prev + `|${curr.code_cd},,${score[i]}`;
            }
        };

        _getScoreReview(selectedSubjects.reduce(stringifyScores, '').slice(1), subjects);
    };

    const getMajors = (subject) => {
        return subjects.filter((sub) => sub.lar_subject_nm === subject);
    };

    const renderSelect = ({ key, items, selectedSubject }) => {
        const onChange = ({ target }) => {
            const object = items.find((subject) => subject.code_cd === target.value);

            console.log(target.value, object, items);
            setSelectedSubject((prev) => {
                onScoreChange(
                    {
                        ...prev,
                        [key]: object,
                    },
                    score
                );

                return {
                    ...prev,
                    [key]: object,
                };
            });
        };

        const getPlaceholder = (key) => {
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
            <FormControl disabled={submit} style={{ width: '80%', backgroundColor: 'white', fontWeight: 'normal', fontSize: 12 }}>
                <Select id={key} style={{ fontWeight: 'normal', fontSize: 12, color: selectedSubject[key] === '' ? '#9a9a9a' : '#000000' }} value={selectedSubject[key]?.code_cd || ''} onChange={onChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem style={{ fontWeight: 'normal', fontSize: 12 }} value='' disabled>
                        {getPlaceholder(key)}
                    </MenuItem>
                    {items.map((item) => (
                        <MenuItem key={item.code_cd} value={item.code_cd}>
                            {item.code_nm}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };

    const onScoreInputChange = ({ target }) => {
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
        setScore((prev) => {
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

    const renderScore = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => (
            <S.RegularTD key={keys[index]} colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}>
                {value}
            </S.RegularTD>
        ));
    };

    const renderStandardScore = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => <S.RegularTD key={keys[index]}>{value?.standard_score}</S.RegularTD>);
    };

    const renderHundredScore = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => <S.RegularTD key={keys[index]}>{value?.percentage_score}</S.RegularTD>);
    };

    const renderGrade = (data) => {
        const keys = Object.keys(data);
        return Object.values(data).map((value, index) => <S.RegularTD key={keys[index]}>{value?.rating_score}</S.RegularTD>);
    };

    const onSelectBoxClick = (key, value) => {
        setSelectedSubject((prev) => ({
            ...prev,
            [key]: value,
        }));

        console.log(selectedSubject);
    };

    return (
        <>
            <S.MoblieOverflowContainer>
                <S.RegularTable>
                    <tbody>
                        <tr>
                            <S.RegularTH rowSpan={2}>{'구분'}</S.RegularTH>
                            <S.RegularTH>{'국어'}</S.RegularTH>
                            <S.RegularTH>{'수학'}</S.RegularTH>
                            <S.RegularTH rowSpan={2}>{'영어'}</S.RegularTH>
                            <S.RegularTH rowSpan={2}>{'한국사'}</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'res1', items: resSelection, selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'res2', items: resSelection, selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH rowSpan={2}>{renderSelect({ key: 'for', items: getMajors('제2외국어'), selectedSubject: selectedSubject })}</S.RegularTH>
                        </tr>
                        <tr>
                            <S.RegularTH>
                                <S.SelectBoxContainer>
                                    {getMajors('국어').map((subject) => (
                                        <S.SelectBox active={selectedSubject.kor.code_cd === subject.code_cd} onClick={() => onSelectBoxClick('kor', subject)}>
                                            {subject.code_nm}
                                        </S.SelectBox>
                                    ))}
                                </S.SelectBoxContainer>
                            </S.RegularTH>
                            <S.RegularTH>
                                <S.SelectBoxContainer>
                                    {getMajors('수학').map((subject) => (
                                        <S.SelectBox active={selectedSubject.mat.code_cd === subject.code_cd} onClick={() => onSelectBoxClick('mat', subject)}>
                                            {subject.code_nm}
                                        </S.SelectBox>
                                    ))}
                                </S.SelectBoxContainer>
                            </S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'sub1', items: getMajors(selectedSubject.res1.code_nm), selectedSubject: selectedSubject })}</S.RegularTH>
                            <S.RegularTH>{renderSelect({ key: 'sub2', items: getMajors(selectedSubject.res2.code_nm), selectedSubject: selectedSubject })}</S.RegularTH>
                        </tr>
                        <tr>
                            <S.RegularTD>{'표준점수'}</S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={100} disabled={selectedSubject.kor === '' || submit} id={'kor'} value={score['kor']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={100} disabled={selectedSubject.mat === '' || submit} id={'mat'} value={score['mat']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                            <S.RegularTD>{review.eng?.standard_score}</S.RegularTD>
                            <S.RegularTD>{review.his?.standard_score}</S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={50} disabled={selectedSubject.res1 === '' || submit} id={'res1'} value={score['res1']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={50} disabled={selectedSubject.res2 === '' || submit} id={'res2'} value={score['res2']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                            <S.RegularTD>{review.for?.standard_score}</S.RegularTD>
                        </tr>
                        <tr>
                            <S.RegularTD>{'백분위'}</S.RegularTD>
                            {renderHundredScore(review)}
                        </tr>
                        <tr>
                            <S.RegularTD>{'등급'}</S.RegularTD>
                            <S.RegularTD>{review.kor?.rating_score}</S.RegularTD>
                            <S.RegularTD>{review.mat?.rating_score}</S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={9} disabled={selectedSubject.eng === '' || submit} id={'eng'} value={score['eng']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={9} disabled={selectedSubject.his === '' || submit} id={'his'} value={score['his']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                            <S.RegularTD>{review.res1?.rating_score}</S.RegularTD>
                            <S.RegularTD>{review.res2?.rating_score}</S.RegularTD>
                            <S.RegularTD>
                                <S.RegularInput type='number' min={0} max={100} disabled={selectedSubject.for === '' || submit} id={'for'} value={score['for']} onChange={onScoreInputChange} placeholder='입력' />
                            </S.RegularTD>
                        </tr>
                    </tbody>
                </S.RegularTable>
            </S.MoblieOverflowContainer>
            <Advice>{'원점수를 입력하시면 표준점수, 백분위, 등급이 자동으로 계산되어 보여집니다.'}</Advice>
            <S.RegularButtonContainer>
                <Button active={submit} onClick={() => onSubmitClick(submit)}>
                    {submit ? '수능 성적 수정하기' : '수능 성적 저장하기'}
                </Button>
            </S.RegularButtonContainer>
        </>
    );
};

const GpaInput = ({ selectedGrade, firstScore, setFirstScore, secondScore, setSecondScore }) => {
    const [submit, setSubmit] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [majors, setMajors] = useState([]);

    useEffect(() => {
        _getGpaSubjects();
    }, []);

    useEffect(() => {
        _getMyGpa();
    }, [selectedGrade]);

    const _getMyGpa = () => {
        axios
            .get('/api/csat/selectgpa', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                console.log('/api/csat/selectgpa: ', res);
                if (res.data.data) {
                    setSubmit(true);
                    setFirstScore(res.data.data.filter((score) => score.semester === '1').filter((score) => score.grade === selectedGrade));
                    setSecondScore(res.data.data.filter((score) => score.semester === '2').filter((score) => score.grade === selectedGrade));
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _getGpaSubjects = () => {
        axios
            .get('/api/codes/curriculum_Code', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                console.log('/api/codes/curriculum_Code: ', res);
                setSubjects(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });

        axios
            .get('/api/codes/subject_Code', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                console.log('/api/codes/subject_Code: ', res);
                setMajors(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _postSaveScores = (score) => {
        axios
            .post(
                '/api/csat/savegpa',
                {
                    data: score,
                },
                {
                    headers: {
                        auth: localStorage.getItem('uid'),
                    },
                }
            )
            .then((res) => {
                console.log('/api/csat/savegpa', res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const renderSelect = ({ key, items, index, score, setScore }) => {
        const onChange = ({ target }) => {
            const newArr = score.concat();
            newArr[index] = {
                ...newArr[index],
                [key]: target.value,
            };
            setScore([...newArr]);
        };

        return (
            <FormControl disabled={submit} style={{ width: '80%', backgroundColor: 'white', fontWeight: 'normal', fontSize: 12 }}>
                <Select id={key} style={{ fontWeight: 'normal', color: score[index][key] === '' ? '#9a9a9a' : '#000000' }} value={score[index][key]} onChange={onChange} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
                    <MenuItem style={{ fontWeight: 'normal' }} value='' disabled>
                        {'-'}
                    </MenuItem>
                    {items?.map((item) => (
                        <MenuItem key={item.code} value={item.code}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        );
    };

    const onScoreInputChange = ({ target }, score, setScore, index) => {
        const newArr = score.concat();
        newArr[index] = {
            ...newArr[index],
            [target.id]: target.value,
        };
        setScore([...newArr]);
    };

    const renderScoreInput = (_, index, score, setScore) => (
        <tr key={`score ${index}`}>
            <S.GpaTH>{renderSelect({ key: 'subjectcode', items: subjects, index, score, setScore })}</S.GpaTH>
            <S.GpaTH>{renderSelect({ key: 'subjectarea', items: majors.filter((major) => major.code[0] === score[index].subjectcode[0]), index, score, setScore })}</S.GpaTH>
            <S.GpaTD>
                <S.RegularInput disabled={submit} id='unit' placeholder='입력' value={score[index].unit} onChange={(e) => onScoreInputChange(e, score, setScore, index)} />
            </S.GpaTD>
            <S.GpaTD>
                <S.RegularInput disabled={submit} id='rank' placeholder='입력' value={score[index].rank} onChange={(e) => onScoreInputChange(e, score, setScore, index)} />
            </S.GpaTD>
        </tr>
    );

    const onAddClick = (setScore, index) => {
        if (index === 0) {
            setScore([
                ...firstScore,
                {
                    subjectcode: '',
                    subjectarea: '',
                    unit: '',
                    rank: '',
                },
            ]);
        } else {
            setScore([
                ...secondScore,
                {
                    subjectcode: '',
                    subjectarea: '',
                    unit: '',
                    rank: '',
                },
            ]);
        }
    };

    const checkRowFilled = (scores) => {
        return !scores.some((score) => score.subjectcode === '' || score.subjectarea === '' || score.unit === '' || score.rank === '');
    };

    const onSubmitClick = () => {
        if (submit) {
            setSubmit((prev) => !prev);
            return;
        }

        console.log('checkRowFilled', checkRowFilled(firstScore));
        if (checkRowFilled(firstScore) && checkRowFilled(secondScore)) {
            const formatScore = (score, sem) => ({
                grade: selectedGrade,
                semester: sem,
                subjectarea: score.subjectarea,
                subjectcode: score.subjectcode,
                unit: score.unit,
                rank: score.rank,
            });

            const formattedFirstScore = firstScore.map((score) => formatScore(score, 1));
            const formattedSecondScore = secondScore.map((score) => formatScore(score, 2));

            console.log('concatted array', formattedFirstScore.concat(formattedSecondScore));
            _postSaveScores(formattedFirstScore.concat(formattedSecondScore));

            setSubmit((prev) => !prev);
        } else {
            alert('교과, 과목, 단위수, 석차등급을 모두 입력해주세요.');
        }
    };

    return (
        <>
            <S.ContentTitle>{'1학기'}</S.ContentTitle>
            <S.MoblieOverflowContainer>
                <S.GpaTable>
                    <colgroup>
                        <col width='30%' />
                        <col width='30%' />
                        <col width='auto' />
                        <col width='auto' />
                    </colgroup>
                    <thead>
                        <tr>
                            <S.GpaTH>{'교과'}</S.GpaTH>
                            <S.GpaTH>{'과목'}</S.GpaTH>
                            <S.GpaTH>{'단위수'}</S.GpaTH>
                            <S.GpaTH>{'석차등급'}</S.GpaTH>
                        </tr>
                    </thead>
                    <tbody>
                        {firstScore.map((_, index) => renderScoreInput(_, index, firstScore, setFirstScore))}
                        <UserAgent computer>
                            <tr>
                                <S.GpaTD colSpan='4'>
                                    <S.GpaAddButton onClick={() => onAddClick(setFirstScore, 0)}>{'과목 추가하기'}</S.GpaAddButton>
                                </S.GpaTD>
                            </tr>
                        </UserAgent>
                    </tbody>
                </S.GpaTable>
            </S.MoblieOverflowContainer>
            <UserAgent mobile>
                <S.MoblieAddButtonLayout>
                    <S.GpaAddButton onClick={() => onAddClick(setFirstScore, 0)}>{'과목 추가하기'}</S.GpaAddButton>
                </S.MoblieAddButtonLayout>
            </UserAgent>

            <S.ContentTitle style={{ marginTop: 24 }}>{'2학기'}</S.ContentTitle>
            <S.MoblieOverflowContainer>
                <S.GpaTable>
                    <colgroup>
                        <col width='30%' />
                        <col width='30%' />
                        <col width='auto' />
                        <col width='auto' />
                    </colgroup>
                    <thead>
                        <tr>
                            <S.GpaTH>{'교과'}</S.GpaTH>
                            <S.GpaTH>{'과목'}</S.GpaTH>
                            <S.GpaTH>{'단위수'}</S.GpaTH>
                            <S.GpaTH>{'석차등급'}</S.GpaTH>
                        </tr>
                    </thead>
                    <tbody>
                        {secondScore.map((_, index) => renderScoreInput(_, index, secondScore, setSecondScore))}
                        <UserAgent computer>
                            <tr>
                                <S.GpaTD colSpan='4'>
                                    <S.GpaAddButton onClick={() => onAddClick(setSecondScore, 1)}>{'과목 추가하기'}</S.GpaAddButton>
                                </S.GpaTD>
                            </tr>
                        </UserAgent>
                    </tbody>
                </S.GpaTable>
            </S.MoblieOverflowContainer>
            <UserAgent mobile>
                <S.MoblieAddButtonLayout style={{ marginBottom: 16 }}>
                    <S.GpaAddButton onClick={() => onAddClick(setSecondScore, 1)}>{'과목 추가하기'}</S.GpaAddButton>
                </S.MoblieAddButtonLayout>
            </UserAgent>
            <S.RegularButtonContainer>
                <Button active={submit} onClick={onSubmitClick}>
                    {submit ? '내신 성적 수정하기' : '내신 성적 저장하기'}
                </Button>
            </S.RegularButtonContainer>
        </>
    );
};

export default ScoreInput;
