import React, { useState, useCallback, useMemo, useEffect } from 'react';
import styles from './index.module.css';
import axios from 'axios';
import History from '../../../comp/nonsul/mypage/components/history';

const MyPage = () => {
    const [history, setHistory] = useState({
        lib: [],
        sci: [],
        med: [],
        low: [],
    });

    useEffect(() => {
        _getHistory(0);
        _getHistory(1);
        _getHistory(2);
    }, [])

    const _getHistory = (division) => {
        const query = {
            division,
        };

        axios
            .get('/api/essay/tab_select', {
                headers: { auth: localStorage.getItem('uid') },
                params: query,
                // cancelToken: request.current?.token,
            })
            .then((res) => {
                const arr = res.data.data;
                console.log('mypage', res)
                switch (division) {
                    case 0:
                        setHistory((prev) => ({
                            ...prev,
                            lib: arr,
                        }));
                        break;
                    case 1:
                        setHistory((prev) => ({
                            ...prev,
                            sci: arr,
                        }));
                        break;
                    case 2:
                        setHistory((prev) => ({
                            ...prev,
                            med: arr,
                        }));
                        break;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div id={styles.contents}>
            <div id={styles.contents_inner}>
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
                                나의 논술 지원
                            </a>
                        </li>
                    </ol>
                </nav>
                <div id={styles.discuss}>
                    <div id={styles.side_menu}>
                        <div className={styles.consult}>논술 컨설팅</div>
                        <ul className={styles.sub_menu}>
                            <li>
                                <a href='/nonsul/lib'>언어 논술</a>
                            </li>
                            <li>
                                <a href='/nonsul/sci'>이과 논술</a>
                            </li>
                            <li>
                                <a href='/nonsul/med'>의치대 논술</a>
                            </li>
                            <li>
                                <a className={styles.a_bold} href='/nonsul/mypage'>
                                    나의 논술 지원
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div id={styles.discuss_contents}>
                        <section className={styles.list}>
                            <p className={styles.discuss_tit1}>나의 논술 지원</p>
                        </section>
                        <History lowList={history.low} libList={history.lib} sciList={history.sci} medList={history.med}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;
