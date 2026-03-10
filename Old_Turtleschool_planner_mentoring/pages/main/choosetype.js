import React from 'react';
import Home from '../redirect'
import useLogin from '../../comp/loginwrapper'
import withDesktop from '../../comp/withdesktop'
import Link from 'next/link'

const Login = () => {
    return(
        <>
			<style jsx>
			{`
			* {
            margin: 0px;
            padding: 0px;
            font-family: "Noto Sans CJK KR";
			}

			li {
				list-style: none;
			}

			a {
				text-decoration: none;
			}

			.wrap {
				width: 400px;
				height: 2266px;
			}
			.content{
				width:472px;
				height:2216px;
				margin:auto;
			}
			.title{
				height:173px;
				border-bottom: 1px #DE6B3D solid;
			}
			.title h1{
				color:#DE6B3D;
				font-size: 30px;
				font-weight: bold;
				line-height: 300px;
			}
			.buttonBox{
				height:671px;
				margin-top:30px;
			}
			.button{
				width:472px;
				height:66px;
				border:1px #9D9D9D solid;
				border-radius: 8px;
				display: flex;
				justify-content: space-between;
				line-height: 66px;
			}
			.button1{
				background-color: #FCBF77;
				color:white;
			}
			.button5{
				color:white;
				background-color: #DE6B3D;
			}
			.button:nth-child(n+2){
				margin-top:12px;
			}
			.button p:nth-of-type(1){
				margin-left:10px;
			}
			.button p:nth-of-type(2){
				margin-right:10px;
			}
				`}
			</style>
			<div className="content">
        <div className="title">
            <h1>회원가입 종류 선택</h1>
        </div>
        <div className="buttonBox">
			<Link href='/main/studentform'>
				<div className="button button1">
					<p>학생</p>
					<p>&#5171;</p>
				</div>
			</Link>
			<Link href='/main/parentform'>
				<div className="button button2">
					<p>학부모</p>
					<p>&#5171;</p>
				</div>
			</Link>
			<Link href='/main/teacherform'>
				<div className="button button3">
					<p>학교 선생님</p>
					<p>&#5171;</p>
				</div>
			</Link>
			<Link href='/main/teacherform'>
				<div className="button button4">
					<p>그외 선생님</p>
					<p>&#5171;</p>
				</div>
			</Link>
			<Link href='/main/mentorform'>
				<div className="button button5">
				   <p>거북스쿨 멘토</p>
				   <p>&#5171;</p>
				</div>
			</Link>
        </div>
   
    </div>
		</>
    );
}

const Mobile = () => {
	return(
        <>
			<style jsx>
			{`
			* {
            margin: 0px;
            padding: 0px;
            font-family: "Noto Sans CJK KR";
        }
     
        ul {
            list-style: none;
        }

        body{
            width:100%;
            min-width:300px;
        }
        header{
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin:auto;
            font-size: 24px;
        }
        .img{
            width:152px;
            height:152px;
            margin:auto calc(50% - 76px);
        }
        .button1{
            width:314px;
            height:54px;
            line-height: 54px;
            margin:auto;
            font-size: 16px;
            border-radius: 4px;
        }
        .stdn{
            color:white;
            margin-top:51px;
            background-color: #FCBF77;
            
        }
        .parents{
            margin-top:12px;
            border:1px #9D9D9D solid;
        }
        .teacher{
            margin-top:12px;
            border:1px #9D9D9D solid
        }
        .else  {
            margin-top:12px;
            border:1px #9D9D9D solid
        }
        .mentor{
            color:white;
            margin-top:12px;
            background-color: #DE6B3D ;
        }
        .button1 p {
            margin-left:10px;
        }
				`}
			</style>
        <header>자신의 분류를 선택해주세요!</header>
		<img className="img" src='/assets/unknown.png'></img>
			<Link href='/main/studentform'>
				 <div className="button1 stdn" ><p>학생</p></div>
			</Link>
			<Link href='/main/parentform'>
				<div className="button1 parents"><p>학부모</p></div>
			</Link>
			<Link href='/main/teacherform'>
				<div className="button1 teacher"><p>학교 선생님</p></div>
			</Link>
			<Link href='/main/teacherform'>
				<div className="button1 else"><p>그외 선생님</p></div>
			</Link>
			<Link href='/main/mentorform'>
				<div className="button1 mentor"><p>거북스쿨 멘토</p></div>
			</Link>
   
		</>
    );
}

export default useLogin(withDesktop(Login,Mobile),Home)