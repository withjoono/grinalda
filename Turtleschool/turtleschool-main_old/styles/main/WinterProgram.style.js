import styled from 'styled-components';

export const Container = styled.div`
  padding: 100px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media screen and (max-width: 420px) {
    padding: 60px 0px;
  }
`;

export const Title = styled.div`
  width: 100%;
  text-align: center;
  font-weight: 800;
  font-size: 48px;
  line-height: 54px;
  margin-bottom: 100px;

  @media screen and (max-width: 420px) {
    font-size: 24px;
    line-height: 24px;
    margin-bottom: 50px;
  }
`;

export const RowBox = styled.div`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 420px) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const Content = styled.div`
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0px 50px;

  @media screen and (max-width: 420px) {
    margin-bottom: 50px;
  }
`;

export const ContentImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 30px;

  @media screen and (max-width: 420px) {
    width: 70px;
    height: 70px;
  }
`;

export const ContentLabel = styled.div`
  padding: 6px 16px;
  background: #fff2ed;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 16px;

  text-align: center;

  color: #f45119;

  @media screen and (max-width: 420px) {
    font-size: 14px;
  }
`;

export const ContentTitle = styled.div`
  font-weight: 800;
  font-size: 28px;
  line-height: 36px;
  margin-bottom: 30px;

  @media screen and (max-width: 420px) {
    font-size: 20px;
    line-height: 28px;
  }
`;

export const ContentDescription = styled.div`
  font-weight: normal;
  font-size: 20px;
  line-height: 36px;
  text-align: center;
  margin-bottom: 36px;

  @media screen and (max-width: 420px) {
    font-size: 16px;
    line-height: 24px;
  }
`;

export const ContentButton = styled.button`
  padding: 16px 110px;

  background: #f45119;
  border-radius: 20px;
  color: white;

  @media screen and (max-width: 420px) {
    font-size: 18px;
    line-height: 26px;
  }
`;
