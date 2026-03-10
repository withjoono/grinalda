import React from 'react';

//import Component from '../../../comp/regular/ScoreInput';
import SideNavPage from '../../../comp/template/SideNavPageCopy';
//import styled from 'styled-components';

const sMentoring2 = () => {
    return (
        <SideNavPage
            routes={['홈', '멘토링', '생기부 멘토링', '플래너 관리']}
            navTitle='플래너 관리'
            navSubs={[
                { title: '생기부 멘토링 홈', url: '/temps/s-mentoring/1' },
                { title: '플래너 관리', url: '/temps/s-mentoring/2' },
                { title: '내신 관리', url: '/temps/s-mentoring/3' },
                { title: '세특 관리', url: '/temps/s-mentoring/4' },
                { title: '교내활동 관리', url: '/temps/s-mentoring/5' },
                { title: '생기부 작성 페이지', url: '/temps/s-mentoring/6' },
            ]}>
            <div style={{width:'1030px', height:'1750px', border:'1px solid lightgray'}}>
                <img src='/assets/temp_img/sMentoring/2-1.png' style={{height:'auto', width:'1020px'}} />
                <img src='/assets/temp_img/sMentoring/2-2.png' style={{height:'auto', width:'1020px'}} />
                <img src='/assets/temp_img/sMentoring/2-3.png' style={{height:'auto', width:'1020px'}} />
            </div>

        </SideNavPage>
    );
}
  
export default sMentoring2;
