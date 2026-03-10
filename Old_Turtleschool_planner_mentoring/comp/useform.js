import {useState, useEffect} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

const useForm = () => {
	const [prev, setPrev] = useState()
	const [name, setName] = useState('')
	const [phoneFull, setPhoneFull] = useState('')
	const [phone, setPhone] = useState('')
	const [phone1, setPhone1] = useState('')
	const [phone2, setPhone2] = useState('')
	const [email,setEmail] = useState('')
	const [children, setChildren] = useState([])
	const [highschool, setHighschool] = useState('')
	const [college, setCollege] = useState('')
	const [major, setMajor] = useState('')
	const [year, setYear] = useState('')
	const [grade, setGrade] = useState('')
	const [privacy, setPrivacy] = useState('')
	const [location, setLocation] = useState('')
	const router = useRouter()
	
	const locations = ['서울특별시','경기도','인천광역시','세종특별자치시','대전광역시','대구광역시','충청북도','충청남도','강원도','광주광역시','전라북도','전라남도','부산광역시','울산광역시','경상북도','경상남도','제주특별자치도','재외한국학교교육청']
	const [schools, setSchools] = useState([])
	
	useEffect(() => {
		getData('/api/members',setPrev);
	},[])
	
	useEffect(() => {
		if (!prev || prev.length == 0) return;
		console.log(prev)
		setName(str(prev[0].userName))
		const ph = str(prev[0].cellphone)
		setPhoneFull(ph)
		setPhone(ph.slice(0,3))
		setPhone1(ph.slice(3,7))
		setPhone2(ph.slice(7,11))
		setEmail(str(prev[0].email))
		setHighschool(str(prev[0].school))
		setCollege(str(prev[0].univ))
		setMajor(str(prev[0].major))
		setYear(str(prev[0].grdtnplanyear))
		setGrade(str(prev[0].gradeCode))
		setPrivacy(str(prev[0].prsnlinprd))
		setLocation(str(prev[0].region))
		if (prev[0].parentid) {
			const c = prev.map( p => {
			return {name:p.childname,year:p.childyear,grade:p.childgrade,highschool:p.childschool}
			})
			setChildren(c)
		}
		if (str(prev[0].region) != '') handleLocation({target: {value: str(prev[0].region)}})
	},[prev])
	
	const str = (s) => {
		if (s == null || s == undefined || !s) return ''
		else return s
	}
	
	const getData = (api_url, setData) => {
		const get_ = async () => {
			const response = await axios.get(api_url, {
				headers: {
					'Content-Type': 'application/json',
					'auth': `${localStorage.getItem('realuid')}`
				}
			});
	
			return response.data.data
		};

		const set_ = async () => {
			const result = await get_();
			setData(result)
		}

		return set_()
	}  
	const submit = async (code,ismobile) => {
		axios.post('/api/members',{
			userName:name,
			cellphone:ismobile ? phoneFull : phone+phone1+phone2,
			email:email,
			gradeCode:grade,
			grdtnPlanYear: year,
			prsnlInprd: privacy,
			school:highschool,
			univ:college,
			department: major,
			region: location,
			children: children,
			relationCode: code,
		},{
			headers: {
				auth: localStorage.getItem('realuid')
			}
		}).then(res => {
			router.push('/')
		})
	}
	
	const handleLocation = (e) => {
		const {value} = e.target
		setLocation(value)
		getData(`/api/highschool?location=${value}`, setSchools)
	}
	
	const cn = (e) => setName(e.target.value)
	const cp = (e) => setPhone(e.target.value)
	const cp1 = (e) => setPhone1(e.target.value)
	const cp2 = (e) => setPhone2(e.target.value)
	const cpf = (e) => setPhoneFull(e.target.value)
	const ce = (e) => setEmail(e.target.value)
	const childAdd = () => setChildren(p => {p.push({name:'',year:'',grade:'',highschool:''}); return [...p]})
	const childName = (e,i) => setChildren(p => {p[i].name = e.target.value; return [...p]})
	const childYear = (e,i) => setChildren(p => {p[i].year = e.target.value; return [...p]})
	const childGrade = (e,i) => setChildren(p => {p[i].grade = e.target.value; return [...p]})
	const childSchool = (e,i) => setChildren(p => {p[i].highschool = e.target.value; return [...p]})
	const childRegion = (e,i) => setChildren(p => {p[i].region = e.target.value; return [...p]})
	const chs = (e) => setHighschool(e)
	const ccol = (e) => setCollege(e.target.value)
	const cm = (e) => setMajor(e.target.value)
	const cscs = (e) => setSchools(e)
	const cy = (e) => setYear(e.target.value)
	const cg = (e) => setGrade(e.target.value)
	const cpr = (e) => setPrivacy(e.target.value)
	
	return {name:name,setName:cn, phone:phone, setPhone:cp, phone1:phone1, setPhone1:cp1, phone2:phone2, setPhone2:cp2, email:email, setEmail:ce, children: children, addChild:childAdd, setChildName:childName,
	setChildYear:childYear, setChildGrade: childGrade, setChildSchool:childSchool, setChildRegion:childRegion, highschool:highschool, setHighschool:chs, college:college, setCollege:ccol, major:major, setMajor:cm, setSchoolLocation:handleLocation,
	schools: schools, setSchools: cscs, locations:locations, year: year, setYear:cy, privacy:privacy, setPrivacy: cpr, location:location, setLocation:handleLocation, grade:grade, setGrade: cg, submit: submit, phoneFull, setPhoneFull:cpf}
}

export default useForm