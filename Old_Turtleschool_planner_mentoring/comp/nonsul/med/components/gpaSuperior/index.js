import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

// custom components
import Button from '../../../Button';

const cx = classNames.bind(styles);

const GpaSuperior = ({firstSciUnivCode, secondSciUnivCode, gpaUnivCode, addUnivCodes, deleteUnivCodes }) => {
    const request = useRef(axios.CancelToken.source());
    const [gpaScore, setGpaScore] = useState(0);
    const [univ, setUniv] = useState([]);

    useEffect(() => {
        _getUniv();
        return () => {
            request.current?.cancel();
        };
    }, []);

    const _getUniv = () => {
        const query = {
            univers: [...firstSciUnivCode, ...secondSciUnivCode].join('|'),
            grade: Math.floor(gpaScore),
        };

        axios
            .get('/api/essay/tab_6', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                cancelToken: request.current?.token,
            })
            .then((res) => {
                const formatData = (score, diff) => {
                    const labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
                    const obj = {
                        name: score.name,
                        universityid: score.universityid,
                        score: labels.map((label) => score[label]),
                        diff: labels.map((label) => diff[label]),
                        rrank: score.rrank,
                    };
                    return obj;
                };
                const arr = res.data.data;
                const newArr = [];

                arr.reduce((prev, curr, index) => {
                    if (index % 2 === 1) {
                        newArr.push(formatData(prev, curr));
                    }
                    return curr;
                });
                setUniv(newArr);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onScoreChange = (e) => {
        setGpaScore(Math.floor(e.target.value));
    };

    const onSubmitClick = () => {
        _getUniv();
    };

    const onUnivClick = ({ target }) => {
        if (target.checked) {
            addUnivCodes('gpa', [target.id]);
        } else {
            deleteUnivCodes('gpa', [target.id]);
        }
    };

    const selectAllUniv = () => {
        addUnivCodes(
            'gpa',
            univ.map((univ) => univ.universityid)
        );
    };

    const renderUnivItem = (univ) => [
        <tr key={univ.universityid + '_original_score'} className={cx('t_bt', 't_br', 't_bb', 't_bl')}>
            <td rowSpan='2'>{univ.name}</td>
            <td className={cx('t_bg')}>점수</td>
            {univ.score.map((value, index) => (
                <td key={'score_'+index} className={cx({ b_skyblue: gpaScore === index + 1 })}>{value}</td>
            ))}
            <td rowSpan='2' className={cx('checkbox')}>
                <input checked={gpaUnivCode.includes(String(univ.universityid))} type='checkbox' id={univ.universityid} name='선택' onChange={onUnivClick} />
                <label htmlFor={univ.universityid}></label>
            </td>
        </tr>,
        <tr key={univ.universityid + 'diff'} className={cx('t_bt', 't_br', 't_bb', 't_bl')}>
            <td className={cx('t_bg')}>앞등급과의 차이</td>
            {univ.diff.map((value, index) => (
                <td key={'grade_'+index} className={cx({ b_skyblue: gpaScore === index + 1 })}>{value}</td>
            ))}
        </tr>,
    ];

    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('advice')}>
                        * 논술전형에서 내신의 영향력은 크지 않지만, 본인 내신등급에 유리한 대학은 따로 있습니다. <br></br>* 표에서 보이는 대학 순서는, 각 대학별 내신 기준표를 가장 일반적인 내신 총점인 300점 만점 <br></br>
                        으로 통일하여, 본인 내신 등급에 유리한 순으로 나열한 것입니다(특허출원)<br></br>* 상위에 랭크된 대학일수록 조금이라도 유리합니다.
                    </div>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row1')}>
                            <p className={cx('discuss_tit2')}>내신 점수 입력</p>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('input_container')}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'space-between' }}>
                                    <div className={cx('score_title')}>내신 등급 평균 (국, 영, 수, 탐 기준)</div>
                                    <label htmlFor='num'></label> <input className={cx('score_input')} type='text' id='num' placeholder='등급을 입력 하세요' onChange={onScoreChange} />
                                </div>
                                <button onClick={onSubmitClick} className={cx('c_white', 'b_orange')}>
                                    유리한 대학 보기
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('discuss_col1', 'section2')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                유리한 대학 순
                            </p>
                            <button className={styles.select_all} onClick={selectAllUniv}>
                                모두 선택
                            </button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table2')}>
                                        <colgroup>
                                            <col width='11%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                            <col width='8.3333%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>구분</th>
                                                {Array.from({ length: 9 }, (_, i) => i + 1).map((index) => (
                                                    <th key={`${index}등급`} className={cx({ b_skyblue: gpaScore === index })}>{`${index}등급`}</th>
                                                ))}
                                                <th>선택</th>
                                            </tr>
                                            {univ.map(renderUnivItem)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GpaSuperior;
