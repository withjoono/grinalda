/* 메인 상단 배너 */
//import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useCallback, useEffect, useState} from 'react';
import loginContext, {Opt} from './../../contexts/login';
import {useLogout} from './../logout';
import s from './header.module.css';

import {HeaderMenu, subMenu} from './headerData';
import Image from 'next/image';

const Header = () => {
  const {header, links} = s;
  const [content, setContent] = useState(-1);
  const [open, setOpen] = useState(false);
  const {type} = React.useContext(Opt);
  const {user, login} = React.useContext(loginContext);
  const router = useRouter();
  const logout = useLogout(login, user);
  useEffect(() => {
    if (router.pathname.indexOf('mockup') > -1) type[1]('mockup');
    else if (router.pathname.indexOf('regular') > -1) type[1]('regular');
    else if (router.pathname.indexOf('gpa') > -1) type[1]('gpa');
    setOpen(false);
  }, [router.pathname, type]);

  //수시 결제 여부
  /* const susipay = async index => {
    // const res = await axios.get('/api/pay/payment',{
    //   headers:
    //   {
    //     auth:localStorage.getItem('realuid')
    //   },
    //   params: {type: '수시'}
    // })
    alert('서비스 시작일 2022년 1월 3일(월)입니다.');
    return;
    const res = {
      data: {
        success: true,
      },
    };
    if (index == 1) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/input');
    }
    if (index == 2) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/regular');
    }
    if (index == 3) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/analysis');
    }
    if (index == 4) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/university');
    }
    if (index == 5) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/graph');
    }
    if (index == 6) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/strategy');
    }
    if (index == 7) {
      if (res.data.success == false) {
        alert('수시 합격예측은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/early/option');
    }
    if (index == 8) {
      alert('서비스 준비중입니다');
      return;
    }
  }; */

  //정시 결제 여부
  /* const jungsi = async index => {
    // const res = await axios.get('/api/pay/payment',{
    //   headers:
    //   {
    //     auth:localStorage.getItem('realuid')
    //   },
    //   params: {type: '정시'} //type: 정시 수시 플래너
    // })
    const res = {
      data: {
        success: true,
      },
    };
    if (res.data.success == false) {
      alert('정시 합격예측은 결제가 필요한 페이지입니다');
      router.push('/paypage');
      return;
    }
    switch (index) {
      case 1:
        router.push('/regular/scoreInput');
        break;
      case 2:
        router.push('/regular/analyse');
        break;
      case 3:
        router.push('/regular/firstConsulting');
        break;
      case 4:
        router.push('/regular/secondConsulting');
        break;
      case 5:
        router.push('/regular/thirdConsulting');
        break;
      case 6:
        router.push('/regular/mockApply');
        break;
      case 7:
    }
  }; */

  //논술컨설팅 결제여부
  /* const nonsul = async index => {
    alert('서비스 시작일 2022년 1월 3일(월)입니다.');
    return;
    // const res = await axios.get('/api/pay/payment',{
    //   headers:
    //   {
    //     auth:localStorage.getItem('realuid')
    //   },
    //   params: {type: '정시'} //type: 정시 수시 플래너
    // })
    const res = {
      data: {
        success: true,
      },
    };
    if (index == 1) {
      if (res.data.success == false) {
        alert('논술컨설팅은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/nonsul/lib/');
    }
  };
  //플래너 결제여부
  const planner = async index => {
    alert('서비스 시작일 2022년 1월 3일(월)입니다.');
    return;
    const res = await axios.get('/api/pay/payment', {
      headers: {
        auth: localStorage.getItem('realuid'),
      },
      params: {type: '플래너'},
    });
    if (index == 1) {
      if (res.data.success == false) {
        alert('플래너 관리반은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/myclass/home');
    }
    if (index == 2) {
      if (res.data.success == false) {
        alert('플래너 관리반은 결제가 필요한 페이지입니다');
        router.push('/paypage');
      } else router.push('/myclass/classpic');
    }
  };
 */
  /* const lonks = [
    ['/timetable2', '/linkage'],
    [
      '/mockup/inputchoice',
      '/mockup/mygrade',
      '/mockup/university',
      '/mockup/graph',
      '/consulting/Consulting',
    ],
    [
      '/regular/infoform',
      '/regular/mygrade',
      '/regular/university',
      '/regular/beneficial',
      '/regular/mockup',
      '/consulting/Consulting',
    ],
    ['/gpa/infoform', '/gpa/mygrade', '/gpa/university', '/consulting/Consulting'],
    ['', '', '', '', ''],
  ]; */

  /* 
  const transitionEnd = () => setContent(0);
 */

  // useEffect(() => {
  //   if (content) setOpen(true);
  // }, [content]);

  const onSubClick = sub => {
    // else if (sub.url.includes('Consulting')) {
    //     alert('금일 무료모의지원앱과 플랫폼 연동작업으로 운영이 잠시 중단됩니다. 신속히 완료하고 다시 운영 재개하겠습니다');
    // }

    // 모든 서브 페이지 로그인 체크
    if (user[0] === '') {
      if (confirm('로그인이 필요합니다.')) {
        router.push('/main/Login');
        return;
      } else {
        router.push('/');
        return;
      }
    }

    if (sub.url === '') {
      if (sub.text == '경쟁율 검색')
        window.open('https://www.turtleschool.kr/4junsicompetition/', '_blank');
    } else {
      // alert('서비스 시작일 : 22년 1월 3일(월)');
      router.push(sub.url);
      // window.location.href = sub.url;
    }
  };

  const handleMenuHide = useCallback(() => {
    setContent(-1);
    setOpen(false);
  }, []);

  return (
    <>
      <div className={header}>
        <div className={s.content}>
          <div onMouseOver={handleMenuHide}>
            <Link href="/">
              {/* Next js 에서 Link TAG 안에는 <a>태그가 있어야함 */}
              <a>
                <Image
                  src={require('../../public/assets/header/logo.png')}
                  style={{cursor: 'pointer'}}
                  width="80dp"
                  height="68dp"
                  alt=""
                />
              </a>
            </Link>
            <div className={s.flex}>
              {!user[0] ? (
                <>
                  <Link href="/main/Login" passHref>
                    <p>로그인</p>
                  </Link>
                  <Link href="/main/Register" passHref>
                    <p>회원가입</p>
                  </Link>
                </>
              ) : (
                <>
                  <div
                    className={open && content === index ? s.menu_active : undefined}
                    onClick={() => router.push('paypage')}
                  >
                    유료결제
                  </div>
                  <p onClick={logout}>로그아웃</p>
                </>
              )}
              <p>
                <Link href={user[0] ? '/setting/myPage/info' : '/main/Login'} passHref>
                  <Image
                    src="https://img.ingipsy.com/assets/icons/alarm.png"
                    width="29dp"
                    height="29dp"
                    alt=""
                  />
                </Link>
              </p>
              <Link href={user[0] ? '/setting/myPage/info' : '/main/Login'} passHref>
                <Image
                  src="https://img.ingipsy.com/assets/icons/user.png"
                  width="27dp"
                  height="27dp"
                  alt=""
                />
              </Link>
            </div>
          </div>
          <div className={s.position} onMouseLeave={handleMenuHide}>
            <div
              className={links}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {HeaderMenu.map((list, index) => {
                return (
                  <div className={s.menu_Box}>
                    <Link key={list.title} href={list.link}>
                      <div
                        key={index}
                        className={open && content === index ? s.menu_active : undefined}
                        onMouseOver={() => setContent(index)}
                      >
                        {list.title}
                      </div>
                    </Link>
                    {subMenu[index].length > 0 && (
                      <div className={s.subMenu_Box}>
                        {subMenu[index].map(menu => {
                          return (
                            <Link key={menu.title} href={menu.link}>
                              <p style={{margin: 5}}>{menu.title}</p>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* <div className={content >= 0 ? s.backerOn : s.backer} onMouseLeave={handleMenuHide}>
              <div
                className={s.center_align}
                style={{
                  paddingLeft: 290 * content,
                }}
              >
                {content >= 0 &&
                  subMenu[content].title.map(item => {
                    return (
                      <div className={s.menu_container} key="">
                        <div className={s.menu_sub_title}>{item.tit}</div>

                        {item.subTit.map(sub => (
                          <div
                            onClick={() => onSubClick(sub)}
                            className={s.menu_sub_contents}
                            key=""
                          >
                            {sub.text}
                          </div>
                        ))}
                        {item.tit === '수시 컨설팅' && <ServiceSetting />}
                        {item.tit === '추가모집' && <ServiceSetting />}
                      </div>
                    );
                  })}
              </div>
            </div> */}

            {localStorage.getItem('uid') != localStorage.getItem('realuid') ? (
              <div>선택한 계정: {sessionStorage.getItem('name')}</div>
            ) : null}
          </div>
        </div>
      </div>

      <div style={{height: '100px', width: '100%'}} />
    </>
  );
};

const ServiceSetting = () => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '140%',
        flex: 1,
        height: '100%',
        color: '#fff',
        borderRadius: 20,
        backgroundColor: '#00000090',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      2023.06 오픈예정
    </div>
  );
};

export default Header;
