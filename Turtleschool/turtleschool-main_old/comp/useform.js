import axios from 'axios';
import {useRouter} from 'next/router';
import {useEffect, useState, useCallback} from 'react';

const useForm = () => {
  const [prev, setPrev] = useState();
  const [name, setName] = useState('');
  const [phoneFull, setPhoneFull] = useState('');
  const [phone, setPhone] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [email, setEmail] = useState('');
  const [children, setChildren] = useState([]);
  const [highschool, setHighschool] = useState('');
  const [auth_number, setAuthNumber] = useState('');
  const [college, setCollege] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [grade, setGrade] = useState('');
  const [privacy, setPrivacy] = useState('');
  const [location, setLocation] = useState('');

  
 
  const router = useRouter();

  const locations = [
    '서울특별시',
    '경기도',
    '인천광역시',
    '세종특별자치시',
    '대전광역시',
    '대구광역시',
    '충청북도',
    '충청남도',
    '강원도',
    '광주광역시',
    '전라북도',
    '전라남도',
    '부산광역시',
    '울산광역시',
    '경상북도',
    '경상남도',
    '제주특별자치도',
    '재외한국학교교육청',
  ];
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    getData('/api/members', setPrev);
  }, []);

  useEffect(() => {
    if (!prev || prev.length == 0) return;

    setName(str(prev[0].userName));
    const ph = str(prev[0].cellphone);
    setPhoneFull(ph);
    setPhone(ph.slice(0, 3));
    setPhone1(ph.slice(3, 7));
    setPhone2(ph.slice(7, 11));
    setEmail(str(prev[0].email));
    
    setHighschool(str(prev[0].school));
    setCollege(str(prev[0].univ));
    setMajor(str(prev[0].major));
    setYear(str(prev[0].grdtnplanyear));
    setGrade(str(prev[0].gradeCode));
    setPrivacy(str(prev[0].prsnlinprd));
    setLocation(str(prev[0].region));

    if (prev[0].parentid) {
      const c = prev.map(p => {
        return {
          id: p.childid,
          name: p.childname,
          year: p.childyear,
          grade: p.childgrade,
          highschool: p.childschool,
          region: p.childregion,
        };
      });
      setChildren(c);
    }
    if (str(prev[0].region) != '') handleLocation({target: {value: str(prev[0].region)}});
  }, [prev]);

  const str = s => {
    if (s == null || s == undefined || !s) return '';
    else return s;
  };

  const handleOnInput = (value, maxlength) => {
    if(value.length > maxlength)  {
      value = value.substr(0, maxlength);
    }
  }


  const getData = (api_url, setData) => {
    const get_ = async () => {
      const response = await axios.get(api_url, {
        headers: {
          'Content-Type': 'application/json',
          auth: `${localStorage.getItem('realuid')}`,
        },
      });
      return response.data.data;
    };

    const set_ = async () => {
      const result = await get_();
      setData(result);
    };

    return set_();
  };

  const submit = async (code, ismobile) => {
    
    if(name === ''){
      return alert('성함을 입력해주세요.');

    }else if(email === ''){
      return alert('이메일을 입력해주세요.');
    }

    axios
      .post(
        '/api/members',
        {
          userName: name,
          cellphone: ismobile ? phoneFull : phone + phone1 + phone2,
          email: email,
          gradeCode: grade,
          grdtnPlanYear: year,
          prsnlInprd: privacy,
          school: highschool,
          univ: college,
          department: major,
          region: location,
          children: children,
          relationCode: code,
        },
        {
          headers: {
            auth: localStorage.getItem('realuid'),
          },
        },
      )
      .then(res => {
        alert('회원 가입 완료');
        let mainPaths = ['/main/teacherform', '/main/studentform', '/main/parentform'];
        if (mainPaths.includes(router.asPath)) {
          router.push('/');
        }
      });
  };

  const sms_check =  (code, ismobile) => {

    console.log('code', code);
    if(code === 'sms_check' || code === 'sms_final_check'){
      axios.post(
        '/api/aligo',
        {
          userName: name,
          cellphone: ismobile ? phoneFull : phone + phone1 + phone2,
          email: email,
          gradeCode: grade,
          grdtnPlanYear: year,
          prsnlInprd: privacy,
          school: highschool,
          univ: college,
          department: major,
          region: location,
          children: children,
          relationCode: code,
          auth_number : auth_number
        },
        {
          headers: {
            auth: localStorage.getItem('realuid'),
          },
        },
      ).then(res => {
        console.log('res',res);
        if(code === 'sms_check'){
          if(res.data.success){
            alert('인증번호를 발송했습니다.');

          }else {
            alert('인증번호 발송에 실패했습니다.');
          }

        }else if(code === 'sms_final_check'){
          if(res.data.success){
            alert('인증번호를 확인 완료했습니다.');

          }else {
            alert('인증번호 확인에 실패했습니다.');
          }

        }
      })

    }
    
  };

  const handleLocation = e => {
    const {value} = e.target;
    setLocation(value);
    getData(`/api/highschool?location=${value}`, setSchools);
  };

  const cn = useCallback(e => setName(e.target.value), []);
  const cp = useCallback(e => setPhone(e.target.value), []);
  const cp1 = useCallback(e => setPhone1(e.target.value), []);
  const cp2 = useCallback(e => setPhone2(e.target.value), []);
  const cpf = useCallback(e => setPhoneFull(e.target.value), []);
  const ce = useCallback(e => setEmail(e.target.value), []);
  const childAdd = useCallback(
    () =>
      setChildren(p => {
        p.push({id: '', name: '', year: '', grade: '', highschool: ''});
        return [...p];
      }),
    [],
  );
  const childName = useCallback(
    (e, i) =>
      setChildren(p => {
        p[i].name = e.target.value;
        return [...p];
      }),
    [],
  );
  const childYear = useCallback(
    (e, i) =>
      setChildren(p => {
        p[i].year = e.target.value;
        return [...p];
      }),
    [],
  );
  const childGrade = useCallback(
    (e, i) =>
      setChildren(p => {
        p[i].grade = e.target.value;
        return [...p];
      }),
    [],
  );
  const childSchool = useCallback((e, i) => {

    setChildren(p => {
      p[i].highschool = e;
      return [...p];
    });
  }, []);
  const childRegion = useCallback((e, i) => {
    setChildren(p => {
      p[i].region = e.target.value;
      return [...p];
    });
    getData(`/api/highschool?location=${e.target.value}`, setSchools);
  }, []);

 

  const chs = useCallback(e => setHighschool(e.target.value), []);
  const ccol = useCallback(e => setCollege(e.target.value), []);
  const cm = useCallback(e => setMajor(e.target.value), []);
  const cscs = useCallback(e => setSchools(e), []);
  const cy = useCallback(e => setYear(e.target.value), []);
  const cg = useCallback(e => setGrade(e.target.value), []);
  const cpr = useCallback(e => setPrivacy(e.target.value), []);
  const authValue = useCallback(e => setAuthNumber(e.target.value), []);

  return {
    name: name,
    setName: cn,
    phone: phone,
    setPhone: cp,
    phone1: phone1,
    setPhone1: cp1,
    phone2: phone2,
    setPhone2: cp2,
    email: email,
    setEmail: ce,
    auth_number : auth_number,
    setAuthNumber : setAuthNumber,
    children: children,
    addChild: childAdd,
    setChildName: childName,
    setChildYear: childYear,
    setChildGrade: childGrade,
    setChildSchool: childSchool,
    setChildRegion: childRegion,
    highschool: highschool,
    setHighschool: chs,
    college: college,
    setCollege: ccol,
    major: major,
    setMajor: cm,
    setSchoolLocation: handleLocation,
    schools: schools,
    setSchools: cscs,
    locations: locations,
    year: year,
    setYear: cy,
    privacy: privacy,
    setPrivacy: cpr,
    location: location,
    setLocation: handleLocation,
    grade: grade,
    setGrade: cg,
    submit: submit,
    sms_check : sms_check,
    
    phoneFull,
    setPhoneFull: cpf,
    handleOnInput : handleOnInput,
    auth_number : auth_number,
    setAuthNumber :  authValue,
  
   

  };
};

export default useForm;
