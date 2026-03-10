import {
  IconLayoutDashboard,
  IconUsers,
  IconUser,
  IconEyeglass,
  IconClipboard,
  IconPackage,
  IconBooks,
  IconShoppingCart,
  IconCreditCard,
  IconMessageCircle,
  IconSettings,
  IconCode,
  IconNote,
  IconSchool,
  IconCategory,
} from '@tabler/icons-react';

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export const sidelinks: SideLink[] = [
  {
    title: '대시보드',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: '사용자 정보',
    label: '',
    href: '',
    icon: <IconUsers size={18} />,
    sub: [
      {
        title: '유저 관리',
        label: '',
        href: '/member',
        icon: <IconUser size={18} />,
      },
      {
        title: '사정단 관리x',
        label: '',
        href: '/officer',
        icon: <IconEyeglass size={18} />,
      },
      {
        title: '생기부 관리x',
        label: '',
        href: '/life-record',
        icon: <IconClipboard size={18} />,
      },
    ],
  },
  // {
  //   title: '수시 서비스',
  //   label: '',
  //   href: '',
  //   icon: <IconRoute size={18} />,
  //   sub: [
  //     {
  //       title: '논술 관리 x',
  //       label: '',
  //       href: '/essay',
  //       icon: <IconPencil size={18} />,
  //     },
  //     {
  //       title: '학종 관리',
  //       label: '',
  //       href: '/susi/comprehensive',
  //       icon: <IconAlignBoxBottomCenter size={18} />,
  //     },
  //     {
  //       title: '교과 관리',
  //       label: '',
  //       href: '/susi/subject',
  //       icon: <IconBooks size={18} />,
  //     },
  //     {
  //       title: '합불기록 관리',
  //       label: '',
  //       href: '/susi/pass-record',
  //       icon: <IconGhost size={18} />,
  //     },
  //   ],
  // },
  {
    title: '대학/전형 관리',
    label: '',
    href: '',
    icon: <IconSchool size={18} />,
    sub: [
      {
        title: '대학 관리 (대학, 중심전형, 모집단위, )',
        label: '',
        href: '/core/school',
        icon: <IconSchool size={18} />,
      },
      {
        title: '계열관리 (대,중,소,일반계열)',
        label: '',
        href: '/core/compatible',
        icon: <IconCategory size={18} />,
      },
      {
        title: '전형 유형 관리(세부유형, 전형종류)',
        label: '',
        href: '/core/admission',
        icon: <IconBooks size={18} />,
      },
    ],
  },
  {
    title: '상품 및 결제 관리',
    label: '',
    href: '',
    icon: <IconShoppingCart size={18} />,
    sub: [
      {
        title: '상품 관리',
        label: '',
        href: '/product',
        icon: <IconPackage size={18} />,
      },
      {
        title: '결제 관리',
        label: '',
        href: '/pay',
        icon: <IconCreditCard size={18} />,
      },
    ],
  },
  {
    title: '게시판 서비스',
    label: '',
    href: '',
    icon: <IconMessageCircle size={18} />,
    sub: [
      {
        title: '게시판 관리',
        label: '',
        href: '/board',
        icon: <IconNote size={18} />,
      },
    ],
  },
  {
    title: '공통 설정',
    label: '',
    href: '',
    icon: <IconSettings size={18} />,
    sub: [
      {
        title: '공통 코드 관리',
        label: '',
        href: '/common-code',
        icon: <IconCode size={18} />,
      },
    ],
  },
];
