import React from 'react';
import loginContext from '../../contexts/login'
import Home from '../redirect'
import useLogin from '../../comp/loginwrapper'
import withDesktop from '../../comp/withdesktop'
import useForm from '../../comp/useform'
import Search from '../../comp/search'

const Login = ({history}) => {
	const {login, user} = React.useContext(loginContext);
	const {name,phone,phone1,phone2,email, setEmail, highschool, setHighschool, setSchoolLocation,
	schools, setSchools, locations, year, setYear,setName, setPhone, setPhone1, setPhone2, privacy, setPrivacy, location, setLocation,
	grade, setGrade, college, setCollege, major, setMajor,submit} = useForm()
    const thematic = {
		container: {
			border:'1px #707070 solid',
            width:'430px',
            height:'60px',
            textAlignLast:'left',
            marginTop:'10px',
            marginLeft:'18.4px',
			display:'inline-flex',
			alignItems:'center',
			'-moz-appearance': 'textfield',
			position:'relative'
		},
		suggestionsList: {
			position:'absolute',
			display:'flex',
			flexDirection:'column',
			listStyleType:'none',
			margin:0,
			padding:0,
			backgroundColor:'white',
			maxHeight:'300px',
			overflow:'scroll',
			zIndex: 1,
			width: '300px',
			left:0,
			top:'60px',
		},
		suggestionHighlighted: {
			color:'#fede01',
			cursor:'pointer',
		}
	}
	
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
            width:619px;
            height:2216px;
            margin:auto;
        }
        .title{
            height:190px;
            border-bottom: 1px #DE6B3D solid;
        }
        .title h1{
            color:#DE6B3D;
            font-size: 30px;
            font-weight: bold;
            line-height: 317px;
        }
        .name{
            margin-top:24px;
        }
    
        .nameBox{
            width:620px;
            height:60px;
            background-color:#E8E8E8;
            font-size: 18px;
            text-align: left;   
            padding-left:10px;
            margin-top:10px;
        }
        .phone{
        
            margin-top:24px;
        }
        .phone .selectBox{
            margin-top:10px;
        }
        .phone p{
            font-size: 18px;
            width:100%;
    
        }
    .phone select{
        border:1px #707070 solid;
        width:130px;
        height:60px;
        text-align-last:left;
    }
    .secondNumber{
        width:130px;
        height:60px;
        border:1px #707070 solid;
        margin-left:20px;
    }
    .thirdNumber{
        width:130px;
        height:60px;
        border:1px #707070 solid;
        margin-left:20px;
    }
    input[type="number"]::-webkit-outer-spin-button, 
    input[type="number"]::-webkit-inner-spin-button 
    { 
        -webkit-appearance: none; -moz-appearance: none; appearance: none; 
    } /* 파이어폭스에서의 초기화 방법 */ 
    input[type=number] 
    { 
        -moz-appearance: textfield;
    }
    input[type=button]{
        width:158px;
        height:60px;
        border:1px #707070 solid;
        background-color: #E8E8E8;
        margin-left:20px;
        color:#9D9D9D;
    
    }
    .serialNumber{
    
        width:100%;
        margin-top:24px;
    }
    
    .serial{
        width:437.4px;
        height:60px;
        border:1px #707070 solid;
        font-size: 18px;
            text-align: left;   
            padding-left:10px;
            margin-top:10px;
    
    }
    .email{
        margin-top:24px;
        font-size:18px;
    }
        .emailBox{
        width:620px;
            height:60px;
            background-color:#E8E8E8;
            font-size: 18px;
            text-align: left;   
            padding-left:10px;
            margin-top:10px;
    }
    .grade{
        margin-top:24px;
        font-size:18px;
    }
    .grade p:nth-of-type(1){
        width:30%;
        float:left;
    }
    .gradeBox1{
        border:1px #707070 solid;
        width:166px;
        height:60px;
        text-align-last:left;
        margin-top:10px;
    }
    .gradeBox2{
        border:1px #707070 solid;
        width:430px;
        height:60px;
        text-align-last:left;
        margin-top:10px;
        margin-left:18.4px;
    }
    .line{
        margin-top:40px;
        border-bottom: 1px #DE6B3D solid;
    }
    .turm{
        height:427px; 
    }
    .turm p:nth-of-type(1){
        font-size:18px;
        margin-top:24px;
    }
    .turm .box{
    
        width:620px;
        height:116px;
        border:1px #9D9D9D solid;
        background-color: #F5F5F5;
    }
    .turm .box p:nth-of-type(1){
        margin-top:10px;
        margin-left:10px;
        font-size: 15px;
        
    }
    .radio{
        margin-top:40px;
        display: flex;
        width:50%;
        margin-left:10px;
    }
    .radio .radioButton:nth-child(n+2){
        margin-left:60px;
    }
    .radio small{
        font-size:15px;
        line-height: 13px;
    
    }
    input[type=submit]{
        margin-top:30px;
        width:270px;
        height:70px;
        border:1px #DE6B3D solid;
        font-size: 24px;
        font-weight: bold;
        margin-left:20px;
        color:#DE6B3D;
    }
    input[type=reset   ]{
        margin-top:30px;
        width:270px;
        height:70px;
        border:1px #707070 solid;
        background-color: #9D9D9D;
        font-size: 24px;
        font-weight: bold;
        margin-left:20px;
        color:white;
    }
    .highSchool{
        border:1px #707070 solid;
        width:430px;
        height:60px;
        text-align-last:left;
        margin-top:10px;
        margin-left:18.4px;
    }
    .univer{
        border:1px #707070 solid;
        width:266px;
        height:60px;
        text-align-last:left;
        margin-top:10px;
       
    }
    .class{
        border:1px #707070 solid;
        width:330px;
        height:60px;
        text-align-last:left;
        margin-top:10px;
        margin-left:18.4px;
    }
    .grade2{
        margin-top:24px;
        font-size:18px;
    }
    .grade2 p:nth-of-type(1){
        width:47%;
        float:left;
    }
    </style>
				`}
			</style>
			<div className="content">
        <div className="title">
            <h1>거북스쿨 멘토회원 기본 정보</h1>
        </div>
        <div className="information">
			<div className="name">
			<p>수험생 이름</p>
			<input type="text" value={name} className="nameBox" placeholder="이름을 입력하세요" onChange={setName}/>
		</div>
		<div className="phone">
			<p>핸드폰 번호</p>
			<div className="selectBox">
				<select name="" id="" value={phone} onChange={setPhone}><option value="">선택 </option><option value='010'>010 </option></select>
				<input type="number" name="" className="secondNumber" value={phone1} onChange={setPhone1}/>
				<input type="number" name="" className="thirdNumber" value={phone2} onChange={setPhone2}/>
			</div>
		</div>
		<div className="email">
			<p>이메일 주소</p>
			<input type="email" name="" className="emailBox" placeholder="이메일 주소를 입력하세요" value={email} onChange={setEmail}/>
		</div>
		<div className="grade">
			<p>지역</p>
			<p>출신고교</p>
			<select name="" className="gradeBox1" onChange={setLocation} value={location}><option value=''>지역 선택</option>
			{locations.map(e => <option value={e} key={e}>{e}</option>)}</select>
			<Search majors={schools} val={[highschool, setHighschool]} name="학교명" holder="학교를 입력하세요" theme={thematic}/>
		</div>
        <div className="grade2">
            <p>소속 대학</p>
            <p>대학 전공</p>
            <input type="text" name="" className="univer" placeholder="" value={college} onChange={setCollege}/>
            <input type="text" name="" className="class" placeholder="" value={major} onChange={setMajor}/>
        </div>
        <div className="line"></div>
        <div className="turm">
            <p>개인정보 유효기간</p>
            <div className="box">
            <p>설정하신 기간 동안 로그인 등 이용이 없는 경우 휴면계정으로 전환됩니다.</p> 
            <div className="radio">
            <input type="radio" name="year" className="radioButton" value={1} onClick={setPrivacy}/><small>1년</small>
			<input type="radio" name="year" className="radioButton" value={5} onClick={setPrivacy}/><small>5년</small>
			<input type="radio" name="year" className="radioButton" value={10} onClick={setPrivacy}/><small>10년</small>
            </div>
            </div>
            <div className="send">
                <input type="submit"value="완료" onClick={() => submit('70')}/>
                <input type="reset" value="취소"/>
            </div>
        </div>
        </div>
    

    </div>
		</>
    );
}

const Mobile = ({history}) => {
	const {login, user} = React.useContext(loginContext);
	const {name,email, setEmail, highschool, setHighschool, setSchoolLocation,
	schools, setSchools, locations, year, setYear,setName, privacy, setPrivacy, location, setLocation,
	grade, setGrade, college, setCollege, major, setMajor,submit, phoneFull, setPhoneFull} = useForm()
    const thematic = {
		container: {
			width:'229px',
            height:'56px',
            border:'1px #000000 solid',
            borderRadius: '8px',
            textAlignLast: 'center',
			position:'relative',
			display:'flex',
			alignItems:'center'
		},
		suggestionsList: {
			position:'absolute',
			display:'flex',
			flexDirection:'column',
			listStyleType:'none',
			margin:0,
			padding:0,
			backgroundColor:'white',
			maxHeight:'300px',
			overflow:'scroll',
			zIndex: 1,
			width: '120px',
			left:'calc(50% - 60px)',
			top:'60px',
			border:'1px solid #9d9d9d',
		},
		suggestionHighlighted: {
			color:'#fede01',
			cursor:'pointer',
		}
	}
	
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
            font-size: 18px;
            font-weight: bold;
            margin:30px;
        }
        /*이름 넣는곳*/
        .name {
            width:352px;
            height:98px;       
            margin:30px auto;    
            font-size: 14px;
        }
        .name #text{
            margin-top:8px;
            width:352px;
            height:56px;
            border-radius: 8px;
            border:1px #000000 solid;   
        }
        
        /*전화번호 입력*/
        .phoneNum{
            width:352px;
            height:87px;
            font-size: 14px;
            margin:auto;
        }
        .phoneNum .flex{
            margin-top:8px;
            display: flex;
            justify-content:space-between ;
        }
        .phoneNum .flex #text{
            width:244px;
            height:56px;
            border-radius: 8px;
            border:1px #000000 solid;   
        }
        .phoneNum .flex button{
            width:100px;
            height:56px;
            border-radius: 8px;
            border:1px #DE6B3D solid; 
        }
        /*인증번호 입력 란*/
        .codes{
            width:352px;
            height:88px;
            font-size: 14px;
            margin:20px auto;
        }
        .codes .flex{
            margin-top:8px;
            display: flex;
            justify-content:space-between ;
        }
        .codes .flex #text{
            width:244px;
            height:56px;
            border-radius: 8px;
            border:1px #000000 solid;   
        }
        .codes .flex button{
          
            width:100px;
            height:56px;
            border-radius: 8px;
            border:1px #DE6B3D solid; 
        }

        /*이메일 주소*/
        .email{
            width:352px;
            height:88px;
            font-size: 14px;
            margin:20px auto;
        }
        .email #text{
            margin-top:8px;
            width:352px;
            height:56px;
            border:1px #000000 solid;  
            border-radius: 8px;
        }
        /*area*/
        .school{
            width:352px;
            height:87px;
            font-size: 14px;
            margin:auto;
        }
        .school .title1{
            display: flex;
            justify-content: left;
        }
        .school .title1 p{
            width:35%;
        }
        .school .select{
            display: flex;
            justify-content: space-between;
        }
      
        .school .select #age{
            width:115px;
            height:56px;
            border:1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
        }
        .school .select #year{
            width:229px;
            height:56px;
            border:1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
        }
        /*지역 section*/
        .area{
            width:352px;
            height:87px;
            font-size: 14px;
            margin:auto;
        }
        .area .title1{
            display: flex;
            justify-content: left;
        }
        .area .title1 p{
            width:35%;
        }
        .area .select{
            display: flex;
            justify-content: space-between;
        }
      
        .area .select #area{
            width:115px;
            height:56px;
            border:1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
        }
        .area .select #high{
            width:229px;
            height:56px;
            border:1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
        }
        .agree{
            width:352px;
            height:135px;
            font-size: 14px;
            margin:auto;
        }
        .agree .border{
            width:352px;
            height:96px;
            border:1px #9D9D9D solid;
            border-radius: 8px;
            font-size: 12px;
            background-color: #F5F5F5;
        }
        .agree .border ul{
            margin-top:10px;
            margin-left:10px;
        }
        .agree .border .radio{
            line-height: 66px;
            margin-left:14px;
            font-size: 16px;
        }
        .plusButton {
            height:72px;
            width:352px;
            line-height: 72px;
            margin:auto;
        }

        .plusButton button{
            width:352px;
            height:40px;
            line-height: 40px;
            border-radius: 10px;
            color:#DE6B3D;
            border:1px #DE6B3D solid;
            font-size: 16px;
        }
        .join{
            height:95px;
            width:352px;
          
            margin:auto;
        }
        .join button{
            background-color: #707070;
            width:352px;
            height:48px;
            line-height: 46px;
            text-align:center;
            color:white;
            border-radius: 24px;
        }
        .type{
            width:352px;
            height:88px;
            font-size: 14px;
            margin:20px auto;
        }
        .type #text{
            margin-top:8px;
            width:352px;
            height:56px;
            border:1px #000000 solid;  
            border-radius: 8px;
            text-align-last: center;
        }
    </style>
				`}
			</style>
			<header>멘토 회원가입</header>
    <section className="name">
		<p>이름</p>
		<input type="text" name="" id="text" value={name} onChange={setName}/>
	</section>
	<section className="phoneNum">
		<p>휴대폰 번호</p>
		<div className="flex">
		<input type="text" name="" id="text" placeholder="'-'구분없이 입력" value={phoneFull} onChange={setPhoneFull}/>
		</div>
	</section>

	<section className="email">
		<p>이메일 주소</p>
		<input type="text" name="" id="text" placeholder="이메일 주소를 입력하세요" value={email} onChange={setEmail}/>
	</section>
	<section className="area">
		<div className="title1">
			<p>지역</p>
			<p>출신고교</p>
		</div>
		<div className="select">
			<select name="" id="area" value={location} onChange={setLocation}>
				<option value=''>지역 선택</option>
				{locations.map(e => <option value={e}>{e}</option>)}
			</select>
	   
		
			<Search majors={schools} val={[highschool, setHighschool]} name="학교명" holder="학교를 입력하세요" theme={thematic}/>
	   
	</div>
	</section>
    <section className="area">
        <div className="title1">
            <p>소속 대학</p>
            <p>대학 전공</p>
        </div>
        <div className="select">
            <input name="" id="area" value={college} onChange={setCollege} />
       
        
            <input name="" id="high" value={major} onChange={setMajor} />
       
    </div>
    </section>
    <section className="type">
        <p>대입 전형</p>
        <select name="" id="text">
            <option value="">정시</option>
            <option value="">학종</option>
            <option value="">교과</option>
            <option value="">논술</option>
            <option value="">특기자</option>
        </select>
    </section>
    <section className="agree">
        <p>개인정보 유효기간</p>
        <div className="border">
            <ul>
                <li>설정하신 기간 동안 로그인 등 이용이 없는 경우 휴면계정</li>
                <li>으로 전환됩니다.</li>
            </ul>
            <span className="radio">
                <span><input type="radio" name="agree" id="" value={1} onClick={setPrivacy} checked={privacy == 1}/>1년</span>
				<span><input type="radio" name="agree" id="" value={5} onClick={setPrivacy} checked={privacy == 5}/>5년</span>
				<span><input type="radio" name="agree" id="" value={10} onClick={setPrivacy} checked={privacy == 10}/>10년</span>
            </span>
        </div>
    </section>
   
    <section className="join" onClick={() => submit('70',true)}><button>회원가입 완료</button></section>

		</>
    );
}

export default withDesktop(Login,Mobile)