import styled from 'styled-components';

export const Container = styled.div``;

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
    padding: 26px 24px;
    font-weight: 800;
    font-size: 16px;
    line-height: 24px;
    display: flex;
    align-items: center;
`;

export const FilterContentLayout = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1;
    padding: 9px 12px;
`;

export const FilterContent = styled.button`
    padding: 3px 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${(props) => (props.active ? '#C86F4C' : 'black')};
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
`;

export const FilterButtonLayout = styled.div`
    padding-top: 24px;
    display: flex;
    justify-content: flex-end;
`;

export const EmptyContainer = styled.div`
    border: 1px solid #9a9a9a;
    box-sizing: border-box;
    width: 100%;
    height: 144px;
    box-shadow: 2px 2px 12px #00000014;
    padding: 36px 30px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const EmptyTitle = styled.div`
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
`;

export const EmptyDescription = styled.div`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
`;

export const UnivResultContainer = styled.div`
    display: flex;
    flex-direction: row;

    @media screen and (max-width: 420px) {
        flex-direction: column;
    }
`;

export const ChartContainer = styled.div`
    width: calc(70% - 24px);
    height: 320px;
    margin-right: 24px;
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
    height: 320px;
    overflow: auto;
    padding: 16px;
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
    height: 50px;
    background: #f4f4f4;
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    border: 1px solid #c2c2c2;
    border-top: 1px solid black;
`;

export const UnivListTD = styled.td`
    border: 1px solid #c2c2c2;
    height: 50px;
    text-align: center;
    font-weight: normal;
    font-size: 9px;
    line-height: 10px;
`;

export const UnivListButton = styled.button`
    border: 1px solid #c86f4c;
    box-sizing: border-box;
    border-radius: 20px;
    padding: 6px 16px;
    font-weight: bold;
    font-size: 8px;
    line-height: 9px;
    margin: auto;
    color: #c86f4c;
`;

export const MajorConatiner = styled.div`
    display: flex;
    flex-direction: row;
`;

export const LineContainer = styled.div`
    width: 100%;
    height: 450px;
    border: 1px solid #9a9a9a;
    box-sizing: border-box;
    border-radius: 2px;
    padding: 24px;
    margin-bottom: 36px;
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
    margin-right: 26px;
`;

export const LineLegendIcon = styled.div`
    width: 32px;
    height: 3px;
    background-color: ${(props) => props.color};
    margin-right: 4px;
`;

export const LineLegendText = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
`;

export const SuitabilityContainer = styled.div`
    width: 100%;
    height: 300px;
    border: 1px solid #9a9a9a;
    box-sizing: border-box;
    box-shadow: 2px 2px 12px #00000014;
    margin-bottom: 36px;
    padding: 16px 16px 16px 16px;
    overflow: auto;
`;

export const SeeDetailButton = styled.button`
    box-sizing: border-box;
    border: 1px solid #000000;
    padding: 6px 38px;
    font-weight: normal;
    font-size: 8px;
    line-height: 9px;

    @media screen and (max-width: 420px) {
        padding: 6px 12px;
    }
`;

export const CheckBoxInput = styled.input`
    display: none;

    & + label {
        display: inline-block;
        width: 25px;
        height: 22px;
        background: url(/assets/icons/d_check_before.png) no-repeat;
    }

    &:checked + label {
        background: url(/assets/icons/d_check_after.png) no-repeat;
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
    margin-bottom: 8px;
`;

export const SelectAllTitle = styled.div`
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    margin-left: 8px;
`;
