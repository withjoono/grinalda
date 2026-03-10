import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

const cx = classNames.bind(styles);

const FinalDecision = ({ finalUnivs }) => {
    const [univ, setUniv] = useState(finalUnivs);

    const deleteUniv = ({ target }) => {
        const [id, name] = target.id.split('|');
        setUniv((prev) => {
            return [...prev.filter((value) => !(value.universityid === id && value.departmentnm === name))];
        });
    };

    const _saveResult = () => {
        axios
            .post('/api/essay/tab_save', { data: univ === null ? null : univ.map(univ => ({...univ, division: 0})) },
            { headers: { auth: localStorage.getItem('uid') }, }
                // cancelToken: request.current?.token,
            )
            .then((res) => {
                console.log('save lib' ,res)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const renderUnivItem = (univ, index) => {
        return (
            <tr key={`${univ.universityid},${index}`} className={cx('t_br', 't_bb', 't_bl')}>
                <td>{univ.universitynm}</td>
                <td>{univ.departmentnm}</td>
                <td>{univ.recruitdate}</td>
                <td>{univ.rmk}</td>
                <td>{univ.rmk1}</td>
                <td className={cx('c_gray_02')}>
                    <button id={univ.universityid + '|' + univ.departmentnm} onClick={deleteUniv}>
                        삭제
                    </button>
                </td>
            </tr>
        );
    };
    
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('advice')}>
                            * 지금까지 선택한 대학/학과를 전형 일자/시간이 겹치지 않도록, 전형일 순으로 나열했습니다. <br></br>* 최저요건, 전형일 등을 다시 한번 꼼꼼히 확인하시고, 최적의 조합이 나올 때까지 이전단계로 돌아가서 반복 해주세요.
                        </div>
                        <div className={cx('discuss_row2')}>
                            <div style={{display: 'flex', flexDirection: "row", justifyContent: "space-between"}}>
                            <p className={cx('discuss_tit2')}>최종 결정</p>
                            <button onClick={_saveResult} className={cx('button_save')}>저장하기</button>
                            </div>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table1')}>
                                        <colgroup>
                                            <col width='17%;' />
                                            <col width='17%;' />
                                            <col width='12.5%;' />
                                            <col width='15%;' />
                                            <col width='auto;' />
                                            <col width='10%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>학과</th>
                                                <th>전형일</th>
                                                <th>시험 시각</th>
                                                <th>최저</th>
                                                <th>삭제</th>
                                            </tr>
                                            {univ === null ? null : univ.map(renderUnivItem)}
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

export default FinalDecision;
