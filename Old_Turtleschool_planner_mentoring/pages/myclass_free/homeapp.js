
import axios from 'axios'
import {useState, useEffect} from 'react'



const Home = () => {

    const [mentors, setMentors] = useState([])
    const [notice, setNotice] = useState([]) //1.공지사항
    const [oprtnPrncp, setOprtnPrncp] = useState([]) //2.운영원칙

    useEffect(() => {
		axios.get('/api/planner/planners',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
				dvsn: null
			}
		}).then(res => { console.log('aa',res.data); setMentors(res.data.data); })

        getNotice();
	},[])

    const getNotice = (e) => { 
		axios.get('/api/planner/notice',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
                plnerid: null, 
                cls: null
			}
		}).then(res => {
            console.log("AAAAAAAAAAAAAAA");
            console.log(res.data.data);
           // setNotice(res.data.data.filter(o => o.dvsn == "1")); //1.공지사항 API 데이터 가져오기
            //setOprtnPrncp(res.data.data.filter(o => o.dvsn == "2")); //2.운영원칙 API 데이터 가져오기
        })
	}


	return (
    <div className="wrap">
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

        .wrap {
            width: 100%;
            height: 1314px;
        }

        .header {
            background-color: black;
            width: 100%;
            height: 50px;
        }

        .main {
            background-color: blue;
            height: 60px;
        }
          .content {
            width: 400px;
            height: 1204px;
            margin:auto;

        }

        .mento {
            width: 352px;
            height: 709px;
            margin: auto;

        }

        .mento .name h1:nth-of-type(1) {
            height: 53px;
            font-size: 22px;
            line-height: 53px;
            text-align: center;
        }
        .name{
            height:92px;
        }
        .mento .name h1:nth-of-type(2) {
            height: 30px;
            font-size: 17px;
            line-height: 30px;
            text-align: center;
        }

        .mento hr {
            background-color: #DE6B3D;
            width: 175.53px;
            height: 4px;
            border-radius: 20px;
            margin: auto;
        }
        .face{
            width:100%;
        }
        .mento .img{
            width:200px;
            height:235px;
            background-color: violet;
            border-radius: 10px;
            margin:auto;
        }
        .profile{
            width:100%;
            height: 75px;
            margin:auto;
            text-align: center;
        }
        .profile h1{
            font-size: 18px;
        }
        .notice{
            width: 352px;
            height:302px;
            margin:25px auto;
        }
        .notice h1{
            font-size: 17px;
        }
        .notice table{
            width:100%;
            height:197px;
            text-align: center;
            border-collapse: collapse;
            margin-top:10px;
        }
        .notice tr{
            border-top: 1px #363636 solid;
            border-left: 1px #DEDEDE solid;
            border-bottom: 0.5px #707070 solid;
        }
        .notice table td:nth-of-type(1){
            width:32px;  
            background-color: #DEDEDE;
        }
        .radio{
            height:40px;
            width:50px;
            
            display: flex;
            margin:auto;
        }
        .radio div{
            width:10px;
            height:10px;
            border-radius: 20px 20px 20px 20px;
            margin:auto;
            background-color: #DEDEDE;
        }
        .sell {
            width: 400px;
            height: 10px;
            background-color: #EDEEED;
        }
         .rule{
            width: 352px;
            height:485px;
            margin:25px auto;
        }
        .rule h1{
            font-size: 17px;
        }
        .rule table{
            width:100%;
            height:299px;
            text-align: center;
            border-collapse: collapse;
            margin-top:25px;
        }
        .rule tr{
            border-top: 1px #363636 solid;
            border-left: 1px #DEDEDE solid;
            border-bottom: 0.5px #707070 solid;
        }
        .rule table td:nth-of-type(1){
            width:32px;  
            background-color: #DEDEDE;
        }
        .rule table tr:nth-of-type(1) td:nth-of-type(2)  {
            
            background-color: #EFEDED;
        }
        .radio{
            height:40px;
            width:50px;
            
            display: flex;
            margin:auto;
        }
        .radio div{
            width:10px;
            height:10px;
            border-radius: 20px 20px 20px 20px;
            margin:auto;
            background-color: #DEDEDE;
        }
		`}</style>
        <div className="content">
            <div className="mento">
            {
                
                mentors.map(f => (
                    <>
            <div className="name">
                    <h1>{f.clsnm}</h1>
                    <hr/>
                    
            </div>
            <div className="face">
            <div className="img" style={{backgroundImage:'url(/profile-img/'+f.imgpath+'.jpg)',backgroundPosition: 'center',
                            backgroundSize: 'cover',backgroundRepeat:'no-repeat'}}></div>
             </div>
             <div className="profile">
                    <h1>멘토 {f.user_name}</h1>
                    <h1>{f.highschool}</h1>
                    <h1>{f.univ} {f.department}</h1>
                </div>
             </>
                ))
                }
               
               
           
                <div className="notice">
                    
                    <h1>멘토 공지사항</h1>
                        <table>
                            <tr>
                                <td>1</td>
                                <td>text</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>text</td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>text</td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>text</td>
                            </tr>
                        </table>
                        <div className="radio">
                            <div></div>
                            <div></div>
                            <div></div>
                         </div>
                </div>
        </div>
        <div className="sell"></div>
        <div className="rule">
                    
            <h1>멘토 운영원칙</h1>
                <table>
                    <tr>
                        <td>No.</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>4</td>
                        <td>text</td>
                    </tr>
                    <tr>
                        <td>5</td>
                        <td>text</td>
                    </tr>
                </table>
                <div className="radio">
                    <div></div>
                    <div></div>
                    <div></div>
                 </div>
        </div>
	</div>
	</div>)
}

export default Home