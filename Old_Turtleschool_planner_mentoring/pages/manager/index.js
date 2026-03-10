import loginContext from '../../contexts/login'
import {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Link from 'next/link'
import { TextField } from "@material-ui/core";
import {useRouter} from 'next/router'
import {getData, postData} from '../../comp/data'

const Desktop = () => {
	const [info, setInfo] = useState([]);
	const router = useRouter();
	const [edit,setedit] =useState(false)
	const [classc, setClassc] = useState({groupname : "newa"});
	const [myclass, setMyClass] = useState({});
	const [member,setMember]=useState(false);

	useEffect(() => {
		axios.get('/api/admin/class',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
			}
		}).then(res => { setClassc(res.data.data); })

		axios.get('/api/admin/admin',{
			headers: {
				auth: localStorage.getItem('uid')
			},
		}).then(res => { setMyClass(res.data.data);})

		axios.get('/api/admin/user',{
			headers: {
				auth: localStorage.getItem('uid')
			},
			params: {
			}
		}).then(res => { setInfo(res.data.data); })
	},[])

	const changeTitle = (groupid, title) => {
		axios.get('/api/admin/title',{
			params: {
				groupid: groupid,
				title: title
			}, headers: {
				auth: localStorage.getItem('realuid')
			}
		})
	}

	const edits = (param) =>{

		setedit(!edit);

	}
	const Filterdata = (param) =>
	{
		let returndata = '';
		if(param.length > 0)
		{
			returndata = param[0].groupname;
		}

		return returndata;
	}

	const handleAAdd = (e) => {
	
		router.push('/linkage')
		//classc.push(['newa'])
		//setClassc([...classc])
	}

/*
	const onChangeA = (e) => {
    	setMyClassTitleA(e.target.value)
	}
	*/

	const Delmember = async (e) => {
		await postData(`/api/admin/deleteadmin`, null, {
			id: e.memberid2

		}, localStorage.getItem('uid'))


		selectAsk();
	}

	const dropChange= (param) => {
		setMember(!member)
	}


	const selectAsk = (e) =>
	{
		axios.get('/api/admin/admin',{
			headers: {
				auth: localStorage.getItem('realuid')
			},
		}).then(res => {setMyClass(res.data.data);
		})
	}

	if (!info[0]) return null;

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
					margin-top:80px;
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
					height:1227px;
				}
				.content h1{
					height:101px;
					width:1280px;
					line-height: 101px;
					margin:auto;
					font-size: 30px;
				}
				.a_class{
					border-bottom: 1px #CBCBCB solid;
					width:1280px;
					height:293px;
					overflow:auto;
					margin:auto;
					overflow-x: scroll;
					overflow-y: visible;
		
				}
				.a_class::-webkit-scrollbar {
                
					height:20px;
				}
				.a_class::-webkit-scrollbar-thumb {
					background-color:#FCBF77;
					border-radius: 20px;
				 
				}
				.a_class::-webkit-scrollbar-track {
				
					border-radius:20px;
				}
			
				.nameBox{
					width:1280px;
					height:180px;
					margin:auto;
					display: flex;

				}
				.nameBox .name{
					width:300px;
					height:180px;
					background-color:#FCBF77;
					border-radius: 20px;
				}
				.nameBox .name:nth-child(n+2){
					margin-left:30px;
				}
				.nameBox .buttonBox{
					width:300px;
					height:180px;
					background-color:#F5F5F5;
					border-radius: 20px;
					margin-left:30px;
					color:#9D9D9D;
					font-size:24px;
					text-align: center;
				}
				.nameBox .buttonBox .button{
					margin:50px;
				}
				.nameBox button {
					margin-left:320px;
				}
				.plus{
					margin:auto;
					width:1280px;
					height:218px;
					color:#9D9D9D;
					font-size:28px;

					margin-top:26px;
				}
				.box1{
					background-color:#ffffff;
				}
				.box2{
					background-color:#ffffff;
				}
				.box3{
					background-color:#ffffff;
				}
				.box1:hover{
					background-color:#F5F5F5;
				}
				.box2:hover{
					background-color:#F5F5F5;
				}
				.box3:hover{
					background-color:#F5F5F5;
				}
			`}</style>
			 <div className="profileBox">
				<div className="img"></div>
				<div className="profile">
					<ul>
						<li>{info[0].username}</li>
						<li>{info[0].univ} {info[0].department}</li>
					</ul>
					<ul>
						{/*
						<li>담당 반 수</li>
						<li>{myClass ? myClass.clscout : 0}</li>
						*/}
						<li>{info[0].relationCode == "70" ? "멘토" : "멘티"}</li>
					</ul>
					{/*
					<ul>
						<li>담당 학생 수</li>
						<li>{myClass ? myClass.memcout : 0}</li>
					</ul>
					*/}
				</div>
			</div>
			<div className="content">




{/**/}

			{classc && classc.length > 0 &&
				classc.map(ob => {
					return(
						<div style={{position:'relative'}}>
						<h1 style={{fontSize:'30px',fontWeight:'bold'}}>{ob.groupname} </h1>
						<div className="a_class" name="a_clas">
							{edit== false ? 
							 <div className="nameBox">
								{myclass && myclass.length > 0 &&
									myclass.filter(e => e.groupname == ob.groupname).map(obj => {
									return(
									<tr>
										<button onClick={(e) => Delmember(obj, e)}>X</button>
										<Link href={`/timetable2?id=${obj.account}`}>
										<div className='name'>
											<div style={{textAlign:'center',lineHeight:'36px' ,fontSize:'20px',fontWeight:'bold'}}>{obj.user_name}</div>
											<div  style={{textAlign:'center',lineHeight:'100px'}}>{obj.school}</div>
										</div>
										</Link>
									</tr>
									)
								})
							}
							</div>
							:
							<div className="nameBox">
								{myclass && myclass.length > 0 && edit==true &&
									myclass.filter(e => e.groupname == ob.groupname).map(obj => {
									return(
									<tr>
										<button onClick={(e) => Delmember(obj, e)}>X</button>
										<div className="name">{obj.user_name}
										<TextField label = {ob.groupname} multiline={false}></TextField>
										<div style={{border:'1px #000000 solid',width:'100px',height:'50px',textAlign:'center',lineHeight:'50px',
									margin:'50px auto'}}>수정</div>
										</div>
										
									</tr>
									)
								})
							}
							</div>
			}
							{member == true ?  <>
							<div className='sideButton'style={{position:'absolute',right:'0px',top:'70px'}}>
							<div onClick={()=>dropChange()}><img src='/assets/icons/more_after.png'></img></div>

							<ul style={{borderRadius:'4px',boxShadow:'2px 2px 2px 2px #36363633' }}>

							<Link href="/linkage?groupid=A">
								<li className='box1' style={{width:'267px',height:'62px' ,textAlign:'center',fontSize:'16px',lineHeight:'62px' ,cursor:'pointer'}}>
									학생 추가하기
								</li>
							</Link>
								{/*<li onClick = {()=>edits()} className='box2' style={{width:'267px',height:'62px' ,textAlign:'center',fontSize:'16px',lineHeight:'62px',cursor:'pointer'}}>
									학생 편집하기
								</li>*/}

							</ul>
						</div>
							</> :  <>
							<div className='sideButton'style={{position:'absolute',right:'0',top:'70px'}}>
							<div onClick={()=>dropChange()} ><img src='/assets/icons/more_before.png'></img></div>

							<ul>

							<Link href="/linkage?groupid=A">
								<li style={{width:'267px',height:'62px' ,textAlign:'center',fontSize:'16px',lineHeight:'62px' ,cursor:'pointer'}}>

								</li>
							</Link>
								<li style={{width:'267px',height:'62px' ,textAlign:'center',fontSize:'16px',lineHeight:'62px',cursor:'pointer'}}>


								</li>
								<li style={{width:'267px',height:'62px' ,textAlign:'center',fontSize:'16px',lineHeight:'62px',cursor:'pointer'}}>

								</li>
							</ul>
						</div> </>
							}
							</div>
						</div>

					)
				})
			}
				 <div className="plus">
				 	<button className="plus" name='classAdd' onClick={handleAAdd} >+연동하기</button>
				</div>

			</div>
		</>
	)
}

export default Desktop;
