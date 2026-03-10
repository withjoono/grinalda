import React, { useState, useEffect, useContext } from "react";
import loginContext from '../../contexts/login'
import axios from 'axios'

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
			.bigtitle {
				font-size: 30px;
				margin:60px auto 15px;
				-webkit-text-stroke: 1px;
			}
			.smalltitle {
				margin-bottom: 55px;
			}
			.cards {
				display: flex;
				margin-right: -40px;
			}
			.cards > div {
				display: flex;
				flex-direction: column;
				flex: 1 0 0;
				margin-right: 40px;
			}
			.centered {
				display:flex;
				justify-content: center;
				align-items:center;
			}
			.btn {
				margin: 0 auto;
				width: 62px;
				height: 32px;
				border-radius: 16px;
				background-color:#2c2b57;
				color:white;
				margin-bottom:20px;
			}
			.thing {
				-webkit-text-stroke: 1px;
				margin-bottom: 20px;
			}
			.blob {
				height: 74px;
				padding: 0 70px;
				display:flex;
				justify-content:space-between;
				border: 1px solid #fede01;
				border-radius: 13px;
				margin-bottom: 14px;
			}
		`}</style>
		<div className="page">
			<div className="contain">
				<div className="bigtitle">대학 유불리 정도 파악</div>
				<div className="smalltitle">{localStorage.getItem('name')}님의 희망 대학을 입력해 주세요</div>
				<div className="cards">
					<div>
						<div className="btn centered">가군</div>
						<Thing univ={univ1} code="10" />
					</div>
					<div>
						<div className="btn centered">나군</div>
						<Thing univ={univ2} code="20" />
					</div>
					<div>
						<div className="btn centered">다군</div>
						<Thing univ={univ3} code="30" />
					</div>
				</div>
				<div className="cards">
					<div>
						<div className="btn centered">가군</div>
						<Thing univ={univ1} code="10" />
					</div>
					<div>
						<div className="btn centered">나군</div>
						<Thing univ={univ2} code="20" />
					</div>
					<div>
						<div className="btn centered">다군</div>
						<Thing univ={univ3} code="30" />
					</div>
				</div>
				<div className="cards">
					<div>
						<div className="btn centered">가군</div>
						<Thing univ={univ1} code="10" />
					</div>
					<div>
						<div className="btn centered">나군</div>
						<Thing univ={univ2} code="20" />
					</div>
					<div>
						<div className="btn centered">다군</div>
						<Thing univ={univ3} code="30" />
					</div>
				</div>
			</div>
		</div>
		</>
	);
}

export default regularbeneficial;