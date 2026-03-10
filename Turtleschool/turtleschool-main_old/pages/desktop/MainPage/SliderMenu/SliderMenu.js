import {UserAgent} from '@quentin-sommer/react-useragent';
import axios from 'axios';
import Link from 'next/link';
import React, {useContext, useEffect, useState} from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import {getData} from '../../../../comp/data';
import loginContext from '../../../../contexts/login';
import Image from 'next/image';
import LoginButtons from '../../loginbuttons';
// const bannerList = [
//   {
//     href: 'https://www.turtleschool.kr/',
//     imgSrc: '/assets/main_banner/banner_main01.jpg',
//   },
//   {
//     href: 'https://www.turtleschool.kr/',
//     imgSrc: '/assets/main_banner/banner_main02.jpg',
//   },
// ];

const bannerList = [
  {
    href: '',
    imgSrc: 'https://img.ingipsy.com/assets/main_banner/banner_main1.jpg',
  },
  {
    imgSrc: 'https://img.ingipsy.com/assets/main_banner/banner_main2.jpg',
  },
  {
    imgSrc: 'https://img.ingipsy.com/assets/main_banner/banner_main03.jpg',
  },
  {
    imgSrc: 'https://img.ingipsy.com/assets/main_banner/banner_main04.jpg',
  },
];

const getProductNameFromPaymentTypeId = typeId => {
  switch (typeId) {
    case 6:
      return '수시합격예측';
    case 7:
      return '정시합격예측';
    case 8:
      return '수시+정시 합격예측';
    case 9:
      return '생기부컨설팅 1년';
    case 10:
      return '학습관리 1년';
    case 11:
      return '생기부컨설팅+학습관리 1년';
    case 12:
      return '생기부컨설팅 1달';
    case 13:
      return '학습관리 1달';
    default:
      return '정시합격예측';
  }
};

const SliderMenu = () => {
  const {info, login} = useContext(loginContext); //info 파라미터  login 갱신
  const [slideIndex, setSlideIndex] = useState(); //롤링배너 dots
  const [member, setMember] = useState(1);
  const [acc, setAcc] = useState([]);
  const [isDrag, setIsDrag] = useState(false);
  const [myPayments, setMyPayments] = useState([]);

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
        <div style={{position: 'relative', bottom: '50px', right: '-180px'}}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '7px',
              backgroundColor: slideIndex == i ? '#DE6B3D' : '#9d9d9d',
              border: slideIndex == i ? 'none' : '1px #C3C3C3 solid',
            }}
          ></div>
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
        <div style={{position: 'relative', bottom: '50px', right: '-180px'}}>
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '7px',
              backgroundColor: slideIndex == i ? '#DE6B3D' : '#9d9d9d',
              border: slideIndex == i ? 'none' : '1px #C3C3C3 solid',
            }}
          ></div>
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
  useEffect(() => {}, [isDrag]);
  useEffect(() => {
    if (!info[0]) return;
    if (
      !(info[0].gradeCode == 'H1' || info[0].gradeCode == 'H2') &&
      !info[0].relationCode == '99'
    ) {
      setMember(0);
    } else if (info[0].relationCode == '99') {
      setMember(2);
    } else setMember(1);

    if (localStorage.getItem('realuid')) {
      getData('/api/linkage/get', setAcc, {}, localStorage.getItem('realuid'));
    }
  }, [info[0]]);

  useEffect(() => {
    axios
      .get('/api/pay/payment', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
      })
      .then(res => {
        if (res.data.success) {
          setMyPayments(res.data.data);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  const idToImage = {
    1: 'https://img.ingipsy.com/assets/home_icon/icon-28-planner-unactive.png', //수시 이미지 링크
    2: 'https://img.ingipsy.com/assets/home_icon/icon-28-planner-unactive.png', //플래너
    9: 'https://img.ingipsy.com/assets/home_icon/icon-28-rcpa-unactive.png', //정시
    3: 'https://img.ingipsy.com/assets/home_icon/icon-28-', //생기부
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
          background-color: #ffffff;
        }
        .banner_title {
          width: 100%;
          display: flex;
          justify-content: center;
          margin: 3.5rem auto 0 auto;
        }
        .mainBanner {
          width: 45rem;
          background-color: #ffffff;
        }
        .loginPage {
          background-color: #ffffff;
        }
        .loginPage .text_title {
          width: 17.5rem;
          height: 2rem;
          margin-left: 0.75rem;
          font-size: 1.25rem;
          text-align: center;
          font-weight: 900;
          margin-top: 1.75rem;
          margin-bottom: 3rem;
        }
        .small_text {
          width: 18.5rem;
          margin-left: 6.25rem;
          margin-top: 1.5rem;
          color: #da7448;
          font-size: 0.9rem;
          cursor: pointer;
        }
        .loginButton {
          display: flex;
          width: 17.5rem;
          flex-direction: column;
          margin-top: 3.5rem;
          margin-left: 1.5rem;
          cursor: pointer;
        }
        .banner_img {
          width: 46rem;
          height: 20rem;
          border-radius: 0px 1.2rem 1.2rem 0px;
          object-fit: fill;
        }
        .login_title {
          padding: 0px 2rem;
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
      <div className="background_color">
        <div className="banner_title">
          <div className="mainBanner">
            <UserAgent mobile>
              <Slider {...mobileSettings}>
                {bannerList.map((item, index) => {
                  return (
                    <div
                      key={`banner_item_${index}`}
                      href={item.href}
                      target="_blank"
                      onClick={e => !isDrag && e.preventDefault()}
                      passHref={true}
                    >
                      <Image
                        alt=""
                        src={item.imgSrc}
                        className="banner_img"
                        // width="1280px"
                        // height="560px"
                      ></Image>
                    </div>
                  );
                })}
              </Slider>
            </UserAgent>
            <UserAgent computer>
              <Slider {...settings}>
                {bannerList.map((item, index) => {
                  return (
                    <div
                      key={`banner_item_${index}`}
                      target="_blank"
                      onClick={e => !isDrag && e.preventDefault()}
                      passHref={true}
                    >
                      <img alt="" src={item.imgSrc} className="banner_img"></img>
                    </div>
                  );
                })}
              </Slider>
            </UserAgent>

            {/*로그인창 ------------------------------------------------------------*/}
          </div>

          <div className="loginPage">
            {!login[0] ? (
              <>
                <UserAgent mobile>
                  <div className="text_title">PC로 로그인하여 주십시오.</div>
                </UserAgent>
                <UserAgent computer>
                  <div className="text_title">
                    입시관리 서비스 거북스쿨에
                    <br />
                    오신 것을 환영합니다.
                  </div>
                </UserAgent>
                {/* <Link href="/main/Login" passHref>
                  <div className="small_text">거북스쿨 로그인</div>
                </Link> */}
                <UserAgent mobile>
                  <div
                    className="line1"
                    style={{border: '1px none #FFFFFF', marginTop: '40px', marginLeft: '3px'}}
                  ></div>
                  {/* <LoginButtons style={{opacity : 0.3}}/>{' '} */}
                </UserAgent>
                <UserAgent computer>
                  <div
                    className="line1"
                    style={{border: '1px none #FFFFFF', marginTop: '40px', marginLeft: '3px'}}
                  ></div>
                  <LoginButtons />{' '}
                </UserAgent>
              </>
            ) : (
              <div className="login_title">
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                  }}
                >
                  거북스쿨에 오신 걸 환영합니다
                </div>
                <br />
                <div style={{fontSize: '1.5rem', fontWeight: '1000'}}>
                  {info[0] ? info[0].userName : null}
                  <span style={{fontSize: '1.25rem', fontWeight: '1000'}}> 님</span>
                </div>

                <div
                  style={{
                    fontSize: '.8rem',
                    fontWeight: '600',
                    marginTop: '1rem',
                  }}
                >
                  {info[0] ? info[0].userName : null} 님이 이용중인 서비스
                </div>
                <div
                  style={{
                    marginTop: '.4rem',
                    overflow: 'auto',
                    display: 'flex',
                    borderRadius: '.2rem',
                    height: '5.5rem',
                    border: ' 1px solid #C86F4C',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                  }}
                >
                  {myPayments.map(myPay => {
                    return (
                      <div
                        key={'myPay' + myPay.id + myPay.typeid}
                        style={{
                          padding: '.5rem',
                          borderRadius: 50,
                          borderWidth: 1,
                          borderColor: 'black',
                          borderStyle: 'solid',
                          fontSize: '1rem',
                        }}
                      >
                        {getProductNameFromPaymentTypeId(myPay.typeid)}
                      </div>
                    );
                  })}
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
