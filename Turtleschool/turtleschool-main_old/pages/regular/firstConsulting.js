import {UserAgent, UserAgentProvider} from '@quentin-sommer/react-useragent';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Components from '../../comp/regular/Consulting';
import SideNav from '../../comp/regular/sideNav';
import SideNavPage from '../../comp/template/SideNavPage';
import {usePayment} from '../../src/api/query';
import {usePayCheck} from '../../src/hooks/usePayCheck';
import {mainData} from '../../common/subjectCalc/calc';

import CircularProgress from '@mui/material/CircularProgress';

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  /* border-top: 1px solid black; */
  height: 100px;
  margin-bottom: 36px;
`;

const NavContent = styled.div`
  display: flex;
  flex: 1;
  background-color: ${props => (props.active ? '#E9E9E9' : '#FFFFFF')};
  /* border: 1px solid ${props => (props.active ? '#9A9A9A' : '#D9D9D9')}; */
  font-weight: ${props => (props.active ? 'bold' : 'normal')};
  font-size: 16px;
  line-height: 24px;
  background: red;
  align-items: center;
  justify-content: center;
`;

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

const NavButtonContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  margin: 100px auto;
`;

const NavButton = styled.button`
  min-width: 7.75rem;
  padding: 0px 0.8rem;
  height: 2.8rem;
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1.2rem;
  background-color: ${props => (props.active ? '#F2CE77' : '#E9E9E9')};
  border-radius: 1.5rem;
  color: ${props => (props.active ? '#000000' : '#9A9A9A')};
  margin: 0px 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

const FirstConsulting = (props) => {
  const {isPayUser} = usePayCheck();

  const [page, setPage] = useState(0);
  const [selectedUniv, setSelectedUniv] = useState({});

  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        type="가"
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



  const movePage = isNext => {
    const nextPage = page + isNext;
    if (nextPage >= 0 && nextPage < 4) {
      setPage(nextPage);
    } else if (nextPage === 4) {
      router.push('/regular/secondConsulting');
    }
  };

  if (!isPayUser) return <section></section>;

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
              <NavButton active={true} onClick={() => movePage(1)}>
                {page === 3 ? '나군 컨설팅 바로가기' : '다음 단계'}
              </NavButton>
            </NavButtonContainer>
          </UserAgent>
          <UserAgent mobile>
            <SideNavPage
              routes={['홈', '정시 합격 예측', '가군 컨설팅']}
              navTitle="정시 합격 예측 - 가군 컨설팅"
              currentPage={pageTitles[page].name}
              navSubs={pageTitles.map(title => ({title: title.name, url: '#'}))}
            >
              {renderContentComponent()}
              <NavButtonContainer>
                <NavButton disabled={page === 0} active={page !== 0} onClick={() => movePage(-1)}>
                  {'이전 단계'}
                </NavButton>
                <NavButton
                  active={true}
                  onClick={() => {
                    if (page === 3) {
                      router.push('/regular/secondConsulting');
                    } else {
                      movePage(1);
                    }
                  }}
                >
                  {page === 3 ? '나군 컨설팅 바로가기' : '다음 단계'}
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
          min-height: 100vh;
          min-widht: 99vw;
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
      `}</style>
    </>
  );
};

export default FirstConsulting;
