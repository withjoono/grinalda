import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const ItemContainer = styled.div`
  width: 50%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border: 1px solid #9a9a9a;
  margin-top: 40px;
  box-shadow: 2px 2px 12px 0px #00000024;
`;
const LinkText = styled.span`
  color: #f45119;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
`;

const MENU_LIST = [
  {link: '/gpa/infoform', label: '내신 성적 '},
  {link: '/mockup/inputchoice', label: '모의 성적 '},
  {link: 'regular/infoform', label: '수능 성적  '},
];
const Score = () => {
  return MENU_LIST.map(menu => {
    return (
      <Link href={menu.link}>
        <ItemContainer>
          <h3>{menu.label}</h3>
          <LinkText>수정하기 {'>'}</LinkText>
        </ItemContainer>
      </Link>
    );
  });
};

export default Score;
