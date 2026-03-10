import React from 'react';
import startlogin, { googlelogin, facebooklogin } from '../../comp/loginn';
import styles from './login.module.css';
import loginContext from '../../contexts/login';
import useLogin from '../../comp/loginwrapper';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import Head from 'next/head';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const provider = new GoogleAuthProvider();

const Login = () => {
    const { login, user } = React.useContext(loginContext);
    const { title, subtitle, btn } = styles;

    const responseGoogle = (res) => {
        console.log(res);
        googlelogin(res, login, user);
    };

    const fb = () => {
        facebooklogin(login, user);
    };

    const googleLogin = () => {
        const auth = getAuth();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('googlelin', result);
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                googlelogin(result, login, user);
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
    };

    return (
        <>
            <Head>
                <script async defer crossOrigin='anonymous' src='https://connect.facebook.net/en_US/sdk.js'></script>
            </Head>
            <div className='page'>
                <div className={title}>거북스쿨에 오신 것을 환영합니다</div>
                <div className={subtitle}>거북스쿨 로그인</div>
                <div className={styles.container}>
                    <div className={styles.gray}>SNS계정으로 간편하게 로그인</div>
                    <div style={{ display: 'flex', marginRight: '-33px', justifyContent: 'center' }}>
                        <div className={btn} onClick={startlogin}>
                            <img src='/assets/kakaotalk.png' />
                        </div>
                        <div className={btn} onClick={googleLogin}>
                            <img src='/assets/google.png' />
                        </div>
                        {/* <div className={btn} onClick={fb}><img src='/assets/facebook.png' /></div> */}
                        {/* <GoogleLogin
                            clientId='168190756460-j85kjpmc8493cjt5qqgua4rou9s91jrm.apps.googleusercontent.com'
                            buttonText='Login'
                            onSuccess={responseGoogle}
                            onFailure={(res) => {
                                console.log(res);
                            }}
                            accessType='offline'
                            responseType='code'
                            approvalPrompt='force'
                            prompt='consent'
                            cookiePolicy={'single_host_origin'}
                            render={(renderProps) => (
                                <div className={btn} onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    <img src='/assets/google.png' />
                                </div>
                            )}
                        /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
