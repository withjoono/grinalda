import styled from 'styled-components';

export const DesktopContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 56px 24px;
`;

export const MiddleDesktopLayout = styled.div`
  max-width: 1280px;
  min-width: 1000px;
  margin: 0 auto;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const TopIndicator = styled.div`
  width: 100%;
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

export const RouteTitle = styled.div`
  font-size: 16px;
  line-height: 24px;
  margin-right: 10px;
  font-weight: ${props => (props.last ? 'bold' : 'normal')};
`;

export const Content = styled.div`
  width: 100%;
  padding-left: 300px;
`;

export const ContentTitle = styled.div`
  font-size: 36px;
  line-height: 42px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const SideNavLayout = styled.div`
  width: 230px;
  margin-right: 70px;
  position: fixed;
  top:40%;
  transform: translateY(-50%);
`;

// mobile

export const MoblieContainer = styled.div``;

export const MobileBody = styled.div`
  padding: 16px;
`;

export const TopTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  line-height: 28px;
  text-align: center;
  color: #ffffff;
  background: #343f56;
  width: 100%;
  padding: 8px 0px;
`;

export const NavContainer = styled.div`
  padding: 6px 15px;
  display: flex;
  flex-direction: row;
  overflow: auto;
  width: 100%;
  border-bottom: 1px solid #d9d9d9;
`;

export const NavContent = styled.div`
  background: ${props => (props.active ? '#F2CE77' : '#FFFFFF')};
  color: ${props => (props.active ? '#FFFFFF' : '#9A9A9A')};
  font-weight: ${props => (props.active ? 800 : 'bold')};
  font-size: 14px;
  line-height: 24px;
  padding: 2px 12px;
  border-radius: 30px;
  white-space: nowrap;
`;
