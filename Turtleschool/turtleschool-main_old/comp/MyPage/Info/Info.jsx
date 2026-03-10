import React, {useContext} from 'react';
import styled from 'styled-components';
import {Student, Parent, Teacher} from '.';
import {useLogout} from '../../logout';
import loginContext from '../../../contexts/login';
import useForm from '../../useform';
import Profile from './Profile';
import axios from 'axios';
import {useRouter} from 'next/router';

const Container = styled.div`
  display: flex;
`;

const Member = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  margin-right: 30px;
`;

const Function = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  > div {
    display: flex;
    align-items: center;
    border: 1px solid #c2c2c2;
    padding: 20px 30px;
    height: 100px;
    justify-content: space-between;
    box-shadow: 2px 2px 12px 0px #00000024;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    min-width: 490px;
  }

  > div:nth-child(1) {
    margin-bottom: 24px;
  }

  > div:nth-child(2) {
    display: flex;
  }
`;
const LogoutButton = styled.button`
  border: 1px solid #f45119;
  border-radius: 4px;
  font-size: 16px;
  color: #f45119;
  height: 36px;
  width: 158px;
  border-radius: 4px;
  margin-left: 30px;
  &:hover {
    background-color: #f45119;
    color: #ffffff;
  }
`;

const BtnWrapper = styled.div`
  width: 100px;
  display: flex;
  justify-content: space-between;

  > button:first-child {
    color: #f45119;
  }

  > button:last-child {
    color: #c1c1c1;
  }
`;

const WithdrawText = styled.span`
  font-size: 1rem;
  color: #808080;
  text-decoration: underline;
  cursor: pointer;
`;

const selectRelationType = code => {
  switch (code) {
    case '10':
    case '30':
      return 'student';
    case '20':
      return 'parent';
    case '40':
    case '50':
    case '70':
      return 'teacher';
    default:
      return null;
  }
};
const Info = ({}) => {
  const {user, login, info} = useContext(loginContext);
  const logout = useLogout(login, user);
  const router = useRouter();

  const handleUserDelete = async () => {
    try {
      const {data: res} = await axios.delete('/api/members', {
        headers: {
          'Content-Type': 'application/json',
          auth: `${localStorage.realuid}`,
        },
      });
      if (res.success) {
        alert('회원탈퇴가 완료 되었습니다.');
        localStorage.clear();
        logout();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Container>
      <Member>
        {info[0]?.relationCode && (
          <Profile
            type={selectRelationType(info[0].relationCode)}
            relationCode={info[0].relationCode}
          />
        )}
      </Member>
      <Function>
        {/* <div>
          <div>마케팅 푸시 수신 동의</div>
          <BtnWrapper>
            <button>동의</button>
            <button>거부</button>
          </BtnWrapper>
        </div> */}
        <div>
          <div>로그아웃</div>
          <LogoutButton onClick={logout}>로그아웃 하기 </LogoutButton>
        </div>
        <div>
          <div>회원 탈퇴</div>
          <div>
            <WithdrawText onClick={handleUserDelete}>탈퇴하기</WithdrawText>
          </div>
        </div>
      </Function>
    </Container>
  );
};

export default Info;
