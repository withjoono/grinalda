import page from '../desktop/earlyanalysis'
import withDesktop from '../../comp/withdesktop'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {useState, useEffect, useMemo} from 'react'
import axios from 'axios'
import useZnaesin from '../../comp/znaesin'

const EarlyInput = () => {
	const {
		gpaAsk, setgpaAsk,  chartTwo,  setchartTwo,  radio,  setRadio,  check,  checkBlue,  checkRed
	} = useZnaesin()
	const [chosen, setChosen] = useState(1)
	
	return (<>
		<style jsx>{`
			select {
				padding: 6px 10px;
				border-bottom: 1px solid #9d9d9d;
				width: 100%;
				margin-top: 10px;
				font-size: 10px;
			}
			.arrow {
				position: absolute;
				right: 10px;
				width: 16px;
				height: 16px;
				bottom: 6px;
			}
			* {
				font:normal normal bold 15px/22px Noto Sans CJK KR;
			}
			.overflowS{
				width: 100%;
				overflow-x:scroll;
			
			}
			.ztable {
				border-collapse: collapse;
				border-top: 1px solid #363636;
				margin-bottom: 30px;
				margin:auto;
				height:276px;
				width:759px;
			}
			.ztable tr{
		
				white-space:nowrap;
				text-align:center;
				border-bottom: 1px solid #CBCBCB;
				
			}
			.ztable tr:nth-of-type(1){
				height:36px;
				line-height:36px;
				background-color:#F6F6F6;
			
			}
			.ztable tr th:nth-of-type(1)	
			{
				height:36px;
				line-height:36px;
				background-color:#F6F6F6;
			
			}
			.overflowS .ztable tr th,
			.overflowS .ztable tr td{
				border-right:1px #CBCBCB solid;
				width:90px;
				
			}
		`}</style>
	<div style={{width:'90%',margin:'0 auto'}}>
			<div style={{height:'22px',width:'100%'}}/>
			<div style={{lineHeight:'30px',fontSize:'22px',marginBottom:'12px'}}>
			{localStorage.getItem('name')}님의 내신 분석
			</div>
			<div className='mobile_menu'>
				<button className={chosen == 0 ? 'mobile_menuactive' : ''} onClick={() => setChosen(0)}>
				내신 평균 등급
				</button>
				<button className={chosen == 1 ? 'mobile_menuactive' : ''} onClick={() => setChosen(1)}>
				내신 Z점수
				</button>
			</div>
			{chosen == 0 ? <>
			전체 등급 평균
			<table className='mobile_table'>
				<tr>
					<th>조합명</th>
					<th>전과목</th>
					<th>국영수탐</th>
					<th>국영수</th>
				</tr>
				<tr>
					<td>내신 평균</td>
					<td>5</td>
					<td>5</td>
					<td>5</td>
				</tr>
			</table>
			진로 선택
			<table className='mobile_table'>
				<tr>
					<th>성취도</th>
					<th>과목수</th>
					<th>비율</th>
				</tr>
				<tbody className='mobile_nohorizontal'>
					<tr>
						<td>A</td>
						<td>5</td>
						<td>80%</td>
					</tr>
					<tr>
						<td>A</td>
						<td>5</td>
						<td>80%</td>
					</tr>
					<tr>
						<td>A</td>
						<td>5</td>
						<td>80%</td>
					</tr>
				</tbody>
			</table></> : <>
			나의 내신 Z점수
			<div className='overflowS'>
			<table className='ztable'>
				<thead>
					<tr>
                        <td>조합명</td>
                        <td>내신등급평균</td>
                        <td>내신백분위</td>
                        <td>내신Z점수</td>
                        <td>Z점수<br/>백분위</td>
                        <td>Z점수<br/>환산내신</td>
                        <td>Z점수분위 환산내신-<br/>내신등급 평균</td>
                    </tr>
				</thead>
				<tbody>
					{
						gpaAsk.map(obj => {
							return(
							<tr>
								<td>{obj['subjectare']}</td>
								<td>{obj['grade1']}</td>
								<td>{obj['grade2']}</td>
								<td>{obj['grade3']}</td>
								<td>{obj['grade4']}</td>
								<td>{obj['grade5']}</td>
								<td>{obj['grade6']}</td>
							</tr>
							)
						})
					}
				</tbody>
			</table>
			</div>
			</>}
			</div>
			<div style={{position:'absolute',width:'100vw',backgroundColor:'#F5F5F5',padding:'5%'}}>
				{chosen == 0 ? <> 학기별 내신
				<HighchartsReact highcharts={Highcharts} options={chartOptions} />
				과목별/조합별 성적 변동 추이
				<div className='mobile_graph_menu' onClick={(e) =>setGraph(e.target.value)}>
					<button value='individual' className={graph == 'individual' ? 'mobile_graph_menu_active' : ''}>과목별</button>
					<button value='sum' className={graph == 'sum' ? 'mobile_graph_menu_active' : ''}>조합별</button>
				</div>
				<div style={{position:'relative', width: '100%'}}>
					<select>
						<option value=''>조합선택</option>
					</select>
					<img src='/assets/icons/arrow_down.svg' className='arrow' />
				</div>
				<HighchartsReact highcharts={Highcharts} options={chartOptions} />
				</> : <>
				<p>내신 반영 방식</p>
				<span>{checkBlue}내신 등급 평균
				{checkRed} Z내신 등급 평균 <span style={{fontSize:'10px'}}>(연대 기준)</span></span>                
                <HighchartsReact highcharts={Highcharts} options={chartTwo} allowChartUpdate={true} /></>}
			</div>
		</>
		
	)
}
export default withDesktop(page,EarlyInput);