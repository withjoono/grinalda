import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Title = styled.div`
    font-size: 28px;
    line-height: 36px;
    font-weight: 700;
    color: #403209;
    padding: 0px 8px 8px 8px;
`;

export const HorizontalLine = styled.div`
    margin-bottom: 5px;
    height: 1px;
    background-color: #000000;
`;

export const SubContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const SubContent = styled.div`
    margin: 12px 8px 16px 8px;
    font-size: 20px;
    line-height: 28px;
    font-weight: ${(props) => (props.active ? 'bold' : 400)};
    cursor: pointer;
    a {
        color: #000;
        text-decoration: unset;
    }
    &:hover {
        text-decoration: underline;
        font-weight: bold;
    }
`;
