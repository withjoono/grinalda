import {getAuth, signOut} from 'firebase/auth';
import {useRouter} from 'next/router';
import {useGoogleLogout} from 'react-google-login';

const Logout = ({login, user, render}) => {
  const router = useRouter();
  const onLogoutSucces = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
    login[1](false);
    user[1](null);
  };
  const onFailur = err => {};
  const googleSignOut = useGoogleLogout({
    clientId: '168190756460-j85kjpmc8493cjt5qqgua4rou9s91jrm.apps.googleusercontent.com',
    onLogoutSuccess: onLogoutSucces,
    onFailure: onFailur,
  }).signOut;

  const out = () => {
    if (!localStorage.getItem('google') && !localStorage.getItem('facebook')) {
      Kakao.Auth.logout(function () {
        onLogoutSucces();
      });
    } else if (localStorage.getItem('google')) {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          onLogoutSucces();
        })
        .catch(error => {
          console.log('firebase log out fail');
        });
      // googleSignOut();
    } else {
      FB.getLoginStatus(response => {
        if (response && response.status === 'connected') {
          FB.logout(logoutResponse => onLogoutSucces());
        }
      });
    }
  };
  return render(out);
};

const useLogout = (login, user) => {
  const onLogoutSucces = () => {
    if (typeof window !== 'undefined') {
      const isPopUpOpen = localStorage.getItem('isPopUpOpen');
      localStorage.clear();
      localStorage.setItem('isPopUpOpen', isPopUpOpen);
      sessionStorage.clear();
    }
    login[1](false);
    user[1](null);
  };

  const onFailure = () => {};
  const f = () => {
    login[1](false);
    user[1](null);
    if (!localStorage.getItem('google') && !localStorage.getItem('facebook')) {
      Kakao.Auth.logout(function () {
        onLogoutSucces();
      });
    } else if (localStorage.getItem('google')) {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          onLogoutSucces();
        })
        .catch(error => {
          console.log('firebase log out fail');
        });
      // googleSignOut();
    } else {
      FB.getLoginStatus(response => {
        if (response && response.status === 'connected') {
          FB.logout(logoutResponse => console.log('Logged out, logoutResponse'));
        }
      });
    }
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
    }
  };
  return f;
};

export default Logout;
export {useLogout};
