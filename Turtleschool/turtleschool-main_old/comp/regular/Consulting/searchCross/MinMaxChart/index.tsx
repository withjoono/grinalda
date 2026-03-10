import React, {useEffect, useState} from 'react';


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import dynamic from 'next/dynamic'



const MinMaxChart =  (props) => {
  
    const data = props?.data;
    const result = props?.result;
    



   
    
    
    const state : any = {
      series: [{
        data: [400, 430, 448, 470, 540, 580, 690]
      }],
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        annotations: {
          xaxis: [{
            x: 500,
            borderColor: '#00E396',
            label: {
              borderColor: '#00E396',
              style: {
                color: '#fff',
                background: '#00E396',
              },
              text: 'X annotation',
            }
          }],
          yaxis: [{
            y: 'July',
            y2: 'September',
            label: {
              text: 'Y annotation'
            }
          }]
        },
        plotOptions: {
          bar: {
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: true
        },
        xaxis: {
          categories: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        yaxis: {
          reversed: true,
          axisTicks: {
            show: true
          }
        }
      },
    
    
    };
  

        

      return (
        
             <Chart options={state.options} series={state.series} type="bar" width={'100%'} height={320} />
        
       
      )
    
  }

  export default MinMaxChart;