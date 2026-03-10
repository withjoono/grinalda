import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  risk: number;
  className?: string;
}

export const RiskBadge = ({ risk, className }: RiskBadgeProps) => {
  if (risk === 10) {
    return <p className={cn("text-green-600", className)}>😆 안전(+5)</p>;
  } else if (risk === 9) {
    return <p className={cn("text-green-600", className)}>😆 안전(+4)</p>;
  } else if (risk === 8) {
    return <p className={cn("text-green-500", className)}>👍 적정(+3)</p>;
  } else if (risk === 7) {
    return <p className={cn("text-green-500", className)}>👍 적정(+2)</p>;
  } else if (risk === 6) {
    return <p className={cn("text-blue-500", className)}>👊 소신(+1)</p>;
  } else if (risk === 5) {
    return <p className={cn("text-blue-500", className)}>👊 소신(-1)</p>;
  } else if (risk === 4) {
    return <p className={cn("text-red-500", className)}>😓 위험(-2)</p>;
  } else if (risk === 3) {
    return <p className={cn("text-red-500", className)}>😓 위험(-3)</p>;
  } else if (risk === 2) {
    return (
      <p className={cn("font-semibold text-red-500", className)}>💀 결격(-4)</p>
    );
  }

  return (
    <p className={cn("font-semibold text-red-500", className)}>💀 결격(-5)</p>
  );
};
