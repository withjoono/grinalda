import React from 'react';
import Component from '../../comp/regular/MockApply';
import SideNavPage from '../../comp/template/SideNavPage';

const MockApply = () => {
  return (
    // <SideNavPage
    //   routes={['홈', '정시 합격 예측', '모의지원']}
    //   navTitle="정시 합격 예측"
    //   navSubs={[
    //     {title: '성적입력', url: '/regular/scoreInput'},
    //     {title: '성적분석', url: '/regular/analyse'},
    //     {title: '가군 컨설팅', url: '/regular/firstConsulting'},
    //     {title: '나군 컨설팅', url: '/regular/secondConsulting'},
    //     {title: '다군 컨설팅', url: '/regular/thirdConsulting'},
    //     {title: '모의지원 현황', url: '/regular/mockApply'},
    //   ]}
    // >
    // </SideNavPage>
    <Component />
  );
};

export default MockApply;
