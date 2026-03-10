

const businessinfo = () => {
	return (< div className="page">
		<div style={{margin:'60px auto 56px', width:'fit-content',fontSize:'30px'}}>사업자 정보</div>
		<div style={{margin:'0 auto',width:'370px'}}>
			<div style={{display:'inline-flex',flexDirection:'column',transform:'translateX(-50%)',textAlign:'center'}}>
				<div style={{marginBottom:'35px'}}>사업체명</div>
				<div style={{marginBottom:'35px'}}>대표자</div>
				<div style={{marginBottom:'35px'}}>사업자 등록번호</div>
				<div style={{marginBottom:'35px'}}>위치</div>
			</div>
			<div style={{display:'inline-flex',flexDirection:'column',transform:'translateX(50%)',float:'right',textAlign:'center'}}>
				<div style={{marginBottom:'35px'}}>거북닷컴</div>
				<div style={{marginBottom:'35px'}}>강준호</div>
				<div style={{marginBottom:'35px'}}>127-56-00490</div>
				<div style={{marginBottom:'35px'}}>대치동 906-23 만수빌딩 502</div>
			</div>
		</div></div>
	);
}

export default businessinfo;