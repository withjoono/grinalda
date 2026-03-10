import React, {useContext} from 'react';
import Management from '../../../../../comp/MyPage/Mentoring/Management';
import SideNavPage from '../../../../../comp/template/SideNavPage';
import loginContext from '../../../../../contexts/login';
import styled from 'styled-components';
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;

const AdminPage = () => {
  const {info} = useContext(loginContext);
  return (
    <Wrapper>
      <SideNavPage
        routes={['홈', '마이페이지', '멘토/멘티 계정', '멘토/멘티 관리자페이지']}
        navTitle="마이페이지"
        navSubs={[
          {title: '내 정보', url: '/setting/myPage/info'},
          {title: '멘토/멘티 계정', url: '/setting/myPage/mentoring'},
          {title: '점수 관리', url: '/setting/myPage/score'},
          {title: '이용중인 서비스', url: '/setting/myPage/myTicket'},
          {title: '알림 설정', url: '/setting/myPage/alertSetting'},
        ]}
      >
        <Management relationCode={info[0]?.relationCode} />
      </SideNavPage>
    </Wrapper>
  );
};

export default AdminPage;
