import { PageRoutes } from './routes';
import {
  BookIcon,
  BellIcon,
  CircleHelpIcon,
  ClipboardListIcon,
  CreditCardIcon,
  FileSpreadsheetIcon,
  FileTerminalIcon,
  GraduationCapIcon,
  LucideIcon,
  MapPinIcon,
  MessageSquareIcon,
  PackageIcon,
  PopcornIcon,
  SettingsIcon,
  TagsIcon,
  TicketIcon,
  UsersIcon,
  ChartLineIcon,
  TagIcon,
} from 'lucide-react';

type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href: string;
  icon?: LucideIcon;
  isComing?: boolean;
  isNew?: boolean;
  newTab?: boolean;
  items?: PageRoutesItemType;
}[];

export const AdminSidebarConfig: PageRoutesType[] = [
  {
    title: '대시보드',
    items: [
      {
        title: '통계',
        href: PageRoutes.ADMIN_DASHBOARD,
        icon: ChartLineIcon,
      },
    ],
  },
  {
    title: '회원 관리',
    items: [
      {
        title: '사용자 관리',
        href: PageRoutes.ADMIN_USERS,
        icon: UsersIcon,
      },
    ],
  },
  {
    title: '데이터 관리',
    items: [
      {
        title: '지역 관리',
        href: PageRoutes.ADMIN_REGIONS,
        icon: MapPinIcon,
      },
      {
        title: '대학 관리',
        href: PageRoutes.ADMIN_UNIVERSITIES,
        icon: GraduationCapIcon,
      },
      {
        title: '검색태그 관리',
        href: PageRoutes.ADMIN_SEARCH_TAGS,
        icon: TagsIcon,
      },
      {
        title: '전형유형 관리',
        href: PageRoutes.ADMIN_ADMISSION_TYPES,
        icon: FileSpreadsheetIcon,
      },
      {
        title: '수시전형 관리',
        href: PageRoutes.ADMIN_EARLY_ADMISSIONS,
        icon: ClipboardListIcon,
      },
      {
        title: '교과 관리',
        href: PageRoutes.ADMIN_SUBJECTS,
        icon: BookIcon,
      },
    ],
  },
  {
    title: '결제 관리',
    items: [
      {
        title: '상품 관리',
        href: PageRoutes.ADMIN_PRODUCTS,
        icon: PackageIcon,
      },
      {
        title: '쿠폰 관리',
        href: PageRoutes.ADMIN_COUPONS,
        icon: TicketIcon,
      },
      {
        title: '결제/환불 내역',
        href: PageRoutes.ADMIN_PAYMENTS,
        icon: CreditCardIcon,
      },
    ],
  },
  {
    title: '게시판 관리',
    items: [
      {
        title: '공지사항 카테고리',
        href: PageRoutes.ADMIN_COMMUNITY_NOTICE_CATEGORY,
        icon: TagIcon,
      },
      {
        title: '공지사항',
        href: PageRoutes.ADMIN_COMMUNITY_NOTICE,
        icon: BellIcon,
      },
      {
        title: 'FAQ',
        href: PageRoutes.ADMIN_COMMUNITY_FAQ,
        icon: CircleHelpIcon,
      },
      {
        title: '1:1 문의',
        href: PageRoutes.ADMIN_COMMUNITY_INQUIRY,
        icon: MessageSquareIcon,
      },
      {
        title: '팝업 관리',
        href: PageRoutes.ADMIN_COMMUNITY_POPUP,
        icon: PopcornIcon,
      },
    ],
  },
  {
    title: '시스템 관리',
    items: [
      {
        title: '로그 관리',
        href: PageRoutes.ADMIN_SYSTEM_LOGS,
        icon: FileTerminalIcon,
      },
      {
        title: '설정',
        href: PageRoutes.ADMIN_SYSTEM_SETTINGS,
        icon: SettingsIcon,
      },
    ],
  },
];
