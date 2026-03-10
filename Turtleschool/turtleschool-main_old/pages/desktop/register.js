import Head from 'next/head';
import React from 'react';
import Image from 'next/image';
import RegisterButtons from './registerbuttons';

//export const provider = new GoogleAuthProvider();

const Register = () => {
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
            <span style={{color: '#f45119', fontWeight: 'bold'}}>회원가입</span>
          </div>
        </div>
        <span style={{textAlign: 'center', margin: '20px 0', fontSize: '1.3rem'}}>
          SNS계정으로 간편하게 회원가입
        </span>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <RegisterButtons />
        </div>
      </div>
    </>
  );
};

export default Register;
