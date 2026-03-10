import React, { useState, useEffect, useMemo } from 'react';
import styles from './index.module.css';
import Link from 'next/link';
import Components from '../../../comp/nonsul/sci/components';
import Banner from '../../../comp/nonsul/Banner';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';

const SciNonsul = () => {
    const [selectedUnivCode, setSelectedUnivCode] = useState({});
    const [firstSciUnivCode, setFirstSciUnivCode] = useState({});
    const [secondSciUnivCode, setSecondSciUnivCode] = useState({});
    const [gpaUnivCode, setGpaUnivCode] = useState({});
    const [finalUnivCode, setFinalUnivCode] = useState({});

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
            tag: 'cutLine',
            name: '최저 등급 확인',
        },
        {
            tag: 'availableMathSubject',
            name: '수학 가능 과목 선택',
        },
        {
            tag: 'availableSciSubject',
            name: '과학 출제 대학',
        },
        {
            tag: 'otherUniv',
            name: '그 외 논술 전형 대학',
        },
        {
            tag: 'gpaSuperior',
            name: '내신에 유리한 대학',
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


    const formattedSelectedUnivCode = useMemo(() => Object.keys(selectedUnivCode).filter((value) => selectedUnivCode[value]), [selectedUnivCode]);
    const formattedFirstSciUnivCode = useMemo(() => Object.keys(firstSciUnivCode).filter((value) => firstSciUnivCode[value]), [firstSciUnivCode]);
    const formattedSecondSciUnivCode = useMemo(() => Object.keys(secondSciUnivCode).filter((value) => secondSciUnivCode[value]), [secondSciUnivCode]);
    const formattedGpaUnivCode = useMemo(() => Object.keys(gpaUnivCode).filter((value) => gpaUnivCode[value]), [gpaUnivCode]);
    const formattedFinalUnivCode = useMemo(() => Object.keys(finalUnivCode).filter((value) => finalUnivCode[value]), [finalUnivCode]);
    const formattedFinalUnivs = useMemo(() => Object.values(finalUnivCode).filter((value) => value), [finalUnivCode]);


    const onNext = () => {
        if ([...formattedSelectedUnivCode, ...formattedFirstSciUnivCode, ...formattedSecondSciUnivCode].length < 1 || (page === 5 && formattedGpaUnivCode.length < 1) || (page > 5 && formattedFinalUnivCode.length < 1)) {
            alert('학교를 하나 이상 선택해주세요.');
            return;
        }
        setPage((prev) => prev + 1);
        window.scrollTo(0, 0);
    };

    const onPrev = () => {
        setPage((prev) => prev - 1);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        console.log('finalUniv', formattedFinalUnivs);
    }, [formattedFinalUnivs]);

    const addUnivCodes = (to, codes, item) => {
        const selectCodes = (from) => {
            from((prev) => {
                codes.map((code) => {
                    prev[String(code)] = item || true;
                    // const subStrings = Object.keys(prev).filter((key) => key.includes(code));
                    // subStrings.map((key) => (prev[String(key)] = true));
                });
                return { ...prev };
            });
        };

        switch (to) {
            case 'select':
                selectCodes(setSelectedUnivCode);
                break;
            case 'firstSci':
                selectCodes(setFirstSciUnivCode);
                break;
            case 'secondSci':
                selectCodes(setSecondSciUnivCode);
                break;
            case 'gpa':
                selectCodes(setGpaUnivCode);
                break;
            case 'final':
                selectCodes(setFinalUnivCode);
                break;
        }
    };

    const deleteUnivCodes = (to, codes) => {
        const selectCodes = (from) => {
            from((prev) => {
                codes.map((code) => {
                    prev[String(code)] = false;
                    // const subStrings = Object.keys(prev).filter((key) => key.includes(code));
                    // subStrings.map((key) => (prev[String(key)] = false));
                });
                return { ...prev };
            });
        };

        switch (to) {
            case 'select':
                selectCodes(setSelectedUnivCode);
                break;
            case 'firstSci':
                selectCodes(setFirstSciUnivCode);
                break;
            case 'secondSci':
                selectCodes(setSecondSciUnivCode);
                break;
            case 'gpa':
                selectCodes(setGpaUnivCode);
                break;
            case 'final':
                selectCodes(setFinalUnivCode);
                break;
        }
    };

    const renderPageTitles = useMemo(() => {
        console.log(page);
        return pageTitles.map((title) => (
            <td key={title.name} className={title.name === pageTitles[page].name ? styles.page_title_active : ''}>
                {title.name}
            </td>
        ));
    }, [page]);

    const renderContentComponent = () => {
        const Content = Components[pageTitles[page].tag];
        return <Content selectedUnivCode={formattedSelectedUnivCode} firstSciUnivCode={formattedFirstSciUnivCode} secondSciUnivCode={formattedSecondSciUnivCode} gpaUnivCode={formattedGpaUnivCode} finalUnivs={formattedFinalUnivs} finalUnivCode={formattedFinalUnivCode} userGrade={userGrade} setUserGrade={setUserGrade} userScore={userScore} setUserScore={setUserScore} addUnivCodes={addUnivCodes} deleteUnivCodes={deleteUnivCodes} />;
    };

    return (
        <UserAgentProvider ua={window.navigator.userAgent}>
        <div id={styles.contents}>
            <div id={styles.contents_inner}>
            <UserAgent computer>
                <nav id={styles.crumbs}>
                    <ol>
                        <li>
                            <a href='#' className={styles.c_gray_02}>
                                홈
                            </a>
                        </li>
                        <li>
                            <a href='#' className={styles.c_gray_02}>
                                논술 컨설팅
                            </a>
                        </li>
                        <li>
                            <a href='#' className={styles.fw_500}>
                                이과 논술
                            </a>
                        </li>
                    </ol>
                </nav>
                </UserAgent>
                <div id={styles.discuss}>
                <UserAgent computer>
                    <div id={styles.side_menu}>
                        <div className={styles.consult}>논술 컨설팅</div>
                        <ul className={styles.sub_menu}>
                            <li>
                                <a href='/nonsul/lib'>문과 논술</a>
                            </li>
                            <li>
                                <a className={styles.a_bold} href='/nonsul/sci'>
                                    이과 논술
                                </a>
                            </li>
                            <li>
                                <a href='/nonsul/med'>의치대 논술</a>
                            </li>
                            <li>
                            <a href='/nonsul/mypage'>나의 논술 지원</a>
                        </li>
                        </ul>
                    </div>
                    </UserAgent>
                    <div id={styles.discuss_contents}>
                        <section className={styles.list}>
                        <div className={styles.title_container} style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between' }}>
                            <p className={styles.discuss_tit1}>이과 논술</p>
                            </div>
                            <div className={styles.page_title_container}>
                            <table>
                                <tbody>
                                    <tr>{renderPageTitles}</tr>
                                </tbody>
                            </table>
                            </div>
                        </section>
                        <div className={styles.component_container}>
                        {renderContentComponent()}
                        </div>
                        <div className={styles.page}>
                            <button className={`${styles.btn} ${page == 0 ? styles.btn_disabled : styles.btn_active}`} onClick={onPrev} disabled={page == 0}>
                                이전 단계
                            </button>
                            <button className={`${styles.btn} ${page == pageTitles.length - 1 ? styles.btn_disabled : styles.btn_active}`} onClick={onNext} disabled={page == pageTitles.length - 1}>
                                다음 단계
                            </button>
                            <Link href="/paypage">
                                <Banner src='/assets/consulting_banner.png' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </UserAgentProvider>
    );
};

export default SciNonsul;
