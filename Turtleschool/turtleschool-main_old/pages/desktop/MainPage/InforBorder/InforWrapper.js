import React from 'react';

const InforWrapper = () => {
  const message_susi = [
    {
      title: '가. 프로세스식 자동 컨설팅',
      text: '- 대개의 합격 예측 프로그램은, 파고 들면 들수록, 머리만 아프고 복잡해지기만 함.\n- 거북스쿨은 단계별 필터링 방식으로, 최적의 조합을 도출해주는 방식',
    },
    {
      title: '나. 페이지마다 거북쌤의 사용법과 입시 코칭 영상',
      text: '- 혹시 의심하는 분들을 위해, 페이지마다 설명과 코칭 영상 병행(페이지 오른쪽 하단 이모콘)',
    },
    {
      title: '다. 정확성',
      text: '- 대학이 발표한 입결 데이터와 60만껀의 합불 AI 분석',
    },
    {
      title: '라. 모의지원 표본 확보를 위해, 무료 모의지원 앱 별도 출시',
      text: '- 거북스쿨 사용자에게는 무료모의지원 앱에서 나오는 귀중한 자료까지 제공',
    },
  ];
  const message_jungsi = [
    {
      title: '예측뿐 아니라, 프로세스 진행 10분만에 최상의 조합 제공!',
      text: 'J사, U사, 머리 아프게 예측 자료만 많이 주고, 정작 뭘하라는 건지는 모르는 타사 예측\n프로그램과는 달리, 프로세스를 진행해 가면서, 본인에게 가장 유리한 곳을 제시해주는\n컨설팅',
    },
    {
      title: '무료 모의지원 앱 병행으로 모의지원 표본 확대 및 유의미한 데이터 확보',
      text: '- 교차지원과 연쇄이동 현황 제공\n- 확대된 모집단으로 인해, 오차율 4%이하의 지원 순위, 예측컷 제공',
    },
    {
      title: '거북스쿨 프로세스 단계마다 ‘입시 컨설팅 동영상’으로 코칭',
      text: '- 대치동 20년 입시 컨설팅 경력의 거북쌤의 입시 코칭 동영상\n- 교차지원과 그로 인한 연쇄이동으로 인한 추합, 예측컷 변동 등에 대한 설명 영상\n- 거북스쿨 프로세스별 사용법 설명 영상',
    },
    {
      title: '교차지원 특화 프로세스',
      text: '- 연쇄이동으로 인한, 많은 변수를, 모의지원 결과를 보면서 모니터링, 예측\n컷으로 조정(총 7차 조정 예정)\n- 대학별 다전공 제도 안내',
    },
    {
      title: '끝까지 책임진다!!',
      text: "4차에 걸친 '끝까지' 서비스\n- 접수 기간 중, 경쟁률 취약 학과 통지 서비스\n- 최초합, 추합 결과 확인 후, 추가 모집 안내 & 컨설팅",
    },
    {
      title: '타업체에는 없는 차별화된 서비스',
      text: "- 특정 대학/학과의 나에게 '유불리한 점수 차이' 제시(특허출원)\n- 추가모집 컨설팅\n- 교차지원 전문 분석 서비스\n- 퀵 알람 서비스 - 수시 충원 인원, 모의 지원 결과, 변동표준점수\n• 경쟁률 한눈에 조회 서비스",
    },
  ];
  return (
    <div className="infor">
      <div
        style={{
          display: 'block',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '64rem',
          display: 'flex',
          flexDirection: 'row',
          //justifyContent: 'space-between',
          padding: '5rem 0rem',
        }}
      >
        <div
          style={{
            width: '40%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="title_container">
            <div className="title">수시 컨설팅</div>
            <div className="sub_title">(by 거북스쿨 플랫폼)</div>
            <button className="btn_book" onClick={() => (window.location.href = '/paypage')}>
              예약하기
            </button>
          </div>

          <div style={{width: '100%'}}>
            <iframe
              width="100%"
              height="295px"
              src="https://www.youtube.com/embed/e9M9h0bNZms"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="message_container">
          {message_susi.map((item, index) => (
            <div key={index} className="box_container">
              <div className="row_box">
                <div className="box_title">
                  {item.title}
                  <div className="box_line" />
                </div>
              </div>
              <div className="box_text">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .message_container {
          display: flex;
          flex-direction: column;
        }
        .box_container {
          padding: 1.8rem;
          marginLeft: 70px;
          background: #ffffff;
          border-radius: 1.8rem 0px 0px 1.8rem;
          margin-left: auto;
          margin-bottom: 1.2rem;
        }
        .box_title {
          font-weight: 800;
          font-size: 1.4rem;
          line-height: 1.8rem;
          margin-bottom: 1.8rem;
          position: relative;
          margin-right: auto;
        }
        .row_box {
          display: flex;
          flex-direction: row;
        }
        .box_line {
          height: .8rem;
          width: 100%;
          background: #f45119;
          opacity: 0.2;
          position: absolute;
          bottom: 0px;
          margin-right: auto;
        }
        .box_text {
          font-weight: normal;
          font-size: 1rem;
          line-height: 1.4rem;
          width: 100%;
          white-space: pre-wrap;
        }
        
        .title_container {
          display: 'flex',
          flex-direction: 'column',
          align-items: 'center',
        }
        .title {
          font-weight: 800;
          font-size: 2.4rem;
          line-height: 2.7rem;
          color: #000000;
          margin-bottom: 2rem;
        }
        .sub_title {
          font-weight: normal;
          font-size: 2.4rem;
          line-height: 2.4rem;
          color: #656565;
          margin-bottom: 1.2rem;
        }
        .btn_book {
          background: #f45119;
          border-radius: 1rem;
          padding: .8rem 4.5rem;
          font-weight: bold;
          font-size: .9rem;
          line-height: 1.3rem;
          color: white;
        }
        .infor {
          width: 100%;
          background-color: #eeeeee;
          margin-top: -1rem;
        }
        .infor-img {
          margin: auto;
          width: 64rem;
        }
        .infor_border {
          display: flex;
          justify-content: space-between;
        }
        .infor_border .infor_title {
          width: 13.5rem;
          font-size: 1.8rem;
          font-weight: 500;
          margin-top: 2.3rem;
        }
        .infor_border .infor_text_small {
          width: 45rem;
          margin-top: 3.7rem;
          font-size: .75rem;
          font-weight: bold;
          margin-left: 5rem;
        }
        .infor_border .infor_number {
          width: 40.5rem;
          height: 9rem;
          font-size: .75rem;
          font-weight: bold;
          margin: 2rem auto;
        }
        .infor_border .use {
          width: 8.3rem;
          height: 2rem;
          border: 1px #000000 solid;
          text-align: center;
          line-height: 2rem;
          margin: auto;
          cursor: pointer;
        }
        .infor_border .use:hover {
          text-decoration: underline;
        }
        .center-img {
          display: block;
          margin-left: auto;
          margin-right: auto;
          width: 100%;
          max-width: 96rem;
        }
      `}</style>
    </div>
  );
};

export default InforWrapper;
