import React from 'react';
import SideNavPage from '../../../comp/template/SideNavPageSusi';
//import Component from '../../../comp/regular/ScoreInput';
//import styled from 'styled-components';

const sMentoring3 = () => {
  return (
    <SideNavPage
      routes={['홈', '멘토링', '생기부 멘토링', '생기부 작성 페이지']}
      navTitle="생기부 작성 페이지"
      navSubs={[
        {title: '생기부 멘토링 홈', url: '/temps/s-mentoring/1'},
        {title: '플래너 관리', url: '/temps/s-mentoring/2'},
        {title: '내신 관리', url: '/temps/s-mentoring/3'},
        {title: '세특 관리', url: '/temps/s-mentoring/4'},
        {title: '교내활동 관리', url: '/temps/s-mentoring/5'},
        {title: '생기부 작성 페이지', url: '/temps/s-mentoring/6'},
      ]}
    >
      <div style={{width: '1030px', height: '530px', border: '1px solid lightgray'}}>
        <img
          src="https://img.ingipsy.com/assets/temp_img/sMentoring/6-1.png"
          style={{height: 'auto', width: '1020px'}}
        />
      </div>
    </SideNavPage>
  );
};

export default sMentoring3;
