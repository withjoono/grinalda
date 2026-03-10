/* 메인 상단 배너 */
import React from 'react';
import s from './header.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import loginContext, { Opt } from './../../contexts/login';
import { useLogout } from './../logout';
import axios from 'axios';
import { HeaderMenu, subMenu } from './headerData';
const Header = (props) => {
    const { header, title, links, dropbar, backer, goaway, goin } = s;
    const [content, setContent] = useState(-1);
    const [open, setOpen] = useState(false);
    const { type } = React.useContext(Opt);
    const { user, login } = React.useContext(loginContext);
    const [payment, setPayment] = useState(1);
    const router = useRouter();
    const logout = useLogout(login, user);

    useEffect(() => {
        if (router.pathname.indexOf('mockup') > -1) type[1]('mockup');
        else if (router.pathname.indexOf('regular') > -1) type[1]('regular');
        else if (router.pathname.indexOf('gpa') > -1) type[1]('gpa');
        setOpen(false);
    }, [router.pathname]);
    //수시 결제 여부
    const susipay = async (index) => {
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
    };
    //정시 결제 여부
    const jungsi = async (index) => {
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
    };
    //논술컨설팅 결제여부
    const nonsul = async (index) => {
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
    const planner = async (index) => {
        alert('서비스 시작일 2022년 1월 3일(월)입니다.');
        return;

        const res = await axios.get('/api/pay/payment', {
            headers: {
                auth: localStorage.getItem('realuid'),
            },
            params: { type: '플래너' },
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

    const lonks = [
        ['/timetable2', '/linkage'],
        ['/mockup/inputchoice', '/mockup/mygrade', '/mockup/university', '/mockup/graph', '/consulting/Consulting'],
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
    ];

    const transitionEnd = () => setContent(0);

    useEffect(() => {
        if (content) setOpen(true);
    }, [content]);

    const onSubClick = (sub) => {
        // else if (sub.url.includes('Consulting')) {
        //     alert('금일 무료모의지원앱과 플랫폼 연동작업으로 운영이 잠시 중단됩니다. 신속히 완료하고 다시 운영 재개하겠습니다');
        // }
        if (sub.url === '') {
            if(sub.text == '경쟁율 검색')
                window.open('https://www.turtleschool.kr/4junsicompetition/', '_blank');
        } else {
            // alert('서비스 시작일 : 22년 1월 3일(월)');
            window.location.href = sub.url;
        }
    };

    return (
        <>
            <div className={header}>
                <div
                    className={s.content}
                    onMouseLeave={(e) => {
                        if (open && e.clientY <= 0) {
                            e.preventDefault();
                            setOpen(false);
                        }
                    }}
                >
                    <div>
                        <Link href="/">
                            <img src="/assets/home_icon/logo_hori.png" style={{ cursor: 'pointer' }} />
                        </Link>
                        <div className={s.flex}>
                            <Link href="/paypage">
                                <img src="/assets/home_icon/licen_bu.png" />
                            </Link>
                            <Link href="https://www.turtleschool.kr/?page_id=387" passHref={true}>
                                <img src="/assets/home_icon/dir_us.png" />
                            </Link>

                            {!user[0] ? (
                                <>
                                    <Link href="/main/Login">
                                        <p>로그인</p>
                                    </Link>

                                    <Link href="/main/Login">
                                        <p>회원가입</p>
                                    </Link>
                                </>
                            ) : (
                                <p onClick={logout}>로그아웃</p>
                            )}
                            <Link href={user[0] ? '/setting/Setting' : '/main/Login'}>
                                <img src="/assets/icons/alarm.png" />
                            </Link>
                            <Link href={user[0] ? '/setting/Setting' : '/main/Login'}>
                                <img src="/assets/icons/user.png" />
                            </Link>
                        </div>
                    </div>
                    <div className={s.position}>
                        <div className={links}>
                            {HeaderMenu.map((list, index) => {
                                return (
                                    <div
                                        className={open && content === index ? s.menu_active : undefined}
                                        onMouseOver={() => setContent(index)}
                                    >
                                        {list.title}
                                    </div>
                                );
                            })}
                        </div>
                        <div className={content >= 0 ? s.backerOn : s.backer} onMouseLeave={() => setContent(-1)}>
                            <div
                                className={s.center_align}
                                style={{
                                    paddingLeft: 290 * content,
                                }}
                            >
                                {content >= 0 &&
                                    subMenu[content].title.map((item) => {
                                        return (
                                            <div className={s.menu_container}>
                                                <div className={s.menu_title}>{item.tit}</div>
                                                <div className={s.menu_line} />
                                                {item.subTit.map((sub) => (
                                                    <div onClick={() => onSubClick(sub)} className={s.menu_sub_title}>
                                                        {sub.text}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>

                        {localStorage.getItem('uid') != localStorage.getItem('realuid') ? (
                            <div>선택한 계정: {sessionStorage.getItem('name')}</div>
                        ) : null}
                    </div>
                </div>
            </div>

            <div style={{ height: '100px', width: '100%' }} />
        </>
    );
};

export default Header;
