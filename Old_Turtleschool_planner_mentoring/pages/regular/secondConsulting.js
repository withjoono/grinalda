import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';
import { useRouter } from 'next/router';

import SideNavPage from '../../comp/template/SideNavPage';
import Components from '../../comp/regular/Consulting';

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

const SecondConsulting = () => {
    const [page, setPage] = useState(0);
    const [selectedUniv, setSelectedUniv] = useState({});

    const router = useRouter();
    
    useEffect(() => {
        console.log('selectedUniv', selectedUniv)
    }, [selectedUniv]);
    
    const renderNav = (titles) => (
        <NavContainer>
            {titles.map((title) => (
                <NavContent active={pageTitles[page].name === title.name}>{title.name}</NavContent>
            ))}
        </NavContainer>
    );

    const renderContentComponent = () => {
        const Content = Components[pageTitles[page].tag];
        return <Content type="나" selectedUniv={selectedUniv} onMajorClick={onMajorClick} onMajorsClick={onMajorsClick}/>;
    };

    const onMajorClick = (major) => {
        if (selectedUniv[`${major.universityid}-${major.major_cd}`]) {
            delete selectedUniv[`${major.universityid}-${major.major_cd}`];
            setSelectedUniv({...selectedUniv});
        } else {
            setSelectedUniv(prev => ({
                ...prev,
                [`${major.universityid}-${major.major_cd}`]: major,
            }))
        }
    }

    const onMajorsClick = ({target}, majors) => {
        console.log(target.checked, majors)
        majors.forEach(major => {
            if(target.checked) {
                setSelectedUniv(prev => ({
                    ...prev,
                    [`${major.universityid}-${major.major_cd}`]: major,
                }))
            } else {
                delete selectedUniv[`${major.universityid}-${major.major_cd}`];
                setSelectedUniv({...selectedUniv});
            }
        });
    }

    return (
        <UserAgentProvider ua={window.navigator.userAgent}>
            <UserAgent computer>
                <SideNavPage
                    routes={['홈', '정시 합격 예측', '나군 컨설팅']}
                    navTitle='정시 합격 예측'
                    currentPage={pageTitles[page].name}
                    navSubs={[
                        { title: '성적입력', url: '/regular/scoreInput' },
                        { title: '성적분석', url: '/regular/analyse' },
                        { title: '가군 컨설팅', url: '/regular/firstConsulting' },
                        { title: '나군 컨설팅', url: '/regular/secondConsulting' },
                        { title: '다군 컨설팅', url: '/regular/thirdConsulting' },
                        { title: '모의지원현황', url: '/regular/mockApply' },
                    ]}>
                    {renderNav(pageTitles)}
                    {renderContentComponent()}
                    <NavButtonContainer>
                        <NavButton disabled={page === 0} active={page !== 0} onClick={() => setPage((prev) => prev - 1)}>
                            {'이전 단계'}
                        </NavButton>
                        <NavButton
                            active={true}
                            onClick={() => {
                                if (page === 4) {
                                    router.push('/regular/thirdConsulting');
                                } else {
                                    setPage((prev) => prev + 1);
                                }
                            }}>
                            {page === 4 ? '다군 컨설팅 바로가기' : '다음 단계'}
                        </NavButton>
                    </NavButtonContainer>
                </SideNavPage>
            </UserAgent>
            <UserAgent mobile>
                <SideNavPage routes={['홈', '정시 합격 예측', '나군 컨설팅']} navTitle='정시 합격 예측 - 나군 컨설팅' currentPage={pageTitles[page].name} navSubs={pageTitles.map((title) => ({ title: title.name, url: '#' }))}>
                    {renderContentComponent()}
                    <NavButtonContainer>
                        <NavButton disabled={page === 0} active={page !== 0} onClick={() => setPage((prev) => prev - 1)}>
                            {'이전 단계'}
                        </NavButton>
                        <NavButton
                            active={true}
                            onClick={() => {
                                if (page === 4) {
                                    router.push('/regular/thirdConsulting');
                                } else {
                                    setPage((prev) => prev + 1);
                                }
                            }}>
                            {page === 4 ? '다군 컨설팅 바로가기' : '다음 단계'}
                        </NavButton>
                    </NavButtonContainer>
                </SideNavPage>
            </UserAgent>
        </UserAgentProvider>
    );
};

export default SecondConsulting;

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
    background-color: ${(props) => (props.active ? '#E9E9E9' : '#FFFFFF')};
    border: 1px solid ${(props) => (props.active ? '#9A9A9A' : '#D9D9D9')};
    font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
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
    background-color: ${(props) => (props.active ? '#F2CE77' : '#E9E9E9')};
    border-radius: 30px;
    color: ${(props) => (props.active ? '#000000' : '#9A9A9A')};
    margin: 0px 10px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
