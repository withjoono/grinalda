import Link from 'next/link';
import React from 'react';

const sideNavs = [
  { title: '성적입력', link: 'scoreInput' },
  { title: '수시정시 전략', link: 'earlyRegularStrategy' },
  { title: '성적분석', link: 'analyse' },
  { title: '가군 컨설팅', link: 'firstConsulting' },
  { title: '나군 컨설팅', link: 'secondConsulting' },
  { title: '다군 컨설팅', link: 'thirdConsulting' },
  { title: '관심대학', link: 'univOfInterest' },
];

const sideNavSetting = [
  { title: '정시전략', link: '' },
  { title: '모의지원', link: '' },
  { title: '대학 경쟁률 검색', link: '' },
  { title: '(추가모집 - 2월말)', link: '' },
];

const SideNav = ({ nowStep }) => {
  const url = document.URL.split('/');
  return (
    <>
      <div className="sideNav">
        {sideNavs.map((nav, index) => {
          return (
            <Link key={nav.title + nav.link} href={nav.link}>
              <button className={url[url.length - 1] === nav.link ? 'on' : ''} title={nav.title}>
                {nav.title}
              </button>
            </Link>
          );
        })}
        {/* {sideNavSetting.map((nav, index) => {
          return (
            <button
              onClick={() => alert('해당기능은 12/9일 오픈 예정입니다.')}
              className={url[url.length - 1] === nav.link ? 'on' : ''}
              title={nav.title}
            >
              {nav.title}
            </button>
          );
        })} */}
      </div>
      <style jsx>{`
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
        @media (max-width: 1024px) {
          .sideNav {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default SideNav;
