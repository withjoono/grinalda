import Link from 'next/link'

const SusiMenu = ({index, title, subtitle}) => {
	
	const links = ['/gpa/infoform','/gpa/mygrade','/gpa/graph','','']   
	{/*  /gpa/university  ,objective*/}
	const icons = ['input','analysis','school','paper','univfolder']
	const titles = ['내신 성적입력','내신 교과 분석','내신 비교과 분석','내신 전형별 예측 대학','내신 목표대학']
	 
	return (
	<>
	<div className='panel'>
		<div className='title'>{titles[index]}</div>
	</div>
	<div className='bigmenu'>
		<div>
		{
			['성적입력','교과 분석','비교과 분석','전형별 예측 대학','목표대학'].map((e,i) =>
				<Link href={links[i] == '' ? '' : links[i]}><button className={index == i ? 'bigmenu_active' : ''} ><div><img src={'/assets/'+icons[i]+'.png'} style={{height:'40px'}}/></div>{e}</button></Link>
			)
		}
		</div>
	</div>
	</>
	)
}

export default SusiMenu;