import Link from 'next/link';

const MouiMenu = ({index, title, subtitle}) => {
  const links = ['inputchoice', 'mygrade', 'graph', 'university', 'prediction'];
  const icons = ['input', 'analysis', 'graph', 'predictionlogo', 'search', 'goal'];
  const titles = [
    '채점하기/점수 입력',
    '성적 분석',
    '오답 분석',
    '대학 예측 및 검색',
    '목표 대학',
  ];
  return (
    <>

      <div className="panel4">
        <div className="title_moi">{titles[index]}</div>
      </div>
      
    </>
    
  );
};

export default MouiMenu;
