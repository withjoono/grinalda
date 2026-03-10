import styled from 'styled-components';

export const Container = styled.div`
  @media screen and (max-width: 420px) {
    width: 100%;
  }
`;

export const Button = styled.button`
  cursor: pointer;
  padding: 0.35rem 2rem;
  background-color: ${props => (props.active ? 'white' : '#c86f4c')};
  color: ${props => (props.active ? '#c86f4c' : 'white')};
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 1.3rem;
  border: ${props => (props.active ? '#c86f4c solid 1px' : 'none')};
  box-sizing: border-box;

  @media screen and (max-width: 420px) {
    width: 100%;
  }
`;
