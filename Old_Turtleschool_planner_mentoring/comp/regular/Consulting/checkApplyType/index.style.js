import styled from 'styled-components';

export const Container = styled.div``;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
`;

export const ContentTitle = styled.div`
    margin-bottom: 16px;
    font-weight: 800;
    font-size: 24px;
    line-height: 32px;

    @media screen and (max-width: 420px) {
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
    }
`;

export const CheckBoxContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    cursor: pointer;
    width: 100%;
`;

export const CheckBoxContent = styled.div`
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: calc((100% - 48px) / 3);
    height: 54px;
    box-shadow: 2px 2px 12px #00000014;
    background: ${(props) => (props.active ? '#E6ECF3' : '#ffffff')};
    color: ${(props) => (props.active ? '#3D94DE' : '#000000')};
    border: 1px solid ${(props) => (props.active ? '#3D94DE' : '#9a9a9a')};
    align-items: center;
    padding: 0px 20px;
    margin-bottom: 16px;

    @media screen and (max-width: 420px) {
        width: 100%;
    }
`;

export const CheckBoxInput = styled.input`
    display: none;

    & + label {
        width: 25px;
        height: 22px;
        background: url(/assets/icons/d_check_before.png) no-repeat;
    }

    &:checked + label {
        background: url(/assets/icons/d_check_after.png) no-repeat;
    }
`;

export const CheckBoxTitle = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    text-align: right;
    max-width: 80%;
`;

export const SaveButtonLayout = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;
`;
