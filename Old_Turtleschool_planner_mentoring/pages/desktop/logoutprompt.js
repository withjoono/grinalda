

const logoutprompt = () => {
	
	const btn = {
		width:'370px',
		height:'40px',
		display:'inline-flex',
		justifyContent:'center',
		alignItems:'center',
		borderRadius: '20px',
		border:'1px solid #fede01',
		
	}
	
	return (
		<div className="page">
			<div style={{margin:'195px auto 58px',fontSize:'20px', width:'fit-content'}}>
				정말 탈퇴하시겠습니까?
			</div>
			<div style={{margin: '0 auto', width:'fit-content'}}>
			<div style={{...btn, backgroundColor:'#fede01', color:'white',marginRight:'40px'}}>아니요 돌아갈래요</div>
			<div style={btn}>확인</div>
			</div>
		</div>
	);

}

export default logoutprompt;