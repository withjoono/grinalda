import classNames from 'classnames/bind';
import {useRouter} from 'next/router';
import React from 'react';
import styles from './index.module.css';

const cx = classNames.bind(styles);

const History = ({lowList = [], libList = [], sciList = [], medList = []}) => {
  const router = useRouter();

  const onRedirectClick = ({target}) => {
    let baseUri = '/nonsul/';
    switch (target.id) {
      case '문과 논술':
        baseUri = baseUri + 'lib';
        break;
      case '이과 논술':
        baseUri = baseUri + 'sci';
        break;
      case '의치한약 논술':
        baseUri = baseUri + 'med';
        break;
      case '약식 논술':
        baseUri = baseUri + 'low';
        break;
    }
    router.push(baseUri);
  };

  const deleteUniv = () => {};
  const registerInterestUniv = univ => {
    console.log(univ);
  };

  const renderUnivItem = (univ, index) => {
    return (
      <tr key={`${univ.universityid},${index}`} className={cx('t_br', 't_bb', 't_bl')}>
        <td>{univ.universitynm}</td>
        <td>{univ.departmentnm}</td>
        <td>{univ.recruitdate}</td>
        <td>{univ.rmk}</td>
        <td>{univ.rmk1}</td>
        <td>
          <button
            onClick={() => {
              registerInterestUniv(univ);
            }}
          >
            지정
          </button>
        </td>
        <td className={cx('c_gray_02')}>
          <button id={univ.universityid + '|' + univ.departmentnm} onClick={deleteUniv}>
            삭제
          </button>
        </td>
      </tr>
    );
  };

  const renderContainer = (title, data) => (
    <div className={styles.nonsul_container}>
      <p className={styles.nonsul_title}>{title}</p>
      <div className={styles.nonsul_content}>{renderContent(title, data)}</div>
    </div>
  );

  const renderContent = (title, list) =>
    list.length ? (
      <table>
        <colgroup>
          <col width="10%" />
          <col width="10%" />
          <col width="12%" />
          <col width="12%" />
          <col width="auto" />
          <col width="5%" />
          <col width="4%" />
        </colgroup>
        <tbody>
          <tr className={[styles.t_bg, styles.t_bt, styles.t_br, styles.t_bb].join(' ')}>
            <th>대학명</th>
            <th>학과</th>
            <th>전형일</th>
            <th>시험 시각</th>
            <th>최저</th>
            <th>관심대학지정</th>
            <th>삭제</th>
          </tr>
          {list.map(renderUnivItem)}
        </tbody>
      </table>
    ) : (
      <>
        <p className={styles.empty_title}>{`${title} 지원 사항이 없습니다.`}</p>
        <button
          id={title}
          className={styles.empty_button}
          onClick={onRedirectClick}
        >{`${title} 컨설팅 받으러 가기.`}</button>
      </>
    );

  return (
    <div className={styles.container}>
      {/* {renderContainer('약식 논술', lowList)} */}
      {/* <hr /> */}
      {renderContainer('문과 논술', libList)}
      <hr />
      {renderContainer('이과 논술', sciList)}
      <hr />
      {renderContainer('의치한약 논술', medList)}
    </div>
  );
};

export default History;
