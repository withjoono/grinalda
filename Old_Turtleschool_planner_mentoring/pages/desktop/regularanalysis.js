import loginContext from '../../contexts/login'
import axios from 'axios'
import pool from '../../lib/pool'
import {useState, useEffect, useContext} from 'react'

const regularanalysis = ({subjectcode}) => {
	
	const btn = {
		width:'180px',
		height:'40px',
		display:'flex',
		border:'2px solid #fede01',
		marginBottom:'-2px',
		alignItems:'center',
		justifyContent:'center',
		marginRight:'5px'
	}
	
	const ctx = useContext(loginContext);
	const {info, exams, type} = ctx;
	const [gData, setGData] = useState([])
	const [combine, setCombine] = useState('10')
	const [combineResult, setCombineResult] = useState()
	const [scoreKind, setScoreKind] = useState([])
	const [index, setIndex] = useState(0);
	const [j, setJ] = useState(0);
	const [left, setLeft] = useState(true);

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

	const postData = (api_url, setData, params) => {
		const get_ = async () => {
			const response = await axios.post(
				api_url,
				params,
				{
					headers: {
						'Content-Type': 'application/json',
						'auth': `${localStorage.getItem('uid')}`
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

	useEffect(() => {
		postData('/api/sores/combine', setCombineResult, { combine: 10, type: 0 })
	}, [combine])

	useEffect(() => {
		if (!type) type=0;
		if (!exams[0] || type != 0) getData('/api/exams', exams[1], {type: type ? type : 0});
		type[1](0);
		getData('/api/codes/score_kind', setScoreKind);
	}, [])

	useEffect(() => {
		if (!exams[0]) return;
		let g = exams[0].slice();
		const cmp = {
			'60': 8,
			'70': 7,
			'80': 6,
			'20': 5,
			'10': 5,
			'50': 4,
			'90': 3
		}
		g.sort((a, b) => {
			return cmp[b.subjectArea] - cmp[a.subjectArea];
		});
		g.map((el, i) => {
			el.subjectName = subjectcode[el.subjectCode]
		})
		setGData(g)
	}, [exams[0]])
	
	return (
		<div className="page">
		<style jsx>{`
			.active {
				color:white;
				background-color: #fede01;
			}
			.cards {
					display: flex;
					margin-right: -40px;
					margin-bottom: -40px;
					flex-wrap: wrap;
			}
			.cards > div {
				boxSizing: border-box;
				margin: 0 40px 40px 0;
				border: 1px solid #c7c7c7;
				padding: 20px 0;
				flex: 1 0 34%;
				max-width: calc(50% - 42px);
			}
			.cards > div > p {
				text-align: center;
				-webkit-text-stroke: 1px;
				margin-bottom: 25px;
			}
			.wow {
				display: flex;
				flex-direction: column;
			}
			.wow > div {
				display: flex;
				justify-content: space-between;
				margin-bottom:29px;
			}
			.wow > div:last-child {
				margin-bottom: 26px;
			}
			.wow > div > div {
				width: 110px;
			}
		`}</style>
			<div style={{width:'1280px',margin:'0 auto'}}>
				<div style={{fontSize:'30px',margin:'37px 0 75px','-webkit-text-stroke':'1px'}}>
					성적 분석
				</div>
				<div style={{display:'flex',borderBottom:'1px solid #fede01',width:'100%', marginBottom:'25px'}}>
					<div style={{display:'flex'}}>
						<div style={btn} className={left ? "active" : undefined} onClick={()=>{setLeft(true)}}>과목별</div>
						<div style={btn} className={left ? undefined : "active"} onClick={()=>{setLeft(false)}}>조합별 점수</div>
					</div>
				</div>
				{left ? 
				<>
					<div style={{display:'flex',height:'40px',alignItems:'center',backgroundColor:'#e8e8e8',textAlign:'center'}}>
					<p style={{width:'110px',}}></p>
					<p style={{flexGrow:1, flexBasis:0}}>표준점수</p>
					<p style={{flexGrow:1, flexBasis:0}}>백분위</p>
					<p style={{flexGrow:1, flexBasis:0}}>등급</p>
					<p style={{flexGrow:1, flexBasis:0}}>상위누적</p>
					</div>
					{gData.map(e => {
					return (
					<div style={{display:'flex',height:'80px',alignItems:'center',textAlign:'center'}}>
						<p style={{width:'110px',height:'100%',backgroundColor:'#e8e8e8',display:'flex',alignItems:'center',justifyContent:'center'}}>{e.subjectName}</p>
						<p style={{flexGrow:1, flexBasis:0}}>{e.standardScore}</p>
						<p style={{flexGrow:1, flexBasis:0}}>{e.percentScore}</p>
						<p style={{flexGrow:1, flexBasis:0}}>{e.grade}</p>
						<p style={{flexGrow:1, flexBasis:0}}>-</p>
					</div>)
					})}</> :
					combineResult ?
						<div className="cards">
							{combineResult[0].get_combine_scores.map((e,i) => {
							return (
								<div>
									<p>{i+1}순위</p>
									<div className="wow">
										<div>
											<div style={{textAlign:'right'}}>
												조합명
											</div>
											<div>
												{e.name}
											</div>
										</div>
										<div>
											<div style={{textAlign:'right'}}>
												내점수
											</div>
											<div>
												{e.score}
											</div>
										</div>
										<div>
											<div style={{textAlign:'right'}}>
												상위누적
											</div>
											<div>
												{e.acc}
											</div>
										</div>
									</div>
								</div>
								)
							})}
						</div> : null
				}
			</div>
		</div>
	);
}

export default regularanalysis

export async function getStaticProps() {
		let dat = await pool.query(`
    select	a."code" as "subjectArea"
        ,	a."name" as "areaName"
        ,	array_to_json(array(
                select	row_to_json(tmp)
                from	( 
                            select	sa."code" as "subjectCode"
                                ,	sc."name" as "codeName"
                            from	"codeMaps" sa
                                    inner join "codes" sc
                                    on sa."code" = sc."code" and sa."groupId" = sc."groupId"
                            where	sa."relationId" = 1
                            and		sa."parentGroupId" = b."groupId" 
                            and		sa."parentCode" = b.code 
                            order by sa."sort" asc
                        ) tmp
            )) as child
    from	"codes" a
            inner join (
                select	"parentCode" as "code"
                    ,	"parentGroupId" as "groupId" 
                    ,	max("sort") as "sort"
                from	"codeMaps"
                where	"relationId" = 1
                and		"parentGroupId" = 6
                group by "parentCode", "parentGroupId"
            ) b
            on a."groupId" = b."groupId" and a."code" = b."code"
    order by b."sort" asc
            `)
	const subjectcode = dat.rows.reduce((obj, entry) => {obj[entry.subjectArea] = entry.areaName; entry.child.map(v => {obj[v.subjectCode] = v.codeName}); return obj},{});
	return {props: {subjectcode:subjectcode}}
}