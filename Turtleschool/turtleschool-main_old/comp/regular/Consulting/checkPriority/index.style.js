import styled from 'styled-components';

export const Container = styled.div``;

export const ContentTitle = styled.div`
  font-weight: 800;
  font-size: 1.2rem;
  line-height: 1.6rem;
  margin-bottom: 0.8rem;
`;

export const ListContainer = styled.div`
  margin-bottom: 1.8rem;
`;

export const ListHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const ListTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  @media screen and (max-width: 420px) {
    width: 250%;
  }
`;

export const ListTH = styled.th`
  background: #f4f4f4;
  font-weight: bold;
  font-size: 0.6rem;
  line-height: 1.2rem;
  padding: 0.6rem 0.2rem;
  border: 1px solid #c2c2c2;
  word-break: keep-all;
`;

export const ListTD = styled.td`
  font-weight: normal;
  font-size: 0.65rem;
  line-height: 1.2rem;
  border: 1px solid #c2c2c2;
  height: 2.5rem;
  text-align: center;
  padding: 0px 0.4rem;
  &:first-child {
    background: #f4f4f4;
    font-weight: bold;
    font-size: 0.65rem;
    line-height: 1.2rem;
  }
`;

export const SeeDetailButton = styled.button`
  box-sizing: border-box;
  border: 1px solid #000000;
  padding: 0.3rem 0.6rem;
  font-weight: normal;
  font-size: 0.4rem;
  line-height: 0.45rem;
  word-break: keep-all;
`;

export const CheckBoxInput = styled.input`
  display: none;

  & + label {
    display: inline-block;
    width: 1.25rem;
    height: 1.1rem;
    background: url('https://img.ingipsy.com/assets/icons/d_check_before.png') no-repeat;
  }

  &:checked + label {
    background: url('https://img.ingipsy.com/assets/icons/d_check_after.png') no-repeat;
  }
`;

export const MoblieOverflowContainer = styled.div`
  @media screen and (max-width: 420px) {
    width: 100%;
    overflow: auto;
  }
`;

export const OverflowContainer = styled.div`
  width: 100%;
  overflow: auto;
`;

export const SelectAllContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 0.4rem;
`;

export const SelectAllTitle = styled.div`
  font-weight: normal;
  font-size: 0.6rem;
  line-height: 0.9rem;
  margin-left: 0.4rem;
`;

export const NavButton = styled.button`
  height: 2.8rem;
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1.2rem;
  background-color: #f2ce77;
  border-radius: 1.5rem;
  color: #000000;
  padding: 0px 0.8rem;
  margin: 0px auto;
  margin-top: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SaveBtn = styled.button`
  padding: 0.2rem 0.5rem;
  margin: 0.1rem 0.2rem;

  color: #fff;
  border: 1px solid #f45119;
  background-color: #f45119;
`;

export const DelBtn = styled(SaveBtn)`
  color: #f45119;
  background-color: #fff;
  border: 1px solid #f45119;
`;
