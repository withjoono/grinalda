import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

// custom components
import Advice from '../../../Advice';

const cx = classNames.bind(styles);

const AvailableMathSubject = ({ selectedUnivCode, firstSciUnivCode, addUnivCodes, deleteUnivCodes }) => {
    const request = useRef(axios.CancelToken.source());
    const [filter, setFilter] = useState({
        math: false,
        statistics: false,
        algebra: false,
        geometry: false,
    });
    const [availableUniv, setAvailableUniv] = useState([]);
    const [notAvailableUniv, setNotAvailableUniv] = useState([]);

    useEffect(() => {
        _getUniv();
        return () => {
            request.current?.cancel();
        };
    }, []);

    const _getUniv = () => {
        const date = new Date();
        const query = {
            math: filter.math ? 2 : 1,
            mathp: filter.statistics ? 2 : 1,
            mathd: filter.algebra ? 2 : 1,
            mathg: filter.geometry ? 2 : 1,
            scncc: 1,
            scncpa: 1,
            scncca: 1,
            scncba: 1,
            scncea: 1,
            scncpb: 1,
            scnccb: 1,
            snccbb: 1,
            scnceb: 1,
            division: 1,
            year: date.getFullYear() + 1,
            univers: selectedUnivCode.map((code) => code.split(',')[0]).join('|'),
            gubu: 0,
        };
        axios
            .get('/api/essay/tab_34', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                cancelToken: request.current?.token,
            })
            .then((res) => {
                console.log('availMath', res);
                const arr = res.data.data;
                const [pass, fail] = arr.reduce(([p, f], univ) => (univ.gubu === '1' ? [[...p, univ], f] : [p, [...f, univ]]), [[], []]);
                setAvailableUniv(pass);
                setNotAvailableUniv(fail);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const onFilterClick = ({ target }) => {
        setFilter((prev) => ({
            ...prev,
            [target.name]: !prev[target.name],
        }));
    };

    const renderUnivItem = (univ) => (
        <tr key={univ.university} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.name}</td>
            <td>{univ.subject}</td>
            <td>{univ.mathc}</td>
            <td>{univ.math}</td>
            <td>{univ.mathp}</td>
            <td>{univ.mathd}</td>
            <td>{univ.mathg}</td>
            <td className={cx('checkbox')}>
                <input checked={firstSciUnivCode.includes(univ.university)} type='checkbox' id={univ.university} name='선택' onChange={onUnivClick} />
                <label htmlFor={univ.university}></label>
            </td>
        </tr>
    );

    const onUnivClick = ({ target }) => {
        if (target.checked) {
            addUnivCodes('firstSci', [target.id]);
        } else {
            deleteUnivCodes('firstSci', [target.id]);
        }
    };

    const selectAllSuggestedUnivs = () => {
        addUnivCodes(
            'firstSci',
            availableUniv.map((univ) => univ.university)
        );
    };

    const selectAllAvoidUnivs = () => {
        addUnivCodes(
            'firstSci',
            notAvailableUniv.map((univ) => univ.university)
        );
    };

    const onSubmitClick = () => {
        _getUniv();
    };

    return (
        <div id={styles.contents}>
            <div id={styles.discuss}>
                <div id={styles.discuss_contents}>
                    <Advice>
                        * 수리논술 출제 범위가 대학별로 상이합니다. <br></br>* 본인이 가능한 수학 과목을 선택해주세요.
                    </Advice>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row1')}>
                            <table className={cx('discuss_table1')}>
                                <colgroup>
                                    <col width='30%;' />
                                    <col width='auto;' />
                                </colgroup>
                                <tbody>
                                    <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                        <th colSpan='3'>수학 가능 과목 선택</th>
                                    </tr>
                                    <tr className={cx('t_bb')}>
                                        <td className={cx('filter_container')}>
                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                <button name={Object.keys(filter)[0]} onClick={onFilterClick} className={cx('check', filter.math ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                    수1,수2
                                                </button>
                                                <button name={Object.keys(filter)[1]} onClick={onFilterClick} className={cx('check', filter.statistics ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                    확통
                                                </button>
                                                <button name={Object.keys(filter)[2]} onClick={onFilterClick} className={cx('check', filter.algebra ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                    미적
                                                </button>
                                                <button name={Object.keys(filter)[3]} onClick={onFilterClick} className={cx('check', filter.geometry ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                    기하
                                                </button>
                                            </div>
                                            <button onClick={onSubmitClick} className={cx('c_white', 'b_orange')}>
                                                해당 대학 검색
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={cx('discuss_col1', 'section2')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                추천 대학
                            </p>
                            <button className={styles.select_all} onClick={selectAllSuggestedUnivs}>
                                모두 선택
                            </button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table2')}>
                                        <colgroup>
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>과목</th>
                                                <th>공통수학</th>
                                                <th>수1+수2</th>
                                                <th>확통</th>
                                                <th>미적</th>
                                                <th>기하</th>
                                                <th>선택</th>
                                            </tr>
                                            {availableUniv.map(renderUnivItem)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('discuss_col1', 'section3')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                비추천 대학
                            </p>
                            <button className={styles.select_all} onClick={selectAllAvoidUnivs}>
                                모두 선택
                            </button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table2')}>
                                        <colgroup>
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>과목</th>
                                                <th>공통수학</th>
                                                <th>수1+수2</th>
                                                <th>확통</th>
                                                <th>미적</th>
                                                <th>기하</th>
                                                <th>선택</th>
                                            </tr>
                                            {notAvailableUniv.map(renderUnivItem)}
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

export default AvailableMathSubject;
