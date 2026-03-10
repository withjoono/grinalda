import React, { useState, useEffect } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from "./Header.module.css";
import SideNav from "./SideNav"
import { Opt } from '../../contexts/login'
import Dialog from '../dialog'
import Link from 'next/link'
import {useRouter} from 'next/router'

const Header = props => {
	const [showNav, setShowNav] = useState(false)
	const {type} = React.useContext(Opt)
	const [open,setOpen] = useState(false);
	let title = "거북스쿨"
	const router = useRouter();
	useEffect(() => {
		if (router.pathname.indexOf('mockup/') > -1) type[1]('mockup');
		else if (router.pathname.indexOf('regular/') > -1) type[1]('regular');
		else if (router.pathname.indexOf('gpa/') > -1) type[1]('gpa');
		else if (router.pathname.indexOf('early/') > -1) type[1]('early');
		else if (router.pathname.indexOf('myclass/') > -1) type[1]('myclass');
        else if (router.pathname.indexOf('myclass_free/') > -1) type[1]('myclass_free');
		else type[1]('')
	},[router.pathname]);

	if (type[0] == 'mockup') title="모의 관리";
	else if (type[0]=='regular') title="정시 합격 예측";
	else if (type[0]=='gpa') title="내신 관리";
	else if (type[0]=='early') title='수시 합격 예측';
	else if (type[0]=='myclass') title='마이클래스';
    else if (type[0]=='myclass_free') title='마이클래스';

	const handleClose = (i) => {
		setOpen(false);
		if (i == 2) router.push('/main/Login');
	}

	const activeStyle = {
        borderBottom: '3px solid #fede01',
		paddingBottom: '7px'
    }

	const myclass = (<>
	<div style={{position:'relative',height:'45px',zIndex:-1}}></div>
		<div className={styles.Footer_nav}>
            <ul className={styles.Footer_nav_list}>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/home' ? activeStyle : null}>
                    <Link href='/myclass/home' >
					<div>
                        <div className={styles.Footer_btn_title}>홈</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/planner' ? activeStyle : null}>
                    <Link href='/myclass/planner'>
					<div>
                        <div className={styles.Footer_btn_title}>플래너</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/schoolgrades' ? activeStyle : null}>
                    <Link href='/myclass/schoolgrades' >
					<div>
                        <div className={styles.Footer_btn_title}>내신 관리</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/simulatedtest' ? activeStyle : null}>
                    <Link href='/myclass/simulatedtest' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>모의고사 관리</div>
					</div>
                    </Link>
                </li>
				<li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/test' ? activeStyle : null}>
					<Link href='/myclass/test' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title} >테스트</div>
					</div>
					</Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/health' ? activeStyle : null}>
                    <Link href='/myclass/health' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>체력 검사</div>
					</div>
                    </Link>
                </li>
				<li className={styles.Footer_nav_btn} style={router.pathname == '/myclass/frontdesk' ? activeStyle : null}>
                    <Link href='/myclass/frontdesk' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>프론트 데스크</div>
					</div>
                    </Link>
                </li>
            </ul>
        </div></>);

	const myclass_free = (<>
        <div style={{position:'relative',height:'45px',zIndex:-1}}></div>
            <div className={styles.Footer_nav}>
                <ul className={styles.Footer_nav_list}>

                    <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass_free/planner' ? activeStyle : null}>
                        <Link href='/myclass_free/planner'>
                        <div>
                            <div className={styles.Footer_btn_title}>플래너</div>
                        </div>
                        </Link>
                    </li>
                    <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass_free/schoolgrades' ? activeStyle : null}>
                        <Link href='/myclass_free/schoolgrades' >
                        <div>
                            <div className={styles.Footer_btn_title}>내신 관리</div>
                        </div>
                        </Link>
                    </li>
                    <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass_free/simulatedtest' ? activeStyle : null}>
                        <Link href='/myclass_free/simulatedtest' activeStyle={activeStyle}>
                        <div>
                            <div className={styles.Footer_btn_title}>모의고사 관리</div>
                        </div>
                        </Link>
                    </li>
                    <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass_free/test' ? activeStyle : null}>
                        <Link href='/myclass_free/test' activeStyle={activeStyle}>
                        <div>
                            <div className={styles.Footer_btn_title} >테스트</div>
                        </div>
                        </Link>
                    </li>
                    <li className={styles.Footer_nav_btn} style={router.pathname == '/myclass_free/health' ? activeStyle : null}>
                        <Link href='/myclass_free/health' activeStyle={activeStyle}>
                        <div>
                            <div className={styles.Footer_btn_title}>체력 검사</div>
                        </div>
                        </Link>
                    </li>

                </ul>
            </div></>);
	const regular = (<>
	<div style={{position:'relative',height:'45px',zIndex:-1}}></div>
		<div className={styles.Footer_nav}>
            <ul className={styles.Footer_nav_list}>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/regular/infoform' ? activeStyle : null}>
                    <Link href='/regular/infoform' >
					<div>
                        <div className={styles.Footer_btn_title}>성적 입력</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/regular/mygrade' ? activeStyle : null}>
                    <Link href='/regular/mygrade'>
					<div>
                        <div className={styles.Footer_btn_title}>성적 분석</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/regular/university' || router.pathname == '/regular/result' ? activeStyle : null}>
                    <Link href='/regular/university' >
					<div>
                        <div className={styles.Footer_btn_title}>대학/학과별 검색</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/regular/beneficial' ? activeStyle : null}>
                    <Link href='/regular/beneficial' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>나에게 유리한 대학</div>
					</div>
                    </Link>
                </li>
				<li className={styles.Footer_nav_btn}>
					<Link href='/regular/mockup' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>모의 지원</div>
					</div>
					</Link>
                </li>
                <li className={styles.Footer_nav_btn}>
                    <Link href='/consulting/Consulting' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>맞춤 정보</div>
					</div>
                    </Link>
                </li>
            </ul>
        </div></>);

	const mockup = (<>
	<div style={{position:'relative',height:'45px',zIndex:-1}}></div>
		<div className={styles.Footer_nav}>
            <ul className={styles.Footer_nav_list}>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/mockup/inputchoice' || router.pathname == '/mockup/gradeinput' || router.pathname == '/mockup/omrinput' ? activeStyle : null}>
                    <Link href='/mockup/inputchoice' >
					<div>
                        <div className={styles.Footer_btn_title}>성적 입력</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/mockup/mygrade' ? activeStyle : null}>
                    <Link href='/mockup/mygrade'>
					<div>
                        <div className={styles.Footer_btn_title}>성적 분석</div>
					</div>
                    </Link>
                </li>
                 <li className={styles.Footer_nav_btn} style={router.pathname == '/mockup/graph' || router.pathname == '/mockup/result' ? activeStyle : null}>
                    <Link href='/mockup/graph' >
					<div>
                        <div className={styles.Footer_btn_title}>성적 추이</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/mockup/university' || router.pathname == '/mockup/result' ? activeStyle : null}>
                    <Link href='/mockup/university' >
					<div>
                        <div className={styles.Footer_btn_title}>대학예측 및 검색</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/mockup/prediction' ? activeStyle : null}>
                    <Link href='/mockup/prediction' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>목표대학</div>
					</div>
                    </Link>
                </li>

            </ul>
        </div></>);

	const gpa = (<><div style={{position:'relative',height:'45px',zIndex:-1}}></div><div className={styles.Footer_nav}>
            <ul className={styles.Footer_nav_list}>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/gpa/infoform' ? activeStyle : null}>
                    <Link href='/gpa/infoform' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>성적입력</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/gpa/mygrade' ? activeStyle : null}>
                    <Link href='/gpa/mygrade' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>교과분석</div>
					</div>

                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/gpa/graph' ? activeStyle : null}>
                    <Link href='' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>비교과분석</div> {/*/gpa/graph*/}
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/gpa/university' ? activeStyle : null}>
                    <Link href='' activeStyle={activeStyle}> 
					<div>
                        <div className={styles.Footer_btn_title}>전형별 예측대학</div> {/*/gpa/university*/}
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/gpa/objective' ? activeStyle : null}>
                    <Link href='' activeStyle={activeStyle}> 
					<div>
                        <div className={styles.Footer_btn_title}>목표대학</div>{/*/gpa/objective*/}
					</div>
                    </Link>
                </li>
            </ul>
        </div></>);

	const early = (<>
	<div style={{position:'relative',height:'45px',zIndex:-1}}></div>
		<div className={styles.Footer_nav}>
            <ul className={styles.Footer_nav_list}>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/early/input' ? activeStyle : null}>
                    <Link href='/early/input' >
					<div>
                        <div className={styles.Footer_btn_title}>성적 입력</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/early/analysis' ? activeStyle : null}>
                    <Link href='/early/analysis'>
					<div>
                        <div className={styles.Footer_btn_title}>교과 분석</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/early/graph' ? activeStyle : null}>
                    <Link href='/early/graph' >
					<div>
                        <div className={styles.Footer_btn_title}>비교과 분석</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/early/option' ? activeStyle : null}>
                    <Link href='/early/option' >
					<div>
                        <div className={styles.Footer_btn_title}>특별 전형 자격 확인</div>
					</div>
                    </Link>
                </li>
				<li className={styles.Footer_nav_btn} style={router.pathname == '/early/regular' ? activeStyle : null}>
                    <Link href='/early/regular' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>정시 가능 대학</div>
					</div>
                    </Link>
                </li>
                <li className={styles.Footer_nav_btn} style={router.pathname == '/early/university' ? activeStyle : null}>
                    <Link href='/early/university' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>전형별 대학 예측 및 검색</div>
					</div>
                    </Link>
                </li>

				<li className={styles.Footer_nav_btn} style={router.pathname == '/early/strategy' ? activeStyle : null}>
                    <Link href='/early/strategy' activeStyle={activeStyle}>
					<div>
                        <div className={styles.Footer_btn_title}>관심 대학 및 모의 지원</div>
					</div>
                    </Link>
                </li>
            </ul>
        </div></>);

	const openDialog = () => {
		const uid = localStorage.getItem('uid');
		if (!uid) setOpen(true);
	}

	const menu = () => {
		if (type[0] == 'mockup') return mockup;
		else if (type[0] == 'regular') return regular;
		else if (type[0] == 'gpa') return gpa;
		else if (type[0] == 'early') return early;
		else if (type[0] == 'myclass') return myclass;
        else if (type[0] == 'myclass_free') return myclass_free;
		else return null;
	}

	return (<><div style={{height:'40px'}}/>
        <div className={styles.Header}>
			<Dialog open={open} handleClose={handleClose} />
            <SideNav show={showNav} setShowNav={setShowNav}/>
            <div className={styles.Header_width}>
                <div className={styles.Header_bars} onClick={() => setShowNav(true)}><FontAwesomeIcon icon={faBars} /></div>
                <div className={styles.Header_title_center}>
                    <div className={styles.Header_title}>{title}</div>
                </div>
				<div className={styles.Header_icon} onClick={openDialog}>
				<Link href="/setting/Setting"><img src="/assets/icons/user.svg" className={styles.icon}/></Link>
				</div>
            </div>
        </div>
		<div style={{zIndex:2}}>{menu()}</div></>
	);
};

export default Header; 