import {mainData} from "../subjectCalc/calc";

import 유불리계산 from "../univStandard/유불리계산.json";
import 유불리환산식 from "../univStandard/유불리환산식.json";




const 내성적계산 = (title,type,userScore) => {

  
    

    let schoolData = {
      학교 : title,
      이문과 : type,
      국어: { 과목: "", 표준점수: 0 }, // not null
      수학: { 과목: "", 표준점수: 0 }, // not null
      영어: { 과목: "", 표준점수: 0 }, // not null
      한국사: { 과목: "", 표준점수: 0 }, // nullable
      과탐1: { 과목: "", 표준점수: 0 }, // nullable 없으면 사탐1
      과탐2: { 과목: "", 표준점수: 0 }, // nullable 없으면 사탐2
      사탐1: { 과목: "", 표준점수: 0 }, // nullable 없으면 과탐1 
      사탐2: { 과목: "", 표준점수: 0 }, // nullable 없으면 과탐2
      제2외국어: { 과목: "", 표준점수: 0} // nullable
    };

    let myData = {
      내점수 : 0,
      퍼센트순위 : 0,
      표점합 : 0,
     };
  

   
  
   if(userScore){
    for(let i = 0;  i< userScore.length; i++){
      
       
            if(userScore[i].title === '국어' || userScore[i].title === '수학' ){
             

              schoolData[userScore[i].title].과목 = userScore[i].subject_a;
              schoolData[userScore[i].title].표준점수 = parseInt(userScore[i].standardscore);
            }
            if(userScore[i].title === '사탐'){
             
              
             
              if(schoolData.사탐1.과목 === ''){
                schoolData.사탐1.과목 = userScore[i].subject_a;
                schoolData.사탐1.표준점수 = parseInt(userScore[i].standardscore);
              }else {
                schoolData.사탐2.과목 = userScore[i].subject_a;
                schoolData.사탐2.표준점수 = parseInt(userScore[i].standardscore);

              }
            }
            if(userScore[i].title === '과탐'){
        
              
    
              if(schoolData.과탐1.과목 === ''){
                schoolData.과탐1.과목 = userScore[i].subject_a;
                schoolData.과탐1.표준점수 = parseInt(userScore[i].standardscore);
              }else {
                schoolData.과탐2.과목 = userScore[i].subject_a;
                schoolData.과탐2.표준점수 = parseInt(userScore[i].standardscore);
              }
            }
            if(userScore[i].title === '영어' || userScore[i].title === '한국사' || userScore[i].title === '제2외국어'){
              
              
              schoolData[userScore[i].title].과목 = userScore[i].subject_a;
              schoolData[userScore[i].title].표준점수 = parseInt(userScore[i].grade);
           
            } 
          
    }



   }

   Object.keys(schoolData).map((item,index)=> {
    if(item !== '학교' &&  item !== '이문과' && schoolData[item].과목 === ''){
      delete schoolData[item];

    }
    else {          
    }
 });



  
   if(mainData({...schoolData}).success === true){
    myData.내점수 = mainData({...schoolData}).내점수;
    myData.퍼센트순위 = mainData({...schoolData}).퍼센트순위;
    Object.keys(schoolData).map((item,index)=> {
      if(item === '국어' || item === '수학' || item === '사탐1' || item === '사탐2' || item === '과탐1' || item === '과탐2'){
        
        myData.표점합 = myData.표점합 + schoolData[item].표준점수;
      }else{

      }
    
    });
   }else {
    myData.내점수 = 0;
    myData.퍼센트순위 = 100;
   }

   return myData
  }


  const 평균대학점수계산 = (title,type,score) => {
   
    let data = 0;
    Object.keys(유불리계산).map((item,index) => {
      if(유불리계산[item].표점합 === score){
       
        data =  Math.floor(유불리계산[item][title+" "+type] * 100) / 100
      }

    })

    return data;

    
  }

  const 평균대학누백계산 = (title,type,score) => {
    
    let data = 0;
    Object.keys(유불리계산).map((item,index) => {
      if(유불리계산[item].표점합 === score){
        
        data =  유불리계산[item].누백;
      }

    })

    return data;

    
  }

  const 유불리_점수통일 = (title,type) => {
   
    let data = 0;
    Object.keys(유불리환산식).map((item,index) => {
      if(유불리환산식[item].대학계산식인자 === title+" "+type){
        
      
        data =  유불리환산식[item].배율;
      }

    })

    return data;

    
  }
  const 유불리_대학총점계산 = (title,type) => {
   
    let data = 0;
    Object.keys(유불리환산식).map((item,index) => {
     
      if(유불리환산식[item].대학계산식인자 === title+" "+type){
        
       
        data =  유불리환산식[item].대학총점;
      }

    })

    return data;

    
  }




  export {내성적계산,평균대학점수계산,평균대학누백계산,유불리_점수통일,유불리_대학총점계산}