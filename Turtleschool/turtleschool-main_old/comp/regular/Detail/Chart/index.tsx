import React, {useEffect, useState} from 'react';


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import dynamic from 'next/dynamic'



const DevChart =  (props) => {

  console.log('univ',props?.univ);
   const data = props?.univ;

   let 대학점수_70 = 0;
   let 대학점수_85 = 0;
   let 대학점수_100 = 0;
   
   
   if(data){
     대학점수_70 = Math.floor(data.대학점수_70 * 100) / 100;
    대학점수_85 = Math.floor(data.대학점수_85 * 100) / 100;
    대학점수_100 = Math.floor(data.대학점수_100 * 100) / 100;

   }

  
   


    const state : any = {
        series: [{
            name: '합격 컷',
            type: 'bar',
            data: [대학점수_70,대학점수_85,대학점수_100]
          }, {
            name: '내 점수',
            type: 'line',
            data: [data.내점수,data.내점수,data.내점수,]
          }],
          options: {
            chart: {
              height: 350,
              type: 'line',
            },
            // colors: ['#FF0000', '#00BFFF'],
            stroke: {
              width: [0, 4]
            },
            title: {
              text: '합격 예측'
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '30%',
                endingShape: 'rounded',
                
              },
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: ['70% 컷','85% 컷',  '100% 컷'],
            xaxis: {
              type: 'text'
            },
            yaxis: [{
              title: {
                text: '합격 컷',
              },
            
            }, {
              opposite: true,
              title: {
                text: '내 점수'
              }
            }]
          },
        
        
        };
        

      return (
        
             <Chart options={state.options} series={state.series} type="line" width={'100%'} height={320} />
        
       
      )
    
  }

  export default DevChart