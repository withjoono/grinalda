import {useState} from 'react'
import axios from 'axios'
import Menu from '../../comp/naesinmenu'
import router from 'next/router'
const gradeanalysis2 = ({big, medium, small}) => {

	const [dae, setDae] = useState('')
	const [jung, setJung] = useState('')
	const [so, setSo] = useState('')
	const [result, setResult] = useState([])
	const changeBig = (e) => {
		setDae(e.target.value)
		setJung('')
		setSo('')
	}
	const changeMed = (e) => {
		setJung(e.target.value)
		setSo('')
	}
	const changeSo = (e) => {
		setSo(e.target.value)
	}
	
	const search = () => {
		axios.get('/api/gpa/Series',{
			params: {
				large_cd: dae,
				middle_cd: jung,
				small_cd: so
			}
		}).then(res =>{console.log(res.data);
			setResult(res.data.data)
		})
	}
	const nav = (index) =>{
		if (index==0)
		{
			router.push('https://docs.google.com/forms/d/e/1FAIpQLSe03ylQxLZg9cptUbeHnelEWKJd88IjD-5KUSNdc-9qQF0GbA/viewform?usp=sf_link')
		}
	}
	return (
		<div className="page">
			<style jsx>{`
				.textbox {
					background-color: #E8E8E8;
					width: 100%;
					height: 168px;
					padding: 12px 24px;
					position: relative;
					margin-bottom: 40px;
				}
				.textbox_first {
					display: inline-flex;
					flex-direction: column;
					justify-content: space-between;
					height: 144px;
					flex-wrap: no-wrap;
				}
				.textbox_first > * {
					font-size: 16px;
					line-height: 22px;
					flex: 0;
				}
				.textbox_second {
					display: inline-flex;
					position: absolute;
					top: 0;
					right: 110px;
					align-items: center;
					height: 100%;
				}
				.textbox_second > * {
					margin-left: 30px;
					font-size: 12px;
					line-height: 17px;
					text-align: center;
				}
				.circle {
					background-color: white;
					width: 110px;
					height: 110px;
					display: flex;
					align-items: center;
					flex-direction: column;
					border-radius: 55px;
					padding: 12px;
				}
				.bignum {
					color: #DE6B3D;
					line-height: 30px;
					font-size: 20px;
					-webkit-text-stroke: 1px;
					width: 50px;
					border-bottom: 1px solid #DE6B3D;
					margin-bottom: 12px;
				}
				.tbl {
					display: grid;
					grid-template-rows: 54px 1fr; 
					grid-template-columns: 30% 30% 40%;
					width: 100%;
					grid-gap: 1px;
					background-color: #CBCBCB;
					height: 340px;
					border: 1px solid #cbcbcb;
					border-top: 1px solid #363636;
					
				}
				.one {
					grid-row: 1 / 2;
				}
				.hana {
					grid-column: 1 / 2;
				}
				.two {
					grid-row: 2 / 3;
				}
				.dul {
					grid-column: 2 / 3;
				}
				.set {
					grid-column: 3 / 4;
				}
				.head {
					display: flex;
					align-items: center;
					-webkit-text-stroke: 1px;
					background-color: #fafafa;
					padding:30px;
				
				}
				.chosen {
					color: white;
					background-color: #DE6B3D;
					text-align:center; 
				}
				.content {
					display: flex;
					flex-direction: column;
					overflow-y: scroll;
					padding-top: 20px;
					padding-bottom: 20px;
					background-color: white;
				}
				.btn {
					margin: 0 auto;
					width: 240px;
					height: 50px;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 20px;
					margin-bottom: 40px;
					cursor: pointer;
				}
				.cards {
					display: flex;
					position: relative;
					overflow: hidden;
					cursor:pointer;
				}
				.arrow {
					margin: 0 20px;
					transform: translateY(50%);
				}
				.arrow:nth-of-type(1) {
					position:absolute;
					right: 100%;
				}
				.arrow:nth-of-type(2) {
					position:absolute;
					left:100%;
				}
				.card {
					margin: 12px 15px;
					box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
					flex: 0 0 300px;
					height: 186px;
					border: 1px solid #e8e8e8;
					background-color: white;
					padding: 16px 25px;
					position: relative;
					
				}
				.profile {
					width: 50%;
					height: 100%;
					display: inline-block;
					margin-right: 18px;
					background-color: transparent;
				}
				.profile > img {
					width: 100%;
					height: 100%;
				}
				.name {
					position: absolute;
					top: 16px;
					display: inline-block;
					-webkit-text-stroke: 1px;
					line-height: 26px;
					font-size: 18px;
					margin-bottom: 10px;
				}
				.college {
					display: inline-block;
				
					font-size: 12px;
					color: #646464;
					margin-right: 8px;  
	
				}
				.major {
					display: inline-block;
					line-height: 15px;
					font-size: 10px;
					color: #646464;
				}
				.ttl {
					 margin-top: 10px;
					 margin-bottom: 10px;
					 line-height: 17px;
					font-size: 12px;
					 #9D9D9D
				}
				.txt {
					font-size: 10px;
					line-height: 15px;
					margin-bottom: 6px;
				}
			`}</style>
			<Menu index={2} />
			<div style={{width:'1280px',margin:'0 auto'}}>
				<div className='textbox'>
					<div className='textbox_first'>
						<div><p><span className='orange_txt'>비교과 분석은</span>  전공별 전문 선생님이 직접 학생 개개인의 생기부, 자소서를 보고 평가합니다.</p></div>
						<div><p>평가는 평가 항목별로 A+, A0, A-, B, C 5단계로 평가되며, 결과에 대한 주석까지 함께 제공됩니다.</p></div>
						<div><p><span className='orange_txt'>이용절차는</span> 전공별 선생님을 검색한후 선생님을 선택하고 아래 결제창에서 결제 후,<br/>
					세부 내용 입력창을 통해 구체적인 사항을 입력한 후 제출하시면 됩니다.</p></div>
					</div>
					<div className='textbox_second'>
						<div className='circle'>
							<div className='bignum'>1</div>
							전공별<br/>선생님 검색
						</div>
						<div className='circle'>
							<div className='bignum'>2</div>
							세부 내용 작성
						</div>
						<div className='circle'>
							<div className='bignum'>3</div>
							결제 진행
						</div>
					</div>
				</div>
				<div className='title_left'>전공별 선생님 검색</div>
				<div className='tbl'>
					<div className='hana one chosen head'>
						대계열 선택
					</div>
					<div className='dul one head'>
						중계열 선택
					</div>
					<div className='set one head'>
						소계열 선택
					</div>
					<div className='hana two content'>
						{
							big.map(r => <button value={r.comn_cd} onClick={changeBig} style={dae == r.comn_cd ? {backgroundColor:'#ededed',border:'1px solid #9d9d9d'} : null}>{r.comn_nm}</button>)
						}
					</div>
					<div className='dul two content'>
						{
							medium[dae].map(r => <button value={r.comn_cd} onClick={changeMed} style={jung == r.comn_cd ? {backgroundColor:'#ededed',border:'1px solid #9d9d9d'} : null}>{r.comn_nm}</button>)
						}
					</div>
					<div className='set two content'>
						{
							small[jung].map(r => <button value={r.comn_cd} onClick={changeSo} style={so == r.comn_cd ? {backgroundColor:'#ededed',border:'1px solid #9d9d9d'} : null}>{r.comn_nm}</button>)
						}
					</div>
				</div>
			<div className='btn orange white_txt' onClick={search}>선택 조건으로 검색하기</div>
			<div className='title_left'>검색 결과 선생님 리스트</div>
			<div style={{position:'relative'}}>
				{//<img src='/assets/icons/big_right.svg' className='arrow'/>
				}
				{//<img src='/assets/icons/big_left.svg' className='arrow'/>
				}
			 <div className='cards'>
			
				{
					result != null ?
					result.map(r => (

			
						<div className='card' onClick={()=>nav(0)}>
							<div className='profile'><img src={'/profile-img/'+r.imgpath+'.jpg'} /></div>
							<div className='name'>
								<div>
								{r.user_name}
								</div>
								<div>
								{r.department}
								</div>
								<div style={{width:'98px',height:'25px',border:'1px rgb(46, 171, 201) solid',fontSize:'12px',fontWeight:'500px',color:'rgb(46, 171, 201)'
								,textAlign:'center',marginTop:'10px'}}>
									평가받기
								</div>
							</div>
							<div className='college'>{r.univ}</div>
						</div>
					
					))
					: 
					<div style={{width:'100%',border:'1px #000000 solid',height:'200px',textAlign:'center',lineHeight:'200px'}}>
				
					<div style={{fontSize:'50px'}}>
						해당 교과에 선생님이 준비중입니다 
					</div>
					</div>
				}
	
			 </div>
			 </div>
			</div>
		</div>
	);

}

export default gradeanalysis2;