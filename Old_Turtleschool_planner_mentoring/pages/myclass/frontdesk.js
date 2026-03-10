import Link from 'next/link'
import withDesktop from '../../comp/withdesktop'
import page from './frontdeskapp'
import axios from 'axios'
import Btn from './myclass_btn'
import {useState, useEffect} from 'react'
import pool from '../../lib/pool'
import {getData, postData} from '../../comp/data'

const FrontDesk = ({gradeCode}) => {
	
	const [mentors, setMentors] = useState([])
	const [filtered, setFiltered] = useState([])
	const [grade, setGrade] = useState(gradeCode[0].comn_cd)
		useEffect(() => {
		axios.get('/api/planner/planners',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
				dvsn: 'A'
			}
		}).then(res => {setMentors(res.data.data); console.log(res.data.data)})
	},[])
    const [notice, setNotice] = useState([]) //1.공지사항
    const [oprtnPrncp, setOprtnPrncp] = useState([]) //2.운영원칙
    const [compliance, setCompliance] = useState([]) //3.준수사항
    const [question, setQuestion] = useState([]) //4.QNA

    //플래너정보가져오기
	useEffect(() => {
		axios.get('/api/planner/planners',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
				dvsn: 'A'
			}
		}).then(res => {setMentors(res.data.data); console.log(res.data.data)})
	},[])
	
    //공지사항 운영원칙 준수사항 QNA 정보조회
    const getNotice = (e) => { 
		axios.get('/api/planner/notice',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
                plnerid: e.id,
                cls: e.cls
			}
		}).then(res => {
            console.log(res.data);
            setNotice(res.data.data.filter(o => o.dvsn == "1")); //1.공지사항 API 데이터 가져오기
            setOprtnPrncp(res.data.data.filter(o => o.dvsn == "2")); //2.운영원칙 API 데이터 가져오기
            setCompliance(res.data.data.filter(o => o.dvsn == "3")); //3.준수사항 API 데이터 가져오기
            setQuestion(res.data.data.filter(o => o.dvsn == "4")); //4.QNA API 데이터 가져오기
        })
	}

    //플래너에 학생 등록하기
    const postPlanner = (e) => { 
        axios.post('/api/planner/memberAdd',{
            plnrid: e.id, cls: e.cls
        },{
            headers: {auth: localStorage.getItem('uid')}
        }
        ).then(res => console.log(res.data))
        alert('등록완료 되었습니다')
	}

	useEffect(() => {
		if (mentors.length > 0) {
			setFiltered(filterMentors(grade))
		}
	},[mentors,grade])
	
	const filterMentors = (code) => mentors.filter(m => m.cls == code)
	
	return (<div className="contaner">
		<style jsx>{`
			*{
            
            margin:0px;
            
            padding:0px;
            font-family:"Noto Sans CJK KR";
        }
        li{
            list-style:none;    
        }
        a{
            text-decoration: none;
           
        }
            select{
               border:none;
               border-radius: 0;
               -webkit-appearance: none;
               -moz-appearance: none;
                
            }
        .contaner{
            width:100%;
            height:2921px;
        }
       
        .main{
            height:100.5px;
            background-color: orange;
        }
        .header{
            
            background-color:#FCBF77;
            height:300px;
        
        }
        .footer{
            width:1920px;
            height:219px;
            background-color: orchid;
        }
        .header h1{
            color:#ffffff;
             text-align: center;   
             line-height: 300px;
             font-size:36px;
             height:230px;
        }
        
        .content{
                margin:0 auto;
                width:1280px;
                height:1796px;

        }
        content h1{
            font-size: 30px;
            font-family: "Noto Sans CJK KR";
        }
            .first{
                width:1280px;
                height:598.6666px;
                
            }
            .menu{
                margin-top:40px;
                display: flex;
                height:45px;
                
            }
            .menu1 ul {
                height:34px;
                line-height: 45px;
                margin-left:36px;
            }
            
            .menu1 li{
                
                width:109px;
                text-align: center;
                float:left;
            }
            .menu1 li:hover{ 
                border-bottom:1px #FF8901 solid;
                color:#FF8901;
                cursor:pointer
            }
            .box{
                width:1198px;
                min-height: 420px;
                margin:16px auto;
                padding: 16px;
                display: flex;
				overflow-x: scroll;
				overflow-y: visible;
                
            }
            .box::-webkit-scrollbar {
                
                height:20px;
            }
            .box::-webkit-scrollbar-thumb {
                background-color:#B71600;
                border-radius: 20px;
             
            }
            .box::-webkit-scrollbar-track {
                box-shadow: 3px 3px 16px #9d9d9d;
                border-radius:20px;
            }

            
            .box .border1{
                flex: 0 0 380px;
                height:395px;
                box-shadow: 3px 3px 16px #9D9D9D;  
                border-radius: 20px;
                margin-right: 30px;
            }
            .profile{
                
                height: 70%;
                margin-left:38px;
                margin-top:34px;
            }
            .profile_left{
                width:40%;
                height:60%;
                margin:auto;
                float:left;
            }
            .profile_right{
                width:60%;
                height:60%;
                float:left;
               
            }
            .box .img{
                width:152px;
                height: 150px;
                border:1px #707070 solid;
                border-radius: 19px;
               
            }
           
            .profile_right .text{
                width:90px;
                margin:auto;
                
                
            }
            .profile_right p:nth-of-type(1){
                height:24px;
                font-size:12px;
                color:#ffffff;
                border-radius: 15px;
                background-color: #08ACA5;
                margin-top:10px;
                text-align: center;
            }
            .profile_right p:nth-of-type(n+2)
            {
                font-size:18px;
                color:#9D9D9D;
            }
            .boxBottom{
                width:100%;
                height:40%;
                margin:auto;
            }
           
            .school ul:nth-of-type(1){
                float:left;
                width:55%;
                font-size:14px;
                
            }
            .school ul:nth-of-type(2){
                float:left;
                width:45%;   
                font-size:14px;   
            }
            .school ul li:nth-of-type(2){
                float:left;
                width:55%;
                font-size:18px;
            }
            .button{
                width:100%;
                height:22%;
                text-align: center;
                background-color: #FC8454;
                color:#ffffff;
                border-radius: 0px 0px 20px 20px;
                
            }
            .button h1:nth-of-type(1){
                width:49.75%;
                height:100%;
                font-size:18px;
                float:left;
                border-right:1px #FFFFFF solid;
                line-height: 86.9px;
            }
            .button h1:nth-of-type(2){
                width:49.75%;
                height: 10%;
                font-size:18px;
                float:left;
                margin-top:30px;
            }
            hr{
                background-color: #CBCBCB;
            }
            .second{
                width:1280px;
                height:598.6666px;
            }

            .second .title1{
               margin-top:60px;
               width:100%;
               height:67px;
            }
            .second .left{
                width:50%;
                height:100%;
                float:left;
            }
         
            .title1 h1:nth-of-type(1)
            {  
                width:80%;
                font-size: 30px;
                float:left ;
                
            }
            .title1 h1:nth-of-type(2)
            {  
                width:20%;
                float:left; 
                font-size: 24px;
                color:#9D9D9D;
                line-height: 50px;
            
            }
            
            .second .left .text{
                width:620px;
                height:468px;
                background-color: #FC8454;
                border-radius: 20px;   
                overflow: hidden;
                white-space: nowrap;
            }
            .second .right{
                width:50%;
                height:100%;
                float:left;
            }
            .second .right .text{
                width:620px;
                height:468px;
                border:1px #9D9D9D solid;
                border-radius: 20px;
            }
            .third{
                width:620px;
                height:598.6666px;
                float:left;

            }
           
            .third .title1{
               margin-top:3g0px;
               width:50%;
               height:67px;
            }
            .third .left{
                width:50%;
                height:100%;
                
            }
            .third .text{
                width:620px;
                height:468px;
                border:1px #9D9D9D solid;
                border-radius: 20px;
            
            }
            .foure{
     
                width:1280px;
                height:598.6666px;
           
            }
            .foure .title1{
               margin-top:30px;
               width:50%;
               height:67px;
            }
            .foure .left{
                width:50%;
                height:100%;
                
            }
            .foure .text{
                width:620px;
                height:468px;
                border:1px #9D9D9D solid;
                border-radius: 20px;
            
            }
            
            .second .left .text ul{
                
                font-size:18px;
                color:#ffffff;
                left:50px;
                
            }
            .text li{
               
                width:80%;
                height: 17%;
            }
            .third .text li{
                line-height: 63px;
                width:80%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .second .right .text li{
               
                width:80%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .text ul{
                width:90%;
                height:90%;
                position:relative;
                font-size:18px;
                color:black;
                top:63px;
                left:50px;
            }
            .text{
                position: relative;
            }
            .line:nth-of-type(1){
                width:529.1px;
                height:100px;
                top:0px;
                left:50px; 
                border-bottom:1px #CBCBCB solid;
                margin:10px auto;
                position: absolute;

            }
            .line:nth-of-type(2){
                width:529.1px;
                height:175px;
                top:0px;
                left:50px; 
                border-bottom:1px  #CBCBCB solid;
                margin:10px auto;
                position: absolute;
            }
            .line:nth-of-type(3){
                width:529.1px;
                height:250px;
                top:0px;
                left:50px; 
                border-bottom:1px  #CBCBCB solid;
                margin:10px auto;
                position: absolute;
            }
            .line:nth-of-type(4){
                width:529.1px;
                height:325px;
                top:0px;
                left:50px; 
                border-bottom:1px  #CBCBCB solid;
                margin:10px auto;
                position: absolute;
            }
            .line2:nth-of-type(1){
                width:529.1px;
                height:115px;
                top:0px;
                left:50px; 
                border-bottom:1px #CBCBCB solid;
                margin:10px auto;
                position: absolute;

            }
            .line2:nth-of-type(2){
                width:529.1px;
                height:190px;
                top:0px;
                left:50px; 
                border-bottom:1px  #CBCBCB solid;
                margin:10px auto;
                position: absolute;
            }
            .line2:nth-of-type(3){
                width:529.1px;
                height:265px;
                top:0px;
                left:50px; 
                border-bottom:1px  #CBCBCB solid;
                margin:10px auto;
                position: absolute;
            }
            .line2:nth-of-type(4){
                width:529.1px;
                height:340px;
                top:0px;
                left:50px; 
                border-bottom:1px  #CBCBCB solid;
                margin:10px auto;
                position: absolute;
            }

            .title1 h1:nth-of-type(1)
            {
                font-size: 30px;
            }
            .title1 h1:nth-of-type(2)
            {
                font-size: 24px;
            }
            .introduce{
                width:190px;
                text-align:center;
                height:100px;
            }
          .saveplanner{
            width:190px;
            text-align:center;
            height:100px;
          }

          
		`}</style>
   
        <div className="header">
            <h1>플래너 검사</h1>
          <Btn index ={'desk'}/>
        </div> 
<div className="content">   
        <div className="first">
            <div className="menu1">
            <h1>멘토리스트</h1>
            <ul>
				{gradeCode != undefined &&
					gradeCode.map(g => <li onClick={() => setGrade(g.comn_cd)}>{g.comn_nm}</li>)
				}
            </ul> 
            </div>
            <div className="box">
			{
				filtered.map(f => (
				<div className="border1">
                    <div className="profile">
                        <div className="profile_left">
							<div className="img" style={{backgroundImage:'url(/profile-img/'+f.imgpath+'.jpg)',backgroundPosition: 'center',
                            backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}></div>
                        </div>
						<div className="profile_right">
							<div className="text">
								<p style={{lineHeight:'24px'}}>{f.clsnm}</p>
								<h1 style={{width:'100px'}}>{f.user_name}</h1>
								<p style={{fontSize:'14px',width:'100px'}}>{f.univ}</p>
								<p style={{fontSize:'16px'}}>{f.department}</p>
							</div>
						</div>
						<div className="boxBottom">
							<div className="school">
								<ul>
									<li>출신고교</li>
									<li>{f.highschool}</li>
								</ul>
								<ul>
									<li>현 담당인원</li>
									<li>{f.memcout}명</li>
								</ul>
							</div>
						</div>
					</div>
                    <div className="button">
                        <button className='introduce' onClick={e => getNotice(f)}>소개바로가기</button>
                        <button className='saveplanner' onClick={e => postPlanner(f)} >등록</button>
                    </div>
                 </div>
				))
			}
                
            </div>
         
    </div>
    <hr/>
        <div className="second">
            <div className="left">
                <div className="title1">
                    <h1>공지사항</h1>
          
                </div>                
                <div className="text" style={{padding:'20px'}}>
                    {/*
                        notice.map(obj => 
                        <div className="">{obj.rmk}</div>)
                        */}
                <div style={{fontSize:'26px',color:'#ffffff'}}>플래너 관리반에서 관리하는 사항들입니다</div>
                <div>1. 플래너 작성 및 그 실행 여부 관리</div>
                <div>2. 한주간 학습한 부분 테스트</div>
                <div>3. 체력 관리(운동)</div>
                <div>4. 취침 관리</div>
                <div>- 재학생은 방학때만</div>
                <div>- 재수생은 독학재수 수험생만</div>
                <div>5. 과목별 학습 상황 (학부모 상담)</div>
                <div>6. 현재 학원/과외 등 학습 상황 진단 (학부모 상담)</div>
                <div>7. 목표 대학(ex 서울대) 멘토쌤의 학습 방향 조언(학생 상담)</div>
               
                <div style={{fontSize:'26px',color:'#ffffff'}}>플래너 관리반의 관리방법입니다</div>
                <div>1. 멘토쌤의 플래너 검사</div>
                <div>2. 동일반 학생끼리의 플래너 성취도, 테스트 등 순위 경쟁</div>
                <div>3. 멘토쌤 성적을 따라가면, 나도 서울대!</div>
                <div>- 멘토쌤의 학년별 실제 성적표 공개(본인 성적과 비교)</div>
                <div>4. 대치동 관리 학원 20년의 노하우에 의한 반 운영</div>
                </div>

            </div>
            <div className="right">
                <div className="title1">
                    <h1>운영원칙</h1>
            
                </div>
                <div className="text" >
                    <div style={{padding:'10px'}}>
                <div className=""> 
                <div style={{fontSize:'26px',fontWeight:'bold'}}>1. 선생님 교체, 반이동</div>
                - 매달 말일 경, 반 이동을 신청할 수 있습니다. 이때 반을<br></br>
                 이동할 수 있습니다 단 레벨이 다른 반으로 월반을 원할 경우엔<br></br>
                반 이동 허가가 나야 반이동을 할 수 있습니다</div>
                <div className="">
                <div style={{fontSize:'26px',fontWeight:'bold'}}>
                2. 플래너 평가 점수와 테스트 결과 공개 원칙<br></br></div>
                - 플래너관리반의 학생은 서로의 동기부여를 위해서<br></br>
                 플래너 평가 점수는 공개를 원칙으로 합니다.<br></br>
                하지만, 내신 성적이나 모의 성적 등은 누구의 성적인지 알 수 없도록 이름을 00처리를 해서<br></br>
                공개합니다</div>
                <div className=""> 
                <div style={{fontSize:'26px',fontWeight:'bold'}}>3. 수업료</div>
                - 수업료는 시작하는 날로 부터 월단위로 정산합니다</div>
                <div className="">
                <div style={{fontSize:'26px',fontWeight:'bold'}}> 4. 환불</div>
                - 환불 원칙은 교육청 환불 규정을 따릅니다.<br></br>
                 환불 일시는 수업을 그만 둔 다음달 3일에 일괄 정산합니다.
                </div>
                </div>
              
                    {/*oprtnPrncp != undefined &&
                        oprtnPrncp.map(obj => 
                        <div className="">{obj.rmk}</div>)
                        */}
                </div>
            </div>
        </div>
        {/*
        <div className="third">            
            <div className="title1">
                <h1>QnA</h1>
             
            </div>
            <div className="text">
            {question != undefined &&
                question.map(obj => 
                <div className="">{obj.rmk}</div>)
            }
            </div>
        </div>
        */}
        <div className="foure">            
            <div className="title1">
                <h1>준수사항</h1>
       
            </div>
            <div className="text" style={{padding:'20px'}}>
            {/*compliance != undefined &&
                compliance.map(obj => 
                <div className="">{obj.rmk}</div>)
                */}
                 <div className="" style={{marginTop:'10px',fontSize:'25px',fontWeight:'bold'}}>1. 매일 플래너 작성</div>
                 <div className="" style={{marginTop:'20px',fontSize:'25px',fontWeight:'bold'}}>2. 멘토쌤이 플래너를 매일 검사할 수 있도록<br></br> 플래너는 매일 작성하고<br></br> 성취도도 매일 기재해야 합니다</div>
                 <div className="" style={{marginTop:'20px',fontSize:'25px',fontWeight:'bold'}}>3. 3회 결격사유일땐 퇴소이며<br></br> 남은 잔여일 수업에 대한 환불은 없습니다. </div>
                 <div className="" style={{marginTop:'20px',fontSize:'25px',fontWeight:'bold'}}>4. 멘토쌤과 주당 최소 1회는 테스트를 보며<br></br> 그 성적은 마이클래스 플래너관리반에 공개합니다</div>
            </div>
        </div>
        </div>
    </div>)
}

export default withDesktop(FrontDesk,page)

export async function getStaticProps() {
	const {rows} = await pool.query(`select * from commoncode where comn_grp_cd = 'P00004'`)
	return {props: {gradeCode: rows}}
}