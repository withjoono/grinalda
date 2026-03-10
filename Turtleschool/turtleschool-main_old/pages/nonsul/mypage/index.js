import axios from 'axios';
import React, {useEffect, useState} from 'react';
import History from '../../../comp/nonsul/mypage/components/history';
import SideBar from '../../early/sidebar/SideBar';
import styles from './index.module.css';

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
  }, []);

  const _getHistory = division => {
    const query = {
      division,
    };

    axios
      .get('/api/essay/tab_select', {
        headers: {auth: localStorage.getItem('uid')},
        params: query,
        // cancelToken: request.current?.token,
      })
      .then(res => {
        const arr = res.data.data;
        switch (division) {
          case 0:
            setHistory(prev => ({
              ...prev,
              lib: arr,
            }));
            break;
          case 1:
            setHistory(prev => ({
              ...prev,
              sci: arr,
            }));
            break;
          case 2:
            setHistory(prev => ({
              ...prev,
              med: arr,
            }));
            break;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

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
                나의 논술 지원
              </a>
            </li>
          </ol>
        </nav>
        <div id={styles.discuss}>
          <div id={styles.side_menu}>
            <SideBar state={true}/>
          </div>
          <div id={styles.discuss_contents}>
            <section className={styles.list}>
              <p className={styles.discuss_tit1}>나의 논술 지원</p>
            </section>
            <History
              lowList={history.low}
              libList={history.lib}
              sciList={history.sci}
              medList={history.med}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
