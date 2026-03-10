import Link from 'next/link';
import React, { useState } from 'react';
import * as S from './index.style';
import PropTypes from 'prop-types';

const SideNav = ({subs}) => {

  const [ nonsulStatus, setNonsulStatus ] = useState(false)

  const controlNonsul = (e) =>{
    e.preventDefault()
    setNonsulStatus(!nonsulStatus)
  }

  /* const NonsulTypes = () => {
    return (
      <></>
    )
  } */

  const renderNonsul = (title) => {
    return (
      <>
        {
          nonsulStatus
          ? 
          <>
            <S.SubContent onClick = {controlNonsul}>{title}</S.SubContent>
            <S.SubNonsulContent>
              <Link href="/nonsul/lib">- 문과 논술</Link>
            </S.SubNonsulContent>
            <S.SubNonsulContent>
              <Link href="/nonsul/sci">- 이과 논술</Link>
            </S.SubNonsulContent>

            <S.SubNonsulContent>
              <Link href="/nonsul/med">- 의치대 논술</Link>
            </S.SubNonsulContent>

            <S.SubNonsulContent>
              <Link href="/nonsul/mypage">- 나의 논술 지원</Link>
            </S.SubNonsulContent>
          </>
          : 
          <S.SubContent onClick = {controlNonsul}>{title}</S.SubContent>
        }
      </>
    )
  }

  return (
    <S.Container>
      {/* <S.Title>{title}</S.Title> */}
      {/* <S.HorizontalLine /> */}
      <S.SubContainer>
        {
          subs.map((sub) => {
            return (
              <Link key={sub.title} href={sub.url}>
                {
                  sub.url === '/nonsul/sci'
                  ? renderNonsul(sub.title)
                  : <S.SubContent>{sub.title}</S.SubContent>
                }
              </Link>
            )
          })
        }
      </S.SubContainer>
    </S.Container>
  );
};

SideNav.propTypes = {
  title: PropTypes.node.isRequired,
  subs: PropTypes.node.isRequired,
  currentSub: PropTypes.node.isRequired,
};

export default SideNav;
