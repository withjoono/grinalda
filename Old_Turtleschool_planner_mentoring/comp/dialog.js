import Dia from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

const dialogstyle = makeStyles({
		container: {
			width: '90%',
			margin: '0 auto',
			'max-width': '600px',
			'max-height': '1200px',
			color: '#707070',
			'border-radius': '15px'
		}
	})

const Dialog = (props) => {
	const {title, content, buttons, vertical, open, handleClose} = props;
	
	const classes = dialogstyle();
	
	const titlestyle = {
		marginTop: '2.5em',
		marginBottom:'2.5em',
		marginLeft:'1.5em',
		marginRight:'1.5em',
		fontWeight:'bold',
		fontSize:'1em',
		textAlign:'center'
	}
	
	const contentstyle = {
		textAlign:'center',
		marginBottom:'2em',
		fontSize:'0.7em'
	}
	
	const buttonstyle = {
		border: 0,
		margin: '0.3em',
		'border-radius':'15px'
	}
	
	const buttontext = {
		fontSize:'1.2em',
		width:'100%',
		padding: '1em',
		display:'inline-block',
		'vertical-align':'middle',
		textAlign: 'center',
		color: '#ffffff',
		'box-sizing':'border-box',
		fontWeight:'bold'
	}
	
	return (
	<Dia open={open} onClose={handleClose} classes={{paper:classes.container}} fullWidth={true}>
		<div >
			<div style={titlestyle}>
				{title ? title : '로그인 후 서비스 이용이 가능합니다.'}
			</div>
			<div style={contentstyle}>
				{title ? content : <>타입시기관에서는 볼 수 없는<br/>우리 거북입시만의 서비스를 이용해 보세요!</>}
			</div>
			
			{!!vertical || !buttons ? <><div style={{...buttonstyle, backgroundColor:'#dddddd'}} onClick={() => {handleClose(1)}}>
				<span style={buttontext}>안 할래요!</span>
			</div>
			<div style={{...buttonstyle, backgroundColor:'#fede01'}} onClick={() => {handleClose(2)}}>
				<span style={buttontext}>로그인할게요!</span>
			</div></> : 
				<div style={{display:'flex'}}>
					{
					buttons.map((e,i) => {
						let a = '0.3em';
						if (i%2 == 1) a = 0
						return (<div key={i+1} style={{...buttonstyle,backgroundColor:e.color,flexGrow:1,flexBasis:0,marginLeft:a}} onClick={() => {handleClose(i+1)}}>
							<span style={buttontext}>{e.content}</span>
							</div>)
					})
					}
				</div>
			}
		</div>
	</Dia>
	);
	
}

export default Dialog;