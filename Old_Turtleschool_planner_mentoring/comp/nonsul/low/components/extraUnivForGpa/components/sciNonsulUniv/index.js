import React from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const SciNonsulUniv = () => {
    const renderUnivItem = () => {
        return (
            <>
                <tr className={cx('t_br', 't_bb', 't_bl')}>
                    <td>서울과학기술대</td>
                    <td>100분</td>
                    <td>언어논술</td>
                    <td>없음</td>
                    <td className={cx('checkbox')}>
                        <input type='checkbox' id='check1' name='선택' />
                        <label htmlFor='check1'></label>
                    </td>
                </tr>
                <tr className={cx('t_br', 't_bb', 't_bl')}>
                    <td>서울과학기술대</td>
                    <td>100분</td>
                    <td>언어논술</td>
                    <td>없음</td>
                    <td className={cx('checkbox')}>
                        <input type='checkbox' id='check1' name='선택' />
                        <label htmlFor='check1'></label>
                    </td>
                </tr>
            </>
        );
    };
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section2')}>
                        <div className={cx('discuss_row2')}>
                            <p className={cx('discuss_tit2')}>최저 부합 대학</p>
                            <div className={cx('t_box', 't_bs')}>
                                <table className={cx('discuss_table2')}>
                                    <colgroup>
                                        <col width='20%;' />
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='43%' />
                                        <col width='7%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>대학명</th>
                                            <th>고사시간</th>
                                            <th>과목</th>
                                            <th>최저</th>
                                            <th>선택</th>
                                        </tr>
                                        {renderUnivItem()}
                                        {renderUnivItem()}
                                        {renderUnivItem()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className={cx('discuss_col1', 'section4')}>
                        <div className={cx('discuss_row2')}>
                            <p className={cx('discuss_tit2')}>최저 결격 대학</p>
                            <div className={cx('t_box', 't_bs')}>
                                <table className={cx('discuss_table2')}>
                                    <colgroup>
                                        <col width='20%;' />
                                        <col width='15%;' />
                                        <col width='15%;' />
                                        <col width='43%' />
                                        <col width='7%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>대학명</th>
                                            <th>고사시간</th>
                                            <th>과목</th>
                                            <th>최저</th>
                                            <th>선택</th>
                                        </tr>
                                        {renderUnivItem()}
                                        {renderUnivItem()}
                                        {renderUnivItem()}
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

export default SciNonsulUniv;
