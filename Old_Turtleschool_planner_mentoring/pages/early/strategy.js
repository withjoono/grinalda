import withDesktop from '../../comp/withdesktop'
import page from '../desktop/earlyattention'
import {useState, useEffect, useContext} from 'react'
import { Checkbox } from '@material-ui/core';

const Strategy = () => {

    const imglinks = ['/assets/icons/checkbox.svg','/assets/icons/checkbox_active.svg']

    const [arr,setArr] = useState([['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>],
    ['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>],
    ['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>],
    ['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>],
    ['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>],
    ['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>],
    ['학생부 종합','고려대','수학과',500,100,'2021.10.23',<img src={imglinks[0]}></img>]])

    const [arr_m,setArr_m] = useState([['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23'],
    ['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23'],
    ['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23'],
    ['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23'],
    ['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23'],
    ['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23'],
    ['학생부 종합','위험','고려대','수학과',500,100,'2021.10.23']])

const [title,setTitle] = useState(0);

const [clicked, setClicked] = useState(Array(arr.length).fill(0))

    const click = (index) => {
        clicked[index] = (clicked[index]+1) % 2;
        arr[index][6] = <img src={imglinks[clicked[index]]}></img>
        setArr([...arr])
    }

    const table= [['전형','대학','학과','예상컷','차이','면접/논구술 날짜','모의지원']]
    const table_m= [['위험도','전형','대학','학과','예상컷','차이','면접/논구술 날짜']]

    return (<>
		<style jsx>{`
        * {
        margin: 0px;
        padding: 0px;
        font-family: "Noto Sans CJK KR";
    }

    li {
        list-style: none;
    }

    a {
        text-decoration: none;
    }
    .content h1 {
        height: 72px;
        font-size: 22px;
        line-height: 72px;
        text-align: left;
    }
    .cell {
        width: 400px;
        height: 10px;
        background-color: #EDEEED;
    }
    .content{
        height:690px;  
    }
    .buttonBox{
       font-size: 15px;
       font-weight: bold;
        width:352px;
        height:40px;
        margin:35px auto;
        border-radius: 5px;
        border:0.5px #D1D1D1 solid;
        line-height: 40px;
        
    }
    .buttonBox button{
        width:50%;
        text-align: center;
    }
    .buttonBox .onButton{
        width:50%;
        text-align: center;
        background-color:#DE6B3D;
    }
    .table{
        margin:auto;
        width:352px;
        margin:auto;
        overflow:scroll;
        height:466px;
        border-top: 1px #000000 solid;
    }
    .table > div {
        width:823px;   
        white-space:nowrap;
        display:flex;
        justify-content: space-around;
    }
    .table > div > div {
        flex:1 0 0;
        display:flex;
        justify-content:center;
        align-items:center
    }
    .table > div > div:first-child {
        flex: 0 0 45px;
    }
    .num {
        height:58px;
        line-height:58px;
        boder-bottom:0.5px #9D9D9D solid;
    }
    .table .titles {
        
        display:flex;
        background-color:#F5F5F5;
        height:41px;
        line-height:41px;
        
   
    }

		`}</style>
    <div className="content">
        <div className="buttonBox" >
            <button className = {title == 0 ? 'onButton' : ''} onClick={()=> setTitle(0)}>관심대학</button>
            <button className = {title == 1 ? 'onButton' : ''} onClick={()=> setTitle(1)}>모의지원</button>
        </div>
        {   title == 0 ?
            <div className = 'table'>
            {
                table.map(t => <div className ='titles'>
                <div/>
                {
                    t.map(tt => <div>{tt}</div>)
                }</div>)
            }
            {
                arr.map((a,i) => <div className = 'texts'>
                <div className='num'><p  style={{width:'28px',height:'28px',lineHeight:'28px',textAlign:'center',background:'#FC8454',color:'#ffffff' ,borderRadius:'8px'}}>{i+1}</p></div>
                {
                    a.map((aa,j) =>{return <div onClick={j == 6 ? () => click(i) : undefined}>{aa}</div>})
                }</div>)
            }
        </div> :
            //모의지원 클릭 
        
        <div className = 'table'>   
            {
                table_m.map(t => <div className ='titles'>
                <div/>
                {
                    t.map(tt => <div>{tt}</div>)
                }</div>)
            }
            {
                arr_m.map((a,i) => <div className = 'texts'>
                <div className='num'><p  style={{width:'28px',height:'28px',lineHeight:'28px',textAlign:'center',background:'#FCBF77',color:'#ffffff' ,borderRadius:'8px'}}>{i+1}</p></div>
                {
                    a.map((aa,j) =>{return <div onClick={j == 6 ? () => click(i) : undefined}>{aa}</div>})
                }</div>)
            }
        </div>

        }
</div></>
	)
}

export default withDesktop(page,Strategy);