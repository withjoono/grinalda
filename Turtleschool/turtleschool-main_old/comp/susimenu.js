import Link from 'next/link';

const SusiMenu = ({index, title, subtitle}) => {
  const links = ['input', 'analysis', 'option', 'regular', 'university', 'strategy'];
  const icons = ['input', 'analysis', 'paper', 'predictionlogo', 'univfolder', 'board'];
  const titles = [
    '수시 성적입력',
    '수시 교과 분석',
    '수시 특별전형 자격확인',
    '정시 가능 대학',
    '전형별 대학 에측 및 검색',
    '관심 대학 및 모의지원',
  ];
  return (
    <>
      <div className="panel">
        <div className="title">{titles[index]}</div>
      </div>
      <div className="bigmenu">
        <div>
          {[
            '성적입력',
            '교과 분석',
            '특별전형 자격확인',
            '정시 가능 대학',
            '전형별 대학 에측 및 검색',
            '관심 대학 및 모의지원',
          ].map((e, i) => (
            <Link href={links[i] == '' ? '' : '/early/' + links[i]}>
              <button className={index == i ? 'bigmenu_active' : ''}>
                <div>
                  <img
                    src={'https://img.ingipsy.com/assets/' + icons[i] + '.png'}
                    style={{height: '40px'}}
                  />
                </div>
                {e}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default SusiMenu;
