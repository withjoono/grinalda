import {useRouter} from 'next/router';
import React from 'react';
import Component from '../../comp/regular/EarlyRegularStrategy';
import SideNav from '../../comp/regular/sideNav';
import SideNavPage from '../../comp/template/SideNavPage';

// const Analyse = () => {
//   return <Component />;
// };

// export default Analyse;

const EarlyRegualrStrategy = () => {
  const router = useRouter();

  return (
    <>
      <section>
        <SideNav />
        <Component />
        <button onClick={() => router.push('/regular/analyse')} className="nextBtn">
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
  );
};

export default EarlyRegualrStrategy;
