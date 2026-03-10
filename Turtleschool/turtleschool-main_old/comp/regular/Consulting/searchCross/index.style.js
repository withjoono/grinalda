import styled from 'styled-components';

export const Container = styled.div``;

export const ContentTitle = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.6rem;
  margin-bottom: 0.8rem;

  /* @media screen and (max-width: 420px) {
    font-weight: bold;
    font-size: 1rem;
    line-height: 28px;
  } */
`;

export const FilterContainer = styled.div`
  border: 1px solid #c86f4c;
  border-top: 1px solid black;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
`;

export const FilterTitle = styled.th`
  color: #c86f4c;
  border: 1px solid #c86f4c;
  padding: 1.3rem 1.2rem;
  font-weight: 800;
  font-size: 0.8rem;
  line-height: 1.2rem;
  display: flex;
  align-items: center;
`;

export const FilterContentLayout = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  padding: 0.45rem 0.6rem;
`;

export const FilterContent = styled.button`
  padding: 0.15rem 0.6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => (props.active ? '#C86F4C' : 'black')};
  font-weight: normal;
  font-size: 0.8rem;
  line-height: 1.2rem;
`;

export const FilterButtonLayout = styled.div`
  padding-top: 1.2rem;
  display: flex;
  justify-content: flex-end;
`;

export const EmptyContainer = styled.div`
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  width: 100%;
  height: 7.2rem;
  box-shadow: 2px 2px 12px #00000014;
  padding: 1.8rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const EmptyTitle = styled.div`
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.4rem;
`;

export const EmptyDescription = styled.div`
  font-weight: normal;
  font-size: 0.7rem;
  line-height: 1.2rem;
`;

export const UnivResultContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 420px) {
    flex-direction: column;
  }
`;

export const ChartContainer = styled.div`
  width: calc(70% - 1.2rem);
  height: 16rem;
  margin-right: 1.2rem;
  overflow: auto;
  padding: 30px;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 2px 2px 12px #00000014;

  @media screen and (max-width: 420px) {
    width: 100%;
    margin-bottom: 16px;
  }
`;

export const UnivListContainer = styled.div`
  width: 30%;
  height: 16rem;
  overflow: auto;
  padding: 0.8rem;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  box-shadow: 2px 2px 12px #00000014;

  @media screen and (max-width: 420px) {
    width: 100%;
  }
`;

export const UnivSelectTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;
`;

export const UnivListTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  box-sizing: border-box;

  @media screen and (max-width: 420px) {
    width: 200%;
  }
`;

export const UnivListTH = styled.th`
  height: 2.5rem;
  background: #f4f4f4;
  font-weight: bold;
  font-size: 0.6rem;
  line-height: 0.9rem;
  border: 1px solid #c2c2c2;
  border-top: 1px solid black;
`;

export const UnivListTD = styled.td`
  border: 1px solid #c2c2c2;
  height: 2.5rem;
  text-align: center;
  font-weight: normal;
  font-size: 0.45rem;
  line-height: 0.5rem;
`;

export const UnivListButton = styled.button`
  border: 1px solid #c86f4c;
  box-sizing: border-box;
  border-radius: 1rem;
  padding: 0.3rem 0.8rem;
  font-weight: bold;
  font-size: 0.4rem;
  line-height: 0.45rem;
  margin: auto;
  color: #c86f4c;
`;

export const MajorConatiner = styled.div`
  display: flex;
  flex-direction: row;
`;

export const LineContainer = styled.div`
  width: 100%;
  height: 22.5rem;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 1.2rem;
  margin-bottom: 1.8rem;
  box-shadow: 2px 2px 12px #00000014;
`;

export const LineLegendContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
`;

export const LineLegendContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 1.3rem;
`;

export const LineLegendIcon = styled.div`
  width: 1.6rem;
  height: 3px;
  background-color: ${props => props.color};
  margin-right: 0.2rem;
`;

export const LineLegendText = styled.div`
  font-weight: bold;
  font-size: 0.6rem;
  line-height: 0.9rem;
`;

export const SuitabilityContainer = styled.div`
  width: 100%;
  height: 30rem;
  border: 1px solid #9a9a9a;
  box-sizing: border-box;
  box-shadow: 2px 2px 12px #00000014;
  margin-bottom: 36px;
  padding: 0.8rem;
  overflow: auto;
`;

export const SeeDetailButton = styled.button`
  box-sizing: border-box;
  border: 1px solid #000000;
  padding: 0.3rem 1.9rem;
  font-weight: normal;
  font-size: 0.4rem;
  line-height: 0.45rem;
`;

export const CheckBoxInput = styled.input`
  display: none;

  & + label {
    display: inline-block;
    width: 1.25rem;
    height: 1.1rem;
    background: url('https://img.ingipsy.com/assets/icons/d_check_before.png') no-repeat;
  }

  &:checked + label {
    background: url('https://img.ingipsy.com/assets/icons/d_check_after.png') no-repeat;
  }
`;

export const MoblieOverflowContainer = styled.div`
  @media screen and (max-width: 420px) {
    width: 100%;
    overflow: auto;
  }
`;

export const OverflowContainer = styled.div`
  width: 100%;
  overflow: auto;
`;

export const SelectAllContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
`;

export const SelectAllTitle = styled.div`
  font-weight: normal;
  font-size: 0.6rem;
  line-height: 0.9rem;
  margin-left: 0.4rem;
`;
