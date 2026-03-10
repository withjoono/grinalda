# 거북스쿨 웹 사이트

![NPM version](https://img.shields.io/badge/npm-v8.3.1-red)&nbsp;
[![Node.js version](https://img.shields.io/badge/node-v16.14.0-brightgreen)](https://nodejs.org/ko/download/)&nbsp;
[![Next.js version](https://img.shields.io/badge/nextjs-v12.1.0-black)](https://nextjs.org/blog/next-12-1?utm_source=next-site&utm_medium=banner&utm_campaign=next-website)&nbsp;
[![React version](https://img.shields.io/badge/react-v17.0.2-9cf)](https://reactjs.org/versions/)&nbsp;
[![React version](https://img.shields.io/badge/postgresql-v13.3-blue)](https://docs.aws.amazon.com/ko_kr/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.version133)&nbsp;

## 프로젝트 실행 방법

- `npm` 으로만 작업 부탁드립니다. ( `yarn` ❌ )

```bash
# 현재 프로젝트를 클론 받음
$ git clone https://github.com/turtledotcom/turtleschool.git

# 필요한 package 설치
$ cd turtleschool
$ npm cache clean --force
$ npm i

# Nest.js build
$ npm run build

#### 3000번 포트 사용 ####
# Nest.js start
$ npm run start

#### 개발 시 dev 환경으로 확인하고 싶다면 ####
$ npm run dev
```

[https://ingipsy.com](https://ingipsy.com) 로 접속해서 결과를 확인할 수 있다.

</br>

## 파일 구조

```
├── compㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/컴포넌트
├── context
│   └── login.jsㅤㅤㅤㅤㅤㅤㅤㅤ/로그인 컨텍스트
├── libㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/PostgreSQL 서버에 연결하는 라이브러리(pool)
├── pagesㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/모든 화면
│   ├── api	ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/nextjs에서 제공하는 서버사이드 api
│   ├── desktopㅤㅤㅤㅤㅤㅤㅤㅤㅤ/데스크탑에 최적화 된 페이지(컴포넌트 형식으로)
│   ├── earlyㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ /수시 페이지
│   ├── gpaㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/내신 페이지
│   ├── regularㅤㅤㅤㅤㅤㅤㅤㅤㅤ/정시(현재 사용 ❌ )
│   ├── mockupㅤㅤㅤㅤㅤㅤㅤㅤㅤ /모의
│   ├── mainㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/로그인 및 회원정보
│   ├── managerㅤㅤㅤㅤㅤㅤㅤㅤㅤ/연동 및 관리자 페이지
│   ├── myclassㅤㅤㅤㅤㅤㅤㅤㅤㅤ/마이클래스 유료
│   ├── myclass_freeㅤㅤㅤㅤㅤ /마이클래스 무료
│   ├── settingㅤㅤㅤㅤㅤㅤㅤㅤㅤ/설정
│   └── temps
│   	└── s-mentoringㅤㅤㅤ /멘토링
├── public
└── stylesㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ/글로벌 CSS globals.css
```
