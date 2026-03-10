import React from 'react';

//import Component from '../../../comp/regular/ScoreInput';
import SideNavPage from '../../../comp/template/SideNavPageCopy';
//import styled from 'styled-components';

const sMentoring1 = () => {
    return (
        <SideNavPage
            routes={['홈', '멘토링', '생기부 멘토링', '생기부 멘토링 홈']}
            navTitle='생기부 멘토링'
            navSubs={[
                { title: '생기부 멘토링 홈', url: '/temps/s-mentoring/1' },
                { title: '플래너 관리', url: '/temps/s-mentoring/2' },
                { title: '내신 관리', url: '/temps/s-mentoring/3' },
                { title: '세특 관리', url: '/temps/s-mentoring/4' },
                { title: '교내활동 관리', url: '/temps/s-mentoring/5' },
                { title: '생기부 작성 페이지', url: '/temps/s-mentoring/6' },
            ]}>
            <img src='/assets/temp_img/sMentoring/3.png' style={{height:'1000px', width:'auto'}} />
        </SideNavPage>
    );
}
  
export default sMentoring1;
