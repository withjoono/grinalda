import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import Head from 'next/head';
import React from 'react';
import startlogin, {facebooklogin, googlelogin} from '../../comp/loginn';
import useLogin from '../../comp/loginwrapper';
import withDesktop from '../../comp/withdesktop';
import loginContext from '../../contexts/login';
import desktopRegister from '../desktop/register';
import Home from '../redirect';

const provider = new GoogleAuthProvider();

const Register = ({history}) => {
  const {login, user} = React.useContext(loginContext);
  const responseGoogle = res => {
    googlelogin(res, login, user);
  };
  const fb = () => {
    facebooklogin(login, user);
  };

  const googleLogin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        googlelogin(result, login, user);
        // ...
      })
      .catch(error => {
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
      <style jsx>
        {`
          * {
            margin: 0px;
            padding: 0px;
          }
          ul {
            list-style: none;
          }

          body {
            width: 100%;
            min-width: 300px;
          }
          header {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 30px;
          }
          .title1 {
            width: 280px;
            height: 48px;
            margin: auto;
            text-align: center;
            font-size: 16px;
            color: #9d9d9d;
          }
          .img {
            width: 160px;
            height: 160px;
            margin: 10px calc(50% - 80px);
          }
          .icon {
            width: 314px;
            height: 54px;
            margin: auto;
            border-radius: 4px;
            text-align: center;
            line-height: 54px;
          }
          .kakao {
            margin-top: 164px;
            background-color: #fde914;
          }
          .facebook {
            margin-top: 12px;
            background-color: #3c5896;
            color: white;
          }
          .google {
            margin-top: 12px;
            background-color: #f2f2f2;
          }
        `}
      </style>
      <Head>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        ></script>
      </Head>
      <header>회원가입</header>
      <section className="title1">
        <p>학생,학부모,선생님이 합께 공유하는</p>
        <p>&apos;학습과 성적 관리&apos; 플랫폼</p>
      </section>
      <img className="img" src="https://img.ingipsy.com/assets/logo_white.png"></img>
      <section className="icon kakao" onClick={startlogin}>
        카카오계정으로 회원가입
      </section>
      {/* //startlogin는 loginn.js의 Login. 리디렉트 방식으로 쿼리 스트링에 code를 넣어줌. */}
      {/* <section className="icon facebook" onClick={fb}>페이스북계정으로 로그인</section>  */}
      {/* //fb는 loginn.js의 facebooklogin */}
      <section className="icon google" onClick={googleLogin}>
        구글계정으로 회원가입
      </section>
      {/* <GoogleLogin
				clientId="168190756460-j85kjpmc8493cjt5qqgua4rou9s91jrm.apps.googleusercontent.com"
				buttonText="Login"
				onSuccess={responseGoogle} //responseGoogle은 loginn.js의 googlelogin 으로 바로 넘어감.
				onFailure={(res) => {}}
				//isSignedIn={true}
				accessType="offline"
				responseType="code" //responseType이 code이기 때문에 authorization_code 가 response에 나오고 이걸로 액세스와 리프레시 토큰을 서버 /api/confirmlogin에서 받아올 수 있음
				approvalPrompt="force"
				prompt="consent"
				cookiePolicy={'single_host_origin'}
				render={renderProps => (
						<section className="icon google" onClick={googleLogin} disabled={renderProps.disabled}>구글계정으로 로그인</section>
					)}
			  /> */}
    </>
  );
};

export default useLogin(Home, withDesktop(desktopRegister, Register));
