
import pool from '../../../../lib/pool';




export default  (req, res) => {
  // console.log('id', req.body);

  const state = req.body.state;
  const code = req.body.code;
  const loginData = req.body.loginData;
// division, area, subject, standard_score,percentage_score,grade
  let obj_data = {
    kor : {division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    mat : {division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    res1 : {division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    res2 : {division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    for : {division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    korHistory :{division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    eng : {division : '1', standard : '0',percent : '0', grade : '0', year : '2022', subject : '',cumulative : '' },
    
  }

  pool.query(
    "DELETE  FROM csatidscore where memberid = '" + loginData.id + "'"
  ).then((result) => {
    console.log('삭제완료',result);
  })


  Object.keys(state).map((item, index) => {

    Object.keys(code).map((item2, index2) => {
        
      if(item === 'kor' || item === 'mat' || item === 'res1' || item === 'res2'){ // 언,수,탐구1,2일때
        if(item === item2){
           

            pool.query(

              "SELECT * FROM csatsspu_1 where standard_score = '" + state[item].standard +
              "' AND subject = '" + code[item2] + "' AND year = '2022' limit 1 "
            ).then((result) => {
            
                let rows = result.rows[0];
                Object.keys(obj_data).map((item3,index3) => {
                  if(item === item3){
                    obj_data[item3].standard = rows?.standard_score;
                    obj_data[item3].percent = rows?.percentage_score;
                    obj_data[item3].grade = rows?.rating_score;
                    obj_data[item3].cumulative = rows?.cumulative;
                   
                    obj_data[item3].subject = rows?.subject;


                        let column = [
                      
                        "'" + obj_data[item3].division  + "'",
                        obj_data[item3].standard  ,
                        obj_data[item3].percent ,
                        obj_data[item3].grade ,
                        "'" + obj_data[item3].year  + "'",
                        "'" + obj_data[item3].subject  + "'",
                        obj_data[item3].cumulative  ,
                       
                        "'Y'",
                        "'" +loginData.id + "'",
                      ] 
                      pool.query(
                        "INSERT INTO csatidscore (division,standardscore,percentage,grade,year,subject_a,cumulative,useyn,memberid) values (" + column + ")"
                      );


                    
                  }else {

                  }
                })
            })
          }

          
      }else{ // 외국어,한국사,제2외국어일때



        if(item === item2){
           

          pool.query(

            "SELECT * FROM csatsspu_1 where rating_score = '" + state[item].grade +
            "' AND subject = '" + code[item2] + "' AND year = '2022' limit 1 "
          ).then((result) => {
          
              let rows = result.rows[0];
              Object.keys(obj_data).map((item3,index3) => {
                if(item === item3){
                  obj_data[item3].standard = rows?.standard_score;
                  obj_data[item3].percent = rows?.percentage_score;
                  obj_data[item3].grade = state[item].grade;
                  obj_data[item3].cumulative = rows?.cumulative;
                 
                  obj_data[item3].subject = rows?.subject;


                      let column = [
                    
                      "'" + obj_data[item3].division  + "'",
                      obj_data[item3].standard  ,
                      obj_data[item3].percent ,
                      obj_data[item3].grade ,
                      "'" + obj_data[item3].year  + "'",
                      "'" + obj_data[item3].subject  + "'",
                      obj_data[item3].cumulative  ,
                     
                      "'Y'",
                      "'" +loginData.id + "'",
                    ] 
                    pool.query(
                      "INSERT INTO csatidscore (division,standardscore,percentage,grade,year,subject_a,cumulative,useyn,memberid) values (" + column + ")"
                    );


                  
                }else {

                }
              })
          })
        }


       
      }
    });
  } 
  );
  



  res.send({success : true, data : 'OK'});
 
};
