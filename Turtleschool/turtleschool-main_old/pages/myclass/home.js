import axios from 'axios';
import React, {useEffect, useState} from 'react';
import withPayment from '../../comp/paymentwrapper';
import withDesktop from '../../comp/withdesktop';
import page from './homeapp';
import Btn from './myclass_btn';

const Home = () => {
  const [mentors, setMentors] = useState([]);
  const [notice, setNotice] = useState([]); //1.공지사항
  const [oprtnPrncp, setOprtnPrncp] = useState([]); //2.운영원칙

  useEffect(() => {
    axios
      .get('/api/planner/planners', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          dvsn: null,
        },
      })
      .then(res => {
        setMentors(res.data.data);
      });

    getNotice();
  }, []);

  const getNotice = e => {
    axios
      .get('/api/planner/notice', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          plnerid: null,
          cls: null,
        },
      })
      .then(res => {
        //setNotice(res.data.data.filter(o => o.dvsn == "1")); //1.공지사항 API 데이터 가져오기
        //setOprtnPrncp(res.data.data.filter(o => o.dvsn == "2")); //2.운영원칙 API 데이터 가져오기
      });
  };

  return (
    <div className="contaner">
      <style jsx>{`
        * {
          margin: 0px;

          padding: 0px;
        }
        li {
          list-style: none;
        }
        a {
          text-decoration: none;
        }
        h1 {
          font-size: 30px;
        }
        .contaner {
          width: 100%;
          height: 1708px;
        }
        .main {
          height: 100.5px;
        }
        .header {
          background-color: #fcbf77;
          height: 300px;
        }
        .header h1 {
          color: #ffffff;
          text-align: center;
          line-height: 300px;
          font-size: 36px;
          height: 230px;
        }

        .content {
          margin: 40px auto;
          width: 1280px;
          height: 989px;
        }
        .box {
          position: relative;
          width: 600px;
          box-sizing: border-box;
          border: 1px black solid;
          border-radius: 20px;
          overflow: auto;
          margin-top: 12px;
          display: flex;
          padding: 20px;
        }
        .picture {
          width: 152px;
          height: 150px;
        }
        .picture .img {
          width: 152px;
          height: 150px;
        }
        .box p {
          position: absolute;
          color: #9d9d9d;
          font-size: 18px;
        }
        .box p:nth-of-type(1) {
          left: 236px;
          top: 46px;
        }
        .box p:nth-of-type(2) {
          left: 770px;
          top: 46px;
        }
        .imformation {
          margin-top: 10px;
          width: 1280px;
        }

        .notice {
          width: 1280px;
          height: 468px;
          position: relative;
          float: left;
        }
        .notice p {
          position: absolute;
          right: 0;
          top: 5px;
          font-size: 24px;
        }
        .imformation ul {
          font-size: 18px;
        }
        .notice ul {
          width: 1280px;
          height: 468px;
          box-sizing: border-box;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .notice li {
          margin-top: 28px;
          margin-left: 49px;
        }
        .operation {
          width: 620px;
          height: 467px;
          margin-left: 75.2;
          float: right;
        }
        .operation.ul {
          width: 620px;
          height: 467px;
          margin-top: 12px;
        }
        .operation li {
          font-size: 18px;
        }
        .operation .box {
          width: 89px;
          height: 82px;
        }
        .operation .box {
          background-color: blue;
        }
        .operation ul li {
          margin-top: 14px;
          box-sizing: border-box;
          border: 1px #08aca5 solid;
          border-radius: 20px;
          height: 82px;
        }
        .color {
          width: 89px;
          height: 82px;
          background-color: #08aca5;
          border-radius: 20px 0px 0px 20px;
          text-align: center;
          line-height: 82px;
          font-size: 36px;
          color: #ffffff;
        }
        .footer {
          height: 219px;
          background-color: orchid;
        }
      `}</style>

      <div className="header">
        <h1>마이클래스</h1>
        <Btn home="home" />
      </div>

      <div className="content">
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <h1>멘토</h1>
            <div className="box">
              {mentors.map((f, i) => (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    margin: '10px',
                  }}
                  key={i}
                >
                  <div className="picture">
                    <div
                      className="img"
                      style={{
                        backgroundImage:
                          'url(https://img.ingipsy.com/profile-img/' + f.imgpath + '.jpg)',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <ul style={{marginTop: '20px', width: '100%'}}>
                      <li style={{textAlign: 'center', padding: '10px'}}>멘토 소개</li>
                      <li style={{textAlign: 'center'}}>{f.univ}</li>
                      <li style={{textAlign: 'center'}}>{f.department}</li>
                      <li style={{textAlign: 'center'}}>{f.highschool}</li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="operation">
            <h1>아래와 같은 상황일때는 퇴소 조치합니다.</h1>

            <ul>
              <li style={{display: 'flex'}}>
                <div className="color">1.</div>
                <div
                  style={{
                    lineHeight: '82px',
                    paddingLeft: '30px',
                    fontWeight: 'bold',
                  }}
                >
                  플래너 미작성 3회
                </div>
              </li>
              <li style={{display: 'flex'}}>
                <div className="color">2.</div>
                <div
                  style={{
                    lineHeight: '82px',
                    paddingLeft: '30px',
                    fontWeight: 'bold',
                  }}
                >
                  테스트 미시행 3회
                </div>
              </li>
              <li style={{display: 'flex'}}>
                <div className="color">3</div>
                <div
                  style={{
                    lineHeight: '82px',
                    paddingLeft: '30px',
                    fontWeight: 'bold',
                  }}
                >
                  지시사항 불응 3회
                </div>
              </li>
              {/*oprtnPrncp&&
                            oprtnPrncp.map(obj => 
                            <li style={{display:'flex'}}><div className="color">+</div>
                            <div style={{lineHeight:'82px',paddingLeft:'10px'}}>{obj.rmk}</div></li>)
                        */}
            </ul>
          </div>
        </div>
        <div className="imformation">
          <div className="notice">
            <h1>멘토 공지사항</h1>
            {
              //<p>더보기</p>
            }
            <ul>
              <li className="">
                <div style={{fontSize: '26px', fontWeight: 'bold'}}>
                  플래너 작성은 아래 순서대로 진행
                </div>
                <div style={{color: 'red', marginTop: '10px'}}>1. 주간 일정 작성</div>
                -고정 일정 기록<br></br>
                -자기 공부 시간 파악 및 과목별 요일/시간 할당<br></br>
                <div style={{color: 'red', marginTop: '10px'}}>2. 장기 계획 수립</div>
                <div style={{color: 'red', marginTop: '10px'}}>3. 하루 계획 수립</div>
                -주간일정과 장기계획에 의해 할당된 하루 학습량을 참고로 구체적 시간 계획<br></br>
                <div style={{color: 'red', marginTop: '10px'}}> 4. 일요일은 가급적 일정 무</div>
                -성취하지 못한 학습 계획을 일요일에 채울 수 있도록 일요일 일정은 비울 것을 권합니다.
                <br></br>
                <div
                  style={{
                    fontSize: '26px',
                    marginTop: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  테스트는 최소 주1회
                </div>{' '}
                시행하며 테스트 공지사항에 구체적인 과목, 내용, url을 기재해두면 학생은 기간안에
                온라인으로 테스트를 시행해야 합니다.<br></br>
                <div style={{color: 'red', marginTop: '10px'}}>
                  -성적은 테스트 페이지에 등수 및 점수 공개
                </div>
                <div
                  style={{
                    fontSize: '26px',
                    marginTop: '28px',
                    fontWeight: 'bold',
                  }}
                >
                  상담은 학부모, 학생 상담 각각 최소 월 1회
                </div>
              </li>
              {/*notice &&
                            notice.map(obj => 
                            <li className="">{obj.rmk}</li>)
                            */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPayment(withDesktop(Home, page), null, '플래너');
