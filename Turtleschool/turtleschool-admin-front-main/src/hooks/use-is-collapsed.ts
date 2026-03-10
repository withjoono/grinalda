import { useEffect } from 'react';
import useLocalStorage from './use-local-storage';

export default function useIsCollapsed() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage({
    key: 'collapsed-sidebar',
    defaultValue: false,
  });

  useEffect(() => {
    // 창 크기 조절에 따라 사이드바의 접힘 상태를 설정하는 함수
    const handleResize = () => {
      setIsCollapsed(window.innerWidth < 768 ? false : isCollapsed);
    };

    // 컴포넌트가 마운트될 때 한 번 실행하여 초기 사이드바 상태를 설정
    handleResize();

    // 창 크기 조절 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isCollapsed, setIsCollapsed]);

  // 사이드바의 접힘 상태와 이를 변경하는 함수를 반환
  return [isCollapsed, setIsCollapsed] as const;
}
