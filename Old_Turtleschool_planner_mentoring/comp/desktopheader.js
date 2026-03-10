import React from 'react';
import s from './header.module.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import loginContext, { Opt } from '../contexts/login';
import { useLogout } from './logout';
import axios from 'axios';

const Header = (props) => {
    const { header, title, links, dropbar, backer, goaway, goin } = s;
    const [content, setContent] = useState(0);
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
            return
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

    const dropbars = [
        ['플래너', '멘토링 및 계정 연계'],
        ['성적 입력', '성적 분석', '희망 대학 검색', '성적 변동 추이 및 멘토링', '맞춤 정보'],
        ['성적 입력', '성적 분석', '대학/학과별 검색', '나에게 유리한 대학 찾기', '모의 지원', '맞춤 정보'],
        ['성적 입력', '내신 진단', '추천 전형/대학', '맞춤 정보'],
        ['성적 입력', '수시 컨설팅', '유리한 대학 찾기', '모의 지원', '맞춤 정보'],
    ];

    const lonks = [
        ['/timetable2', '/linkage'],
        ['/mockup/inputchoice', '/mockup/mygrade', '/mockup/university', '/mockup/graph', '/consulting/Consulting'],
        ['/regular/infoform', '/regular/mygrade', '/regular/university', '/regular/beneficial', '/regular/mockup', '/consulting/Consulting'],
        ['/gpa/infoform', '/gpa/mygrade', '/gpa/university', '/consulting/Consulting'],
        ['', '', '', '', ''],
    ];

    const transitionEnd = () => setContent(0);

    useEffect(() => {
        if (content) setOpen(true);
    }, [content]);

    const getContent = () => {
        if (content == 0) return null;
        else if (content == 1) {
            return (
                <div className={s.backer_container}>
                    <div className={s.backer_horizontal}>
                        {/* <Link href='/timetable2'> */}
                            <div className={s.backer_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>플래너</div>
                        {/* </Link> */}
                        {/* <Link href='/linkage'> */}
                            <div className={s.backer_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>멘토링 오퍼 신청/수락</div>
                        {/* </Link> */}
                        {/* <Link href='/planner/status'> */}
                            <div className={s.backer_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>학습현황/수업현황</div>
                        {/* </Link> */}
                    </div>
                </div>
            );
        } else if (content == 2) {
            return (
                <div className={s.backer_container}>
                    <div className={s.backer_ttl}>내신 성적 관리</div>
                    <div className={s.backer_horizontal}>
                        <div className={s.backer_vertical}>
                            {/* <Link href='/gpa/infoform'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>내신 성적 입력</div>
                            {/* </Link> */}
                            {
                                //<Link href='/gpa/objective'>
                            }
                            <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>
                                목표대학
                            </div>
                            {
                                //</Link>
                            }
                        </div>
                        <div className={s.backer_vertical}>
                            {/* <Link href='/gpa/mygrade'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>교과 분석</div>
                            {/* </Link> */}

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>

                        <div className={s.backer_vertical}>
                            {/* <Link href='/gpa/graph'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>비교과 분석</div>
                            {/* </Link> */}

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                        <div className={s.backer_vertical}>
                            {
                                //<Link href='/gpa/university'>
                            }
                            <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>
                                전형별<br></br> 예측 대학
                            </div>
                            {
                                //</Link>
                            }
                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                    </div>
                </div>
            );
        } else if (content == 3) {
            return (
                <div className={s.backer_container}>
                    <div className={s.backer_ttl}>모의 성적 관리</div>
                    <div className={s.backer_horizontal}>
                        <div className={s.backer_vertical}>
                            {/* <Link href='/mockup/inputchoice'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>모의 성적 입력</div>
                            {/* </Link> */}
                            {/* <Link href='/mockup/prediction'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>목표대학</div>
                            {/* </Link> */}
                        </div>
                        <div className={s.backer_vertical}>
                            {/* <Link href='/mockup/mygrade'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>성적 분석</div>
                            {/* </Link> */}

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                        <div className={s.backer_vertical}>
                            {/* <Link href='/mockup/graph'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>성적 추이</div>
                            {/* </Link> */}
                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                        <div className={s.backer_vertical}>
                            {/* <Link href='/mockup/university'> */}
                                <div className={s.backer_vertical_cell} onClick={() => () => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>
                                    대학 예측 <br></br>및 검색
                                </div>
                            {/* </Link> */}
                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                    </div>
                </div>
            );
        } else if (content == 4) {
            return (
                <div className={s.backer_container}>
                    <div className={s.backer_ttl}>수시 합격 예측</div>
                    <div className={s.backer_horizontal}>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => susipay(1)}>
                                {/*susipay(1)*/}
                                성적 입력
                            </div>

                            <div className={s.backer_vertical_cell} onClick={() => susipay(4)}>
                                {/*susipay(4)*/}
                                전형별 대학 예측 <br></br>및 검색
                            </div>
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => susipay(3)}>
                                {/*susipay(3)*/}
                                교과 분석
                            </div>

                            <div className={s.backer_vertical_cell} onClick={() => susipay(6)}>
                                {/*susipay(6)*/}
                                관심 대학 <br></br>및 모의 지원
                            </div>
                        </div>
                        <div className={s.backer_vertical}>
                            {/* <div className={s.backer_vertical_cell}onClick={() =>susipay(5)}>
              비교과 분석
            </div> */}

                            <div className={s.backer_vertical_cell} onClick={() => susipay(7)}>
                                {/*susipay(7)*/}
                                특별전형<br></br> 자격확인
                            </div>

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => susipay(2)}>
                                {/*susipay(2)*/}
                                정시 가능 대학
                            </div>

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                    </div>
                    <div className={s.backer_ttl}>정시 합격 예측</div>
                    <div className={s.backer_horizontal}>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => jungsi(1)}>
                                성적 입력
                            </div>

                            <div className={s.backer_vertical_cell} onClick={() => jungsi(5)}>
                                다군 컨설팅
                            </div>
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => jungsi(2)}>
                                성적 분석
                            </div>

                            <div className={s.backer_vertical_cell} onClick={() => jungsi(6)}>
                                모의 지원
                            </div>
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => jungsi(3)}>
                                가군 컨설팅
                            </div>

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => jungsi(4)}>
                                나군 컨설팅
                            </div>

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                    </div>
                </div>
            );
        } else if (content == 5) {
            return (
                <div className={s.backer_container}>
                    <div className={s.backer_ttl}>마이클래스</div>
                    <div className={s.backer_horizontal}>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell} onClick={() => planner(1)}>
                                플래너 관리반<br></br>(유료)
                            </div>

                            {/* <Link href='/myclass_free/planner'> */}
                                <div className={s.backer_vertical_cell} onClick={() => alert('서비스 시작일 2022년 1월 3일(월)입니다.')}>
                                    플래너 관리반<br></br>(무료)
                                </div>
                            {/* </Link> */}
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell}>
                                생기부 관리반<br></br>(8월 중순 오픈)
                            </div>

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                        <div className={s.backer_vertical}>
                            <div className={s.backer_vertical_cell}>
                                클리닉 관리반<br></br>(12월 오픈 예정)
                            </div>

                            <div className={s.backer_vertical_cell}>-</div>
                        </div>
                    </div>
                </div>
            );
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
                    }}>
                    <div>
                        <Link href='/'>
                            <img src='/assets/home_icon/logo_hori.png' style={{ cursor: 'pointer' }} />
                        </Link>
                        <div className={s.flex}>
                            <Link href='/paypage'>
                                <img src='/assets/home_icon/licen_bu.png' />
                            </Link>
                            <Link href='https://www.turtleschool.kr/?page_id=387' passHref={true}>
                            <img src='/assets/home_icon/dir_us.png' />
                            </Link>

                            {!user[0] ? (
                                <>
                                    <Link href='/main/Login'>
                                        <p>로그인</p>
                                    </Link>

                                    <Link href='/main/Login'>
                                        <p>회원가입</p>
                                    </Link>
                                </>
                            ) : (
                                <p onClick={logout}>로그아웃</p>
                            )}
                            <Link href={user[0] ? '/setting/Setㄴing' : '/main/Login'}>
                                <img src='/assets/icons/alarm.png' />
                            </Link>
                            <Link href={user[0] ? '/setting/Setting' : '/main/Login'}>
                                <img src='/assets/icons/user.png' />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div className={links}>
                            <div className={open && content == 1 ? s.menu_active : undefined} onMouseOver={() => setContent(1)}>
                                플래너&멘토링
                            </div>
                            <div className={open && content == 2 ? s.menu_active : undefined} onMouseOver={() => setContent(2)}>
                                내신 성적관리
                            </div>
                            <div className={open && content == 3 ? s.menu_active : undefined} onMouseOver={() => setContent(3)}>
                                모의 성적관리
                            </div>
                            <div className={open && content == 4 ? s.menu_active : undefined} onMouseOver={() => setContent(4)}>
                                합격예측
                            </div>
                            <div className={content == 5 ? s.menu_active : undefined} onMouseOver={() => setContent(5)}>
                                마이클래스 {/*onClick={()=>planner(2)*/}
                            </div>
                            <div className={content == 6 ? s.menu_active : undefined} onMouseOver={() => setContent(6)} onClick={() => nonsul(1)}>
                                논술 컨설팅
                            </div>
                        </div>
                        <div className={links} style={{ justifyContent: 'flex-end' }}></div>
                        {localStorage.getItem('uid') != localStorage.getItem('realuid') ? <div>선택한 계정: {sessionStorage.getItem('name')}</div> : null}
                    </div>
                </div>
            </div>
            {open ? (
                <div
                    className={[backer, goin].join(' ')}
                    onMouseLeave={(e) => {
                        e.preventDefault();
                        setOpen(false);
                    }}>
                    {getContent()}
                </div>
            ) : (
                <div className={[backer, goaway].join(' ')} onTransitionEnd={transitionEnd}>
                    {getContent()}
                </div>
            )}
            <div style={{ height: '100px', width: '100%' }} />
        </>
    );
};

export default Header;
