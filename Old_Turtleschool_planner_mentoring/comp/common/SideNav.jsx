import React, { useState, useEffect, useContext } from "react";
import styles from "./SideNav.module.css";
import loginContext, {Opt} from '../../contexts/login'
import Link from 'next/link'
import Dialog from '../dialog'
import {useRouter} from 'next/router'
import {useLogout} from '../logout'
import Head from 'next/head'

const SideNav = props => {
    const { show, setShowNav } = props;
    const [sub, setSub] = useState(-1);
	const {login, user, info} = useContext(loginContext)
	const logout = useLogout(login,user)
	const router = useRouter();
	
	const logoutbuttons = [
		{content:'취소',color:'#DDDDDD'},
		{content:'확인',color:'#FEDE01'},
	]
	
	const notreadybuttons = [
		{content:'<<돌아가기', color:'#fede01'}
	]
	
	const types = [
		'gpa','gpa','test','test'
	]
	
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [type, setType] = useState(0)
	
	const logged = localStorage.getItem('realuid')
	
	useEffect(() => {
		setShowNav(false);
	},[router.pathname])
	const OrangeRight = () => {
		return (
		<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">
		<rect width="24" height="24" fill-opacity="0"/>
		<path fill="#DE6B3D" d="M16.9274 17.3949L10.8061 11.4924L16.9274 5.58993C17.5427 4.99664 17.5427 4.03826 16.9274 3.44497C16.3121 2.85168 15.3182 2.85168 14.7029 3.44497L7.46147 10.4275C6.84618 11.0208 6.84618 11.9792 7.46147 12.5725L14.7029 19.555C15.3182 20.1483 16.3121 20.1483 16.9274 19.555C17.5269 18.9617 17.5427 17.9881 16.9274 17.3949Z"/>
		</svg>
		)
	}
	
	const OrangeLeft = (props) => {
		return (
		<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
		<rect width="24" height="24" fill-opacity="0"/>
		<path fill="#DE6B3D" d="M16.9274 17.3949L10.8061 11.4924L16.9274 5.58993C17.5427 4.99664 17.5427 4.03826 16.9274 3.44497C16.3121 2.85168 15.3182 2.85168 14.7029 3.44497L7.46147 10.4275C6.84618 11.0208 6.84618 11.9792 7.46147 12.5725L14.7029 19.555C15.3182 20.1483 16.3121 20.1483 16.9274 19.555C17.5269 18.9617 17.5427 17.9881 16.9274 17.3949Z"/>
		</svg>
		)
	}
	
	const WhiteLeft = (props) => {
		return (
			<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
			<rect width="24" height="24" fill-opacity="0"/>
			<path d="M16.9274 17.3949L10.8061 11.4924L16.9274 5.58993C17.5427 4.99664 17.5427 4.03826 16.9274 3.44497C16.3121 2.85168 15.3182 2.85168 14.7029 3.44497L7.46147 10.4275C6.84618 11.0208 6.84618 11.9792 7.46147 12.5725L14.7029 19.555C15.3182 20.1483 16.3121 20.1483 16.9274 19.555C17.5269 18.9617 17.5427 17.9881 16.9274 17.3949Z"/>
			</svg>
		)
	}
	
	const MenuIcon = (props) => {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" {...props}><path d="M0 0h24v24H0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
		)
	}
	const c = {
		H1 : '1학년',
		H2 : '2학년',
		H3 : '3학년',
		HN : 'N수생',
	}
	const close = () => {
		setShowNav(false)
		setType(0)
	}
	
	const main = <div className={styles.content}>
					<div className={styles.ttl}>퀵메뉴</div>
					<div className={styles.shadow}>
						<Link href='/gpa/mygrade'><div className={styles.btn}>Z내신 점수<OrangeRight /></div></Link>
					</div>
					<div className={styles.ttl}>플래너&멘토링</div>
					<div className={styles.shadow}>
						<Link href='/timetable2'><div className={styles.btn}>플래너<span style={{color:'#DE6B3D'}}>(8월16일 open)</span> <OrangeRight /></div></Link>
						<Link href='/linkage'><div className={styles.btn} >멘토링 오퍼 신청 / 수락 <OrangeRight /></div></Link>
					</div>
					<div className={styles.ttl}>성적관리</div>
					<div className={styles.shadow}>
						<div className={styles.btn} onClick={() => setType(1)}>내신 성적관리 <OrangeRight /></div>
						<div className={styles.btn} onClick={() => setType(2)}>모의 성적관리 <OrangeRight /></div>
					</div>
					<div className={styles.ttl}>합격예측</div>
					<div className={styles.shadow}>
						<div className={styles.btn} onClick={() => setType(3)}>수시 합격예측<span style={{color:'#DE6B3D'}}>(8월16일 open)</span><OrangeRight /></div>
						<div className={styles.btn} onClick={() => setType(4)}>정시 합격예측<span style={{color:'#DE6B3D'}}>(10월 open)</span><OrangeRight /></div>
					</div>
					<div className={styles.ttl}>마이클래스</div>
					<div className={styles.shadow}>
						
						<Link href='/myclass/classpic'><div className={styles.btn}>플래너 관리반(유료)<OrangeRight /></div></Link>
						<Link href='/myclass/classpic'><div className={styles.btn}>플래너 관리반(무료)<OrangeRight /></div></Link>
						<Link href='/myclass/classpic'><div className={styles.btn}>생기부 관리반<span style={{color:'#DE6B3D'}}>(10월 1일open)</span><OrangeRight /></div></Link>
						<Link href='/myclass/classpic'><div className={styles.btn}>클리닉 수업반<span style={{color:'#DE6B3D'}}>(12월 open)</span><OrangeRight /></div></Link>
					</div>
					<div className={styles.ttl}>설정</div>
					<div className={styles.shadow}>
						<Link href='/setting/Setting'><div className={styles.btn} onClick={() => alert('준비 중입니다.')}>마이페이지<OrangeRight /></div></Link>
						<div className={styles.btn} onClick={() => setOpen2(true)}>로그아웃<OrangeRight /></div>
					</div>
				</div>
	
	const naesin = <div className={styles.content}>
					<div className={styles.ttl}><OrangeLeft style={{margin:'auto'}} onClick={() => setType(0)}/> 내신 성적관리</div>
					<div className={styles.shadow}>
						{
						[['성적입력','/gpa/infoform'],
						['교과분석', '/gpa/mygrade'],
						['비교과분석  <준비중>',''],/*'/gpa/graph'*/
						['전형별 예측대학   <준비중>',''], /*/gpa/university*/
						['목표대학   <준비중>','']/*'/gpa/objective'*/].map(a => <Link href={a[1]}><div className={styles.btn}>{a[0]}<OrangeRight /></div></Link>)
						}
					</div>
				</div>
	const moui = <div className={styles.content}>
					<div className={styles.ttl}><OrangeLeft style={{margin:'auto'}} onClick={() => setType(0)}/> 모의 성적관리</div>
					<div className={styles.shadow}>
						{
						[['성적입력','/mockup/inputchoice'],
						['성적분석','/mockup/mygrade'],
						['성적추이','/mockup/graph'],
						['대학예측 및 검색','/mockup/university'],
						['목표대학','/mockup/prediction']].map(a => <Link href={a[1]}><div className={styles.btn}>{a[0]}<OrangeRight /></div></Link>)
						}
					</div>
				</div>
	const susi = <div className={styles.content}>
					<div className={styles.ttl}><OrangeLeft style={{margin:'auto'}} onClick={() => setType(0)}/> 수시 합격 예측</div>
					<div className={styles.shadow}>
						{
						[['성적입력','/early/input'],
						['교과 분석','/early/analysis'],
						['비교과 분석','/early/graph'],
						['특별전형 자격확인','/early/option'],
						['정시 가능 대학','/early/regular'],
						['전형별 대학 예측 및 검색 ','/early/university'],
						['관심 대학 및 모의 지원','/early/strategy']].map(a => <Link href={a[1]}><div className={styles.btn}>{a[0]}<OrangeRight /></div></Link>)
						}
					</div>
				</div>
	const jeongsi = <div className={styles.content}>
					<div className={styles.ttl}><OrangeLeft style={{margin:'auto'}} onClick={() => setType(0)}/> 정시 합격 예측</div>
					<div className={styles.shadow}>
						{
						[['성적입력','/regular/infoform'],
						['성적 분석','/regular/mygrade'],
						['특별전형 자격확인','/regular/beneficial'],
						['모의 지원','/regular/mockup'],
						['대학 예측 및 검색','/regular/university'],
						['관심 대학 유불리 정도 파악','/regular/university']].map(a => <Link href={a[1]}><div className={styles.btn}>{a[0]}<OrangeRight /></div></Link>)
						}
					</div>
				</div>
	
    return (
        <div className={show ? styles.SideNav_back : null}>
		<Head>
			<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>
		</Head>
            <div className={show ? [styles.SideNav_side_nav,styles.SideNav_show_nav].join(' ') : styles.SideNav_side_nav}
			onClick={()=>{}}
			>
			{/*<div className={styles.SideNav_header}>
					<div style={{display:'inline-block',verticalAlign:'middle',marginLeft:'5%',fontSize:'1.2em',flexGrow:'1'}}>{localStorage.getItem('rea luid') ? <><span>{localStorage.getItem('name')}님</span><br/><span>안녕하세요</span>!{a()}</> : '로그인 후 이용해주세요'}</div>
                    <div className={styles.SideNav_quit_btn} onClick={() => setShowNav(false)}>
                            <img src='/assets/icons/delete.svg' />
                    </div>
				</div>
                <div className="container" onClick={!localStorage.getItem('realuid') ? ()=>{setOpen(true)} : undefined}>
					<Link href="/"><div style={{marginBottom:0}}>HOME</div></Link>
					<div className={styles.SideNav_menu_div}>
						<div className={styles.SideNav_menu_sub_title}>내신/모의 관리 및 멘토링</div>
						<div className={styles.SideNav_menu_sub_content}>
							<div className={styles.SideNav_nav_menu} onClick={()=>{setSub(0)}}>
								내신 관리 멘토링
								{sub == 0 ? submenu(0) : null}
							</div>
							<div className={styles.SideNav_nav_menu} onClick={()=>{setSub(2)}}>
								모의 관리 멘토링
								{sub == 2 ? submenu(2) : null}
							</div>
						</div>
					</div>
					<div className={styles.SideNav_menu_div}>
							<div className={styles.SideNav_nav_menu} style={{width:'100%'}} onClick={()=>{setSub(1)}}>
								수시 합격 예측
								{sub == 1 ? submenu(1) : null}
							</div>
							<div className={styles.SideNav_nav_menu} style={{width:'100%'}} onClick={()=>{setSub(3)}}>
								정시 합격 예측
								{sub == 3 ? submenu(3) : null}
							</div>
					</div>
					<Link href="/timetable2">
						<div style={{paddingBottom:'1em','border-bottom':'1px solid rgba(45,45,45,0.1)'}}>
							플래너
						</div>
					</Link>
					<Link href="/setting/Setting">
						<div onClick={()=>{type[1]('default')}} style={{paddingBottom:'1em','border-bottom':'1px solid rgba(45,45,45,0.1)'}}>
							설정
						</div>
					</Link>
					{logged ? <div style={{paddingTop:'1em',margin:0}}><div className={styles.SideNav_logout} onClick={()=>{setOpen2(true)}}>로그아웃</div></div> : null}
				</div>*/}
				{ login[0] && info[0] ? <>
				<div className={styles.header}>
					<div className={styles.topbtns}>
						<WhiteLeft style={{fill:'white'}} onClick={close}/>
						<MenuIcon style={{fill:'white'}}/>
					</div>
					<div className={styles.names}>
						<span className={styles.bigname}><span className={styles.bold}>{localStorage.getItem('name')}</span>님</span><br/>
						<span className={styles.ttltxt}>{info[0].school} {c[info[0].gradeCode]}</span>
					</div>
				</div> 
				{
					[main,naesin,moui,susi,jeongsi][type]
				}</>	: <>
				<div className={styles.header}>
					<div className={styles.topbtns}>
						<WhiteLeft style={{fill:'white'}} onClick={close}/>
						<MenuIcon style={{fill:'white'}}/>
					</div>
					<div className={styles.names}>
						<span className={styles.bigname}>로그인 해주세요<br/></span>
					</div>
				</div>
				<div className={styles.shadow}>
						<div className={styles.btn} onClick={() => setOpen(true)}>로그인 하기<OrangeRight /></div>
					</div></>
				}
			</div>
			<Dialog open={open} handleClose={(i)=>{setOpen(false); if (i==2) {router.push('/main/Login')}}} fullWidth={true}></Dialog>
			<Dialog open={open2} handleClose={(i)=>{setOpen2(false); if (i==2) {logout(); router.push('/')}}} fullWidth={true} title="로그아웃 하시겠습니까?" vertical={false} buttons={logoutbuttons}></Dialog>
		</div>
    );
}
export default SideNav;