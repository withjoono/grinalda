import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const paymentMethodColors: Record<
  string,
  { background: string; text: string }
> = {
  card: { background: 'bg-purple-100', text: 'text-purple-800' },
  credit: { background: 'bg-purple-100', text: 'text-purple-800' },
  vbank: { background: 'bg-gray-100', text: 'text-gray-800' },
  naverpay: { background: 'bg-green-100', text: 'text-green-800' },
  kakaopay: { background: 'bg-yellow-100', text: 'text-yellow-800' },
  payco: { background: 'bg-red-100', text: 'text-red-800' },
  ssgpay: { background: 'bg-orange-100', text: 'text-orange-800' },
  samsungpay: { background: 'bg-blue-100', text: 'text-blue-800' },
  free: { background: 'bg-emerald-100', text: 'text-emerald-800' },
};

const paymentMethodText: Record<string, string> = {
  card: '신용카드',
  credit: '신용카드',
  vbank: '가상계좌',
  naverpay: '네이버페이',
  kakaopay: '카카오페이',
  payco: '페이코',
  ssgpay: 'SSGPAY',
  samsungpay: '삼성페이',
  FREE: '무료',
};

interface PaymentMethodBadgeProps {
  name: string;
  className?: string;
}

export function PaymentMethodBadge({
  name,
  className,
}: PaymentMethodBadgeProps) {
  const colors = paymentMethodColors[name] || {
    background: 'bg-gray-100',
    text: 'text-gray-800',
  };

  const text = paymentMethodText[name] || '알 수 없음';

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
