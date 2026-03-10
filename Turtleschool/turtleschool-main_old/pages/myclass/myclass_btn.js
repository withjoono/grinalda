import Link from 'next/link';
import React from 'react';

const Btn = index => {
  const button = ['home', 'pla', 'grade', 'simul', 'desk'];
  const navi = [
    '/myclass/home',
    '/myclass/planner',
    '/myclass/schoolgrades',
    '/myclass/simulatedtest',
    '/myclass/frontdesk',
  ];
  const name = ['마이클래스 홈', '플래너검사', '내신관리', '모의고사 관리', '프론트 데스크'];

  return (
    <div className="btn">
      <style jsx>{`
        .btn {
          width: 1280px;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
        }
        .btn input {
          width: 168px;
          height: 56px;
          border-radius: 12px;
          box-shadow: 0px 3px 12px #de6b3d;
          border: 0;
          background-color: #ffffff;
        }
        .btn input:hover {
          color: red;
        }

        .btn .active {
          color: red;
          width: 168px;
          height: 56px;
          border-radius: 12px;
          box-shadow: 0px 3px 12px #de6b3d;
          border: 0;
          background-color: #ffffff;
        }
      `}</style>

      {/* <Link href='/myclass/test'><input type="button" value="테스트"/></Link>
            <Link href='/myclass/health'><input type="button" value="체력검사"/></Link> */}

      {name.map((e, i) => (
        <>
          <Link href={navi[i]}>
            <input className={index == button[i] ? 'active' : ''} type="button" value={name[i]} />
          </Link>
        </>
      ))}
    </div>
  );
};

export default Btn;
