const SchoolGrades = () => {
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
          height: 2754px;
        }
        .content {
          height: 2440px;
          width: 400px;
          margin: auto;
        }
        .header {
          background-color: black;
          width: 400px;
          height: 50px;
          margin: auto;
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
        .integrated {
          width: 352px;
          margin: auto;
        }
        .button2 {
          width: 100%;
          height: 50px;
          display: flex;
        }
        button {
          width: 50%;
          height: 40px;
          text-align: center;
          border: 0.5px #d1d1d1 solid;
          border-radius: 5px;
        }
        button:hover {
          background-color: #de6b3d;
        }
        .dropBox {
          width: 100%;
          height: 40px;
          border-radius: 20px;
          line-height: 40px;
          text-align: center;
          margin-top: 10px;
          box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
          position: relative;
        }
        .dropBox .icon {
          position: absolute;
          right: 10px;
          top: 3px;
          width: 32px;
          height: 32px;
          border-radius: 25px 25px 25px 25px;
          background-color: #de6b3d;
          line-height: 32px;
          color: #ffffff;
        }
        .integrated_graph {
          width: 352px;
          height: 282px;
          border: 1px #9d9d9d solid;
          margin-top: 25px;
          border-collapse: collapse;
        }

        .integrated .line {
          width: 100%;
          height: 11.1999%;
          border-bottom: 1px #9d9d9d solid;
          font-size: 10px;
          color: #9d9d9d;
        }

        .integrated .students ul {
          display: flex;
          width: 80%;
          font-size: 16px;
          margin: auto;
        }

        .integrated .students li {
          display: flex;
          font-size: 16px;
          padding: 10px 15px 31px 0px;
        }
        .integrated .table {
          width: 352px;
          height: 299px;
        }

        .integrated table {
          width: 100%;
          border-collapse: collapse;
          height: 299px;
          text-align: center;
          font-size: 16px;
        }

        .integrated tr:nth-of-type(1) {
          background-color: #efeded;
        }

        .integrated td:nth-of-type(1) {
          background-color: #dedede;
        }
        .integrated td:nth-of-type(3) {
          width: 228.8px;
        }
        .integrated td:nth-of-type(2) {
          width: 45.3px;
        }
        .integrated tr:nth-of-type(2) td:nth-of-type(3) {
          background-color: #d8dc6a;
        }
        .integrated td,
        .integrated tr {
          border-top: 1px #363636 solid;
          border-left: 1px #dedede solid;
          border-bottom: 0.5px #dedede solid;
          border-right: 0.5px #dedede solid;
        }
        .radio {
          height: 50px;
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

        .term {
          width: 352px;
          margin: auto;
        }
        .term h1 {
          height: 53px;
          font-size: 17px;
          line-height: 53px;
          text-align: left;
        }

        .term hr {
          background-color: #de6b3d;
          width: 175.53px;
          height: 4px;
          border-radius: 20px;
          margin: auto;
        }

        .term .selectBox select {
          width: 108px;
          height: 40px;
          text-align-last: center;
          box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }

        .term .week_graph {
          width: 352px;
          height: 365px;
          border: 1px #9d9d9d solid;
          margin-top: 25px;
          border-collapse: collapse;
        }

        .term .line {
          width: 100%;
          height: 11.1999%;
          border-bottom: 1px #9d9d9d solid;
          font-size: 10px;
          color: #9d9d9d;
        }

        .term .students ul {
          display: flex;
          width: 80%;
          font-size: 16px;
          margin: auto;
        }

        .term .students li {
          display: flex;
          font-size: 16px;
          padding: 10px 15px 31px 0px;
        }
        .term .selectBox select:not(:nth-of-type(1)) {
          margin-left: 10px;
        }
        .buttonBox {
          width: 100%;
          margin-top: 20px;
        }
        .term .table {
          width: 352px;
          height: 299px;
        }

        .term table {
          width: 100%;
          border-collapse: collapse;
          height: 299px;
          text-align: center;
          font-size: 16px;
        }

        .term tr:nth-of-type(1) {
          background-color: #efeded;
        }

        .term td:nth-of-type(1) {
          background-color: #dedede;
        }
        .term td:nth-of-type(3) {
          width: 228.8px;
        }
        .term td:nth-of-type(2) {
          width: 45.3px;
        }
        .term tr:nth-of-type(2) td:nth-of-type(3) {
          background-color: #d8dc6a;
        }
        .term td,
        .term tr {
          border-top: 1px #363636 solid;
          border-left: 1px #dedede solid;
          border-bottom: 0.5px #dedede solid;
          border-right: 0.5px #dedede solid;
        }
        .variance {
          width: 352px;
          margin: auto;
        }
        .variance hr {
          background-color: #de6b3d;
          width: 175.53px;
          height: 4px;
          border-radius: 20px;
          margin: auto;
        }

        .variance .selectBox select {
          width: 108px;
          height: 40px;
          text-align-last: center;
          box-shadow: 0px 3px 6px rgba(00, 00, 00, 16%);
        }

        .variance .week_graph {
          width: 352px;
          height: 282px;
          border: 1px #9d9d9d solid;
          margin-top: 25px;
          border-collapse: collapse;
          font-size: 16px;
        }

        .variance .line {
          width: 100%;
          height: 12.5%;
          border-bottom: 0.5px #9d9d9d solid;
          font-size: 10px;
          color: #9d9d9d;
        }

        .variance .students ul {
          display: flex;
          width: 100%;
          font-size: 16px;
          margin: auto;
        }

        .variance .students li {
          display: flex;
          font-size: 16px;
          padding: 10px 15px 31px 0px;
        }

        .variance .selectBox select:not(:nth-of-type(1)) {
          margin-left: 10px;
        }
      `}</style>
      <div className="content">
        <div className="integrated">
          <h1>통합 내신 순위</h1>
          <div className="button2">
            <button>전 과목 평균</button>
            <button>국영수탐</button>
          </div>
          <div className="dropBox">
            <select name="" id="">
              <option>편차 지수 등급</option>
            </select>
            <div className="icon">&#9660;</div>
          </div>

          <div className="integrated_graph">
            <div className="line">&nbsp;&nbsp;1</div>
            <div className="line">&nbsp;&nbsp;2</div>
            <div className="line">&nbsp;&nbsp;3</div>
            <div className="line">&nbsp;&nbsp;4</div>
            <div className="line">&nbsp;&nbsp;5</div>
            <div className="line">&nbsp;&nbsp;6</div>
            <div className="line">&nbsp;&nbsp;7</div>
            <div className="line">&nbsp;&nbsp;8</div>
            <div className="line">&nbsp;&nbsp;9</div>
          </div>
          <div className="students">
            <ul>
              <li>A학생</li>
              <li>B학생</li>
              <li>C학생</li>
              <li>D학생</li>
              <li>E학생</li>
            </ul>
          </div>
          <div className="dayTable">
            <table>
              <tr>
                <td>순위</td>
                <td>학생</td>
                <td>내신</td>
                <td>차이</td>
              </tr>
              <tr>
                <td>0</td>
                <td>멘토</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>1</td>
                <td>B</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>2</td>
                <td>C</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>3</td>
                <td>D</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>4</td>
                <td>E</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="sell"></div>
        <div className="term">
          <h1>학기별 내신 순위</h1>

          <div className="selectBox">
            <select name="" id="">
              <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>
            <select name="" id="">
              <option value="">학년&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>
            <select>
              <option value="">1학기 중간&nbsp;&nbsp;&nbsp;&#9660; </option>
            </select>
          </div>
          <div className="buttonBox">
            <div className="button">
              <button>전 과목 평균</button>
              <button>국영수탐</button>
            </div>
          </div>
          <div className="dropBox">
            <select name="" id="">
              <option>편차 지수 등급</option>
            </select>
            <div className="icon">&#9660;</div>
          </div>
          <div className="week_graph">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="students">
            <ul>
              <li>A학생</li>
              <li>B학생</li>
              <li>C학생</li>
              <li>D학생</li>
              <li>E학생</li>
            </ul>
          </div>
          <div className="dayTable">
            <table>
              <tr>
                <td>순위</td>
                <td>학생</td>
                <td>내신</td>
                <td>차이</td>
              </tr>
              <tr>
                <td>0</td>
                <td>멘토</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>1</td>
                <td>B</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>2</td>
                <td>C</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>3</td>
                <td>D</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>4</td>
                <td>E</td>
                <td></td>
                <td></td>
              </tr>
            </table>
          </div>
          <div className="radio">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        <div className="sell"></div>
        <div className="variance">
          <h1>내신 변동 추이</h1>
          <div className="selectBox">
            <select name="" id="">
              <option value="">2021년&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>
            <select name="" id="">
              <option value="">학년&nbsp;&nbsp;&nbsp;&#9660;</option>
            </select>
            <select>
              <option value="">1학기 중간&nbsp;&nbsp;&nbsp;&#9660; </option>
            </select>
          </div>
          <div className="week_graph">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
          <div className="students">
            <ul>
              <li>1학기 중간</li>
              <li>1학기 기말</li>
              <li>2학기 중간</li>
              <li>2학기 기말</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolGrades;
