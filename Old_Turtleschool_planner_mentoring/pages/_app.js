import '../styles/globals.css';
import loginContext, { Opt } from '../contexts/login';
import loginModule from '../comp/loginModule';
import { getId, refreshToken } from '../comp/loginn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../comp/layout/mainlayout';
import Layout2 from '../comp/layout/secondlayout';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration

import './search.css';

function MyApp({ Component, pageProps }) {
    const Provider = loginContext.Provider;
    const loginInfo = loginModule();
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);
    const [type, setType] = useState('default');
    const [logout, setLogout] = useState(false);
    config.autoAddCss = false;
    useEffect(() => {
        //회원정보에 이름이 등록되지 않았으면 회원정보 입력하는 페이지로 옮김
        if (!loginInfo.user[0] || router.pathname.includes('main/')) return;
        axios.get('/api/members', { headers: { auth: loginInfo.user[0] } }).then((res) => {
            loginInfo.info[1](res.data.data[0]);
            console.log(res);
            if (!res.data.data || !res.data.data[0].userName || res.data.data[0].userName == '' || !res.data.data[0].relationCode)
                router.push('/main/choosetype');
        });
    }, [router.pathname, loginInfo.user[0]]);

    useEffect(() => {
        if (loginInfo.user[0]) {
            setLogout(true);
        } else {
            if (logout) {
                window.location.href = '/';
                setLogout(false);
            }
        }
    }, [loginInfo.user[0]]);

    useEffect(() => {
        const payed = localStorage.getItem('jungsi');
        const id = localStorage.getItem('uid');

        // if(!id && router.pathname !== '/' && !router.pathname.includes('main/Login') && !router.pathname.includes('privacy') && !router.pathname.includes('service')) {
        //     window.location.href = '/main/Login'
        // } else if (!payed && router.pathname.includes('regular')) {
        //     alert('정시 컨설팅은 결제가 필요합니다.');
        //     window.location.href = '/paypage';
        // }
    }, [router.pathname]);

    useEffect(() => {
        //사이트를 켰을때 맨 처음으로 하는 것들
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement.removeChild(jssStyles);
        }
        if (typeof window !== 'undefined') {
            Kakao.init('c890a301146134342827ed4d2f27e83e');
            console.log('Kakao.init', Kakao.isInitialized());
            // 829019a01673bbc81e68910e46a52e9e"); 카카오 로그인 initialize

            const firebaseConfig = {
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_GOOGLE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_GOOGLE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_GOOGLE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_GOOGLE_MESSAGE_ID,
                appId: process.env.NEXT_PUBLIC_GOOGLE_APP_ID,
                measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASURE_ID,
            };

            console.log('firebaseConfig', firebaseConfig);

            const app = initializeApp(firebaseConfig);

            window.fbAsyncInit = function () {
                //페북 로그인 initialize
                FB.init({
                    appId: process.env.NEXT_PUBLIC_FACEBOOK_APPID,
                    autoLogAppEvents: true,
                    xfbml: true,
                    version: 'v10.0',
                });
                console.log('fb init?');
            };
            if (sessionStorage.getItem('authorized')) {
                // 카카오 로그인 리디렉트 후 loginn.js의 getId를 부름
                console.log('kakako redirected');
                getId(loginInfo);
            }
            //밑의 부분은 이미 로그인이 되있을 경우
            if (localStorage.getItem('realuid')) {
                console.log('already loginned');
                const u = localStorage.getItem('realuid'); //로컬스토리지에 이미 저장된 토큰, 로그인 경로를 가져옴
                const v = localStorage.getItem('refresh_token');
                const w = localStorage.getItem('access_token');
                const z = localStorage.getItem('google');
                const f = localStorage.getItem('facebook');
                loginInfo.login[1](true);
                loginInfo.user[1](u);
                const id = localStorage.getItem('uid');
                _getPayInfo(id);
                localStorage.setItem('uid', u);

                // if (u) {
                //     axios.get('/api/push', { headers: { auth: u } }).then((res) => {
                //         //푸시 정보를 가져옴
                //         if (res.data.msg[0].push_token !== '') loginInfo.push[1](true);
                //     });
                //     loginInfo.login[1](true);
                //     loginInfo.user[1](u);
                //     localStorage.setItem('uid', u);
                // }
                if (u && v && !z && !f) {
                    //카카오 로그인일경우 액세스 토큰 만료 여부 확인
                    console.log('kakao login');
                    loginInfo.access_token[1](w);
                    Kakao.Auth.getStatusInfo((res) => {
                        if (res.status == 'not_connected') {
                            refreshToken(v); //만료되면 리프레시 토큰 함수를 부름
                        }
                    });
                    loginInfo.refresh_token[1](v);
                } else if (u && v && z && w) {
                    console.log('google login');
                    loginInfo.access_token[1](w);
                    // 구글 로그인일경우
                    // const f = async () => {
                    //     await axios
                    //         .get('https://www.googleapis.com/oauth2/v1/tokeninfo', {
                    //             // 액세스 토큰 만료 여부를 구글 api를 불러 에러가 뜨는지 안뜨는지 확인
                    //             params: {
                    //                 access_token: w,
                    //             },
                    //         })
                    //         .catch((err) => {
                    //             console.log(err, w);
                    //             refreshToken(v, 'google');
                    //         } )//에러가 떠서 만료되면 리프레시 토큰 함수를 부름
                    //         f();
                    // };
                    // refreshToken(v, 'google')
                } else if (u && w && f) {
                    //페북 로그인
                    console.log('facebook login');
                    const f = async () => {
                        const result = await axios.get('https://graph.facebook.com/debug_token', {
                            // 액세스 토큰 만료 여부를 페북 api를 불러 에러가 뜨는지 안뜨는지 확인
                            params: {
                                input_token: w,
                                access_token: process.env.FACEBOOK_ID + '|' + process.env.FACEBOOK_SECRET,
                            },
                        });
                        //페북은 리프레시 토큰이 없어서 만료되면 그냥 로그아웃시킴
                        if (!result.data.data || !result.data.data.user_id) {
                            localStorage.clear();
                            loginInfo.login[1](false);
                            loginInfo.user[1](null);
                        }
                    };
                    f();
                }
            }
            setLoaded(true);
        }
    }, []);

    const _getPayInfo = (id) => {
        axios
            .get('/api/csat/selectpay', {
                headers: {
                    auth: id,
                },
                params: {
                    typesid: 9,
                },
            })
            .then((res) => {
                console.log('selectpay', res);
                localStorage.setItem('jungsi', res.data.data[0].pay_yn === 'Y' ? true : false);
            });
    };

    const handleRouteChange = (url, { shallow }) => {
        console.log(url, shallow);
        const routes = ['gpa', 'early', 'regular', 'mockup', 'manager', 'setting', 'timetable', 'nonsul'];

        if (!localStorage.getItem('realuid')) {
            console.log(routes.map((r) => url.includes(r)).reduce((a, b) => a || b, false));
            if (routes.map((r) => url.includes(r)).reduce((a, b) => a || b, false)) {
                router.replace('/main/Login');
            }
        }
    };

    const handleRouteStartChange = (url, { shallow }) => {
        const payOnly = ['regular'];

        const routes = ['gpa', 'early', 'regular', 'mockup', 'manager', 'setting', 'timetable', 'nonsul'];

        // if (payOnly.map((r) => url.includes(r)).reduce((a, b) => a || b, false)) {
        //     console.log('regular');
        //     _getPayInfo(localStorage.getItem('uid'), (isPayed) => {
        //         if (!isPayed) {
        //             alert('정시 컨설팅은 결제가 필요합니다.');
        //             window.location.href = '/paypage';
        //             console.log('jungsi not payed');
        //         } else {
        //             console.log('jungsi payed');
        //         }
        //     });
        // }
    };

    useEffect(() => {
        router.events.on('routeChangeStart', handleRouteStartChange);
        // router.events.on('routeChangeComplete', handleRouteChange);

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            // router.events.off('routeChangeStart', handleRouteChange);
            router.events.off('routeChangeStart', handleRouteStartChange);
        };
    }, []);

    if (!loaded)
        return (
            <Layout2>
                {' '}
                <div className="lds-ripple">
                    <div></div>
                    <div></div>
                </div>
            </Layout2>
        );
    if (router.pathname == '/main/Login') {
        return (
            <Provider value={loginInfo}>
                <Opt.Provider value={{ type: [type, setType] }}>
                    {' '}
                    <Layout2>
                        {' '}
                        <Component {...pageProps} />{' '}
                    </Layout2>{' '}
                </Opt.Provider>{' '}
            </Provider>
        );
    } else if (router.pathname == '/regular/detail') {
        return (
            <Provider value={loginInfo}>
                <Opt.Provider value={{ type: [type, setType] }}>
                    {' '}
                    <Component {...pageProps} />{' '}
                </Opt.Provider>{' '}
            </Provider>
        );
    } else {
        return (
            <Provider value={loginInfo}>
                <Opt.Provider value={{ type: [type, setType] }}>
                    {' '}
                    <Layout>
                        {' '}
                        <Component {...pageProps} />{' '}
                    </Layout>{' '}
                </Opt.Provider>{' '}
            </Provider>
        );
    }
}

export default MyApp;
