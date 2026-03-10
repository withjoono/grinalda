import React from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const MajorSelection = () => {
    const renderUnivItem = () => {
        return (
            <div className={cx('discuss_row2')}>
                <div className={cx('t_box', 't_bs')}>
                    <table className={cx('discuss_table1')}>
                        <colgroup>
                            <col width='25%;' />
                            <col width='55%;' />
                            <col width='20%;' />
                        </colgroup>
                        <tbody>
                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                <th>대학명</th>
                                <th>학과</th>
                                <th>논술 과목</th>
                            </tr>
                            <tr className={cx('t_br', 't_bb', 't_bl')}>
                                <td rowSpan='3'>서울여대</td>
                                <td>의류학과(이과)</td>
                                <td className={cx('checkbox')}>
                                    <input type='checkbox' id='check1' name='선택' />
                                    <label htmlFor='check1'></label>
                                </td>
                            </tr>
                            <tr className={cx('t_br', 't_bb', 't_bl')}>
                                <td>의류학과(이과)</td>
                                <td className={cx('checkbox')}>
                                    <input type='checkbox' id='check2' name='선택' />
                                    <label htmlFor='check2'></label>
                                </td>
                            </tr>
                            <tr className={cx('t_br', 't_bb', 't_bl')}>
                                <td>의류학과(이과)</td>
                                <td className={cx('checkbox')}>
                                    <input type='checkbox' id='check3' name='선택' />
                                    <label htmlFor='check3'></label>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                <p className={cx('discuss_tit2')}>학과 선택</p>
                    <div className={cx('discuss_col2', 'section1')}>
                        <div className={cx('discuss_col1')}>
                            {renderUnivItem()}
                            {renderUnivItem()}
                        </div>
                        <div className={cx('discuss_col1')}>
                            {renderUnivItem()}
                            {renderUnivItem()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MajorSelection;
