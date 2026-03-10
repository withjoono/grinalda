import React, {useEffect, useState} from 'react';


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import dynamic from 'next/dynamic'



const DevChart =  (props) => {
  
    const data = props?.data;
   
    
  
 
    
    
   let my_score = [];

   if(data.datasets[1].data.length > 0){
    for(let i=0; i < data.datasets[1].data.length; i++){
      my_score.push(Math.floor(data.datasets[0].data[i]?.내점수 * 100) / 100);
  
     }
   }

   
    
    
    var state : any = {
        series: [
            {
              name: "내 점수",
              data: my_score.length > 0 && my_score,
            },
            {
              name: "대학 컷",
              data: data.datasets[1].data.length > 0 && data.datasets[1].data,
            }
          ],
          options: {
            chart: {
              height: 350,
              type: 'line',
              dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.2
              },
              toolbar: {
                show: false
              }
            },
            colors: ['#77B6EA', '#545454'],
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: 'smooth'
            },
            title: {
              text: '학과별 합격컷 그래프',
              align: 'left'
            },
            grid: {
              borderColor: '#e7e7e7',
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            markers: {
              size: 1
            },
            xaxis: {
              categories: data && data.labels,
              title: {
                text: 'Month'
              }
            },
            yaxis: {
              title: {
                text: '내점수'
              },
             
            },
            legend: {
              position: 'top',
              horizontalAlign: 'right',
              floating: true,
              offsetY: -25,
              offsetX: -5
            }
          },
        
        
        };
        

      return (
        <>
          {data && 
             <Chart options={state.options} series={state.series} type="line" width={'100%'} height={320} />
          }
        </>
       
      )
    
  }

  export default DevChart