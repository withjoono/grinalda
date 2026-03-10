import React, { useContext, useEffect, useState } from 'react';
import { getData } from '../../../../comp/data';
import loginContext from '../../../../contexts/login';
import * as S from '../../../../styles/main/WinterProgram.style';

const WinterProgram = () => {
  const contents = [
    {
      label: '정시파이터를 위한',
      title: '플래너 관리 + 질의반',
      text: '학생의 롤모델인 ‘명문대 멘토쌤’의 매일 플래너 관리, 학원 수업 현황 부모님께 보고, 학부모&학생 상담과 과목 질의 응답',
      url: 'https://www.turtleschool.kr/plannmana/',
      src: 'https://img.ingipsy.com/assets/icons/winter_program/fluent_person-chat-24-regular@3x.png',
    },
    {
      label: '수시파이터를 위한',
      title: '플래너 + 생기부 관리반',
      text: '학생의 롤모델인 ‘명문대 멘토쌤’의 매일 플래너 관리, 학원 수업 현황 부모님께 보고, 학부모&학생 상담과 과목 질의 응답',
      url: 'https://www.turtleschool.kr/sanggibu/',
      src: 'https://img.ingipsy.com/assets/icons/winter_program/icon-park-outline_doc-success@3x.png',
    },
    {
      label: '방학 학습 관리를 위한',
      title: '온종일 화상관리 + 클리닉반',
      text: '학생의 롤모델인 ‘명문대 멘토쌤’의 매일 플래너 관리, 학원 수업 현황 부모님께 보고, 학부모&학생 상담과 과목 질의 응답',
      url: 'https://www.turtleschool.kr/clinic/',
      src: 'https://img.ingipsy.com/assets/icons/winter_program/fluent_video-person-16-regular@3x.png',
    },
  ];

  const [acc, setAcc] = useState([]);

  const [member, setMember] = useState(1);
  const { info, login } = useContext(loginContext); //info 파라미터  login 갱신

  useEffect(() => {
    if (!info[0]) return;

    if (
      !(info[0].gradeCode == 'H1' || info[0].gradeCode == 'H2') &&
      !info[0].relationCode == '99'
    ) {
      setMember(0);
    } else if (info[0].relationCode == '99') {
      setMember(2);
    } else setMember(1);

    if (localStorage.getItem('realuid')) {
      getData('/api/linkage/get', setAcc, {}, localStorage.getItem('realuid'));
    }
  }, [info[0]]);

  const renderContent = content => {
    return (
      <S.Content>
        <S.ContentImage src={content.src} />
        <S.ContentLabel>{content.label}</S.ContentLabel>
        <S.ContentTitle>{content.title}</S.ContentTitle>
        <S.ContentDescription>{content.text}</S.ContentDescription>
        <S.ContentButton onClick={() => window.open(content.url)}>{'바로가기'}</S.ContentButton>
      </S.Content>
    );
  };
  return (
    <div>
      {/* <S.Container>
        <S.Title>{'내신 프로그램'}</S.Title>
        <S.RowBox>{contents.map(renderContent)}</S.RowBox>
      </S.Container> */}
    </div>
  );
};

export default WinterProgram;
