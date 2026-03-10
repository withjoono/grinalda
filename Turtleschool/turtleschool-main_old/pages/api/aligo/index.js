import { Poll } from '@material-ui/icons';
import pool from '../../../lib/pool';
const aligoapi = require('aligoapi');

/*
    - title: 사용자 정보 수정
    - params:
{
  userName: '테스터',
  relationCode: '10',
  gradeCode: 'H1',
  school: '서울고등학교',
  cellphone: '010-2222-3333',
  email: 'master@ingipsy.com'
}
*/
var AuthData = {
  key: 's57p884xzitpi8966xdpdhhwl907pakf',
  // 이곳에 발급받으신 api key를 입력하세요
  user_id: 'withjuno',
  // 이곳에 userid를 입력하세요
}



export default  (req, res) => {
  console.log('req',req.body);
 
  var success = false;
  var msg = 'fail';
  let statusCode = 500;
  let data = -1;

  let phone_number = '';
  let auth_number =   '';


  switch (req.method) {

  
      
    case 'POST':
      
      switch (req.body.relationCode) {
       

        case 'sms_check':
          phone_number = req.body.cellphone;
          
          let arr = [];
          for(let i =0; i<6; i++){
            arr.push(Math.floor( ( Math.random() * 10 ) ));
          }
          auth_number =   arr.toString().replaceAll(',','');  // 인증번호 생성
          const column = [
            "'" + auth_number + "'",
            "'" + phone_number + "'" 
          ]

          const rows =  pool.query(
            "SELECT * FROM auth_sms WHERE phone_number = '" + phone_number + "'"
          ).then((result) => {

              if(result.rowCount > 0){
            
                pool.query(
                  "DELETE FROM auth_sms WHERE phone_number = '" + phone_number + "'"
                ).then((result)=> {

                  console.log('삭제완료',result);

                req.body = {
             
                  sender: '01058017139' , 
                  receiver:   phone_number ,
                  msg: 	  auth_number ,
                  msg_type: 'SMS'
                 
                }
                
                aligoapi.send(req, AuthData).then((r) => {console.log('r',r); }).catch((e) => {console.log(e,'e')})



                 
                    pool.query(
                      "INSERT INTO auth_sms (auth_number, phone_number) values (" + column + ")"
                    );
                   
                    success = true;
                    if (success) {
                      statusCode = 200;
                      msg = 'success';
                    }
                  
                            res.json({success: success, msg: msg, });
                            res.statusCode = statusCode;
                            res.end();
                })
              }else{
               
               pool.query(
                  "INSERT INTO auth_sms (auth_number, phone_number) values (" + column + ")"
                );
              
                success = true;
                if (success) {
                  statusCode = 200;
                  msg = 'success';
                }
              
                        res.json({success: success, msg: msg, });
                        res.statusCode = statusCode;
                        res.end();



              }
          })
          break;
          case 'sms_final_check':
          
           
            phone_number =  "'" + req.body.cellphone +  "'";
            auth_number =   "'" +req.body.auth_number+  "'";

            // console.log('query',"SELECT * FROM auth_sms WHERE phone_number = " + phone_number + " AND auth_number = " + auth_number);
          
  
            pool.query(
              "SELECT * FROM auth_sms WHERE phone_number = " + phone_number + " AND auth_number = " + auth_number
            ).then((result) => {
                
              console.log('result',result);
  
                if(result.rowCount > 0){
  
                  console.log('확인완료');
              
                  pool.query(
                    "DELETE FROM auth_sms WHERE phone_number = " + phone_number 
                  ).then((result)=> {
  
                    console.log('삭제완료, 인증확인',result);
                   
                      success = true;
                      if (success) {
                        statusCode = 200;
                        msg = 'success';
                      }
                    
                              res.json({success: success, msg: msg, });
                              res.statusCode = statusCode;
                              res.end();
                  })
                }else{
                  console.log('확인안됌');
                  success = false;
                  if (success) {
                    statusCode = 200;
                    msg = 'success';
                  }
                
                          res.json({success: success, msg: msg, });
                          res.statusCode = statusCode;
                          res.end();
                }
            })
            break;


      }
      
  }

 
};
