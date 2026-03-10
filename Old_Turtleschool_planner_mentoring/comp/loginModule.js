import {useState} from 'react';

const loginModule = () => {
	const [login, setLogin] = useState(false);
	const [user, setUser] = useState('');
	const [access_token, setAccess_token] = useState('');
	const [refresh_token, setRefresh_token] = useState('');
	const [info, setInfo] = useState(null);
	const [exams, setExams] = useState(null);
	const [push, setPush] = useState(false);
	const [type, setType] = useState(0);
	const [virtual, setVirtual] = useState(null);
	return {
		login: [login, setLogin],
		user: [user, setUser],
		access_token: [access_token, setAccess_token],
		refresh_token: [refresh_token, setRefresh_token],
		info: [info, setInfo],
		exams: [exams, setExams],
		push: [push, setPush],
		type: [type, setType],
		virtual: [virtual, setVirtual]
	}
}

export default loginModule;