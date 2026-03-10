import React from 'react';
import Link from 'next/link';
import * as S from './index.style';

const SideNav = ({ title, subs, currentSub }) => {
    const renderSubs = () =>
        subs.map((sub) => {
            switch (sub.title) {
                // case '모의지원':
                //     return (
                //         <S.SubContent onClick={() => alert('모집단 표본확대를 위해서, 모의지원 전문 앱인 거북정모에서 모의지원은 별도로 수행합니다 앱스토아에서 다운받아주세요')} active={currentSub === sub.title}>
                //             {sub.title}
                //         </S.SubContent>
                //     );
                default:
                    if (sub.url.includes('Consulting')) {
                        return (
                            <S.SubContent active={currentSub === sub.title}>
                                <Link key={sub.title} href={sub.url}>
                                    {sub.title}
                                </Link>
                            </S.SubContent>
                        );
                    } else {
                        return (
                            <Link key={sub.title} href={sub.url}>
                                <S.SubContent active={currentSub === sub.title}>{sub.title}</S.SubContent>
                            </Link>
                        );
                    }
            }
        });

    return (
        <S.Container>
            <S.Title>{title}</S.Title>
            <S.HorizontalLine />
            <S.SubContainer>{renderSubs()}</S.SubContainer>
        </S.Container>
    );
};

export default SideNav;
