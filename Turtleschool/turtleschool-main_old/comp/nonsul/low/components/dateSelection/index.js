import classNames from 'classnames/bind';
import React from 'react';
import styles from './index.module.css';

const cx = classNames.bind(styles);

const DateSelection = () => {
  return (
    <div id={cx('contents')}>
      <div id={cx('discuss')}>
        <div id={cx('discuss_contents')}>
          <div className={cx('discuss_col1', 'section1')}>
            <div className={cx('discuss_row2')}>
              <p className={cx('discuss_tit2')}>전형 날짜/시간 파악</p>
              <div className={cx('t_box', 't_bs')}>
                <table className={cx('discuss_table1')}>
                  <colgroup>
                    <col width="20%;" />
                    <col width="20%;" />
                    <col width="20%;" />
                    <col width="20%;" />
                    <col width="20%;" />
                  </colgroup>
                  <tbody>
                    <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                      <th>대학명</th>
                      <th>학과</th>
                      <th>전형일</th>
                      <th>시험 시각</th>
                      <th>선택</th>
                    </tr>
                    <tr className={cx('t_br', 't_bb', 't_bl')}>
                      <td rowSpan="5">가톨릭대</td>
                      <td>물리학과</td>
                      <td>10월 8일</td>
                      <td>13:30 ~ 15:30</td>
                      <td className={cx('checkbox')}>
                        <input type="checkbox" id="check1" name="선택" />
                        <label htmlFor="check1"></label>
                      </td>
                    </tr>
                    <tr className={cx('t_br', 't_bb', 't_bl')}>
                      <td>물리학과</td>
                      <td>10월 8일</td>
                      <td>13:30 ~ 15:30</td>
                      <td className={cx('checkbox')}>
                        <input type="checkbox" id="check2" name="선택" />
                        <label htmlFor="check2"></label>
                      </td>
                    </tr>
                    <tr className={cx('t_br', 't_bb', 't_bl')}>
                      <td>물리학과</td>
                      <td>10월 8일</td>
                      <td>13:30 ~ 15:30</td>
                      <td className={cx('checkbox')}>
                        <input type="checkbox" id="check3" name="선택" />
                        <label htmlFor="check3"></label>
                      </td>
                    </tr>
                    <tr className={cx('t_br', 't_bb', 't_bl')}>
                      <td>물리학과</td>
                      <td>10월 8일</td>
                      <td>13:30 ~ 15:30</td>
                      <td className={cx('checkbox')}>
                        <input type="checkbox" id="check4" name="선택" />
                        <label htmlFor="check4"></label>
                      </td>
                    </tr>
                    <tr className={cx('t_br', 't_bb', 't_bl')}>
                      <td>물리학과</td>
                      <td>10월 8일</td>
                      <td>13:30 ~ 15:30</td>
                      <td className={cx('checkbox')}>
                        <input type="checkbox" id="check5" name="선택" />
                        <label htmlFor="check5 "></label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelection;
