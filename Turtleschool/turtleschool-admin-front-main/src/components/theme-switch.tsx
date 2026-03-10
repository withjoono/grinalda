import { useTheme } from './theme-provider';
import { useEffect } from 'react';
import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button } from './custom/button';

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  // 테마가 업데이트될 때 theme-color 메타 태그를 업데이트
  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    metaThemeColor && metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className="rounded-full"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
    </Button>
  );
}
