import Image from 'next/image'
import Link from 'next/link'
import {useState, useEffect, useContext} from 'react'
import {getData} from '../../comp/data'
import loginContext from '../../contexts/login'
import {useRouter} from 'next/router'
import axios from 'axios'


const master = () => {
  
    const [list, setList] = useState(0);
    const [mentors, setMentors] = useState([])
    const [user,setUser] = useState([])


    useEffect(() => {
    axios.get('/api/masterPage/member',{
        headers:{
            auth:localStorage.getItem('uid')
        },

    }).then(res=>{setUser(res.data.data); console.log(res.data.data)})
        
    
    },[])


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

    const subString = (index)=>{
   
    
    return index.split('T')[0] 
    }
	console.log(list);
    return (<div className='wrap'>
        <style jsx>{`

        .wrap{
            background-color:#ffffff;
            width:100%;
            height:1200px;
         
        }

        .contain{
            width:1280px;
            overflow: scroll;
            height:1200px;
            margin:auto;
        }
        .banner_title{

            width:1280px; 
            height:100px;   
            font-size:30px;
            display:flex;
            margin:70px auto;
            text-align: center;
        }
        .list_menu{
            width:1280px;
            height:50px;
            margin:auto;
            display:flex;
        }
        .student_be{
            background-color:#ffffff;
            font-size:27px;
            width:300px;
            height:100px;
            text-align:center;
            line-height:100px;
        }
        .student_af{
            background-color:#000000;
            color:#ffffff;
            font-size:27px;
            width:300px;
            height:100px;
            text-align:center;
            line-height:100px;
        }
        .ment_be{
            background-color:#ffffff;
            font-size:27px;
            width:300px;
            height:100px;
            text-align:center;
            line-height:100px;
            
        }
        .ment_af{
            background-color:#000000;
            color:#ffffff;
            font-size:27px;
            width:300px;
            height:100px;
            text-align:center;
            line-height:100px;
        }
        .list{
            display:flex;
        	flex-wrap: wrap;
            width:1280px;
            margin:100px auto;
        
        }
        .border1{
            width:300px;
            border:1px #000000 solid;
            height:200px;
        }
        .img{
            width:100px;
            height:100px;
        }
        `}</style>
          <div className='contain'>
            <div>
                <div className='banner_title'>관리자페이지</div>
            </div>
            <div className='list_menu'>
                <div className={list== 0 ? 'student_af' : 'student_be'} onClick={()=> setList(0)}>학생</div>
                <div className={list== 1 ? 'ment_af' : 'ment_be'} onClick={()=> setList(1)}> 선생님 </div>  
            </div>
            <div className='list'>
            { list == 1 ? 
				mentors.map(f => (
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
						
					</div>
                
                 </div>
				))
			: list == 0 ? user.map(f=>(
            <div className="border1">
            <div className="profile">
            
                <div className="profile_right">
                    <div className="text">
                        <p style={{fontSize:'30px'}}>{f.name}</p>
                        <h1 style={{width:'100px'}}>{f.cell}</h1>
                        <p style={{fontSize:'24px',width:'100px',fontWeight:'bold'}}>{f.email}</p>
                        <p style={{fontSize:'24px',fontWeight:'bold'}}>{
                               subString(f.join_date)
                        }</p>
                    </div>
                </div>
                
            </div>
        
         </div>))
        : <div></div> 
        }
        
            </div>
            </div>
        </div>
            );
        }

export default master;