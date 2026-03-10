import Form from '../gpa/formform'
import {useState, useEffect} from 'react'
import axios from 'axios'
import Menu from '../../comp/naesinmenu'
import * as XLSX from "xlsx";
import {getData, postData} from '../../comp/data'
import {useRouter} from 'next/router'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const gradeinput = () => {

	const [rawData, setRawData] = useState([])
	const [data,setData] = useState([['','','','','','','','','','','','']])
	const [grade, setGrade] = useState(1)
	const [exceldata, setexceldata] = useState(['','','','','','','','','','','','','','','','',''])
	const [codeData13, setcodeData13] = useState([])
	const [codeData14, setcodeData14] = useState([])
	const [data1,setData1] = useState([['','','','','','','','','','','','']])
	const [type, setType] = useState(0)
	const [company, setCompany] = useState('jinhak')
	const router = useRouter()

	useEffect(() => {
		processData(rawData);
	},[grade])
								
	const changeMyData = e => {
		setData(p => {p[Math.floor(e.target.name/12)][e.target.name%12] = e.target.value; return [...p]})   //e 타겟 벨류 이중배열 쪽
	}
	const changeMyData1 = e => {
		setData1(p => {p[Math.floor(e.target.name/12)][e.target.name%12] = e.target.value; return [...p]})
	}

	const deleteData = e => {
		console.log(1)
		if (data[e][12]) {
			console.log(data)
			const key= {id : data[e][12]}
				postData(`/api/gpa/deleteGpa`, null, {
					data: key
				}, localStorage.getItem('uid'))
			}
			console.log(data)
			setData(p => {p.splice(e,1); return [...p]})
	}

	const deleteData1 = e => {

		if (data1[e][12]) {
		const key= {id : data1[e][12]}
			postData(`/api/gpa/deleteGpa`, null, {
				data: key
			}, localStorage.getItem('uid'))
		}
		setData1(p => {p.splice(e,1); return [...p]})

	}
	
	const changeGrade = e => {
		setGrade(e.target.value);
	}
	const changeType = e => {
		setType(e.target.value);
	}
	const addData = e => {
		data.push(['','','','','','','','','','','',''])
		setData([...data])
	}
	const addData1 = e => {
		data1.push(['','','','','','','','','','','',''])
		setData1([...data1])
	}
	const processData = (d) => {
		setRawData(d);
		const one = d.filter(row => row.semester == 1 && row.grade == grade).map(row => 
			{ const converted = Object.keys(row).reduce((acc,key) => {acc[key] = row[key] == null ? '' : row[key]; return acc},{})
				const {subjectarea, subjectcode,  unit, originscore, averagescore, standarddeviation, achievement, persons, rank, id,aper,bper,cper} = converted;
			return [subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank,aper,bper,cper, id]});
		const two = d.filter(row => row.semester == 2 && row.grade == grade).map(row => 
			{	const converted = Object.keys(row).reduce((acc,key) => {acc[key] = row[key] == null ? '' : row[key]; return acc},{})
				const {subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank, id,aper,bper,cper} = converted;
			return [subjectarea, subjectcode, unit, originscore, averagescore, standarddeviation, achievement, persons, rank,aper,bper,cper, id]});
		if (one.length > 0) setData(one)
		else setData([['','','','','','','','','','','','']])
		if (two.length > 0) setData1(two)
		else setData1([['','','','','','','','','','','','']])
	}
	
	const submitData = () => {
		alert('수정이 완료되었습니다')
		const c = data.map(d => {return {
			grade: grade,
			semester: 1,
			subjectarea: d[0], //교과
			subjectcode: d[1], //과목
			unit: d[2] == '' ? null : d[2],
			originscore: d[3] == '' ? null : d[3],
			averagescore: d[4] == '' ? null : d[4],
			standarddeviation: d[5] == '' ? null : d[5],
			achievement: d[6] == '' ? null : d[6],
			persons: d[7] == '' ? null : d[7],
			rank: d[8] == '' ? null : d[8],
			aper: d[9] == '' ? null : d[9],
			bper: d[10] == '' ? null : d[10],
			cper: d[11] == '' ? null : d[11],
			id : d[12] ? d[12] : null,
			
		}})
		postData(`/api/gpa/Savegpa`, null, {
			data: c
		}, localStorage.getItem('uid'))
	}
	
	const submitData1 = () => {
		alert('수정이 완료되었습니다')
		const c = data1.map(d => {return {
			grade: grade,
			semester: 2,
			subjectarea: d[0], //교과
			subjectcode: d[1], //과목
			unit: d[2] == '' ? null : d[2],
			originscore: d[3] == '' ? null : d[3],
			averagescore: d[4] == '' ? null : d[4],
			standarddeviation: d[5] == '' ? null : d[5],
			achievement: d[6] == '' ? null : d[6],
			persons: d[7] == '' ? null : d[7],
			rank: d[8] == '' ? null : d[8],
			aper: d[9] == '' ? null : d[9],
			bper: d[10] == '' ? null : d[10],
			cper: d[11] == '' ? null : d[11],
			id : d[12] ? d[12] : null,
		}})
		postData(`/api/gpa/Savegpa`, null, {
			data: c
		}, localStorage.getItem('uid'))
	}

	/*
	useEffect(() => {		
		postData(`/api/gpa/Savegpa`, setexceldata, {}, localStorage.getItem('uid'))
	},[])
	*/

	useEffect(() => {
		if (!localStorage.getItem('uid')) return;
		getData('/api/codes/[groupName]', setcodeData13, {groupName : 'curriculum_Code'}, localStorage.getItem('realuid'));		
		getData('/api/codes/[groupName]', setcodeData14, {groupName : 'subject_Code'}, localStorage.getItem('realuid'));
		getData(`/api/gpa/Savegpa`, processData, {}, localStorage.getItem('uid'))
	}, [])

	function handleClick()
	{
		openTextFile();
	}

	function openTextFile() {
		var input = document.createElement("input");
		input.type = "file";
		input.accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"; // 확장자가 xxx, yyy 일때, ".xxx, .yyy"
		input.onchange = function (event) {
			excelExport(event.target.files[0]);
		};
		input.click();
		
	}

	//엑셀 다운로드
	/*
	const ExcelDownload = ({ data, headers }) => {
		return (
		  <Button>
			<CSVLink 
				headers={headers} 
			  data={data} 
			  filename="거북스쿨 성적입력 양식.csv" 
			  target="_blank"
			>
			  Export Excel
			</CSVLink>
		  </Button>
		);
	  };
*/

	function isApple(element, findObject)  {
		if(element.name === findObject)  { //국어, 영어, 수학
		  return true;
		}
	}

	async function excelExport(event)
	{
		let input = event;
		let reader = new FileReader();
		let success = false;
		
		reader.onload = async function () {
			let data = reader.result;
			let workBook = XLSX.read(data, { type: 'binary' });
			
			await workBook.SheetNames.forEach(async function (sheetName) {
				let i = 0;
				if(i == 0)
				{
					let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
					console.log(rows)
					let Porws = JSON.stringify(rows);
					let user = JSON.parse(Porws);
					console.log(user)
					let arraygpa = []; //[['','','','','','','','','', '','','','','','']];
					
					//학년 학기 교과 과목 단위수 원점수 과목평균 표준편차 성취도 수강자수 석차등급 A비율 B비율 C비율
					//if ((Object.keys(user[0]).length == 11 || Object.keys(user[0]).length == 14))
					if(Object.keys(user[0]).includes("학년") && Object.keys(user[0]).includes("학기") && Object.keys(user[0]).includes("교과"))
					{
						await axios.post('/api/gpa/Savegpa',{
							'delete':true,
						},{
							headers: {auth: localStorage.getItem('uid')}
						})
						
						console.log("111111111111111111111111111111");
						
						const queries = async (item) => {
							let codea = "";
							let codeb = "";

							for(let i = 0; i < codeData13.length; i++ )
							{
								if(codeData13[i].description == item["교과"] || codeData13[i].name == item["교과"])
								{
									codea = codeData13[i].code;
									break;
								}								

								if (item["교과"] == "기술·가정" || item["교과"] == "제2외국어" || item["교과"] == "한문" || item["교과"] == "교양")
								{
									codea = "90";
									break;
								}
								else if( item["교과"] == "한국사")
								{
									codea = "10";
									break;
								}
								else if(item["교과"] == "외국어계열")
								{
									codea = "60";
									break;

								}
								else if (item["교과"] == "교양" || item["교과"] == "논술")
								{
									codea = "AA";
									break;
								} else if (codeData13[i].name == '영어' && item['교과'].includes('외국어(영어)')) {
									codea = codeData13[i].code;
									break;
								} else if (codeData13[i].name == '사회(역사/도덕포함)' && item['교과'].includes('사회')) {
									codea = codeData13[i].code;
									break;
								}
							}

							for(let ib = 0; ib < codeData14.length; ib++ )
							{
								if(codeData14[ib].description == item["과목"] || codeData14[ib].name == item["과목"])
								{
									codeb = codeData14[ib].code;
									break;
								}
							}

							if (codeb == '') codeb = item["과목"]

							if(codea == "" || codeb == "")
							{
								return console.log(item["교과"],item["과목"])
							}
							else
							{
								/*
								const nextNamesa = {
									grade: item["학년"], //학년
									semester: item["학기"], //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["단위수"],
									originscore: item["원점수"],
									averagescore: item["과목평균"],
									standarddeviation: item["표준편차"],
									achievement: item["성취도"],
									persons: item["수강자수"],
									rank: item["석차등급"],
									aper: item["A비율"],
									bper: item["B비율"],
									cper: item["C비율"]
								};
								arraygpa.push(nextNamesa);								
								*/
								return await axios.post('/api/gpa/Savegpa',{
									grade: item["학년"], //학년
									semester: item["학기"], //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["단위수"],
									originscore: item["원점수"],
									averagescore: item["과목평균"],
									standarddeviation: item["표준편차"],
									achievement: item['성취도'],
									persons: item["수강자수"],
									rank: item["석차등급"],
									aper: item["A비율"],
									bper: item["B비율"],
									cper: item["C비율"]
								},{
									headers: {auth: localStorage.getItem('uid')}
								})
							}
						}

						await Promise.all(user.map(item => queries(item)))
						await getData(`/api/gpa/Savegpa`, processData, {}, localStorage.getItem('uid'))
						setType(0)
					}
					//else if (Object.keys(user[0]).length == 17)
					else if(Object.keys(user[0]).includes("학년") && Object.keys(user[0]).includes("학기") && 
							Object.keys(user[0]).includes("1학기\r\n이수자수") && Object.keys(user[0]).includes("2학기\r\n이수자수") &&
							Object.keys(user[0]).includes("1학기\r\n단위수") && Object.keys(user[0]).includes("2학기\r\n단위수"))
					{
						
						await axios.post('/api/gpa/Savegpa',{
							'delete':true,
						},{
							headers: {auth: localStorage.getItem('uid')}
						})
						//진학사
						console.log("2222222222222222222222222222222222222222222");
						const queries = async (item) => {

							let codea = ""; //codeData13.find(isApple, name);
							let codeb = ""; //user.find(isApple, name);

							for(let i = 0; i < codeData13.length; i++ )
							{
								if(codeData13[i].description == item["교과"] || codeData13[i].name == item["교과"])
								{
									codea = codeData13[i].code;

									break;
								} else if (codeData13[i].name == '영어' && item['교과'].includes('외국어(영어)')) {
									codea = codeData13[i].code;
									break;
								} else if (codeData13[i].name == '사회(역사/도덕포함)' && item['교과'].includes('사회')) {
									codea = codeData13[i].code;
									break;
								}
							}

							for(let ib = 0; ib < codeData14.length; ib++ )
							{
								if(codeData14[ib].description == item["과목"] || codeData14[ib].name == item["과목"])
								{
									codeb = codeData14[ib].code;
									break;
								}
							}

							if(codea == "" || codeb == "")
							{
								axios.post('/api/gpa/Savegpa',{
									grade: item["학년"], //학년
									semester: "1", //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["1학기\r\n단위수"],
									originscore: item["1학기\r\n원점수"],
									averagescore: item["1학기\r\n평균점수"],
									standarddeviation: item["1학기\r\n표준편차"],
									achievement: item["1학기\r\n성취도"],
									persons: item["1학기\r\n이수자수"],
									rank: item["1학기\r\n석차등급"]
								},{
									headers: {auth: localStorage.getItem('uid')}
								})

								axios.post('/api/gpa/Savegpa',{
									grade: item["학년"], //학년
									semester: "2", //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["2학기\r\n단위수"],
									originscore: item["2학기\r\n원점수"],
									averagescore: item["2학기\r\n평균점수"],
									standarddeviation: item["2학기\r\n표준편차"],
									achievement: item["2학기\r\n성취도"],
									persons: item["2학기\r\n이수자수"],
									rank: item["2학기\r\n석차등급"]
								},{
									headers: {auth: localStorage.getItem('uid')}
								})
							}
							else
							{
								/*
								const nextNamesa = {
									grade: item["학년"], //학년
									semester: "1", //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["1학기\r\n단위수"],
									originscore: item["1학기\r\n원점수"],
									averagescore: item["1학기\r\n평균점수"],
									standarddeviation: item["1학기\r\n표준편차"],
									achievement: item["1학기\r\n성취도"],
									persons: item["1학기\r\n이수자수"],
									rank: item["1학기\r\n석차등급"]
								};
								
								const nextNamesb = {
									grade: item["학년"], //학년
									semester: "2", //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["2학기\r\n단위수"],
									originscore: item["2학기\r\n원점수"],
									averagescore: item["2학기\r\n평균점수"],
									standarddeviation: item["2학기\r\n표준편차"],
									achievement: item["2학기\r\n성취도"],
									persons: item["2학기\r\n이수자수"],
									rank: item["2학기\r\n석차등급"]
								};
								arraygpa.push(nextNamesa);
								arraygpa.push(nextNamesb);
								*/
								axios.post('/api/gpa/Savegpa',{
									grade: item["학년"], //학년
									semester: "1", //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["1학기\r\n단위수"],
									originscore: item["1학기\r\n원점수"],
									averagescore: item["1학기\r\n평균점수"],
									standarddeviation: item["1학기\r\n표준편차"],
									achievement: item["1학기\r\n성취도"],
									persons: item["1학기\r\n이수자수"],
									rank: item["1학기\r\n석차등급"]
								},{
									headers: {auth: localStorage.getItem('uid')}
								})

								axios.post('/api/gpa/Savegpa',{
									grade: item["학년"], //학년
									semester: "2", //학기
									subjectarea: codea, //교과
									subjectcode: codeb, //과목
									unit: item["2학기\r\n단위수"],
									originscore: item["2학기\r\n원점수"],
									averagescore: item["2학기\r\n평균점수"],
									standarddeviation: item["2학기\r\n표준편차"],
									achievement: item["2학기\r\n성취도"],
									persons: item["2학기\r\n이수자수"],
									rank: item["2학기\r\n석차등급"]
								},{
									headers: {auth: localStorage.getItem('uid')}
								})
							}
						}
						await Promise.all(user.map(item => queries(item)))
						await getData(`/api/gpa/Savegpa`, processData, {}, localStorage.getItem('uid'))
						setType(0)	
						
						//console.log(arraygpa);
						//postData(`/api/gpa/Savegpa`, arraygpa, {}, localStorage.getItem('realuid'))
					}
					else
					{
						alert('업로드에 문제가 생겼습니다'+Object.keys(user[0]))
						//셀 읽는 갯수에 시트수를 포함시킴
					}
				}
		
			})
		};
		await reader.readAsBinaryString(event);
		return success;
	}
	
	const excel = (
		<>
			<style jsx>{`
				 *{
            margin:0px;
            padding:0px;
        }   
        .contain{
           
            height:1554px;
         
        }
        ul{
            list-style: none;
        }
        .titlesBorder{
           width:1280px;
           height:150px;
           background-color: #E8E8E8;
           margin:auto;
           display: flex;
           justify-content: space-around;
        }
        .titlesBorder ul{
            margin-top:30px;
        }
        .titlesBorder ul:nth-of-type(1){
            color:#DE6B3D;
            font-size: 24px;
            font-weight: bold;
        }
        .titlesBorder ul:nth-child(n+2) li:nth-of-type(1){
            color:#DE6B3D;
            border-bottom:1px #DE6B3D solid;
        }



        .uploadBorder{
            
            width:1280px;
            margin:32px auto;
      
        }
       .uploadBorder .buttonBorder{
           width:1280px;
           height:616px;
           border:1px #9D9D9D solid;
           border-radius: 20px;
           font-size: 20px;
           position:relative;
       }
       .uploadBorder .buttonBorder .step1{
           width:90%;
           height:136px;
           margin:auto;
       }
       .uploadBorder .buttonBorder ul li:nth-of-type(1){
            width:15%;
       }
       .uploadBorder .buttonBorder ul li:nth-of-type(2){
            width:60%;
       }
       .uploadBorder .buttonBorder button {
            margin-left:10px;
       }
       .uploadBorder .buttonBorder .step1 ul{      
           display: flex;
           
       }
       .uploadBorder .buttonBorder .step1 ul li{      
          line-height:136px;
       }
       .uploadBorder .buttonBorder .step1 ul li:nth-of-type(1){
          color:#DE6B3D;
          font-size: 24px;
       }
       .uploadBorder .buttonBorder .step1 div{
           width:232px;
           height:82px;
           border:1px #9D9D9D solid;
           background-color: #F5F5F5;
           border-radius: 8px;
           margin-top:23px;
		   display:flex;
		   flex-direction:column;
			align-items: center;
			justify-content: center;
		   }

       .uploadBorder .buttonBorder .step2{
           width:90%;
           height:136px;
           margin:auto;
       }
       .uploadBorder .buttonBorder .step2 ul{      
           display: flex;
           
       }
       .uploadBorder .buttonBorder .step2 p{      

           font-size: 16px;
      
       }
       .uploadBorder .buttonBorder .step2 ul li{      
          line-height:100px;
		  height:100px;
          
       }
       .uploadBorder .buttonBorder .step2 ul li:nth-of-type(1){
          color:#DE6B3D;
          font-size: 24px;
       }
       .uploadBorder .buttonBorder .step2 button{
           width:186px;
           height:36px;
           border:1px #9D9D9D solid;
           background-color: #DE6B3D;
           border-radius: 4px;
           margin-top:40px;
           font-size: 14px;
           color:white;
           
       }

       .uploadBorder .buttonBorder .step3{
           width:90%;
           height:136px;
           margin:50px auto;
       }
       .uploadBorder .buttonBorder .step3 ul{      
           display: flex;
           justify-content: space-between;
       }
       .uploadBorder .buttonBorder .step3 p{      
	
           font-size: 16px;


       }
       .uploadBorder .buttonBorder .step3 ul li{      
          line-height:136px;
          
       }
       .uploadBorder .buttonBorder .step3 ul li:nth-of-type(1){
          color:#DE6B3D;
          font-size: 24px;
       }
       
	   .uploadBorder .buttonBorder .step3 button{
		width:186px;
		height:36px;
		border:1px #9D9D9D solid;
		background-color: #DE6B3D;
		border-radius: 4px;
		margin-top:40px;
		font-size: 14px;
		color:white;
		margin-right:100px;
		
	}
       .notice{
        width:1280px;
        margin:auto;
       }
       .notice .noticeBorder1{
        width:1280px;
        height:156px;
        border:1px #707070 solid;
        border-radius: 20px;
       margin-top:10px;
       }
       .notice .noticeBorder1 .text{
           margin-left:30px;
           margin-top:10px;
           font-size: 16px;
       }
       .notice .noticeBorder1 .color{
           color:#EB2626;

       }
       .notice .noticeBorder2{
            width:1280px;
            height:255px;
            border:1px #707070 solid;
            border-radius: 20px;
            margin-top:24px;
          
         
       }
       .notice .noticeBorder2 .titless{
           font-size:18px;
           margin-top:12px;
            margin-left:10px;
            color:#DE6B3D;
       }
       .notice .noticeBorder2 ul{
           margin-top:12px;
           margin-left:10px;    
       }
	   .companyChosen {
		background-color: #DE6B3D !important;
		color: white;
	   }
			`}</style>
			 <div className="contain">

    <div className="titlesBorder">
        <ul className="titless">
            <li>쉽고 빠르게</li>
            <li>내신 성적 입력하기</li>
        </ul>
        <ul className="step1">
            <li>step1</li>
            <li>진학사 성적입력</li>
            <li>엑셀파일 다운로드</li>
        </ul>
        <ul className="step2">
            <li>step2</li>
            <li>엑셀 파일에</li>
            <li>성적 입력</li>
        </ul>

        <ul className="step4">
            <li>step3</li>
            <li>성적 입력 완료</li>
        </ul>
        </div>
    <div className="uploadBorder">
        <h1>내신 성적 파일 업로드</h1>
        <div className="buttonBorder">
            <div className="step1">
                <ul>
                    <li>step1</li>
                    <li>업로드할 업체를 선택해주세요.</li>
                    <div className={company == 'jinhak' ? 'companyChosen' : ''} onClick={() => setCompany('jinhak')}><img src='/assets/jinhak.png'/>진학사</div>
					<div className={company != 'jinhak' ? 'companyChosen' : ''} onClick={() => setCompany('uway')}><img src='/assets/uway.png'/>유웨이</div>
                </ul>
            </div>
			<div className="step3">
                <ul>
                    <li>step2</li>
                    <li>점수를 입력할 양식을 다운로드하세요</li>
					<a href="/excel/거북스쿨 성적입력폼.xlsx" download> 
                    <button >양식다운로드</button>
					</a>
                </ul>
                <p style={{fontSize:'16px'}}> <p>[거북스쿨 내신 샘플]로 입력하시면 학생부</p>
				<p>교과 · 학생부 종합 전형에 최적화된 분석 결과를 받으실 수 있습니다.</p></p>
            </div>
            <div className="step2">
                <ul>
                    <li>step3</li>
                    <li>업로드 해 주세요</li>
                    <button onClick={handleClick}>업로드하기</button>
                </ul>
                <p style={{fontSize:'16px'}}>기존에 입력된 파일이 있다면 자동 삭제됩니다.</p>
            </div>
        </div>
    </div>
    <div className="notice">
        <h1>거북 스쿨만의 내신 분석</h1>
        <div className="noticeBorder1">
            <div className="text">
			현재 연세대, 서울시립대 등 일부 상위권 대학은 수시의 모든 전형을 <span className='color'>Z점수</span>로 반영하고 있고,<br></br>
			학생부 종합의 경우 더 많은 대학들이 Z점수와 내신을 적절히 조합하여 학생 선발에 활용하고 있습니다.<br></br>
			따라서 학생의 Z점수 분석은 필수이며, 이 점수를 파악하기 위해서는<br></br> 
			<span className='color'>원점수, 평균, 편차, 성취도 등 내신 입력 창의 칸을 모두 채우셔야 합니다.</span><br></br>
			진학사 혹은 유웨이에 해당 정보를 입력하셨다면, 그곳에서 파일을 다운로드하신 후 여기에 업로드하시면 됩니다.
            </div>
        </div>
        <div className="noticeBorder2">
            <div className="titless">업로드 실패 이유 TOP7</div>
            <ul>
                <li>1.실제 학생부에 있는 과목명이 아니라 약식으로 과목명을 입력한 경우</li>
                <li>2. 성적에 소수점 대신 콤마 또는 문자가 입력되어 있는 경우</li>
                <li>3.학년 입력 하나씩 빼먹은 경우</li>
                <li>4.각각 1학기, 2학기에 이수한 두 개의 과목을 한 줄에 입력한 경우</li>
                <li>5.소수점 첫째 자리 이상 입력되어 있는 경우 (평균점수/표준편차를 제외하고는 정수, 평균점수/표준편차는 소수점 첫째 자리까지만 입력)
                </li>
                <li>6. 동일한 과목을 두 줄에 입력한 경우 (ex. 국어 1-2학기 이수 - 한 줄에 1학기, 한 줄에 2학기 각각 입력)</li>
                <li>7. 파일형식이 xls인 경우 (엑셀파일은 반드시 xlsx로 저장하여야 합니다.)</li>
            </ul>
        </div>
    </div>
</div>
		</>
	)

	return (<>
		<Menu index={0} />
		<div className="page" style={{marginBottom:'85px'}}>
		<div style={{width:'1280px',margin:'0 auto'}}>
			<div className='menu' onClick={changeType}>
				<button value={0} className={type == 0 ? 'menu_active' : ''}>성적 직접 입력</button>
				<button value={1} className={type == 1 ? 'menu_active' : ''} onClick={() => setType(0)}>엑셀 파일 업로드</button>
			</div>
			{ type == 0 ? <>
			<div className='menu' onClick={changeGrade} style={{height:'60px',marginTop:'20px'}}>
				<button value={1} className={grade == 1 ? 'menu_active' : ''}>1학년</button>
				<button value={2} className={grade == 2 ? 'menu_active' : ''}>2학년</button>
				<button value={3} className={grade == 3 ? 'menu_active' : ''}>3학년</button>
			</div>
			<Form grade={grade} semester={1} data={data} setData={changeMyData} addData={addData} submit={submitData} subjectArea={codeData13} subjectCode={codeData14} deleteData={deleteData}/>
			<Form grade={grade} semester={2} data={data1} setData={changeMyData1} addData={addData1} submit={submitData1} subjectArea={codeData13} subjectCode={codeData14} deleteData={deleteData1}/></>
			: excel }
		</div>
		<div   ></div>
		</div></>
	)
}

export default gradeinput;