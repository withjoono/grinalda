import styled from 'styled-components';

export const Container = styled.div`
    background-color: #ffecbd;
    padding: 8px 20px;
    width: 100%;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    margin: 16px 0px;

    @media screen and (max-width: 420px) {
        font-weight: normal;
        font-size: 10px;
        line-height: 14px;
        padding: 8px;
    }
`;
