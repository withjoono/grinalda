import React from 'react';
import { useState, useEffect, useContext } from 'react';
import loginContext from '../../../../contexts/login';
import axios from 'axios';
import { getData } from '../../../../comp/data';
import Link from 'next/link';
import { useRouter } from 'next/router';

const QuickMenu = () => {
    const border = [
        {
            title: '무료 모의지원 앱 ‘거북 정모’',
            text: '국내유일 모의지원 전문 앱\n앱기반의 신속, 편리성\n사용자 확대와 데이터 교류를 위한 협력 고교 확대중',
            price: '무료',
            src: '/assets/main_banner/program_02.jpg',
            url: 'https://www.turtleschool.kr/moji/',
        },
        {
            title: '정시컨설팅 ‘거북스쿨’',
            text: "예측은 당근, 단계별 프로세스식 최적 조합 제시\n무료 모의지원 앱 ‘거북정모'에서 교차지원률, 연쇄이동률 파악 예측컷에 반영",
            price: '유료 - 29,000원',
            src: '/assets/main_banner/program_01.jpg',
            url: 'https://www.turtleschool.kr/jungsi/'
        },
        {
            title: '거북쌤 강준의 대면 컨설팅',
            text: '비대면 컨설팅 3회 + 최종 대면 컨설팅 1회 + 교차지원, 연쇄이동 현황에 따른 예측컷 변동 1~3일 업데이트 및 카톡채널을 통한 수시 질의 응답',
            price: '유료 - 690,000원',
            src: '/assets/main_banner/program_03.jpg',
            url: 'https://www.turtleschool.kr/gangjun/'
        },
    ];
    const router = useRouter();
    const [acc, setAcc] = useState([]);
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
    const [member, setMember] = useState(1);
    const { info, login } = useContext(loginContext); //info 파라미터  login 갱신
    const [nav, setNav] = useState(0); //퀵메뉴

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

    return (
        <div>
            <div className='quick-wrapper'>
                <div className='quick-title-wrapper'>
                    <p className='title'>
                        2022년 <p className='title-bold'>정시 프로그램</p>
                    </p>
                </div>
                <div className='quick-infor-wrapper'>
                    <div className='quick-infor-form'>
                        {border.map((list, index) => {
                            return (
                                <div className='quick-infor-box' onClick={() => window.open(list.url, '_blank')}>
                                    <img src={list.src} className='box-black' />
                                    <div className='quick-info-form'>
                                        <div className='quick-title-form'>
                                            <div className='quick-title'>{list.title}</div>
                                            <div className='quick-text'>{list.text}</div>
                                        </div>
                                    </div>
                                    <div className='quick-price-box'>
                                        <div className='quick-price-form'>
                                            <div className='quick-price-border'>{list.price}</div>
                                            {index !== 0 && (
                                                <div className='quick-detail' onClick={() => window.location.href = '/paypage'}>
                                                    예약하기 <img className='right_arrow' src='/assets/icons/arrow/arrow_right@3x.png' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
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
                    .quick-detail {
                        font-weight: normal;
                        font-size: 16px;
                        line-height: 24px;
                        text-align: right;
                        color: #9a9a9a;
                        display: flex;
                        align-items: center;
                    }
                    .title {
                        font-weight: normal;
                        font-size: 48px;
                        color: #000000;
                    }
                    .title-bold {
                        font-weight: bold;
                        font-size: 48px;
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
                        font-family: NanumSquareOTF;
                        font-weight: bold;
                        font-size: 48px;
                    }
                    .quick-infor-wrapper {
                        padding-bottom: 110px;
                    }
                    .quick-infor-form {
                        display: flex;
                        justify-content: space-between;
                        width: 1280px;
                        margin: auto;
                    }
                    .quick-infor-box {
                        width: 410px;
                        height: 576px;
                        border-radius: 14px;
                        background-color: #fff;
                        cursor: pointer;
                        box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
                    }
                    .quick-info-form {
                        width: 100%;
                        padding: 0 95px 0px 30px;
                    }
                    .quick-infor-box > .box-black {
                        width: 100%;
                        height: 240px;
                        background-color: #000;
                        border-radius: 14px 14px 0 0;
                        box-shadow: 2 2 12 0;
                    }
                    .quick-infor-box > .quick-info-form > .quick-title-form {
                        height: 200px;
                    }
                    .quick-infor-box > .quick-info-form > .quick-title-form > .quick-title {
                        font-style: normal;
                        font-weight: bold;
                        font-size: 20px;
                        line-height: 28px;
                        margin-top: 30px;
                        padding-bottom: 24px;
                    }
                    .quick-infor-box > .quick-info-form > .quick-title-form > .quick-text {
                        font-weight: normal;
                        font-size: 16px;
                        line-height: 24px;
                    }
                    .quick-infor-box > .quick-price-box > .quick-price-form {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 47px;
                        padding: 0 30px;
                    }
                    .quick-infor-box > .quick-price-box > .quick-price-form > .quick-price-border {
                        background-color: #fff2ed;
                        padding: 2px 12px;
                        color: #f45119;
                    }
                    .quick-infor-box > .quick-price-box > .quick-price-form > .quick-price-button {
                        color: #9a9a9a;
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
