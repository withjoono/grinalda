import React from 'react';
import styled from 'styled-components';

import SideNavPage from '../../comp/template/SideNavPage';
import Component from '../../comp/regular/MockApply';

const MockApply = () => {
    return (
        <SideNavPage routes={["홈", "정시 합격 예측", "모의지원"]}
        navTitle="정시 합격 예측"
        navSubs={[
            {title: "성적입력", url: "/regular/scoreInput"},
            {title: "성적분석", url: "/regular/analyse"}, 
            {title: "가군 컨설팅", url: "/regular/firstConsulting"},
            {title: "나군 컨설팅", url: "/regular/secondConsulting"}, 
            {title: "다군 컨설팅", url: "/regular/thirdConsulting"}, 
            {title: "모의지원 현황", url: "/regular/mockApply"}
        ]}>
            <Component/>
        </SideNavPage>
    );
};

export default MockApply;
