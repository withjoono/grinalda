import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react'

const Layout = ({children}) => {
  return (
    <>
      <Head>
        <title>종합입시플랫폼 거북스쿨</title>
        <link rel="icon" href="https://img.ingipsy.com/assets/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="192x192" href="/pwa-iogo-192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/pwa-iogo-512x512.png" />
        <link rel="apple-touch-icon" sizes="16x16" href="/pwa-iogo-16x16.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="입시 빅데이터를 기반으로한 맞춤 입시 예측 및 코칭" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="종합입시플랫폼 거북스쿨" />
        <meta
          property="og:description"
          content="입시 빅데이터를 기반으로한 맞춤 입시 예측 및 코칭"
        />
        <meta property="og:image" content="https://ingipsy.com/assets/logo.png" />
        <meta property="og:url" content="https://ingipsy.com" />
        <meta name="naver-site-verification" content="aaf178ae8503d3d61d023e7cad5e299c2e59d9e1" />
        <script
          type="text/javascript"
          src="https://developers.kakao.com/sdk/js/kakao.min.js"
        ></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
        <script
          type="text/javascript"
          src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js"
        ></script>
        <link rel="stylesheet" href="https://unpkg.com/ress/dist/ress.min.css"></link>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.rawgit.com/moonspam/NanumSquare/master/nanumsquare.css"
        ></link>
      </Head>
      {children}
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
