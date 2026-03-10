import React from 'react';

const InforWrapper = () => {
    const message = [
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
        <div className='infor'>
            {/* <div>
                <a href='https://www.turtleschool.kr/'>
                    <img style={{ width: '100%' }} src='/assets/main_banner/banner_jungsi_2022.jpeg'></img>
                </a>
            </div>
            <img src='/assets/main_banner/banner_jungsi_process_2022.jpeg' className='center-img'></img> */}
            <img src='/assets/main_banner/analysis@3x.png' className='center-img' />
            <div
                style={{
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%',
                    maxWidth: 1920,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: '100px 320px',
                }}>
                <div className='title_container'>
                    <div className='sub_title'>거북스쿨</div>
                    <div className='title'>정시 컨설팅</div>
                    <button className='btn_book' onClick={() => window.location.href = '/paypage'}>예약하기</button>
                </div>
                <div className='message_container'>
                    {message.map((item) => (
                        <div className='box_container'>
                            <div className='row_box'>
                                <div className='box_title'>
                                    {item.title}
                                    <div className='box_line' />
                                </div>
                            </div>
                            <div className='box_text'>{item.text}</div>
                        </div>
                    ))}
                </div>
            </div>
            {/*  <div className='infor_border'>
                 
                       <div className='infor_title'>
                  
                            <div style={{ color: '#3D94DE' }}>플래너</div>이용안내 <br></br>
                        </div>
                        <div className='infor_text'>
                            <div className='infor_text_small'>
                                플래너는 거북스쿨에서만 사용할 수 있는 무료 서비스로, 주간 루틴을 설정하면 장기적인 계획이 수립되고 하루에 달성해야하는 미션과 시간이
                                <br></br>언제인지 할당이 됩니다. 할당된 미션을 마치면 성취도가 쌓이고 멘토로부터 피드백을 받게됩니다.
                            </div>
                            <div className='infor_number'>
                                <img src='/assets/home_icon/4number.png' />
                         
                            </div>
                            <div className='use' onClick={() => navs(2)}>
                                이용하러 가기
                            </div>
                        </div> 
                    </div>*/}

            <style jsx>{`
                .message_container {
                    display: flex;
                    flex-direction: column;
                    margin-left: auto;
                }
                .box_container {
                    padding: 36px 70px;
                    background: #ffffff;
                    border-radius: 36px 0px 0px 36px;
                    margin-left: auto;
                    margin-bottom: 24px;
                }
                .box_title {
                    font-weight: 800;
                    font-size: 28px;
                    line-height: 36px;
                    margin-bottom: 32px;
                    position: relative;
                    margin-right: auto;
                }
                .row_box {
                    display: flex;
                    flex-direction: row;
                }
                .box_line {
                    height: 16px;
                    width: 100%;
                    background: #f45119;
                    opacity: 0.2;
                    position: absolute;
                    bottom: 0px;
                    margin-right: auto;
                }
                .box_text {
                    font-weight: normal;
                    font-size: 20px;
                    line-height: 28px;
                    width: 100%;
                    white-space: pre-wrap;
                }
                .title {
                    font-weight: 800;
                    font-size: 48px;
                    line-height: 54px;
                    color: #000000;
                    margin-bottom: 40px;
                }
                .sub_title {
                    font-weight: normal;
                    font-size: 28px;
                    line-height: 28px;
                    color: #656565;
                    margin-bottom: 24px;
                }
                .btn_book {
                    background: #f45119;
                    border-radius: 20px;
                    padding: 16px 90px;
                    font-weight: bold;
                    font-size: 18px;
                    line-height: 26px;
                    color: white;
                }
                .infor {
                    width: 100%;
                    background-color: #eeeeee;
                    margin-top: -20px;
                }
                .infor-img {
                    margin: auto;
                    width: 1280px;
                }
                .infor_border {
                    display: flex;
                    justify-content: space-between;
                }
                .infor_border .infor_title {
                    width: 271px;
                    font-size: 36px;
                    font-weight: 500;
                    margin-top: 46px;
                }
                .infor_border .infor_text_small {
                    width: 900px;
                    margin-top: 77px;
                    font-size: 15px;
                    font-weight: bold;
                    margin-left: 100px;
                }
                .infor_border .infor_number {
                    width: 810px;
                    height: 180px;
                    font-size: 16px;
                    font-weight: bold;
                    margin: 40px auto;
                }
                .infor_border .use {
                    width: 166px;
                    height: 40px;
                    border: 1px #000000 solid;
                    text-align: center;
                    line-height: 40px;
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
                    max-width: 1920;
                }
            `}</style>
        </div>
    );
};

export default InforWrapper;
