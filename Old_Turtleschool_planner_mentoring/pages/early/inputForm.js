import {useState} from 'react'
import s from './earlyCSS/inputForm.module.css'

const Input = ({grade, semester, data, setData, addData, submit, subjectArea, subjectCode}) => {
    const [index, setIndex] = useState(data.length-1)
    console.log(data)
    const findSubjectArea = (val) => {
        for (let i=0;i<subjectArea.length;i++){
            if (subjectArea[i].code == val) return subjectArea[i].name
        }
        return null
    }
    return(<>
			<div style={{height:'40px',width:'100%'}}/>
			<div style={{lineHeight:'30px',fontSize:'22px',marginBottom:'12px',fontWeight:'bold'}}>
			<span style={{color:'#DE6B3D'}}>{grade}학년{semester}학기</span><br/>
			내신 정보를 입력해 주세요.
			</div>	
			<div className={s.border} style={{marginTop:'10px'}}>
                <div className={s.boxBorder}>
                    {
                        data.map((d, i) => {
                            if (i == data.length-1) return null;
                            return <div className={s.boxSub} onClick={() => setIndex(i)}>{findSubjectArea(d[0])}</div>
                        })
                    }
                </div>
				<div className={s.titles}>
					<span>교과</span><span>과목</span><span>단위수</span>
				</div>
				<div className={s.title_section}>
					<select disabled value={data[index][0]} onChange={(e) => setData(index,0,e)}>
                        <option value="none">입력</option>
                        {subjectArea.map(e => <option value={e.code}>{e.name}</option>)}
					</select>
                    <select disabled value={data[index][1]} onChange={(e) => setData(index,1,e)}>
                        <option value="none">입력</option>
                        {subjectCode.filter(r => r.code[0] == data[index][0][0]).map(e => <option value={e.code}>{e.name}</option>)}
					</select>
					<input disabled value={data[index][2]} onChange={(e) => setData(index,2,e)}/>
				</div>
				<div className={s.titles}  style={{marginTop:'11px'}}>
					<span>원점수</span><span>평균</span><span>표준편차</span>
				</div>
				<div className={s.title_section}>
				
                    <input disabled value={data[index][3]} onChange={(e) => setData(index,3,e)}/>
				
				
                    <input disabled value={data[index][4]} onChange={(e) => setData(index,4,e)}/>
					
				
                    <input disabled value={data[index][5]} onChange={(e) => setData(index,5,e)}/>
				
				</div>
				<div className={s.titles} style={{marginTop:'11px'}}>
					<span>성취도</span><span>인원</span><span>등수</span>
				</div>
				<div className={s.title_section}>
                <input disabled value={data[index][6]} onChange={(e) => setData(index,6,e)}/>
				
				
                <input disabled value={data[index][7]} onChange={(e) => setData(index,7,e)}/>
                
            
                <input disabled value={data[index][8]} onChange={(e) => setData(index,8,e)}/>
            
				</div>

                <div className={s.titles} style={{marginTop:'11px'}}>
					<span>A비율</span><span>B비율</span><span>C비율</span>
				</div>
				<div className={s.title_section}>
                <input disabled value={data[index][9]} onChange={(e) => setData(index,9,e)}/>
				
				
                <input disabled value={data[index][10]} onChange={(e) => setData(index,10,e)}/>
                
            
                <input disabled value={data[index][11]} onChange={(e) => setData(index,11,e)}/>
            
				</div>

			
		
            </div>
            <div className='notice' style={{border:'1px #DE6B3D solid',borderRadius:'25px',margin:'50px auto',textAlign:'center'}}>
				<span className='color'>성적 입력을 원하시는 분은</span><br></br><span>웹으로 접속하여 이용해주세요.</span>
			
			</div>
        </>
    )
}
export default Input;