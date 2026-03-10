import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import styles from './index.module.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import * as Annotation from 'chartjs-plugin-annotation';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

// custom components
import Advice from '../../../Advice';

const ScoreInput = ({ selectedUnivCode, addUnivCodes, deleteUnivCodes, userGrade, setUserGrade, userScore, setUserScore }) => {
    const request = useRef(axios.CancelToken.source());
    const [suggestedUniv, setSuggestedUniv] = useState([]);
    const [avoidUniv, setAvoidUniv] = useState([]);
    const [chartData, setChartData] = useState();

    useEffect(() => {
        _getUnivSuggestion();
        return () => {
            request.current?.cancel();
        };
    }, []);

    const _getUnivSuggestion = () => {
        const date = new Date();
        const query = {
            kor: 0,
            eng: 0,
            mat1: 0,
            mat2: 0,
            soc1: 0,
            soc2: 0,
            sci1: 0,
            sci2: 0,
            khistory: 0,
            division: 2,
            year: date.getFullYear() + 1,
            month: 9,
            ...userScore,
        };

        axios
            .get('/api/essay/essayscore', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                cancelToken: request.current?.token,
            })
            .then((res) => {
                const arr = res.data.data;

                console.log(res);
                // 차트용 데이터 가공
                setChartData((prev) => {
                    const labels = arr.map((univ) => univ.name);
                    const data = arr.map((univ) => [univ.highscore, univ.lowscore]);
                    return {
                        labels,
                        datasets: [
                            {
                                data,
                                backgroundColor: 'rgba(106, 170, 198, 0.7)',
                                maxBarThickness: 25,
                            },
                        ],
                    };
                });

                // 추천 대학 선별
                const [pass, fail] = arr.reduce(([p, f], univ) => (Number(univ.pass_result) ? [[...p, univ], f] : [p, [...f, univ]]), [[], []]);
                setSuggestedUniv(pass);
                setAvoidUniv(fail);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onGradeChange = ({ target }) => {
        setUserGrade((prev) => ({
            ...prev,
            [target.name]: target.value,
        }));
    };

    const onScoreChange = ({ target }) => {
        setUserScore((prev) => ({
            ...prev,
            [target.name]: Math.min(Math.max(parseInt(target.value), 0), 100),
        }));
    };

    const onUnivClick = ({ target }) => {
        if (target.checked) {
            addUnivCodes('select', [target.id]);
        } else {
            deleteUnivCodes('select', [target.id]);
        }
    };

    const getGradeAverage = useMemo(() => {
        return Object.values(userGrade).reduce((prev, curr, index) => (index > 2 ? prev + curr / 2 : prev + curr)) / 4;
    }, [userGrade]);

    const getScoreSum = useMemo(() => {
        // 영어는 절대평가, 백분위합계에 포함하지 않음
        return userScore.kor + userScore.mat1 + userScore.sci1 / 2 + userScore.sci2 / 2;
    }, [userScore]);

    const clearInput = (e) => {
        e.target.value = '';
    };

    const selectAllSuggestedUnivs = () => {
        addUnivCodes(
            'select',
            suggestedUniv.map((univ) => univ.university)
        );
    };

    const selectAllAvoidUnivs = () => {
        addUnivCodes(
            'select',
            avoidUniv.map((univ) => univ.university)
        );
    };

    const renderGradeInput = (key) => (
        <td key={key} className={styles.grade_selection}>
            <Select
                name={key}
                value={userGrade[key]}
                onChange={onGradeChange}
                displayEmpty
                style={{
                    width: 80,
                    textAlign: 'center',
                }}
                inputProps={{ 'aria-label': 'Without label' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((grade) => (
                    <MenuItem key={grade} value={grade}>
                        {grade}
                    </MenuItem>
                ))}
            </Select>
        </td>
    );

    const renderScoreInput = (key) => <td key={key}>{key === 'eng' ? '-' : <input name={key} type='number' min={0} max={100} onFocus={clearInput} value={userScore[key]} onChange={onScoreChange} placeholder='점수' className={styles.b_gray_05} />}</td>;

    const renderUnivItem = (
        univ // input id unique 줘야 개별 가능.
    ) => (
        <tr key={univ.name + univ.lowscore + univ.highscore} className={[styles.t_br, styles.t_bb, styles.t_bl].join(' ')}>
            <td>{univ.name}</td>
            <td>{univ.lowscore}</td>
            <td>{univ.highscore}</td>
            <td className={styles.checkbox}>
                <input checked={selectedUnivCode.includes(String(univ.university))} type='checkbox' id={univ.university} name='선택' onChange={onUnivClick} />
                <label htmlFor={univ.university}></label>
            </td>
        </tr>
    );

    const renderSuggestedUniv = useMemo(() => suggestedUniv.map((univ) => renderUnivItem(univ)), [suggestedUniv, selectedUnivCode]);
    const renderAvoidUniv = useMemo(() => avoidUniv.map((univ) => renderUnivItem(univ)), [avoidUniv, selectedUnivCode]);

    return (
        <div id={styles.contents}>
            <div id={styles.discuss}>
                <div id={styles.discuss_contents}>
                    <div className={styles.advice}>
                        * 9월 모평 등급과 백분위 점수를 넣어주세요 <br></br>* 본인 성적보다 낮은 대학은 비추천으로 분류되며, 선택을 안 하시면 다음 단계 이후로 배제됩니다.
                    </div>
                    <div className={[styles.discuss_col1, styles.section1].join(' ')}>
                        <div className={styles.discuss_row2}>
                            <p style={{ display: 'inline-block' }} className={styles.discuss_tit2}>
                                9월 모평 등급 입력
                            </p>
                            <Link href='/mockup/inputchoice'>
                                <a className={styles.calcScore} target='_blank'>
                                    백분위 산출 바로가기
                                </a>
                            </Link>
                            <div className={styles.input_container}>
                                <table className={styles.discuss_table1}>
                                    <colgroup>
                                        <col width='14%;' />
                                        <col width='14%;' />
                                        <col width='14%;' />
                                        <col width='14%;' />
                                        <col width='14%;' />
                                        <col width='14%;' />
                                        <col width='18%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb].join(' ')}>
                                            <th>과목</th>
                                            <td>국어</td>
                                            <td>영어</td>
                                            <td>수학</td>
                                            <td>탐구1</td>
                                            <td>탐구2</td>
                                            <td>등급평균/백분위합계</td>
                                        </tr>
                                        <tr className={[styles.t_br, styles.t_bb].join(' ')}>
                                            <th className={styles.t_bg}>등급</th>
                                            {Object.keys(userGrade).map((key) => renderGradeInput(key))}
                                            <td>
                                                <span>{getGradeAverage}</span>
                                            </td>
                                        </tr>
                                        <tr className={[styles.t_br, styles.t_bb].join(' ')}>
                                            <th className={styles.t_bg}>백분위</th>
                                            {Object.keys(userScore).map((key) => renderScoreInput(key))}
                                            <td>
                                                <span>{getScoreSum || '점수'}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={styles.submit_container}>
                                <button className={styles.submit} onClick={_getUnivSuggestion}>
                                    확인하기
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={[styles.discuss_col1, styles.section2].join(' ')}>
                        <div className={styles.discuss_row2}>
                            <p className={styles.discuss_tit2}>대학별 정시 성적 및 내 성적</p>
                            <div className={[styles.t_box, styles.t_bs, styles.discuss_table3].join(' ')}>
                                <div className={styles.line}></div>
                                {chartData && (
                                    <div style={{ width: chartData.labels.length * 90, paddingTop: 10, paddingRight: 30 }}>
                                        <Bar
                                            plugins={[Annotation]}
                                            data={chartData}
                                            width={chartData.labels.length * 90}
                                            height={300}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                legend: { display: false },
                                                scales: {
                                                    xAxes: [
                                                        {
                                                            ticks: {
                                                                fontSize: 14.5,
                                                                fontColor: 'black',
                                                                fontStyle: 'bold',
                                                            },
                                                        },
                                                    ],
                                                    yAxes: [
                                                        {
                                                            ticks: {
                                                                fontSize: 13,
                                                            },
                                                        },
                                                    ],
                                                },
                                                annotation: {
                                                    annotations: [
                                                        {
                                                            type: 'line',
                                                            mode: 'horizontal',
                                                            scaleID: 'y-axis-0',
                                                            borderColor: 'rgb(255, 0, 0)',
                                                            value: getScoreSum,
                                                        },
                                                    ],
                                                },
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={[styles.discuss_col2, styles.section3].join(' ')}>
                        <div className={styles.discuss_row2}>
                            <div>
                                <p style={{ display: 'inline-block' }} className={styles.discuss_tit2}>
                                    추천 대학
                                </p>
                                <button className={styles.select_all} onClick={selectAllSuggestedUnivs}>
                                    모두 선택
                                </button>
                            </div>
                            <div className={[styles.t_box, styles.t_bs].join(' ')}>
                                <table className={styles.discuss_table1}>
                                    <colgroup>
                                        <col width='25%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb, styles.t_bl].join(' ')}>
                                            <th rowSpan='2'>대학명</th>
                                            <th colSpan='2'>백분위합계</th>
                                            <th rowSpan='2'>선택</th>
                                        </tr>
                                        <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb].join(' ')}>
                                            <th>최저</th>
                                            <th>최고</th>
                                        </tr>
                                        {renderSuggestedUniv}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className={styles.discuss_row2}>
                            <p style={{ display: 'inline-block' }} className={styles.discuss_tit2}>
                                비추천 대학
                            </p>
                            <button className={styles.select_all} onClick={selectAllAvoidUnivs}>
                                모두 선택
                            </button>
                            <div className={[styles.t_box, styles.t_bs].join(' ')}>
                                <table className={styles.discuss_table1}>
                                    <colgroup>
                                        <col width='25%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb, styles.t_bl].join(' ')}>
                                            <th rowSpan='2'>대학명</th>
                                            <th colSpan='2'>백분위합계</th>
                                            <th rowSpan='2'>선택</th>
                                        </tr>
                                        <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb].join(' ')}>
                                            <th>최저</th>
                                            <th>최고</th>
                                        </tr>
                                        {renderAvoidUniv}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreInput;
