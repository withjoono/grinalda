import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './index.module.css';
import classNames from 'classnames/bind';
import axios from 'axios';

const cx = classNames.bind(styles);

const OtherUniv = ({ secondSciUnivCode, addUnivCodes, deleteUnivCodes }) => {
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
            lar_cd: 4,
        };

        axios
            .get('/api/essay/tab_5', {
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

    const onUnivClick = ({ target }) => {
        if (target.checked) {
            addUnivCodes('secondSci', [target.id]);
        } else {
            deleteUnivCodes('secondSci', [target.id]);
        }
    };

    const selectAllSuggestedUnivs = () => {
        let funiv = univ.filter((value) => value.rm3 !== '약식논술');
        if(funiv === null){
            addUnivCodes(
                'secondSci',
                null,    
            );
        }
        else{
            addUnivCodes(
                'secondSci',
                univ.filter((value) => value.rmk3 !== '약식논술').map((univ) => `${univ.universityid},${univ.rmk2}`)    
            );
        }
    };

    const renderUnivItem = (univ) => (
        <tr key={`${univ.universityid},${univ.rmk2}`} className={cx('t_br', 't_bb', 't_bl')}>
            <td>{univ.name}</td>
            <td>{univ.rmk1}</td>
            <td>{univ.departmentnm}</td>
            <td>{univ.rmk3}</td>
            <td>
                {univ.rmk3 === '약식논술' ? (
                    <Link href='/nonsul/low'>
                        <a style={{ cursor: 'pointer' }}>약식논술 바로가기</a>
                    </Link>
                ) : (
                    univ.rmk4
                )}
            </td>
            <td className={cx('checkbox')}>
                {univ.rmk3 === '약식논술' ? null : (
                    <>
                        <input checked={secondSciUnivCode.includes(`${univ.universityid},${univ.rmk2}`)} type='checkbox' id={`${univ.universityid},${univ.rmk2}`} name='선택' onChange={onUnivClick} />
                        <label htmlFor={`${univ.universityid},${univ.rmk2}`}></label>
                    </>
                )}
            </td>
        </tr>
    );
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row1')}>
                            * 이과논술 전형 중, 언어논술을 출제하는 대학들입니다(수리논술은 문과 범위). <br></br>* 관심 없는 대학이라면 다음 단계로 진행하세요.
                        </div>
                    </div>
                    <div className={cx('discuss_col1', 'section2')}>
                        <div className={cx('discuss_row2')}>
                            <p style={{ display: 'inline-block' }} className={cx('discuss_tit2')}>
                                이과 학과 교차지원2
                            </p>
                            <button className={styles.select_all} onClick={selectAllSuggestedUnivs}>
                                모두 선택
                            </button>
                            <div className={cx('t_box', 't_bs')}>
                                <div className={cx('table_container')}>
                                    <table className={cx('discuss_table1')}>
                                        <colgroup>
                                            <col width='12%;' />
                                            <col width='12%;' />
                                            <col width='16%;' />
                                            <col width='16%;' />
                                            <col width='auto;' />
                                            <col width='10%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                                                <th>대학명</th>
                                                <th>전형 시간</th>
                                                <th>모집 단위</th>
                                                <th>논술 과목</th>
                                                <th>출제 경향</th>
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

export default OtherUniv;
