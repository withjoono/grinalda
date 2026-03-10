import axios from 'axios';
import {deleteUser, getAuth} from 'firebase/auth';
import Head from 'next/head';
import Link from 'next/link';
import React, {useContext, useEffect, useState} from 'react';
import {useLogout} from '../../comp/logout';
import loginContext from '../../contexts/login';
import styles from './setting.module.css';

const base64ToUint8Array = base64 => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const setting = () => {
  const {container, setting, info, push, account, title, text} = styles;

  const {user, login} = useContext(loginContext);
  const ctx = useContext(loginContext);
  const logout = useLogout(login, user);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [registration, setRegistration] = useState(null);

  const [toggle, setToggle] = useState(ctx.push[0]);
  //const logoutbutton = (func) => {return (<div style={{width:'452px',height:'40px',display:'flex',margin:'0 auto',justifyContent:'center',alignItems:'center',border:'1px solid #707070',borderRadius:'20px',backgroundColor:'white'}} onClick={func}>로그아웃 하기</div>)}

  useEffect(() => {
    const t = async () => {
      if (ctx.push[0]) {
        if (typeof Notification !== 'undefined' && registration !== null) {
          Notification.requestPermission(async status => {
            if (status == 'granted') {
              const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64ToUint8Array(
                  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
                ),
              });
              const aw = await axios.post(
                '/api/push',
                {push: sub},
                {
                  headers: {
                    'Content-Type': 'application/json',
                    auth: user[0],
                  },
                },
              );
            } else {
              alert('Notification을 브라우저에서 허가하여 주세요');
              ctx.push[1](!ctx.push[0]);
            }
          });
        }
      } else {
        await axios.post(
          '/api/push',
          {push: ''},
          {headers: {'Content-Type': 'application/json', auth: user[0]}},
        );
      }
    };
    t();
  }, [ctx.push[0], registration]);

  const handleChange = e => {
    ctx.push[1](!ctx.push[0]);
  };

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        });
        setRegistration(reg);
      });
    }
  }, []);

  const onRemoveAccountClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    deleteUser(user)
      .then(() => {
        logout();
      })
      .catch(error => {
        // An error ocurred
        // ...
        console.log(error);
      });
  };

  return (
    <div className="page" style={{backgroundColor: '#f5f6f8'}}>
      <Head>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        ></script>
      </Head>
      <div className={container}>
        <div className={account}>
          <div className={title}>내 계정</div>
          <Link href="/main/choosetype" passHref>
            <div className={text}>회원 정보 수정</div>
          </Link>
          <Link href="/regular/infoform" passHref>
            <div className={text}>수능 성적 수정</div>
          </Link>
          <Link href="/mockup/inputchoice" passHref>
            <div className={text}>모의 성적 수정</div>
          </Link>
          <Link href="/gpa/infoform" passHref>
            <div className={text}>내신 성적 수정</div>
          </Link>
          <Link href="/linkage" passHref>
            <div className={text}>타 계정 연계</div>
          </Link>
          <div onClick={onRemoveAccountClick} className={text}>
            회원 탈퇴
          </div>
        </div>
        <div className={setting}>
          <div className={title}>설정</div>
          <div className={text} style={{display: 'flex', justifyContent: 'space-between'}}>
            버전 정보<p>v1.0</p>
          </div>
          <div className={text}>공지사항</div>
          <Link href="http://pf.kakao.com/_TxbNFs/chat" passHref>
            <div className={text}>문의</div>
          </Link>
          <div className={text}>개인정보 수집 및 이용</div>
        </div>
        <div className={info}>
          <div className={title}>정보</div>
          <Link href="/desktop/businessinfo" passHref>
            <div className={text}>사업자 정보</div>
          </Link>
        </div>
        <div className={push}>
          <div className={title}>알림 설정</div>
          <div className={text} style={{display: 'flex', justifyContent: 'space-between'}}>
            마케팅 푸시 및 수신 동의
            <div
              onClick={handleChange}
              style={{
                width: '55px',
                height: '22px',
                borderRadius: '11px',
                backgroundColor: '#e2e2e2',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: `${ctx.push[0] ? '#fede01' : '#707070'}`,
                  width: '22px',
                  height: '22px',
                  borderRadius: '11px',
                  transform: `${ctx.push[0] ? 'translateX(33px)' : 'translateX(0)'}`,
                  transition: 'transform 0.6s',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/*<Logout login={ctx.login} user={ctx.user} render={logoutbutton}/>*/}
    </div>
  );
};

export default setting;
