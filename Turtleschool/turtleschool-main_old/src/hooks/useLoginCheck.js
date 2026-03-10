import {useRouter} from 'next/router';
import {useEffect} from 'react';

export const useLoginCheck = () => {
  const router = useRouter();
  useEffect(() => {
    const id = localStorage.getItem('uid');

    if (!id) {
      alert('로그인 후 사용해주세요.');
      router.push('/');
    } else {
      alert('정식서비스는 23년 3월 오픈 예정입니다.');
      router.push('/');
    }
  }, []);
};
