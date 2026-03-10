import React from 'react';
import {useState} from 'react';
import Analyse from './analyse';
import ScoreInput from './scoreInput';
import FirstConsulting from './firstConsulting';
import SecondConsulting from './secondConsulting';
import ThirdConsulting from './thirdConsulting';
import MockApply from './mockApply';
import SideNav from '../../comp/regular/sideNav';
import {useEffect} from 'react';
import {useRouter} from 'next/router';

const Page = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/regular/scoreInput');
  }, []);

  return (
    <>
      <section>
        <SideNav></SideNav>
      </section>
      <style jsx>{`
        section {
          position: relative;
          padding: 5rem 5rem 0 16rem;
        }
        .sideNav {
          display: flex;
          position: absolute;
          left: 3rem;
          flex-direction: column;
          align-items: flex-start;
        }
        .sideNav button {
          width: 10rem;
          height: 2.5rem;
          justify-content: flex-start;
          align-items: center;
          display: flex;
          padding: 0 0 0 0.4rem;
          font-size: 0.8rem;
          transition: 300ms ease-in-out;
        }
        .sideNav button:hover {
          background: #f45119;
          color: #fff;
        }
        .sideNav button.on {
          background: #f45119;
          color: #fff;
          font-weight: bold;
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
      `}</style>
    </>
  );
};

export default Page;
