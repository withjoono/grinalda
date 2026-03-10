import React, { useState } from 'react';
import SideNavPage from '../../../comp/template/SideNavPage';
import styled from 'styled-components';

import Learning from '../../../comp/planner/status/Learning';
import Class from '../../../comp/planner/status/Class';

const Status = ({  }) => {
    const [selectedTab, setSelectedTab] = useState("학습현황");

    const onTabClick = ({ target }) => {
        setSelectedTab(target.id);
    }

    const renderComponent = () => {
        switch(selectedTab) {
            case "학습현황":
                return <Learning/>
            case "수업현황":
                return <Class/>
        }
    }

    return (
        <SideNavPage routes={["홈", "플래너&멘토링", "학습현황/수업현황"]}
                     navTitle="플래너/멘토링"
                     navSubs={[
                        {   title: '장기 학습/수업 계획',
                            url: '/planner/plan'
                        },
                        {   title: '금일 성취현황 및 멘토링',
                            url: '/planner/result'
                        },
                        {
                            title: '학습/수업 누적현황',
                            url: '/planner/status',
                        },
                        {
                            title: '멘토관리반',
                            url: '/myclass/planner',
                        }
                        ]}>
            <h1>Page not found</h1>
        </SideNavPage>
    )
}

export default Status;

// styles

const TabContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 30px;
`;

const TabContent = styled.button`
    padding: 10px 0px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    color: ${props => props.active ? "#C86F4C" : "#C2C2C2"};
    font-size: 24px;
    line-height: 32px;
    font-weight: 800;
    border: ${props => props.active ? "1px solid #C86F4C" : "1px solid #C2C2C2"};

    @media (max-width: 420px) {
        font-weight: 800;
        font-size: 16px;
        line-height: 18px;
    }
`;
