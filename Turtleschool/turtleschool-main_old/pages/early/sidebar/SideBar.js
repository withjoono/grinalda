import React, {useState} from 'react';
import {useRouter} from 'next/router';
import styles from './index.module.css';

const SideBar = ({state}) => {
  const router = useRouter();
  const [shownonsul, setShownonsul] = useState(state);
  const controlNonsul = () => {
    setShownonsul(!shownonsul);
  };
  const routePage = e => {
    e.preventDefault();
    router.push(e.target.href);
  };
  return (
    <>
      <div id={styles.side_menu}>
        <ul className={styles.sub_menu}>
          {/* <li>
            <a onClick={routePage} href="/early/input">
              1.교과/비교과 분석
            </a>
          </li>
          <li>
            <a onClick={routePage} href="/early/jungsi-predict">
              2.유리한 조건 찾기
            </a>
          </li>
          <li>
            <a onClick={routePage} href="/early/Consulting1">
              3.학종 컨설팅
            </a>
          </li>
          <li>
            <a onClick={routePage} href="/early/Consulting2">
              4.교과 컨설팅
            </a>
          </li> */}
          <li>
            <div style={{cursor: 'pointer'}} onClick={controlNonsul}>
              논술 컨설팅
            </div>
            <ul>
              <li>
                <a onClick={routePage} href="/nonsul/lib">
                  - 문과 논술
                </a>
              </li>
              <li>
                <a onClick={routePage} href="/nonsul/sci">
                  - 이과 논술
                </a>
              </li>
              <li>
                <a onClick={routePage} href="/nonsul/med">
                  - 의치대 논술
                </a>
              </li>
              <li>
                <a onClick={routePage} href="/nonsul/mypage">
                  - 나의 논술 지원
                </a>
              </li>
            </ul>
          </li>
          {/* <li>
            <a onClick={routePage} href="/early/strategy">
              6.전략수립 및 모의지원
            </a>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default SideBar;
