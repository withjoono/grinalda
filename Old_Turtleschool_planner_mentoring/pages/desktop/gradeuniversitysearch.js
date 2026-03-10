import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from 'highcharts/highcharts-more'
import Menu from '../../comp/naesinmenu'
import {useRef,useEffect,useState} from 'react'
if (typeof Highcharts === 'object') {
	HighchartsMore(Highcharts)
}

const UniversitySearch = () => {
	
	const chartOptions = {
		series: [{
				name: 'Temperatures',
				data: [
					[-9.9, 10.3],
					[-8.6, 8.5],
					[-10.2, 11.8],
					[-1.7, 12.2],
					[-0.6, 23.1],
					[3.7, 25.4],
					[6.0, 26.2],
					[6.7, 21.4],
					[3.5, 19.5],
					[-1.3, 16.0],
					[-8.7, 9.4],
					[-9.0, 8.6]
				]
			}],
		chart: {
			marginTop:'25',
			height:'600',
			type:'columnrange'
		},
		xAxis: {
			categories: ['가톨릭대','건국데','경희대','경희대','경희대','경희대','경희대'],
			title: null,
			labels: {
				style: {
					fontSize: '15px',
				}
			}
		},
		yAxis: {
			gridLineWidth: 0,
			title: {
				text:'등급',
				align:'high',
				offset:0,
				rotation:0,
				y: -10,
				style: {
					fontSize: '15px'
				}
			},
			labels: {
				style: {
					fontSize: '15px',
				}
			},
			reversed: true
		},
		title: {
			text: null
		}
		
	}
	
	return(
		<>
			<Menu index={4} title='대학/학과 검색' />
			<div style={{width:'1280px', margin:'0 auto'}}>
				<div className='menu'>
					<button className='menu_active'>교과 전형</button>
					<button >학생부 종합 전형</button>
					<button >논술 전형</button>
				</div>
				<HighchartsReact highcharts={Highcharts} options={chartOptions}/>
			</div>
		</>
	)
}

export default UniversitySearch