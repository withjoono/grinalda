import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import AppBorder from './AppBorder/AppBorderWrapper';
import CsWrapper from './CsForm/CsWrapper';
import InforWrapper from './InforBorder/InforWrapper';
import MentorWrapper from './Mentor/MentorWrapper';
import QuickMenu from './QickMenu/QuickMenu';
import SliderMenu from './SliderMenu/SliderMenu';
import WinterProgram from './WinterProgram/WinterProgram';
import Partners from './Partners/Partners';
import MenuButtonBox from './MenuButtonBox/MenuButtonBox';
import SusiConsulting from './SusiConsulting/SusiConsulting';
import SideNav from './SideNav/SideNav';

const home = props => {
  const Wrap = styled.div`
    background-color: #ffffff;
    width: 100%;
  `;

  return (
    <Wrap>
      <SliderMenu />
      {/*슬라이더 로그인페이지-----------------------------------------------------*/}

      <MenuButtonBox />
      {/*메뉴 버튼 박스-----------------------------------------------------*/}

      {/* <MentorWrapper /> */}
      {/*멘토 리스트-----------------------------------------------------*/}

      <QuickMenu />
      {/*퀵메뉴-----------------------------------------------------*/}

      <InforWrapper />
      {/*설명-----------------------------------------------------*/}

      <AppBorder />
      {/*어플홍보-----------------------------------------------------*/}

      <SusiConsulting />
      {/*거북쌤 강준원장의 비대면 수시 컨설팅---------------------------- */}

      <Partners />
      {/*협력업체---------------------------------------------------*/}

      <WinterProgram />
      {/*유튜브---------------------------------------------------*/}

      {/* <CsWrapper /> */}
      {/*cs*/}
      {/* {viewSideNav ? <SideNav /> : null} */}
    </Wrap>
  );
};

export default home;
