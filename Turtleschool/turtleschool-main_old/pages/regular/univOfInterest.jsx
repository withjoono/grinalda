import {useRouter} from 'next/router';
import React, {useState,useEffect} from 'react';
import Component from '../../comp/regular/univOfInterest';
import SideNav from '../../comp/regular/sideNav';
import SideNavPage from '../../comp/template/SideNavPage';
import {getPagePath} from '../../src/utils/getPagePath';
import {usePayCheck} from '../../src/hooks/usePayCheck';
import axios from 'axios';
const ScoreInput = (props) => {


  const [isCanGoNextStep, setIsCanGoNextStep] = useState(false);
  const [univInterest, setUnivInterest] = useState({
    가 : {
     type : '가', data : []
    },
    나 : {
     type : '나', data : []
    },
    다 : {
     type : '다', data : []
    },
 
   });

   var loginData = {
    id : '',
    name : '',

  };
    let loginInfo = props?.loginInfo;
    let userScore = props?.userScore;
    
  
    loginData = {
       id : loginInfo.user[0],
       name : loginInfo.info[0],     
    }

   
   useEffect(()=> {
    if(univInterest){
      getInterestUniv();
    }
  
  },[])



   const getInterestUniv = async () =>{
    await axios
      .get('/api/interestUniv', {
        headers: {
          auth: loginInfo.user[0],
        },
        params: {
          loginInfo: loginInfo,
        }

      })
      .then( async res => {
        let gaArray = [];
        let naArray = [];
        let daArray = [];
        for(let i=0; i< res.data.data.length; i++){
          if(res.data.data[i].useful_type === '가'){
            gaArray.push(JSON.parse(res.data.data[i].useful_data))
          }else if(res.data.data[i].useful_type === '나'){
            naArray.push(JSON.parse(res.data.data[i].useful_data))
          }else if(res.data.data[i].useful_type === '다'){
            daArray.push(JSON.parse(res.data.data[i].useful_data))
          }else{
          }
        }

        await setUnivInterest({
          ...univInterest, 
          가 : {type : '가', data : gaArray },
          나 : {type : '나', data : naArray},
          다 : {type : '다', data : daArray}
        });

      

        
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const router = useRouter();


 

  const onClickGoBtn = () => {
    return isCanGoNextStep && router.push('/regular/earlyRegularStrategy');
  };

  const {isPayUser} = usePayCheck();
  if (!isPayUser) return <section></section>;

  return (
    <>
      <section>
        <SideNav />
        <Component
          key={univInterest}
          isScoreAndTypeSaved={isScoreAndTypeSaved => setIsCanGoNextStep(isScoreAndTypeSaved)}
          userScore={userScore}
          loginInfo={loginInfo}
          loginData={loginData}
      
          univInterest={univInterest}
          setUnivInterest={setUnivInterest}
        />
        <button
          onClick={()=>{router.push('/regular/mockApply')}}
          disabled={!isCanGoNextStep}
          className={isCanGoNextStep ? 'nextBtn' : 'nextBtn dim'}
        >
          바로 가기
        </button>
      </section>
      <style jsx>{`
        section {
          position: relative;
          padding: 5rem 5rem 0 16rem;
          min-height: 70vh;
        }
        .nextBtn {
          width: 8rem;
          height: 3rem;
          font-weight: bold;
          font-size: 0.75rem;
          line-height: 24px;
          background-color: #f2ce77;
          border-radius: 30px;
          color: #000000;
          margin: 0px auto 3rem;
          transform: translateX(-4rem);
          margin-top: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dim {
          background-color: #00000040;
          color: #00000080;
        }
        @media (max-width: 1024px) {
          section {
            padding: 1rem 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default ScoreInput;
