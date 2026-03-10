import { useEffect, useContext } from 'react';
import loginContext from '../contexts/login';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Login = async (e) => {
    //카카오 로그인 시작. 비동기적으로 authorize를 부르고 웹사이트 홈페이지로 리디렉트 되기 때문에 세션에 authorized를 저장함. 이 이후로는 _app.js 에서 세션에 authorized가 있을시 로그인 절차를 처리함.

    const authorize = async () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('authorized', true);
        }
        await Kakao.Auth.authorize({ redirectUri: process.env.NEXT_PUBLIC_HOME_URL }); //카카오가 리디렉트 시킴. 쿼리 스트링으로 code를 같이 넣음
    };
    e.preventDefault();
    authorize();
};

const getId = async (info) => {
    //_app.js 에서 부르는 함수
    sessionStorage.removeItem('authorized');
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('code'); //쿼리 스트링에 있는 code를 부름
    const res = await axios
        .post(
            'https://kauth.kakao.com/oauth/token', //code가 유효한 코드인지 카카오 토큰 api를 부름
            new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: 'e8ee9a48c9db691527f4dfee752d0dce',
                redirect_uri: process.env.NEXT_PUBLIC_HOME_URL,
                code: myParam,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
            }
        )
        .then((res) => {
            //code가 유효해서 api가 제대로 나오면 컨텍스트의 info에 로그인 정보를 넣음
            setInfo(info.login, info.user, res.data);
        })
        .catch((err) => {
            console.log(err);
        });
};

const refreshToken = async (token, type) => {
    //_app.js 에서 엑세스 토큰이 만료된걸 확인하면 리프레시 토큰으로 새 액세스 토큰을 생성
    if (!type) {
        await axios
            .post(
                'https://kauth.kakao.com/oauth/token', //카카오일경우
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: 'e8ee9a48c9db691527f4dfee752d0dce',
                    refresh_token: token,
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                }
            )
            .then((res) => {
                if (typeof window !== 'undefined') {
                    //세 액세스 토큰 생성
                    ('access_token', res.data.access_token);
                    if (res.data.refresh_token) localStorage.setItem('refresh_token', res.data.refresh_token);
                    Kakao.Auth.setAccessToken(res.data.access_token);
                }
            })
            .catch((err) => {
                console.log(err);
                localStorage.clear();
            });
    } else if (type == 'google') {
        //구글
        getAuth().currentUser.getIdTokenResult(true).then(res => {
            if(res?.token) {
                localStorage.setItem('access_token', res.data.data.access_token)
            }
        })
    }
};

const setInfo = async (login, user, auth) => {
    // 카카오 로그인 등록
    console.log(auth);
    Kakao.Auth.setAccessToken(auth.access_token); //액세스 토큰을 등록
    await Kakao.API.request({
        // kakao api 를 불러서 회원정보 가져오기
        url: '/v2/user/me',
        success: (res) => {
            console.log(res);
            axios.get('/api/register', { headers: { auth: res.id }, params: { type: 'kakaotalk', access_token: auth.access_token, name: res?.properties?.nickname } }).then((r) => {
                //계정이 없을경우 회원가입
                login[1](true);
                user[1](res.id);
                localStorage.setItem('realuid', res.id);
                localStorage.setItem('uid', res.id);
                if (res?.properties?.token) {
                    localStorage.setItem('imp_uid', res.properties.imp_uid);
                    localStorage.setItem('token', res.properties.token);
                }
                localStorage.setItem('access_token', auth.access_token);
                localStorage.setItem('refresh_token', auth.refresh_token);
                localStorage.setItem('name', res?.properties?.nickname);
            });
        },
        fail: (e) => {
            console.log('/v2/user/me error', e);
        },
    });
};

const googlelogin = async (res, login, user) => {
    //구글 로그인
    console.log('google login', res);
    if (res.user) {
        // const ans = await axios.get('/api/confirmlogin', {
        //     //react-google-login에서 code로 로그인을 하면 주는 authorization_code로 액세스와 리프레시 둘다 받아옴
        //     params: {
        //         code: res.code,
        //         type: 'google',
        //     },
        // });

        const credential = GoogleAuthProvider.credentialFromResult(res);
        const googleid = res.user.reloadUserInfo.providerUserInfo[0].federatedId;
        const name = res.user.displayName
        const at = credential.accessToken;
        const rt = '';

        console.log('save', googleid, name, at)

        axios
            .get('/api/register', { headers: { auth: googleid }, params: { type: 'google', access_token: at, name: name } })
            .then((res) => {
                console.log(res);
                login[1](true);
                user[1](googleid);
                localStorage.setItem('realuid', googleid);
                localStorage.setItem('uid', googleid);
                localStorage.setItem('google', true);
                localStorage.setItem('name', name);
                localStorage.setItem('access_token', at);
                localStorage.setItem('refresh_token', rt);
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        const googleid = res.user.reloadUserInfo.providerUserInfo[0].federatedId;
        const name = res.user.displayName
        console.log(googleid);
        axios
            .get('/api/register', { headers: { auth: res.googleId }, params: { type: 'google' } })
            .then((res) => {
                console.log(res);
                login[1](true);
                user[1](googleid);
                localStorage.setItem('realuid', googleid);
                localStorage.setItem('uid', googleid);
                localStorage.setItem('google', true);
                localStorage.setItem('name', name);
            })
            .catch((err) => {
                console.log(err);
            });
    }
};

const facebooklogin = async (login, user) => {
    FB.login(
        (res) => {
            console.log(res);
            if (res.status === 'connected') {
                const googleid = res.authResponse.userID;
                const at = res.authResponse.accessToken;
                FB.api('/me', function (response) {
                    //페북은 리프레시 코드가 없고 단기 액세스 코드를 장기 액세스 코드로 전환 가능
                    localStorage.setItem('name', response.name);
                    axios
                        .get('/api/register', { headers: { auth: googleid }, params: { type: 'facebook', access_token: at, name: response.name } })
                        .then((res) => {
                            console.log(res);
                            login[1](true);
                            user[1](googleid);
                            localStorage.setItem('realuid', googleid);
                            localStorage.setItem('uid', googleid);
                            localStorage.setItem('facebook', true);
                            localStorage.setItem('access_token', at);
                            axios.get('/api/confirmlogin', { params: { type: 'facebook', code: at } }).then((r) => {
                                //단기 액세스 코드를 장기 액세스 코드로 전환
                                localStorage.setItem('access_token', r.data.access_token);
                            });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
                return true;
            } else {
                return false;
            }
        },
        { scope: 'public_profile,email' }
    );
};

export default Login;
export { getId, refreshToken, googlelogin, facebooklogin };
