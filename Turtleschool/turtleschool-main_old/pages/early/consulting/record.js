import {UserAgent, UserAgentProvider} from '@quentin-sommer/react-useragent';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Components from '../../../comp/regular/Consulting';
import SideNavPage from '../../../comp/template/SideNavPage';

const pageTitles = [
  {
    tag: 'CheckApplyType',
    name: '특별 전형 자격 확인',
  },
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
    name: '유불리 지수',
  },
];

const RecordConsulting = () => {
  const [page, setPage] = useState(0);
  const [selectedUniv, setSelectedUniv] = useState({});

  const router = useRouter();

  useEffect(() => {}, [selectedUniv]);

  const renderNav = titles => (
    <NavContainer>
      {titles.map((title, i) => (
        <NavContent active={pageTitles[page].name === title.name} key={i}>
          {title.name}
        </NavContent>
      ))}
    </NavContainer>
  );

  const renderContentComponent = () => {
    const Content = Components[pageTitles[page].tag];
    return (
      <Content
        type="학종"
        selectedUniv={selectedUniv}
        onMajorClick={onMajorClick}
        onMajorsClick={onMajorsClick}
      />
    );
  };

  const onMajorClick = major => {
    if (selectedUniv[`${major.universityid}-${major.major_cd}`]) {
      delete selectedUniv[`${major.universityid}-${major.major_cd}`];
      setSelectedUniv({...selectedUniv});
    } else {
      setSelectedUniv(prev => ({
        ...prev,
        [`${major.universityid}-${major.major_cd}`]: major,
      }));
    }
  };

  const onMajorsClick = ({target}, majors) => {
    majors.forEach(major => {
      if (target.checked) {
        setSelectedUniv(prev => ({
          ...prev,
          [`${major.universityid}-${major.major_cd}`]: major,
        }));
      } else {
        delete selectedUniv[`${major.universityid}-${major.major_cd}`];
        setSelectedUniv({...selectedUniv});
      }
    });
  };

  return (
    <UserAgentProvider ua={window.navigator.userAgent}>
      <UserAgent computer>
        <SideNavPage
          routes={['홈', '수시 합격 예측', '학종 컨설팅']}
          navTitle="수시 합격 예측"
          currentPage={pageTitles[page].name}
          navSubs={[
            {title: '성적입력', url: '/'},
            {title: '교과분석', url: '/'},
            {title: '비교과분석', url: '/'},
            {title: '학종 컨설팅', url: '/early/consulting/record'},
            {title: '교과 컨설팅', url: '/early/consulting/subject'},
            {title: '논술 컨설팅', url: '/nonsul/sci'},
            {title: '전략수립 및 모의지원', url: '/'},
          ]}
        >
          {renderNav(pageTitles)}
          {renderContentComponent()}
          <NavButtonContainer>
            <NavButton
              disabled={page === 0}
              active={page !== 0}
              onClick={() => setPage(prev => prev - 1)}
            >
              {'이전 단계'}
            </NavButton>
            <NavButton
              disabled={page === 4}
              active={page !== 4}
              onClick={() => setPage(prev => prev + 1)}
            >
              {'다음 단계'}
            </NavButton>
          </NavButtonContainer>
        </SideNavPage>
      </UserAgent>
      <UserAgent mobile>
        <SideNavPage
          routes={['홈', '수시 합격 예측', '학종 컨설팅']}
          navTitle="수시 합격 예측 - 학종 컨설팅"
          currentPage={pageTitles[page].name}
          navSubs={pageTitles.map(title => ({title: title.name, url: '#'}))}
        >
          {renderContentComponent()}
          <NavButtonContainer>
            <NavButton
              disabled={page === 0}
              active={page !== 0}
              onClick={() => setPage(prev => prev - 1)}
            >
              {'이전 단계'}
            </NavButton>
            <NavButton
              disabled={page === 4}
              active={page !== 4}
              onClick={() => setPage(prev => prev + 1)}
            >
              {'다음 단계'}
            </NavButton>
          </NavButtonContainer>
        </SideNavPage>
      </UserAgent>
    </UserAgentProvider>
  );
};

export default RecordConsulting;

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-top: 1px solid black;
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
  min-width: 155px;
  padding: 0px 16px;
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
