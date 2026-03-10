import Link from 'next/link'

const MouiMenu = ({index, title, subtitle}) => {
	
	const links = ['inputchoice','mygrade','graph','university','prediction']
	const icons = ['input','analysis','graph','predictionlogo','search','goal']
	const titles = ['모의 성적입력','모의 성적분석','모의 성적 추이','모의 대학 예측 및 검색','모의 목표대학']
	return (
	<>
	<div className='panel'>
		<div className='title'>{titles[index]}</div>
	</div>
	<div className='bigmenu'>
		<div>
		{
			['성적입력','성적분석','성적 추이','대학 예측 및 검색','목표대학'].map((e,i) =>
				<Link href={links[i] == '' ? '' : '/mockup/'+links[i]}><button className={index == i ? 'bigmenu_active' : ''} ><div><img src={'/assets/'+icons[i]+'.png'} style={{maxWidth: '50%', objectFit: 'scale-down'}}/></div>{e}</button></Link>
			)
		}
		</div>
	</div>
	</>
	)
}

export default MouiMenu;