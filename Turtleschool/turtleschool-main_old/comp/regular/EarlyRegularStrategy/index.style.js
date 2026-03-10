import styled from 'styled-components';

export const Container = styled.div``;

export const RegularContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContentTitle = styled.div`
  font-weight: 800;
  font-size: 1.5rem;
  line-height: 32px;
  margin: 2rem 0 1rem 0;
  /* @media screen and (max-width: 420px) {
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
  } */
`;

export const ResultConditionContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 16px 0px 24px 0px;
`;

export const ResultConditionButton = styled.button`
  width: 11rem;
  height: 2rem;
  cursor: pointer;
  font-size: 0.7rem !important;
  color: #f45119;
  border: 1px solid #f45119;
  background-color: white;
  padding: 9px 0px;
  margin: 1rem 0;
  align-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 420px) {
    font-weight: 800;
    font-size: 16px;
    line-height: 18px;
  }
`;

export const RegularTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid black;
  padding-bottom: 40rem;
  @media screen and (max-width: 420px) {
    width: 300%;
  }
`;

export const RegularTH = styled.th`
  font-weight: bold;
  font-size: 0.7rem;
  line-height: 1rem;
  background-color: #f4f4f4;
  border: 1px solid #c2c2c2;
  padding: 0.2rem;
  width: 5%;
`;

export const RegularTD = styled.td`
  border: 1px solid #c2c2c2;
  font-weight: normal;
  font-size: 0.6rem;
  line-height: 18px;
  text-align: center;
  color: black;
  padding: 0.2rem;
  background-color: ${props => (props.dark ? '#EAEAEA' : '#fff')};

  &:first-child {
    padding: 0.7rem 0px;
  }
`;

export const HorizontalLine = styled.hr`
  margin: 36px 0px;
`;

export const GpaContainer = styled.div``;

export const GpaHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MoblieOverflowContainer = styled.div`
  width: 100%;
  overflow: ${({isMobile}) => {
    isMobile ? 'hidden' : 'hidden';
  }};
`;

export const DelBtn = styled.button`
  padding: 0.2rem 0.5rem;
  color: #f45119;
  border: 1px solid #f45119;
`;
