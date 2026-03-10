import axios from 'axios'
import {useState, useEffect} from 'react'
import pool from '../lib/pool'
import React from 'react';
import {useRouter} from 'next/router'

const Linkage = ({personalcode}) => {
	const [random, setRandom] = useState()
	const [expire, setExpire] = useState()
	const [timeLeft, setTimeLeft] = useState([])
	const [input, setInput] = useState('')
	const [info, setInfo] = useState()
    const router = useRouter();

	const whatever = async () => {
		const res = await axios.get('/api/linkage',{headers:{auth:localStorage.getItem('uid')}})
		if (!res.data.success) {alert('로그인 하거나 개인정보 수정해주세요'); return;}
     
		setRandom(res.data.data.code)
		setExpire(res.data.data.time)   

	}
	
	const calculateTimeLeft = () => {
		let year = new Date().getFullYear();
		let difference = +new Date(expire) - +new Date();
		let timeLeft = [];
		if (difference > 0) {
		  timeLeft = [
			Math.floor((difference / 1000 / 60) % 60),
			Math.floor((difference / 1000) % 60)
		];
	  }
	  return timeLeft;
	}
	
	const link = async () => {
		const res = await axios.get('/api/linkage/check',{headers:{auth:localStorage.getItem('uid')}, params: {random: input}})
		console.log(res.data)
        /*
        if (res.data.success == 'over')
        {alert('이미 연동된 계정입니다.'); return;}
*/
        if (res.data.success == 'self')
        {alert('자신과 연동하실수 없습니다'); return;}
        
        else if (res.data.success == 'overlap')
        {alert('잘못된 연동입니다'); return;}
        
        else if (res.data.success == 'par')
        {alert('자녀만 연동 가능합니다'); return;}

        else if (res.data.success == 'teach')
        {alert('학생만 연동 가능합니다'); return;}

        console.log(res.data)
        setInfo([res.data.data.user_name || '미등록',personalcode[res.data.data.gradeCode] 
        || '미등록', res.data.data.school || '미등록', res.data.data.hagwon || '미등록', res.data.data.account])

	}
	const handleInput = e => {
		const {value} = e.target
		setInput(value)
	}
	
	const submitAccount = async e => {
     
        if(info==null && info==undefined)
    {
        alert('코드를 입력해주세요'); 
        return;
    }
         alert('연동되었습니다'); 
		await axios.get('/api/linkage/add',{headers:{auth:localStorage.getItem('uid')}, params: {id: info[4], rot: router.query.groupid}})
	}
	
	useEffect(() => {
		if (expire) {
		setTimeLeft(calculateTimeLeft());
		const timer=setInterval(() => {
			setTimeLeft(calculateTimeLeft());
		  }, 1000);
		return () => {clearInterval(timer)}
		}
	},[expire])

	return (<>
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
            width:100%;
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
        
            height:867px;
        }
        .content h1{
        
            height:97px;
            line-height: 101px;
			width: 100%;
			max-width: 1280px;
            margin:auto;
            font-size: 30px;
        }
        .linkBox{
            margin:auto;
            border-radius: 20px;
            width: 100%;
			max-width:1280px;
            height:100px;
            border:1px #9D9D9D solid;
            display: flex;
        
        }
        .linkBox .box{
			width: 100%;
            max-width:1000px;
            height:50px;
            border-radius: 20px;
            background-color:#F5F5F5;
            border:1px #9D9D9D solid;
            margin-top:25px;
            margin-left:28px;
            display:flex;
            justify-content:space-around;
        }
        .linkBox .buttons{
            width:270px;
            height:50px;
            border-radius: 8px;
            text-align: center;
            font-size: 16px;
            line-height: 50px;
            margin:25px;
            border:1px #DE6B3D solid;
            color:#DE6B3D
        }
      
        .linkBox:nth-of-type(1) .buttons button:nth-of-type(1){
           border-right:1px white solid; 
           width:47%;
           height:90%;
           line-height: 90%;
        }
        .linkBox .buttons button:nth-of-type(2){
        
           width:43%;
           height:90%;
		   line-height: 90%;     
        }

        .linkBox2{
            margin:auto;
            border-radius: 20px;
            width: 100%;
			max-width:1280px;
            height:198px;
            border:1px #9D9D9D solid;

        }
        .linkBox2 .box{
			width: 100%;
            max-width:1000px;
            height:50px;
            border-radius: 8px;
            background-color:#F5F5F5;
            border:1px #9D9D9D solid;
            margin-top:25px;
            margin-left:28px;
        }
        .linkBox2 .buttons{
            width:270px;
            height:50px;
        
            border-radius: 8px;
            text-align: center;
       
            font-size: 16px;
            line-height: 50px;
            margin:25px;
            border:1px #DE6B3D solid;
            color:#DE6B3D
        }

        .linkBox2 .buttons button:nth-of-type(2){
        
            width:43%;
            height:90%;
            line-height: 90%;     
         }
        .box{
            padding:10px;
        }
		@media (max-width: 640px) {
			.content {
				margin-top: 0;
				width: 90%;
				margin:0 auto;
         
			}
			.content h1{
				height:45px;
				line-height: 45px;
				margin-top: 30px;
				font-size: 30px;
			}
			.linkBox{
            margin:auto;
            border-radius: 10px;
            width: 100%;
			max-width:1280px;
            height:100px;
            border:1px #9D9D9D solid;
            display: flex;
			align-items: center;
			padding: 0 10px;
			}
			.linkBox .box{
			width: 100%;
            max-width:1000px;
            height:50px;
            border-radius: 10px;
            background-color:#F5F5F5;
            border:1px #9D9D9D solid;
			margin: 0;
			margin-right: 10px;
			}
			.linkBox .buttons{
            width:30%;
            height:50px;
            background-color: #FC8454;
            border-radius: 10px;
            text-align: center;
            color:white;
            font-size: 12px;
            line-height: 25px;
			margin: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			} 
        	.linkBox2{
                margin:auto;
                border-radius: 10px;
                width: 100%;
                max-width:1280px;
                height:198px;
                border:1px #9D9D9D solid;
                
                align-items: center;
                padding: 0 10px;
                }
                .linkBox2 .box{
                width: 100%;
                max-width:1000px;
                height:50px;
                border-radius: 8px;
                background-color:#F5F5F5;
                border:1px #9D9D9D solid;
                margin: 0;
                margin-right: 10px;
                }
                .linkBox2 .buttons{
                width:30%;
                height:50px;
                background-color: #FC8454;
                border-radius: 10px;
                text-align: center;
                color:white;
                font-size: 12px;
                line-height: 25px;
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                } 
		}
		`}</style>
    <div className="content">

        <div className="notice_box" style={{width:'1280px',height:'185px',border:'1px #9D9D9D solid',margin:'auto',padding:'20px',marginTop:'100px',borderRadius:'25px'}}>

        <div>1. 멘토가 관리를 원하는 멘티(학생)에게 연계코드를 생성해서 보냅니다. </div>
        <div>2. 코드를 받은 멘티(학생)는 거북스쿨에 접속해서, 타계정연계란에 받은 코드를 입력합니다. </div>
        <div>3. 멘토의 경우, 관리자페이지에, 코드 연계한 멘티들의 계정 리스트가 보여집니다. </div>
        <div>4. 계쩡 연계한 멘티 역시 관리자 페이지에, 본인 계정에 접속 가능한, 멘토 계정리스트가 보여집니다.   </div>
        <div>5. 멘토는 언제든 멘티계정으로 접속해서, 멘티의 학습계획 성취정도, 수업계획, 모의 성적, 내신 성적 등을 체크하고 관리할 수 있습니다.   </div>
        
        </div>

        <h1>연계 코드 생성</h1>
        <div className="linkBox">
            <div className="box">
                <div>
                연계코드 :  {random} 
                {
                    random != undefined ?    <span style={{cursor:'pointer',textDecoration:'underline',textUnderlinePosition:'under',marginLeft:'20px'}}
                    onClick={() =>navigator.clipboard.writeText(random)}>복사하기</span>
                    :<div></div>
                }
             
                </div>
            <div style={{color:'red'}}>제한시간 :{timeLeft.map(e => e).join(':')}</div>
            </div>
            <div className="buttons">
                <button onClick={whatever}>코드생성</button>
               {// <button >코드복사</button>
               }
            </div>
        </div>
        <h1>타 계정 연계</h1>
        <div className="linkBox2">
            <div style={{display:'flex'}}>
            <input type="text" className="box" placeholder="코드를 입력하세요." value={input} onChange={handleInput} />
          
            <div className="buttons">
                <button onClick={link}>코드 입력</button>
            </div>
            </div>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{display:'flex',justifyContent:'space-around',width:'1000px'}}>
                <div className='inform' style={{borderRadius:'25px',padding:'10px',width:'284px',height:'50px',backgroundColor:'#F5F5F5',border:'1px #9D9D9D solid',display:'flex',justifyContent:'space-between'}}>
                    <div>
                    이름:
                    </div>
                    <div>
                        {info ? info[0] : null}
                    </div>
            </div>
            <div className='inform' style={{borderRadius:'25px',padding:'10px',width:'284px',height:'50px',backgroundColor:'#F5F5F5',border:'1px #9D9D9D solid',display:'flex',justifyContent:'space-between'}}>
                    <div>
                    학년:
                    </div>
                    <div>
                        {info ? info[1] : null}
                    </div>
            </div>
            <div className='inform' style={{borderRadius:'25px',padding:'10px',width:'284px',height:'50px',backgroundColor:'#F5F5F5',border:'1px #9D9D9D solid',display:'flex',justifyContent:'space-between'}}>
                    <div>
                    학교:
                    </div>
                    <div>
                        {info ? info[2] : null}
                    </div>
            </div>
                </div>
                 <button style={{width:'200px',height:'50px',marginRight:'20px',background:'#DE6B3D',borderRadius:'8px',color:'#ffffff'}} onClick={submitAccount}>이 계정을 등록하기</button>  
            </div>
          
		
        </div>
    </div></>
	)
}
export default Linkage;

export async function getStaticProps () {
	const {rows} = await pool.query(`select * from codes where "groupId"= 12 and "isUse"=true`)
	const data = rows.reduce((acc, obj) => {acc[obj.code] = obj.name; return acc;},{})
	return {props:{personalcode:data}}
}