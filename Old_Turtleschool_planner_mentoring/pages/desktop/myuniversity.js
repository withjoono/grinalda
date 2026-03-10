
const Card = (props) => {
	const cardy = {
		width: '620px',
		height: '620px',
		borderRadius:'20px',
		padding:'37px 24px 14px',
		backgroundColor:'white',
		boxShadow:'25px 50px 6px 0px rgba(0,0,0,0.1)',
		boxSizing:'border-box',
		...props.style,
	}
	
	const item = {
		border: '1px solid #e9e9e9',
		borderRadius: '13px',
		boxSizing:'border-box',
		padding: '0 32px',
		marginBottom: '14px',
		height:'74px',
		display:'flex',
		alignItems:'center',
		justifyContent:'space-between'
	}
	
	return (
		<div style={cardy}>
			<div style={{backgroundColor:'#cbcbcb',width:'155px',height:'155px',borderRadius:'100px',margin:'0 auto 40px'}}/>
			<div style={{textAlign:'center',marginBottom:'20px'}}><span style={{'-webkit-text-stroke':'1px'}}>건국대학교   </span><span style={{fontWeight:'bold'}}>수학교육과</span>
			</div>
			<div style={item} />
			<div style={item} />
			<div style={item} />
			<div style={item} />
		</div>
	);
}

const myuniversity = () => {
	
	const dot = {
		width:'10px',
		height:'10px',
		marginRight:'7px',
		borderRadius:'5px',
		backgroundColor:'#cbcbcb'
	}
	
	return (
		<div className="page">
			<div style={{margin:'60px 0px 34px 320px',fontSize:'30px', width:'fit-content'}}>
				희망대학 보관함
			</div>
			<div style={{position:'relative', marginBottom:'20px'}}>
				<div style={{position:'absolute',top:0,left:0,height:'434px',width:'100%',backgroundColor:'#2c2b57', zIndex:-1}} />
				<div style={{padding:'47px 0 28px', textAlign:'center',fontSize:'18px','-webkit-text-stroke':'1px'}}>
					<span style={{color:'#fede01'}}>학종&교과전형 </span>
					<span style={{color:'white'}}>희망대학 보관함</span>
				</div>
				<div style={{display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
					<Card style={{transform:'scale(0.8)',zIndex:1,transformOrigin:'bottom'}} />
					<Card style={{transform:'scale(0.9)',marginLeft:'-265px',zIndex:2,transformOrigin:'bottom'}} />
					<Card style={{marginLeft:'-290px',marginRight:'-290px',zIndex:3,transformOrigin:'bottom'}}/>
					<Card style={{transform:'scale(0.9)', marginRight:'-265px',zIndex:2,transformOrigin:'bottom'}} />
					<Card style={{transform:'scale(0.8)',zIndex:1,transformOrigin:'bottom'}} />
				</div>
				<div style={{display:'flex',marginTop:'75px',justifyContent:'center'}}>
				<div style={dot} />
				<div style={dot} />
				<div style={dot} />
				<div style={{...dot,backgroundColor:'#fede01'}} />
				<div style={dot} />
				<div style={dot} />
				<div style={dot} />
				<div style={dot} />
				</div>
			</div>
			<div style={{position:'relative', marginBottom:'20px'}}>
				<div style={{position:'absolute',top:0,left:0,height:'434px',width:'100%',backgroundColor:'#2c2b57', zIndex:-1}} />
				<div style={{padding:'47px 0 28px', textAlign:'center',fontSize:'18px','-webkit-text-stroke':'1px'}}>
					<span style={{color:'#fede01'}}>논술 전형 </span>
					<span style={{color:'white'}}>희망대학 보관함</span>
				</div>
				<div style={{display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
					<Card style={{transform:'scale(0.8)',zIndex:1,transformOrigin:'bottom'}} />
					<Card style={{transform:'scale(0.9)',marginLeft:'-265px',zIndex:2,transformOrigin:'bottom'}} />
					<Card style={{marginLeft:'-290px',marginRight:'-290px',zIndex:3,transformOrigin:'bottom'}}/>
					<Card style={{transform:'scale(0.9)', marginRight:'-265px',zIndex:2,transformOrigin:'bottom'}} />
					<Card style={{transform:'scale(0.8)',zIndex:1,transformOrigin:'bottom'}} />
				</div>
				<div style={{display:'flex',marginTop:'75px',justifyContent:'center'}}>
				<div style={dot} />
				<div style={dot} />
				<div style={dot} />
				<div style={{...dot,backgroundColor:'#fede01'}} />
				<div style={dot} />
				<div style={dot} />
				<div style={dot} />
				<div style={dot} />
				</div>
			</div>
		</div>
	)
}

export default myuniversity;