import { Poll } from '@material-ui/icons';
import pool from '../../../lib/pool';




export default   (req, res) => {
  console.log('id', req.body.loginData.id);
  console.log('name', req.body.loginData.name.userName);
  console.log('type : ', req.body.type.length)
  
  const searchKeyword = `useful_user_id like '%${req.body.loginData.id}%' and useful_type like '%${req.body.type}%'`


  
  pool.query(
    "SELECT * FROM useful where " + searchKeyword 
  ).then((result) => {
    console.log("result : ",result)
    if(result.rowCount > 0){
        res.send({success : true, data : result.rows});

  }else{
    res.send({success : false, data : []});
  }
  }
   
  ); 
 
};
