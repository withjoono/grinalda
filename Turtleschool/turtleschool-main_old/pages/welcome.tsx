import axios from 'axios';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {isMobile} from 'react-device-detect';

const Welcome = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isMobile && isLoading) {
      const url = window.location.href;
      const arr = url.split('&');
      const _data = [];
      arr.forEach(text => {
        const _text = text.split('=');
        _data.push(_text[1]);
      });

      if (_data[2]) {
        const id = {
          imp_uid: _data[0],
          merchant_uid: _data[1],
          uid: localStorage.getItem('realuid'),
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
                setIsLoading(false);
                alert('결제 완료되었습니다.');

                break;
              case 'paid':
                setIsLoading(false);
                setTimeout(() => {
                  router.replace('/');
                }, 3000);
                break;
              case 'forgery':
                // alert(`결제 실패: ${data.message}`);
                break;
            }
          })
          .catch(err => {
            alert(`결제 실패: ${err.message}`);
          });
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) <></>;

  const onClickCloseBtn = () => {
    console.log('버튼 끄기');
    localStorage.setItem('isPopUpOpen', 'false');
    window.close();
  };

  return (
    <>
      <section>
        <div className="wordBox">
          <img
            src="https://img.ingipsy.com/assets/home_icon/logo_hori.png"
            style={{cursor: 'pointer'}}
            width="174dp"
            height="68dp"
            alt=""
          />
          <h3>거북스쿨 서비스 시작일 : 22년 11월 21일(월)</h3>
          <p style={{fontSize: '1rem', alignItems: 'center'}}>
            아직 수능점수가 나오지 않은, 불확실한 상황이기 때문에, 모집단 데이터는 클수록
            정확해집니다.
            <br /> 거북스쿨은, 보다 정확한 데이터를 제공하기 위해서, 6개사 데이터를 통합 분석하기
            때문에 (각 사의 모집단수 가중치 적용, 평균) 데이터 제공이 2~3일 늦는다는 점,
            양해부탁드립니다.
          </p>
        </div>
        <div style={{position: 'absolute', bottom: 10, right: 10}}>
          <label>
            <input onClick={onClickCloseBtn} id="closePopUp" type="radio"></input>이 페이지 그만보기
          </label>
        </div>
      </section>
      <style jsx>{`
        section {
          display: flex;
          flex: 1;
          flex-grow: 1;
          align-items: center;
          justify-content: center;
          height: 620px;
          padding: 3rem;
        }
        .wordBox {
          flex-direction: column;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .wordBox img {
          margin-right: 1rem;
        }
        h3 {
          text-align: center;
          font-size: 1.7rem;
        }
      `}</style>
    </>
  );
};

export default Welcome;
