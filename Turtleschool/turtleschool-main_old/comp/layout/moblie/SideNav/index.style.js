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
  background-color: #343f56;
`;

export const LoginStatusBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  padding: 0.3rem 1rem;
`;

export const LoginTitle = styled.div`
  font-size: 0.7rem;
  line-height: 1.2rem;
  color: white;
  margin-left: 0.625rem;
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
  border-top-color: #ffffff20;
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
  font-size: 0.5rem;
  line-height: 0.5rem;
  color: ${props => props.color};
  border-color: ${props => props.color};
  border-width: 1px;
  border-style: solid;
  border-radius: 0.1rem;
  margin: 0px 1rem;
  padding: 0.2rem 0.4rem;
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
  width: 4rem;
  height: 100%;
  background-color: #e6ecf3;
`;

export const ListContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0.4rem 0.8rem 0.4rem 1rem;
  margin-left: 4rem;
`;

export const ListContent = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 0.4rem;
  background-color: white;
`;

export const ListTitleItem = styled.div`
  padding: 0.8rem 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  line-height: 0.9rem;
  font-weight: 800;
  border-bottom: 1px solid black;
`;

export const ListContentItem = styled.div`
  padding: 0.5rem 0px;
  font-size: 0.7rem;
  line-height: 1.2rem;
  font-weight: 400;
  border-bottom: 1px solid #d9d9d9;
`;

export const MenuImageContainer = styled.div`
  background-color: ${props => (props.active ? 'white' : '#E6ECF3')};
  color: ${props => (props.active ? '#C86F4C' : '#343F56')};
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 3.5rem;
  display: flex;
  flex-direction: column;
`;

export const MenuImageTitle = styled.div`
  width: 4rem;
  text-align: center;
  font-size: 0.6rem;
  line-height: 0.9rem;
  white-space: pre-wrap;
  word-break: keep-all;
`;
