import styled from 'styled-components';

export const Container = styled.div``;

// 학습개요

export const OutlineContainer = styled.div`
  width: 100%;
  padding: 36px 30px;
  border-radius: 2px;
  border: 1px solid #9a9a9a;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: row; ;
`;

export const OutlineDescription = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OutlineTitle = styled.div`
  font-size: 24px;
  line-height: 32px;
  font-weight: 800;
  margin-bottom: 24px;
`;

export const OutlineContent = styled.div`
  display: flex;
  flex-direction: row;
`;

export const OutlineName = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  margin-right: 46px;
`;

export const OutlineValue = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  color: #9a9a9a;
`;

export const ChartContainer = styled.div`
  width: 195px;
  height: 195px;
  margin: 0px 18px;
`;

export const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0px 24px 0px auto;
`;

export const LegendContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const LegendDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 10px;
`;

export const LegendValue = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
`;

// 주간 성취도

export const WeeklyContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WeeklyTitle = styled.div`
  font-weight: 800;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 16px;
`;

export const WeeklyContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const WeeklyTableContainer = styled.div`
  width: calc(50% - 10px);
  margin-bottom: auto;
`;

export const WeeklyTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

export const WeeklyTH = styled.th`
  height: 49px;
  border: 1px solid #c2c2c2;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  background-color: #f4f4f4;
`;

export const WeeklyTD = styled.td`
  width: 10%;
  height: 49px;
  border: 1px solid #c2c2c2;
  font-weight: bold;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  background-color: ${props => (props.first ? '#F4F4F4' : 'white')};
`;

export const WeeklyGraphTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(50% - 10px);
  margin-bottom: 24px;
`;

export const WeeklyGraphContainer = styled.div`
  height: 300px;
  padding: 25px 20px;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.14);
`;

// 과목별 학습 현황 조회

export const StatusContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const StatusTitle = styled.div`
  font-weight: 800;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 16px;
`;

export const StatusFilterContainer = styled.div`
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.14);
  padding: 20px 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StatusFilterContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-right: 60px;
  min-width: 150px;
`;

export const StatusFilterLabel = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
`;

export const StatusFilterInput = styled.div`
  display: flex;
  flex: 1;
`;

export const StatusFilterButton = styled.button`
  margin: 0px 6px 0px auto;
  padding: 8px 18px;
  background-color: #c86f4c;
  font-weight: bold;
  font-size: 18px;
  line-height: 26px;
  color: #ffffff;
`;

export const StatusPartitionLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #9a9a9a;
  margin: 36px 0px;
`;

export const StatusContentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatusContent = styled.div`
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.14);
  margin-bottom: 8px;
`;

export const StatusHeader = styled.div`
  height: 48px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid #c2c2c2;
  padding: 12px 30px;
`;

export const StatusIndex = styled.div`
  min-width: 35px;
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  margin-right: 24px;
`;

export const StatusDate = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 18px;
  color: #3d94de;
  min-width: 160px;
  margin-right: 24px;
`;

export const StatusItemTitle = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  margin-right: 24px;
`;

export const StatusProgressContainer = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: row;
`;

export const StatusProgress = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  color: #000000;
  margin-right: 60px;
`;

export const StatusButton = styled.button`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StatusButtonTitle = styled.div`
  font-size: 10px;
  line-height: 24px;
  text-align: right;
  color: #9a9a9a;
  margin-right: 5px;
  width: 50px;
`;

export const StatusToggleContainer = styled.div`
  padding: 16px 30px 18px 30px;
  background: #f4f4f4;
  display: flex;
  flex-direction: row;
`;

export const StatusToggleContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 60px;
`;

export const StatusToggleContentTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 18px;
`;

export const StatusToggleContentDescription = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 565px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const StatusEmptyContainer = styled.div`
  background: #ffffff;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.14);
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
`;

export const StatusEmptyTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 20px;
`;

export const StatusEmptyDescription = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 24px;
`;

// 선생님 정보

export const MentoInfoContainer = styled.div`
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 24px 30px;
  box-shadow: 2px 2px 12px 0px rgba(0, 0, 0, 0.14);
  margin-bottom: 24px;
`;

export const MentoInfoContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 30px;
`;

export const MentoInfoTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  margin-right: 16px;
`;

export const MentoInfoDescription = styled.div`
  font-weight: normal;
  font-size: 14px;
  line-height: 28px;
`;
