import axios from 'axios';
import {useContext, useEffect, useState} from 'react';
import Menu from '../../comp/mouimenu';
import loginContext from '../../contexts/login';
import SideNavPage from '../../comp/template/SideNavPageSusi';
import pool from '../../lib/pool';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { CenterFocusStrong } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2.3),
    minWidth: 150,
    minheight: 10,
  },
  formControl2: {
    margin: 10,
    minWidth: 150,
    minheight: 10,
  },
  buttontest:{
    margin:10,
    },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const examinput = ({subjectcode, examcode, sc}) => {
  const [examtype, setExamtype] = useState([]);
  const [grade, setGrade] = useState('');
  const [year, setYear] = useState('');
  const [selected, setSelected] = useState();
  const [total, setTotal] = useState();
  const {exams, type} = useContext(loginContext);
  const [s, setS] = useState();
  const [subject, setSubject] = useState([]);
  const [dat, setDat] = useState({});
  const [info, setInfo] = useState({});
  const [left, setLeft] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    axios
      .get('/api/omr')
      .then(res => setDat(res.data.data))
      .catch(err => console.log(err));
  }, []);

  const processSelected = e => {
    let byScores = {};
    let byKind = {};
    let byAnswers = dat[e.subjectArea][e.subjectCode][e.typeId];
    try {
      dat[e.subjectArea][e.subjectCode][e.typeId].map((f, i) => {
        if (!e.answers[i]) e.answers[i] = 0;
        byAnswers[i].push(e.answers[i]);
        if (!byScores[f[1]]) byScores[f[1]] = {wrong: 0, right: 0};
        if (e.answers[i] == f[0]) {
          byScores[f[1]].right += 1;
        } else {
          byScores[f[1]].wrong += 1;
        }
        if (!byKind[f[4]]) byKind[f[4]] = {};
        if (!byKind[f[4]][f[5]]) byKind[f[4]][f[5]] = {wrong: 0, wrongweighted: 0, total: 0};
        if (e.answers[i] != f[0]) {
          byKind[f[4]][f[5]].wrong += 1;
          byKind[f[4]][f[5]].wrongweighted += f[1];
        }
        byKind[f[4]][f[5]].total += f[1];
      });
    } catch {}
    setInfo({scores: byScores, kinds: byKind, answers: byAnswers});
  };

  const btn = {
    width: '180px',
    height: '40px',
    display: 'flex',
    border: '2px solid #fede01',
    marginBottom: '-2px',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '5px',
    cursor: 'pointer',
  };

  const btn2 = {
    ...btn,
    flex: '1 0 0',
    marginRight: '40px',
  };

  const bttn = {
    width: '300px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white',
    margin: '0 auto 50px',
    borderRadius: '20px',
    cursor: 'pointer',
  };
  const clicky = e => {
    if (e.target.id == '0') setLeft(true);
    else setLeft(false);
  };


  const handleGrade = e => {
    setGrade(e.target.value);
    const v = e.target.value;
    setExamtype(
      examcode.filter(e => e.id > 0 && e.grade == parseInt(v)).sort((a, b) => a.id - b.id),
    );
  };

  const [a, seta] = useState();

  const handleAnalysis = e => {
    if (type[0] == e.target.value) return;
    if (!exams[0] || (type[0] && type[0] != e.target.value)) {
      axios
        .get('/api/exams', {
          headers: {
            'Content-Type': 'application/json',
            auth: `${localStorage.getItem('uid')}`,
          },
          params: {type: e.target.value},
        })
        .then(res => {
          exams[1](res.data.data);
          type[1](e.target.value);
          axios
            .post(
              '/api/sores/combine',
              {combine: 10, type: e.target.value},
              {
                headers: {
                  'Content-Type': 'application/json',
                  auth: `${localStorage.getItem('uid')}`,
                },
              },
            )
            .then(res => setTotal(res.data.data[0].get_combine_scores));
        });
    }
  };
  const handleSelect = () => {
    if (subject) {
      processSelected(subject);
      setSelected(subject);
    }
  };

  const handleYear = e => {
    const {value} = e.target;
    setYear(value);
    setExamtype(
      examcode
        .filter(e => e.id > 0 && e.grade == grade && e.year == parseInt(value))
        .sort((a, b) => a.id - b.id),
    );
  };

  return (

    <SideNavPage 
    routes={['']}
    navTitle="교과/비교과 분석"
    navSubs={[
      {title: '1.채점하기/점수 입력', url: '/mockup/inputchoice '},
      {title: '2.성적 분석', url: '/mockup/mygrade'},
      {title: '3.오답 분석', url: '/mockup/graph'},
      {title: '4.대학 예측 및 검색', url: '/mockup/university'},
      {title: '5.목표대학', url: '/mockup/prediction'},
    ]}
  >
    <div className="page">
      <style jsx>{`
        .container1 {
        margin: auto;
        width: 980px;
        height: 100px;
        text-align: left;
        box-shadow: 1px 1px 3px 1px #dadce0;
      }
        .active {
          background-color: #fede01;
          color: white;
        }
        .equal {
          display: flex;
          text-align: center;
        }
        .equal > div {
          flex: 1 0 0;
        }
        .equal > div:first-child {
          text-align: left;
        }
        .equal > div:last-child {
          text-align: right;
        }
        .spacing {
          padding: 30px 80px;
          box-sizing: border-box;
        }
        .titles {
          -webkit-text-stroke: 1px;
        }
        .outline {
          border-radius: 13px;
          border: 1px solid #e9e9e9;
          margin-bottom: 10px;
        }
        thead > * {
          background-color: #f3f3f3;
          padding: 25px 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          text-align: center;
        }
        td {
          padding: 30px 0;
        }
        .orangebtn {
          width: 260px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background-color: #de6b3d;
          border-radius: 25px;
          margin: 40px auto;
        }
        .men {
          display: inline-flex;
          margin-left: 30px;
        }
        .men > button {
          color: #cbcbcb;
          -webkit-text-stroke: 1px;
          margin-right: 30px;
          border: 0;
          padding: 0;
          background-color: white;
        }
        .act {
          color: #ff8901 !important;
          border-bottom: 1px solid #ff8901;
        }
        .m {
          display: flex;
          justify-content: center;
          margin-right: -30px;
        }
        .m > button {
          color: #cbcbcb;
          -webkit-text-stroke: 1px;
          margin-right: 30px;
          border: 0;
          padding: 0;
          background-color: white;
        }
        .selectbar {
          display: flex;
          padding-right: 0;
        }
        select {
          flex: 1 0 0;
          margin-right: 30px;
          border: 1px solid #707070;
          border-radius: 4px;
          background: url(http://cdn1.iconfinder.com/data/icons/cc_mono_icon_set/blacks/16x16/br_down.png)
            no-repeat right #fff;
          background-position-x: calc(100% - 1em);
          height: 46px;
          padding: 0 1em;
        }
        .btn {
          width: 260px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #9d9d9d;
          border: 1px solid #9d9d9d;
          cursor: pointer;
          margin: 30px auto;
        }
        .sss {
          display: flex;
          margin-right: -30px;
        }
        .sss > div {
          flex: 1 0 0;
          margin-right: 30px;
        }
      `}</style>
      <Menu index={1} title="성적 분석" />
      <div style={{width: '980px', margin: '0 auto'}}>
      <div className="menu" onClick={clicky}>
          <button id="0" className={left ? 'menu_active' : 'menu_inactive'}>
            과목별
          </button>
          <button id="1" className={!left ? 'menu_active' : 'menu_inactive'}>
            조합별
          </button>
        </div>

        {left ? (
          <>
        {/* <div className="desktop_box selectbar"> */}
        <div  className ="container1">
        <FormControl variant="outlined" className={classes.formControl} >
        <InputLabel id="simple-select-outlined-label">학년</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={grade}
          onChange={handleGrade }
          label="학년"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="1" >1 학년</MenuItem>
          <MenuItem value="2" >2 학년</MenuItem>
          <MenuItem value="3" >3 학년</MenuItem>
          <MenuItem value="4" >N 수생</MenuItem>
        </Select>
      </FormControl>  

      <FormControl variant="outlined" className={classes.formControl} >
        <InputLabel id="simple-select-outlined-label">년도</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={year}
          onChange={handleYear }
          label="년도"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {[2019, 2020, 2021, 2022].map(e => {
              if (
                examcode.filter(k => k.id > 0 && k.grade == parseInt(grade) && k.year == e).length
              )
                return (
                  <MenuItem key={e} value={e}>
                    {e}
                  </MenuItem>);})}
        </Select>
      </FormControl>
          {/* <select value={year} onChange={handleYear}>
            <option value="">년도 선택</option>
            {[2019, 2020, 2021, 2022].map(e => {
              if (
                examcode.filter(k => k.id > 0 && k.grade == parseInt(grade) && k.year == e).length
              )
              console.log(examcode)
                return (
                  <option key={e} value={e}>
                    {e}
                  </option>
                );
            })}
          </select> */}
          {/* <select defaultValue="" onChange={handleAnalysis}>
            <option value="" disabled>
              모의고사 선택
            </option>
            {examtype.map(e => {
              return (
                <option value={e.id} key={e.id}>
                  {e.type}
                </option>
              );
            })}
          </select> */}

                <FormControl variant="outlined" className={classes.formControl} >
        <InputLabel id="simple-select-outlined-label">과목</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={JSON.stringify(subject)}
          onChange={e=> {
            setSubject(JSON.parse(e.target.value));
          }}
          label="과목"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {exams[0]
              ? exams[0].map(e => {
                  if (e)
                    return (
                      <option value={JSON.stringify(e)} key={e.subjectCode}>
                        {sc[e.subjectCode]}
                      </option>
                    );
                })
              : null}
        </Select>
      </FormControl>
          {/* <select
            value={JSON.stringify(subject)}
            onChange={e => {
              setSubject(JSON.parse(e.target.value));
            }}
          >
            <option value={JSON.stringify('')}>과목 선택</option>
            {exams[0]
              ? exams[0].map(e => {
                  if (e)
                    return (
                      <option value={JSON.stringify(e)} key={e.subjectCode}>
                        {sc[e.subjectCode]}
                      </option>
                    );
                })
              : null}
          </select> */}

        {/* <div align="right" className={classes.buttontest}> */}
        <FormControl variant="outlined" className={classes.formControl2} >
        <Button variant="outlined" size ="large" onClick ={handleSelect}
             style={{
              width: '13em',
              height: '4em' ,
            }}
        >
          성적 분석 보기</Button>
        </FormControl>
        {/* </div> */}
        </div>
     
        {/* <button className="btn" onClick={handleSelect}>
          입력하기
        </button> */}
        </>
        ): null}

        {/*{total ? <div style={{fontSize:'30px',margin:'100px 0 30px','-webkit-text-stroke':'1px',width:'fit-content',display:'inline-block'}}>
					조합별 점수
				</div> : null}
				{
				total ? <div className='men'>{total.map((e,i) => <button className={i == s ? 'act' : ''} onClick={()=>setS(i)}>{e.name}</button>)}</div> : null
				}
				<div style={{display:'flex',justifyContent:'space-between',}}>
					{total ? total.map((e,i) => {if (i==s) return (
						<div style={{width:'25%',backgroundColor:'#fafafa',padding:'30px 0', display:'flex',flexDirection:'column',marginLeft:`calc(75% / 6 * ${i})`}}>
						<div style={{border:'1px solid #e9e9e9', marginBottom:'10px',borderRadius:'13px',padding:'30px 70px',backgroundColor:'white'}}>
							<p>합</p><p>{e.name}</p>
						</div>
						<div style={{border:'1px solid #e9e9e9', marginBottom:'10px',borderRadius:'13px',padding:'30px 70px',backgroundColor:'white'}}>
							<p>평균</p><p>{i < 2 ? e.score/3 : e.score/2}</p>
						</div>
						<div style={{border:'1px solid #e9e9e9', marginBottom:'10px',borderRadius:'13px',padding:'30px 70px',backgroundColor:'white'}}>
							<p>상위누적</p><p>{e.acc}</p>
						</div>
						</div>)
					}) : null
					}
				</div>*/}
        <div className="sss">
          {/* <div>
            <div className="title_left">오답 분석</div>
            <div className="desktop_box">
              <table className="desktop_box_table desktop_box_table_line">
                <tr>
                  <th>문항번호</th>
                  <th>배점</th>
                  <th>내답</th>
                  <th>정답</th>
                  <th>정오</th>
                </tr>
                {!info.answers ? (
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                ) : (
                  info.answers.map((e, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td>{e[1]}</td>
                      <td>{e[6]}</td>
                      <td>{e[0]}</td>
                      <td>{e[6] == e[0] ? 'O' : 'X'}</td>
                    </tr>
                  ))
                )}
              </table>
            </div>
          </div> */}
          <div>
            <div className="title_left">배점 분석</div>
            <div className="desktop_box">
              <table className="desktop_box_table desktop_box_table_line">
                <tr>
                  <th>배점</th>
                  <th>점수</th>
                  <th>오답</th>
                  <th>정답률</th>
                </tr>
                {!info.scores ? (
                  <tr>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                ) : (
                  Object.keys(info.scores).map(e => (
                    <tr>
                      <td>{e}</td>
                      <td>{(info.scores[e].right + info.scores[e].wrong) * e}점</td>
                      <td>{info.scores[e].wrong * e}점</td>
                      <td>
                        {Math.round(
                          (info.scores[e].right / (info.scores[e].right + info.scores[e].wrong)) *
                            100,
                        )}
                        %
                      </td>
                    </tr>
                  ))
                )}
              </table>
            </div>
          </div>
        </div>
        <div className="title_left">오답분석</div>
        <div className="desktop_box">
          <table className="desktop_box_table desktop_box_table_line">
            <tr>
              <th colSpan="2">과목</th>
              <th>배점</th>
              <th>오답</th>
              <th>정답율</th>
            </tr>
            {info.kinds ? (
              Object.keys(info.kinds).map(e => {
                const a = Object.keys(info.kinds[e]).sort();

                return a.map((f, i) => (
                  <tr style={i == a.length - 1 ? {borderBottom: '1px solid #cccccc'} : undefined}>
                    {i == 0 ? (
                      <td style={{borderBottom: '1px solid #cccccc'}} rowSpan={a.length}>
                        {e}
                      </td>
                    ) : null}
                    <td>{f}</td>
                    <td>{info.kinds[e][f].total}</td>
                    <td>{info.kinds[e][f].wrong}</td>
                    <td>
                      {Math.round(
                        (1 - info.kinds[e][f].wrongweighted / info.kinds[e][f].total) * 100,
                      )}
                      %
                    </td>
                  </tr>
                ));
              })
            ) : (
              <tr>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            )}
          </table>
        </div>
      </div>
    </div>
    </SideNavPage>
  );
};

export default examinput;

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
            `);
  let {rows} = await pool.query(`
		select id, "type" , "year" , grade  from "codeExams";
	`);
  const subjectcode = dat.rows.reduce((obj, entry) => {
    obj[entry.areaName] = entry.subjectArea;
    entry.child.map(v => {
      obj[v.codeName] = v.subjectCode;
    });
    return obj;
  }, {});
  return {props: {subjectcode: subjectcode, examcode: rows}};
}
