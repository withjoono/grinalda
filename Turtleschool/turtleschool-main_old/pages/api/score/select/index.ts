
import pool from '../../../../lib/pool';




export default  (req, res) => {
  // console.log('id', req.body);

  const state = req.body.state;
  const code = req.body.code;
  const loginData = JSON.parse(req.query.loginData);


    console.log('req : ', loginData.user[0]);
 let data = [];
    try{
        pool.query(
            "SELECT *  FROM csatidscore where memberid = '" + loginData.user[0] + "'"
        ).then((result) => {

            data = result.rows;
            console.log('조회 완료',result.rows);

            res.send({success : true, data : data, status : 'OK'});

           
        })
    }catch {
        res.send({success : false, status : 'false'});
    }

  
  



  
 
};
