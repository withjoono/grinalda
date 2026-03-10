import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: yellowgreen;
  position: relative;
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
  padding: 12px 8px 16px 8px;
  font-size: 20px;
  line-height: 28px;
  font-weight: ${props => (props.active ? 'bold' : 400)};
  background-color: ${props => (props.active ? '#F45119' : '#ffffff')};
  color: ${props => (props.active ? '#ffffff' : '#000000')};
  a {
    color: #000;
    text-decoration: unset;
  }
  &:hover {
    text-decoration: none;
    font-weight: bold;
  }
  cursor: pointer;
`;

export const SubContentLabel = styled.div`
  padding: 12px 8px 16px 8px;
  font-size: 20px;
  line-height: 28px;

  a {
    color: #000;
    text-decoration: unset;
  }
`;

export const Dropdown = styled.ul`
  display: ${({active}) => (active ? 'block' : 'none')};
  overflow: hidden;
  transition: display 0.5s ease-out;
  padding: 12px 8px 16px 8px;
  font-size: 20px;
`;

export const ListItem = styled.li`
  padding: 12px 5px 16px 5px;
  font-size: 16px;
  line-height: 28px;
  font-weight: ${props => (props.active ? 'bold' : 400)};
  background-color: ${props => (props.active ? '#F45119' : '#ffffff')};
  color: ${props => (props.active ? '#ffffff' : '#000000')};
  &:hover {
    text-decoration: none;
    font-weight: bold;
    cursor: pointer;
  }
`;

export const SideNavProgress = styled.div`
  position: absolute;
  width: 5px;
  border-radius: 10px;
  height: 100px;
  left: -15px;
  top: 0px;
  background-color: orange;
`;
