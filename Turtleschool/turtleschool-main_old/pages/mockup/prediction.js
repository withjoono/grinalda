import {useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import page from '../desktop/examobjective';

const EarlyInput = () => {
  const [chosen, setChosen] = useState(0);

  return (
    <div className="page" style={{width: '90%', margin: '0 auto'}}>
      <div style={{height: '24px', width: '100%'}} />
      <style jsx>{`
        .m {
          font: normal normal bold 22px/31px Noto Sans CJK KR;
          letter-spacing: 0px;
          color: #222222;
          opacity: 1;
        }
        .s {
          text-align: left;
          font: normal normal bold 14px/20px Noto Sans CJK KR;
          letter-spacing: 0px;
          color: #000000;
          opacity: 1;
          margin-top: 24px;
        }
        input {
          background: #ffffff 0% 0% no-repeat padding-box;
          border: 1px solid #707070;
          border-radius: 3px;
          opacity: 1;
          padding: 16px;
          font: normal normal normal 16px/18px Noto Sans CJK KR;
          letter-spacing: 0px;
          color: #363636;
          opacity: 1;
          width: 100%;
        }
        .btn {
          background: #de6b3d 0% 0% no-repeat padding-box;
          border-radius: 3px;
          opacity: 1;
          width: 100%;
          height: 47px;
          margin-top: 24px;
          margin-bottom: 30px;
          display: flex;
          color: white;
          font: normal normal normal 18px/27px Noto Sans CJK KR;
          align-items: center;
          justify-content: center;
        }
      `}</style>
      <div className="m">목표 대학 설정</div>
      <div className="s">대학</div>
      <input placeholder="대학 입력" />
      <div className="s">학과</div>
      <input placeholder="학과 입력" />
      <div className="btn">목표대학 점수 확인하기</div>
      <div className="s">배점 분석</div>
      <table className="mobile_table">
        <tr>
          <th>전형</th>
          <th>목표대학점수</th>
          <th>내 점수</th>
          <th>차이</th>
        </tr>
        <tr>
          <th>정시</th>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
      </table>
    </div>
  );
};
export default withDesktop(page, EarlyInput);
