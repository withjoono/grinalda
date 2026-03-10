import {Alert} from '@material-ui/lab';
import React, {useEffect, useState} from 'react';
import Dialog from '../comp/dialog';
import Payment from './payment';

const sel = {
  border: '1px solid #9d9d9d',
  borderRadius: '6px',
  height: '2em',
  width: '10em',
  marginLeft: '1em',
  padding: '0 0.5em',
};

const pos = {
  position: 'absolute',
  right: '0.5em',
  top: 'calc(1em - 12px)',
  zIndex: -1,
};

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const discountPrice = [10000, 19000, 29500, 34500];
// [0] = 10,000 / [1] = 19,000 / [2] = 29,000 / [3] = 34,500

const initialInfo = {
  pg: 'kcp',
  pay_method: 'card',
  merchant_uid: makeid(10),
  name: '',
  amount: '',
  buyer_name: '',
  buyer_tel: '',
  buyer_email: '',
  buyer_addr: '',
  buyer_postcode: '',
  m_redirect_url: process.env.NEXT_PUBLIC_HOME_URL + '/paypage',
};

const Payform = ({payments: _payments, user, open, stat}) => {
  const [payments, setPayments] = useState(_payments);

  const [info, setInfo] = useState({
    pg: 'kcp',
    pay_method: 'card',
    merchant_uid: makeid(10),
    name: '',
    amount: '',
    buyer_name: '',
    buyer_tel: '',
    buyer_email: '',
    buyer_addr: '',
    buyer_postcode: '',
    m_redirect_url: process.env.NEXT_PUBLIC_HOME_URL + '/welcome',
  });

  const changeHandler = (n, v) => {
    setInfo(prevState => {
      let info = Object.assign({}, prevState);
      info[n] = v;
      return info;
    });
  };

  const paymentTypeHandler = e => {
    let v = e.target.value;
    if (v === '') {
      setInfo(initialInfo);
    } else {
      setInfo(p => {
        let info = Object.assign({}, p);
        info['name'] = payments[v].name;
        info['amount'] = payments[v].price;
        return info;
      });
    }
  };

  //   const a = React.useMemo(() => {
  //     if (stat[0]) {
  //       return (
  //         <>
  //           <p>가격: {stat[0].amount}원</p>
  //           <p>은행:{stat[0].vbank_name}</p>
  //           <p>이름:{stat[0].vbank_holder}</p>
  //           <p>계좌번호:{stat[0].vbank_num}</p>
  //         </>
  //       );
  //     }
  //   }, [stat[0]]);

  return (
    <>
      <style jsx>{`
        * {
          margin: 0px;
          padding: 0px;
          font-family: 'Noto Sans CJK KR';
        }

        li {
          list-style: none;
        }

        a {
          text-decoration: none;
        }
        body {
          width: 100%;
        }
        .contain {
          width: 1280px;
          margin: auto;
          margin-top: 100px;
        }
        header {
          font-size: 30px;
          font-weight: bold;
          width: 550px;
          text-align: center;
          margin: 54px auto;
          height: 10px;
        }
        hr {
          width: 550px;
          background-color: #cbcbcb;
          margin: auto;
        }
        section {
          box-shadow: 0px 0px 20px rgba(00, 00, 00, 8%);
          width: 550px;
          margin: 19px auto;
        }
        .target {
          display: flex;
          justify-content: space-around;
        }
        .ttl {
          margin-top: 25px;
          font-size: 20px;
        }
        select {
          margin-top: 15px;
          width: 360px;
          height: 46px;
          border: 1px #707070 solid;
          border-radius: 3px;
          padding: 3px;
        }

        .payment {
          margin-left: 25px;
          color: #646464;
          height: 130px;
        }
        .payment p {
          font-size: 12px;
          margin-top: 20px;
        }
        .cash {
          width: 126px;
          height: 80px;
          border: 1px #9d9d9d solid;
          background-color: #f5f5f5;
          float: left;
          margin-top: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .card {
          width: 126px;
          height: 80px;
          border: 1px #9d9d9d solid;
          background-color: #f5f5f5;
          float: left;
          margin-left: 16px;
          margin-top: 20px;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .active {
          background-color: #de6b3d;
          color: white;
        }
        .total {
          width: 480px;
          margin: auto;
          display: flex;
          justify-content: space-between;
          line-height: 50px;
          height: 50px;
          font-size: 20px;
          font-weight: bold;
        }
        .coupon_box {
          margin-left: 25px;
          display: flex;
          align-items: center;

          margin: 0 0 20px 20px;
        }
        .coupon_input {
          border: 1px solid #000;
          padding: 5px;
          margin: 0 10px;
          border-radius: 8px;
        }
        .coupon_btn {
          margin: 0;
          padding: 0.5rem 1rem;
          font-size: 14px;
          font-weight: 400;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          width: auto;
          border: none;
          background-color: gray;
          color: #fff;
          border-radius: 4px;
        }
        @media (max-width: 640px) {
          .contain {
            width: 90%;
            margin: 0 auto;
            min-height: 80vh;
          }
          header {
            font-size: 30px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            margin: 54px auto;
            height: 10px;
          }
          section {
            width: 100%;
            margin: 0 auto;
            padding: 12px;
          }
          .total {
            width: 100%;
          }
          .target {
            width: 100%;
            align-items: center;
          }
          .payment {
          }
          hr {
            width: 100%;
          }
          .ttl {
            margin-top: 0px;
            font-size: 16px;
          }
          select {
            width: 360px;
            height: 46px;
            border: 1px #707070 solid;
            border-radius: 3px;
            padding: 3px;
          }
        }
      `}</style>
      {/* <Dialog
        title="가상계좌 생성"
        content={a}
        buttons={[]}
        open={openModal}
        handleClose={handleClose}
      /> */}
      <div className="contain">
        <header>결제하기</header>
        <hr />
        <section>
          <div className="target">
            <div className="ttl">서비스 선택</div>
            <select name={info.name} defaultValue="" onChange={paymentTypeHandler}>
              <option value={''} key={'ㅁ'}>
                선택해 주세요
              </option>
              {payments
                .filter(e => {
                  if (e.name.indexOf('c') === -1) return e;
                })
                .map((e, i) => {
                  return (
                    <option value={i} key={e.name + i.toString()}>
                      {e.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="payment">
            <p> 결제 방법 선택</p>

            <div
              className={info.pay_method == 'vbank' ? 'cash active ' : 'cash'}
              onClick={() => changeHandler('pay_method', 'vbank')}
            >
              가상계좌
            </div>
            <div
              className={info.pay_method == 'card' ? 'card active ' : 'card'}
              onClick={() => changeHandler('pay_method', 'card')}
            >
              카드
            </div>
          </div>

          {/* {useCouponIndex === null && info.name === '정시합격예측' && (
            <div className="coupon_box">
              <span></span>
            </div>
          )} */}
          <hr />
          <div className="total">
            <p>합계</p>
            <p>{info.amount.toString().toLocaleString('ko-KR')}원</p>
          </div>
          {info.amount != '' ? (
            <Payment info={info} user={user} open={open} stat={stat}></Payment>
          ) : null}
        </section>
      </div>
    </>
  );
};

export default Payform;
