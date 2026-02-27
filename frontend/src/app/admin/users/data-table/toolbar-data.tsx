import { UserCircle2, Shield, GraduationCapIcon } from 'lucide-react';

export const roles = [
  {
    value: 'ROLE_USER',
    label: '일반 사용자',
    icon: UserCircle2,
  },
  {
    value: 'ROLE_TEACHER',
    label: '선생님',
    icon: GraduationCapIcon,
  },
  {
    value: 'ROLE_ADMIN',
    label: '관리자',
    icon: Shield,
  },
];

export const grades = [
  {
    value: '1',
    label: '1학년',
  },
  {
    value: '2',
    label: '2학년',
  },
  {
    value: '3',
    label: '3학년',
  },
  {
    value: '4',
    label: 'N수',
  },
];

export const marketingConsent = [
  {
    value: 'true',
    label: '동의',
  },
  {
    value: 'false',
    label: '미동의',
  },
];
