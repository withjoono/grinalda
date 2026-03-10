import React from 'react';
import withPayment from '../../comp/paymentwrapper';
import Menu from '../../comp/applymenu';
import SideNavPage from '../../comp/template/SideNavPageSusi';
const regularbeneficial = () => {
  return (
    <>
    <SideNavPage 
      routes={['홈', '수시 컨설팅', '교과/비교과 분석']}
      navTitle="전략수립 및 모의지원"
      navSubs={[
        {title: '1.교과/비교과 분석', url: '/early/input'},
        {title: '2.유리한 조건 찾기', url: '/early/jungsi-predict'},
        {title: '3.학종 컨설팅', url: '/early/Consulting1'},
        {title: '4.교과 컨설팅', url: '/early/Consulting2'},
        {title: '5.논술 컨설팅', url: '/nonsul/sci'},
        {title: '6.전략수립 및 모의지원', url: '/early/strategy'},
      ]}
    >
      <style jsx>{`
        .contain {
          width: 100%;
          margin: 0 auto;
        }
        .bigtitle1 {
          font-size: 30px;
          font-weight: bold;
          margin: 60px auto 15px;
          -webkit-text-stroke: 1px;
        }
        .bigtitle2 {
          font-size: 30px;
          font-weight: bold;
          margin: 60px auto 15px;
          -webkit-text-stroke: 1px;
        }
        .school {
          width: 100%;
          height: 725px;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .school h1 {
          text-align: right;
        }
        .table {
          width: 90%;
        }
        .table h1 {
          font-size: 24px;
          height: 68px;
          line-height: 68px;
        }
        .school table {
          width: 90%;
          font-size: 15px;
          border-top: 1px #000000 solid;
          margin: auto;
          text-align: center;
          border-collapse: collapse;
        }
        .school table tr td {
          width: 150px;
        }
        .school table tr:nth-of-type(1) {
          height: 69px;
          background-color: #f5f5f5;
          line-height: 69px;
          border-bottom: 0.5px #9d9d9d solid;
        }

        .school table tr {
          height: 61px;

          line-height: 61px;
          border-bottom: 0.5px #9d9d9d solid;
        }
        .school table p {
          width: 36px;
          height: 36px;
          color: #ffffff;
          background-color: #fc8454;
          border-radius: 8px;
          font-size: 16px;
          text-align: center;
          line-height: 36px;
          margin: auto;
        }
        table img {
          position: relative;
          top: 7px;
        }
        .exam {
          width: 100%;
          height: 391px;
          border: 1px #9d9d9d solid;
          border-radius: 20px;
        }
        .exam table {
          width: 90%;
          font-size: 15px;
          border-top: 1px #000000 solid;
          margin: 40px auto;
          text-align: center;
          border-collapse: collapse;
        }
        .exam table tr td {
          width: 150px;
        }
        .exam table tr:nth-of-type(1) {
          height: 69px;
          background-color: #f5f5f5;
          line-height: 69px;
          border-bottom: 0.5px #9d9d9d solid;
        }

        .exam table tr {
          height: 61px;

          line-height: 61px;
          border-bottom: 0.5px #9d9d9d solid;
        }
        .exam table p {
          width: 36px;
          height: 36px;
          color: #ffffff;
          background-color: #fcbf77;
          border-radius: 8px;
          font-size: 16px;
          text-align: center;
          line-height: 36px;
          margin: auto;
        }
      `}</style>
      <Menu index={2} title={"전략수립 및 모의지원"} />
      <div>
        <div className="contain">
          <div className="bigtitle2">모의 지원</div>
          <div className="exam">
            <table>
              <tr>
                <td></td>
                <td>위험도</td>
                <td>전형</td>
                <td>대학</td>
                <td>학과</td>
                <td>예상컷</td>
                <td>차이</td>
                <td>면접/논구술 날짜</td>
              </tr>
              <tr>
                <td>
                  <p>1</p>
                </td>
                <td>위험도</td>
                <td>학생부 종합</td>
                <td>서울대학교</td>
                <td>수학과</td>
                <td>500</td>
                <td>차이</td>
                <td>2020.10.23</td>
              </tr>
              <tr>
                <td>
                  <p>1</p>
                </td>
                <td>위험도</td>
                <td>학생부 종합</td>
                <td>서울대학교</td>
                <td>수학과</td>
                <td>500</td>
                <td>차이</td>
                <td>2020.10.23</td>
              </tr>
              <tr>
                <td>
                  <p>1</p>
                </td>
                <td>위험도</td>
                <td>학생부 종합</td>
                <td>서울대학교</td>
                <td>수학과</td>
                <td>500</td>
                <td>차이</td>
                <td>2020.10.23</td>
              </tr>
              <tr>
                <td>
                  <p>1</p>
                </td>
                <td>위험도</td>
                <td>학생부 종합</td>
                <td>서울대학교</td>
                <td>수학과</td>
                <td>500</td>
                <td>차이</td>
                <td>2020.10.23</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      </SideNavPage>
    </>
  );
};

export default withPayment(regularbeneficial, null, '수시');
