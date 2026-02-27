import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const regionColors: Record<string, { background: string; text: string }> = {
  서울: { background: 'bg-purple-100', text: 'text-purple-800' },
  부산: { background: 'bg-blue-100', text: 'text-blue-800' },
  대구: { background: 'bg-red-100', text: 'text-red-800' },
  인천: { background: 'bg-sky-100', text: 'text-sky-800' },
  광주: { background: 'bg-yellow-100', text: 'text-yellow-800' },
  대전: { background: 'bg-emerald-100', text: 'text-emerald-800' },
  울산: { background: 'bg-indigo-100', text: 'text-indigo-800' },
  세종: { background: 'bg-orange-100', text: 'text-orange-800' },
  경기: { background: 'bg-green-100', text: 'text-green-800' },
  강원: { background: 'bg-cyan-100', text: 'text-cyan-800' },
  충북: { background: 'bg-lime-100', text: 'text-lime-800' },
  충남: { background: 'bg-teal-100', text: 'text-teal-800' },
  전북: { background: 'bg-amber-100', text: 'text-amber-800' },
  전남: { background: 'bg-rose-100', text: 'text-rose-800' },
  경북: { background: 'bg-violet-100', text: 'text-violet-800' },
  경남: { background: 'bg-fuchsia-100', text: 'text-fuchsia-800' },
  제주: { background: 'bg-orange-100', text: 'text-orange-800' },
};

interface RegionBadgeProps {
  name: string;
  className?: string;
}

export function RegionBadge({ name, className }: RegionBadgeProps) {
  const colors = regionColors[name] || {
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
      {name}
    </Badge>
  );
}
