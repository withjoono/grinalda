import React, { useState, useEffect, useContext } from "react";
import loginContext from '../../contexts/login'
import axios from 'axios'
import Menu from '../../comp/mouimenu'

const getData = (api_url, setData, params) => {
        const get_ = async () => {
            const response = await axios.get(api_url, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth': `${localStorage.getItem('uid')}`
                },
                params: params
            });

            return response.data.data
        };

        const set_ = async () => {
            const result = await get_();
            setData(result)
        }

        return set_()
    }

const regularbeneficial = () => {
	
	const [univ1, setUniv1] = useState([]);
	const [univ2, setUniv2] = useState([]);
	const [univ3, setUniv3] = useState([]);
	const {exams, type} = useContext(loginContext);
	
	useEffect(() => {
		getData('/api/universities', setUniv1, {groupCode: 10});
		getData('/api/universities', setUniv2, {groupCode: 20});
		getData('/api/universities', setUniv3, {groupCode: 30});
		if (!exams[0] || type && type > 0) {
			getData('/api/exams', exams[1], {type: 0});
			type[1](0);
		}
	},[])
	
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
            .schoolBox{
                display:flex;
                width:1280px;
                height:89px;
                border:1px #9D9D9D solid;
                border-radius:20px;
            }
            .schoolBox p{
                margin-top:22px;
                line-height:46px;
                margin-left:126px;
            }
            .schoolBox p:nth-of-type(2){
                margin-left:40px;
            }
			.univer{
                margin-top:22px;
				width:280px;
                height:46px;
                border:1px #707070 solid;
                margin-left:15px;
			}
            .class{
                margin-top:22px;
                width:280px;
                height:46px;
                border:1px #707070 solid;
                margin-left:15px;
			}
            .pointSubmit{
                width:220px;
                height:47px;
                text-align:center;
                background-color:#DE6B3D;
                color:white;
                border-radius:3px;
                margin-top:22px;
                margin-left:170px;
            }
            .analysis{
                width:1268px;
                height:180px;
                border-radius:20px;
                border:1px #9D9D9D solid;
                margin:auto;
            }
            .analysis table{
                
                margin:41.5px auto;
                width:1188px;
                border-top:1px #363636 solid;
                text-align:center;
                border-collapse: collapse;
            }
            .analysis tr:nth-of-type(1){
                font-size:16px;
                font-weight:bold;
                height:50px;
                width:1187px;
                border-bottom:1px #CBCBCB solid;
                background-color:#F6F6F6;
            }
            .analysis tr:nth-of-type(2){
                height:51px;
                font-size:18px;
                font-weight:bold;
                height:51px;
                width:1187px;
                border-bottom:1px #CBCBCB solid;
            }
            .analysis tr td :nth-of-type(1){
                
                border-right:1px #CBCBCB solid;
            }
		`}</style>
		<Menu index={4} />
		<div className="page">
			<div className="contain">
				<div className="bigtitle1">목표 대학 설정</div>
				<div className="schoolBox">
                    <p>대학</p><input type="text" className="univer" placeholder="대학입력" />
                    <p>학과</p><input type="text" className="class" placeholder="학과 입력" />
                   <input type="button" className="pointSubmit" value="목표대학 점수 확인하기"/>
                </div>
                <div className="bigtitle2">배점 분석</div>
                <div className="analysis">
                    <table>
                        <tr>
                            <td>전형</td>
                            <td>목표대학 점수</td>
                            <td>내 점수</td>
                        </tr>
                        <tr>
                            <td>정시</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    </table>
                </div>
                
			</div>
		</div>
		</>
	);
}

export default regularbeneficial;