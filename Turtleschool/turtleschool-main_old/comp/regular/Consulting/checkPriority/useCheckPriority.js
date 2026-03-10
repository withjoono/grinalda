import { ConstructionOutlined } from '@mui/icons-material';
import {useState} from 'react';
import axios from 'axios';
export const useCheckPriority = (selectedUniv, loginData) => {
  const [filteredUniv, setFilteredUniv] = useState(
    Object.values(selectedUniv).sort((a, b) => Number(b.acceptancerank) - Number(a.acceptancerank)),
  );




  const [analysisUniv, setAnalysisUniv] = useState([]);

  const onClickAnaylsisBtn = async (univ) => {


    const _analysisUniv = [...analysisUniv];
    await _analysisUniv.push(univ);
    
    
    await setAnalysisUniv([...new Set(_analysisUniv)]);

  


    await grade_insert(univ);
  };

  const onClickAnaylsisAllBtn = async (univs) => {


    const _analysisUniv = [...analysisUniv];
      for(let i =0; i< univs.length; i++){
        await _analysisUniv.push(univs[i]);
        await grade_insert(univs[i]);
      }

    await setAnalysisUniv([...new Set(_analysisUniv)]);
  };
  


  // 분석내용 저장 쿼리
  const grade_insert =  (usefulData) => {
    axios.post(
      '/api/useful',
      {
        loginData: loginData,
        data : usefulData,
      },
      {
        headers: {
          auth: localStorage.getItem('realuid'),
        },
      },
    ).then(res => {
      console.log(res);
      if(res.data.success === true){
       
        
      }else { 
        return alert('유불리 분석에 실패했습니다. 재시도해주십시오.');
      }
    })
};

// 삭제
const grade_delete = async (_analysisUniv) => {
  return await axios.post(
    '/api/useful/delete',
    {
      loginData: loginData,
      data : _analysisUniv,
    },
    {
      headers: {
        auth: localStorage.getItem('realuid'),
      },
    },
  ).then(res => {
    if(res.data.success === true){
      return alert('삭제했습니다.');
      
    }else { 
      return alert('유불리 분석에 실패했습니다. 재시도해주십시오.');
    }
  })
}




  const onClickDelBtn = async (index, type) => {
    const _filteredUniv = [...filteredUniv];
    console.log('type : ', type);
    if (type === 'anaylsis') {
      const _analysisUniv = [...analysisUniv];
      _analysisUniv.splice(index, 1);
      setAnalysisUniv(_analysisUniv);

      filteredUniv.map((item,index2) => {
        if(item === analysisUniv[index]) {
          _filteredUniv.splice(index2, 1);
        }
      })
      
      await grade_delete(analysisUniv[index]);

      
     
    } else {
      _filteredUniv.splice(index, 1);
      setFilteredUniv(_filteredUniv);
    }
  };

  const onClickSaveBtn = () => {
    alert('관심대학 저장은 유불리지수 계산후 저장할 수 있습니다.');
  };

  return {
    filteredUniv,
    setFilteredUniv,
    analysisUniv,
    setAnalysisUniv,
    onClickAnaylsisBtn,
    onClickDelBtn,
    onClickSaveBtn,
    onClickAnaylsisAllBtn,
  };
};
