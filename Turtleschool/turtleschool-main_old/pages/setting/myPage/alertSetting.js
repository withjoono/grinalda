import React, {useContext} from 'react';
import SideNavPage from '../../../comp/template/SideNavPage';
import Consent from '../../../comp/MyPage/AlertSetting/Consent';

import styled from 'styled-components';
import loginContext from '../../../contexts/login';
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;

const AlertSettingPage = () => {
  const {
    info: [memberInfo, setMemberInfo],
  } = useContext(loginContext);
  return (
    <Wrapper>
      <SideNavPage
        routes={['홈', '마이페이지', '알림 설정']}
        navTitle="마이페이지"
        navSubs={[
          {title: '내 정보', url: '/setting/myPage/info'},
          {title: '멘토/멘티 계정', url: '/setting/myPage/mentoring'},
          {title: '점수 관리', url: '/setting/myPage/score'},
          {title: '이용중인 서비스', url: '/setting/myPage/myTicket'},
          {title: '알림 설정', url: '/setting/myPage/alertSetting'},
        ]}
      >
        <Consent
          ipsy_yn={memberInfo?.ipsy_alarm_yn}
          mento_yn={memberInfo?.mento_alarm_yn}
          setMemberInfo={setMemberInfo}
        ></Consent>
      </SideNavPage>
    </Wrapper>
  );
};

export default AlertSettingPage;
