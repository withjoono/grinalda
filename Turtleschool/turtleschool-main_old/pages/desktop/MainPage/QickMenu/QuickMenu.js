import {useRouter} from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import {getData} from '../../../../comp/data';
import loginContext from '../../../../contexts/login';
import Image from 'next/image';
import Link from 'next/link';
import {isMobile} from 'react-device-detect';
import loginModule from '../../../../comp/loginModule';

const QuickMenu = () => {
  const loginInfo = loginModule();
  console.log('loginInfo', loginInfo);
  useEffect(() => {
    // if (isPopUpOpen === false) {
    const isPopUpOpen = localStorage.getItem('isPopUpOpen');
    if (!isMobile && isPopUpOpen !== 'false' && !router.pathname.includes('main/')) {
      // window.open(
      //   process.env.NEXT_PUBLIC_HOME_URL + '/welcome',
      //   'popup',
      //   'width = 800, height = 800, left = 100, top = 100',
      // );
    }
    // }
  }, []);

  const border_susi = [
    {
      title: '수시컨설팅 ‘거북스쿨’',
      text: "-예측은 당근, 단계별 프로세스식 최적 조합 제시\n-무료 모의지원 앱 ‘거북정모'에서 교차지원률, 연쇄이동률 파악 예측컷에 반영",
      price: '유료 - 29,000원',
      src: 'https://img.ingipsy.com/assets/main_banner/program_01.jpg',
      url: '',
    },
    {
      title: '무료 모의지원 앱 ‘거모’',
      text: '-국내유일 모의지원 전문 앱\n-앱기반의 신속, 편리성\n-사용자 확대와 데이터 교류를 위한 협력 고교 확대중',
      price: '무료',
      src: 'https://img.ingipsy.com/assets/main_banner/program_02.jpg',
      url: 'https://www.turtleschool.kr/moji/',
    },
    {
      title: '거북쌤(강준)',
      text: '- 대치동 학원장 겸 입시컨설턴트 20년차\n- 거북스쿨 대표 겸 기획자\n- 유투브 거북쌤의 맞춤 입시 코칭 크리에이터',
      price: '유료 - 690,000원',
      src: 'https://img.ingipsy.com/assets/main_banner/program_04.jpg',
      url: 'https://youtu.be/D8qSI8X2ro8',
    },
  ];

  const border_jungsi = [
    {
      title: '무료 모의지원 앱 ‘거모’',
      text: '서비스예정일 : 2023년 3월',
      price: '무료',
      discount_price: '',
      src: 'https://img.ingipsy.com/assets/main_banner/program_02.jpg',
      url: '/paypage',
    },
    {
      title: '2023 정시합격예측 (By 거북스쿨)',
      text: "예측은 당근, 단계별 프로세스식 최적 조합 제시\n무료 모의지원 앱 ‘거북정모'에서 교차지원률, 연쇄이동률 파악 예측컷에 반영",
      // price: '유료 - 59,000원',
      price: '59,000원',

      discount_price: '29,500원',
      src: 'https://img.ingipsy.com/assets/main_banner/program_01.jpg',
      url: '/paypage',
    },
    {
      title: '거북쌤 강준의 대면 컨설팅',
      text: '비대면 컨설팅 3회 + 최종 대면 컨설팅 1회 + 교차지원, 연쇄이동 현황에 따른 예측컷 변동 1~3일 업데이트 및 카톡채널을 통한 수시 질의 응답',
      price: '유료 - 490,000원',
      discount_price: '',
      src: 'https://img.ingipsy.com/assets/main_banner/program_03.jpg',
      url: '/paypage',
    },
  ];

  const link_content = (setence, url) => {
    return (
      <div
        className="quick-detail"
        onClick={() => (window.location.href = {url})}
        style={{color: '#808080', marginRight: '20px'}}
      >
        {setence}
        <t> </t>
        <Image
          alt=""
          className="right_arrow"
          src="https://img.ingipsy.com/assets/icons/arrow/arrow_right@3x.png"
          width="7px"
          height="14px"
        />
      </div>
    );
  };

  const router = useRouter();
  const [acc, setAcc] = useState([]);
  /* const navs = index => {
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
      router.push(
        'https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform?usp=sf_link',
      );
    } else if (index === 12) {
      router.push('https://www.turtleschool.kr/?page_id=381');
    }
  }; */
  const [member, setMember] = useState(1);
  const {info, login} = useContext(loginContext); //info 파라미터  login 갱신
  const [nav, setNav] = useState(0); //퀵메뉴

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

  return (
    <div>
      <div className="quick-wrapper">
        <div className="quick-title-wrapper">
          <p className="title">
            2023년 <p className="title-bold">수시 프로그램</p>
            {/* <span style={{color: 'gray'}}>(6월 9일 서비스 시작)</span> */}
          </p>
        </div>
        <div className="quick-infor-wrapper">
          <div className="quick-infor-form">
            {border_susi.map((list, index) => {
              return (
                <Link href={list.url} key={index}>
                  <div
                    className="quick-infor-box"
                    style={{display: 'flex', flexDirection: 'column'}}
                  >
                    <Image
                      alt=""
                      src={list.src}
                      className="box-black"
                      width="1280px"
                      height="800px"
                    />
                    <div className="quick-info-form">
                      <div className="quick-title-form">
                        <div className="quick-price-border">
                          {list.discount_price === '' ? (
                            <div className="quick-price-text">{list.price}</div>
                          ) : (
                            <div className="quick-price-text">
                              유료 -&nbsp;
                              <span className="quick-price-text discount">
                                {list.price} {'>'}
                              </span>
                              <span>&nbsp;{list.discount_price}</span>
                            </div>
                          )}
                        </div>
                        <div className="quick-title">{list.title}</div>
                        <div className="quick-text">{list.text}</div>
                      </div>
                    </div>
                    <div className="quick-price-box">
                      {index === 1 ? (
                        <div className="quick-price-form" onClick={e => router.push('/paypage')}>
                          <div
                            className="quick-detail detail-center"
                            onClick={() => router.push('/paypage')}
                            style={{color: '#808080', marginRight: '20px'}}
                          >
                            등록하기
                            <t> </t>
                            <Image
                              alt=""
                              className="right_arrow"
                              src="https://img.ingipsy.com/assets/icons/arrow/arrow_right@3x.png"
                              width="7px"
                              height="14px"
                            />
                          </div>
                        </div>
                      ) : index === 2 ? (
                        <div className="quick-price-form">
                          <div
                            className="quick-detail detail-center"
                            onClick={() =>
                              window.open('https://www.turtleschool.kr/gangjun_consult/', '_blank')
                            }
                            style={{color: '#808080', marginRight: '20px'}}
                          >
                            상세보기
                            <t> </t>
                            <Image
                              alt=""
                              className="right_arrow"
                              src="https://img.ingipsy.com/assets/icons/arrow/arrow_right@3x.png"
                              width="7px"
                              height="14px"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .right_arrow {
            width: 7px;
            height: 14px;
            margin-left: 8px;
          }
          .quick-detail-wrapper {
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          }
          .quick-detail {
            font-weight: normal;
            font-size: 16px;
            line-height: 24px;
            text-align: right;
            color: #808080;
            margin-right: 100;
          }
          .detail-center {
            font-size: 0.8rem;
          }
          .title {
            font-weight: normal;
            font-size: 2.4rem;
            color: #000000;
          }
          .title-bold {
            font-weight: bold;
            font-size: 2.4rem;
            color: #000000;
            display: inline-block;
          }
          .quick-wrapper {
            width: 100%;
            background-color: #f7f7fc;
          }
          .quick-title-wrapper {
            padding: 0 0;
            text-align: center;
          }
          .quick-title-wrapper > h1 {
            font-weight: bold;
            font-size: 2.4rem;
          }
          .quick-infor-wrapper {
            padding-bottom: 5.5rem;
          }
          .quick-infor-form {
            display: flex;
            justify-content: space-between;
            width: 64rem;
            margin: auto;
          }
          .quick-infor-box {
            width: 20.5rem;
            height: 28.8rem;
            border-radius: 1.42rem;
            background-color: #fff;
            cursor: pointer;
            box-shadow: 0.1rem 0.1rem 0.6rem rgba(0, 0, 0, 0.14);
            position: relative;
          }
          .quick-info-form {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .quick-infor-box > .box-black {
            width: 100%;
            height: 12rem;
            background-color: #000;
            border-radius: 0.7rem 0.7rem 0 0;
            box-shadow: 2 2 12 0;
          }
          .quick-infor-box > .quick-info-form > .quick-title-form {
            width: 80%;
            display: flex;
            flex-direction: column;
          }
          .quick-infor-box > .quick-info-form > .quick-title-form > .quick-title {
            font-style: normal;
            font-weight: bold;
            font-size: 1rem;
            line-height: 1.4rem;
            margin-top: 1.5rem;
            padding-bottom: 1.2rem;
          }
          .quick-infor-box > .quick-info-form > .quick-title-form > .quick-text {
            font-weight: normal;
            font-size: 0.8rem;
            line-height: 1.2rem;
            white-space: pre-wrap;
          }
          .quick-infor-box > .quick-price-box {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 1.5rem;
          }
          .quick-infor-box > .quick-price-box > .quick-price-form {
            justify-content: space-between;
          }
          .quick-infor-box > .quick-price-box > .quick-price-form > .quick-price-border {
            background-color: #fff2ed;
            color: #f45119;
          }
          .quick-infor-box > .quick-price-box > .quick-price-form > .quick-price-button {
            color: #9a9a9a;
          }
          .quick-price-border {
            color: #f45119;
            margin-top: 0.5rem;
            text-align: right;
          }
          .quick-price-border .quick-price-text {
            background-color: #fff2ed;
            display: inline-block;
          }

          .discount {
            text-decoration: line-through;
          }

          @media screen and (max-width: 420px) {
            .quick-infor-form {
              display: flex;
              flex-direction: column;
              width: 100%;
              margin: auto;
              padding: 0px 15px;
            }

            .quick-infor-box {
              width: 100%;
              height: auto;
              margin-bottom: 30px;
              padding-bottom: 30px;
            }

            .quick-infor-box > .quick-info-form > .quick-title-form {
              height: auto;
            }

            .title {
              font-size: 20px;
              line-height: 20px;
              padding: 60px 0px 40px 0px;
            }

            .title-bold {
              font-size: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default QuickMenu;
