import React, {useMemo, useState} from 'react';
import Components from '../../../comp/nonsul/low/components';
import {useLoginCheck} from '../../../src/hooks/useLoginCheck';
import SideBar from '../../early/sidebar/SideBar';
import styles from './index.module.css';

const LowNonsul = () => {
  useLoginCheck();

  const [selectedUnivCode, setSelectedUnivCode] = useState([]);
  const [userGrade, setUserGrade] = useState({
    kor: 1,
    eng: 1,
    mat1: 1,
    sci1: 1,
    sci2: 1,
  });
  const [userScore, setUserScore] = useState({
    kor: 0,
    eng: 0,
    mat1: 0,
    sci1: 0,
    sci2: 0,
  });
  const [page, setPage] = useState(0);
  const pageTitles = [
    {
      tag: 'scoreInput',
      name: '9월 모평 등급 입력',
    },
    {
      tag: 'lowUniv',
      name: '약식 논술 대학',
    },
    {
      tag: 'extraUnivForGpa',
      name: '남은 수시 카드를 위한 지원 가능한 논술 대학',
    },
    {
      tag: 'majorSelection',
      name: '학과 선택',
    },
    {
      tag: 'dateSelection',
      name: '전형일 파악',
    },
    {
      tag: 'finalDecision',
      name: '최종 결정',
    },
  ];

  const onNext = () => {
    // empty handle
    setPage(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const onPrev = () => {
    setPage(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const renderPageTitles = useMemo(() => {
    return pageTitles.map(title => (
      <td
        key={title.name}
        className={
          title.name === pageTitles[page].name ? [styles.b_orange, styles.c_white].join(' ') : ''
        }
      >
        {title.name}
      </td>
    ));
  }, [page]);

  const renderContentComponent = useMemo(() => {
    const Content = Components[pageTitles[page].tag];
    return (
      <Content
        selectedUnivCode={selectedUnivCode}
        setSelectedUnivCode={setSelectedUnivCode}
        userGrade={userGrade}
        setUserGrade={setUserGrade}
        userScore={userScore}
        setUserScore={setUserScore}
      />
    );
  }, [
    page,
    selectedUnivCode,
    setSelectedUnivCode,
    userGrade,
    setUserGrade,
    userScore,
    setUserScore,
  ]);

  return (
    <div id={styles.contents}>
      <div id={styles.contents_inner}>
        <nav id={styles.crumbs}>
          <ol>
            <li>
              <a href="#" className={styles.c_gray_02}>
                홈
              </a>
            </li>
            <li>
              <a href="#" className={styles.c_gray_02}>
                논술 컨설팅
              </a>
            </li>
            <li>
              <a href="#" className={styles.fw_500}>
                약식 논술
              </a>
            </li>
          </ol>
        </nav>
        <div id={styles.discuss}>
          <div id={styles.side_menu}>
            <SideBar state={true} />
          </div>
          <div id={styles.discuss_contents}>
            <section className={styles.list}>
              <p className={styles.discuss_tit1}>약식 논술</p>
              <table>
                <tbody>
                  <tr>{renderPageTitles}</tr>
                </tbody>
              </table>
            </section>
            {renderContentComponent}
            <div className={styles.page}>
              <button
                className={`${styles.btn} ${page == 0 ? styles.btn_disabled : styles.btn_active}`}
                onClick={onPrev}
                disabled={page == 0}
              >
                이전 단계
              </button>
              <button
                className={`${styles.btn} ${
                  page == pageTitles.length - 1 ? styles.btn_disabled : styles.btn_active
                }`}
                onClick={onNext}
                disabled={page == pageTitles.length - 1}
              >
                다음 단계
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowNonsul;
