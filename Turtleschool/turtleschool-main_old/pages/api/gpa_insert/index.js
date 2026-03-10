import { Poll } from '@material-ui/icons';
import pool from '../../../lib/pool';




export default  (req, res) => {
  console.log('id', req.body.loginData.id);
  console.log('name', req.body.loginData.name.userName);
  
  const searchKeyword = `user_info like '%${req.body.loginData.id}%' and user_info like '%${req.body.loginData.name.userName}%'`


  
  pool.query(
    "SELECT * FROM gpa where " + searchKeyword 
  ).then((result) => {
    if(result.rowCount > 0){
    pool.query(
      "DELETE  FROM gpa where " + searchKeyword 
    ).then((result) => {
      console.log('삭제완료');
    })

  }else{

  }
  }
   
  ); 

  
  const column = [
    "'" + JSON.stringify(req.body.htmlState).replaceAll("'",'') + "'",
    "'" + JSON.stringify(req.body.loginData) + "'",
    "'" +  new Date('YYYY-MM-DD').toLocaleDateString()+ "'",    
  ]

  
  
  
  var success = false;
  var msg = 'fail';
  let statusCode = 500;


  pool.query(
    "INSERT INTO gpa (grade_data,user_info, created) values (" + column + ")"
  );

  res.send({success : true, data : 'OK'});
 
};
