import {useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import page from '../desktop/earlyoptions';

const EarlyOption = () => {
  const [options, setOptions] = useState(Array(15).fill(false));
  const names = [
    '대학별 독자적 기준',
    '고른기회 특별전형',
    '특기자',
    '농어촌 학생',
    '특성화고교 졸업자',
    '특성화고 등을 졸업한 재직자',
    '기초생활수급자, 차상위계층, 한부모가족 지원대상자',
    '장애인 등 대상자',
    '산업대 위탁생',
    '서해 5도',
    '제주특별자치도 특별전형',
    '계약학과',
    '위탁교육생',
    '군위탁생',
    '재외국민 및 외국인',
  ];

  const handleOptions = e => {
    options[e.target.value] = !options[e.target.value];
    setOptions([...options]);
  };

  return (
    <div className="page" style={{width: '90%', margin: '0 auto'}}>
      <style jsx>{`
        .t {
          border-collapse: collapse;
          text-align: center;
        }
        .t th {
          height: 45px;
          background-color: #de6b3d;
          color: white;
        }
        .t td {
          height: 45px;
          background-color: #ffebc3;
          color: black;
        }
        .s {
          background-color: #de6b3d !important;
          color: white !important;
        }
        .t > tr:nth-child(4) {
          border-bottom: 1px solid #de6b3d;
        }
        .b {
          width: 20px;
          height: 20px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          border: 1px solid #de6b3d;
          background-color: white;
          padding: 0;
          margin: 0;
        }
        .a {
          background-color: #de6b3d;
        }
      `}</style>
      <div style={{height: '22px', width: '100%'}} />
      <div style={{lineHeight: '30px', fontSize: '22px', marginBottom: '22px'}}>
        수시 특별 전형 자격 확인
      </div>
      <table className="t">
        <tr>
          <th>정원 내/외</th>
          <th>전형명</th>
          <th>자격 여부 확인</th>
        </tr>
        {names.map((n, i) => (
          <tr>
            {i == 0 ? (
              <td rowSpan="3" className="s">
                특별전형
                <br />
                (정원내)
              </td>
            ) : i == 3 ? (
              <td rowSpan="12" className="s">
                특별전형
                <br />
                (정원외)
              </td>
            ) : null}
            <td>{n}</td>
            <td>
              <button
                onClick={handleOptions}
                value={i}
                className={options[i] ? 'a b' : 'b'}
              ></button>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
};
export default withDesktop(page, EarlyOption);
