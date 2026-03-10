import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 232px;
  border: 1px solid #9a9a9a;
  margin-top: 40px;
  box-shadow: 2px 2px 12px 0px #00000024;
`;

const ItemContainer = styled(Container)`
  height: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 20px;
  margin: 36px 0 26px 30px;
`;
const Desc = styled.p`
  margin-left: 30px;
  margin-top: 5px;
`;

const PurchaseButton = styled.button`
  width: 150px;
  height: 32px;
  border: 1px solid #f45119;
  font-size: 12px;
  color: #f45119;
  padding: 7px 10px;
  font-weight: 700;
  margin-top: 36px;
  margin-left: 30px;
  border-radius: 4px;
  &:hover,
  &:active {
    background-color: #f45119;
    color: #ffffff;
  }
`;

const TicketNameWrapper = styled.div`
  display: flex;
  justifycontent: space-around;
  align-items: center;
`;

const InUseBtn = styled.button`
  border: 1px solid #18b2f2;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 0.8rem;
  color: #18b2f2;
  font-weight: 400;
  cursor: auto;
`;

const TicketName = styled.span`
  margin-left: 20px;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f45119;
`;

const TicketDate = styled.span`
  color: #c1c1c1;
  font-size: 0.9rem;
  margin-right: 10px;
`;

const tempTicketList = [
  {title: '논술 컨설팅', date: '2021-08-24', autopay: '2023-01-04일까지'},
  {title: '정시 합격 예측', date: '2021-08-13', autopay: '2023-01-04일까지'},
];

const Ticket = () => {
  return tempTicketList.length === 0 ? (
    <Container>
      <Title>구매하신 이용권이 없습니다.</Title>
      <Desc>거북스쿨만의 입시컨설팅을 만나보세요! </Desc>
      <Desc>
        이용권을 구매하시면 수시 합격예측, 정시 합격예측, 멘토의 플래너관리, 논술 컨설팅 등을
        이용하실 수 있어요.
      </Desc>
      <PurchaseButton>이용권 구매하러가기</PurchaseButton>
    </Container>
  ) : (
    tempTicketList.map(ticket => {
      return (
        <ItemContainer>
          <TicketNameWrapper>
            <InUseBtn>이용중</InUseBtn>
            <TicketName>{ticket.title}</TicketName>
          </TicketNameWrapper>
          <div>
            <TicketDate>구매 날짜</TicketDate>
            {ticket.date}
          </div>
          <div>이용기간 : {ticket.autopay}</div>
        </ItemContainer>
      );
    })
  );
};

export default Ticket;
