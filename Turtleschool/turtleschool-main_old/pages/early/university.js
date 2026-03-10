import {useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import page from '../desktop/earlyuniversity';

const University = () => {
  const [click, setClick] = useState(false);
  const [onButton, setOnButton] = useState(0);
  const specifics = (
    <>
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
          width: 400px;
          height: 2439px;
        }
        .content {
          height: 2329px;
          margin: auto;
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
          height: 53px;
          font-size: 17px;
          line-height: 65px;
          text-align: left;
        }
        .cell {
          width: 400px;
          height: 10px;
          background-color: #edeeed;
        }
        select {
          border-style: none;
        }
        .title {
          width: 352px;

          display: flex;
          margin: auto;
        }
        .title h1 {
          font-size: 22px;
        }
        .title h1:nth-of-type(1) {
          color: #de6b3d;
        }
        hr {
          width: 352px;
          margin: auto;
          height: 5px;
          background-color: #de6b3d;
        }
        .text {
          width: 352px;
          height: 25.05px;
          line-height: 25.05px;
          margin: 2px auto;
          display: flex;
          color: #de6b3d;
          font-size: 15px;
        }
        .text .left {
          width: 138px;
          border-right: 0.5px #de6b3d solid;
        }
        .text .right {
          margin-left: 10px;
          width: 138px;
        }
        .border {
          width: 352px;
          height: 90px;
          border: 1px #de6b3d solid;
          margin: 20px auto;
          font-size: 13px;
          border-radius: 10px;
          line-height: 25px;
        }
        .border .left {
          width: 23%;
          float: left;
          margin-left: 25px;
          margin-top: 5px;
        }
        .border .right {
          width: 60%;
          float: left;
          margin-left: 25px;
          margin-top: 5px;
        }
        .border .right div {
          display: flex;
        }
        .border .right .profile p:nth-of-type(3) {
          margin-left: 45px;
        }
        .border .right .profile p:nth-of-type(4) {
          margin-left: 20px;
        }
        .border .right .profile p:nth-of-type(1) {
          color: #de6b3d;
        }
        .border .right .interview p:nth-of-type(1) {
          color: #de6b3d;
        }
        .border .right .interview button {
          width: 80px;
          height: 20px;
          font-size: 9px;
          color: #de6b3d;
          margin-left: 100px;
          margin-top: 5px;
          border: 1px #de6b3d solid;
          border-radius: 5px;
          line-height: 20px;
        }
        .border .right p:nth-of-type(1) {
          color: #de6b3d;
        }

        .analysis {
          width: 352px;
          height: 360px;
          margin: auto;
        }
        .analysis h1 {
          line-height: 53px;
        }
        .analysis .box {
          width: 352px;
          height: 280px;
          border: 1px #9d9d9d solid;
          border-radius: 10px;
        }
        .analysis .box table {
          width: 302px;
          height: 230px;
          border-top: 1px #000000 solid;
          text-align: center;
          margin: 25px auto;
          border-collapse: collapse;
        }
        .analysis .box table tr:nth-of-type(1) td,
        .analysis .box table tr:nth-of-type(3) td {
          background-color: #edeeed;
          border-bottom: 0.5px rgba(70, 70, 70, 16%) solid;
          width: 33%;
        }

        .analysis .box table p {
          margin: auto;
          width: 82px;
          height: 37px;
          border: 1px;
          border-radius: 5px;
          box-shadow: 0px 3px 3px rgba(00, 00, 00, 16%);
        }
        .pass {
          width: 352px;
          height: 445px;
          margin: auto;
        }
        .pass .graph {
          border: 1px #9d9d9d solid;
          height: 365px;
          border-radius: 10px;
        }
        .years {
          height: 379px;
          width: 352px;
          margin: auto;
        }
        .years h1 {
          line-height: 53px;
        }
        .years table {
          width: 352px;
          height: 299px;
          text-align: center;
          border-top: 1px black solid;
          border-collapse: collapse;
        }
        .years table td:nth-of-type(1) {
          background-color: #dedede;
        }
        .years table tr:nth-of-type(1) td:nth-child(n + 2) {
          background-color: #efeded;
        }
        .years table td {
          border-bottom: 0.5px rgba(70, 70, 70, 16%) solid;
        }
        .same {
          height: 438px;
          width: 352px;
          margin: auto;
        }
        .same .graph {
          width: 352px;
          height: 300px;
          margin: auto;
          border: 1px #9d9d9d solid;
          border-radius: 10px;
        }
        .same button {
          width: 200px;
          height: 30px;
          background-color: #de6b3d;
          border-radius: 20px;
          margin-top: 27px;
          margin-left: 20%;
          color: #ffffff;
        }
      `}</style>

      <div className="content">
        <div className="title">
          <h1>최지웅</h1>
          <h1>님의 합격 진단</h1>
        </div>
        <hr />
        <div className="text">
          <div className="left">중앙대 국어국문학과</div>
          <div className="right">교과전형</div>
        </div>
        <div className="border">
          <div className="left">
            <p>수능 최저 기준</p>
            <p>자소서 유/무</p>
            <p>면접 유/무</p>
          </div>
          <div className="right">
            <p>국수탐 합 9등급 이내</p>
            <div className="profile">
              <p>유</p>/<p>무</p>
              <p>면접날짜</p>
              <p>2021.10.23</p>
            </div>
            <div className="interview">
              <p>유</p>/<p>무</p>
              <button>면접날짜 종목확인</button>
            </div>
          </div>
        </div>
        <div className="analysis">
          <h1>분석 개요</h1>
          <div className="box">
            <table>
              <tr>
                <td>경쟁률</td>
                <td>평균</td>
                <td>70%컷</td>
              </tr>
              <tr>
                <td>
                  <p>경쟁률</p>
                </td>
                <td>
                  <p>평균</p>
                </td>
                <td>
                  <p>70%컷</p>
                </td>
              </tr>
              <tr>
                <td>컷라인</td>
                <td>차이</td>
                <td>목표대학설정</td>
              </tr>
              <tr>
                <td>
                  <p>컷라인</p>
                </td>
                <td>
                  <p>차이</p>
                </td>
                <td>
                  <p>설정하기</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="cell"></div>
        <div className="pass">
          <h1>합격자 성적 분포도</h1>
          <div className="graph"></div>
        </div>
        <div className="cell"></div>
        <div className="years">
          <h1>5개년 성적분석</h1>
          <table>
            <tr>
              <td>연도</td>
              <td>경쟁률</td>
              <td>평균</td>
              <td>70%컷</td>
              <td>CUT</td>
            </tr>
            <tr>
              <td>2017</td>
              <td>16.26:1</td>
              <td>2.73</td>
              <td>2.9</td>
              <td>3.4</td>
            </tr>
            <tr>
              <td>2018</td>
              <td>16.26:1</td>
              <td>2.61</td>
              <td>2.9</td>
              <td>3.19</td>
            </tr>
            <tr>
              <td>2019</td>
              <td>16.26:1</td>
              <td>2.9</td>
              <td>2.9</td>
              <td>4.2</td>
            </tr>
            <tr>
              <td>2020</td>
              <td>16.26:1</td>
              <td>2.9</td>
              <td>2.9</td>
              <td>3.86</td>
            </tr>
            <tr>
              <td>2021</td>
              <td>16.26:1</td>
              <td>2.44</td>
              <td>2.9</td>
              <td>3.55</td>
            </tr>
          </table>
        </div>
        <div className="cell"></div>
        <div className="same">
          <h1>동일대학/동일전형/타학과 평균성적분포도</h1>
          <div className="graph"></div>
          <button>상세검색</button>
        </div>
        <div className="cell"></div>
        <div className="same">
          <h1>타대학/동일전형/동일학과 평균성적분포도</h1>
          <div className="graph"></div>
          <button>상세검색</button>
        </div>
      </div>
    </>
  );
  if (click) return specifics;
  else
    return (
      <>
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
            width: 400px;
            height: 1427px;
          }
          .content {
            height: 917px;
            margin: auto;
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
            height: 53px;
            font-size: 17px;
            line-height: 53px;
            text-align: left;
          }
          .sell {
            width: 400px;
            height: 10px;
            background-color: #edeeed;
          }
          select {
            border-style: none;
          }
          .select {
            width: 352px;
            height: 917px;
            margin: auto;
          }
          .select select:not(:nth-of-type(1)) {
            margin-left: 15px;
          }
          .select select {
            width: 165px;
            height: 37px;
            text-align-last: center;
            border-radius: 5px;
            background-color: #f4f4f4;
          }
          .select .buttons {
            margin-top: 24px;
            width: 352px;
            height: 40px;
            border-radius: 5px;
            border: 0.5px #d1d1d1 solid;
            line-height: 40px;
            display: flex;
          }

          .select .buttons button {
            width: 117.3333px;
          }
          .select .buttons .onButton {
            width: 117.33px;

            background-color: #de6b3d;
            border-radius: 5px;
          }
          .graph {
            margin-top: 15px;
            width: 352px;
            height: 300px;
            border: 1px #9d9d9d solid;
            border-radius: 10px;
            color: #9d9d9d;
            position: relative;
          }
          .graph ul {
            font-size: 10px;
            position: absolute;
            top: 10px;
            left: 5px;
          }
          .graph li:nth-child(n + 3) {
            margin-top: 13px;
          }
          .graph .box {
            position: absolute;
            width: 302px;
            height: 248px;
            border: 0.5px #9d9d9d solid;
            left: 25px;
            top: 25px;
          }
          .box .line {
            width: 302px;
            height: 31px;
            border-top: 0.5px #9d9d9d solid;
          }
          .school {
            position: absolute;
            bottom: 7px;
            left: 10px;
            width: 352px;
            font-size: 10px;
          }
          .school p {
            color: #9d9d9d;

            float: left;

            margin-left: 6%;
          }
          .searchButton {
            width: 352px;
            height: 40px;
            background-color: #de6b3d;
            border-radius: 5px;
            color: white;
          }
          .searchButton h1 {
            text-align: center;
            line-height: 40px;
            font-size: 14px;
            margin-top: 15px;
          }
          .find {
            border: 1px #9d9d9d solid;
            height: 300px;
            border-radius: 5px;
          }
          .titles {
            display: flex;
            height: 40.2px;
            line-height: 40.2px;
            justify-content: space-around;
          }
          .find .titles p {
            font-size: 13px;
            color: #9d9d9d;
            font-weight: bold;
          }
          .find .click {
            width: 332px;
            font-size: 13px;
            margin-left: 10px;
          }
          .click .border {
            width: 100%;
            height: 40px;
            line-height: 40px;
            border: 1px #e9e9e9 solid;
            border-radius: 10px;
            box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
            display: flex;
            margin-top: 8px;
          }
          .click .border p {
            width: 40%;
            text-align: center;
          }
          .click .border button {
            margin-top: 4px;
            margin-left: 80px;
            width: 63px;
            height: 29px;
            background-color: #de6b3d;
            line-height: 29px;
            border-radius: 5px;
            color: white;
          }
        `}</style>
        <div className="wrap">
          <div className="content">
            <div className="select">
              <div className="buttons">
                <button className={onButton == 0 ? 'onButton' : ''} onClick={() => setOnButton(0)}>
                  교과
                </button>
                <button className={onButton == 1 ? 'onButton' : ''} onClick={() => setOnButton(1)}>
                  학생부 종합
                </button>
                <button className={onButton == 2 ? 'onButton' : ''} onClick={() => setOnButton(2)}>
                  논술
                </button>
              </div>
              <h1>대학별 교과 합격 분포</h1>
              <div className="selectBox">
                <select name="" id="">
                  <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
                </select>
                <select name="" id="">
                  <option value="">5월&nbsp;&nbsp;&nbsp;&#9660;</option>
                </select>
              </div>
              <div className="graph">
                <div className="box">
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </div>
                <ul>
                  <li>등급</li>
                  <li>1</li>
                  <li>2</li>
                  <li>3</li>
                  <li>4</li>
                  <li>5</li>
                  <li>6</li>
                  <li>7</li>
                  <li>8</li>
                  <li>9</li>
                </ul>
                <div className="school">
                  <p>고려대</p>
                  <p>경희대</p>
                  <p>성균관대</p>
                  <p>한양대</p>
                  <p>홍익대</p>
                  <p>건국대</p>
                </div>
              </div>
              <div className="searchButton">
                <h1>고려대 교과 전형 검색</h1>
              </div>
              <h1>학교 검색 결과</h1>
              <div className="find">
                <div className="titles">
                  <p>학과</p>
                  <p>상세 검색</p>
                </div>
                <div className="click">
                  <div className="border">
                    <p>수학과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>국어국문학과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>유아교육과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>영어교육과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>간호학과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                </div>
              </div>
              <h1>학과 찾기</h1>
              <div className="find">
                <div className="titles">
                  <p>학과</p>
                  <p>상세 검색</p>
                </div>
                <div className="click">
                  <div className="border">
                    <p>수학과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>국어국문학과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>유아교육과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>영어교육과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                  <div className="border">
                    <p>간호학과</p>
                    <button onClick={() => setClick(true)}>상세검색</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default withDesktop(page, University);
