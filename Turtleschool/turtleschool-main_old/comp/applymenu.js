import React from 'react'
import Link from 'next/link';

const SusiMenu = ({index, title, subtitle}) => {
  const links = ['interesteduniv', 'strategy', 'mouiapply'];
  const icons = ['school', 'univfolder', 'univfolder'];
  const titles = [
    '관심 대학',
    '전략 수립',
    '모의 지원',
  ];
  return (
    <>
      <div className="panel3">
        <div className="title3">
          {title}
        </div>
      </div>
      <div className="bigmenu3">
        <div>
          {[
            '관심 대학',
            '전략 수립',
            '모의 지원',
          ].map((e, i) => (
            <Link href={links[i] == '' ? '' : '/early/' + links[i]}>
              <div style={index == i ? {background: "white"} : { padding: "1%" }}>
                <button>
                  <div>
                    <img
                      src={'https://img.ingipsy.com/assets/' + icons[i] + '.png'}
                      style={{height: '40px'}}
                    />
                  </div>
                  {e}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SusiMenu;
