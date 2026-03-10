import { useGoogleLogout } from 'react-google-login';
import { useRouter } from 'next/router';
import { getAuth, signOut } from 'firebase/auth';

const Logout = ({ login, user, render }) => {
    const router = useRouter();
    const onLogoutSucces = () => {
        console.log('logout');
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            console.log(localStorage);
        }
        login[1](false);
        user[1](null);
    };
    const onFailur = (err) => {
        console.log('logout fail', err);
    };
    const googleSignOut = useGoogleLogout({
        clientId: '168190756460-j85kjpmc8493cjt5qqgua4rou9s91jrm.apps.googleusercontent.com',
        onLogoutSuccess: onLogoutSucces,
        onFailure: onFailur,
    }).signOut;

    const out = () => {
        if (!localStorage.getItem('google') && !localStorage.getItem('facebook')) {
            Kakao.Auth.logout(function () {
                console.log(Kakao.Auth.getAccessToken());
                onLogoutSucces();
            });
        } else if (localStorage.getItem('google')) {
            const auth = getAuth();
            signOut(auth)
                .then(() => {
                    console.log('firebase log out success');
                    onLogoutSucces();
                })
                .catch((error) => {
                    console.log('firebase log out fail');
                });
            // googleSignOut();
        } else {
            FB.getLoginStatus((response) => {
                console.log(response);
                if (response && response.status === 'connected') {
                    FB.logout((logoutResponse) => onLogoutSucces());
                }
            });
        }
    };
    return render(out);
};

const useLogout = (login, user) => {
    
    const onLogoutSucces = () => {
        console.log('logout');
        if (typeof window !== 'undefined') {
            localStorage.clear();
            sessionStorage.clear();
            console.log(localStorage);
        }
        login[1](false);
        user[1](null);
    };
    
    const onFailure = () => {
        console.log('logout fail');
    };
    const f = () => {
        console.log('logout called')
        login[1](false);
        user[1](null);
        if (!localStorage.getItem('google') && !localStorage.getItem('facebook')) {
            Kakao.Auth.logout(function () {
                console.log(Kakao.Auth.getAccessToken());
                onLogoutSucces();
            });
        } else if (localStorage.getItem('google')) {
			const auth = getAuth();
            signOut(auth)
                .then(() => {
                    console.log('firebase log out success');
                    onLogoutSucces();
                })
                .catch((error) => {
                    console.log('firebase log out fail');
                });
            // googleSignOut();
        } else {
            FB.getLoginStatus((response) => {
                console.log(response);
                if (response && response.status === 'connected') {
                    FB.logout((logoutResponse) => console.log('Logged out, logoutResponse'));
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
export { useLogout };
