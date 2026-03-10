import Payform from '../comp/payform';
import loginContext from '../contexts/login';
import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import usePaywall from '../comp/paymentwrapper';
import pool from '../lib/pool';

const paypage = ({ payments }) => {
    const { user } = useContext(loginContext);
    const params = new URLSearchParams(location.search);
    const [open, setOpen] = useState(false);
    const [stat, setStat] = useState(null);
    const [openPayment, setOpenPayment] = useState(false);
    const [def, setDef] = useState('');

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const f = async (id) => {
        await axios({
            method: 'post', // POST method
            url: '/api/verifypayment',
            headers: { 'Content-Type': 'application/json' }, // "Content-Type": "application/json"
            data: id,
        })
            .then((data) => {
                console.log(data.data); // 응답 처리
                switch (data.data.status) {
                    case 'ready':
                        console.log(data.data);
                        setStat(data.data);
                        handleOpen();
                        break;
                    case 'forgery':
                        alert(`결제 실패: ${data.data}}`);
                        break;
                }
            })
            .catch((err) => {
                console.log(err);
                alert(`결제 실패: ${data.data}`);
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

    useEffect(() => {
        console.log(open);
    }, [open]);

    const payform = <Payform payments={payments} user={user} open={[open, setOpen]} stat={[stat, setStat]} def={def} />;

    if (openPayment) return payform;

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
                    white-space: pre-line;
                    text-align: center;
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
                    margin-top: 80px;
                    padding-bottom: 36px;
                }
                .pay {
                    margin-top: 25px;
                    display: flex;
                    justify-content: space-between;
                }
                .payBox {
                    width: 20%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .payBox .ttl {
                    color: #de6b3d;
                    font-size: 24px;
                    font-weight: bold;
                    margin-top: 36px;
                }
                .box1 {
                    border-bottom: 1px;
                }
                .button {
                    width: 182px;
                    height: 36px;
                    color: white;
                    background-color: #de6b3d;
                    border-radius: 24px;
                    text-align: center;
                    line-height: 36px;
                    margin-top: 30px;
                    cursor: pointer;
                }

                .price {
                    margin-top: 21px;
                    font-size: 28px;
                    font-weight: bold;
                }
                /* .pay .payBox:nth-child(n + 3) .price {
                    margin-top: 3px;
                    font-size: 28px;
                    font-weight: bold;
                }
                .pay2 .payBox:nth-child(n + 1) .price {
                    margin-top: 3px;
                    font-size: 28px;
                    font-weight: bold;
                } */

                .small {
                    font-size: 12px;
                    color: #9d9d9d;
                    margin-top: 22px;
                }
                .text:nth-of-type(1) {
                    margin-top: 35px;
                }
                .text:nth-child(n + 2) {
                    margin-top: 17px;
                }
                .text ul li:nth-of-type(1) {
                    color: #9d9d9d;
                    font-size: 12px;
                }
                hr {
                    width: 550px;
                    margin-top: 31px;
                    color: #cbcbcb;
                }

                .pay2 {
                    margin-top: 30px;
                }
                .color {
                    color: #de6b3d;
                }
                .notice {
                    margin-top: 20px;
                }
                .notice2 {
                    margin-top: 40px;
                }
                .block {
                    display: flex;
                    justify-content: space-between;
                }

                @media (max-width: 640px) {
                    .contain {
                        width: 90%;
                        margin: 0 auto;
                    }
                    .pay {
                        margin-top: 25px;
                        display: flex;
                        justify-content: space-between;
                        flex-direction: column;
                    }
                    .pay2 {
                        margin-top: 25px;
                        display: flex;
                        justify-content: space-between;
                        flex-direction: column;
                    }
                    .payBox {
                        width: 290px;
                        margin: 0 auto 30px;
                        height: 519px;

                        box-shadow: 0 0 25px rgba(00, 00, 00, 8%);
                        text-align: center;
                    }
                    hr {
                        width: 100%;
                        margin-top: 31px;
                        color: #cbcbcb;
                    }
                    .block {
                        display: flex;
                        justify-content: space-between;
                        flex-direction: column;
                    }
                    .notice2 {
                        margin-bottom: 20px;
                    }
                }
            `}</style>
            <div className='contain'>
                {/* <div style={{width:'1280px',margin:'auto',height:'100px',backgroundColor:'yellow',fontSize:'24px',fontWeight:'bold',textAlign:'center',borderRadius:'8px',color:'red'}}>8월 16일 서비스 시작!<br></br>
        (8월 15일까지 사전예약시) 50% 할인 가격!
        </div> */}
                <h1>거북스쿨 유료 서비스</h1>
                <div className='pay'>
                    <div className='payBox'>
                        <div className='ttl'>정시 컨설팅</div>
                        <div className='price'>29,000원</div>
                        <div
                            className='button'
                            onClick={() => {
                                // setDef('수시 합격 예측');
                                setOpenPayment(true);
                                // window.open('https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform');
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>2022 정시 지원자</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>가격정책</li>
                                <li>29,000원</li>
                            </ul>
                        </div>
                    </div>
                    <div className='payBox'>
                        <div className='ttl'>{"생기부 & 플래너 관리반"}</div>
                        <div className='price'>6개월 114만(월19만)</div>
                        <div
                            className='button'
                            onClick={() => {
                                // setDef('수시 합격 예측');
                                setOpenPayment(true);
                                // window.open('https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform');
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>고1~3</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>가격정책</li>
                                <li>6개월 선납시 월 19만, 1달 이용시 28만</li>
                            </ul>
                        </div>
                    </div>
                    <div className='payBox'>
                        <div className='ttl'>{"플래너 & 질의반"}</div>
                        <div className='price'>6개월 114만(월19만)</div>
                        <div
                            className='button'
                            onClick={() => {
                                // setDef('수시 합격 예측');
                                setOpenPayment(true);
                                // window.open('https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform');
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>고1~3</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>가격정책</li>
                                <li>6개월 선납시 월 19만, 1달 이용시 28만</li>
                            </ul>
                        </div>
                    </div>
                    <div className='payBox'>
                        <div className='ttl'>{"거북쌤의 대면컨설팅"}</div>
                        <div className='price'>69만</div>
                        <div
                            className='button'
                            onClick={() => {
                                // setDef('수시 합격 예측');
                                setOpenPayment(true);
                                // window.open('https://docs.google.com/forms/d/e/1FAIpQLSfWdzBFrFX06vA_VXhOJN9rGHF4l3maD8m2I-likoY_JQ5vIQ/viewform');
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>고3</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>내용</li>
                                <li>{"비대면 컨설팅 3회 + 최종 대면 컨설팅 \n 1회 + 교차지원, 연쇄이동 현황에 따른 예측컷 변동 1~3일 업데이트 및 카톡채널을 통한 수시 질의 응답"}</li>
                            </ul>
                        </div>
                    </div>
                    {/* <div className='payBox'>
                        <div className='ttl'>수시 합격 예측</div>
                        <div className='small'>거북스쿨만의 수시 컨설팅 서비스</div>
                        <div className='price'>
                            <div style={{ fontSize: '16px' }}>(정가)4만원</div>
                            예약 할인가 20,000원
                        </div>
                        <div
                            className='button'
                            onClick={() => {
                                setDef('수시 합격 예측');
                                setOpenPayment(true);
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>고3 / N수생</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>가격정책</li>
                                <li>정가 4만원(부가세 별도)</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>기간</li>
                                <li>21년 9월 15일~21년 10월 31일</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li style={{ color: '#DE6B3D' }}>이벤트</li>
                                <li>9월 15일 까지 예약시 2만원 (5만원 할인)</li>
                            </ul>
                        </div>
                    </div> */}
                    {/* <div className='payBox'>
                        <div className='ttl'>정시 + 논술 컨설팅</div>
                        <div className='small'>정시 예약 할인가 + 논술 컨설팅(무료)</div>
                        <div className='price'>
                            <div style={{ fontSize: '16px' }}>
                                정시<del>80,000원</del>-56000원 +논술<del>15000원</del>-0원
                            </div>
                            70% OFF - - - 2.4만원
                        </div>
                        <div
                            className='button'
                            onClick={() => {
                                setDef('정시 합격 예측');
                                setOpenPayment(true);
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>고3 / N수생</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>가격정책</li>
                                <li>정가 8만원(부가세 별도)</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li></li>
                                <li></li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li style={{ color: '#DE6B3D' }}>이벤트</li>
                                <li>8월16일 까지 예약시 2만원 (5만원 할인)</li>
                            </ul>
                        </div>
                    </div> */}

                    {/* <div className="payBox">
                <div className="ttl">
                    논술 컨설팅
                </div>
                <div className="small"> 
                    거북스쿨만의 논술 컨설팅 서비스
                </div>
                <div className="price">
                <div style={{fontSize:'16px'}}></div>
                15,000원
                </div>
                <div className="button" onClick={() => {setDef('정시 합격 예측');setOpenPayment(true)}}>
                    결제하러가기
                </div>
                <div className="text">
                    <ul>
                        <li>
                            대상학년
                        </li>
                        <li>
                            고3 / N수생 
                        </li>
                    </ul>
                </div>
                <div className="text">
                    <ul>
                        <li>
                            가격정책
                        </li>
                        <li>
                            정가 15000원(부가세 별도) 
                        </li>
                    </ul>
                </div>
                <div className="text">
                    <ul>
                        <li>
             
                        </li>
                        <li>
            
                        </li>
                    </ul>
                </div>
                <div className="text">
                    <ul>
                        <li style={{color:'#DE6B3D'}}>
                      
                        </li>
                        <li>
               
                        </li>
                    </ul>
                </div>
            </div> */}
                    {/* <div className='payBox'>
                        <div className='ttl'>플래너 관리반</div>
                        <div className='small'>
                            멘토쌤의 학생 플래너 검사,테스트
                            <br />
                            ,상담 등을 통한 학생 관리 서비스
                        </div>
                        <div className='price'>90,000원</div>
                        <div
                            className='button'
                            onClick={() => {
                                setDef('플래너 관리반');
                                setOpenPayment(true);
                            }}>
                            결제하러가기
                        </div>
                        <div className='text'>
                            <ul>
                                <li>대상학년</li>
                                <li>고1 ~ N수생</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>가격정책</li>
                                <li>정가 9만원(부가세 별도)</li>
                            </ul>
                        </div>
                        <div className='text'>
                            <ul>
                                <li>기간(결제일 기준)</li>
                                <li>1개월</li>
                            </ul>
                        </div>
                    </div> */}
                </div>
                {/* <div className='pay2'>
                    <h1>비교과 분석 서비스</h1>
                    <hr />
                    <div className='block'>
                        <div className='box'>
                            <div className='notice'>
                                <span className='color'>비교과 분석 서비스는</span> 수시합격예측 내부에 있는 서비스로 수시합격예측 서비스를
                                <br />
                                이용하시는 고객에 한해 추가로 운영하는 서비스입니다.
                            </div>
                            <div className='notice2'>
                                <span className='color'>결제 절차는</span>'수시합격예측 - 비교과 분석' 페이지에서 선생님을 전공별 검색을 통<br />해 선생님을 선택하고,세부 내용을 작성한 후 결제를 진행하시면 됩니다.
                            </div>
                        </div>
                        <div className='payBox'>
                            <div className='ttl'>생기부 평가</div>
                            <div className='small'>
                                수험생 생기부를 전문 선생님이 일반적 기준이나,
                                <br />
                                특정 대학 평가 방식에 맞춘 기준으로 평가
                            </div>
                            <div className='price'>30,000원</div>
                            <div
                                className='button'
                                onClick={() => {
                                    setDef('생기부 평가');
                                    setOpenPayment(true);
                                }}>
                                선생님 선택하러 가기
                            </div>
                            <div className='text'>
                                <ul>
                                    <li>대상학년</li>
                                    <li>고1 ~ N수생</li>
                                </ul>
                            </div>
                            <div className='text'>
                                <ul>
                                    <li>가격정책</li>
                                    <li>첫 평가시 3만원, 이후 특정 대학 추가시 +1.5만</li>
                                </ul>
                            </div>
                        </div>
                        <div className='payBox'>
                            <div className='ttl'>자소서 평가</div>
                            <div className='small'>
                                수험생 자소서를 전문 선생님이
                                <br />
                                특정 대학 평가 방식에 맞춘 기준으로 평가
                            </div>
                            <div className='price'>30,000원</div>
                            <div
                                className='button'
                                onClick={() => {
                                    setDef('자소서 평가');
                                    setOpenPayment(true);
                                }}>
                                선생님 선택하러 가기
                            </div>
                            <div className='text'>
                                <ul>
                                    <li>대상학년</li>
                                    <li>고1 ~ N수생</li>
                                </ul>
                            </div>
                            <div className='text'>
                                <ul>
                                    <li>가격정책</li>
                                    <li>첫 평가시 3만원, 이후 특정 대학 추가시 +1.5만</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export async function getStaticProps(context) {
    let d = await pool.query(`select * from paymenttypes`);
    return {
        props: {
            payments: d.rows,
        },
    };
}

export default usePaywall(paypage, paypage);
