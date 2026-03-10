import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {usePayment} from '../api/query';

export const usePayCheck = () => {
  const router = useRouter();
  const [isPayUser, setIsPayUser] = useState(false);
  const {data, isLoading} = usePayment();
  const id = localStorage.getItem('uid');

  useEffect(() => {
    if (!isLoading) {
      if (!id) {
        alert('로그인 후 사용해주세요.');
        router.push('/');
      } else if (data.data.data.length === 0) {
        alert('해당기능은 결제후 사용 가능합니다.');
        router.push('/paypage');
      } else {
        setIsPayUser(true);
      }
    }

    // setIsPayUser(true);
  }, [isLoading]);

  return {isPayUser: true};
};
