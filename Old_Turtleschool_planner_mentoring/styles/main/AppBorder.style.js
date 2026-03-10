import styled from 'styled-components';

export const Container = styled.div`
    width: 100%;
`;

export const CenterLayout = styled.div`
    margin: 0px auto;
    height: 749px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
    max-width: 1280px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 420px) {
        flex-direction: column;
        height: auto;
    }
`;

export const VideoCaption = styled.div`
    padding: 50px 0px;
    @media screen and (max-width: 420px) {
        padding: 24px 24px;
    }
`;

export const VideoContainer = styled.div`
    padding: 28px;
    border: 7px solid #f45119;
    box-sizing: border-box;
    width: 580px;
    height: 500px;
    box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.16);

    @media screen and (max-width: 420px) {
        width: 100%;
        padding: 0px;
        height: auto;
    }
`;

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    @media screen and (max-width: 420px) {
        align-items: center;
    }
`;

export const ContentTitle = styled.div`
    font-weight: normal;
    font-size: 28px;
    line-height: 28px;
    text-align: right;
    margin-bottom: 24px;

    @media screen and (max-width: 420px) {
        font-size: 16px;
        margin-top: 40px;
        margin-bottom: 8px;
    }
`;

export const ContentName = styled.div`
    font-weight: 800;
    font-size: 48px;
    line-height: 54px;
    display: flex;
    align-items: center;
    text-align: right;
    color: #f45119;
    margin-bottom: 50px;

    @media screen and (max-width: 420px) {
        font-size: 24px;
        margin-bottom: 24px;
    }
`;

export const BubbleBox = styled.div`
    padding: 16px 28px;
    background: #ffffff;
    box-shadow: 4px 4px 14px rgba(0, 0, 0, 0.16);
    border-radius: 29px;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    margin-left: 20px;

    @media screen and (max-width: 420px) {
        font-size: 14px;
        margin-bottom: 14px;
    }
`;

export const RowBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const ConvertBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 24px;

    @media screen and (max-width: 420px) {
        flex-direction: column;
        margin-bottom: 0px;
    }
`;

export const StoreContainer = styled.div`
    margin-top: 118px;
    display: flex;
    flex-direction: row;
    align-items: center;

    @media screen and (max-width: 420px) {
        margin-top: 50px;
        margin-bottom: 60px;
    }
`;

export const AppleStoreImage = styled.img`
    width: 257px;
    height: 86px;
    @media screen and (max-width: 420px) {
        width: 160px;
        height: 60px;
    }
`;

export const GoogleStoreImage = styled.img`
    width: 332px;
    height: 128px;
    @media screen and (max-width: 420px) {
        width: 200px;
        height: 90px;
    }
`;

export const OrangeText = styled.p`
    display: inline-block;
    color: #f45119;
`;
