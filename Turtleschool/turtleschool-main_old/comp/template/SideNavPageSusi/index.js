import {UserAgent, UserAgentProvider} from '@quentin-sommer/react-useragent';
import Image from 'next/image';
import {useRouter} from 'next/router';
import React from 'react';
import SideNav from '../../SideNavSusi';
import * as S from './index.style';
import PropTypes from 'prop-types';

const SideNavPage = ({children, navTitle, navSubs, routes, currentPage}) => {
  const router = useRouter();

  const renderTopIndicator = () => {
    return routes.map((name, index) => {
      return (
        <div
          key={name}
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10}}
        >
          <S.RouteTitle last={index === routes.length - 1}>{name}</S.RouteTitle>
          {index !== routes.length - 1 && (
            <Image
              alt=""
              src="https://img.ingipsy.com/assets/icons/d_nav_arrow.png"
              width={5}
              height={8}
            />
          )}
        </div>
      );
    });
  };

  const renderMobileNav = navs => (
    <S.NavContainer>
      {navs.map(nav => (
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
                  {/* <S.ContentTitle>{routes[routes.length - 1]}</S.ContentTitle> */}
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

SideNavPage.propTypes = {
  children: PropTypes.node.isRequired,
  navTitle: PropTypes.node.isRequired,
  navSubs: PropTypes.node.isRequired,
  routes: PropTypes.node.isRequired,
  currentPage: PropTypes.node.isRequired,
};

export default SideNavPage;
