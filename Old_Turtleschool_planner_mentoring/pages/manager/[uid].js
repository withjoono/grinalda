import { useRouter } from 'next/router'
import {useContext, useEffect} from 'react'
import loginContext from '../../contexts/login'

const Desktop = ({uid}) => {
	const {virtual} = useContext(loginContext)
	useEffect(() => {
		axios.get('/api/members', {
			headers: {
				auth: uid
			}
		}).then(res => virtual[1](res.data.data))
	},[])
	
	return (
		<>
			<style jsx>{`
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
        .profileBox{
            width:1920px;
            height:200px;
            background-color: #F8EDDA;
           
            
        }
        .profileBox .img{
            width:120px;
            height:120px;
            float:left;
            background-color: teal;
            margin-left:320px;
            margin-top:40px;
        }
        .profileBox .profile ul:nth-of-type(1){
            margin-top:40px;
            margin-left:30px;
            float:left;
        }
        .profileBox .profile ul:nth-of-type(1) li:nth-of-type(1){
            font-size: 30px;
            font-weight: bold;
        }
        .profileBox .profile ul:nth-of-type(1) li:nth-of-type(2){
            font-size: 20px;
            margin-top:6px;
            color:#9D9D9D ;
            
        }

        .profileBox .profile ul:nth-child(n+2) li:nth-of-type(1){
            font-size: 20px;
            color:#9D9D9D;
        }
        .profileBox .profile ul:nth-child(n+2) li:nth-of-type(2){
            margin-top:13px;
            font-size: 20px;
        
        }
        .profileBox .profile ul:nth-child(n+2){
            margin-top:50px;
            margin-left:80px;
            float:left;
         
        }
        .content{
            width:1280px;
            height:1247px;
            margin:auto;
        }
        .nameBox{
      
            width:1280px;
            height:89px;
            background-color:#FC8454;
            border-radius: 20px;
            box-shadow: 3px 3px 16px rgba(ED, 93, 6F, 100%);
            color:white;
            margin-top:40px;

        }
        .nameBox p{
            float: left;
            line-height: 89px;
          
        }
        .nameBox p:nth-of-type(1){
            float: left;
            font-size:30px;
            margin-left:40px;
        }
        .nameBox p:nth-of-type(2){
            float: left;
            font-size:24px;
            margin-left:100px;
        }
        .menuButton{
            width:1300px;
            height: 237px;
            border-bottom: 1px #CBCBCB solid;
        }
        .menuButton:nth-of-type(5){
            width:1300px;
            height: 237px;
            border-style: none;
        }
        .menuButton:nth-of-type(2) h1{
            font-size:30px;
            font-weight: bold;
           margin-top:80px;
        }
        .menuButton:nth-child(n+3) h1{
            font-size:30px;
            font-weight: bold;
           margin-top:30px;
        }
        .menuButton .menuTitle:nth-of-type(1){
            float:left;
            margin-top:5px;
            background-color:darkgray;
            width:640px;
            height:120px;
            display: flex;
            justify-content: space-around;
        }
        .menuButton .menuTitle:nth-of-type(2){
            float:right;
            margin-top:5px;
            background-color:darkgray;
            width:640px;
            height:120px;
            display: flex;
            justify-content: space-around;
        }
        
        .menuButton .menuTitle p{
          
            
            line-height:120px;
            color:white;
            font-weight: bold;
            font-size: 28px;
        
        }
			`}</style>
			  <div className="profileBox">
				<div className="img">
				</div>
				<div className="profile">
					<ul>
						<li>{info[0].userName}</li>
						<li>{info[0].univ} {info[0].department}</li>
					</ul>
					<ul>
						{/*
						<li>담당 반 수</li>
						<li>{myClass ? myClass.clscout : 0}</li>
						*/}
						<li>{info[0].relationCode = "70" ? "멘토" : "멘티"}</li>
					</ul>
				</div>
			</div>
			<div className="content">
				<div className="nameBox">
					<p>김샛별</p>
					<p>반포고등학교</p>
            </div>
				<div className="menuButton">
					<h1>플래너&멘토링</h1>
					<div className="menuTitle">
						<p>플래너</p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
				</div>
				<div className="menuButton">
					<h1>성적관리</h1>
					<div className="menuTitle">
						<p>내신 성적 관리</p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
					<div className="menuTitle">
						<p>모의 성적 관리</p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
				</div>
				<div className="menuButton">
					<h1>합격 예측</h1>
					<div className="menuTitle">
						<p>수시 합격 예측 </p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
					<div className="menuTitle">
						<p>정시 합격 예측</p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
				</div>
				<div className="menuButton">
					<h1>마이클래스</h1>
					<div className="menuTitle">
						<p>마이클래스</p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
					<div className="menuTitle">
						<p>나만의 입시 비서</p>
						<p>바로가기&nbsp;&nbsp;&#5171;</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default Desktop;