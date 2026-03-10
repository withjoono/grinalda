import styles from './form.module.css'

const grade = (props) => {
	const {exams} = props;
	const w = {
		10:'blue',
		20:'blue',
		50:'gold',
		60:'red',
		70:'yellow',
		80:'purple'
	}
	const nopad = {padding: 0}
		return (
		<div className={styles['home-board']} style={{width:'100%'}}>
			<table style={{backgroundColor:'white'}}>
				<tr>
				<th style={{width:'30%'}}>과목</th>
				<th style={nopad}>표준점수</th>
				<th style={nopad}>백분위</th>
				<th style={nopad}>등급</th>
				<th style={nopad}>상위누적</th>
				</tr>
				
				{
					exams.map(e => {
						return (
						<tr>
						<td>
						<div className={[styles.subject,styles[w[e.subjectArea]]].join(' ')} style={{boxShadow:'0px 2px 0px 0px rgba(0,0,0,0.1)'}}>{e.subjectName}</div>
						</td>
						<td>
						<div className={styles.input} style={{border:0}}>{e.standardScore}</div>
						</td>
						<td>
						<div className={styles.input} style={{border:0}}>{e.percentScore}</div>
						</td>
						<td>
						<div className={styles.input} style={{border:0}}>{e.grade}</div>
						</td>
						<td>
						<div className={styles.input} style={{border:0}}>-</div>
						</td>
						</tr>)
					})
				}
			</table>
		</div>
		);
}

export default grade;