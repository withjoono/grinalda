import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  margin-bottom: 36px;
`;

export const ContentTitle = styled.div`
  font-weight: 800;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 16px;

  @media screen and (max-width: 420px) {
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
  }
`;

export const RowLayout = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;

  @media screen and (max-width: 420px) {
    flex-direction: column;
  }
`;

export const ContentTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media screen and (max-width: 420px) {
    width: 300%;
  }
`;

export const LineContainer = styled.div`
  width: 100%;
  box-shadow: 2px 2px 12px #00000014;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 32px 12px;
  display: flex;
  align-items: center;
`;

export const MyScoreTH = styled.th`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  padding: 9px 0px;
  background-color: #f4f4f4;
  border: 1px solid #c2c2c2;
  border-top: 1px solid black;
`;

export const MyScoreTD = styled.td`
  text-align: center;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  padding: 9px 0px;
  border: 1px solid #c2c2c2;

  &:first-child {
    background-color: #f4f4f4;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
  }
`;

export const AnalyseTH = styled.th`
  background-color: #f4f4f4;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  border: 1px solid #c2c2c2;
  border-top: 1px solid black;
  padding: 12px 0px;
`;

export const AnalyseTD = styled.td`
  text-align: center;
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  padding: 12px 0px;
  border: 1px solid #c2c2c2;
  white-space: pre;
  word-break: keep-all;
  width: 12%;

  &:first-child {
    background-color: #f4f4f4;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
  }
`;

export const MoblieOverflowContainer = styled.div`
  width: 100%;
  overflow: auto;
`;

export const NavButton = styled.button`
  height: 56px;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  background-color: #f2ce77;
  border-radius: 30px;
  color: #000000;
  padding: 0px 16px;
  margin: 0px auto;
  margin-top: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
