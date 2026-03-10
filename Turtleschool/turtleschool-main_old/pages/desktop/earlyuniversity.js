import {useState} from 'react';
import withPayment from '../../comp/paymentwrapper';
import Menu from '../../comp/susimenu';

const EarlyRegular = () => {
  const [chosen, setChosen] = useState(0);
  const handleClick = e => setChosen(e.target.value);

  const btn = {
    width: '100%',
    height: '80px',
    display: 'flex',
    background: 'linear-gradient(45deg, #FC8454, #D86132)',
    color: 'white',
    webkitTextStroke: '1px',
    alignItems: 'center',
    cursor: 'pointer',
    borderRadius: '16px',
    margin: '40px 0',
    padding: '0 40px',
    fontSize: '30px',
  };
  const s = {
    width: '140px',
    height: '30px',
    color: '#DE6B3D',
    border: '1px solid #DE6B3D',
    borderRadius: '4px',
    lineHeight: '30px',
    margin: '0 auto',
  };

  return (
    <div style={{backgroundColor: '#FAFAFA'}}>
      <Menu title="전형별 대학 예측 및 검색" index={4} />
      <div style={{width: '1280px', margin: '0 auto'}}>
        <div style={{height: '30px', width: '100%'}} />
        <div className="menu">
          {['교과 전형', '학생부 종합 전형', '논술 전형'].map((e, i) => (
            <button value={i} className={chosen == i ? 'menu_active' : ''} onClick={handleClick}>
              {e}
            </button>
          ))}
        </div>
        <div style={{height: '30px', width: '100%'}} />
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className="title_left">대학별 교과 합격 분포</span>
          <span>지역 선택</span>
          <span>수학 선택</span>
        </div>
        <div className="desktop_box" style={{height: '656px'}}></div>
        <div style={btn}>가톨릭대 교과 전형 검색</div>
        <span className="title_left">학과 찾기</span>
        <div style={{display: 'flex', height: '780px'}}>
          <div className="desktop_box" style={{marginRight: '20px', flex: '1 0 0'}}>
            <table className="desktop_box_table">
              <tr>
                <th>학과</th>
                <th>상세 검색</th>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
            </table>
          </div>
          <div className="desktop_box" style={{flex: '1 0 0'}}>
            <table className="desktop_box_table">
              <tr>
                <th>학과</th>
                <th>상세 검색</th>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
              <tr>
                <td>수학과</td>
                <td>
                  <div style={s}>상세 검색하기</div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withPayment(EarlyRegular, null, '수시');
