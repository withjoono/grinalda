import styled from 'styled-components';

export const Container = styled.div``;

export const ContentContainer = styled.div`
  padding: 36px 100px 18px 100px;
`;

export const InfoContainer = styled.div`
  padding: 36px 100px;
  background-color: #f4f4f4;
  border-bottom: 2px solid gray;
`;

export const InfoHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const InfoUnivName = styled.div`
  font-weight: 800;
  font-size: 24px;
  line-height: 32px;
  margin-right: 12px;
`;

export const InfoUnivMajor = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
`;

export const InfoType = styled.div`
  background: #ffffff;
  border: 1px solid #4572e4;
  box-sizing: border-box;
  border-radius: 20px;
  padding: 4px 25px;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #4572e4;
`;

export const RowBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const InfoSubHeader = styled.div`
  width: 100%;
  background: #e9e9e9;
  border-top: 1px solid #9a9a9a;
  border-bottom: 1px solid #9a9a9a;
  margin-top: 9px;
  padding: 6px 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const InfoSubContent = styled.div`
  font-weight: normal;
  font-size: 1rem;
  display: flex;
  align-items: center;
  color: #656565;
  margin-right: 20px;
`;

export const InfoTableTitle = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  margin-bottom: 8px;
  margin-top: 24px;
`;

export const InfoTable = styled.table`
  width: 100%;
  border-top: 1px solid black;
  border-collapse: collapse;
`;

export const InfoTH = styled.th`
  background: #f4f4f4;
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  border: 1px solid #c4c4c4;
  padding: 15px 15px;
  word-break: keep-all;
  width: 5%;
`;

export const InfoTD = styled.td`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  border: 1px solid #c4c4c4;
  background-color: white;
  text-align: center;
  padding: 12px 0px;
  word-break: keep-all;
`;

export const ContentTitleContainer = styled.div`
  padding: 16px 12px;
  display: flex;
  flex-direction: row;
  align-items: center;

  border-top: 3px solid #3d94de;
  border-bottom: 1px solid #656565;
  margin-bottom: 24px;
`;

export const ContentTitle = styled.div`
  font-weight: 800;
  font-size: 20px;
  line-height: 28px;
  margin-right: 12px;
`;

export const ContentSubTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
  color: #656565;
`;

export const ContentTopic = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  margin-right: 12px;
`;

export const TopicContainer = styled.div`
  margin-bottom: 36px;
`;

export const Tip = styled.div`
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  width: 100%;
  text-align: right;
  margin-top: 12px;
`;

export const OverflowContainer = styled.div`
  width: 100%;
  overflow: auto;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 8px 16px;
`;
