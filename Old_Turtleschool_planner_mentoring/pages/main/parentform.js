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
	children, addChild, setChildName,
	setChildYear, setChildGrade, setChildSchool,setChildRegion,submit} = useForm()
    const thematic = {
		container: {
			border:'1px #707070 solid',
            width:'430px',
            height:'60px',
            textAlignLast:'left',
            marginTop:'16px',
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
      .phoneS{
           margin-top:24px;
       }
       .phoneS .selectBoxS{
           margin-top:10px;
       }
       .phoneS p{
           font-size: 18px;
      
       }
       .phoneS p:nth-of-type(1){
           float:left;
           width:50%;
       }
     .phoneS select{
         border:1px #707070 solid;
         width:130px;
         height:60px;
         text-align-last:left;
         margin-left:10px;
     }
     .secondNumberS{
         width:130px;
         height:60px;
         border:1px #707070 solid;
         margin-left:10px;
     }
     .secondNumberS{
         width:130px;
         height:60px;
         border:1px #707070 solid;
         margin-left:10px;
     }
     .thirdNumberS{
         width:130px;
         height:60px;
         border:1px #707070 solid;
         margin-left:10px;
     }
     .studentName{
        width:166px;
        height:60px;
        border:1px #707070 solid;

     }
      input[type="number"]::-webkit-outer-spin-button, 
      input[type="number"]::-webkit-inner-spin-button 
      { 
          -webkit-appearance: none; -moz-appearance: none; appearance: none; 
     } 
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
     input[type=reset]{
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
     .plusButton{
         margin-top:24px;
         width:519px;
         height:124px;
         font-size:28px;
         border-top:1px #DBDBDB solid; 
         line-height: 124px;
         color:#9D9D9D;
     }
				`}
			</style>
	<div className="content">
        <div className="title">
            <h1>거북스쿨 학부모회원 기본정보</h1>
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
        </div>
		<div className="email">
			<p>이메일 주소</p>
			<input type="email" name="" className="emailBox" placeholder="이메일 주소를 입력하세요" value={email} onChange={setEmail}/>
		</div>
	    <div className="line"></div>
	    <h1>자녀정보</h1>
		  { children.map((child,i) => <>
		  <div className="phoneS">
            <p>학생이름</p>
			<input type="text" value={name} className="nameBox" placeholder="이름을 입력하세요" onChange={(e) => setChildName(e,i)} value={child.name}/>
		  </div>
          <div className="grade">
              <p>학년</p>
              <p>졸업 예정 연도</p>
              <select name="" className="gradeBox1" onChange={(e) => setChildGrade(e,i)} value={child.grade}><option value=''>학년 선택</option><option value='1'>1학년</option><option value='2'>2학년</option><option value='3'>3학년</option><option value='4'>N수생</option></select>
              <input type="number" name="" className="gradeBox2"onChange={(e) => setChildYear(e,i)} value={child.year}/>
          </div>
          <div className="grade">
            <p>지역</p>
            <p>출신고교</p>
            <select name="" className="gradeBox1" onChange={(e) => setChildRegion(e,i)} value={child.region}><option value=''>지역 선택</option>
			{locations.map(e => <option value={e} key={e}>{e}</option>)}</select>
            <input type="text" name="" className="gradeBox2" placeholder="고등학교 입력" value={child.highschool} onChange={(e) => setChildSchool(e,i)} />
        </div>
		  </>)}
        <div className="plusButton" onClick={addChild}>
            + 자녀 추가하기
        </div>
        <div className="line"></div>
        <div className="turm">
            <p>개인정보 유효기간</p>
            <div className="box">
               <p>설정하신 기간 동안 로그인 등 이용이 없는 경우 휴면계정으로 전환됩니다.</p> 
               <div className="radio">
               <span><input type="radio" name="agree" id="" value={1} onClick={setPrivacy} checked={privacy == 1}/>1년</span>
				<span><input type="radio" name="agree" id="" value={5} onClick={setPrivacy} checked={privacy == 5}/>5년</span>
				<span><input type="radio" name="agree" id="" value={10} onClick={setPrivacy} checked={privacy == 10}/>10년</span>
            </div>
            <div className="send">
                <input type="submit"value="완료" onClick={() => submit('20')}/>
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
	children, addChild, setChildName, phoneFull, setPhoneFull,
	setChildYear, setChildGrade, setChildSchool,setChildRegion,submit} = useForm()
    const thematic = {
		container: {
			border:'1px #707070 solid',
            width:'430px',
            height:'60px',
            textAlignLast:'left',
            marginTop:'16px',
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
	
	const thisyear = new Date().getFullYear();
	const years = Array(11).fill(0).map((e,i) => thisyear+i-5)
	
    return(
        <>
			<style jsx>
			{`
		.title2{
            width:352px;
            margin:10px auto;
            font-size: 24px;
            font-weight: bold;
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
            margin:10px auto;
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
        .line hr{
            width:352px;
            background-color: #DE6B3D;
            height:2px;
            margin:auto;
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
				`}
			</style>
	<header className="header header2">학부모 회원가입</header>
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
    <div className="line"> <hr/></div>
    <section className="title2">
        <p>자녀정보</p>
    </section>
    {children.map((c, i) => <>
	<section className="name">
        <p>자녀이름</p>
        <input type="text" name="" id="text" value={c.name} onChange={(e) => setChildName(e,i)}/>
    </section>
    <section className="school">
        <div className="title1">
            <p>학년</p>
            <p>졸업 예정 연도</p>
            </div>
            <div className="select">
            <select name="" id="age"  value={c.grade} onChange={(e) => setChildGrade(e,i)}>
				<option value=''>학년 선택</option>
                <option value='1'>1학년</option>
                <option value='2'>2학년</option>
                <option value='3'>3학년</option>
                <option value='4'>N수생</option>
            </select>
 
            
            <select name="" id="year" value={c.year} onChange={(e) => setChildYear(e,i)}>
				<option value=''>년도 선택</option>
                {
					years.map(e => <option value={e}>{e}</option>)
				}
            </select>
        </div>
   
    </section>
    <section className="area">
        <div className="title1">
            <p>지역</p>
            <p>출신고교</p>
        </div>
        <div className="select">
            <select name="" id="area" onChange={(e) => setChildRegion(e,i)} value={c.region}>
				<option value=''>지역 선택</option>
				{locations.map(e => <option value={e}>{e}</option>)}
			</select>
       
        
            <input name="" id="high" value={c.highschool} onChange={(e) => setChildSchool(e,i)}/>
       
    </div>
    </section>
	</>)}
    <div className="line"> <hr/></div>
    <div className="plusButton" onClick={addChild}>
        <button>+ 자녀추가하기</button>
    </div>
    <div className="line"> <hr/></div>
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
    <section className="join" onClick={() => submit('20',true)}><button>회원가입 완료</button></section>
		</>
    );
}

export default withDesktop(Login,Mobile)