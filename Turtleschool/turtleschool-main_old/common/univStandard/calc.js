import 대학별기준 from "./대학별기준.json"
import 대학별최저점최고점 from "./대학별최저점최고점.json"
import 대학별작년경쟁률 from "./대학별작년경쟁률.json"
import { codeResionTable,codeNameTable,codeTable } from "../code";
import { NoStroller } from "@mui/icons-material";



const 문이과구분 = (myScore) => {

    let subject_type = [];

    for(let i =0; i < myScore.length; i++){
     
        Object.keys(codeNameTable).map((item,index) => {
          
          if(myScore[i].subject_a === item){
           
            myScore[i].subject_a = codeNameTable[item];
           
            Object.keys(codeTable.과목코드).map((item2,index2)=> {
              for(let j=0; j < codeTable.과목코드[item2].length; j++){
                if(item === codeTable.과목코드[item2][j]){
                  myScore[i].title = item2;
                }
              }
            })
          
          
          }

        })
      }
      for(let j=0; j<myScore.length; j++){
        if(myScore[j].subject_a === '미적' || myScore[j].title === '과탐'){
            subject_type.push(myScore[j].title);
        }

      }
      if(subject_type.length === 3){
        return '이과';

      }else {
        return '문과';
      }

}

const 교차지원_문이과구분 = (myScore) => {

  let subject_type = [];

  for(let i =0; i < myScore.length; i++){
   
      Object.keys(codeNameTable).map((item,index) => {
        
        if(myScore[i].subject_a === item){
         
          myScore[i].subject_a = codeNameTable[item];
         
          Object.keys(codeTable.과목코드).map((item2,index2)=> {
            for(let j=0; j < codeTable.과목코드[item2].length; j++){
              if(item === codeTable.과목코드[item2][j]){
                myScore[i].title = item2;
              }
            }
          })
        
        
        }

      })
    }
    for(let j=0; j<myScore.length; j++){
      if(myScore[j].subject_a === '미적' || myScore[j].title === '과탐'){
          subject_type.push(myScore[j].title);
      }

    }
    if(subject_type.length === 3){
      return '문과';

    }else {
      return '이과';
    }

}


const regionSearchUnivData = (subject_type, type,selectedRegions) => {
    let 지역 = selectedRegions;


   
    let 지역기준 = [];
    let regionResult = [];
    let result = [];

    for(let i=0; i<지역.length; i++){
        Object.keys(codeResionTable).map((item,index)=> {
            if(지역[i] === item){
                지역기준.push(codeResionTable[item]);
            }
        });

    }

    Object.keys(대학별기준).map((item,index) => {
       for(let i= 0; i<지역기준.length; i++){
            if(대학별기준[item].지역 === 지역기준[i] && 대학별기준[item].모집군 === type){
                regionResult.push(대학별기준[item]);
            }

       }
        
    });

   

    Object.keys(대학별최저점최고점[subject_type]).map((item,index) => {
       

       for(let i= 0; i<regionResult.length; i++){
            if(대학별최저점최고점[subject_type][item].대학명 === regionResult[i].대학교 && 대학별최저점최고점[subject_type][item].모집군 === type){
                
                        result.push({
                            대학명 : 대학별최저점최고점[subject_type][item].대학명, 
                            모집군 : 대학별최저점최고점[subject_type][item].모집군, 
                            max : Math.floor(대학별최저점최고점[subject_type][item].MAX * 100) / 100,
                            min : Math.floor(대학별최저점최고점[subject_type][item].MIN * 100) / 100, 
                        
                        
                        });
            }
        }

});

let final_data = _.uniqBy(result, "대학명");


    return final_data;
}


const regionSearchMajorData = (subject_type, type,selectedRegions,keyword) => {
  let 지역 = selectedRegions;

  let 지역기준 = [];
  let regionResult = [];
  let result = [];

  for(let i=0; i<지역.length; i++){
      Object.keys(codeResionTable).map((item,index)=> {
          if(지역[i] === item){
              지역기준.push(codeResionTable[item]);
          }
      });

  }

  Object.keys(대학별기준).map((item,index) => {
     for(let i= 0; i<지역기준.length; i++){
          if(대학별기준[item].지역 === 지역기준[i] && 대학별기준[item].모집군 === type && 대학별기준[item].모집단위.includes(keyword) === true && 대학별기준[item].계열 === subject_type){
              
            regionResult.push(대학별기준[item]);
          }

     }
      
  });

  let final_data = _.uniqBy(regionResult, "모집단위");

 
  return final_data;
}

const 학과검색최종데이터 = (subject_type, type,selectedRegions,keyword,major_array) => {
  let 지역 = selectedRegions;

  let 지역기준 = [];
  let regionResult = [];
  let result = [];

  for(let i=0; i<지역.length; i++){
      Object.keys(codeResionTable).map((item,index)=> {
          if(지역[i] === item){
              지역기준.push(codeResionTable[item]);
          }
      });

  }

  Object.keys(대학별기준).map((item,index) => {
     for(let i= 0; i<지역기준.length; i++){
          if(대학별기준[item].지역 === 지역기준[i] && 대학별기준[item].모집군 === type && 대학별기준[item].모집단위.includes(keyword) === true && 대학별기준[item].계열 === subject_type){
              
            regionResult.push(대학별기준[item]);
          }

     }
      
  });
  
  let final_data = [];
  if(major_array.length > 0){
  major_array.forEach((item, index) => {
    Object.keys(regionResult).map((item2,index2) => {
      if(regionResult[item2].모집단위 === item){
        final_data.push(regionResult[item2]);

      }
       
   });
      
        
  });
}else {
  final_data = [];
}
  



  

 
  return final_data;
}



const majorSearchUnivData = (subject_title,univName,type) => {
    let 대학명 = univName;
    let 문이과구분 = subject_title;
    let result = [];
   
    Object.keys(대학별기준).map((item,index) => {
            
            if(대학별기준[item].대학교 === 대학명 && 대학별기준[item].계열 === subject_title && 대학별기준[item].모집군 === type){
                result.push(대학별기준[item]);
            }

       
        
    });

    

    return result;
}

const majorDiffSearchUnivData = (subject_title,type,모집단위) => {
 
  let 문이과구분 = subject_title;
  let result = [];
 
  Object.keys(대학별기준).map((item,index) => {
          
          if(대학별기준[item].계열 === subject_title && 대학별기준[item].모집군 === type && 대학별기준[item].모집단위 === 모집단위){
              result.push(대학별기준[item]);
          }

     
      
  });

 

  return result;
}

const 상세보기_변환 = (유형, 대학교,모집군,모집단위) => {
   
  let data = 0;


  
  Object.keys(대학별작년경쟁률).map((item,index) => {
   
    if(대학별작년경쟁률[item].대학명 === 대학교 && 대학별작년경쟁률[item].모집군 === 모집군 && 대학별작년경쟁률[item].모집단위 === 모집단위){
        
      if(대학별작년경쟁률[item].hasOwnProperty(유형) === true){
        
        data =  대학별작년경쟁률[item][유형];
      }else{
        data = '-';
      }
      
      
      
      
    
      
      
       
     
     
    }

  })
  return data;

}


export {regionSearchUnivData,majorSearchUnivData,문이과구분,regionSearchMajorData,학과검색최종데이터,교차지원_문이과구분,상세보기_변환,majorDiffSearchUnivData }