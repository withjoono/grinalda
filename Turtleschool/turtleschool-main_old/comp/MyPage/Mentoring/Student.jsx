import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 20px;
`;

const Content = styled.section`
  flex: 0.5;
  padding: 10px;
`;

const Title = styled.h3`
  display: flex;
  padding-bottom: 20px;
  font-size: 1.3em;
`;

const Function = styled.article`
  display: flex;
  align-items: center;
  border: 1.5px solid #c2c2c2;
  padding: 20px;
  height: 130px;
  justify-content: space-between;
  box-shadow: 2px 2px 12px 0px #00000024;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  height: 100%;
  font-size: 1.2rem;
`;

const InfoItemSubText = styled.span`
  color: #808080;
  font-size: 0.8rem;
`;

const MenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
`;

const LinkText = styled.span`
  color: #f45119;
  font-size: 0.8rem;
  font-weight: 400;
`;

const Function2 = styled(Function)`
  height: 75px;
  border: 1.5px solid #000000;
  border-radius: 2px;
`;

const Line = styled.div`
  height: 1.5px;
  width: 100%;
  margin: 20px 0;
  background-color: #c2c2c2;
`;

const MenuList = [
  {label: '플래너', link: ''},
  {label: '내신 성적 관리', link: ''},
  {label: '모의 성적 관리', link: ''},
  {label: '수시 컨설팅', link: ''},
  {label: '정시 합격 예측', link: ''},
  {label: '마이클래스', link: ''},
  {label: '나만의 입시 비서', link: ''},
];

const Student = ({id, name, school}) => {
  return (
    <Wrapper>
      <Content>
        <Title>학생 정보</Title>
        <Function>
          <InfoItem>
            {name}
            <InfoItemSubText>{school}</InfoItemSubText>
          </InfoItem>
        </Function>
      </Content>
      <Content>
        <Title>학생 관리</Title>
        {MenuList.map((v, idx) => {
          return (
            <div style={{paddingBottom: idx % 2 == 1 ? '10px' : '0px'}}>
              <Function2>
                <MenuItem>
                  <span style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{v.label}</span>
                  <LinkText>바로가기 {'>'}</LinkText>
                </MenuItem>
              </Function2>
              {(idx == 0 || idx == 2 || idx == 4) && <Line />}
            </div>
          );
        })}
      </Content>
    </Wrapper>
  );
};

export default Student;
