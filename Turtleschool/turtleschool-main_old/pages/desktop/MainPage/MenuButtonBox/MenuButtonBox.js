/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import Image from 'next/image';

const OldMenuButtonBox = () => {
  return (
    <>
      <div className="quick_box">
        <div className="title_box">Quick Menu</div>
        <div className="nav_box">
          <div
            className="btn_nav btn1"
            style={{width: '13.5rem'}}
            onClick={() => (window.location.href = 'https://youtu.be/nterZbkP6ps')}
          >
            <div className="title_nav">
              정시 시스템 설명을 병행한 <br /> '거북스쿨 사용법'
            </div>
            <div className="text_nav">
              <br></br>
            </div>
            <div className="nav_img">
              <Image
                alt=""
                src="https://img.ingipsy.com/assets/arrow.png"
                width="30dp"
                height="10dp"
              />
            </div>
          </div>

          <div
            className="btn_nav btn3"
            style={{width: '270px'}}
            onClick={() =>
              (window.location.href =
                'https://play.google.com/store/apps/details?id=kr.turtleschool.mocksupport')
            }
          >
            <div className="title_nav">무료 모의 지원 어플</div>
            <div className="text_nav"></div>
            <div className="nav_img">
              <Image
                alt=""
                src="https://img.ingipsy.com/assets/arrow.png"
                width="30dp"
                height="10dp"
              />
            </div>
          </div>

          <div
            className="btn_nav btn2"
            style={{width: '270px'}}
            onClick={() =>
              (window.location.href =
                'https://docs.google.com/forms/d/e/1FAIpQLSdyy7FjOst1KdfNFoYok0FuCtfSHyGPhskb8D0OWqo6gd8ezA/viewform')
            }
          >
            <div className="title_nav">
              거북쌤의
              <br />
              입시코칭
            </div>
            <div className="text_nav"></div>
            <div className="nav_img">
              <Image
                alt=""
                src="https://img.ingipsy.com/assets/arrow.png"
                width="30dp"
                height="10dp"
              />
            </div>
          </div>
          <div
            className="btn_nav btn3"
            style={{width: '270px'}}
            onClick={() =>
              (window.location.href =
                'https://docs.google.com/forms/d/e/1FAIpQLScs-_3HYfw-dmC0SaruF6RxBclm-Ljpzwosy5mlU-aBv4kUig/viewform')
            }
          >
            <div className="title_nav">
              대치동 20년 <br /> 입시컨설팅 경력 <br /> 거북쌤의 '입시 코칭'
            </div>
            <div className="text_nav"></div>
            <div className="nav_img">
              <Image
                alt=""
                src="https://img.ingipsy.com/assets/arrow.png"
                width="30dp"
                height="10dp"
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .quick_box {
          width: 64rem;
          height: 6rem;
          margin: 2.5rem auto;
        }
        .quick_box .title_box {
          width: 9rem;
          height: 8rem;
          background-color: #eaeaea;
          border: 1px #9b9b9b solid;
          font-size: 1rem;
          font-weight: bold;
          text-align: center;
          line-height: 8rem;
          float: left;
        }

        .quick_box .nav_box {
          width: 54rem;
          height: 8rem;
          display: flex;
          float: right;
          cursor: pointer;
        }
        .quick_box .nav_box .btn_nav {
          position: relative;
        }
        .quick_box .nav_box .btn_nav :nth-of-type(1),
        .quick_box .nav_box .btn_nav :nth-of-type(2),
        .quick_box .nav_box .btn_nav :nth-of-type(3) {
          border-right: 1px #9d8459 solid;
        }

        .btn1 {
          width: 18rem;
          background-color: #ffcf72;
          transition: all 0.3s;
        }
        .btn2 {
          width: 18rem;
          background-color: #ffcf72;
          transition: all 0.3s;
        }
        .btn3 {
          width: 18rem;
          background-color: #ffcf72;
          transition: all 0.3s;
        }
        .btn1:hover {
          height: 8rem;
          box-shadow: 0px 0.1rem 1rem rgba(33, 33, 33, 40%);
        }
        .btn2:hover {
          height: 8rem;
          box-shadow: 0px 0.1rem 1rem rgba(33, 33, 33, 40%);
        }
        .btn3:hover {
          height: 8rem;
          box-shadow: 0px 0.1rem 1rem rgba(33, 33, 33, 40%);
        }

        .quick_box .nav_box .btn_nav .title_nav {
          font-size: 1rem;
          font-weight: bold;
          margin-left: 1.5rem;
          margin-top: 1.4rem;
          color: #605e5e;
        }
        .quick_box .nav_box .btn_nav .text_nav {
          font-size: 0.7rem;
          font-weight: 400;
          margin-top: 0.6rem;
          margin-left: 1.4rem;
          line-height: 1rem;
        }
        .nav_img {
          right: 1.5rem;
          position: absolute;
          bottom: 1rem;
        }
      `}</style>
    </>
  );
};

export default OldMenuButtonBox;
