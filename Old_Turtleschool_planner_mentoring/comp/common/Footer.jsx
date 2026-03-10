import React, { useState, useEffect, useContext } from "react";
import {Opt} from '../../contexts/login'
import styles from "./Footer.module.css";
import Link from 'next/link'
import {useRouter} from 'next/router'

const Footer = () => {
	const r = useRouter()
	const [a,b] = useState(r.pathname)
	useEffect(() => {
		console.log(r.pathname)
		b(r.pathname)
	},[r.pathname])
	return (
	<>
		<div className={styles.navbar}>
		<Link href='/timetable2'>
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
			  <path id="Path_82" data-name="Path 82" d="M15.232,5.228l3.536,3.529M16.732,3.731a2.5,2.5,0,0,1,3.536,3.529L6.5,21H3V17.435l13.732-13.7Z" transform="translate(-2 -1.788)" fill='none' stroke={a.includes('timetable') ? '#DE6B3D' : '#707070'} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
			</svg>
			플래너
		</div>
		</Link>
		<Link href='/mockup/inputchoice'>
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="16.384" viewBox="0 0 20 16.384">
			  <path id="Path_91" data-name="Path 91" d="M12,6.231V19M12,6.231A8.313,8.313,0,0,0,7.5,5,8.313,8.313,0,0,0,3,6.231V19a8.313,8.313,0,0,1,4.5-1.231A8.313,8.313,0,0,1,12,19M12,6.231A8.313,8.313,0,0,1,16.5,5,8.311,8.311,0,0,1,21,6.231V19a8.311,8.311,0,0,0-4.5-1.231A8.313,8.313,0,0,0,12,19" transform="translate(-2 -4)" fill="none" stroke={a.includes('mockup') ? '#DE6B3D' : '#707070'} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
			</svg>
			모의 관리
		</div>
		</Link>
		<Link href='/gpa/infoform'>
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" >
			  <g id="Component_18_1" data-name="Component 18 – 1" transform="translate(1 1)">
				<path id="Path_88" data-name="Path 88" d="M16,4V16l-4-2L8,16V4M6,20H18a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V18a2,2,0,0,0,2,2Z" transform="translate(-4 -4)" fill="none" stroke={a.includes('gpa') ? '#DE6B3D' : '#707070'} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
			  </g>
			</svg>
			내신 관리
		</div>
		</Link>
		<Link href='/early/input'>
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" >
			  <path id="Path_89" data-name="Path 89" d="M16,8v8m-4-5v5M8,14v2M6,20H18a2,2,0,0,0,2-2V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V18a2,2,0,0,0,2,2Z" transform="translate(-3 -3)" fill="none" stroke="#707070" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
			</svg>
			합격예측
		</div>
		</Link>
		<Link href='/myclass/classpic'>
		<div>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill='#707070'>
			  <path id="Path_90" data-name="Path 90" d="M5.121,17.8a14.017,14.017,0,0,1,13.758,0M15,10a3,3,0,1,1-3-3,3,3,0,0,1,3,3Zm6,2a9,9,0,1,1-9-9,9,9,0,0,1,9,9Z" transform="translate(-2 -2)" fill="none" stroke='#707070' stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
			</svg>
			마이클래스
		</div>
		</Link>
		</div>
		<div className={styles.Footer_info}>
            <div >사업체명 : 거북닷컴 / 대표자 : 강준호 / 사업자 등록번호 : 127-56-00490 </div>
            <div>위치 : 대치동 906-23 만수빌딩 502 / 이메일 : ingconsulting@naver.com </div>
            <div>통신판매업 제 2020-서울강남-03702호 </div>
            <div>전화번호 : 02-501-3357 </div>
            <div>통화가능시간 : 월~금 10시~17시 </div>
		</div>
	</>
	);
};

export default Footer;