/* 메인 페이지 */
import Head from 'next/head';
import Header from './moblie/Header';
import Footer from '../common/Footer';
import Desktop from '../Header/desktopheader';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';

const Layout = ({ children }) => {
    const router = useRouter();
    const [isFloatingVisible, setIsFloatingVisible] = useState(false);
    const mobileMenu = ['플래너', '성적관리', '합격예측', '마이클래스', '입시버틀러'];
    const [selectedMobileMenu, setSelectedMobileMenu] = useState('');

    const onMobileMenuClick = ({ target }) => {
        console.log(target.id);
        switch (target.id) {
            case '플래너':
                setSelectedMobileMenu('planner');
                break;
            case '성적관리':
                setSelectedMobileMenu('grademanage');
                break;
            case '합격예측':
                setSelectedMobileMenu('prediction');
                break;
            case '마이클래스':
                setSelectedMobileMenu('myclass');
                break;
            case '입시버틀러':
                setSelectedMobileMenu('butler');
                break;
        }
    };
    return (
        <>
            <style jsx>{`
                .disabled {
                    position: absolute;
                    top: 0;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    opacity: 50%;
                    background-color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #fc8454;
                    line-height: 300px;
                }
                .disabled h1 {
                    background-color: #000000;
                    border-radius: 20px;
                    height: 30%;
                }
                .footer {
                    bottom: 0;
                    width: 1280px;
                    color: #9d9d9d;
                    height: 219px;
                    line-height: 2em;

                    margin: 30px auto;
                }
                @media screen and (max-width: 420px) {
                    .footer {
                        width: 100%;
                        padding: 0px 15px;
                    }

                    .mobile_menu_container {
                        padding: 6px 15px;
                        display: flex;
                        flex-direction: row;
                        overflow: auto;
                        width: 100%;
                    }
                    .mobile_menu_content {
                        padding: 2px 12px;
                        font-weight: bold;
                        font-size: 14px;
                        line-height: 24px;
                        color: #9a9a9a;
                        word-break: keep-all;
                    }
                }

                .floating_container {
                    position: fixed;
                    bottom: 70px;
                    right: 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;

                    transition: height 2s;
                }

                .floating_content {
                    width: 177px;
                    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
                    border-radius: 50px;
                    color: #656565;
                    font-weight: 800;
                    font-size: 16px;
                    line-height: 16px;
                    padding: 14px 42px 14px 16px;
                    background-color: white;
                    margin-bottom: 22px;

                    -webkit-animation: fadein 0.2s linear;
                    animation: fadein 0.2s linear;

                    position: relative;
                }

                .floating_list {
                    font-weight: 800;
                    font-size: 16px;
                    line-height: 16px;
                    border-bottom: 1px solid #e9e9e9;
                    padding: 8px 0px;
                    color: #656565;
                    cursor: pointer;
                }

                .floating_list:first-child {
                    margin-top: 16px;
                    font-weight: 800;
                    font-size: 16px;
                    line-height: 16px;
                    border-bottom: 1px solid #e9e9e9;
                    padding: 8px 0px;
                    color: #656565;
                }

                .floating_list:last-child {
                    font-weight: 800;
                    font-size: 16px;
                    line-height: 16px;
                    border: none;
                    padding: 8px 0px;
                    color: #656565;
                }

                .floating_img {
                    cursor: pointer;
                }

                .img_box {
                    background: #ffffff;
                    padding: 8px;
                    border: 2px solid #f45119;
                    box-sizing: border-box;
                    box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.16);
                    width: 50px;
                    height: 50px;
                    border-radius: 25px;

                    position: absolute;
                    right: -4px;
                    bottom: 0px;
                }

                @keyframes fadein {
                    0% {
                        opacity: 0;
                    }
                    44% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }

                @-webkit-keyframes fadein {
                    0% {
                        opacity: 0;
                    }
                    44% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
            `}</style>
            <Head>
                <title>종합입시플랫폼 거북스쿨</title>
                <link rel='icon' href='/assets/logo.png' />
                <link rel='manifest' href='/manifest.json' />
                <link rel='apple-touch-icon' sizes='192x192' href='/pwa-iogo-192x192.png' />
                <link rel='apple-touch-icon' sizes='512x512' href='/pwa-iogo-512x512.png' />
                <link rel='apple-touch-icon' sizes='16x16' href='/pwa-iogo-16x16.png' />
                <meta name='viewport' content='width=device-width, initial-scale=1' />
                <meta name='description' content='입시 빅데이터를 기반으로한 맞춤 입시 예측 및 코칭' />
                <meta property='og:type' content='website' />
                <meta property='og:title' content='종합입시플랫폼 거북스쿨' />
                <meta property='og:description' content='입시 빅데이터를 기반으로한 맞춤 입시 예측 및 코칭' />
                <meta property='og:image' content='https://ingipsy.com/assets/logo.png' />
                <meta property='og:url' content='https://ingipsy.com' />
                <meta name='naver-site-verification' content='aaf178ae8503d3d61d023e7cad5e299c2e59d9e1' />
                <script async defer crossOrigin='anonymous' src='https://connect.facebook.net/en_US/sdk.js'></script>
                <script type='text/javascript' src='https://developers.kakao.com/sdk/js/kakao.min.js'></script>
                <script type='text/javascript' src='https://code.jquery.com/jquery-1.12.4.min.js'></script>
                <script type='text/javascript' src='https://cdn.iamport.kr/js/iamport.payment-1.1.5.js'></script>
                <link rel='stylesheet' href='https://unpkg.com/ress/dist/ress.min.css'></link>
                <link rel='stylesheet' type='text/css' href='https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css'></link>
            </Head>

            <UserAgentProvider ua={window.navigator.userAgent}>
                <>
                    <UserAgent mobile>
                        <div style={{ width: '100%' }}>
                            {router.pathname === '/mobile/service' || router.pathname === '/mobile/privacy' ? null : <Header redirectMenu={selectedMobileMenu}/>}
                            <div style={{ width: '100%', paddingTop: 52 }}>
                                <div className='mobile_menu_container'>
                                    {mobileMenu.map((title) => (
                                        <div id={title} className='mobile_menu_content' onClick={onMobileMenuClick}>
                                            {title}
                                        </div>
                                    ))}
                                </div>
                                {children}
                            </div>
                            <div style={{ width: '100%', borderTop: '1px #000000 solid' }}>
                                <div className='footer'>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '20px', fontWeight: 'bold', color: '#000000', cursor: 'pointer' }}>
                                        <Link href='/info/service'>
                                            <div style={{ fontSize: 14 }}>이용약관</div>
                                        </Link>
                                        <Link href='/info/privacy'>
                                            <div style={{ fontSize: 14 }}>개인정보처리방침</div>
                                        </Link>
                                        <div style={{ fontSize: 14 }}>사업제휴 및 광고안내</div>
                                    </div>

                                    <div style={{ float: 'left', fontSize: '16px', marginTop: '20px' }}>
                                        <div>사업체명 거북닷컴 대표 강준호 대표전화 02-501-3357 사업자 등록번호 127-56-00490 </div>

                                        <div>대치동 906-23 만수빌딩 502 Copyright © (주) 닥터정 All Rights Reserved</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UserAgent>
                    <UserAgent computer>
                        <>
                            <Desktop />
                            <div style={{ position: 'relative' }}>
                                {children}
                                <div style={{ width: '100%', borderTop: '1px #000000 solid' }}>
                                    <div className='footer'>
                                        <div style={{ display: 'flex', justifyContent: 'space-around', width: '640px', fontSize: '20px', fontWeight: 'bold', color: '#000000', cursor: 'pointer' }}>
                                            <Link href='/info/service'>
                                                <div>이용약관</div>
                                            </Link>
                                            <Link href='/info/privacy'>
                                                <div>개인정보처리방침</div>
                                            </Link>
                                            <div>사업제휴 및 광고안내</div>
                                        </div>
                                        <div style={{ float: 'right' }}>
                                            <img src='/assets/home_icon/logo_hori.png' style={{ cursor: 'pointer' }} />
                                        </div>

                                        <div style={{ float: 'left', fontSize: '16px', marginTop: '70px' }}>
                                            <div>사업체명 거북닷컴 대표 강준호 대표전화 02-501-3357 사업자 등록번호 127-56-00490 </div>

                                            <div>대치동 906-23 만수빌딩 502 Copyright © (주) 닥터정 All Rights Reserved</div>
                                        </div>
                                    </div>
                                </div>
                                <div className='floating_container'>
                                    {isFloatingVisible && (
                                        <>
                                            <div className='floating_content' style={{ cursor: 'pointer' }} onClick={() => window.open('https://www.turtleschool.kr/consult/', '_blank')}>
                                                거북스쿨 사용법
                                                <div className='img_box'>
                                                    <img src='/assets/home_icon/question_image/32_geobuk.png' width={32} height={32} />
                                                </div>
                                            </div>
                                            <div className='floating_content' style={{ borderRadius: 22 }}>
                                                입시코칭
                                                <div className='floating_list' onClick={() => window.open('https://www.turtleschool.kr/coach1/', '_blank')}>
                                                    1등급
                                                </div>
                                                <div className='floating_list' onClick={() => window.open('https://www.turtleschool.kr/coach2/', '_blank')}>
                                                    2등급
                                                </div>
                                                <div className='floating_list' onClick={() => window.open('https://www.turtleschool.kr/coach3/', '_blank')}>
                                                    3등급
                                                </div>
                                                <div className='floating_list' onClick={() => window.open('https://www.turtleschool.kr/coach4/', '_blank')}>
                                                    4~5등급
                                                </div>
                                                <div className='img_box' style={{ top: -4 }}>
                                                    <img src='/assets/home_icon/question_image/32_coaching.png' width={30} height={30} />
                                                </div>
                                                <div className='floating_list' onClick={() => window.open('https://www.turtleschool.kr/coach6/', '_blank')}>
                                                    6등급 이하
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <img src='/assets/home_icon/question_image/65_coaching.png' width={65} height={65} className='floating_img' onClick={() => setIsFloatingVisible((prev) => !prev)} />
                                </div>
                            </div>
                        </>
                    </UserAgent>
                </>
            </UserAgentProvider>
        </>
    );
};
/*{router.pathname.includes('gpa') || router.pathname.includes('early') || router.pathname.includes('regular') || router.pathname.includes('mockup') ? <div className='disabled'><h1>서비스 시작일:21년 7월 26일</h1></div> : null }</div>*/
export default Layout;
