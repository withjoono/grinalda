import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const admissionTypeColors: Record<
  string,
  { background: string; text: string }
> = {
  논술: { background: 'bg-purple-100', text: 'text-purple-800' },
  '실기(특기자)': { background: 'bg-blue-100', text: 'text-blue-800' },
  '실기(단계)': { background: 'bg-indigo-100', text: 'text-indigo-800' },
  '실기(일괄)': { background: 'bg-sky-100', text: 'text-sky-800' },
  학생부교과: { background: 'bg-emerald-100', text: 'text-emerald-800' },
  학생부학종: { background: 'bg-green-100', text: 'text-green-800' },
};

interface AdmissionTypeBadgeProps {
  name: string;
  className?: string;
}

export function AdmissionTypeBadge({
  name,
  className,
}: AdmissionTypeBadgeProps) {
  // 입력된 이름을 표시 이름으로 변환
  const getDisplayName = (name: string) => {
    switch (name) {
      case '학교':
        return '학생부교과';
      case '학종':
        return '학생부학종';
      case '실기':
        return '실기(특기자)';
      case '실기(단계)':
        return '실기(단계)';
      case '실기(일괄)':
        return '실기(일괄)';
      default:
        return name;
    }
  };
  const admissionTypeName = name.split('_')[0];
  const displayName = getDisplayName(admissionTypeName);
  const colors = admissionTypeColors[displayName] || {
    background: 'bg-gray-100',
    text: 'text-gray-800',
  };
  return (
    <Badge
      variant='secondary'
      className={cn(
        'font-medium',
        colors.background,
        colors.text,
        'border-0',
        'hover:bg-opacity-80',
        className
      )}
    >
      {displayName}
    </Badge>
  );
}
