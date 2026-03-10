import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

// custom components
import Advice from '../../../Advice';
import Button from '../../../Button';

const cx = classNames.bind(styles);

const AvailableSciSubject = ({ secondSciUnivCode, firstSciUnivCode, addUnivCodes, deleteUnivCodes }) => {
    const request = useRef(axios.CancelToken.source());
    const [filter, setFilter] = useState({
        physics1: false,
        chemistry1: false,
        biology1: false,
        earth1: false,
        common: false,
        physics2: false,
        chemistry2: false,
        biology2: false,
        earth2: false,
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
            math: 1,
            mathp: 1,
            mathd: 1,
            mathg: 1,
            scncc: filter.common ? 2 : 1,
            scncpa: filter.physics1 ? 2 : 1,
            scncca: filter.chemistry1 ? 2 : 1,
            scncba: filter.biology1 ? 2 : 1,
            scncea: filter.earth1 ? 2 : 1,
            scncpb: filter.physics2 ? 2 : 1,
            scnccb: filter.chemistry2 ? 2 : 1,
            snccbb: filter.biology2 ? 2 : 1,
            scnceb: filter.earth2 ? 2 : 1,
            division: 1,
            year: date.getFullYear() + 1,
            // univers: firstSciUnivCode.join('|'),
            gubu: 1,
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

    const onUnivClick = ({ target }) => {
        if (target.checked) {
            addUnivCodes('secondSci', [target.id]);
        } else {
            deleteUnivCodes('secondSci', [target.id]);
        }
    };

    const selectAllSuggestedUnivs = () => {
        addUnivCodes(
            'secondSci',
            availableUniv.map((univ) => univ.university)
        );
    };

    const selectAllAvoidUnivs = () => {
        addUnivCodes(
            'secondSci',
            notAvailableUniv.map((univ) => univ.university)
        );
    };

    const renderUnivItem = (univ) => (
        <tr key={univ.university} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.name}</td>
            <td>{univ.scncc}</td>
            <td>{univ.scncpa}</td>
            <td>{univ.scncca}</td>
            <td>{univ.scncba}</td>
            <td>{univ.scncea}</td>
            <td>{univ.scncpb}</td>
            <td>{univ.scnccb}</td>
            <td>{univ.scncbb}</td>
            <td>{univ.scnceb}</td>
            <td className={cx('checkbox')}>
                <input checked={secondSciUnivCode.includes(univ.university)} type='checkbox' id={univ.university} name='선택' onChange={onUnivClick} />
                <label htmlFor={univ.university}></label>
            </td>
        </tr>
    );

    const onSubmitClick = () => {
        _getUniv();
    };

    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <Advice>
                        * 과학을 출제하는 대학마다 범위가 상이합니다. <br></br>* 본인이 가능한 과학 과목을 선택해주세요.
                    </Advice>
                    {/* <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row1')}>
                            <table className={cx('discuss_table1')}>
                                <colgroup>
                                    <col width='72.5%;' />
                                    <col width='auto;' />
                                </colgroup>
                                <tbody>
                                    <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                        <th colSpan='3'>과학 가능 과목 선택</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <button name={Object.keys(filter)[0]} onClick={onFilterClick} className={cx('check', filter.physics1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                물1
                                            </button>
                                            <button name={Object.keys(filter)[1]} onClick={onFilterClick} className={cx('check', filter.chemistry1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                화1
                                            </button>
                                            <button name={Object.keys(filter)[2]} onClick={onFilterClick} className={cx('check', filter.biology1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                생1
                                            </button>
                                            <button name={Object.keys(filter)[3]} onClick={onFilterClick} className={cx('check', filter.earth1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                지1
                                            </button>
                                            <button name={Object.keys(filter)[4]} onClick={onFilterClick} className={cx('check', filter.common ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                통합과학
                                            </button>
                                        </td>
                                        <td rowSpan='2'>
                                            <button onClick={onSubmitClick} className={cx('c_white', 'b_orange')}>
                                                해당 대학 검색
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className={cx('t_bb')}>
                                        <td>
                                            <button name={Object.keys(filter)[5]} onClick={onFilterClick} className={cx('check', filter.physics2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                물2
                                            </button>
                                            <button name={Object.keys(filter)[6]} onClick={onFilterClick} className={cx('check', filter.chemistry2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                화2
                                            </button>
                                            <button name={Object.keys(filter)[7]} onClick={onFilterClick} className={cx('check', filter.biology2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                생2
                                            </button>
                                            <button name={Object.keys(filter)[8]} onClick={onFilterClick} className={cx('check', filter.earth2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                지2
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> */}

                    <div className={cx('discuss_col1', 'section2')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                추천 대학
                            </p>
                            <Button onClick={selectAllSuggestedUnivs}>모두 선택</Button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table2')}>
                                        <colgroup>
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                            <col width='9.0909%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>통합과학</th>
                                                <th>물1</th>
                                                <th>화1</th>
                                                <th>생1</th>
                                                <th>지1</th>
                                                <th>물2</th>
                                                <th>화2</th>
                                                <th>생2</th>
                                                <th>지2</th>
                                                <th>선택</th>
                                            </tr>
                                            {availableUniv.map(renderUnivItem)}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className={cx('discuss_col1', 'section3')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                비추천 대학
                            </p>
                            <Button onClick={selectAllAvoidUnivs}>모두 선택</Button>
                            <div className={cx('t_box', 't_bs')}>
                                <table className={cx('discuss_table2')}>
                                    <colgroup>
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                        <col width='9.0909%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>대학명</th>
                                            <th>통합과학</th>
                                            <th>물1</th>
                                            <th>화1</th>
                                            <th>생1</th>
                                            <th>지1</th>
                                            <th>물2</th>
                                            <th>화2</th>
                                            <th>생2</th>
                                            <th>지2</th>
                                            <th>선택</th>
                                        </tr>
                                        {notAvailableUniv.map(renderUnivItem)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default AvailableSciSubject;
