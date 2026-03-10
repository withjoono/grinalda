import axios from 'axios';
import classNames from 'classnames/bind';
import React, {useEffect, useRef, useState} from 'react';
import styles from './index.module.css';

const cx = classNames.bind(styles);

const OtherSubject = ({secondSciUnivCode, addUnivCodes, deleteUnivCodes}) => {
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
      math: 1,
      mathp: 1,
      mathd: 1,
      mathg: 1,
      scncc: 1,
      scncpa: 1,
      scncca: 1,
      scncba: 1,
      scncea: 1,
      scncpb: 1,
      scnccb: 1,
      snccbb: 1,
      scnceb: 1,
      division: 2,
      year: date.getFullYear() + 1,
      lar_cd: 2,
      gubu: 2,
      hmntsessay: 1,
      mdclessay: 1,
      englishessay: 1,
    };
    axios
      .get('/api/essay/tab_34', {
        headers: {auth: localStorage.getItem('uid')},
        params: query,
        cancelToken: request.current?.token,
      })
      .then(res => {
        const arr = res.data.data;
        setUniv(arr);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const onUnivClick = ({target}) => {
    if (target.checked) {
      addUnivCodes('secondSci', [target.id]);
    } else {
      deleteUnivCodes('secondSci', [target.id]);
    }
  };

  const renderUnivItem = univ => (
    <tr key={univ.university} className={cx('t_br', 't_bb', 't_bl')}>
      <td>{univ.name}</td>
      <td>{univ.hmntsessay}</td>
      <td>{univ.mdclessay}</td>
      <td>{univ.englishessay}</td>
      <td className={cx('checkbox')}>
        <input
          checked={secondSciUnivCode.includes(univ.university)}
          type="checkbox"
          id={univ.university}
          name="선택"
          onChange={onUnivClick}
        />
        <label htmlFor={univ.university}></label>
      </td>
    </tr>
  );
  return (
    <div id={cx('contents')}>
      <div id={cx('discuss')}>
        <div id={cx('discuss_contents')}>
          <div className={cx('discuss_col2', 'section2')}>
            <div className={cx('discuss_row2')}>
              <p className={cx('discuss_tit2')}>추천 대학</p>
              <div className={cx('t_box', 't_bs')}>
                <div className={cx('table_container')}>
                  <table className={cx('discuss_table2')}>
                    <colgroup>
                      <col width="25%;" />
                      <col width="15%;" />
                      <col width="15%;" />
                      <col width="15%;" />
                      <col width="10%;" />
                    </colgroup>
                    <tbody>
                      <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                        <th>대학명</th>
                        <th>언어논술</th>
                        <th>의학논술</th>
                        <th>영어</th>
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

export default OtherSubject;
