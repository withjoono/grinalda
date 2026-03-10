import axios from 'axios';
import classNames from 'classnames/bind';
import React, {useEffect, useState} from 'react';
// custom components
import Advice from '../../../Advice';
import otherStyles from '../availableSciSubject/index.module.css';
import styles from './index.module.css';

const cx = classNames.bind(styles);
const otherCx = classNames.bind(otherStyles);

const MajorSelection = ({
  selectedUnivCode,
  secondSciUnivCode,
  gpaUnivCode,
  finalUnivCode,
  addUnivCodes,
  deleteUnivCodes,
}) => {
  const [univ, setUniv] = useState([]);
  const [filter, setFilter] = useState({
    physics1: false,
    chemistry1: false,
    biology1: false,
    earth1: false,
    physics2: false,
    chemistry2: false,
    biology2: false,
    earth2: false,
  });

  useEffect(() => {
    _getUniv();
  }, []);

  const onFilterClick = ({target}) => {
    setFilter(prev => ({
      ...prev,
      [target.name]: !prev[target.name],
    }));
  };

  const onSubmitClick = () => {
    _getUniv();
  };

  const _getUniv = () => {
    const date = new Date();
    const query = {
      year: date.getFullYear() + 1,
      lar_cd: 1,
      universa: [...selectedUnivCode, ...secondSciUnivCode].join('|'),
      universd: gpaUnivCode.join('|'),
    };
    axios
      .get('/api/essay/tab_7', {
        headers: {auth: localStorage.getItem('uid')},
        params: query,
      })
      .then(res => {
        setUniv(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onUnivClick = ({target}, item) => {
    if (target.checked) {
      addUnivCodes('final', [target.id], item);
    } else {
      deleteUnivCodes('final', [target.id]);
    }
  };

  const checkSuitability = univ => {
    if (univ.universityid === '355' || univ.universityid === '241') {
      const isRequired = [
        univ.scncpa,
        univ.scncca,
        univ.scncba,
        univ.scncea,
        univ.scncpb,
        univ.scnccb,
        univ.scncbb,
        univ.scnceb,
      ].map(value => (value === '○' ? true : false));
      // 하나라도 포함되면 부합
      const result = Object.values(filter).filter(
        (value, index) => value && value === isRequired[index],
      ).length;
      return result;
    } else {
      return true;
    }
  };

  const renderUnivItem = (univ, index) => {
    const suitability = checkSuitability(univ);
    return (
      <tr
        key={univ.universityid + ',' + univ.departmentid + ',' + index}
        className={cx('t_br', 't_bb', 't_bl')}
      >
        <td>{univ.universitynm}</td>
        <td>{univ.departmentnm}</td>
        <td>{univ.scncpa}</td>
        <td>{univ.scncca}</td>
        <td>{univ.scncba}</td>
        <td>{univ.scncea}</td>
        <td>{univ.scncpb}</td>
        <td>{univ.scnccb}</td>
        <td>{univ.scncbb}</td>
        <td>{univ.scnceb}</td>
        <td className={cx(suitability ? 'c_green' : 'c_red')}>{suitability ? '부합' : '결격'}</td>
        <td className={cx('checkbox')}>
          <input
            checked={finalUnivCode.includes(univ.universityid + ',' + univ.departmentid)}
            type="checkbox"
            id={univ.universityid + ',' + univ.departmentid}
            name="선택"
            onChange={e => onUnivClick(e, univ)}
          />
          <label htmlFor={univ.universityid + ',' + univ.departmentid}></label>
        </td>
      </tr>
    );
  };

  return (
    <div id={cx('contents')}>
      <div id={cx('discuss')}>
        <div id={cx('discuss_contents')}>
          <Advice>
            * 연대와 건국대는 학과마다 과학 선택 과목이 다릅니다. <br></br>* 학과별 과학 지정 여부를
            다시 확인해주세요.
          </Advice>
          <div id={otherCx('contents')}>
            <div id={otherCx('discuss')}>
              <div id={otherCx('discuss_contents')}>
                <div className={otherCx('discuss_col1', 'section1')}>
                  <div className={otherCx('discuss_row1')}>
                    <table className={otherCx('discuss_table1')}>
                      <colgroup>
                        <col width="72.5%;" />
                        <col width="auto;" />
                      </colgroup>
                      <tbody>
                        <tr className={otherCx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                          <th colSpan="3">과학 가능 과목 선택</th>
                        </tr>
                        <tr>
                          <td>
                            <button
                              name={Object.keys(filter)[0]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.physics1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              물1
                            </button>
                            <button
                              name={Object.keys(filter)[1]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.chemistry1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              화1
                            </button>
                            <button
                              name={Object.keys(filter)[2]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.biology1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              생1
                            </button>
                            <button
                              name={Object.keys(filter)[3]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.earth1 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              지1
                            </button>
                          </td>
                        </tr>
                        <tr className={otherCx('t_bb')}>
                          <td>
                            <button
                              name={Object.keys(filter)[4]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.physics2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              물2
                            </button>
                            <button
                              name={Object.keys(filter)[5]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.chemistry2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              화2
                            </button>
                            <button
                              name={Object.keys(filter)[6]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.biology2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              생2
                            </button>
                            <button
                              name={Object.keys(filter)[7]}
                              onClick={onFilterClick}
                              className={otherCx(
                                'check',
                                filter.earth2 ? 'c_orange' : ['c_gray_02', 'b_gray_06'],
                              )}
                            >
                              지2
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={cx('discuss_col1', 'section1')}>
            <div className={cx('discuss_row2')}>
              <p className={cx('discuss_tit2')}>학과 선택</p>
              <div className={cx('t_box', 't_bs')}>
                <div className={cx('table_container')}>
                  <table className={cx('discuss_table1')}>
                    <colgroup>
                      <col width="15%;" />
                      <col width="auto;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="6%;" />
                      <col width="10%;" />
                      <col width="7%;" />
                    </colgroup>
                    <tbody>
                      <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                        <th>대학명</th>
                        <th>학과</th>
                        <th>물1</th>
                        <th>화1</th>
                        <th>생1</th>
                        <th>지1</th>
                        <th>물2</th>
                        <th>화2</th>
                        <th>생2</th>
                        <th>지2</th>
                        <th>결격/부합</th>
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

export default MajorSelection;
