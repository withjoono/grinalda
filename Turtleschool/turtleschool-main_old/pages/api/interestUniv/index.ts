
import pool from '../../../lib/pool';




export default  (req, res) => {


  const loginInfo = JSON.parse(req.query.loginInfo);


    console.log('req : ', loginInfo.user[0]);
    let data = [];
    try{
        pool.query(
            "SELECT *  FROM useful where useful_user_id = '" + loginInfo.user[0] + "'"
        ).then((result) => {

            data = result.rows;
            console.log("data : ",data)
            console.log('조회 완료',result.rows);

            res.send({success : true, data : data, status : 'OK'});

           
        })
    }catch {
        res.send({success : false, status : 'false'});
    }

  
  



  
 
};
