import {callGetMethod} from './csat';
export const paymentFetch = () => {
  try {
    const data = {};
    return callGetMethod({
      name: 'paymentFetch()',
      url: '/api/pay/payment',
      data: data,
    });
  } catch (error) {
    console.error(error);
  }
};
