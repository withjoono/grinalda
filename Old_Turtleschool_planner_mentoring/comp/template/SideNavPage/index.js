import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as S from './index.style';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';
import { useRouter } from 'next/router';

import SideNav from '../../SideNav';

const SideNavPage = ({ children, navTitle, navSubs, routes, navActive, currentPage }) => {
    const router = useRouter();

    const renderTopIndicator = () => {
        return routes.map((name, index) => {
            return (
                <div key={name} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                    <S.RouteTitle last={index === routes.length - 1}>{name}</S.RouteTitle>
                    {index !== routes.length - 1 && <Image src="/assets/icons/d_nav_arrow.png" width={5} height={8} />}
                </div>
            );
        });
    };

    const renderMobileNav = (navs) => (
        <S.NavContainer>
            {navs.map((nav) => (
                <S.NavContent
                    key={nav.title}
                    active={nav.title === currentPage || nav.title === routes[routes.length - 1]}
                    onClick={() => {
                        if (nav.url.includes('Consulting')) {
                            router.push(nav.url);
                            // alert('금일 무료모의지원앱과 플랫폼 연동작업으로 운영이 잠시 중단됩니다. 신속히 완료하고 다시 운영 재개하겠습니다');
                        } else {
                            router.push(nav.url);
                        }
                    }}
                >
                    {nav.title}
                </S.NavContent>
            ))}
        </S.NavContainer>
    );

    return (
        <UserAgentProvider ua={window.navigator.userAgent}>
            <>
                <UserAgent computer>
                    <S.DesktopContainer>
                        <S.MiddleDesktopLayout>
                            <S.TopIndicator>{renderTopIndicator()}</S.TopIndicator>
                            <S.Body>
                                <S.SideNavLayout>
                                    <SideNav title={navTitle} subs={navSubs} currentSub={routes[routes.length - 1]} />
                                </S.SideNavLayout>
                                <S.Content>
                                    <S.ContentTitle>{routes[routes.length - 1]}</S.ContentTitle>
                                    {children}
                                </S.Content>
                            </S.Body>
                        </S.MiddleDesktopLayout>
                    </S.DesktopContainer>
                </UserAgent>
                <UserAgent mobile>
                    <S.MoblieContainer>
                        <S.TopTitle>{navTitle}</S.TopTitle>
                        {renderMobileNav(navSubs)}
                        <S.MobileBody>{children}</S.MobileBody>
                    </S.MoblieContainer>
                </UserAgent>
            </>
        </UserAgentProvider>
    );
};

export default SideNavPage;
