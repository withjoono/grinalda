import React from 'react';
import Component from '../../comp/regular/Analyse';
import SideNav from '../../comp/regular/sideNav';
import SideNavPage from '../../comp/template/SideNavPage';
import {getPagePath} from '../../src/utils/getPagePath';
import {useRouter} from 'next/router';
import {usePayCheck} from '../../src/hooks/usePayCheck';
// const Analyse = () => {
//   return <Component />;
// };

// export default Analyse;

const Analyse = (userScore) => {
  const {isPayUser} = usePayCheck();

  console.log('userScore : ', userScore);
  const router = useRouter();
  const routerPush = path => {
    router.push(getPagePath(path));
  };

  if (!isPayUser) return <section></section>;
  else
    return (
      // <SideNavPage
      //   routes={['홈', '정시 합격 예측', '성적입력']}
      //   navTitle="정시 합격 예측"
      //   navSubs={[
      //     {title: '성적입력', url: '/regular/scoreInput'},
      //     {title: '성적분석', url: '/regular/analyse'},
      //     {title: '가군 컨설팅', url: '/regular/firstConsulting'},
      //     {title: '나군 컨설팅', url: '/regular/secondConsulting'},
      //     {title: '다군 컨설팅', url: '/regular/thirdConsulting'},
      //     {title: '모의지원현황', url: '/regular/mockApply'},
      //   ]}
      // >
      <>
        <section>
          <SideNav />
          <Component userScore={userScore}/>
          <button className="nextBtn" onClick={() => routerPush('firstConsulting')}>
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
          @media (max-width: 1024px) {
            section {
              padding: 1rem 1rem;
            }
          }
        `}</style>
      </>
      // </SideNavPage>
    );
};

export default Analyse;
