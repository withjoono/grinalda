import {clientAxios} from './axiosInstances';
import {adminUserAPI, registerAPI} from './urls';

export const registerFetch = async ({auth, name, type, access_token}) =>
  //     : {
  //   auth: string;
  //   name: string;
  //   type: 'google' | 'kakaotalk';
  //   access_token: string;
  //     }
  {
    return clientAxios.get(registerAPI, {
      headers: {auth},
      params: {
        type,
        access_token,
        name: name === 'null' ? '' : name,
      },
    });
  };

export const adminUserFetch = async () => {
  const auth = localStorage.getItem('uid');
  return clientAxios.get(adminUserAPI, {
    headers: {auth},
  });
};
