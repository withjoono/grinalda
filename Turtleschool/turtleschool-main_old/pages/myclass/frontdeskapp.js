import axios from 'axios';
import {useEffect, useState} from 'react';

const FrontDesk = ({gradeCode}) => {
  const [mentors, setMentors] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [grade, setGrade] = useState(gradeCode[1].comn_cd);

  const [notice, setNotice] = useState([]); //1.공지사항
  const [oprtnPrncp, setOprtnPrncp] = useState([]); //2.운영원칙
  const [compliance, setCompliance] = useState([]); //3.준수사항
  const [question, setQuestion] = useState([]); //4.QNA

  //플래너정보가져오기
  useEffect(() => {
    axios
      .get('/api/planner/planners', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          dvsn: 'A',
        },
      })
      .then(res => {
        setMentors(res.data.data);
      });
  }, []);

  //공지사항 운영원칙 준수사항 QNA 정보조회
  const getNotice = e => {
    axios
      .get('/api/planner/notice', {
        headers: {
          auth: localStorage.getItem('uid'),
        },
        params: {
          plnerid: e.id,
          cls: e.cls,
        },
      })
      .then(res => {
        setNotice(res.data.data.filter(o => o.dvsn == '1')); //1.공지사항 API 데이터 가져오기
        setOprtnPrncp(res.data.data.filter(o => o.dvsn == '2')); //2.운영원칙 API 데이터 가져오기
        setCompliance(res.data.data.filter(o => o.dvsn == '3')); //3.준수사항 API 데이터 가져오기
        setQuestion(res.data.data.filter(o => o.dvsn == '4')); //4.QNA API 데이터 가져오기
      });
  };

  //플래너에 학생 등록하기
  const postPlanner = e => {
    axios.post(
      '/api/planner/memberAdd',
      {
        plnrid: e.id,
        cls: e.cls,
      },
      {
        headers: {auth: localStorage.getItem('uid')},
      },
    );
  };

  const filterMentors = code => mentors.filter(m => m.cls == code);

  return (
    <div className="wrap">
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

        .wrap {
          width: 100%;
        }
        .content {
          width: 90%;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .header {
          background-color: black;
          width: 100%;
          height: 50px;
        }

        .main {
          background-color: blue;
          height: 60px;
        }

        .content h1 {
          height: 65px;
          font-size: 17px;
          line-height: 53px;
          text-align: left;
        }
        .sell {
          width: 100%;
          height: 10px;
          background-color: #edeeed;
        }
        select {
          border-style: none;
        }

        .list {
          width: 100%;
          margin: auto;
        }
        .mentors {
          scroll-snap-type: x mandatory;
          overflow-x: scroll;
          overflow-y: visible;
          padding: 20px;
          display: flex;
        }
        .mentors > div {
          scroll-snap-align: center;
          flex: 0 0 100%;
          height: 395px;
          box-shadow: rgb(157 157 157) 3px 3px 16px;
          border-radius: 20px;
          margin-right: 30px;
        }
        .profile {
          height: 70%;
          margin-left: 20px;
          margin-top: 20px;
        }
        .profile_left {
          width: 40%;
          height: 60%;
          margin: auto;
          float: left;
        }
        .profile_right {
          width: 60%;
          height: 60%;
          float: left;
        }
        .box .img {
          width: 152px;
          height: 150px;
          border: 1px #707070 solid;
          border-radius: 19px;
        }

        .profile_right .text {
          width: 90px;
          margin: auto;
        }
        .profile_right p:nth-of-type(1) {
          height: 24px;
          font-size: 12px;
          color: #ffffff;
          border-radius: 15px;
          background-color: #08aca5;
          margin-top: 10px;
          text-align: center;
        }
        .profile_right p:nth-of-type(n + 2) {
          font-size: 18px;
          color: #9d9d9d;
        }
        .img {
          width: 100px;
          height: 100px;
          border: 1px #707070 solid;
          border-radius: 19px;
        }
        .btn {
          width: 100%;
          height: 25%;
          text-align: center;
          background-color: #fc8454;
          color: #ffffff;
          border-radius: 0px 0px 20px 20px;
        }
        .btn button:nth-of-type(1) {
          width: 49.75%;
          height: 100%;
          font-size: 18px;
          float: left;
          border-right: 1px #ffffff solid;
          line-height: 86.9px;
        }
        .btn button:nth-of-type(2) {
          width: 49.75%;
          height: 10%;
          font-size: 18px;
          float: left;
          margin-top: 30px;
        }
        .button {
          font-size: 17px;
          color: #ffffff;
          text-align: center;
        }
        .button .view {
          background-color: #6689a1;
          border-radius: 5px;
          width: 100%;
          height: 45px;
          line-height: 45px;
        }
        .button .in {
          margin-top: 5px;
          background-color: #de6b3d;
          border-radius: 5px;
          width: 100%;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .list .table {
          margin-top: 30px;
          width: 100%;
          text-align: center;

          display: table;
        }
        .table ul:nth-child(n + 2) li {
          float: left;
          width: 20%;
          height: 45px;
          font-size: 14px;
          border-bottom: 0.5px #707070 solid;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .table ul:nth-of-type(1) li:nth-of-type(1) {
          width: 100%;
          height: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #dedede;
          font-size: 14px;
          border-top: 0.5px #242424 solid;
          border-bottom: 0.5px #242424 solid;
        }
        .table ul li:nth-of-type(1) {
          background-color: #dedede;
          border-bottom: 0.5px #707070 solid;
        }
        .table ul:nth-of-type(2) li:nth-child(n + 2) {
          background-color: #efeded;
          border-bottom: 0.5px #707070 solid;
        }

        .compliance {
          width: 100%;
          height: 414px;
          margin: auto;
        }
        .compliance table {
          width: 100%;
          height: 299px;
          text-align: center;
          border-collapse: collapse;
        }
        .compliance tr {
          border-top: 1px #363636 solid;
          border-left: 1px #dedede solid;
          border-bottom: 0.5px #707070 solid;
        }
        .compliance table td:nth-of-type(1) {
          width: 32px;
          background-color: #dedede;
        }
        .compliance table tr:nth-of-type(1) td:nth-of-type(2) {
          background-color: #efeded;
        }

        .radio {
          height: 40px;
          width: 50px;

          display: flex;
          margin: auto;
        }
        .radio div {
          width: 10px;
          height: 10px;
          border-radius: 20px 20px 20px 20px;
          margin: auto;
          background-color: #dedede;
        }
        .notice {
          width: 100%;
          height: 317px;
          margin: auto;
        }
        .notice table {
          width: 100%;
          height: 197px;
          text-align: center;
          border-collapse: collapse;
        }
        .notice tr {
          border-top: 1px #363636 solid;
          border-left: 1px #dedede solid;
          border-bottom: 0.5px #707070 solid;
        }
        .notice table td:nth-of-type(1) {
          width: 32px;
          background-color: #dedede;
        }
        .radio {
          height: 40px;
          width: 50px;

          display: flex;
          margin: auto;
        }
        .radio div {
          width: 10px;
          height: 10px;
          border-radius: 20px 20px 20px 20px;
          margin: auto;
          background-color: #dedede;
        }
      `}</style>
      <div className="content">
        <div className="list">
          <h1>프론트 데스크</h1>
          <div className="mentors">
            {mentors.map(f => (
              <div>
                <div className="profile">
                  <div className="profile_left">
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
                  <div className="profile_right">
                    <div className="text">
                      <p style={{lineHeight: '24px'}}>{f.clsnm}</p>
                      <h1 style={{width: '100px'}}>{f.user_name}</h1>
                      <p style={{fontSize: '14px', width: '100px'}}>{f.univ}</p>
                      <p style={{fontSize: '16px'}}>{f.department}</p>
                    </div>
                  </div>
                  <div className="boxBottom">
                    <div className="school">
                      <ul>
                        <li>출신고교</li>
                        <li>{f.highschool}</li>
                      </ul>
                      <ul>
                        <li>현 담당인원</li>
                        <li>{f.memcout}명</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="btn">
                  <button className="introduce" onClick={e => getNotice(f)}>
                    소개바로가기
                  </button>
                  <button className="saveplanner" onClick={e => postPlanner(f)}>
                    등록
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="button">
            <div className="view">멘토쌤 한줄평 보기</div>
            <div className="in">멘토쌤반에 들어가기</div>
          </div>
        </div>
        <div className="sell"></div>
        <div className="compliance">
          <h1>준수 사항</h1>
          <table>
            <tr>
              <td>No.</td>
              <td>내용</td>
            </tr>
            {!compliance.length ? (
              <tr>
                <td>1</td>
                <td>-</td>
              </tr>
            ) : null}
            {compliance.map((n, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{n.rmk}</td>
              </tr>
            ))}
          </table>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="sell"></div>
        <div className="notice">
          <h1>QnA</h1>
          <table>
            <tr>
              <td>No.</td>
              <td>내용</td>
            </tr>
            {!question.length ? (
              <tr>
                <td>1</td>
                <td>-</td>
              </tr>
            ) : null}
            {question.map((n, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{n.rmk}</td>
              </tr>
            ))}
          </table>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="sell"></div>
        </div>
        <div className="notice">
          <h1>공지 사항</h1>
          <table>
            <tr>
              <td>No.</td>
              <td>내용</td>
            </tr>
            {!notice.length ? (
              <tr>
                <td>1</td>
                <td>-</td>
              </tr>
            ) : null}
            {notice.map((n, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{n.rmk}</td>
              </tr>
            ))}
          </table>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="notice">
          <h1>운영 원칙</h1>
          <table>
            <tr>
              <td>No.</td>
              <td>내용</td>
            </tr>
            {!oprtnPrncp.length ? (
              <tr>
                <td>1</td>
                <td>-</td>
              </tr>
            ) : null}
            {oprtnPrncp.map((n, i) => (
              <tr>
                <td>{i + 1}</td>
                <td>{n.rmk}</td>
              </tr>
            ))}
          </table>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrontDesk;
