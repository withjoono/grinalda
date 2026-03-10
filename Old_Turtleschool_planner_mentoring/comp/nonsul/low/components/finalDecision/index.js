import React from 'react';
import styles from './index.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const FinalDecision = () => {
    const renderUnivItem = () => {
        return (
            <div className={cx('t_box', 't_bs')}>
                <table className={cx('discuss_table1')}>
                    <colgroup>
                        <col width='12.5%;' />
                        <col width='12.5%;' />
                        <col width='12.5%;' />
                        <col width='12.5%;' />
                        <col width='auto;' />
                        <col width='12.5%;' />
                    </colgroup>
                    <tbody>
                        <tr className={cx('t_bg', 't_bt', 't_br', 't_bb', 't_bl')}>
                            <th>대학명</th>
                            <th>학과</th>
                            <th>전형일</th>
                            <th>시험 시각</th>
                            <th>최저</th>
                            <th>삭제</th>
                        </tr>
                        <tr className={cx('t_br', 't_bb', 't_bl')}>
                            <td>서울과학기술대</td>
                            <td>물리학과</td>
                            <td>10월 8일</td>
                            <td>13:30 ~ 15:30</td>
                            <td>국,수,영,과(1) 중 3개 합 5, 수 또는 과(1) 필수, 한 4</td>
                            <td className={cx('c_gray_02')}>
                                <span>삭제</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };
    return (
        <div id={cx('contents')}>
            <div id={cx('discuss')}>
                <div id={cx('discuss_contents')}>
                    <div className={cx('discuss_col1', 'section1')}>
                        <div className={cx('discuss_row2')}>
                            <p className={cx('discuss_tit2')}>최종 결정</p>
                            {renderUnivItem()}
                            {renderUnivItem()}
                            {renderUnivItem()}
                            {renderUnivItem()}
                        </div>
                    </div>
                    <div className={cx("discuss_col1", "section2")}>
                        <div className={cx("discuss_row1")}>
                            <div>
                                * 아직도 남은 수시 카드가 있다면 교과, 학종, 전형 중 지원할 만한 곳을 찾아보세요.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinalDecision;
