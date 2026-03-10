import axios from 'axios';
import {useEffect, useState} from 'react';
import pool from '../../lib/pool';

const addexam = ({subjectcode, code, sj, kinds}) => {
  const [grade, setGrade] = useState(0);
  const [year, setYear] = useState(0);
  const [num, setNum] = useState(0);
  const [type, setType] = useState(-1);
  const [s, setS] = useState(0);
  const [a, setA] = useState(0);
  const [data, setData] = useState([]);
  const [err, setErr] = useState([-1, -1]);
  const [heck, setHeck] = useState({});

  const b = {
    10: 20,
    20: 20,
    50: 20,
    60: 45,
    70: 30,
    80: 45,
  };

  useEffect(() => {
    axios
      .get('/api/omr')
      .then(res => {
        setHeck(res.data.data);
      })
      .catch(err => console.log(err));
  }, []);

  const get = () => {
    return code.filter(e => e.grade == grade && e.year == year);
  };

  const change = e => {
    const {name, value} = e.target;
    const key = e.target.getAttribute('data-key');
    if (key && key.slice(-1) == 'c') {
      setData(prev => {
        prev[parseInt(key.slice(0, -1))][3] = value;
        return prev.slice();
      });
      return;
    } else if (key && key.slice(-1) == 'd') {
      setData(prev => {
        prev[parseInt(key.slice(0, -1))][4] = value;
        return prev.slice();
      });
      return;
    }
    const id = e.target.getAttribute('data-e');
    setData(
      data.map((e, i) => {
        if (i == parseInt(name)) {
          e[parseInt(id)] = value;
        }
        return e;
      }),
    );
    if (value == '') return;
    if (parseInt(id) < 2 && /^-?\d+$/.test(value) == false) {
      setErr([parseInt(name), parseInt(id)]);
    } else if (parseInt(id) == 2 && /^([A-E])/.test(value) == false) {
      setErr([parseInt(name), parseInt(id)]);
    } else if (parseInt(id) == 3 && value.length > 32) {
      setErr([parseInt(name), parseInt(id)]);
    } else {
      setErr([-1, -1]);
    }
  };

  const handleS = e => {
    setA(0);
    setS(subjectcode[e]);
  };

  useEffect(() => {
    let cpy = [];
    if (a == 0 || s == 0 || type == -1) return;
    if (heck[s] && heck[s][a] && heck[s][a][type]) {
      heck[s][a][type].map((e, i) => {
        if (e) cpy[i] = e;
      });
    }
    var i = 0;
    while (i < b[s]) {
      if (!cpy[i]) cpy[i] = ['', '', '', '', ''];
      i++;
    }
    setData(cpy);
  }, [a, s, type]);

  const handleSubmit = () => {
    setHeck(prev => {
      if (!prev[s]) prev[s] = {};
      if (!prev[s][a]) prev[s][a] = {};
      prev[s][a][type] = data.slice();
      return prev;
    });
    axios.post('/api/omr', {
      data: data,
      subjectArea: s,
      subjectCode: a,
      type: type,
    });
  };

  const order = {
    60: 0,
    70: 1,
    80: 2,
    10: 3,
    20: 4,
    50: 5,
  };

  return (
    <>
      <style jsx>{`
        .main {
          width: 1280px;
          margin: 0 auto;
          padding-top: 60px;
        }
        .btns {
          display: flex;
          flex-wrap: wrap;
          text-align: center;
        }
        .btns > div {
          width: 180px;
          height: 40px;
          border: 1px solid #fede01;
          margin-right: 5px;
          margin-bottom: 10px;
        }
        .active {
          background-color: #fede01;
          color: white;
        }
        .inputs {
          display: inline-flex;
          flex-direction: column;
          text-align: center;
        }
        .inputs > div {
          display: flex;
        }
        .inputs > div > * {
          width: 60px;
          box-sizing: border-box;
          margin-right: 10px;
          margin-bottom: 15px;
        }
        .inputs > div > select {
          width: 120px;
        }
        .big {
          display: inline-block;
          width: 300px;
          height: 60px;
          background-color: #fede01;
          color: white;
          text-align: center;
          line-height: 60px;
        }
        .err {
          border: 2px solid red;
        }
      `}</style>
      <div className="page">
        <div className="main">
          <div className="btns">
            {[2019, 2020, 2021].map(e => (
              <div
                className={year == e ? 'active' : undefined}
                onClick={() => {
                  setGrade(0);
                  setYear(e);
                }}
              >
                {e}년
              </div>
            ))}
          </div>
          <div className="btns">
            {[1, 2, 3].map(e => (
              <div
                className={grade == e ? 'active' : undefined}
                onClick={() => {
                  setType(-1);
                  setGrade(e);
                }}
              >
                {e}학년
              </div>
            ))}
          </div>
          <div className="btns">
            {get()
              .filter(e => e.id > 0)
              .sort((a, b) => a.id - b.id)
              .map(e => (
                <div
                  className={type == e.id ? 'active' : undefined}
                  onClick={() => {
                    setType(e.id);
                  }}
                >
                  {e.type}
                </div>
              ))}
          </div>
          {type >= 0 ? (
            <div className="btns">
              {Object.keys(subjectcode)
                .sort((a, b) => order[subjectcode[a]] - order[subjectcode[b]])
                .map(e => (
                  <div
                    className={s == subjectcode[e] ? 'active' : undefined}
                    onClick={() => handleS(e)}
                  >
                    {e} {subjectcode[e]}
                  </div>
                ))}
            </div>
          ) : null}
          {s > 0 ? (
            <div className="btns">
              {Object.keys(sj[s])
                .filter(e => {
                  if (grade == 1) {
                    return parseInt(sj[s][e]) % 10 == 0;
                  } else if (grade == 2) {
                    let cc = parseInt(sj[s][e]);
                    return (
                      !((cc > 24 && cc < 30) || cc == 20) &&
                      !(cc == 60 || (cc > 61 && cc < 70)) &&
                      !(cc > 71 && cc < 80 && cc % 10 != 0) &&
                      cc != 10
                    );
                  } else {
                    let cc = parseInt(sj[s][e]);
                    return ![10, 20, 60, 61, 70, 71].includes(cc);
                  }
                })
                .map(e => (
                  <div
                    className={a == sj[s][e] ? 'active' : undefined}
                    onClick={() => {
                      setA(sj[s][e]);
                    }}
                  >
                    {e} {sj[s][e]}
                  </div>
                ))}
            </div>
          ) : null}
          {a > 0 && data.length == b[s] ? (
            <>
              <div className="inputs" onChange={change}>
                <div>
                  <div>번호</div>
                  <div>정답</div>
                  <div>배점</div>
                  <div>난이도</div>
                  <div style={{width: '120px'}}>유형/범위</div>
                  <div style={{width: '120px'}}>세부범위</div>
                </div>
                {Array.from(Array(b[s]), (e, i) => {
                  return (
                    <>
                      <div>
                        <div>{i + 1}</div>
                        <input
                          className={err[0] == i && err[1] == 0 ? 'err' : undefined}
                          key={i}
                          data-e="0"
                          name={i}
                          value={data[i][0]}
                        />
                        <input
                          className={err[0] == i && err[1] == 1 ? 'err' : undefined}
                          key={i + 'a'}
                          data-e="1"
                          name={i}
                          value={data[i][1]}
                        />
                        <input
                          className={err[0] == i && err[1] == 2 ? 'err' : undefined}
                          key={i + 'b'}
                          data-e="2"
                          name={i}
                          value={data[i][2]}
                        />
                        <select defaultValue={data[i][3] || ''} data-key={i + 'c'}>
                          <option value="" key={i + 'z' + 'c'}></option>
                          {Object.keys(kinds[a]).map((e, j) => (
                            <option value={e} key={i + 'z' + j + 'c'}>
                              {e}
                            </option>
                          ))}
                        </select>
                        <select defaultValue={data[i][4] || ''} data-key={i + 'd'}>
                          <option value="" key={i + 'zd'}></option>
                          {(kinds[a][data[i][3]] || []).map((e, j) => (
                            <option value={e[1]} key={i + 'z' + j + 'd'}>
                              {e[0]}
                            </option>
                          ))}
                        </select>
                      </div>
                      {err[0] == i ? (
                        err[1] < 2 ? (
                          <div>정답과 배점은 숫자만 입력 가능합니다.</div>
                        ) : err[1] == 2 ? (
                          <div>난이도는 A, B, C, D, E 중 하나를 골라주세요.</div>
                        ) : (
                          <div>유형/범위는 최대 32자까지 가능합니다.</div>
                        )
                      ) : null}
                    </>
                  );
                })}
              </div>
              <button className="big" onClick={handleSubmit}>
                입력하기
              </button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default addexam;

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
  let ss = {};
  const subjectcode = dat.rows.reduce((obj, entry) => {
    if (entry.subjectArea.substring(0, 1) == 'A' || entry.subjectArea == '90') return obj;
    obj[entry.areaName] = entry.subjectArea;
    ss[entry.subjectArea] = {};
    entry.child.map(v => (ss[entry.subjectArea][v.codeName] = v.subjectCode));
    return obj;
  }, {});
  const {rows} = await pool.query(`select id, "type" , "year" , grade  from "codeExams"`);
  dat = await pool.query(`
		select "subjectCode", major, array_agg(minor) as minors, array_agg(code) as codes from kind group by "subjectCode", major
	`);
  const aa = dat.rows.reduce((acc, entry) => {
    if (!acc[entry['subjectCode']]) {
      acc[entry['subjectCode']] = {};
    }
    acc[entry['subjectCode']][entry['major']] = entry['minors'].map((e, i) => [
      e,
      entry['codes'][i],
    ]);
    return acc;
  }, {});
  return {props: {subjectcode: subjectcode, code: rows, sj: ss, kinds: aa}};
}
