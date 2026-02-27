import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GradeBadgeProps {
  grade: number;
  className?: string;
}

const getGradeBadgeColor = (grade: number) => {
  switch (grade) {
    case 1:
      return 'bg-blue-200 text-blue-800 hover:bg-blue-300';
    case 2:
      return 'bg-green-200 text-green-800 hover:bg-green-300';
    case 3:
      return 'bg-purple-200 text-purple-800 hover:bg-purple-300';
    default:
      return 'bg-gray-200 text-gray-800 hover:bg-gray-300';
  }
};

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  return (
    <Badge
      className={cn(
        'shrink-0 rounded-full',
        getGradeBadgeColor(grade),
        className
      )}
    >
      {grade === 4 ? 'N수' : `${grade}학년`}
    </Badge>
  );
}
