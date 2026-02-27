import {
  BellIcon,
  CircleHelpIcon,
  MessageCircleIcon,
  type LucideIcon,
} from 'lucide-react';
import { PageRoutes } from './routes';

type NavItemType = {
  title: string;
  link: string;
  items?: {
    title: string;
    link: string;
    icon?: LucideIcon;
  }[];
};

export const NavConfig: NavItemType[] = [
  {
    title: '소개',
    link: PageRoutes.ABOUT,
  },
  {
    title: '온라인 수시예측',
    link: PageRoutes.APP_MAIN,
  },
  // {
  //   title: '온라인 컨설팅',
  //   link: PageRoutes.CONSULTING,
  // },
  {
    title: '이용권 구매',
    link: PageRoutes.PURCHASE,
  },
  {
    title: '커뮤니티',
    link: PageRoutes.COMMUNITY_NOTICE,
    items: [
      {
        title: '공지사항',
        link: PageRoutes.COMMUNITY_NOTICE,
        icon: BellIcon,
      },
      {
        title: '자주묻는질문',
        link: PageRoutes.COMMUNITY_FAQ,
        icon: CircleHelpIcon,
      },
      {
        title: '1:1문의하기',
        link: PageRoutes.COMMUNITY_INQUIRY,
        icon: MessageCircleIcon,
      },
    ],
  },
];
