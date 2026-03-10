import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const DateSelection = ({ finalUnivCode, finalUnivs, addUnivCodes, deleteUnivCodes }) => {
    const [univ, setUniv] = useState(() => finalUnivs);

    useEffect(() => {
        deleteUnivCodes('final', finalUnivCode);
        console.log(univ);
    }, []);

    const onUnivClick = ({ target }, item) => {
        if (target.checked) {
            addUnivCodes('final', [target.id], item);
        } else {
            deleteUnivCodes('final', [target.id]);
        }
    };

    const renderUnivItem = (univ) => (
        <tr key={univ.universityid + ',' + univ.departmentid} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.universitynm}</td>
            <td>{univ.departmentnm}</td>
            <td>{univ.recruitdate}</td>
            <td>{univ.rmk}</td>
            <td className={cx('checkbox')}>
                <input checked={finalUnivCode.includes(univ.universityid + ',' + univ.departmentid)} type='checkbox' id={univ.universityid + ',' + univ.departmentid} name='선택' onChange={(e) => onUnivClick(e, univ)} />
                <label htmlFor={univ.universityid + ',' + univ.departmentid}></label>
            </td>
        </tr>
    );

    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row2')}>
                            <p className={cx('discuss_tit2')}>전형 날짜/시간 파악</p>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table1')}>
                                        <colgroup>
                                            <col width='20%;' />
                                            <col width='20%;' />
                                            <col width='20%;' />
                                            <col width='20%;' />
                                            <col width='20%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>학과</th>
                                                <th>전형일</th>
                                                <th>시험 시각</th>
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

export default DateSelection;
