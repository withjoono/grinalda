import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

const usePaywall = (WrappedComponent, SecondComponent, type) => {
    return (props) => {
        const [load, setLoad] = useState(true);
        const [paid, setPaid] = useState(false);
        const router = useRouter();
        // useEffect(() => {
        //     const f = async () => {
        //         if (!type) return true;
        //         const { data } = await axios.get('/api/pay/payment', {
        //             headers: { auth: `${localStorage.getItem('uid')}` },
        //             params: { type: type },
        //         });
        //         if (data.success) {
        //             return true;
        //         } else return false;
        //     };
        //     f().then((e) => {
        //         setPaid(e);
        //         setLoad(false);
        //     });
        // }, []);
        // useEffect(() => {
        //     if (!paid && !load) alert('결제가 필요한 페이지 입니다');
        // }, [paid, load]);
        // if (load) {
        //     return (
        //         <>
        //             <div className='lds-ripple'>
        //                 <div></div>
        //                 <div></div>
        //             </div>
        //         </>
        //     );
        // } else if (paid) {
            return <WrappedComponent {...props} />;
        // } else {
        //     router.push('/paypage');
        //     return null;
        // }
    };
};

export default usePaywall;
