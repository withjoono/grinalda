import axios from 'axios';
import Link from 'next/link';
import {useContext, useEffect, useState} from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import Form from '../../comp/desktopform';
import Menu from '../../comp/mouimenu';
import OMR from '../../comp/omr';
import loginContext from '../../contexts/login';
import SideNavPage from '../../comp/template/SideNavPageSusi';
import {useLoginCheck} from '../../src/hooks/useLoginCheck';

const examinput = ({subjectarea, subjectcode, examcode}) => {
  useLoginCheck();
  const [examtype, setExamtype] = useState([]);
  const [grade, setGrade] = useState(0);
  const [year, setYear] = useState(0);
  const [type, setType] = useState(null);
  const [code, setCode] = useState(0);
  const [area, setArea] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const ctx = useContext(loginContext);
  const [c, setC] = useState(0);
  const [left, setLeft] = useState(false);
  const [d, setD] = useState(Array(45).fill());
  const [answers, setAnswers] = useState([]);
  const [conv, setConv] = useState({});

  const lengths = {
    60: 45,
    70: 30,
    80: 45,
    50: 20,
    10: 20,
    20: 20,
  };

  const sorty = l => {
    const zz = {
      60: 0,
      70: 1,
      80: 2,
      10: 3,
      20: 4,
      50: 5,
    };
    return l
      .filter(e => e != undefined)
      .sort((a, b) => {
        return zz[Math.floor(parseInt(a[1]) / 10) * 10] - zz[Math.floor(parseInt(b[1]) / 10) * 10];
      });
  };

  const get = () => {
    let obj = {
      0: [],
      10: [[], [], []],
      20: [[], [], []],
      50: [[], [], []],
      60: [[], [], []],
      70: [[], [], []],
      80: [[], [], []],
    };
    Object.keys(subjectcode).map(e => {
      let cod = parseInt(subjectcode[e]);
      if (cod == 60) obj[60][0].push([e, subjectcode[e]]);
      if (cod == 61) obj[60][1].push([e, subjectcode[e]]);
      if (cod > 61 && cod < 70) obj[60][2].push([e, subjectcode[e]]);
      if (cod == 70) obj[70][0].push([e, subjectcode[e]]);
      if (cod == 71) obj[70][1].push([e, subjectcode[e]]);
      if (cod > 72 && cod < 80) obj[70][2].push([e, subjectcode[e]]);
      if (cod == 80 || cod == 50) {
        obj[cod][0].push([e, subjectcode[e]]);
        obj[cod][1].push([e, subjectcode[e]]);
        obj[cod][2].push([e, subjectcode[e]]);
      }
      if (cod >= 10 && cod < 20) {
        if (cod == 10) obj[10][0].push([e, subjectcode[e]]);
        if (cod > 10) {
          obj[10][1].push([e, subjectcode[e]]);
          obj[10][2].push([e, subjectcode[e]]);
        }
      }
      if (cod >= 20 && cod < 30) {
        if (cod == 20) obj[20][0].push([e, subjectcode[e]]);
        if (cod > 20) {
          if (cod < 25) {
            obj[20][1].push([e, subjectcode[e]]);
          }
          obj[20][2].push([e, subjectcode[e]]);
        }
      }
    });
    Object.keys(subjectarea).map(e => {
      obj[0].push([e, subjectarea[e]]);
      if (!obj[subjectarea[e]]) obj[subjectarea[e]] = [[], [], []];
    });
    Object.keys(obj).map(e => {
      if (e == 0) obj[0] = sorty(obj[0]);
    });
    return obj;
  };
  const cc = get();

  const handleGrade = e => {
    const {value} = e.target;
    setGrade(value);
    setExamtype(
      examcode
        .filter(
          e => (e.grade == parseInt(value) || (e.grade == 3 && value == '4')) && e.year == year,
        )
        .sort((a, b) => a.id - b.id),
    );
  };
  const handleYear = e => {
    const {value} = e.target;
    setYear(value);
    setExamtype(
      examcode
        .filter(
          e => (e.grade == grade || (e.grade == 3 && grade == 4)) && e.year == parseInt(value),
        )
        .sort((a, b) => a.id - b.id),
    );
  };

  useEffect(() => {
    if (type) {
      setC(1);
      axios
        .get('/api/exams', {
          headers: {
            'Content-Type': 'application/json',
            auth: `${localStorage.getItem('uid')}`,
          },
          params: {type: type},
        })
        .then(res => {
          ctx.exams[1](res.data.data);
          ctx.type[1](type);
        });
      axios
        .get('/api/convertscore', {
          params: {typeId: type},
        })
        .then(res => {
          setConv(
            res.data.data.reduce((acc, obj) => {
              if (!acc[obj['subjectCode']]) acc[obj['subjectCode']] = {};
              acc[obj['subjectCode']][obj['originScore']] = [
                obj['standardScore'],
                obj['percentScore'],
                obj['grade'],
              ];
              return acc;
            }, {}),
          );
        });
    }
  }, [type]);

  useEffect(() => {
    if (c > 1) {
      axios.post(
        '/api/exams',
        {exams: ctx.exams[0], type: type},
        {headers: {auth: localStorage.getItem('uid')}},
      );
      setDisabled(true);
      setSubmitted(false);
    }
    setC(c + 1);
  }, [ctx.exams[0]]);

  useEffect(() => {
    if (answers.length > 0) setAnswers([]);
  }, [code]);

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

  const bttn = {
    width: '300px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    color: 'white',
    margin: '36px auto 80px',
    borderRadius: '20px',
    cursor: 'pointer',
  };

  const clicky = e => {
    if (e.target.id == '0') setLeft(true);
    else setLeft(false);
  };

  const handleCode = e => {
    setCode(e);
    setD(Array(lengths[area]).fill(0));
    ctx.exams[0].map(f => {
      if (f.subjectArea == area && f.subjectCode == e && Array.isArray(f.answers)) setD(f.answers);
    });
  };

  const handleSubmit = async () => {
    await axios.post(
      '/api/exams',
      {answers: d, type: type, area: area, code: code},
      {headers: {auth: localStorage.getItem('uid')}},
    );
    axios
      .get('/api/exams', {
        headers: {
          'Content-Type': 'application/json',
          auth: `${localStorage.getItem('uid')}`,
        },
        params: {type: type},
      })
      .then(res => {
        ctx.exams[1](res.data.data);
        ctx.type[1](type);
      });

    axios.get('/api/omr').then(res => {
      setAnswers(res.data.data[area][code][type].map(e => e[0]));
      console.log(area, code, type);
      console.log(res.data.data);
      //area	교과과목코드
      //Code	세부과목코드
      //type
    });
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
        `}</style>
        <Menu index={0} title="성적 입력" />
        <div style={{width: '980px', margin: '0 auto'}}>
          <div className="menu" onClick={clicky}>
            <button id="0" className={left ? 'menu_active' : 'menu_inactive'}>
              채점하기
            </button>
            <button id="1" className={!left ? 'menu_active' : 'menu_inactive'}>
              점수입력
            </button>
          </div>
          <InputLabel id="demo-simple-select-outlined-label">학년22</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={grade}
            label="Grade"
            onChange={handleGrade}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={'1'}>1학년</MenuItem>
            <MenuItem value={'2'}>2학년</MenuItem>
            <MenuItem value={'3'}>3학년</MenuItem>
          </Select>

          <div className="desktop_box selectbar">
            <select defaultValue="" onChange={handleGrade}>
              <option value="" disabled>
                학년 선택
              </option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
              {
                // <option value='4'>N수생</option>
              }
            </select>
            <select defaultValue="" onChange={handleYear}>
              <option value="">년도 선택</option>
              {[2019, 2020, 2021].map(e => {
                if (
                  examcode.filter(
                    k =>
                      k.id > 0 &&
                      (k.grade == parseInt(grade) || (k.grade == 3 && grade == '4')) &&
                      k.year == e,
                  ).length
                )
                  return <option value={e}>{e}</option>;
              })}
            </select>
            <select
              defaultValue=""
              onChange={e => {
                setType(e.target.value);
              }}
            >
              <option value="">모의고사 선택</option>
              {examtype.map(e => {
                return <option value={e.id}>{e.type}</option>;
              })}
            </select>
            {left ? (
              <>
                <select
                  value={area}
                  onChange={e => {
                    setArea(e.target.value);
                    setD(Array(lengths[e.target.value]).fill());
                    setCode(null);
                  }}
                >
                  <option value="">교과 선택</option>
                  {cc[0].map(e => {
                    if (e) return <option value={e[1]}>{e[0]}</option>;
                  })}
                </select>
                <select
                  value={code}
                  onChange={e => {
                    handleCode(e.target.value);
                  }}
                >
                  <option value="">세부과목 선택</option>
                  {area && cc[area][grade - 1]
                    ? cc[area][grade - 1].map(e => {
                        if (e) return <option value={e[1]}>{e[0]}</option>;
                      })
                    : null}
                </select>
              </>
            ) : null}
          </div>
          {!left ? (
            <>
              {' '}
              <Form
                disabled={!grade || !year || !type}
                subjectcode={subjectcode}
                information={ctx.exams[0] || []}
                setInformation={ctx.exams[1]}
                submitted={submitted}
                type={type}
                grade={grade}
                conv={conv}
              />
              <div
                style={bttn}
                onClick={() => {
                  disabled ? setDisabled(false) : setSubmitted(true);
                }}
              >
                {disabled ? '수정하기' : '완료하기'}
              </div>
            </>
          ) : (
            <>
              {' '}
              <OMR
                disabled={!grade || !year || !type || !area || !code}
                input={[d, setD]}
                answers={answers}
                multi={area == 70 ? [22, 23, 24, 25, 26, 27, 28, 29, 30] : []}
              />{' '}
              <div style={bttn} onClick={handleSubmit}>
                {answers.length > 0 ? '수정하기' : '채점하기'}
              </div>
              {answers.length > 0 ? (
                <Link href="/mockup/mygrade">
                  <div style={bttn}>분석하기</div>
                </Link>
              ) : null}{' '}
            </>
          )}
        </div>
      </div>
    </SideNavPage>
  );
};

export default examinput;
