import React, { useEffect,useState } from 'react';

import {Slide, Box, AppBar,Toolbar,IconButton, TextField, Grid, Button, InputBase, Dialog,DialogTitle,    DialogActions, DialogContent, DialogContentText} from '@mui/material';

import axios from 'axios';
import styled from 'styled-components';

import SearchIcon from '@mui/icons-material/Search';









const GraduateBox = styled.input`
  border: 1px #c2c2c2 solid;
  width: 100%;
  height: 44px;
  text-align-last: left;
  margin-top: 4px;
  font-size: 16px;
  padding: 10px 0px 10px 12px;
`;



export default function HighSchool(props) {

  


  const [dataArray,setDataArray] = useState('');
  

  useEffect(()=>{

    refreshListHandler()
    
   
  },[])

  const refreshListHandler = async() => {
    await axios.post(
        '/api/highschool_search',
        {
          location: props.location,
          searchText : props.searchText,
     
        },
        {
          headers: {
            auth: localStorage.getItem('realuid'),
          },
        },
      ).then((res) => {
          console.log('res',res.data.rows);
          setDataArray(res.data.rows);
      })
      

  }

  const highSchoolOpenHandler = () => {
   
    props.setHighSchoolOpen(true);


  }
  const highSchoolCloseHandler = () => {
   
    props.setHighSchoolOpen(false);
  }
    
  const textChangeHandler = (e) => {
    props.setSearchText(e.target.value);
  }
  const searchHandler = (e) => {
    refreshListHandler();
  }
  const selectHighSchoolHandler = (param) => {
    props.setHighSchoolData(param);
    props.setHighSchoolOpen(false);
  }
  
  return (
    <>  

     
        <GraduateBox 
         readOnly={true}
         type="text" value={props.highSchoolData} 
        // onChange={(e) => props.setHighSchoolData(e.target.value)} 
         onClick={(e) => props.location !== '' ? highSchoolOpenHandler() : alert('지역을 선택해주세요.')}
         
        />
       <Dialog
        open={props.highSchoolOpen}
        // TransitionComponent={Transition}
        keepMounted
        onClose={highSchoolCloseHandler}
        aria-describedby="alert-dialog-slide-description"
      >
          <DialogTitle>학교 정보</DialogTitle>
          <Grid container>
                <TextField 
                  style={{width : '60%', marginLeft : 10, marginRight : 10 }}
                  variant='outlined' 
                  name='searchText'
                  value={props.searchText} 
                  onChange={(e) => textChangeHandler(e)}
                />
                <Button style={{width : '30%', marginRight : 10,}}  variant='contained'   onClick={(e) => searchHandler(e)}>검색</Button>
          </Grid>
          <DialogContent>
            <table>
              <tr>
                <td>학교명</td>
              </tr>
              <Grid container>
              {dataArray.length > 0 ? 
                
                dataArray.map((item,index) => {
                  return (
                  
                      <Grid key={index} item xs={6}>
                           <Button style={{margin : '5px 5px 5px 5px'}} variant ='outlined' onClick={(e)=> selectHighSchoolHandler(item.학교명)}>{item.학교명}</Button>
                      </Grid>
                    
                  );

                })

               
                

              
              : '데이터가 없습니다.'}
             </Grid>
              
            </table>
          </DialogContent>
          <DialogActions>
       
          </DialogActions>
        </Dialog>

    </>
  );
};


