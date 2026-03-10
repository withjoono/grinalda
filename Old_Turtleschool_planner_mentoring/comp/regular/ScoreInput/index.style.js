import styled from 'styled-components';

export const Container = styled.div``;

export const RegularContainer = styled.div``;

export const ContentTitle = styled.div`
    font-weight: 800;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 8px;

    @media screen and (max-width: 420px) {
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
    }
`;

export const ResultConditionContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 16px 0px 24px 0px;
`;

export const ResultConditionButton = styled.button`
    width: 100%;
    cursor: pointer;
    font-weight: 800;
    font-size: 24px;
    line-height: 32px;
    color: ${(props) => (props.active ? '#C86F4C' : '#C2C2C2')};
    border: 1px solid ${(props) => (props.active ? '#C86F4C' : '#C2C2C2')};
    background-color: white;
    padding: 9px 0px;

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

    @media screen and (max-width: 420px) {
        width: 300%;
    }
`;

export const GpaTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    border-top: 1px solid black;

    @media screen and (max-width: 420px) {
        width: 200%;
    }
`;

export const RegularTH = styled.th`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background-color: #f4f4f4;
    border: 1px solid #c2c2c2;
    padding: 12px 0px;
    width: 5%;
`;

export const RegularTD = styled.td`
    border: 1px solid #c2c2c2;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: black;

    &:first-child {
        padding: 15px 0px;
    }
`;

export const RegularInput = styled.input`
    width: 100%;
    padding: 15px 0px;
    text-align: center;
    font-weight: bold;
    font-size: 14px;
    line-height: 24px;
    border: none;

    &::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`;

export const RegularButtonContainer = styled.div`
    display: flex;
    padding-top: 8px;
    justify-content: flex-end;

    @media screen and (max-width: 420px) {
        width: 100%;
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

export const GpaHeaderButtonConatiner = styled.div``;

export const GpaHeaderButton = styled.button`
    font-weight: normal;
    font-size: 9px;
    line-height: 10px;
    text-align: center;
    padding: 7px 0px;
    width: 103px;
    cursor: pointer;
    color: ${(props) => (props.active ? '#3D94DE' : '#656565')};
    border: 1px solid ${(props) => (props.active ? '#3D94DE' : '#9A9A9A')};
    background-color: ${(props) => (props.active ? '#E6ECF3' : 'white')};

    &:first-child {
        border-radius: 30px 0px 0px 30px;
    }

    &:last-child {
        border-radius: 0px 30px 30px 0px;
    }
`;

export const GpaTH = styled.th`
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background-color: #f4f4f4;
    border: 1px solid #c2c2c2;
    padding: 12px 0px;
`;

export const GpaTD = styled.td`
    border: 1px solid #c2c2c2;
    font-weight: normal;
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    color: black;
`;

export const GpaAddButton = styled.button`
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #c86f4c;
    border: #c86f4c solid 1px;
    border-radius: 100px;
    padding: 4px 0px;
    width: 220px;
    text-align: center;
    margin: 12px auto;
    background-color: white;
`;

export const MoblieOverflowContainer = styled.div`
    width: 100%;
    overflow: auto;
`;

export const MoblieAddButtonLayout = styled.div`
    width: 100%;
    border-bottom: 1px solid #c2c2c2;
    display: flex;
    align-items: center;
`;

export const SelectBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const SelectBox = styled.button`
    padding: 12px 8px;
    font-style: normal;
    font-weight: ${props => props.active ? "bold" : "normal"};;
    font-size: 12px;
    line-height: 18px;
    color: ${props => props.active ? "#000000" : "#c2c2c2"};
    background-color: white;
    border: 1px solid ${props => props.active ? "#000000" : "#c2c2c2"};
    word-break: keep-all;
    white-space: nowrap;
`;

export const NavButton = styled.button`
    width: 155px;
    height: 56px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    background-color: #F2CE77;
    border-radius: 30px;
    color: #000000;
    margin: 0px auto;
    margin-top: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
`;