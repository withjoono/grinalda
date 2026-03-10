import Menu from '../../comp/susimenu'
import Form from '../gpa/formform'
import {useState, useEffect} from 'react'
import axios from 'axios'
import withPayment from '../../comp/paymentwrapper'
const EarlyOptions = () => {
	
	const [options, setOptions] = useState(Array(15).fill(false))
	const names = [
	'대학별 독자적 기준',
	'고른기회 특별전형',
	'특기자',
	'농어촌 학생',
	'특성화고교 졸업자',
	'특성화고 등을 졸업한 재직자',
	'기초생활수급자, 차상위계층, 한부모가족 지원대상자',
	'장애인 등 대상자',
	'산업대 위탁생',
	'서해 5도',
	'제주특별자치도 특별전형',
	'계약학과',
	'위탁교육생',
	'군위탁생',
	'재외국민 및 외국인'
	]
	
	const handleOptions = (e) => {
		options[e.target.id] = !options[e.target.id];
		setOptions([...options])
	}
	
	return (<div style={{backgroundColor:'#FAFAFA'}}>
		<Menu title='내신등급 및 편차지수 분석' index={2}/>
		<div style={{width:'1280px',margin:'0 auto'}}>
			<div style={{height:'45px',width:'100%'}}/>
			<span className='title_left'>특별 전형 정원내</span>
			<div style={{display:'flex',marginRight:'-40px'}} onClick={handleOptions}>
				{
					options.map(
						(e,i) => i < 3 ? <div className='desktop_option' id={i} style={!e ? undefined : {backgroundColor:'#FCBF77'}}><img src={'/assets/icons/checkbox'+(e ? '_active' : '')+'.svg'} width={27} height={27} /><p>{names[i]}</p></div> : null
					)
				}
			</div>
			<div style={{height:'45px',width:'100%'}}/>
			<span className='title_left'>특별 전형 정원외</span>
			<div style={{display:'flex',marginRight:'-40px',flexWrap:'wrap',marginBottom:'30px'}} onClick={handleOptions}>
				{
					options.map(
						(e,i) => i >= 3 ? <div className='desktop_option' id={i} style={!e ? undefined : {backgroundColor:'#FCBF77'}}><img src={'/assets/icons/checkbox'+(e ? '_active' : '')+'.svg'} width={27} height={27} /><p>{names[i]}</p></div> : null
					)
				}
			</div>
			<div className='desktop_btn'>수정하기</div>
		</div>
		</div>
	)
}

export default withPayment(EarlyOptions,null,'수시');