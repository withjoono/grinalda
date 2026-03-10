import React from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const LowUniv = () => {
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row3')}>
                            <p className={cx('discuss_tit2')}>약식 논술 대학</p>
                            <div className={cx('description')}>
                                1. 이과도 문과 수학 범위 - 수학1 + 수학2<br></br>
                                2. 문이과 교차지원 가능<br></br>
                                3. 최저 없음<br></br>
                                4. 출제경향 : EBS에서 100% 출제<br></br>
                                5. 출제과목 : 단답형 국어 + 단답형 수학
                            </div>
                            <div className={cx('t_box', 't_bs')}>
                                <table className={cx('discuss_table1')}>
                                    <colgroup>
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='auto;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>대학명</th>
                                            <th>계열</th>
                                            <th>국어 문항수</th>
                                            <th>수학 문항수</th>
                                            <th>시간</th>
                                            <th>최저</th>
                                            <th>선택</th>
                                        </tr>
                                        <tr className={cx('t_br', 't_bb', 't_bl')}>
                                            <td rowSpan='2'>가천대</td>
                                            <td>문과</td>
                                            <td>9</td>
                                            <td>6</td>
                                            <td>120분</td>
                                            <td>없음</td>
                                            <td className={cx('checkbox')}>
                                                <input type='checkbox' id='check1' name='선택' />
                                                <label htmlFor='check1'></label>
                                            </td>
                                        </tr>
                                        <tr className={cx('t_br', 't_bb', 't_bl')}>
                                            <td>이과</td>
                                            <td>6</td>
                                            <td>9</td>
                                            <td>120분</td>
                                            <td>없음</td>
                                            <td className={cx('checkbox')}>
                                                <input type='checkbox' id='check1' name='선택' />
                                                <label htmlFor='check1'></label>
                                            </td>
                                        </tr>
                                        <tr className={cx('t_br', 't_bb', 't_bl')}>
                                            <td>서울과학기술대</td>
                                            <td>문과</td>
                                            <td>9</td>
                                            <td>6</td>
                                            <td>120분</td>
                                            <td>없음</td>
                                            <td className={cx('checkbox')}>
                                                <input type='checkbox' id='check1' name='선택' />
                                                <label htmlFor='check1'></label>
                                            </td>
                                        </tr>
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

export default LowUniv;
