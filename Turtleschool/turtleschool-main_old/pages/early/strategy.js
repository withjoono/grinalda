import React from 'react';
import Component from '../../comp/regular/MockApply';
import Menu from '../../comp/applymenu';
import SideNavPage from '../../comp/template/SideNavPageSusi';
import Buttons from './Buttons/Buttons';

const MockApply = () => {
  return (
    <SideNavPage 
      routes={['홈', '수시 컨설팅', '교과/비교과 분석']}
      navTitle="전략수립 및 모의지원"
      navSubs={[
        {title: '1.교과/비교과 분석', url: '/early/input'},
        {title: '2.유리한 조건 찾기', url: '/early/jungsi-predict'},
        {title: '3.학종 컨설팅', url: '/early/Consulting1'},
        {title: '4.교과 컨설팅', url: '/early/Consulting2'},
        {title: '5.논술 컨설팅', url: '/nonsul/sci'},
        {title: '6.전략수립 및 모의지원', url: '/early/strategy'},
      ]}
    >
    <div>
      <Menu index={1} title={"전략수립 및 모의지원"}/>
        <div style={{margin: '12px 8px 16px 8px', }}>
          <Component />
        </div>
        {/* <Component /> */}
        <Buttons prevPage='/early/interesteduniv' nextPage='/early/mouiapply'/>
    </div>
    </SideNavPage>
  );
};

export default MockApply;
