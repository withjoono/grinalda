import { ApiRoutes, AdminApiRoutes, PageRoutes } from './../constants/routes';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { compile } from 'path-to-regexp';

type ExtractRouteStrings<T> = T extends string
  ? T
  : T extends object
    ? ExtractRouteStrings<T[keyof T]>
    : never;

export const toUrl = (
  path:
    | ExtractRouteStrings<typeof AdminApiRoutes>
    | ExtractRouteStrings<typeof ApiRoutes>
    | ExtractRouteStrings<typeof PageRoutes>,
  params?: object
) => {
  return compile(path, { encode: encodeURIComponent })(params);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvatarFallback(string: string) {
  const names = string.split(' ').filter((name: string) => name);
  const mapped = names.map((name: string) => name.charAt(0).toUpperCase());

  return mapped.join('');
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat('ko-KR').format(price);
}

export function normalizeSubjectName(name: string) {
  // 공백, 점, 모든 특수문자 제거 (･ ,· 등)
  return name
    .replace(/[^\w\s가-힣]/g, '') // 한글, 영문, 숫자, 공백을 제외한 모든 문자 제거
    .replace(/\s+/g, ' ') // 연속된 공백을 하나의 공백으로 변경
    .replace(/[ ]/g, ''); // 공백 제거
}
