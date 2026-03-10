import styled from 'styled-components';

export const StyledRow = styled.div`
  display: flex;
  align-items: center;
`;

const Row = ({children}) => {
  return <StyledRow>{children}</StyledRow>;
};

export default Row;
