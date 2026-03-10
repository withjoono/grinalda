import styled from 'styled-components';
import { FormControl } from '@material-ui/core';

export const Container = styled.div``;

export const NavContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

export const NavButton = styled.div`
    border: 1px solid ${(props) => (props.active ? '#C86F4C' : '#C2C2C2')};
    box-sizing: border-box;
    display: flex;
    flex: 1;
    color: ${(props) => (props.active ? '#C86F4C' : '#C2C2C2')};
    font-weight: 800;
    font-size: 24px;
    line-height: 32px;
    padding: 10px 0px 8px 0px;
    justify-content: center;
    cursor: pointer;

    @media screen and (max-width: 420px) {
        font-weight: 800;
        font-size: 16px;
        line-height: 18px;
        padding: 16px 0px;
    }
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

export const Content = styled.div`
    margin-bottom: 36px;
`;

export const ContentTable = styled.table`
    width: 100%;
    border-collapse: collapse;

    @media screen and (max-width: 420px) {
        width: ${(props) => (props.scroll ? '200%' : '100%')};
    }
`;

export const PlaceholderBox = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    align-items: center;
    border: 1px solid #dfdfdf;
    border-radius: 5px;
    padding-left: 15px;
    font-size: 14px;
`;

export const TH = styled.th`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background-color: #f4f4f4;
    border: 1px solid #c2c2c2;
    border-top: 1px solid black;
    padding: 12px 8px;
    word-break: keep-all;
`;

export const TD = styled.td`
    text-align: center;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    padding: 12px 0px;
    border: 1px solid #c2c2c2;

    &:first-child {
        /* background-color: #f4f4f4; */
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
    }
`;

export const GoToResultButton = styled.button`
    border: 1px solid #c86f4c;
    box-sizing: border-box;
    border-radius: 20px;
    width: 170px;
    padding: 9px 0px;
    font-weight: normal;
    font-size: 9px;
    line-height: 9px;
    color: #c86f4c;
`;

export const CheckBoxInput = styled.input`
    display: none;

    & + label {
        display: inline-block;
        width: 25px;
        height: 22px;
        margin-top: 6px;
        background: url(/assets/icons/d_check_before.png) no-repeat;
    }

    &:checked + label {
        background: url(/assets/icons/d_check_after.png) no-repeat;
    }
`;

export const EmptyIndicator = styled.div`
    width: 100%;
    border: 1px solid #9a9a9a;
    box-sizing: border-box;
    box-shadow: 2px 2px 12px #00000014;
    padding: 36px 30px;
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
`;

export const SearchContainer = styled.div`
    width: 100%;
    padding: 32px 36px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #9a9a9a;
    box-sizing: border-box;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
    margin-bottom: 36px;

    @media screen and (max-width: 420px) {
        display: flex;
        flex-direction: column;
    }
`;

export const SearchInput = styled.input`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    width: 140px;
`;

export const SearchInputForm = styled.div`
    display: flex;
    flex-direction: row;

    @media screen and (max-width: 420px) {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 16px;
    }
`;

export const SearchInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 8px 12px;
    align-items: center;
    border-bottom: 1px solid #3d94de;
    height: 40px;

    &:first-child {
        margin-right: 40px;
    }

    @media screen and (max-width: 420px) {
        width: 100%;
        margin-bottom: 16px;
        margin-right: 0px;
    }
`;

export const SearchInputLabel = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    white-space: nowrap;
`;

export const SearchInputDivider = styled.div`
    width: 1px;
    height: 16px;
    background-color: #9a9a9a;
    margin: 0px 16px 0px 13px;
`;

export const SearchResultTable = styled.table``;

export const EmptyContainer = styled.div`
    width: 100%;
    padding: 36px 30px;
    border: 1px solid #9a9a9a;
    box-sizing: border-box;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
`;

export const EmptyTitle = styled.div`
    font-weight: bold;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 20px;
`;

export const EmptyDescription = styled.div`
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
`;

export const OutlineFormControl = styled(FormControl)`
    width: 94px;

    @media screen and (max-width: 420px) {
        width: 100%;
    }
`;

export const OverflowContainer = styled.div`
    width: 100%;
    overflow: auto;
`;
