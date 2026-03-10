import React, {useEffect, useState} from 'react';


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import dynamic from 'next/dynamic'



const DiffrentUnivChart =  (props) => {
  const data = props?.data;
  const myScore = props?.myScore;
   

  let my_score = [];
  let univ_score = [];
  
  let univ_labels = [];

  if(data.length > 0){
   for(let i=0; i < data.length; i++){
     my_score.push(myScore);
     univ_score.push(Math.floor(data[i].대학점수_85 * 100) / 100);
     univ_labels.push(data[i].대학교+' '+data[i].모집단위);
    }
  }

  console.log(my_score);
  console.log(univ_score);
  console.log(univ_labels);
  
  
   
  var state : any = {
    series: [
        {
          name: "내 점수",
          data: my_score.length > 0 && my_score,
        },
        {
          name: "대학 컷",
          data: data.length > 0 && univ_score,
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
          categories: data && univ_labels,
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
        
        <Chart options={state.options} series={state.series} type="line" width={'100%'} height={320} />
        
       
      )
    
  }

  export default DiffrentUnivChart