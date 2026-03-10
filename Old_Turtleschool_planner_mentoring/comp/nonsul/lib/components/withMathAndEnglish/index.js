import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

const cx = classNames.bind(styles);

const WithMathAndEnglish = ({ selectedUnivCode, addUnivCodes, deleteUnivCodes }) => {
    const request = useRef(axios.CancelToken.source());

    const [univ, setUniv] = useState([]);

    useEffect(() => {
        _getUniv();
        return () => {
            request.current?.cancel();
        };
    }, []);

    const _getUniv = () => {
        const date = new Date();
        const query = {
            year: date.getFullYear() + 1,
            division: 0,
            lar_cd: 2,
            univers: selectedUnivCode.join('|'),
        };

        axios
            .get('/api/essay/tab_3', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                cancelToken: request.current?.token,
            })
            .then((res) => {     
            const univInfo = res.data.data;
            const univData = [];
            console.log(univInfo);
            for(i=0; i<univInfo.length; i++)
            {
                console.log(univInfo[i].englishexam);

                if(univInfo[i].englishexam == 'X' && univInfo[i].examyn == 'X')
                {  console.log(univInfo[i]); }
                else {
                   
                    univData.push(univInfo[i]);
                }
            }
                setUniv(univData);
                //setUniv(res.data.data);
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

    const onFilterSubmit = () => {
        _getUniv();
    };

    const onUnivClick = ({ target }) => {
        if (target.checked) {
            addUnivCodes('select', [target.id]);
        } else {
            deleteUnivCodes('select', [target.id]);
        }
    };

    const selectAllSuggestedUnivs = () => {
        addUnivCodes(
            'select',
            univ.map((univ) => `${univ.universityid},${univ.rcrtmunitid}`)
        );
    };

    const renderUnivItem = (univ) => (
        <tr key={`${univ.universityid},${univ.rcrtmunitid}`} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.universitynm}</td>
            <td>{univ.examseriesnm}</td>
            <td>{univ.examyn}</td>
            <td>{univ.englishexam}</td>
            <td className={cx('checkbox')}>
                <input checked={selectedUnivCode.includes(`${univ.universityid},${univ.rcrtmunitid}`)} type='checkbox' id={`${univ.universityid},${univ.rcrtmunitid}`} name='선택' onChange={onUnivClick} />
                <label htmlFor={`${univ.universityid},${univ.rcrtmunitid}`}></label>
            </td>
          
        </tr>
    );

    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={styles.advice}>* 아래는 수리논술과 영어제시문이 출제되는 대학들입니다.<br></br>
                    * 수리논술 중, 수리논리없는 도표문항은 수학능력과 상관없기 때문에, 별도 나열하지 않았고, <br></br>
                    * 순수 문과 수리논술 출제 대학만 나열했습니다.<br></br>
                    * 선택을 안 하시면, 다음 단계에서 배제됩니다.</div>
                    {/* <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row1')}>
                            <table className={cx('discuss_table1')}>
                                <colgroup>
                                    <col width='11%;' />
                                    <col width='auto;' />
                                    <col width='25%;' />
                                </colgroup>
                                <tbody>
                                    <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                        <th colSpan='3'>수리논술과 영어제시문 출제 대학 확인</th>
                                    </tr>
                                    <tr>
                                        <td className={cx('c_gray_02')}>수리논술</td>
                                        <td>
                                            <button name={Object.keys(filter)[0]} onClick={onFilterClick} className={cx('check', filter.tableWithoutMath ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                수리논리 없는 도표문항
                                            </button>
                                            <button name={Object.keys(filter)[1]} onClick={onFilterClick} className={cx('check', filter.withMath ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                수리논리 문항
                                            </button>
                                        </td>
                                        <td rowSpan='2'>
                                            <button onClick={onFilterSubmit} className={cx('c_white', 'b_orange')}>
                                                해당 대학 검색
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className={cx('t_bb')}>
                                        <td className={cx('c_gray_02')}>영어</td>
                                        <td>
                                            <button name={Object.keys(filter)[2]} onClick={onFilterClick} className={cx('check', filter.withEnglish ? 'c_orange' : ['c_gray_02', 'b_gray_06'])}>
                                                영어 제시문
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
                            <button className={styles.select_all} onClick={selectAllSuggestedUnivs}>
                                모두 선택
                            </button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={styles.table_container}>
                                <table className={cx('discuss_table2')}>
                                    <colgroup>
                                        <col width='19%' />
                                        <col width='auto' />
                                        <col width='19%;' />
                                        <col width='19%;' />
                                        <col width='10%' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>대학명</th>
                                            <th>고시 계열</th>
                                            <th>수리 논술</th>
                                            <th>영어제시문</th>
                                            <th>선택</th>
                                        </tr>

                                        {univ.map(renderUnivItem)}
                                    </tbody>
                                </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className={cx('discuss_col1', 'section3')}>
                        <div className={cx('discuss_row2')}>
                            <p className={cx('discuss_tit2')}>비추천 대학</p>
                            <div className={cx('t_box', 't_bs')}>
                                <table className={cx('discuss_table2')}>
                                    <colgroup>
                                    <col width='auto;' />
                                        <col width='24%;' />
                                        <col width='19%;' />
                                        <col width='19%;' />
                                        <col width='10%' />
                                    </colgroup>
                                    <tbody>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th rowSpan='2'>대학명</th>
                                            <th colSpan='3'>수리 논술</th>
                                            <th rowSpan='2'>영어제시문</th>
                                            <th rowSpan='2'>선택</th>
                                        </tr>
                                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                            <th>수리논리 없는 도표문항</th>
                                            <th>수리논리 문항</th>
                                        </tr>
                                        {univ.map(renderUnivItem)}
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

export default WithMathAndEnglish;
