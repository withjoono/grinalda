import Head from 'next/head';
import React from 'react';
import LoginButtons from './loginbuttons';
import Image from 'next/image';
import styled from 'styled-components';
import Link from 'next/link';
//export const provider = new GoogleAuthProvider();
const LinkCodeButton = styled.button`
  font-weight: bold;
  border: 1.5px solid #f45119;
  border-radius: 4px;
  font-size: 1rem;
  color: #f45119;
  height: 45px;
  width: 300px;
  padding: 5px 0;
  &:hover {
    background-color: #f45119;
    color: #ffffff;
  }
`;
const Login = () => {
  return (
    <>
      <Head>
        <script
          async
          defer
          crossOrigin="anonymous"
          src="https://connect.facebook.net/en_US/sdk.js"
        ></script>
      </Head>
      <div
        style={{
          width: '100%',
          height: 'inherit',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          maxHeight: '700px',
          minHeight: '700px',
        }}
      >
        <h2>거북스쿨에 오신 것을 환영합니다</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            minWidth: '350px',
            borderBottom: '2px solid #f45119',
          }}
        >
          <Image
            src="https://img.ingipsy.com/manifest/pwa-logo-192x192.png"
            alt="main_logo"
            width={90}
            height={65}
          ></Image>
          <div
            style={{
              marginLeft: '30px',
              fontSize: '30px',
            }}
          >
            <span style={{color: '#f45119', fontWeight: 'bold'}}>로그인</span>
          </div>
        </div>
        <span style={{textAlign: 'center', margin: '20px 0', fontSize: '1.3rem'}}>
          SNS계정으로 간편하게 로그인
        </span>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <LoginButtons />
        </div>

        <div
          style={{
            minWidth: '350px',
            margin: '40px 0',
            height: '2px',
            backgroundColor: 'rgb(225,225,225)',
          }}
        ></div>
        <Link href="/main/Register">
          <LinkCodeButton>
            <span>SNS계정으로 간편 회원가입하기</span>
          </LinkCodeButton>
        </Link>
      </div>
    </>
  );
};

export default Login;
