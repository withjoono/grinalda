import Link from 'next/link';
import React from 'react';
import useLogin from '../../comp/loginwrapper';
import withDesktop from '../../comp/withdesktop';
import Home from '../redirect';

const Login = () => {
  return (
    <>
      <style jsx>
        {`
          * {
            margin: 0px;
            padding: 0px;
          }

          li {
            list-style: none;
          }

          a {
            text-decoration: none;
          }

          .wrap {
            width: 400px;
          }
          .content {
            width: 472px;
            margin: auto;
          }
          .title {
            height: 150px;
            border-bottom: 1px #de6b3d solid;
            padding: 10px 0;
          }
          .title h1 {
            text-align: left;
            color: #de6b3d;
            font-size: 30px;
            font-weight: bold;
          }
          .buttonBox {
            height: 671px;
            margin-top: 30px;
          }
          .button {
            width: 472px;
            height: 66px;
            border: 1px #9d9d9d solid;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;
          }
          .button:hover {
            background-color: #fcbf77;
            color: white;
          }
          .button5 {
            color: white;
            background-color: #de6b3d;
          }
          .button:nth-child(n + 2) {
            margin-top: 12px;
          }
          .button p:nth-of-type(1) {
            margin-left: 10px;
          }
          .button p:nth-of-type(2) {
            margin-right: 10px;
          }
        `}
      </style>
      <div className="content">
        <div className="title">
          <h1>회원가입 종류 선택</h1>
        </div>
        <div className="buttonBox">
          <Link href="/main/studentform">
            <div className="button button1">
              <p>학생(멘티)</p>
              <p>&#5171;</p>
            </div>
          </Link>
          <Link href="/main/parentform">
            <div className="button button2">
              <p>학부모</p>
              <p>&#5171;</p>
            </div>
          </Link>
          <Link href="/main/teacherform">
            <div className="button button3">
              <p>선생님(멘토)</p>

              <p>&#5171;</p>
            </div>
          </Link> 
        </div>
      </div>
    </>
  );
};

const Mobile = () => {
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
            font-size: 24px;
            font-weight: bold;
            margin: auto;
            font-size: 24px;
          }
          .img {
            width: 152px;
            height: 152px;
            margin: auto calc(50% - 76px);
          }
          .button1 {
            width: 314px;
            height: 54px;
            line-height: 54px;
            margin: auto;
            font-size: 16px;
            border-radius: 4px;
          }
          .stdn {
            color: white;
            margin-top: 51px;
            background-color: #fcbf77;
          }
          .parents {
            margin-top: 12px;
            border: 1px #9d9d9d solid;
          }
          .teacher {
            margin-top: 12px;
            border: 1px #9d9d9d solid;
          }
          .else {
            margin-top: 12px;
            border: 1px #9d9d9d solid;
          }
          .mentor {
            color: white;
            margin-top: 12px;
            background-color: #de6b3d;
          }
          .button1 p {
            margin-left: 10px;
          }
        `}
      </style>
      <header>자신의 분류를 선택해주세요!</header>
      <img className="img" src="https://img.ingipsy.com/assets/unknown.png"></img>
      <Link href="/main/studentform">
        <div className="button1 stdn">
          <p>학생(멘티)</p>
        </div>
      </Link>
      <Link href="/main/parentform">
        <div className="button1 parents">
          <p>학부모</p>
        </div>
      </Link>
      <Link href="/main/teacherform">
        <div className="button1 teacher">
          <p>선생님(멘토)</p>

        </div>
      </Link> 
    </>
  );
};

export default useLogin(withDesktop(Login, Mobile), Home);
