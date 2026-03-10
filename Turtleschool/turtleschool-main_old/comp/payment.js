import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import {useQueryClient} from 'react-query';

const btn = {
  backgroundColor: '#DE6B3D',
  height: '50px',
  width: '200px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
};
const discountPrice = [];
const nameFromPrice = ['2024 정시합격예측', '2024 수시합격예측', '2024 정시+수시 합격예측'];

const Payment = props => {
  const {info, stat, open} = props;

  const [_info, setInfo] = useState(info);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setInfo(info);
  }, [info]);
  useEffect(() => {
    const targetNode = document.getElementsByTagName('body')[0];

    // Options for the observer (which mutations to observe)
    const config = {attributes: true, childList: true, subtree: true};

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'childList' &&
          mutation.addedNodes[0] &&
          mutation.addedNodes[0].tagName == 'IFRAME'
        ) {
          mutation.addedNodes[0].style.zIndex = 10;
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    return function cleanup() {
      observer.disconnect();
    };
  }, []);

  //   const onClickPayment = () => {
  //     const id = {
  //       imp_uid: 'res.imp_uid',
  //       merchant_uid: 'res.merchant_uid',
  //       uid: localStorage.getItem('realuid'),
  //     };
  //     axios({
  //       url: '/api/verifypayment',
  //       method: 'post', // POST method
  //       headers: {'Content-Type': 'application/json'}, // "Content-Type": "application/json"
  //       data: {id},
  //     });
  //   };

  const onClickPayment = e => {
    e.preventDefault();
    /* 1. 가맹점 식별하기 */

    const {IMP} = window;
    IMP.init('imp54305088');
    /* 2. 결제 데이터 정의하기 */
    /**const {
                pg,                           // PG사
                pay_method,                           // 결제수단
                merchant_uid,   // 주문번호
                amount,                                 // 결제금액
                name,                  // 주문명
                buyer_name,                           // 구매자 이름
                buyer_tel,                     // 구매자 전화번호
                buyer_email,               // 구매자 이메일
                buyer_addr,                    // 구매자 주소
                buyer_postcode,                      // 구매자 우편번호
              } = this.props.info;**/
    /* 4. 결제 창 호출하기 */

    IMP.request_pay({..._info}, async res => {
      if (res.success) {
        const id = {
          imp_uid: res.imp_uid,
          merchant_uid: res.merchant_uid,
          uid: localStorage.getItem('realuid'),
          amountToBePaid: _info.amount,
        };
        axios({
          url: '/api/verifypayment',
          method: 'post', // POST method
          headers: {'Content-Type': 'application/json'}, // "Content-Type": "application/json"
          data: {id},
        })
          .then(data => {
            switch (data.data.status) {
              case 'ready':
                alert('결제 완료되었습니다.');
                window.open(
                  process.env.NEXT_PUBLIC_HOME_URL + '/paySuccess',
                  '',
                  'width=840,height=620,top=0,left=0',
                );
                queryClient.invalidateQueries('payment');
                router.push('/');
                break;
              case 'paid':
                router.push('/');
                queryClient.invalidateQueries('payment');

                window.open(
                  process.env.NEXT_PUBLIC_HOME_URL + '/paySuccess',
                  '',
                  'width=840,height=620,top=0,left=0',
                );
                stat[1](data.data);
                open[1](true);
                break;
              case 'forgery':
                alert(`결제 실패: ${data.res.message}`);
                break;
            }
          })
          .catch(err => {
            console.error(err);
            alert(`결제 실패: ${res.message}`);
          });
      } else {
        // alert(`결제 실패: ${res.message}`);
      }
    });
  };

  /* 3. 콜백 함수 정의하기 */
  return (
    <button onClick={onClickPayment} style={btn}>
      결제하기
    </button>
  );
};

export default Payment;
