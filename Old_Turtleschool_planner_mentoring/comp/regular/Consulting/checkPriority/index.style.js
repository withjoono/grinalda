import styled from 'styled-components';

export const Container = styled.div``;

export const ContentTitle = styled.div`
    font-weight: 800;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 16px;
`;

export const ListContainer = styled.div`
    margin-bottom: 36px;
`;

export const ListHeaderContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

export const ListTable = styled.table`
    width: 100%;
    border-collapse: collapse;

    @media screen and (max-width: 420px) {
        width: 250%;
    }
`;

export const ListTH = styled.th`
    background: #f4f4f4;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    padding: 12px 4px;
    border: 1px solid #c2c2c2;
    word-break: keep-all;
`;

export const ListTD = styled.td`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    border: 1px solid #c2c2c2;
    height: 50px;
    text-align: center;

    padding: 0px 8px;
    &:first-child {
        background: #f4f4f4;
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
    }
`;

export const SeeDetailButton = styled.button`
    box-sizing: border-box;
    border: 1px solid #000000;
    padding: 6px 12px;
    font-weight: normal;
    font-size: 8px;
    line-height: 9px;
    word-break: keep-all;
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

export const NavButton = styled.button`
    height: 56px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background-color: #F2CE77;
    border-radius: 30px;
    color: #000000;
    padding: 0px 16px;
    margin: 0px auto;
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
`;