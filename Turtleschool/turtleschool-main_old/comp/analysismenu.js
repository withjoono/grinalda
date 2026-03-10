import React from 'react'
import Link from 'next/link';

const SusiMenu = ({index, title, subtitle}) => {
  const links = ['input', 'analysis', 'graph'];
  const icons = ['input', 'analysis', 'graph'];
  const titles = [
    '성적 입력',
    '교과 분석',
    '비교과 분석',
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
          {titles.map((e, i) => (
            <Link href={links[i] == '' ? '' : '/early/' + links[i]} key={i} passHref>
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
