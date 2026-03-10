import {useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import pool from '../../lib/pool';
import page from '../desktop/gradegraph';

const EarlyInput = ({big, medium, small}) => {
  const [show, setShow] = useState(false);
  const [dae, setDae] = useState('');
  const [jung, setJung] = useState('');
  const [so, setSo] = useState('');
  const [result, setResult] = useState([]);
  const changeBig = e => {
    setDae(e.target.value);
    setJung('');
    setSo('');
  };
  const changeMed = e => {
    setJung(e.target.value);
    setSo('');
  };
  const changeSo = e => {
    setSo(e.target.value);
  };

  const search = () => {
    axios
      .get('/api/gpa/Series', {
        params: {
          large_cd: dae,
          middle_cd: jung,
          small_cd: so,
        },
      })
      .then(res => setResult(res.data.data));
  };
  return (
    <>
      <style jsx>{`
				.textbox {
					background-color: #E8E8E8;
					width: 100%;
					padding: 12px;
					position: relative;
					margin-top: 24px;
					margin-bottom: 24px;
					font: normal normal normal 12px/18px Noto Sans CJK KR;
					border-radius: 8px;
					display: flex;
					flex-direction: column;
				}
				.textbox_first {
					border-bottom: 1px solid #9d9d9d;
					padding-bottom: 12px;
				}
				.textbox_second {
					padding-top: 12px;
					text-align: center;
					color: #9d9d9d;
				}
				.circle {
					background-color: white;
					width: 110px;
					height: 110px;
					display: flex;
					align-items: center;
					flex-direction: column;
					border-radius: 55px;
					padding: 12px;
				}
				.selectbar {
					display: flex;
					margin-right: -13px;
				}
				.selectbar > div {
					flex: 1 0 0;
					margin-right: 13px;
					position: relative;
					margin-bottom: 21px;
				}
				select {
					background: #F4F4F4 0% 0% no-repeat padding-box;
					box-shadow: 0px 3px 6px #00000029;
					padding: 0;
					border-radius: 5px;
					font: normal normal bold 15px Noto Sans CJK KR;
					text-align: center;
					height:40px;
					width:100%;
				}
				.selectbar > div:after {
					content: "▼";
					position:absolute;
					right: 10px;
					top: 50%;
					transform: translateY(-50%);
					pointer-events: none;
				}
				.bignum {
					color: #DE6B3D;
					line-height: 30px;
					font-size: 20px;
					-webkit-text-stroke: 1px;
					width: 50px;
					border-bottom: 1px solid #DE6B3D;
					margin-bottom: 12px;
				}
				.tbl {
					display: grid;
					grid-template-rows: 54px 1fr;
					grid-template-columns: 30% 30% 40%;
					width: 100%;
					grid-gap: 1px;
					background-color: #CBCBCB;
					height: 340px;
					border: 1px solid #cbcbcb;
					border-top: 1px solid #363636;
				}
				.tbl > * {
					padding-left: 30px;
				}
				.one {
					grid-row: 1 / 2;
				}
				.hana {
					grid-column: 1 / 2;
				}
				.two {
					grid-row: 2 / 3;
				}
				.dul {
					grid-column: 2 / 3;
				}
				.set {
					grid-column: 3 / 4;
				}
				.head {
					display: flex;
					align-items: center;
					-webkit-text-stroke: 1px;
					background-color: #fafafa;
				}
				.chosen {
					color: white;
					background-color: #DE6B3D;
				}
				.content {
					display: flex;
					flex-direction: column;
					overflow-y: scroll;
					padding-top: 20px;
					padding-bottom: 20px;
					background-color: white;
				}
				.btn {
					margin: 0 auto;
					width: 240px;
					height: 50px;
					display: flex;
					justify-content: center;
					align-items: center;
					margin-top: 20px;
					margin-bottom: 40px;
					cursor: pointer;
				}
				.cards {
					display: flex;
					position: relative;
					overflow-x: scroll;
					overflow-y: hidden;
					scroll-snap-type: x mandatory;
				}
				.arrow {
					margin: 0 20px;
					transform: translateY(50%);
				}
				.arrow:nth-of-type(1) {
					position:absolute;
					right: 100%;
				}
				.arrow:nth-of-type(2) {
					position:absolute;
					left:100%;
				}
				.card {
					background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
					background: #FFFFFF 0% 0% no-repeat padding-box;
					box-shadow: 2px 2px 8px #0000001F;
					border: 1px solid #E8E8E8;
					border-radius: 8px;
					position: relative;
					scroll-snap-align:start;
					flex: 0 0 217px;
					height: 126px;
					margin-right: 12px;
					padding: 12px 16px;
				}
				.profile {
					width: 50%;
					height: 100%;
					display: inline-block;
					margin-right: 18px;
					background-color: transparent;
				}
				.profile > img {
					width: 100%;
					height: 100%;
				}
				.name {
					position: absolute;
					top: 16px;
					display: inline-block;
					-webkit-text-stroke: 1px;
					line-height: 26px;
					font-size: 18px;
					margin-bottom: 10px;
				}
				.college {
					display: inline-block;
					line-height: 17px;
					font-size: 12px;
					color: #646464;
					margin-right: 8px;
				}
				.major {
					display: inline-block;
					line-height: 15px;
					font-size: 10px;
					color: #646464;
				}
				.ttl {
					 margin-top: 10px;
					 margin-bottom: 10px;
					 line-height: 17px;
					font-size: 12px;
					 #9D9D9D
				}
				.txt {
					font-size: 10px;
					line-height: 15px;
					margin-bottom: 6px;
				}
				.a {
					font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-bold) 22px/31px var(--unnamed-font-family-noto-sans-cjk-kr);
					letter-spacing: var(--unnamed-character-spacing-0);
					text-align: left;
					font: normal normal bold 22px/31px Noto Sans CJK KR;
					letter-spacing: 0px;
					color: #222222;
					opacity: 1;
					margin: 33px 0 12px 0;
				}
				.b {
					font: var(--unnamed-font-style-normal) normal var(--unnamed-font-weight-medium) var(--unnamed-font-size-16)/31px var(--unnamed-font-family-noto-sans-cjk-kr);
					text-align: center;
					font: normal normal bold 16px/31px Noto Sans CJK KR;
					letter-spacing: 0px;
					color: #222222;
				}
				.c {
					display: flex;
					align-items: center;
					justify-content: center;
				}
			`}</style>
      <div style={{width: '90%', margin: '0 auto'}}>
        <div className="textbox">
          <div className="textbox_first">
            <div>
              <p>
                <span className="orange_txt">비교과 분석은</span> 전공별 전문 선생님이 직접 학생
                개개인의 생기부, 자소서를 보고 평가합니다.
              </p>
            </div>
            {show ? (
              <>
                <div>
                  <p>
                    평가는 평가 항목별로 A+, A0, A-, B, C 5단계로 평가되며, 결과에 대한 주석까지
                    함께 제공됩니다.
                  </p>
                </div>
                <div>
                  <p>
                    <span className="orange_txt">이용절차는</span> 전공별 선생님을 검색한후 선생님을
                    선택하고 아래 결제창에서 결제 후
                    <br />
                    세부 내용 입력창을 통해 구체적인 사항을 입력한 후 제출하시면 됩니다.
                  </p>
                </div>
              </>
            ) : null}
          </div>
          <div className="textbox_second" onClick={() => setShow(!show)}>
            상세 설명 {show ? '닫기' : '보기'}
          </div>
        </div>
        <div className="selectbar">
          <div>
            <select value={dae} onChange={changeBig}>
              <option value="">대계열</option>
              {big.map(r => (
                <option value={r.comn_cd}>{r.comn_nm}</option>
              ))}
            </select>
          </div>
          <div>
            <select value={jung} onChange={changeMed}>
              <option value="">중계열</option>
              {medium[dae].map(r => (
                <option value={r.comn_cd}>{r.comn_nm}</option>
              ))}
            </select>
          </div>
          <div>
            <select value={so} onChange={changeSo}>
              <option value="">소계열</option>
              {small[jung].map(r => (
                <option value={r.comn_cd}>{r.comn_nm}</option>
              ))}
            </select>
          </div>
        </div>
        <button className="orangebigbtn">검색하기</button>
        <div className="a">검색 결과 선생님 리스트</div>
        <div className="cards">
          {result.map(r => (
            <div className="card">
              <div className="profile">
                <img src={'https://img.ingipsy.com/profile-img/' + r.imgpath + '.jpg'} />
              </div>
              <div className="name">{r.user_name}</div>
              <div className="college">{r.univ}</div>
              <div className="major">{r.department}</div>
            </div>
          ))}
        </div>
        <div className="textbox">
          <div>
            <p>
              <span className="orange_txt">비교과 분석 결제는 </span> 수시합격예측 페이지를 통해서
              들어와야만 이용하실 수 있습니다.
            </p>
          </div>
        </div>
        <div className="c">
          <span className="b">수시합격예측 바로가기</span>
          <img
            src="https://img.ingipsy.com/assets/icons/arrow_left.svg"
            style={{transform: 'scale(-1,1)'}}
          />
        </div>
      </div>
    </>
  );
};
export default withDesktop(page, EarlyInput);

export async function getStaticProps() {
  const {rows} = await pool.query(
    `select comn_grp_cd , comn_cd, comn_nm, comn_grp_nm, useyn , sort ,
    lar_cd , mid_cd , sml_cd
		 from commoncode where comn_grp_cd = $1 or comn_grp_cd = $2 or comn_grp_cd = $3 order by comn_grp_cd asc`,
    ['A00001', 'A00002', 'A00003'],
  );
  const bigDivision = rows.filter(r => r.comn_grp_cd == 'A00001');
  const mediumDivison = rows.reduce((obj, row) => {
    if (row.comn_grp_cd == 'A00002') {
      const bigCode = row.comn_cd.slice(0, 2);
      if (!obj[bigCode]) obj[bigCode] = [];
      obj[bigCode].push(row);
    }
    return obj;
  }, {});
  mediumDivison[''] = [];
  const smallDivison = rows.reduce((obj, row) => {
    if (row.comn_grp_cd == 'A00003') {
      const medCode = row.comn_cd.slice(0, 4);
      if (!obj[medCode]) obj[medCode] = [];
      obj[medCode].push(row);
    }
    return obj;
  }, {});
  smallDivison[''] = [];
  smallDivison['0204'] = [];
  return {
    props: {big: bigDivision, medium: mediumDivison, small: smallDivison},
  };
}
