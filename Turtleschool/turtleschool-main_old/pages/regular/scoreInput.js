import {useRouter} from 'next/router';
import React, {useState, useEffect} from 'react';
import Component from '../../comp/regular/ScoreInput';
import SideNav from '../../comp/regular/sideNav';
import SideNavPage from '../../comp/template/SideNavPage';
import {useLoginCheck} from '../../src/hooks/useLoginCheck';
import {getPagePath} from '../../src/utils/getPagePath';

const ScoreInput = props => {
  const [isCanGoNextStep, setIsCanGoNextStep] = useState(false);
  const router = useRouter();
  useLoginCheck();
  var loginData = {
    id: '',
    name: '',
  };
  let loginInfo = props.loginInfo;

  loginData = {
    id: loginInfo.user[0],
    name: loginInfo.info[0],
  };

  const onClickGoBtn = () => {
    return isCanGoNextStep && router.push('/regular/earlyRegularStrategy');
  };

  return (
    <>
      <section>
        <SideNav />
        <Component
          loginData={loginData}
          isScoreAndTypeSaved={isScoreAndTypeSaved => setIsCanGoNextStep(isScoreAndTypeSaved)}
        />
        <button
          onClick={onClickGoBtn}
          disabled={!isCanGoNextStep}
          className={isCanGoNextStep ? 'nextBtn' : 'nextBtn dim'}
        >
          다음 단계
        </button>
      </section>
      <style jsx>{`
        section {
          position: relative;
          padding: 5rem 5rem 0 16rem;
        }
        .nextBtn {
          width: 8rem;
          height: 3rem;
          font-weight: bold;
          font-size: 0.75rem;
          line-height: 24px;
          background-color: #f2ce77;
          border-radius: 30px;
          color: #000000;
          margin: 0px auto 3rem;
          transform: translateX(-4rem);
          margin-top: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dim {
          background-color: #00000040;
          color: #00000080;
        }
        @media (max-width: 1024px) {
          section {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ScoreInput;
