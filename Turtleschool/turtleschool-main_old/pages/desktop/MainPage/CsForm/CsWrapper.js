import Link from 'next/link';
import React from 'react';

const CsWrapper = () => {
  return (
    <>
      <div className="nav_cs">
        <div className="cs_box">
          <div className="cs_name" style={{marginLeft: 'auto'}}>
            <div className="cs_num">
              <div style={{fontSize: '16px', fontWeight: 'bold'}}>
                이용 문의 / 고객문의 / 광고문의
              </div>
              <div style={{fontSize: '24px', fontWeight: '1000', marginTop: '10px'}}>
                02-501-3357
              </div>
              <Link href="http://pf.kakao.com/_TxbNFs/chat">
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '1000',
                    marginTop: '10px',
                    backgroundColor: '#FFE400',
                  }}
                >
                  채팅상담 하러가기
                </div>
              </Link>
            </div>
            <div className="cs_imgn">
              <img src="https://img.ingipsy.com/assets/home_icon/icon-61-call.png" />
            </div>
          </div>
        </div>
        <div className="cs_box">
          <div className="cs_name">
            <div className="cs_num">
              <div style={{fontSize: '16px', fontWeight: 'bold'}}>거북스쿨 공식계정</div>
              <div style={{display: 'flex', marginTop: '12px'}}>
                <div>
                  <img
                    src="https://img.ingipsy.com/assets/home_icon/blog.png"
                    style={{width: '72px', height: '72px'}}
                  />
                </div>
                <div>
                  <img
                    src="https://img.ingipsy.com/assets/home_icon/facebook.png"
                    style={{width: '72px', height: '72px', marginLeft: '16px'}}
                  />
                </div>
                <div>
                  <img
                    src="https://img.ingipsy.com/assets/home_icon/instargram.png"
                    style={{width: '72px', height: '72px', marginLeft: '16px'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .nav_cs {
          width: 100%;
          height: 221px;
          background-color: #f4f4f4;
          display: flex;
        }
        .nav_cs .cs_box {
          width: 100%;
        }
        .nav_cs .cs_box .cs_name {
          width: 405px;
          height: 161px;
          cursor: pointer;
        }
        .nav_cs .cs_box .cs_name .cs_img {
          margin-top: 35px;
        }
        .nav_cs .cs_box .cs_name .cs_title {
          font-size: 25px;
          font-weight: 800;
          margin-top: 20px;
        }
        .nav_cs .cs_box .cs_name .cs_num {
          margin-top: 51px;
          width: 217px;
        }
        .nav_cs .cs_box .cs_name .cs_imgn {
          margin-left: 288px;
          width: 217px;
        }
        .admin_go:hover {
          text-decoration: underline;
        }
        .footer {
          position: absolute;
          bottom: 0;
          background-color: #f4f4f4;
          color: #9d9d9d;
          height: 3em;
          text-align: center;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default CsWrapper;
