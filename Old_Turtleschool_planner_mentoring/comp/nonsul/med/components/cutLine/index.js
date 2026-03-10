import React, { useEffect, useState, useRef } from 'react';
import styles from './index.module.css';
import axios from 'axios';

const CutLine = ({ selectedUnivCode, addUnivCodes, deleteUnivCodes, userGrade }) => {
    const request = useRef(axios.CancelToken.source());
    const [availableUniv, setAvailableUniv] = useState([]);
    const [notAvailableUniv, setNotAvailableUniv] = useState([]);

    useEffect(() => {
        _getCutLineUniv();
        return () => {
            request.current?.cancel();
        };
    }, []);

    const _getCutLineUniv = () => {
        const query = {
            kor: 0,
            eng: 0,
            mat1: 0,
            mat2: 0,
            soc1: 0,
            soc2: 0,
            sci1: 0,
            sci2: 0,
            khistory: 0,
            division: 1,
            univers: selectedUnivCode.join('|'),
            ...userGrade,
        };
        axios
            .get('/api/essay/lowestgrade', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                cancelToken: request.current?.token,
            })
            .then((res) => {
                const arr = res.data.data;
                const [pass, fail] = arr.reduce(([p, f], univ) => (univ.pass_result_cd === 'Y' ? [[...p, univ], f] : [p, [...f, univ]]), [[], []]);
                setAvailableUniv(pass);
                setNotAvailableUniv(fail);
                deleteUnivCodes('select', selectedUnivCode);
            })
            .catch((err) => {
                console.log(err);
            });
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
            availableUniv.map((univ) => `${univ.id},${univ.rcrtmunit}`)
        );
    };

    const selectAllAvoidUnivs = () => {
        addUnivCodes(
            'select',
            notAvailableUniv.map((univ) => `${univ.id},${univ.rcrtmunit}`)
        );
    };

    const renderUnivItem = (univ) => (
        <tr key={`${univ.id},${univ.rcrtmunit}`} className={[styles.t_br, styles.t_bb, styles.t_bl].join(' ')}>
            <td>{univ.name}</td>
            <td>{univ.comn_nm}</td>
            <td>{univ.rmk}</td>
            <td>{univ.pass_result_nm}</td>
            <td className={styles.checkbox}>
                <input checked={selectedUnivCode.includes(`${univ.id},${univ.rcrtmunit}`)} type='checkbox' id={`${univ.id},${univ.rcrtmunit}`} name='선택' onChange={onUnivClick} />
                <label htmlFor={`${univ.id},${univ.rcrtmunit}`}></label>
            </td>
        </tr>
    );

    return (
        <div id={styles.contents}>
            <div id={styles.discuss}>
                <div id={styles.discuss_contents}>
                    <div className={styles.advice}>
                        * 아래는 9월 모평 기준으로, 최저 가능 대학들과 불가 대학들입니다. <br></br> * 가능 대학은 모두 선택 하세요. 불가 대학도 선택을 안 하시면, 뒷단계에서 배제되기 때문에, 최저에 자신 있는 대학은 모두 선택해 주세요
                    </div>
                    <div className={[styles.discuss_col1, styles.section1].join(' ')}>
                        <div className={styles.discuss_row2}>
                            <p style={{ display: 'inline-block' }} className={styles.discuss_tit2}>
                                최저 가능 대학
                            </p>
                            <button className={styles.select_all} onClick={selectAllSuggestedUnivs}>
                                모두 선택
                            </button>
                            <div className={[styles.t_box, styles.t_bs].join(' ')}>
                                <div className={styles.table_container}>
                                    <table className={styles.discuss_table1}>
                                        <colgroup>
                                            <col width='14%;' />
                                            <col width='12.5%;' />
                                            <col width='auto;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb, styles.t_bl].join(' ')}>
                                                <th>대학명</th>
                                                <th>계열</th>
                                                <th>최저</th>
                                                <th>최저요건</th>
                                                <th>선택</th>
                                            </tr>
                                            {availableUniv.map((univ) => renderUnivItem(univ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={[styles.discuss_col1, styles.section2].join(' ')}>
                        <div className={styles.discuss_row2}>
                            <p style={{ display: 'inline-block' }} className={styles.discuss_tit2}>
                                최저 불가 대학
                            </p>
                            <button className={styles.select_all} onClick={selectAllAvoidUnivs}>
                                모두 선택
                            </button>
                            <div className={[styles.t_box, styles.t_bs].join(' ')}>
                                <div className={styles.table_container}>
                                    <table className={styles.discuss_table1}>
                                        <colgroup>
                                            <col width='14%;' />
                                            <col width='12.5%;' />
                                            <col width='auto;' />
                                            <col width='12.5%;' />
                                            <col width='12.5%;' />
                                        </colgroup>
                                        <tbody>
                                            <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb, styles.t_bl].join(' ')}>
                                                <th>대학명</th>
                                                <th>계열</th>
                                                <th>최저</th>
                                                <th>최저요건</th>
                                                <th>선택</th>
                                            </tr>
                                            {notAvailableUniv.map((univ) => renderUnivItem(univ))}
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

export default CutLine;
