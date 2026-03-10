import {UserAgent, UserAgentProvider} from '@quentin-sommer/react-useragent';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Components from '../../comp/regular/Consulting';
import SideNav from '../../comp/regular/sideNav';
import SideNavPage from '../../comp/template/SideNavPage';
import {usePayCheck} from '../../src/hooks/usePayCheck';
import {mainData} from '../../common/subjectCalc/calc';
import {codeTable,codeNameTable} from '../../common/code'; 

import CircularProgress from '@mui/material/CircularProgress';


const ArrowPointer = styled.div`
  width: 250px;
  height: 50px;
  background-color: ${props => (props.isOn ? '#32557f' : '#D4D4D4')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.isOn ? 'white' : 'gray')};
  cursor: auto;
  &:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 25px solid
      ${props => (props.index === 0 ? 'transparent' : props.arrowIsOn ? '#32557f' : '#D4D4D4')};
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }

  &:before {
    content: '';
    position: absolute;
    right: -25px;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 25px solid ${props => (props.isOn ? '#32557f' : '#D4D4D4')};
    border-top: 25px solid transparent;
    border-bottom: 25px solid transparent;
  }
`;

const pageTitles = [
  {
    tag: 'SearchUniv',
    name: '대학별 검색',
  },
  {
    tag: 'SearchMajor',
    name: '학과별 검색',
  },
  {
    tag: 'SearchCross',
    name: '교차지원 검색',
  },
  {
    tag: 'CheckPriority',
    name: '나에게 유리한 대학 찾기',
  },
];

const ThirdConsulting = (props) => {
  const [page, setPage] = useState(0);
  const [selectedUniv, setSelectedUniv] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {isPayUser} = usePayCheck();
  if (!isPayUser) return <section></section>;

  var loginData = {
    id : '',
    name : '',

  };
    let loginInfo = props?.loginInfo;
    let userScore = props?.userScore;
    
  
    loginData = {
       id : loginInfo.user[0],
       name : loginInfo.info[0],     

    };

  const movePage = isNext => {
    const nextPage = page + isNext;
    if (nextPage >= 0 && nextPage < 4) {
      setPage(nextPage);
    } else if (nextPage === 4) {
      router.push('/regular/univOfInterest');
    }
  };


  const loadingBar = () => {
    return (
     
        <CircularProgress color="inherit" />
     
    );
  }

  const renderNav = titles => (
    <NavContainer>
      {titles.map((title, i) => (
        <ArrowPointer isOn={page === i} arrowIsOn={page + 1 === i} index={i}>
          <p> {title.name}</p>
        </ArrowPointer>
      ))}
    </NavContainer>
  );

  const renderContentComponent = () => {
    const Content = Components[pageTitles[page].tag];
    return (
      <Content
        type="다"
        loginData={loginData}
        userScore={userScore}
        selectedUniv={selectedUniv}
        onMajorClick={onMajorClick}
        onMajorsClick={onMajorsClick}  
         loading={loading}
        loadingBar={loadingBar}
        setLoading={setLoading}
      />
    );
  };

  const onMajorClick = major => {
    if (selectedUniv[`${major.대학교}-${major.모집단위}`]) {
      delete selectedUniv[`${major.대학교}-${major.모집단위}`];
      setSelectedUniv({...selectedUniv});
    
    } else {
      setSelectedUniv(prev => ({
        ...prev,
        [`${major.대학교}-${major.모집단위}`]: major,
      }));

     
    }
  };

  const onMajorsClick = ({target}, majors) => {
    
    majors.forEach(major => {
      if (target.checked) {
        setSelectedUniv(prev => ({
          ...prev,
          [`${major.대학교}-${major.모집단위}`]: major,
        }));
      } else {
        delete selectedUniv[`${major.대학교}-${major.모집단위}`];
        setSelectedUniv({...selectedUniv});
      }
    });
  };

  
  return (
    <>
      <section>
        <SideNav />
        <UserAgentProvider ua={window.navigator.userAgent}>
          <UserAgent computer>
            {renderNav(pageTitles)}
            {renderContentComponent()}
            <NavButtonContainer>
              <NavButton disabled={page === 0} active={page !== 0} onClick={() => movePage(-1)}>
                {'이전 단계'}
              </NavButton>
              <NavButton active={page !== 4} onClick={() => movePage(1)}>
                {page === 3 ? '관심대학 모아보기' : '다음 단계'}
              </NavButton>
            </NavButtonContainer>
          </UserAgent>
          <UserAgent mobile>
            <SideNavPage
              routes={['홈', '정시 합격 예측', '다군 컨설팅']}
              navTitle="정시 합격 예측 - 다군 컨설팅"
              currentPage={pageTitles[page].name}
              navSubs={pageTitles.map(title => ({title: title.name, url: '#'}))}
            >
              {renderContentComponent()}
              <NavButtonContainer>
                <NavButton disabled={page === 0} active={page !== 0} onClick={() => movePage(-1)}>
                  {'이전 단계'}
                </NavButton>
                <NavButton disabled={page === 4} active={page !== 4} onClick={() => movePage(1)}>
                  {'다음 단계'}
                </NavButton>
              </NavButtonContainer>
            </SideNavPage>
          </UserAgent>
        </UserAgentProvider>
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
      `}</style>{' '}
    </>
  );
};

export default ThirdConsulting;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100px;
  margin-bottom: 36px;
`;

const NavContent = styled.div`
  display: flex;
  flex: 1;
  background-color: ${props => (props.active ? '#E9E9E9' : '#FFFFFF')};
  border: 1px solid ${props => (props.active ? '#9A9A9A' : '#D9D9D9')};
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  justify-content: center;
`;

const NavButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  margin: 100px auto;
`;

const NavButton = styled.button`
  width: 155px;
  height: 56px;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  background-color: ${props => (props.active ? '#F2CE77' : '#E9E9E9')};
  border-radius: 30px;
  color: ${props => (props.active ? '#000000' : '#9A9A9A')};
  margin: 0px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
