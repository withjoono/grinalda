const Test = () => {
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
          height: 2135px;
        }
        .content {
          height: 2353px;
          margin: auto;
          width: 400px;
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
          width: 400px;
          height: 10px;
          background-color: #edeeed;
        }
        select {
          border-style: none;
        }
        .notice {
          width: 352px;
          height: 302px;
          margin: auto;
        }
        .notice table {
          width: 100%;
          height: 192px;
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
        .late {
          width: 352px;
          height: 813px;
          margin: auto;
        }
        .late h1 {
          height: 50px;
          font-size: 17px;
          line-height: 50px;
          text-align: left;
        }
        .late table {
          width: 100%;
          height: 299px;
          text-align: center;
          border-collapse: collapse;
          font-size: 14px;
        }
        .late td {
          border-top: 1px #363636 solid;
          border-left: 1px #dedede solid;
          border-bottom: 0.5px #707070 solid;
        }
        .late table td:nth-of-type(1) {
          width: 32px;
          background-color: #dedede;
        }
        .late table td:nth-of-type(2) {
          width: 45.3px;
        }
        .late table tr:nth-of-type(1) td:not(:nth-of-type(1)) {
          background-color: #efeded;
        }
        .late select:not(:nth-of-type(1)) {
          margin-left: 18px;
        }
        .late select {
          width: 165px;
          height: 37px;
          text-align-last: center;
          border-radius: 5px;
          background-color: #ffffff;
          box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }
        .late_graph {
          margin-top: 15px;
          width: 352px;
          height: 282px;
          border-collapse: collapse;
        }

        .late .line {
          width: 100%;
          height: 11.111%;

          border-left: 0.5px #9d9d9d solid;
          border-bottom: 0.5px #9d9d9d solid;
          border-right: 0.5px #9d9d9d solid;
          font-size: 10px;
          color: #9d9d9d;
        }
        .late .line:nth-of-type(1) {
          border-top: 0.5px #9d9d9d solid;
        }

        .late .students ul {
          display: flex;
          width: 100%;
          font-size: 16px;
          margin: auto;
        }

        .late .students li {
          display: flex;
          font-size: 16px;
          padding: 10px 0px 31px 0px;
          margin-left: 25px;
        }
      `}</style>
      <div className="content">
        <div className="notice">
          <h1>공지사항</h1>
          <table>
            <tr>
              <td>1</td>
              <td>text</td>
            </tr>
            <tr>
              <td>2</td>
              <td>text</td>
            </tr>
            <tr>
              <td>3</td>
              <td>text</td>
            </tr>
            <tr>
              <td>4</td>
              <td>text</td>
            </tr>
          </table>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <div className="sell"></div>
        <div className="late">
          <h1>최근 시험 결과</h1>
          <div className="selectBox">
            <select name="" id="">
              <option value="">과목명&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>

            <select name="" id="">
              <option value="">시험명&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>
          </div>
          <div className="late_graph">
            <div className="line">10</div>
            <div className="line">9</div>
            <div className="line">8</div>
            <div className="line">7</div>
            <div className="line">6</div>
            <div className="line">5</div>
            <div className="line">4</div>
            <div className="line">3</div>
            <div className="line">2</div>
          </div>
          <div className="students">
            <ul>
              <li>A학생</li>
              <li>B학생</li>
              <li>C학생</li>
              <li>D학생</li>
              <li>E학생 </li>
            </ul>
          </div>

          <table>
            <tr>
              <td>순위</td>
              <td>학생</td>
              <td>점수</td>
            </tr>
            <tr>
              <td>1</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>2</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>3</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>4</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>5</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
          </table>
        </div>

        <div className="sell"></div>
        <div className="late">
          <h1>월간 시험 결과</h1>
          <div className="selectBox">
            <select name="" id="">
              <option value="">6월&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>

            <select name="" id="">
              <option value="">과목명&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>
          </div>
          <div className="late_graph">
            <div className="line">100</div>
            <div className="line">90</div>
            <div className="line">80</div>
            <div className="line">70</div>
            <div className="line">60</div>
            <div className="line">50</div>
            <div className="line">40</div>
            <div className="line">30</div>
            <div className="line">20</div>
          </div>
          <div className="students">
            <ul>
              <li>A학생</li>
              <li>B학생</li>
              <li>C학생</li>
              <li>D학생</li>
              <li>E학생 </li>
            </ul>
          </div>

          <table>
            <tr>
              <td>순위</td>
              <td>학생</td>
              <td>점수 합계</td>
            </tr>
            <tr>
              <td>1</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>2</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>3</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>4</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
            <tr>
              <td>5</td>
              <td>A학생</td>
              <td>text</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Test;
