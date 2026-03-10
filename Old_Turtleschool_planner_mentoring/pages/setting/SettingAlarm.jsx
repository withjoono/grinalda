import React,{ useContext, useState, useEffect} from "react";
import styles from "./Setting.module.css";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import loginContext from '../../contexts/login'
import axios from 'axios'

const base64ToUint8Array = (base64) => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};


const SettingAlarm = () => {
	
	const { push, user } = useContext(loginContext);
	
	const [isSubscribed, setIsSubscribed] = React.useState(false);
  const [subscription, setSubscription] = React.useState(null);
  const [registration, setRegistration] = React.useState(null);
	
	const [toggle, setToggle] = useState(push[0]);
	
	useEffect(() => {
		
		const t = async () => { if (push[0]) {
			if (typeof Notification !== 'undefined' && registration !== null) {Notification.requestPermission( async (status) => {
				if (status == 'granted') {
					const sub = await registration.pushManager.subscribe({
						  userVisibleOnly: true,
						  applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
						});
					const aw = await axios.post('/api/push', {push: sub}, {headers: { "Content-Type": "application/json", auth: user[0] }});
				} else {
					alert('Notification을 브라우저에서 허가하여 주세요');
					push[1](!push[0]);
				}
		  console.log('Notification permission status:', status);
			});}
		} else {
			console.log('hello??');
			await axios.post('/api/push', {push: ''}, {headers: { "Content-Type": "application/json", auth: user[0] }});
		}
		}
		t();
	},[push[0],registration]);
	
	const handleChange = (e) => {
		push[1](!push[0]);
	}
	
	React.useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.workbox !== undefined) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription().then(sub => {
          if (sub && !(sub.expirationTime && Date.now() > sub.expirationTime - 5 * 60 * 1000)) {
            setSubscription(sub);
            setIsSubscribed(true);
            console.log(JSON.stringify(sub))
          }
        });
        setRegistration(reg);
        
      })
    }
  }, []);
	
    return (
        <div>
            <div className={styles.Setting_page}>
                <div className={styles.Setting_content}>
                    <div className={styles.Setting_section}>
                        <div className={styles.Setting_section_title}>알림 설정</div>
                        <div className={[styles.Setting_section_content,styles.Setting_section_flex].join(' ')}>
                            <div className={[styles.Setting_content_version,styles.Setting_content_name].join(' ')}>푸시 수신 동의 (*iOS 미지원)</div>
                            <FormGroup row>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            size="small"
                                            color="primary"
											checked={push[0]}
											onChange={handleChange}
                                        />
                                    }
                                />
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SettingAlarm;