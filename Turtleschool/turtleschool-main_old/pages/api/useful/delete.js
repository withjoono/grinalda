import { Poll } from '@material-ui/icons';
import pool from '../../../lib/pool';




export default  async (req, res) => {
    try{
      console.log("req.body.data : ",req.body.data)
      console.log('id', req.body.loginData);
        console.log('id', req.body.loginData.id);
        console.log('name', req.body.loginData.name.userName);
       

        const searchKeyword = `useful_user_info like '%${req.body.loginData.id}%' and useful_user_info like '%${req.body.loginData.name.userName}%' and useful_data like '%${JSON.stringify(req.body.data)}%'`
      
        await pool.query(
          "SELECT * FROM useful where " + searchKeyword 
        ).then((result) => {
            console.log("삭제로그 결과 : ",result)
          if(result.rowCount > 0){
           pool.query(
            "DELETE  FROM useful where " + searchKeyword 
          ).then((result) => {
            console.log('result',result);
            console.log('삭제완료');
          })
      
        }else{
      
        }
        })
      
        res.send({success : true, data : "OK"});
    }
    catch(e) {
        console.log("error : ",e)
        res.send({success: false})
    }

};
