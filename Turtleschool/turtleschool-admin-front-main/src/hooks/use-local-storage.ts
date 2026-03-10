import { useEffect, useState } from 'react';

interface LocalStorageProps<T> {
  key: string;
  defaultValue: T;
}

export default function useLocalStorage<T>({ key, defaultValue }: LocalStorageProps<T>) {
  // 로컬 스토리지에서 초기 값을 가져오고, 없으면 기본값을 사용하여 상태를 설정
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? (JSON.parse(storedValue) as T) : defaultValue;
  });

  // 상태 값이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  // 현재 상태 값과 상태를 변경하는 함수를 반환
  return [value, setValue] as const;
}
