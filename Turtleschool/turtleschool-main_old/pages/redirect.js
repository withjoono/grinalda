import {useRouter} from 'next/router';
import {useEffect} from 'react';

const redirect = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/');
  }, []);
  return (
    <div className="lds-ripple">
      <div></div>
      <div></div>
    </div>
  );
};

export default redirect;
