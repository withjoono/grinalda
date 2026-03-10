import { Poll } from '@material-ui/icons';
import pool from '../../../lib/pool';




export default  async (req, res) => {
  console.log('id', req.body.loginData.id);
  console.log('name', req.body.loginData.name.userName);
  
  const searchKeyword = `useful_user_info like '%${req.body.loginData.id}%' and useful_user_info like '%${req.body.loginData.name.userName}%'`


  
  // await pool.query(
  //   "SELECT * FROM useful where " + searchKeyword 
  // ).then((result) => {
  //   if(result.rowCount > 0){
  //    pool.query(
  //     "DELETE  FROM useful where " + searchKeyword 
  //   ).then((result) => {
  //     console.log('result',result);
  //     console.log('삭제완료');
  //   })

  // }else{

  // }
  // }
   
  // ); 
  console.log('req.body.data',req.body.data);
  console.log('req.body.loginData' , req.body.loginData);
  

  
  const column = [
    "'" + JSON.stringify(req.body.data) + "'" ,
    "'" + JSON.stringify(req.body.loginData) + "'",
   
  ]

  var success = false;
  var msg = 'fail';
  let statusCode = 500;

  console.log('column',column); 
 
  await  pool.query(
    "INSERT INTO useful (useful_user_id,useful_type,useful_data,useful_user_info) values ('" + req.body.loginData.id + "', '" + req.body.data.모집군 + "', " + column + ")"
  );
  

  res.send({success : true, data : 'OK'});
 
};
