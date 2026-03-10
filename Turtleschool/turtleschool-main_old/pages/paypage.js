import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import Payform from '../comp/payform';
import usePaywall from '../comp/paymentwrapper';
import ProductCard from '../components/organisms/card/productCard';
import loginContext from '../contexts/login';
import pool from '../lib/pool';
import {useLoginCheck} from '../src/hooks/useLoginCheck';

const Paypage = ({payments}) => {
  useLoginCheck();

  const {user} = useContext(loginContext);
  const params = new URLSearchParams(location.search);
  const [open, setOpen] = useState(false);
  const [stat, setStat] = useState(null);
  const [openPayment, setOpenPayment] = useState(true);
  const [def, setDef] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };
  const f = async id => {
    await axios({
      method: 'post', // POST method
      url: '/api/verifypayment',
      headers: {'Content-Type': 'application/json'}, // "Content-Type": "application/json"
      data: id,
    })
      .then(data => {
        // 응답 처리
        switch (data.data.status) {
          case 'ready':
            setStat(data.data);
            handleOpen();
            break;
          case 'forgery':
            alert(`결제 실패: ${data.data}}`);
            break;
        }
      })
      .catch(err => {
        alert(`결제 실패: ${err}`);
      });
  };

  useEffect(() => {
    if (params.has('imp_uid') && params.has('merchant_uid')) {
      const id = {
        imp_uid: params.get('imp_uid'),
        merchant_uid: params.get('merchant_uid'),
        uid: user[0],
      };
      f(id);
    }
  }, []);

  useEffect(() => {}, [open]);

  if (openPayment) {
    return (
      <Payform
        payments={payments}
        user={user}
        open={[open, setOpen]}
        stat={[stat, setStat]}
        def={def}
      />
    );
  }
  return (
    <>
      <section>
        <div className="titleBox">
          <p
            style={{marginTop: '20px', marginBottom: '20px', color: '#b8b8b8', fontWeight: 'bold'}}
          >
            이용권
          </p>
          <h1>거북스쿨만의 입시 서비스</h1>
          <h1>지금, 할인된 가격으로 체험해 보세요.</h1>
        </div>
        <div className="productContainer">
          <ProductCard
            icon="🏠"
            title="2024 정시 합격 예측"
            upContent={'69,000원 '}
            titleColor="orange"
            onClick={() => setOpenPayment(true)}
          />
        </div>
      </section>
      <style jsx>{`
        section {
          padding: 5rem 5rem 0 5rem;
        }
        .titleBox {
          margin-bottom: 1rem;
          margin: auto;
        }
        .titleBox h1,
        .titleBox p {
          font-size: 1.2rem;
        }
        .productContainer {
          display: flex;
          justify-content: center;
        }
        @media (max-width: 840px) {
          section {
            padding: 0;
          }
          .titleBox {
            margin-left: 2rem;
          }
          .productContainer {
            flex-wrap: wrap;
            /* flex-direction: column; */
            align-items: center;
          }
        }
      `}</style>
    </>
  );
};

export async function getStaticProps(context) {
  let d = await pool.query(`select id, "name" , price , dependence  from paymenttypes`);

  return {
    props: {
      payments: d.rows,
    },
  };
}

export default usePaywall(Paypage, Paypage);
