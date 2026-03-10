import {deleteUser, getAuth} from 'firebase/auth';
import Link from 'next/link';
import React, {useContext} from 'react';
import Logout from '../../comp/logout';
import withDesktop from '../../comp/withdesktop';
import loginContext from '../../contexts/login';
import desktop from '../desktop/setting';
import styles from './Setting.module.css';

const Setting = () => {
  const {login, user} = useContext(loginContext);

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onRemoveAccoutClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    deleteUser(user)
      .then(() => {})
      .catch(error => {
        // An error ocurred
        // ...
        console.log(error);
      });
  };

  const logoutbutton = func => {
    return (
      <div className={styles.Setting_content_name} onClick={func}>
        로그아웃
      </div>
    );
  };

  return (
    <div className={styles.Setting_page}>
      <div className={styles.Setting_content}>
        <div className={styles.Setting_section}>
          <div className={styles.Setting_section_title}>계정</div>
          <div className={styles.Setting_section_content}>
            <Link href="/main/choosetype">
              <div className={styles.Setting_content_name}>회원 정보 수정</div>
            </Link>
            <Link href="/regular/infoform">
              <div className={styles.Setting_content_name}>정시 성적 수정</div>
            </Link>
            <Link href="/mockup/inputchoice">
              <div className={styles.Setting_content_name}>모의 성적 수정</div>
            </Link>
            <Link href="/gpa/infoform">
              <div className={styles.Setting_content_name}>내신 성적 수정</div>
            </Link>
            <Link href="/linkage">
              <div className={styles.Setting_content_name}>타 계정 연계</div>
            </Link>
            <div className={styles.Setting_content_name}>회원탈퇴</div>
            {/*<div className={styles.Setting_content_name}>회원탈퇴</div>*/}
            <Logout login={login} user={user} render={logoutbutton} />
          </div>
        </div>
        <div className={styles.Setting_section}>
          <div className={styles.Setting_section_title}>앱 설정</div>
          <div className={styles.Setting_section_content}>
            <Link href="/setting/SettingAlarm">
              <div className={styles.Setting_content_name}>알림 설정</div>
            </Link>
          </div>
          <div className={styles.Setting_section_content}>\</div>
        </div>
        <div className={styles.Setting_section}>
          <div className={styles.Setting_section_title}>결제/환불</div>
          <div className={styles.Setting_section_content}>
            <Link href="/paypage">
              <div className={styles.Setting_content_name}>결제</div>
            </Link>
          </div>
        </div>
        <div className={styles.Setting_section}>
          <div className={styles.Setting_section_title}>앱 정보</div>
          <div className={styles.Setting_section_content}>
            <div
              className={[styles.Setting_content_version, styles.Setting_content_name].join(' ')}
            >
              <div>앱 버전</div>
              <div>1.0 v</div>
            </div>
            <Link href="http://pf.kakao.com/_TxbNFs/chat">
              <div className={styles.Setting_content_name}>문의하기</div>
            </Link>
            <div className={styles.Setting_content_name_additional}>
              <div className={styles.Setting_content_name}>사업체명 ) 코딱지닷컴</div>
              <div className={styles.Setting_content_name}>대표자 ) 강준호</div>
              <div className={styles.Setting_content_name}>사업자 등록번호 ) 127-56-00490 </div>
              <div className={styles.Setting_content_name}>위치 ) 대치동 906-23 만수빌딩 502 </div>
              <div className={styles.Setting_content_name}>이메일 ) ingconsulting@naver.com </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default withDesktop(desktop, Setting);
