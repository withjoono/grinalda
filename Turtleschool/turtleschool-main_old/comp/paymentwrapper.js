import {useRouter} from 'next/router';
import {useState} from 'react';

const usePaywall = (WrappedComponent, SecondComponent, type) => {
  return props => {
    const [load, setLoad] = useState(true);
    const [paid, setPaid] = useState(false);
    const router = useRouter();
    {
      /* //  --------------------    tempCode     ---------------------------// */
    }

    // const junsiItem = {
    //   id: 9,
    //   name: '정시합격예측',
    //   price: 10000,
    //   labelPrice: 69000,
    //   dependence: null,
    // };
    // if (props.payments[props.payments.length - 1].name === '정시합격예측') {
    // } else {
    //   props.payments.push(junsiItem);
    //   //   for (let i = 0; i < 7; i++) {
    //   //     props.payments.shift();
    //   //   }
    // }

    {
      /* //  -----------------------------------------------------------// */
    }
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
