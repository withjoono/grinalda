import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

const cx = classNames.bind(styles);

const ApplySciNonsul = ({ firstSciUnivCode, addUnivCodes, deleteUnivCodes }) => {
    const request = useRef(axios.CancelToken.source());
    const [univ, setUniv] = useState([]);
    const [filter, setFilter] = useState({
        math: false,
        statistics: false,
    });

    useEffect(() => {
        _getUniv();
        return () => {
            request.current?.cancel();
        };
    }, []);

    const _getUniv = () => {
        const date = new Date();
        const query = {
            division: 0,
            year: date.getFullYear() + 1,
            lar_cd: 1,
            mid_cd2: filter.math ? 2 : 1,
            mid_cd3: filter.statistics ? 2 : 1,
        };

        axios
            .get('/api/essay/tab_4', {
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

    const onFilterClick = ({ target }) => {
        setFilter((prev) => ({
            ...prev,
            [target.name]: !prev[target.name],
        }));
    };

    const onSubmitClick = () => {
        _getUniv();
    };

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
            univ.map((univ) => `${univ.universityid},${univ.departmentid}`)
        );
    };

    const renderUnivItem = (univ) => (
        <tr key={`${univ.universityid},${univ.departmentid}`} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.name}</td>
            <td>{univ.departmentnm}</td>
            <td>{univ.casee}</td>
            <td>{univ.casea}</td>
            <td>{univ.caseb}</td>
            <td>{univ.casec}</td>
            <td>{univ.cased}</td>
            <td className={cx('checkbox')}>
                <input checked={firstSciUnivCode.includes(`${univ.universityid},${univ.departmentid}`)} type='checkbox' id={`${univ.universityid},${univ.departmentid}`} name='선택' onChange={onUnivClick} />
                <label htmlFor={`${univ.universityid},${univ.departmentid}`}></label>
            </td>
        </tr>
    );

    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row1')}>
                            * 이과논술 전형 중, 언어 논술은 보지 않고, 문과 범위의 수리논술만 출제하는 대학이 있습니다. <br></br>* 수학에 자신 있고, 이과 대학으로 교차 지원을 희망할 경우, 아래 대학을 선택해 주세요. 원치 않으실 경우 다음단계로 건너뛰세요.
                        </div>
                    </div>
                    {/* <div className={cx('discuss_col1', 'section2')}>
                        <div className={cx('discuss_row1')}>
                            <table className={cx('discuss_table1')}>
                                <colgroup>
                                    <col width='30%;' />
                                    <col width='auto;' />
                                </colgroup>
                                <tbody>
                                    <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                        <th colSpan='3'>수리논술 가능 과목 선택</th>
                                    </tr>
                                    <tr className={cx('t_bb')}>
                                        <td>
                                            <button name={Object.keys(filter)[0]} onClick={onFilterClick} className={cx('check', filter.math ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                수1,수2
                                            </button>
                                            <button name={Object.keys(filter)[1]} onClick={onFilterClick} className={cx('check', filter.statistics ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                확통
                                            </button>
                                        </td>
                                        <td rowSpan='2'>
                                            <button onClick={onSubmitClick} className={cx('c_white', 'b_orange')}>
                                                해당 대학 검색
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> */}
                    <div className={cx('discuss_col1', 'section4')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                이과 학과 교차지원1
                            </p>
                            <button className={styles.select_all} onClick={selectAllSuggestedUnivs}>
                                모두 선택
                            </button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                <table className={cx('discuss_table2')}>
                                    <colgroup>
                                        <col width='12.5%;' />
                                        <col width='auto;' />
                                        <col width='10%;' />
                                        <col width='10%;' />
                                        <col width='10%;' />
                                        <col width='10%;' />
                                        <col width='10%;' />
                                        <col width='10%;' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>대학명</th>
                                            <th>모집 계열</th>
                                            <th>공통수학</th>
                                            <th>수1+수2</th>
                                            <th>확통</th>
                                            <th>미적</th>
                                            <th>기하</th>
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

export default ApplySciNonsul;
