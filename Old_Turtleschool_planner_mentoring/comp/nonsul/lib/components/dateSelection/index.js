import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

const cx = classNames.bind(styles);

const DateSelection = ({ selectedUnivCode, firstSciUnivCode, secondSciUnivCode, gpaUnivCode, finalUnivCode, addUnivCodes, deleteUnivCodes }) => {
    const request = useRef(axios.CancelToken.source());
    const [univ, setUniv] = useState([]);

    useEffect(() => {
        _getUniv();
    }, []);

    const _getUniv = () => {
        const date = new Date();
        const query = {
            year: date.getFullYear() + 1,
            lar_cd: 0,
            universa: selectedUnivCode.join('|'),
            universb: firstSciUnivCode.join('|'),
            universc: secondSciUnivCode.join('|'),
            universd: gpaUnivCode.join('|'),
        };

        axios
            .get('/api/essay/tab_7', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                cancelToken: request.current?.token,
            })
            .then((res) => {
                setUniv(res.data.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onUnivClick = ({ target }, item) => {
        if (target.checked) {
            addUnivCodes('final', [target.id], item);
        } else {
            deleteUnivCodes('final', [target.id]);
        }
    };

    const renderUnivItem = (univ, index) => (
        <tr key={`${univ.universityid},${index}`} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.universitynm}</td>
            <td>{univ.departmentnm}</td>
            <td>{univ.recruitdate}</td>
            <td>{univ.rmk}</td>
            <td className={cx('checkbox')}>
                <input checked={finalUnivCode.includes(`${univ.universityid},${index}`)} type='checkbox' id={`${univ.universityid},${index}`} name='선택' onChange={(e) => onUnivClick(e, univ)} />
                <label htmlFor={`${univ.universityid},${index}`}></label>
            </td>
        </tr>
    );
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                전형 날짜/시간 파악
                            </p>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table1')}>
                                        <colgroup>
                                            <col width='20%;' />
                                            <col width='auto;' />
                                            <col width='16%;' />
                                            <col width='16%;' />
                                            <col width='10%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>학과</th>
                                                <th>전형일</th>
                                                <th>시험 시각</th>
                                                <th>선택</th>
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

export default DateSelection;
