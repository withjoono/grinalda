import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useContext } from 'react';
import { getData } from '../../comp/data';
import loginContext from '../../contexts/login';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useRouter } from 'next/router';
import axios from 'axios';

const home = (props) => {
    const [pic, setPic] = useState(1);
    const pics = ['/assets/banner.png', '/assets/march.png'];
    const [acc, setAcc] = useState([]);
    const [s, setS] = useState(localStorage.getItem('uid'));
    const router = useRouter();

    const [slideIndex, setSlideIndex] = useState(); //롤링배너 dots

    const { info, login } = useContext(loginContext); //info 파라미터  login 갱신

    const [nav, setNav] = useState(0); //퀵메뉴
    const [mentors, setMentors] = useState([]); //플래너
    const [pay, setPayment] = useState([]); // 결제내역
    const [member, setMember] = useState(1);

    //이용중이 서비스 이미지
    const idToImage = {
        1: '/assets/home_icon/icon-28-planner-unactive.png', //수시 이미지 링크
        2: '/assets/home_icon/icon-28-planner-unactive.png', //플래너
        8: '/assets/home_icon/icon-28-rcpa-unactive.png', //정시
        3: '/assets/home_icon/icon-28-', //생기부
    };

    const idToName = {
        1: '수시 합격예측',
        2: '플래너 관리반',
        8: '정시 합격예측',
        3: '생기부 관리반',
    };

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

    //플레너 불러오는 부분
    useEffect(() => {
        axios
            .get('/api/planner/home_planner', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => setMentors([res.data.data.slice(0, 4), res.data.data.slice(4, 8)]));
    }, []);

    //이용중인 서비스 불러오기
    useEffect(() => {
        axios
            .get('/api/pay/payment', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => setPayment(res.data.data));
    }, []);

    //롤링배너 부분
    const settings = {
        dots: true, //아래 dots 줄건가?
        beforeChange: (prev, next) => {
            //dot 눌렀을때 액티브 dot slideindex에 저장
            setSlideIndex(next);
        },
        customPaging: function (i) {
            // dots가 뭘로 나올건지 리턴함
            return (
                <div style={{ position: 'relative', bottom: '50px', right: '-180px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '7px', backgroundColor: slideIndex == i ? '#DE6B3D' : '#9d9d9d', border: slideIndex == i ? 'none' : '1px #C3C3C3 solid' }}></div>
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

    //퀵메뉴 네비
    const navs = (index) => {
        if (index == 0) {
            router.push('/gpa/infoform');
        } else if (index == 1) {
            alert('오픈 예정입니다');
        } else if (index == 2) {
            router.push('/myclass/frontdesk');
        } else if (index == 3) {
            router.push('myclass/frontdesk');
        } else if (index == 4) {
            router.push('mockup/inputchoice');
        } else if (index == 8) {
            router.push('https://www.turtleschool.kr/susi-consulting/');
        } else if (index == 9) {
            router.push('/gpa/graph');
        } else if (index === 10) {
            router.push('https://www.turtleschool.kr/?page_id=387');
        } else if (index === 11) {
            router.push('https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform?usp=sf_link');
        } else if (index === 12) {
            router.push('https://www.turtleschool.kr/?page_id=381');
        }
    };

    return (
        <div>
            <style jsx>{`
                .wrap {
                    background-color: #ffffff;
                    width: 100%;
                }

                .background_color {
                    width: 100%;
                    background-color: #e1f0f2;
                }
                .banner_title {
                    width: 100%;
                    max-width: 1920px;
                    height: 500px;

                    display: flex;
                    margin: 70px auto;
                }
                .mainBanner {
                    width: 1073px;
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
                .quick_box {
                    width: 1280px;
                    height: 160px;
                    margin: -30px auto;
                }
                .quick_box .title_box {
                    width: 176px;
                    height: 160px;
                    background-color: #eaeaea;
                    border: 1px #9b9b9b solid;
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    line-height: 160px;
                    float: left;
                }

                .quick_box .nav_box {
                    width: 1080px;
                    height: 160px;
                    display: flex;
                    float: right;
                    cursor: pointer;
                }
                .quick_box .nav_box .btn_nav {
                    position: relative;
                }
                .quick_box .nav_box .btn_nav :nth-of-type(1),
                .quick_box .nav_box .btn_nav :nth-of-type(2) {
                    border-right: 1px #9d8459 solid;
                }

                .btn1 {
                    width: 360px;
                    background-color: #ffcf72;
                    transition: all 0.3s;
                }
                .btn2 {
                    width: 360px;
                    background-color: #ffcf72;
                    transition: all 0.3s;
                }
                .btn3 {
                    width: 360px;
                    background-color: #ffcf72;
                    transition: all 0.3s;
                }
                .btn1:hover {
                    height: 160px;
                    box-shadow: 0px 2px 20px rgba(33, 33, 33, 40%);
                }
                .btn2:hover {
                    height: 160px;
                    box-shadow: 0px 2px 20px rgba(33, 33, 33, 40%);
                }
                .btn3:hover {
                    height: 160px;
                    box-shadow: 0px 2px 20px rgba(33, 33, 33, 40%);
                }

                .quick_box .nav_box .btn_nav .title_nav {
                    font-size: 20px;
                    font-weight: bold;
                    margin-left: 30px;
                    margin-top: 28px;
                    width: 361px;
                }
                .quick_box .nav_box .btn_nav .text_nav {
                    font-size: 14px;
                    font-weight: 400;
                    margin-top: 12px;
                    margin-left: 28px;
                    line-height: 20px;
                }
                .nav_img {
                    right: 10px;
                    position: absolute;
                    bottom: 20px;
                }

                .planner_box {
                    width: 1280px;
                    height: 385px;

                    margin: 50px auto;
                    display: flex;
                    justify-content: space-between;
                }
                .planner_box .profile {
                    width: 811px;
                    height: 385px;
                    border: 1px #9a9a9a solid;
                    background-color: #eaeaea;
                }
                .planner_box .Exp {
                    width: 445px;
                    height: 385px;
                    background-color: #fff2ed;
                    box-shadow: 0px 4px 4px rgba(00, 00, 00, 25%);
                }
                .planner_box .Exp .pl_title {
                    font-size: 24px;
                    font-weight: 1000;
                    margin-left: 24px;
                    margin-top: 31px;
                }
                .planner_box .Exp .pl_text {
                    font-size: 16px;
                    font-weight: 400;
                    margin-left: 24px;
                    margin-top: 31px;
                    cursor: pointer;
                }
                .planner_box .Exp .pl_btn {
                    width: 397px;
                    height: 60px;
                    background-color: #ffffff;
                    font-size: 16px;
                    display: flex;
                    font-weight: 500;
                }
                .title_line {
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                }
                .planner_box .profile .pl_title {
                    font-size: 24px;
                    font-weight: 1000;
                    margin-left: 24px;
                    margin-top: 31px;
                }
                .planner_box .profile .pl_all {
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-right: 31px;
                    margin-top: 31px;
                }
                .planner_box .profile .pl_all:hover {
                    text-decoration: underline;
                }

                .pla_img img {
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;
                    margin-left: 16px;
                    margin-top: 21px;
                }

                .infor {
                    width: 100%;
                    background-color: #e6ecf3;
                    margin-top: -20px;
                }
                .infor_border {
                    width: 1280px;
                    margin: auto;
                    display: flex;
                    justify-content: space-between;
                }
                .infor_border .infor_title {
                    width: 271px;
                    font-size: 36px;
                    font-weight: 500;
                    margin-top: 46px;
                }
                .infor_border .infor_text_small {
                    width: 900px;
                    margin-top: 77px;
                    font-size: 15px;
                    font-weight: bold;
                    margin-left: 100px;
                }
                .infor_border .infor_number {
                    width: 810px;
                    height: 180px;
                    font-size: 16px;
                    font-weight: bold;
                    margin: 40px auto;
                }
                .infor_border .use {
                    width: 166px;
                    height: 40px;
                    border: 1px #000000 solid;
                    text-align: center;
                    line-height: 40px;
                    margin: auto;
                    cursor: pointer;
                }
                .infor_border .use:hover {
                    text-decoration: underline;
                }

                .video_border {
                    height: 650px;
                    width: 1280px;
                    margin: auto;
                }
                .video_border .vi_title {
                    margin-top: 64px;
                    font-size: 36px;
                    height: 40px;
                    text-align: center;
                }
                .video_border .vi_content {
                    margin-top: 40px;
                }

                .video_border .vi_content .video {
                    width: 895px;
                    height: 470px;
                    margin: 30px auto;
                }
                .video_border .vi_content .video video {
                    width: 895px;
                    height: 470px;
                }
                .video_border .vi_content .comment {
                    width: 501px;
                }
                .nav_cs {
                    width: 100%;
                    height: 221px;
                    background-color: #f4f4f4;
                    display: flex;
                }
                .nav_cs .cs_box {
                    width: 100%;
                }
                .nav_cs .cs_box .cs_name {
                    width: 405px;
                    height: 161px;
                    cursor: pointer;
                }
                .nav_cs .cs_box .cs_name .cs_img {
                    margin-top: 35px;
                }
                .nav_cs .cs_box .cs_name .cs_title {
                    font-size: 25px;
                    font-weight: 800;
                    margin-top: 20px;
                }
                .nav_cs .cs_box .cs_name .cs_num {
                    margin-top: 51px;
                    width: 217px;
                }
                .nav_cs .cs_box .cs_name .cs_imgn {
                    margin-left: 288px;
                    width: 217px;
                }
                .admin_go:hover {
                    text-decoration: underline;
                }
                .footer {
                    position: absolute;
                    bottom: 0;
                    background-color: #f4f4f4;
                    color: #9d9d9d;
                    height: 3em;
                    text-align: center;
                    width: 100%;
                }
            `}</style>
            {/*롤링배너 ....................................*/}

            <div className='wrap'>
                <div className='background_color'>
                    <div className='banner_title'>
                        <div className='mainBanner'>
                            <Slider {...settings}>
                                <Link href='https://www.turtleschool.kr/' passHref={true}>
                                    <img src='/assets/main_banner/main_banner04.jpeg' style={{ width: '1073px', height: '500px', borderRadius: '0px 24px 24px 0px' }}></img>
                                </Link>
                                <Link href='https://www.turtleschool.kr/' passHref={true}>
                                    <img src='/assets/main_banner/main_banner01.jpeg' style={{ width: '1073px', height: '500px', borderRadius: '0px 24px 24px 0px' }}></img>
                                </Link>
                                <Link href='https://www.turtleschool.kr/' passHref={true}>
                                    <img src='/assets/main_banner/main_banner02.jpeg' style={{ width: '1073px', height: '500px', borderRadius: '0px 24px 24px 0px' }}></img>
                                </Link>
                                <Link href='https://www.turtleschool.kr/' passHref={true}>
                                    <img src='/assets/main_banner/main_banner03.jpeg' style={{ width: '1073px', height: '500px', borderRadius: '0px 24px 24px 0px' }}></img>
                                </Link>

                                {/*<img src = 'munomuno.jpg' style={{width:'1073px',height:'500px' ,borderRadius:'0px 24px 24px 0px'}}></img> 귀여운 문노문노*/}
                            </Slider>

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
                                    <div style={{ fontSize: '24px', fontWeight: '600', marginLeft: '40px', marginTop: '57px' }}>거북스쿨에 오신 걸 환영합니다</div>
                                    <br></br>
                                    <div style={{ fontSize: '36px', fontWeight: '1000', marginLeft: '40px' }}>
                                        {info[0] ? info[0].userName : null}
                                        <span style={{ fontSize: '30px', fontWeight: '1000' }}> 님</span>
                                    </div>

                                    <div style={{ fontSize: '16px', fontWeight: '600', marginLeft: '40px', marginTop: '40px' }}>{info[0] ? info[0].userName : null} 님이 이용중인 서비스</div>
                                    <div style={{ marginTop: '8px', marginLeft: '40px', display: 'flex', width: '428px', borderRadius: '4px', height: '126px', border: ' 1px solid #C86F4C' }}>
                                        {pay.map((data) => (
                                            <div style={{ width: '50px', height: '50px', marginLeft: '40px', marginTop: '20px', textAlign: 'center' }}>
                                                <img src={idToImage[data.typeid]} />
                                                {idToName[data.typeid]}
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <div className='admin_go' style={{ width: '428px', height: '50px', marginLeft: '40px', marginTop: '28px', backgroundColor: '#EAEAEA', display: 'flex', justifyContent: 'space-between', lineHeight: '50px' }}>
                                            <Link href='manager'>
                                                <p style={{ marginLeft: '24px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>관리자 페이지 바로가기</p>
                                            </Link>
                                            <img src='/assets/home_icon/icon-arrowgo.png' style={{ width: '16px', height: '16px', marginTop: '17px', marginRight: '20px' }} />
                                        </div>
                                    </div>
                                    <div className='admin_go' style={{ width: '428px', height: '50px', marginLeft: '40px', marginTop: '8px', backgroundColor: '#EAEAEA', display: 'flex', justifyContent: 'space-between', lineHeight: '50px' }}>
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
                {/*퀵메뉴-----------------------------------------------------*/}
                {member == 0 ? (
                    <>
                        <div className='quick_box'>
                            <div className='title_box'>Quick Menu</div>
                            <div className='nav_box'>
                                <div className='btn_nav btn1' onClick={() => navs(0)}>
                                    <div className='title_nav'>내신 성적 입력</div>
                                    <div className='text_nav'>
                                        내신 성적을 입력하고<br></br>
                                        Z내신, 내신 성적 변동 추이 등을 분석
                                    </div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>

                                <div className='btn_nav btn2' onClick={() => navs(1)}>
                                    <div className='title_nav'>생기부 관리반</div>
                                    <div className='text_nav'>
                                        전공별 <br></br>
                                        Z내신, 내신 성적 변동 추이 등을 분석
                                    </div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>

                                <div className='btn_nav btn3' onClick={() => navs(2)}>
                                    <div className='title_nav'>플래너 관리반</div>
                                    <div className='text_nav'>
                                        멘토쌤의 학생 플래너 검사, 테스트,<br></br>
                                        상담 등을 통한 학생 관리 서비스
                                    </div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : member == 2 ? (
                    <>
                        <Link href='/setting/masterPage'>
                            <div style={{ cursor: 'pointer' }}>관리자 페이지로 이동합니다</div>
                        </Link>
                    </>
                ) : (
                    <>
                        <div className='quick_box'>
                            <div className='title_box'>Quick Menu</div>
                            <div className='nav_box'>
                                {/* <div className='btn_nav btn3' style={{width:'270px'}} onClick={()=>navs(8)}>
			 <div className='title_nav'>수시 컨설팅 (대면)</div>
			 <div className='text_nav'>거북스쿨 CEO 강준<br></br>
			 <span style={{color:'red'}}>대치동 InG학원 원장 20년</span><br></br>
			 <span style={{color:'red'}}>입시컨설팅 20년</span><br></br>
			 </div>
			 <div className='nav_img'>
				 <img src='/assets/home_icon/arrow.png'/>
			 </div>
		 </div> */}

                                <div className='btn_nav btn1' style={{ width: '270px' }} onClick={() => navs(10)}>
                                    <div className='title_nav'>정시 시스템 설명을 병행한 <br/> '거북스쿨 사용법'</div>
                                    <div className='text_nav'>
                                        <br></br>
                                    </div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>

                                <div className='btn_nav btn3' style={{ width: '270px' }} onClick={() => navs(-1)}>
                                    <div className='title_nav'>무료 모의 지원 어플</div>
                                    <div className='text_nav'></div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>

                                <div className='btn_nav btn2' style={{ width: '270px' }} onClick={() => navs(11)}>
                                    <div className='title_nav'>유료 예약과 <br/> 가채점 예측컷 파일 받기</div>
                                    <div className='text_nav'></div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>
                                <div className='btn_nav btn3' style={{ width: '270px' }} onClick={() => navs(12)}>
                                    <div className='title_nav'>대치동 20년 <br/> 입시컨설팅 경력 <br/> 거북쌤의 '입시 코칭'</div>
                                    <div className='text_nav'></div>
                                    <div className='nav_img'>
                                        <img src='/assets/home_icon/arrow.png' />
                                    </div>
                                </div>

                                {/* 
		 <div className='btn_nav btn1' style={{width:'270px'}} onClick={()=>navs(0)}>
			 <div className='title_nav'>내신 성적 입력</div>
			 <div className='text_nav'>내신 성적을 입력하고<br></br>
			 Z내신, 내신 성적 변동 추이 등을 분석
			 </div>
			 <div className='nav_img'>
				 <img src='/assets/home_icon/arrow.png'/>
			 </div>
		 </div> */}

                                {/* <div className='btn_nav btn2' style={{width:'270px'}} onClick={()=>navs(1)}>
			 <div className='title_nav'>정시 성적 입력</div>
			 <div className='text_nav'>수능 성적을 입력하고<br></br>
				조합별 성적 분석
			 </div>
			 <div className='nav_img'>
				 <img src='/assets/home_icon/arrow.png'/>
			 </div>
		 </div> */}

                                {/* <div className='btn_nav btn3' style={{width:'270px'}} onClick={()=>navs(1)}>
			 <div className='title_nav'>수시 합격 예측</div>
			 <div className='text_nav'>전형별 희망 대학, 희망 전공<br></br>
				분석 및 합격 예측
			 </div>
			 <div className='nav_img'>
				 <img src='/assets/home_icon/arrow.png'/>
			 </div>
		 </div> */}
                            </div>
                        </div>
                    </>
                )}
                {/*멘토 리스트-----------------------------------------------------*/}
                <div className='planner_box'>
                    <div className='profile'>
                        <div className='title_line'>
                            <div className='pl_title'>멘토 리스트</div>
                            <div className='pl_all' onClick={() => navs(3)}>
                                더 많은 멘토 찾으러 가기
                            </div>
                        </div>
                        <div className='planner_list'>
                            {mentors.map((arr) => (
                                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                                    {arr.map((data) => (
                                        <div style={{ backgroundColor: '#ffffff', width: '180px', height: '126px' }}>
                                            <div style={{ float: 'left' }}>
                                                <div className='pla_img'>
                                                    <img src={'profile-img/' + data.img + '.jpg'} />
                                                </div>
                                            </div>
                                            <div style={{ float: 'left', marginLeft: '15px' }}>
                                                <div className='pla_name' style={{ marginTop: '21px', fontSize: '16px', fontWeight: 'bold' }}>
                                                    {data.name}
                                                </div>
                                                <div className='pla_univ' style={{ fontSize: '9px', marginTop: '9px' }}>
                                                    {data.univ}
                                                </div>
                                                <div className='pla_dep' style={{ fontSize: '10px', marginTop: '4px', color: '#DE6B3D' }}>
                                                    {data.dep}
                                                </div>
                                            </div>

                                            <button onClick={() => navs(3)} style={{ width: '150px', height: '20px', border: '1px #2EABC9 solid', color: '#2EABC9', marginLeft: '15px', marginTop: '16px', fontSize: '8px', fontWeight: 'bold' }}>
                                                1:1평가받기
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='Exp'>
                        <div className='title_line'></div>
                        <div className='pl_title'>거북스쿨 추천 서비스</div>

                        <div className='pl_text'>
                            <div className='pl_btn'>
                                <div>
                                    <img src='/assets/home_icon/icon-38-z.png' style={{ width: '28px', height: '28px', marginLeft: '20px', marginTop: '13px' }} />
                                </div>
                                <div style={{ lineHeight: '60px' }} onClick={() => navs(0)}>
                                    나의 내신 z점수 확인하기
                                </div>
                                <div style={{ width: '16px', position: 'relative', right: '10px' }}>
                                    <img src='/assets/home_icon/icon-arrowgo.png' style={{ width: '16px', height: '16px', marginTop: '21px', marginLeft: '136px' }} />
                                </div>
                            </div>
                            <div className='pl_btn' style={{ marginTop: '16px' }}>
                                <div>
                                    <img src='/assets/home_icon/icon-38-z.png' style={{ width: '28px', height: '28px', marginLeft: '20px', marginTop: '13px' }} />
                                </div>
                                <div style={{ lineHeight: '60px', width: '300px' }}>우리 학교 Z점수 유불리 확인하기</div>
                                <div style={{ width: '16px', position: 'relative', right: '10px' }}>
                                    <img src='/assets/home_icon/icon-arrowgo.png' style={{ height: '16px', marginTop: '21px', marginRight: '10px' }} />
                                </div>
                            </div>
                            <div className='pl_btn' style={{ marginTop: '16px' }}>
                                <div>
                                    <img src='/assets/home_icon/icon-38-z.png' style={{ width: '28px', height: '28px', marginLeft: '20px', marginTop: '13px' }} />
                                </div>
                                <div style={{ lineHeight: '60px' }} onClick={() => navs(9)}>
                                    나의 비교과 평가
                                </div>
                                <div style={{ width: '16px', position: 'relative', right: '10px' }}>
                                    <img src='/assets/home_icon/icon-arrowgo.png' style={{ width: '16px', height: '16px', marginTop: '21px', marginLeft: '190px' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*설명-----------------------------------------------------*/}

                <div className='infor'>
                    {/* <div className='infor_border'>
                        <div className='infor_title'>
                            <div style={{ color: '#3D94DE' }}>플래너</div>이용안내 <br></br>
                        </div>
                        <div className='infor_text'>
                            <div className='infor_text_small'>
                                플래너는 거북스쿨에서만 사용할 수 있는 무료 서비스로, 주간 루틴을 설정하면 장기적인 계획이 수립되고 하루에 달성해야하는 미션과 시간이
                                <br></br>언제인지 할당이 됩니다. 할당된 미션을 마치면 성취도가 쌓이고 멘토로부터 피드백을 받게됩니다.
                            </div>
                            <div className='infor_number'>
                                <img src='/assets/home_icon/4number.png' />
                            </div>
                            <div className='use' onClick={() => navs(2)}>
                                이용하러 가기
                            </div>
                        </div>
                    </div> */}
                    <img src="/assets/main_banner/banner_jungsi_2022.jpeg"></img>
                    <img src="/assets/main_banner/banner_jungsi_process_2022.jpeg"></img>
                </div>

                {/*유튜브---------------------------------------------------*/}
                <div className='video_border'>
                    <div className='vi_title'>
                        <img src='/videos/video_title.jpg'></img>
                    </div>
                    <div className='vi_content'>
                        <div className='video'>
                            <video controls poster='videos/intro.jpg'>
                                <source src='videos/intro.mp4' type='video/mp4'></source>
                                <strong>Your browser does not support the video tag.</strong>
                            </video>
                        </div>
                    </div>
                </div>
                <div className='nav_cs'>
                    <div className='cs_box'>
                        <div className='cs_name' style={{ marginLeft: 'auto' }}>
                            <div className='cs_num'>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>이용 문의 / 고객문의 / 광고문의</div>
                                <div style={{ fontSize: '24px', fontWeight: '1000', marginTop: '10px' }}>02-501-3357</div>
                                <Link href='http://pf.kakao.com/_TxbNFs/chat'>
                                    <div style={{ fontSize: '24px', fontWeight: '1000', marginTop: '10px', backgroundColor: '#FFE400' }}>채팅상담 하러가기</div>
                                </Link>
                            </div>
                            <div className='cs_imgn'>
                                <img src='/assets/home_icon/icon-61-call.png' />
                            </div>
                        </div>
                    </div>
                    <div className='cs_box'>
                        <div className='cs_name'>
                            <div className='cs_num'>
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>거북스쿨 공식계정</div>
                                <div style={{ display: 'flex', marginTop: '12px' }}>
                                    <div>
                                        <img src='assets/home_icon/blog.png' style={{ width: '72px', height: '72px' }} />
                                    </div>
                                    <div>
                                        <img src='assets/home_icon/facebook.png' style={{ width: '72px', height: '72px', marginLeft: '16px' }} />
                                    </div>
                                    <div>
                                        <img src='assets/home_icon/instargram.png' style={{ width: '72px', height: '72px', marginLeft: '16px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default home;

/*{acc.length ? <div className="tl">연계 계정</div> : null}
		{acc.length ? <div className="co">
			<div className={s == localStorage.getItem('realuid') ? 'card br' : 'card'}
				onClick={() => {
					localStorage.setItem('uid',localStorage.getItem('realuid'))
					setS(localStorage.getItem('realuid'))
				}}>
			<p>본인 계정</p>
			</div>
			{acc.map(e =>
				<div className={s == e.account ? 'card br' : 'card'}
					onClick={() => {
						localStorage.setItem('uid',e.account);
						sessionStorage.setItem('name',e.user_name);
						setS(e.account)}}>
					<p>{e.user_name}</p>
					<p>{a[e.gradeCode]}</p>
					<p>{e.school}</p>
					<p>{e.hagwon}</p>
				</div>)
			}
			</div> : null
		}*/
