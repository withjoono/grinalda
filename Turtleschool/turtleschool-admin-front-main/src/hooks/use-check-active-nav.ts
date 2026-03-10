import { useLocation } from 'react-router-dom';

export default function useCheckActiveNav() {
  const { pathname } = useLocation();

  const checkActiveNav = (nav: string) => {
    // nav에서 선행 '/'를 제거
    const cleanNav = nav.replace(/^\//, '');

    // 현재 경로를 '/'로 구분하여 배열로 만듦. 빈 문자열은 제거함
    const pathArray = pathname.split('/').filter((item) => item !== '');

    // nav가 '/'이고 경로 배열의 길이가 0이면 활성화된 것으로 간주
    if (nav === '/' && pathArray.length === 0) return true;

    // cleanNav를 '/'로 분리
    const navParts = cleanNav.split('/');

    // navParts의 모든 부분이 pathArray의 시작 부분과 일치하는지 확인
    return navParts.every((part, index) => pathArray[index] === part);
  };

  return { checkActiveNav };
}
