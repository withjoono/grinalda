import React, { useState, useEffect, useContext } from "react";
import loginContext from '../../contexts/login'
import Menu from '../../comp/susimenu'
import withPayment from '../../comp/paymentwrapper'

const regularbeneficial = () => {
	
	return (
		<>
		<style jsx>{`
			.contain {
				width: 1280px;
				margin: 0 auto;
			}
			.bigtitle1 {
				font-size: 30px;
                font-weight:bold;
				margin:60px auto 15px;
				-webkit-text-stroke: 1px;
			}
            .bigtitle2 {
				font-size: 30px;
                font-weight:bold;
				margin:60px auto 15px;
				-webkit-text-stroke: 1px;
			}
            .school{
           
                width:1280px;
                height:725px;
                border:1px #9D9D9D solid;
                border-radius:20px;
            }
            .school h1{
                text-align:right;
            }
            .table{
                width:1200px;
            }
            .table h1{
                font-size:24px;
                height:68px;
                line-height:68px;
               
            }
            .school table{
                width:1200px;
                font-size:15px;
                border-top:1px #000000 solid;
                margin:auto;
                text-align:center;
                 border-collapse: collapse;
            }
            .school table tr td{
                width:150px;
            }
            .school table tr:nth-of-type(1){
                height:69px;
                background-color:#F5F5F5;
                line-height:69px;
                border-bottom:0.5px #9D9D9D solid;
                
            }
    
            .school table tr{
                height:61px;
          
                line-height:61px;
                border-bottom:0.5px #9D9D9D solid;
            }
            .school table p{
                width:36px;
                height:36px;
                color:#ffffff;
                background-color:#FC8454;
                border-radius:8px;
                font-size:16px;
                text-align:center;
                line-height:36px;
                margin:auto;
            }
        table img{
            position: relative;
            top:7px;
        }
        .exam{
            width:1280px;
            height:391px;
            border:1px #9D9D9D solid;
            border-radius:20px;
        }
        .exam table{
            
            width:1200px;
            font-size:15px;
            border-top:1px #000000 solid;
            margin:40px auto;
            text-align:center;
             border-collapse: collapse;
        }
        .exam table tr td{
            width:150px;
        }
        .exam table tr:nth-of-type(1){
            height:69px;
            background-color:#F5F5F5;
            line-height:69px;
            border-bottom:0.5px #9D9D9D solid;
            
        }
    
        .exam table tr{
            height:61px;
      
            line-height:61px;
            border-bottom:0.5px #9D9D9D solid;
        }
        .exam table p{
            width:36px;
            height:36px;
            color:#ffffff;
            background-color:#FCBF77;
            border-radius:8px;
            font-size:16px;
            text-align:center;
            line-height:36px;
            margin:auto;
        }
		`}</style>
		<Menu index={5} />
		<div className="page">
			<div className="contain">
				<div className="bigtitle1">목표 대학 설정</div>
				<div className="school">
                    <div className="table">
                        <h1>모의지원</h1>
                    </div>
                 <table>
                     <tr>
                        <td></td>
                        <td>위험도</td>
                        <td>전형</td>
                        <td>대학</td>
                        <td>학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>면접/논구술 날짜</td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                         <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                        <td><img src="../assets/icons/Icon_checkbox_none.png"></img></td>
                     </tr>
                 </table>
                </div>
                <div className="bigtitle2">모의 지원</div>
                <div className="exam">
                <table>
                     <tr>
                        <td></td>
                        <td>위험도</td>
                        <td>전형</td>
                        <td>대학</td>
                        <td>학과</td>
                        <td>예상컷</td>
                        <td>차이</td>
                        <td>면접/논구술 날짜</td>
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>위험도</td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>500</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                       
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>위험도</td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>500</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                       
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>위험도</td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>500</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                       
                     </tr>
                     <tr>
                        <td><p>1</p></td>
                        <td>위험도</td>
                        <td>학생부 종합</td>
                        <td>서울대학교</td>
                        <td>수학과</td>
                        <td>500</td>
                        <td>차이</td>
                        <td>2020.10.23</td>
                       
                     </tr>
                     </table>
                </div>
                
			</div>
		</div>
		</>
	);
}

export default withPayment(regularbeneficial,null,'수시');