import React,{useState} from 'react';
import withPayment from '../../comp/paymentwrapper';
import Menu from '../../comp/searchmenu';
import SideNavPage from '../../comp/template/SideNavPageSusi';
import Buttons from '../early/Buttons/Buttons';

const EarlyOptions = () => {
  const [options, setOptions] = useState(Array(15).fill(false));
  const names = [
    '대학별 독자적 기준',
    '고른기회 특별전형',
    '특기자',
    '농어촌 학생',
    '특성화고교 졸업자',
    '특성화고 등을 졸업한 재직자',
    '기초생활수급자, 차상위계층, 한부모가족 지원대상자',
    '장애인 등 대상자',
    '산업대 위탁생',
    '서해 5도',
    '제주특별자치도 특별전형',
    '계약학과',
    '위탁교육생',
    '군위탁생',
    '재외국민 및 외국인',
  ];

  const handleOptions = e => {
    options[e.target.id] = !options[e.target.id];
    setOptions([...options]);
  };

  return (
    <SideNavPage 
      routes={['홈', '수시 컨설팅', '유리한 조건 찾기']}
      navTitle="유리한 조건 찾기"
      navSubs={[
        {title: '1.교과/비교과 분석', url: '/early/input'},
        {title: '2.유리한 조건 찾기', url: '/early/jungsi-predict'},
        {title: '3.학종 컨설팅', url: '/early/Consulting1'},
        {title: '4.교과 컨설팅', url: '/early/Consulting2'},
        {title: '5.논술 컨설팅', url: '/nonsul/sci'},
        {title: '6.전략수립 및 모의지원', url: '/early/strategy'},
      ]}
    >
    <div style={{backgroundColor: '#FAFAFA'}}>
      <Menu title="유리한 조건 찾기" index={1} />
      <div style={{width: '100%', margin: '0 auto'}}>
        <div style={{height: '45px', width: '100%'}} />
        <span className="title_left">특별 전형 정원내</span>
        <div style={{display: 'flex', marginRight: '-40px'}} onClick={handleOptions}>
          {options.map((e, i) =>
            i < 3 ? (
              <div
                className="desktop_option"
                id={i}
                style={!e ? undefined : {backgroundColor: '#FCBF77'}}
              >
                <img
                  src={
                    'https://img.ingipsy.com/assets/icons/checkbox' + (e ? '_active' : '') + '.svg'
                  }
                  width={27}
                  height={27}
                />
                <p>{names[i]}</p>
              </div>
            ) : null,
          )}
        </div>
        <div style={{height: '45px', width: '100%'}} />
        <span className="title_left">특별 전형 정원외</span>
        <div
          style={{display: 'flex', marginRight: '-40px', flexWrap: 'wrap', marginBottom: '30px'}}
          onClick={handleOptions}
        >
          {options.map((e, i) =>
            i >= 3 ? (
              <div
                className="desktop_option"
                id={i}
                style={!e ? undefined : {backgroundColor: '#FCBF77'}}
              >
                <img
                  src={
                    'https://img.ingipsy.com/assets/icons/checkbox' + (e ? '_active' : '') + '.svg'
                  }
                  width={27}
                  height={27}
                />
                <p>{names[i]}</p>
              </div>
            ) : null,
          )}
        </div>
        <div className="desktop_btn">수정하기</div>
      </div>
      <Buttons prevPage='/early/jungsi-predict' nextPage='/early/Consulting1' />
    </div>
    </SideNavPage>
  );
};

export default withPayment(EarlyOptions, null, '수시');
