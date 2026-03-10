import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRiskText = (risk: number): string => {
  switch (risk) {
    case 10:
      return "😆 안전(+5)";
    case 9:
      return "😆 안전(+4)";
    case 8:
      return "👍 적정(+3)";
    case 7:
      return "👍 적정(+2)";
    case 6:
      return "👊 소신(+1)";
    case 5:
      return "👊 소신(-1)";
    case 4:
      return "😓 위험(-2)";
    case 3:
      return "😓 위험(-3)";
    case 2:
      return "💀 결격(-4)";
    case 1:
    default:
      return "💀 결격(-5)";
  }
};
