import styled from 'styled-components';


export const Container = styled.div`
    position: fixed;
    top: 0;
    right: ${props => props.right};
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    flex-direction: column;
    overflow: auto;
    transition: 0.5s ease-in-out all;
`;

// header

export const HeaderContainer = styled.div`
    background-color: #343F56;
`;

export const LoginStatusBar = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
    padding: 6px 20px;
`;

export const LoginTitle = styled.div`
    font-size: 14px;
    line-height: 24px;
    color: white;
    margin-left: 13px;
`;

export const LoginInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;
`;

export const HeaderContent = styled.div`
    color: white;
    font-size: 12px;
    line-height: 18px;
    padding: 6px 24px 15px 24px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #FFFFFF20;
`;

export const HeaderButton = styled.button`
    padding: 14px;
    color: white;
    font-size: 12px;
    line-height: 18px;
    font-weight: 700;
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
`;

export const RightMost = styled.div`
    margin-left: auto;
`;

export const UserType = styled.div`
    font-size: 10px;
    line-height: 10px;
    color: ${props => props.color};
    border-color: ${props => props.color};
    border-width: 1px;
    border-style: solid;
    border-radius: 2px;
    margin: 0px 20px;
    padding: 4px 8px;
`;

// content

export const ContentContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
    overflow: auto;
    white-space: nowrap;
    background-color: white;
`;

export const LeftMenuContainer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    width: 80px;
    height: 100%;
    background-color: #E6ECF3;
`;


export const ListContainer = styled.div`
    background-color: white;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 8px 16px 8px 20px;
    margin-left: 80px;
`;

export const ListContent = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 8px;
    background-color: white;
`;


export const ListTitleItem = styled.div`
    padding: 16px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    line-height: 18px;
    font-weight: 800;
    border-bottom: 1px solid black;
`;

export const ListContentItem = styled.div`
    padding: 10px 0px;
    font-size: 14px;
    line-height: 24px;
    font-weight: 400;
    border-bottom: 1px solid #D9D9D9;
`;

export const MenuImageContainer = styled.div`
    background-color: ${props => props.active ? 'white' : '#E6ECF3'};
    color: ${props => props.active ? '#C86F4C' : '#343F56'};
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 70px;
    display: flex;
    flex-direction: column;
`;

export const MenuImageTitle = styled.div`
    width: 80px;
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    white-space: pre-wrap;
    word-break: keep-all
`;