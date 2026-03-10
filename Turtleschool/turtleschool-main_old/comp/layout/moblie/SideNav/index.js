import Image from 'next/image';
import Link from 'next/link';
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import loginContext from '../../../../contexts/login';
import * as S from './index.style.js';
import menus from './menus.json';
import PropTypes from 'prop-types';
import {usePayment} from '../../../../src/api/query';
import {useRouter} from 'next/router';

const SideNav = ({right, onDismiss, redirectMenu}) => {
  const [selectedMenu, setSelectedMenu] = useState('quick');
  const [dropStatus, setDropStatus] = useState([]);
  usePayment();
  const router = useRouter();
  const loginStatus = useContext(loginContext);
  useEffect(() => {
    setDropStatus([...menus[selectedMenu].menu.map(() => true)]);
  }, [selectedMenu]);

  useEffect(() => {
    if (redirectMenu !== '') {
      setSelectedMenu(redirectMenu);
    }
  }, [redirectMenu]);

  const toggleDrop = index => {
    setDropStatus(prev => {
      prev[index] = !prev[index];
      return [...prev];
    });
  };
  const UserType = useMemo(() => {
    switch (loginStatus.info[0]?.relationCode) {
      case '10': // 학생 6BBE60
      case '30':
        return <S.UserType color="#6BBE60">학생</S.UserType>;
      case '20':
        return <S.UserType color="#F2CE77">학부모</S.UserType>;
      case '40':
      case '50':
        return <S.UserType color="#C86F4C">선생님</S.UserType>;
    }
  }, [loginStatus]);

  const renderMenuImage = title => {
    if (title === 'payment')
      return (
        <S.MenuImageContainer
          key="sideNavPay"
          active={active}
          onClick={() => {
            onDismiss();
            router.push('paypage');
          }}
        >
          <S.MenuImageTitle>유료결제</S.MenuImageTitle>
        </S.MenuImageContainer>
      );

    const active = title === selectedMenu;
    const baseUri = 'https://img.ingipsy.com/assets/sidemenu/menus/' + title + '/';
    const url = baseUri + (active ? 'active.svg' : 'unactive.svg');
    return (
      <S.MenuImageContainer
        key={active ? `${title}-active` : `${title}-unactive`}
        active={active}
        onClick={() => setSelectedMenu(title)}
      >
        <Image alt="" loading="eager" priority={true} src={url} width={24} height={24} />
        <S.MenuImageTitle>{menus[title].title}</S.MenuImageTitle>
      </S.MenuImageContainer>
    );
  };

  const MenuIcon = useMemo(() => {
    return Object.keys(menus).map(renderMenuImage);
  }, [selectedMenu]);

  const renderListItem = useCallback(item => {
    if (!item.status) {
      return (
        <S.ListContentItem onClick={() => alert('서비스 개시일 : 22년 1월 3일(월)')}>
          {item.title}
        </S.ListContentItem>
      );
    } else if (item.uri.includes('Consulting')) {
      return (
        <S.ListContentItem onClick={() => onDismiss()}>
          <Link href={item.uri}>{item.title}</Link>
        </S.ListContentItem>
      );
    } else {
      return (
        <Link key={item.title + item.uri} href={item.uri} passHref>
          <S.ListContentItem onClick={() => onDismiss()}>{item.title}</S.ListContentItem>
        </Link>
      );
    }
  }, []);

  const renderListContent = (item, index) => (
    <S.ListContent key={item.title}>
      <S.ListTitleItem onClick={() => menus[selectedMenu].menu.length > 1 && toggleDrop(index)}>
        {item.title}
        {menus[selectedMenu].menu.length > 1 && (
          <Image
            alt=""
            src={'https://img.ingipsy.com/assets/sidemenu/list/down_arrow@3x.png'}
            width={16}
            height={16}
          />
        )}
      </S.ListTitleItem>
      {dropStatus[index] && item.sub?.map(renderListItem)}
    </S.ListContent>
  );
  return (
    <S.Container right={right}>
      <S.HeaderContainer>
        <S.LoginStatusBar>
          <Link href="/" passHref>
            <Image
              alt=""
              onClick={() => onDismiss()}
              src="https://img.ingipsy.com/assets/sidemenu/header/logo@3x.png"
              width={35}
              height={35}
            />
          </Link>
          {loginStatus?.login[0] ? (
            <Link href="/setting/Setting" passHref>
              <S.LoginInfoContainer onClick={() => onDismiss()}>
                <S.LoginTitle>{`${loginStatus.info[0]?.userName} 님`}</S.LoginTitle>
                {UserType}
              </S.LoginInfoContainer>
            </Link>
          ) : (
            <Link href="/main/Login" passHref>
              <S.LoginInfoContainer onClick={() => onDismiss()}>
                <S.LoginTitle>로그인</S.LoginTitle>
                <Image
                  alt=""
                  src="https://img.ingipsy.com/assets/sidemenu/header/line_arrow@3x.png"
                  width={24}
                  height={24}
                />
              </S.LoginInfoContainer>
            </Link>
          )}
          <S.RightMost>
            <Image
              alt=""
              onClick={onDismiss}
              src="https://img.ingipsy.com/assets/sidemenu/header/close@3x.png"
              width={24}
              height={24}
            />
          </S.RightMost>
        </S.LoginStatusBar>
        <S.HeaderContent>
          입시 관리 서비스, <br />
          거북스쿨에 오신걸 환영합니다.
        </S.HeaderContent>
        {/* <S.ButtonContainer>
          <S.HeaderButton>멘토, 멘티 신청/수락</S.HeaderButton>
          <div
            style={{
              width: 1,
              height: 21,
              margin: 'auto 1px',
              backgroundColor: '#FFFFFF20',
            }}
          />

          <S.HeaderButton>거북스쿨 사용법</S.HeaderButton>
        </S.ButtonContainer> */}
      </S.HeaderContainer>
      <S.ContentContainer>
        <S.LeftMenuContainer>{MenuIcon}</S.LeftMenuContainer>
        <S.ListContainer>{menus[selectedMenu].menu.map(renderListContent)}</S.ListContainer>
      </S.ContentContainer>
    </S.Container>
  );
};

SideNav.propTypes = {
  right: PropTypes.node.isRequired,
  onDismiss: PropTypes.node.isRequired,
  redirectMenu: PropTypes.node.isRequired,
};

export default SideNav;
