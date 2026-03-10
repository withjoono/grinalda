import React from 'react';
import Link from 'next/link';

const SusiMenu = ({index, title, subtitle}) => {
  const links = ['jungsi-predict', 'option'];
  const icons = ['predictionlogo', 'paper'];
  const titles = [
    '정시 예측',
    '특별전형 자격확인',
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
            '정시 예측',
            '특별전형 자격확인',
          ].map((e, i) => (
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
