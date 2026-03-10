import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import loginContext from '../../../../contexts/login';
import { useState, useEffect, useContext } from 'react';
import { getData } from '../../../../comp/data';
import axios from 'axios';
import Link from 'next/link';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';

const bannerList = [
    {
        href: 'https://www.turtleschool.kr/',
        imgSrc: '/assets/main_banner/banner_main01.jpg',
    },
    {
        href: 'https://www.turtleschool.kr/',
        imgSrc: '/assets/main_banner/banner_main02.jpg',
    },
];

const SliderMenu = () => {
    const { info, login } = useContext(loginContext); //info 파라미터  login 갱신
    const [slideIndex, setSlideIndex] = useState(); //롤링배너 dots
    const [pay, setPayment] = useState([]); // 결제내역
    const [member, setMember] = useState(1);
    const [acc, setAcc] = useState([]);
    const [isDrag, setIsDrag] = useState(false);

    const settings = {
        dots: true, //아래 dots 줄건가?
        beforeChange: (prev, next) => {
            //dot 눌렀을때 액티브 dot slideindex에 저장
            setIsDrag(false);
            setSlideIndex(next);
        },
        afterChange: () => setIsDrag(true),
        customPaging: function (i) {
            // dots가 뭘로 나올건지 리턴함
            return (
                <div style={{ position: 'relative', bottom: '50px', right: '-180px' }}>
                    <div
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '7px',
                            backgroundColor: slideIndex == i ? '#DE6B3D' : '#9d9d9d',
                            border: slideIndex == i ? 'none' : '1px #C3C3C3 solid',
                        }}></div>
                </div>
            );
        },
        arrows: false, //좌우 화살표
        dotsClass: 'slick-dots slick-thumb',
        infinite: true, //컨텐츠 끝나면 1 컨텐츠 반복
        speed: 500, //콘텐츠를 넘어갈 때 속도
        slidesToShow: 1, //화면에 보이는 갯수
        slidesToScroll: 1, //넘어가는 갯수
        autoplay: true, // 자동 스크롤 사용 여부
        autoplaySpeed: 3000, //초당 넘어가는 시간
    };

    const mobileSettings = {
        dots: false,
        beforeChange: (prev, next) => {
            //dot 눌렀을때 액티브 dot slideindex에 저장
            setIsDrag(false);
            setSlideIndex(next);
        },
        afterChange: () => setIsDrag(true),
        customPaging: function (i) {
            // dots가 뭘로 나올건지 리턴함
            return (
                <div style={{ position: 'relative', bottom: '50px', right: '-180px' }}>
                    <div
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '7px',
                            backgroundColor: slideIndex == i ? '#DE6B3D' : '#9d9d9d',
                            border: slideIndex == i ? 'none' : '1px #C3C3C3 solid',
                        }}></div>
                </div>
            );
        },
        arrows: false, //좌우 화살표
        dotsClass: 'slick-dots slick-thumb',
        infinite: true, //컨텐츠 끝나면 1 컨텐츠 반복
        speed: 500, //콘텐츠를 넘어갈 때 속도
        slidesToShow: 1, //화면에 보이는 갯수
        slidesToScroll: 1, //넘어가는 갯수
        autoplay: true, // 자동 스크롤 사용 여부
        autoplaySpeed: 3000, //초당 넘어가는 시간
    };
    useEffect(() => {
        console.log(isDrag);
    }, [isDrag]);
    useEffect(() => {
        if (!info[0]) return;
        console.log(info[0].gradeCode);
        console.log(info[0].relationCode);
        if (!(info[0].gradeCode == 'H1' || info[0].gradeCode == 'H2') && !info[0].relationCode == '99') {
            setMember(0);
        } else if (info[0].relationCode == '99') {
            setMember(2);
        } else setMember(1);

        if (localStorage.getItem('realuid')) {
            getData('/api/linkage/get', setAcc, {}, localStorage.getItem('realuid'));
        }
    }, [info[0]]);

    useEffect(() => {
        console.log('get payment');
        axios
            .get('/api/pay/payment', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                console.log('payment: ', res);
                setPayment(res.data.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const idToImage = {
        1: '/assets/home_icon/icon-28-planner-unactive.png', //수시 이미지 링크
        2: '/assets/home_icon/icon-28-planner-unactive.png', //플래너
        9: '/assets/home_icon/icon-28-rcpa-unactive.png', //정시
        3: '/assets/home_icon/icon-28-', //생기부
    };
    const idToName = {
        1: '수시 합격예측',
        2: '플래너 관리반',
        9: '정시 합격예측',
        3: '생기부 관리반',
    };
    return (
        <>
            <style jsx>{`
                .background_color {
                    width: 100%;
                    background-color: #e1f0f2;
                }
                .banner_title {
                    width: 100%;
                    max-width: 1920px;
                    height: 500px;

                    display: flex;
                    margin: 70px auto 0 auto;
                }
                .mainBanner {
                    width: 1273px;
                    height: 500px;
                    float: left;
                    background-color: #ffffff;
                }
                .loginPage {
                    width: 830px;
                    height: 500px;
                    float: left;
                    background-color: #ffffff;
                }
                .loginPage .text_title {
                    width: 370px;
                    height: 76px;
                    margin-left: 64px;
                    font-size: 30px;
                    font-weight: 900;
                    margin-top: 57px;
                }
                .small_text {
                    width: 370px;
                    margin-left: 64px;
                    margin-top: 14px;
                    color: #9b9b9b;
                    font-size: 20px;
                    cursor: pointer;
                }
                .loginButton {
                    display: flex;
                    width: 30%;
                    justify-content: space-between;
                    margin-top: 50px;
                    margin-left: 140px;
                    cursor: pointer;
                }
                .banner_img {
                    width: 1273px;
                    height: 500px;
                    border-radius: 0px 24px 24px 0px;
                }

                .login_title {
                    padding: 0px 40px;
                    max-width: 500px;
                }

                @media screen and (max-width: 420px) {
                    .banner_title {
                        width: 100%;
                        height: 40%;
                        display: flex;
                        flex-direction: column;
                        margin: 0px;
                    }

                    .mainBanner {
                        width: 100%;
                        height: 40%;

                        background-color: #ffffff;
                    }

                    .banner_img {
                        width: 100%;
                        height: 40%;
                        border-radius: 0px;
                    }

                    .loginPage {
                        width: 100%;
                        margin: 0px;
                    }

                    .loginPage .text_title {
                        width: 100%;
                        margin: 0px;
                    }

                    .small_text {
                        width: 100%;
                        margin: 0px;
                    }
                }
            `}</style>
            <div className='background_color'>
                <div className='banner_title'>
                    <div className='mainBanner'>
                        <UserAgent mobile>
                            <Slider {...mobileSettings}>
                                {bannerList.map((item, index) => {
                                    return (
                                        <Link key={`banner_item_${index}`} href={item.href} target='_blank' onClick={(e) => !isDrag && e.preventDefault()} passHref={true}>
                                            <img src={item.imgSrc} className='banner_img'></img>
                                        </Link>
                                    );
                                })}

                                {/*<img src = 'munomuno.jpg' style={{width:'1073px',height:'500px' ,borderRadius:'0px 24px 24px 0px'}}></img> 귀여운 문노문노*/}
                            </Slider>
                        </UserAgent>
                        <UserAgent computer>
                            <Slider {...settings}>
                                {bannerList.map((item, index) => {
                                    return (
                                        <Link key={`banner_item_${index}`} href={item.href} target='_blank' onClick={(e) => !isDrag && e.preventDefault()} passHref={true}>
                                            <img src={item.imgSrc} className='banner_img'></img>
                                        </Link>
                                    );
                                })}

                                {/*<img src = 'munomuno.jpg' style={{width:'1073px',height:'500px' ,borderRadius:'0px 24px 24px 0px'}}></img> 귀여운 문노문노*/}
                            </Slider>
                        </UserAgent>

                        {/*로그인창 ------------------------------------------------------------*/}
                    </div>

                    <div className='loginPage'>
                        {!login[0] ? (
                            <>
                                <div className='text_title'>
                                    입시관리 서비스,<br></br>거북스쿨에 오신걸 환영합니다
                                </div>
                                <Link href='/main/Login'>
                                    <div className='small_text'>소셜 로그인하기</div>
                                </Link>
                                <div className='loginButton'>
                                    {/* <Link href='/main/Login'>
				<img src='/assets/icons/fblogo.png'></img>
			</Link>	 */}
                                    <Link href='/main/Login'>
                                        <img src='/assets/icons/gglogo.png'></img>
                                    </Link>
                                    <Link href='/main/Login'>
                                        <img src='/assets/icons/kklogo.png'></img>
                                    </Link>
                                </div>{' '}
                            </>
                        ) : (
                            <div className='login_title'>
                                <div style={{ fontSize: '24px', fontWeight: '600', marginTop: '57px' }}>거북스쿨에 오신 걸 환영합니다</div>
                                <br></br>
                                <div style={{ fontSize: '36px', fontWeight: '1000' }}>
                                    {info[0] ? info[0].userName : null}
                                    <span style={{ fontSize: '30px', fontWeight: '1000' }}> 님</span>
                                </div>

                                <div style={{ fontSize: '16px', fontWeight: '600', marginTop: '40px' }}>{info[0] ? info[0].userName : null} 님이 이용중인 서비스</div>
                                <div
                                    style={{
                                        marginTop: '8px',
                                        overflow: 'auto',
                                        display: 'flex',
                                        borderRadius: '4px',
                                        height: '126px',
                                        border: ' 1px solid #C86F4C',
                                    }}>
                                    {pay.map(
                                        (data) =>
                                            idToImage[data.typeid] && (
                                                <div
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        marginLeft: '40px',
                                                        marginTop: '20px',
                                                        textAlign: 'center',
                                                        wordBreak: 'keep-all',
                                                    }}>
                                                    <img src={idToImage[data.typeid]} />
                                                    {idToName[data.typeid]}
                                                </div>
                                            )
                                    )}
                                </div>
                                <div>
                                    <div
                                        className='admin_go'
                                        style={{
                                            height: '50px',
                                            marginTop: '28px',
                                            backgroundColor: '#EAEAEA',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            lineHeight: '50px',
                                        }}>
                                        <Link href='manager'>
                                            <p style={{ marginLeft: '24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>관리자 페이지 바로가기</p>
                                        </Link>
                                        <img src='/assets/home_icon/icon-arrowgo.png' style={{ width: '16px', height: '16px', marginTop: '17px', marginRight: '20px' }} />
                                    </div>
                                </div>
                                <div
                                    className='admin_go'
                                    style={{
                                        height: '50px',
                                        marginTop: '8px',
                                        backgroundColor: '#EAEAEA',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        lineHeight: '50px',
                                    }}>
                                    <Link href='/linkage'>
                                        <p style={{ marginLeft: '24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>멘토,멘티 신청/수락 바로가기</p>
                                    </Link>
                                    <img src='/assets/home_icon/icon-arrowgo.png' style={{ width: '16px', height: '16px', marginTop: '17px', marginRight: '20px' }} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SliderMenu;
