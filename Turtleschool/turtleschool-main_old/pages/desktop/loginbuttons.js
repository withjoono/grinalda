import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import React from 'react';
import startlogin, {facebooklogin, googlelogin} from '../../comp/loginn';
import loginContext from '../../contexts/login';
import Image from 'next/image';

const provider = new GoogleAuthProvider();

const LoginButtons = () => {
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
    <div>
      <style jsx>
        {`
          .loginButton {
            display: flex;
            width: 350px;
            flex-direction: column;
            margin-top: 10px;
            margin-left: 30px;
            cursor: pointer;
          }
          .kakao_login_container {
            display: table;
            border: 4px solid #ffe500;
            width: 320px;
            height: 55px;
            font-size: 21px;
            font-weight: bold;
            text-align: center;
            border-radius: 12px;
            background-color: #fee500;
          }
          .kakao_login_text {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
          }
          .kakao_login_icon {
            display: table-cell;
            vertical-align: middle;
          }
          .google_login_container {
            display: table;
            margin-top: 20px;
            border: thin solid #444;
            width: 320px;
            height: 59px;
            font-size: 21px;
            font-weight: bold;
            text-align: center;
            border-radius: 12px;
            background-color: #ffff;
          }
          .google_login_text {
            display: table-cell;
            vertical-align: middle;
            text-align: center;
            color: #444;
          }
          .google_login_icon {
            display: table-cell;
            vertical-align: middle;
            padding-top: 7px;
          }
        `}
      </style>
      <div className="loginButton">
        <div onClick={startlogin}>
          <div className="kakao_login_container">
            <div className="kakao_login_icon">
              <Image
                src="https://img.ingipsy.com/assets/icons/kklogo.png"
                alt=""
                width={50}
                height={50}
              ></Image>
            </div>
            <div className="kakao_login_text">카카오로 로그인</div>
            <p>{''}</p>
          </div>
        </div>
        <div onClick={googleLogin}>
          {/* <Link href="/main/Login" passHref> */}
          <div className="google_login_container">
            <div className="google_login_icon">
              <Image
                src="https://img.ingipsy.com/assets/icons/gglogo.png"
                alt=""
                width={35}
                height={35}
              ></Image>
            </div>
            <div className="google_login_text">구글로 로그인</div>
            <p> </p>
          </div>
          {/* </Link> */}
        </div>
      </div>
      {/* <div className={btn} onClick={fb}><img src='/assets/facebook.png' /></div> */}
      {/* <GoogleLogin
                            clientId='168190756460-j85kjpmc8493cjt5qqgua4rou9s91jrm.apps.googleusercontent.com'
                            buttonText='Login'
                            onSuccess={responseGoogle}
                            onFailure={(res) => {
                                
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
  );
};

export default LoginButtons;
