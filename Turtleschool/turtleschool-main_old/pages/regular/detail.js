import axios from 'axios';
import {useRouter} from 'next/router';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import Component from '../../comp/regular/Detail';

const Detail = () => {
  const router = useRouter();
  const [univ, setUniv] = useState({});

  useEffect(() => {
    if (router?.query?.data) {
      setUniv(JSON.parse(router.query.data));
    }
  }, [router]);



  return (
    <Container>
      <Header>
        <HeaderImage src="https://img.ingipsy.com/assets/header/logo@3x.png" />
        <HeaderTitle>{'분석 레포트'}</HeaderTitle>
      </Header>
      <Component />
      <Footer>
        <FooterButton style={{width : '100%'}} onClick={() => window.close()}>{'창닫기'}</FooterButton>
        {/* <FooterButtonFilled onClick={_postSaveCollegeInterest}>
          {'관심대학 저장하기'}
          <SquareCheckBox />
        </FooterButtonFilled> */}
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 108px;
`;

const Header = styled.div`
  width: 100%;
  height: 54px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0px 100px;
  border: 1px solid #c86f4c;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
`;

const HeaderImage = styled.img`
  height: 100%;
`;

const HeaderTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #c86f4c;
`;

const Footer = styled.div`
  width: 100%;
  padding: 0px 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FooterButton = styled.div`
  background: #ffffff;
  border: 1px solid #3d94de;
  box-sizing: border-box;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 30%;
  padding: 24px 0px;
  color: #3d94de;
  cursor: pointer;
`;

const FooterButtonFilled = styled.div`
  background: #3d94de;
  font-weight: bold;
  font-size: 24px;
  line-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 68%;
  padding: 24px 0px;
  color: #ffffff;
  cursor: pointer;
`;

const SquareCheckBox = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 4px;
  background-color: #3d94de;
  margin-left: 8px;
  margin-bottom: 3px;
`;

export default Detail;
