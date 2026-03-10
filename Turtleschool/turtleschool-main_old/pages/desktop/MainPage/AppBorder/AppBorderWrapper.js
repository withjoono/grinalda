import React from 'react';
import * as S from '../../../../styles/main/AppBorder.style';
import Image from 'next/image';

const AppBorderWrapper = () => {
  return (
    <>
      {/* <S.Container>
        <S.CenterLayout>
          <S.VideoContainer>
            <iframe
              width="100%"
              height="295px"
              src="https://www.youtube.com/embed/irIZahkLqNw"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <S.VideoCaption>
              <div
                style={{
                  fontWeight: 'normal',
                  fontSize: 18,
                  marginTop: 0,
                }}
              >
                모의지원만 알아보기엔 너무 비싸!
              </div>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: '#F45119',
                  marginTop: 14,
                }}
              >
                국내 유일의 모의지원 전문 앱
              </div>
            </S.VideoCaption>
          </S.VideoContainer>
          <S.ContentContainer>
            <S.ContentTitle>
              <S.OrangeText>거</S.OrangeText>북스쿨 무료 수시 <S.OrangeText>모</S.OrangeText>
              의지원 앱
            </S.ContentTitle>
            <S.ContentName>거모</S.ContentName>
            <div
              className="quick-detail"
              onClick={() => (window.location.href = 'https://www.turtleschool.kr/moji/')}
              style={{cursor: 'pointer', margin: '15px', marginBottom: '34px'}}
            >
              상세정보{' '}
              <Image
                alt=""
                className="right_arrow"
                src="https://img.ingipsy.com/assets/icons/arrow/arrow_right@3x.png"
                width="7px"
                height="14px"
              />
            </div>
            <S.ConvertBox>
              <S.BubbleBox>&apos;무료&apos; 정시 모의지원 앱</S.BubbleBox>
              <S.BubbleBox>국내 유일 모의지원 전문 앱</S.BubbleBox>
            </S.ConvertBox>
            <S.ConvertBox>
              <S.BubbleBox>앱 기반의 신속성, 편의성</S.BubbleBox>
              <S.BubbleBox>현재 전국 고교와 협력 관계 체결 중</S.BubbleBox>
            </S.ConvertBox>
            <div className="requestStoreBox">
              <p>구글 플레이, 앱 스토어에서 거북스쿨을 검색해보세요!</p>
              <S.StoreContainer>
                <S.GoogleStoreImage
                  onClick={() =>
                    window.open(
                      'https://play.google.com/store/apps/details?id=kr.turtleschool.mocksupport',
                      '_blank',
                    )
                  }
                  src="https://img.ingipsy.com/assets/icons/store/google@3x.png"
                />
                <S.AppleStoreImage
                  onClick={() =>
                    window.open(
                      'https://apps.apple.com/kr/app/%EA%B1%B0%EB%B6%81%EC%A0%95%EB%AA%A8/id1600587371?l=en',
                      '_blank',
                    )
                  }
                  src="https://img.ingipsy.com/assets/icons/store/appstore@3x.png"
                />
              </S.StoreContainer>
            </div>
          </S.ContentContainer>
        </S.CenterLayout>
      </S.Container> */}
      <style jsx>{`
        .requestStoreBox p {
          font-size: 1rem;
          font-weight: bolder;
          margin-top: 3rem;
          margin-left: 20px;
        }
      `}</style>
    </>
  );
};

export default AppBorderWrapper;
