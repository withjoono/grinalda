import styled from 'styled-components';

export const TDDimmed = styled.td`
  border: 1px solid #c2c2c2;
  background-color: #c2c2c250;
`;

const ScoreTd = data => {
  const keys = Object.keys(data);
  return Object.values(data).map((value, index) => (
    <TDDimmed key={keys[index]} colSpan={keys[index] === 'kor' || keys[index] === 'mat' ? 2 : 1}>
      {value?.standard_score}
    </TDDimmed>
  ));
};

export default ScoreTd;
