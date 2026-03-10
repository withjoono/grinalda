import axios from 'axios';
import router from 'next/router';
import React, { useEffect, useState, useContext } from 'react';
import loginContext from '../../../../contexts/login';

const MentorWrapper = () => {
  const [mentors, setMentors] = useState([]); //플래너
  const { user, login } = useContext(loginContext);
  useEffect(() => {
    axios
      .get('/api/planner/home_planner', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
      })
      .then(res => setMentors([res.data.data.slice(0, 4), res.data.data.slice(4, 8)]));
  }, []);
  const navs = index => {
    // 모든 서브 페이지 로그인 체크
    if (user[0] === '') {
      if (confirm('로그인이 필요합니다.')) {
        router.push('/main/Login');
        return;
      } else {
        router.push('/');
        return;
      }
    }

    if (index == 0) {
      router.push('/gpa/infoform');
    } else if (index == 1) {
      alert('오픈 예정입니다');
    } else if (index == 2) {
      router.push('/myclass/frontdesk');
    } else if (index == 3) {
      router.push('myclass/frontdesk');
    } else if (index == 4) {
      router.push('mockup/inputchoice');
    } else if (index == 8) {
      router.push('https://www.turtleschool.kr/susi-consulting/');
    } else if (index == 9) {
      router.push('/gpa/graph');
    } else if (index === 10) {
      router.push('https://www.turtleschool.kr/?page_id=387');
    } else if (index === 11) {
      router.push(
        'https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform?usp=sf_link',
      );
    } else if (index === 12) {
      router.push('https://www.turtleschool.kr/?page_id=381');
    }
  };
  return (
    <>
      <div className="planner_box">
        <div className="profile">
          <div className="title_line">
            <div className="pl_title">멘토 리스트</div>
            <div className="pl_all" onClick={() => navs(3)}>
              더 많은 멘토 찾으러 가기
            </div>
          </div>
          <div className="planner_list">
            {mentors.map((arr, i) => (
              <div
                style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}
                key={i}
              >
                {arr.map((data, j) => (
                  <div
                    style={{ backgroundColor: '#ffffff', width: '180px', height: '126px' }}
                    key={j}
                  >
                    <div style={{ float: 'left' }}>
                      <div className="pla_img">
                        <img src={'https://img.ingipsy.com/profile-img/' + data.img + '.jpg'} />
                      </div>
                    </div>
                    <div style={{ float: 'left', marginLeft: '15px' }}>
                      <div
                        className="pla_name"
                        style={{ marginTop: '21px', fontSize: '16px', fontWeight: 'bold' }}
                      >
                        {data.name}
                      </div>
                      <div className="pla_univ" style={{ fontSize: '9px', marginTop: '9px' }}>
                        {data.univ}
                      </div>
                      <div
                        className="pla_dep"
                        style={{ fontSize: '10px', marginTop: '4px', color: '#DE6B3D' }}
                      >
                        {data.dep}
                      </div>
                    </div>

                    <button
                      onClick={() => navs(3)}
                      style={{
                        width: '150px',
                        height: '20px',
                        border: '1px #2EABC9 solid',
                        color: '#2EABC9',
                        marginLeft: '15px',
                        marginTop: '16px',
                        fontSize: '8px',
                        fontWeight: 'bold',
                      }}
                    >
                      1:1평가받기
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="Exp">
          <div className="title_line"></div>
          <div className="pl_title">거북스쿨 추천 서비스</div>

          <div className="pl_text">
            <div className="pl_btn">
              <div>
                <img
                  src="https://img.ingipsy.com/assets/home_icon/icon-38-z.png"
                  style={{ width: '28px', height: '28px', marginLeft: '20px', marginTop: '13px' }}
                />
              </div>
              <div style={{ lineHeight: '60px' }} onClick={() => navs(0)}>
                나의 내신 z점수 확인하기
              </div>
              <div style={{ width: '16px', position: 'relative', right: '10px' }}>
                <img
                  src="https://img.ingipsy.com/assets/home_icon/icon-arrowgo.png"
                  style={{ width: '16px', height: '16px', marginTop: '21px', marginLeft: '136px' }}
                />
              </div>
            </div>
            <div className="pl_btn" style={{ marginTop: '16px' }}>
              <div>
                <img
                  src="https://img.ingipsy.com/assets/home_icon/icon-38-z.png"
                  style={{ width: '28px', height: '28px', marginLeft: '20px', marginTop: '13px' }}
                />
              </div>
              <div style={{ lineHeight: '60px', width: '300px' }}>
                우리 학교 Z점수 유불리 확인하기
              </div>
              <div style={{ width: '16px', position: 'relative', right: '10px' }}>
                <img
                  src="https://img.ingipsy.com/assets/home_icon/icon-arrowgo.png"
                  style={{ height: '16px', marginTop: '21px', marginRight: '10px' }}
                />
              </div>
            </div>
            <div className="pl_btn" style={{ marginTop: '16px' }}>
              <div>
                <img
                  src="https://img.ingipsy.com/assets/home_icon/icon-38-z.png"
                  style={{ width: '28px', height: '28px', marginLeft: '20px', marginTop: '13px' }}
                />
              </div>
              <div style={{ lineHeight: '60px' }} onClick={() => navs(9)}>
                나의 비교과 평가
              </div>
              <div style={{ width: '16px', position: 'relative', right: '10px' }}>
                <img
                  src="https://img.ingipsy.com/assets/home_icon/icon-arrowgo.png"
                  style={{ width: '16px', height: '16px', marginTop: '21px', marginLeft: '190px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .planner_box {
            width: 1280px;
            height: 385px;

            margin: 50px auto;
            display: flex;
            justify-content: space-between;
          }
          .planner_box .profile {
            width: 811px;
            height: 385px;
            border: 1px #9a9a9a solid;
            background-color: #eaeaea;
          }
          .planner_box .Exp {
            width: 445px;
            height: 385px;
            background-color: #fff2ed;
            box-shadow: 0px 4px 4px rgba(00, 00, 00, 25%);
          }
          .planner_box .Exp .pl_title {
            font-size: 24px;
            font-weight: 1000;
            margin-left: 24px;
            margin-top: 31px;
          }
          .planner_box .Exp .pl_text {
            font-size: 16px;
            font-weight: 400;
            margin-left: 24px;
            margin-top: 31px;
            cursor: pointer;
          }
          .planner_box .Exp .pl_btn {
            width: 397px;
            height: 60px;
            background-color: #ffffff;
            font-size: 16px;
            display: flex;
            font-weight: 500;
          }
          .title_line {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }
          .planner_box .profile .pl_title {
            font-size: 24px;
            font-weight: 1000;
            margin-left: 24px;
            margin-top: 31px;
          }
          .planner_box .profile .pl_all {
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            margin-right: 31px;
            margin-top: 31px;
          }
          .planner_box .profile .pl_all:hover {
            text-decoration: underline;
          }

          .pla_img img {
            width: 50px;
            height: 50px;
            border-radius: 25px;
            margin-left: 16px;
            margin-top: 21px;
          }
        `}
      </style>
    </>
  );
};

export default MentorWrapper;
