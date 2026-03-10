import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import * as S from './index.style.js';
import Link from 'next/link';
import Image from 'next/image';

import loginContext from '../../../../contexts/login';
import menus from './menus.json';
import axios from 'axios';

const SideNav = ({ right, onDismiss, redirectMenu }) => {
    const [selectedMenu, setSelectedMenu] = useState('quick');
    const [dropStatus, setDropStatus] = useState([]);
    const [menuImages, setMenuImages] = useState([]);

    const loginStatus = useContext(loginContext);

    useEffect(() => {
        console.log(loginStatus);
        setDropStatus([...menus[selectedMenu].menu.map(() => true)]);
    }, [selectedMenu]);

    useEffect(() => {
        if (redirectMenu !== '') {
            setSelectedMenu(redirectMenu);
        }
    }, [redirectMenu]);

    const toggleDrop = (index) => {
        setDropStatus((prev) => {
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

    const renderMenuImage = (title) => {
        const active = title === selectedMenu;
        const baseUri = '/assets/sidemenu/menus/' + title + '/';
        const url = baseUri + (active ? 'active.svg' : 'unactive.svg');
        return (
            <S.MenuImageContainer
                key={active ? `${title}-active` : `${title}-unactive`}
                active={active}
                onClick={() => setSelectedMenu(title)}
            >
                <Image loading="eager" priority={true} src={url} width={24} height={24} />
                <S.MenuImageTitle>{menus[title].title}</S.MenuImageTitle>
            </S.MenuImageContainer>
        );
    };

    const MenuIcon = useMemo(() => {
        return Object.keys(menus).map(renderMenuImage);
    }, [selectedMenu]);

    const renderListItem = useCallback((item) => {
        if (!item.status) {
            return <S.ListContentItem onClick={() => alert('서비스 개시일 : 22년 1월 3일(월)')}>{item.title}</S.ListContentItem>;
        } else if (item.uri.includes('Consulting')) {
            return (
                <S.ListContentItem>
                    <Link href={item.uri}>{item.title}</Link>
                </S.ListContentItem>
            );
        } else {
            return (
                <Link key={item.title + item.uri} href={item.uri}>
                    <S.ListContentItem onClick={() => onDismiss()}>{item.title}</S.ListContentItem>
                </Link>
            );
        }
    }, []);

    const renderListContent = (item, index) => (
        <S.ListContent key={item.title}>
            <S.ListTitleItem onClick={() => menus[selectedMenu].menu.length > 1 && toggleDrop(index)}>
                {item.title}
                {menus[selectedMenu].menu.length > 1 && <Image src={'/assets/sidemenu/list/down_arrow@3x.png'} width={16} height={16} />}
            </S.ListTitleItem>
            {dropStatus[index] && item.sub?.map(renderListItem)}
        </S.ListContent>
    );
    return (
        <S.Container right={right}>
            <S.HeaderContainer>
                <S.LoginStatusBar>
                    <Link href="/">
                        <Image onClick={() => onDismiss()} src="/assets/sidemenu/header/logo@3x.png" width={35} height={35} />
                    </Link>
                    {loginStatus?.login[0] ? (
                        <Link href="/setting/Setting">
                            <S.LoginInfoContainer onClick={() => onDismiss()}>
                                <S.LoginTitle>{`${loginStatus.info[0]?.userName} 님`}</S.LoginTitle>
                                {UserType}
                            </S.LoginInfoContainer>
                        </Link>
                    ) : (
                        <Link href="/main/Login">
                            <S.LoginInfoContainer onClick={() => onDismiss()}>
                                <S.LoginTitle>로그인</S.LoginTitle>
                                <Image src="/assets/sidemenu/header/line_arrow@3x.png" width={24} height={24} />
                            </S.LoginInfoContainer>
                        </Link>
                    )}
                    <S.RightMost>
                        <Image onClick={onDismiss} src="/assets/sidemenu/header/close@3x.png" width={24} height={24} />
                    </S.RightMost>
                </S.LoginStatusBar>
                <S.HeaderContent>
                    입시 관리 서비스, <br />
                    거북스쿨에 오신걸 환영합니다.
                </S.HeaderContent>
                <S.ButtonContainer>
                    <S.HeaderButton>멘토, 멘티 신청/수락</S.HeaderButton>
                    <div style={{ width: 1, height: 21, margin: 'auto 1px', backgroundColor: '#FFFFFF20' }} />

                    <S.HeaderButton>거북스쿨 사용법</S.HeaderButton>
                </S.ButtonContainer>
            </S.HeaderContainer>
            <S.ContentContainer>
                <S.LeftMenuContainer>{MenuIcon}</S.LeftMenuContainer>
                <S.ListContainer>{menus[selectedMenu].menu.map(renderListContent)}</S.ListContainer>
            </S.ContentContainer>
        </S.Container>
    );
};

export default SideNav;
