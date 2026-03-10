import {useRouter} from 'next/router'
import s from './login.module.css'

const incomplete = () => {
	const router = useRouter();
	const {title, subtitle} = s;
	
	return (
		<div className="page">
			<div className={title}>
				현재 서비스 준비 중입니다
			</div>
			<div style={{margin: '40px auto', textAlign:'center'}}>
				2022학년도 수능 이후 서비스 이용 가능합니다.
				<br/><br/><br/>
				<div onClick={()=>{router.back()}}>&lt;&lt;돌아가기</div>
			</div>
		</div>
	);
}

export default incomplete;