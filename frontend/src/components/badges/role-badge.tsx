import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: string;
  className?: string;
}

const getRoleBadgeConfig = (role: string): { label: string; color: string } => {
  switch (role.toUpperCase()) {
    case 'ROLE_ADMIN':
      return {
        label: '관리자',
        color: 'bg-red-100 text-red-800 hover:bg-red-200',
      };
    case 'ROLE_USER':
      return {
        label: '학생',
        color: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      };
    case 'ROLE_TEACHER':
      return {
        label: '선생님',
        color: 'bg-green-100 text-green-800 hover:bg-green-200',
      };
    default:
      return {
        label: role,
        color: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      };
  }
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { label, color } = getRoleBadgeConfig(role);

  return (
    <Badge className={cn('shrink-0 rounded-full', color, className)}>
      {label}
    </Badge>
  );
}
