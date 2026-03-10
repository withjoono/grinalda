import { Poll } from '@material-ui/icons';
import pool from '../../../lib/pool';





export default  (req, res) => {
  console.log('req',req.body);
 
  var success = false;
  var msg = 'fail';
  let statusCode = 500;
  let data = -1;

  let location = req.body.location;
  let searchText = req.body.searchText;
  



  switch (req.method) {

  
      
    case 'POST':
      

          const rows =  pool.query(
            "SELECT * FROM highschool_csv WHERE 학교명 LIKE '%" + searchText + "%' AND 학교종류명 LIKE '%고등%' AND 소재지명 LIKE '%" + location + "%' LIMIT 10"
          ).then((result) => {

              if(result.rowCount > 0){
                  console.log('result', result);
                  
                    success = true;
                    if (success) {
                      statusCode = 200;
                      msg = 'success';
                    }
                  
                            res.json({success: success, msg: msg, rows : result.rows });
                            res.statusCode = statusCode;
                            res.end();
                }else {

                }
              }
                
            )
              
              
          break;
        


      }
};
