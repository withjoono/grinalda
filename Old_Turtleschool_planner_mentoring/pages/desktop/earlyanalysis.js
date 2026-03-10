import Menu from '../../comp/susimenu'
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {useState, useEffect} from 'react'
import axios from 'axios'
import withPayment from '../../comp/paymentwrapper'
import useZnaesin from '../../comp/znaesin'
const Analysis = () => {

	const [btn, setBtn] = useState(1)
	const [chosen, setChosen] = useState(1)
	const {
		gpaAsk, setgpaAsk,  chartTwo,  setchartTwo,  radio,  setRadio,  check,  checkBlue,  checkRed
	} = useZnaesin()
	

	const zNaesin = (
		<>
			<style jsx>{`
				*{
            margin:0px;
            padding:0px;
            font-family: "Noto Sans CJK KR";
        }
        li {
            list-style: none;
        }

        a {
            text-decoration: none;
        }
        body{
            width:100%;
        }
    </style>
    <style>
        .contain{
            width:1280px;
            margin:auto;
        }
        .table h1{
            font-size:30px
        }
        .border{
            width:1280px;
            height:540px;
            border:1px #9D9D9D solid;
            border-radius: 20px;
        }
        .border table{
            font-size:18px;
            font-weight: bold;
            text-align: center;
            width:1220px;
            margin:auto;
            border-collapse: collapse;
            margin-top:30px;
            border-top:1px #363636 solid;
        }
        .border table tr td{
            height:80px;
            width:137.5px;
            border-bottom: 1px #CBCBCB solid;
            border-right: 1px #CBCBCB solid;
        }
        .border table tr td:nth-of-type(1),
        .border table tr:nth-of-type(1) td{
            background-color: #F6F6F6;
           
        }
        .border table tr td:nth-of-type(5)
        {
            background-color: #FFE8E8;
        }
        .border table tr td:nth-of-type(6){
            background-color: #E8F3FF;
        }
        .border table tr:nth-of-type(1) td:nth-of-type(5)
        {
         background-color: #FFD5D5;
        }
        .border table tr:nth-of-type(1) td:nth-of-type(6)
        {
         background-color: #D5E8FF;
        }
		.graph{
            width:1280px;
            margin:40px auto;
        }
        .graph h1{
            font-size:30px;
            font-weight: bold;
        }
        .graph .border{
            width:1280px;
            height:540px;
            border:1px #9D9D9D solid;
            margin-top:10px;
			padding: 30px 45px;
			color: #9D9D9D;
        }
			`}</style>
			 <div className="contain">
        <div className="table">
            <h1>나의 내신 z점수</h1>
            <div className="border">
                <table>
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
								<td>{obj['grade2']}%</td>
								<td>{obj['grade3']}</td>
								<td>{obj['grade4']}%</td>
								<td>{obj['grade5']}</td>
								<td>{obj['grade6']}</td>
							</tr>
							)
						})
					}
				</tbody>
                </table>
            </div>
        </div>
        <div className="graph">
            <h1>내신 반영 방식</h1>
            <div className="border">
				{/*
				<input type="checkbox" onChange={changetest} name='chk_gubun1' title='내신 등급 평균'  width='30' height='30'/>
				<input type="checkbox" name='chk_gubun2' title='Z내신 등급 평균' width='30' height='30'/>
				*/}
				<span>{checkBlue}내신 등급 평균
				{checkRed} Z내신 등급 평균 <span style={{fontSize:'10px'}}>(연대 기준)</span></span>                
                <HighchartsReact highcharts={Highcharts} options={chartTwo} allowChartUpdate={true} />
            </div>
        </div>
    </div>
		</>
	)

	return (
		<>
		<style jsx>{`
			.f {
				height: 80px;
				display: flex;
				align-items: flex-end;
			}
			.f > div {
				flex: 1 0 0;
				border-radius: 20px 20px 0 0;
				border: 1px solid #9D9D9D;
				-webkit-text-stroke: 1px;
				font-size: 28px;
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.d {
				height: 80px;
				background-color: white;
				border-bottom: 0 !important;
			}
			.e {
				height: 60px;
				background-color: #E8E8E8;
				color: #9D9D9D;
			}
			div.e:nth-of-type(1) {
				border-radius: 20px 0 0 0;
			}
			div.e:nth-of-type(2) {
				border-radius: 0 20px 0 0;
			}
			
		`}</style>
		<Menu index={1} title='성적분석' />
		<div style={{width:'1280px', margin:'0 auto'}}>
			<div className='menu'>
				<button className={btn == 0 ? 'menu_active' : ''} /*\\onClick={() => setBtn(0)}*/>내신 등급 평균</button>
				<button className={btn == 1 ? 'menu_active' : ''} onClick={() => setBtn(1)}>내신 Z점수</button>
			</div>
			{ btn == 0 ? <>
			<div className='desktop_box' style={{width:'100%'}}>
				<table className='desktop_box_table'>
					<tr>
						<th>전교과</th>
						<th>국영수사</th>
						<th>국영수과</th>
						<th><p style={{lineHeight:'initial'}}>국영수사<br/>+통합과학,통합사회</p></th>
						<th><p style={{lineHeight:'initial'}}>국영수과<br/>+통합과학,통합사회</p></th>
						<th>국영수사과</th>
						<th>국영수</th>
					</tr>
					<tr>
						<td>1등급</td>
						<td>1등급</td>
						<td>1등급</td>
						<td>1등급</td>
						<td>1등급</td>
						<td>1등급</td>
						<td>1등급</td>
					</tr>
				</table>
			</div>
			<div className='title_left' style={{marginTop:'30px'}}>학기별 내신</div>
			<div className='desktop_box' style={{width:'100%', height:'580px'}}>
				<HighchartsReact highcharts={Highcharts} options={chartOptions}/>
			</div>
			<div className='title_left' style={{marginTop:'30px'}}>과목별/조합별 성적 변동 추이</div>
			<div className='f'>
				<div className='d'>
					과목별
				</div>
				<div className='e'>
					조합별
				</div>
			</div>
			<div className='desktop_box' style={{width:'100%', height:'649px',paddingTop:0,borderTop:0,borderRadius:'0 0 20px 20px'}}>
				<HighchartsReact highcharts={Highcharts} options={chartOptions}/>
			</div></>
			: zNaesin }
			
		</div>
		</>
	)

}

export default withPayment(Analysis,null,'수시');