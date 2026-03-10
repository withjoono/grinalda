import {useContext, useEffect} from 'react'
import loginContext from '../contexts/login'

function useLogin (WrappedComponent, SecondComponent) {
	return (props) => { 
	const {login, user} = useContext(loginContext);
		if (user[0]) {
			return <WrappedComponent {...props}/>;
		} else {
			if (!SecondComponent) return <p> you must log in first</p>;
			else return <SecondComponent {...props}/>;
		}
	};
}

export default useLogin;