import Link from 'next/link';
import React from 'react';
import * as S from './index.style';
import {useState} from 'react';

const SideNav = ({title, subs, currentSub}) => {
  const [isOpen, setIsOpen] = useState(
    currentSub === '멘토/멘티 신청,수락' || currentSub === '멘토/멘티 관리자페이지',
  );
  const renderSubs = () =>
    subs.map(sub => {
      switch (sub.title) {
        case '멘토/멘티 계정':
          return (
            <>
              <S.SubContentLabel
                onClick={e => {
                  setIsOpen(prev => !prev);
                }}
              >
                <label key={sub.title}>{sub.title}</label>
              </S.SubContentLabel>
              <S.Dropdown active={isOpen}>
                <Link key={sub.title} href={sub.url + '/signup'}>
                  <S.ListItem active={currentSub === '멘토/멘티 신청,수락'}>
                    <span>멘토/멘티 신청,수락</span>
                  </S.ListItem>
                </Link>
                <Link key={sub.title} href={sub.url + '/admin'}>
                  <S.ListItem active={currentSub === '멘토/멘티 관리자페이지'}>
                    <span>멘토/멘티 관리자페이지</span>
                  </S.ListItem>
                </Link>
              </S.Dropdown>
            </>
          );
        // case '모의지원':
        //     return (
        //         <S.SubContent onClick={() => alert('모집단 표본확대를 위해서, 모의지원 전문 앱인 거북정모에서 모의지원은 별도로 수행합니다 앱스토아에서 다운받아주세요')} active={currentSub === sub.title}>
        //             {sub.title}
        //         </S.SubContent>
        //     );

        default:
          if (sub.url.includes('Consulting')) {
            return (
              <S.SubContent active={currentSub === sub.title}>
                <Link key={sub.title} href={sub.url}>
                  {sub.title}
                </Link>
              </S.SubContent>
            );
          } else {
            return (
              <Link key={sub.title} href={sub.url} passHref>
                <S.SubContent active={currentSub === sub.title}>{sub.title}</S.SubContent>
              </Link>
            );
          }
      }
    });

  return (
    <S.Container>
      <S.Title>{title}</S.Title>
      <S.HorizontalLine />
      <S.SubContainer>{renderSubs()}</S.SubContainer>
      <S.SideNavProgress> </S.SideNavProgress>
    </S.Container>
  );
};

// SideNav.propTypes = {
//   title: PropTypes.node.isRequired,
//   subs: PropTypes.node.isRequired,
//   currentSub: PropTypes.node.isRequired,
// };

export default SideNav;
