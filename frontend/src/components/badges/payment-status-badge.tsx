import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const paymentStatusColors: Record<
  string,
  { background: string; text: string }
> = {
  paid: { background: 'bg-green-100', text: 'text-green-800' },
  cancelled: { background: 'bg-red-100', text: 'text-red-800' },
  ready: { background: 'bg-blue-100', text: 'text-blue-800' },
  failed: { background: 'bg-red-100', text: 'text-red-800' },
  expired: { background: 'bg-gray-100', text: 'text-gray-800' },
  partialCancelled: { background: 'bg-yellow-100', text: 'text-yellow-800' },
};

const paymentStatusText: Record<string, string> = {
  paid: '결제완료',
  cancelled: '취소됨',
  ready: '준비됨',
  failed: '결제실패',
  expired: '만료됨',
  partialCancelled: '부분 취소됨',
};

interface PaymentStatusBadgeProps {
  name: string;
  className?: string;
}

export function PaymentStatusBadge({
  name,
  className,
}: PaymentStatusBadgeProps) {
  const colors = paymentStatusColors[name] || {
    background: 'bg-gray-100',
    text: 'text-gray-800',
  };

  const text = paymentStatusText[name] || '알 수 없음';

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
      {text}
    </Badge>
  );
}
