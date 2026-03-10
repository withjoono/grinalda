import Link from 'next/link';
import {useState} from 'react';
import withDesktop from '../../comp/withdesktop';
import pool from '../../lib/pool';
import {useLoginCheck} from '../../src/hooks/useLoginCheck';
import desktop from '../desktop/examinput2';
import s from './inputchoice.module.css';

const inputChoice = ({examcode}) => {
  useLoginCheck();
  const [grade, setGrade] = useState(1);
  const [year, setYear] = useState(0);
  const [examtype, setExamType] = useState();
  const [name, setName] = useState('');
  const getExams = () => {
    let l = null;
    if (grade == 1) {
      l = examcode
        .filter(e => {
          return e.grade != 3 && e.year == year;
        })
        .sort((a, b) => a.id - b.id);
    } else {
      l = examcode
        .filter(e => {
          return e.id != 0 && e.grade == 3 && e.year == year;
        })
        .sort((a, b) => a.id - b.id);
    }
    return l;
  };

  return (
    <div className="page" style={{color: '#2d2d2d'}}>
      <div style={{padding: '20px'}}>
        <div style={{fontSize: '1.2em'}} style={{margin: '1em 0'}} className={s.bold}>
          <span className={s.orange_txt}>{localStorage.getItem('name')}</span>님의
          <br />
          모의고사 정보를 선택해 주세요
        </div>
        <div className={s.gradebuttons}>
          <button
            className={grade == 1 ? s.active : null}
            onClick={() => {
              setGrade(1);
            }}
          >
            <p>✍🏻</p>1,2학년
          </button>
          <button
            className={grade == 3 ? s.active : null}
            onClick={() => {
              setGrade(3);
            }}
          >
            <p>🙏🏻</p>3학년
          </button>
          {
            // <button className={grade == 4 ? s.active : null} onClick={()=>{setGrade(4)}}>N수생</button>
          }
        </div>
        <div className={s.gradebuttons}>
          <button
            className={year == 2019 ? s.active : null}
            onClick={() => {
              setYear(2019);
            }}
          >
            2019년
          </button>
          <button
            className={year == 2020 ? s.active : null}
            onClick={() => {
              setYear(2020);
            }}
          >
            2020년
          </button>
          <button
            className={year == 2021 ? s.active : null}
            onClick={() => {
              setYear(2021);
            }}
          >
            2021년
          </button>
        </div>
        <div className={s.listbuttons}>
          {getExams().map(e => {
            return (
              <button
                className={examtype == e.id ? s.active : null}
                onClick={() => {
                  setExamType(e.id);
                  setName(e.type);
                }}
              >
                {e.type.slice(-3) == '3학년' ? e.type.slice(0, e.type.length - 3) : e.type}
              </button>
            );
          })}
        </div>
        <div style={{fontSize: '1.2em'}} style={{margin: '1em 0'}} className={s.bold}>
          <span className={s.orange_txt}>{localStorage.getItem('name')}</span>님의
          <br />
          모의고사 성적을 입력해 주세요
          <p
            style={{fontSize: '0.6em', color: '#d3d3d3', marginTop: '-1.5em', WebkitTextStroke: 0}}
          >
            <br />
            *OMR카드로 입력시 유형별/범위별 세부 성적 분석이 가능합니다.
          </p>
        </div>
        <div className={s.select}>
          <Link href="/mockup/gradeinput">
            <button
              onClick={() => {
                sessionStorage.setItem('type', examtype);
                sessionStorage.setItem(
                  'grade',
                  grade >= 3 ? grade : name.includes('1학년') ? 1 : 2,
                );
              }}
            >
              <p>점수로</p>
              <p>입력하기</p>
            </button>
          </Link>
          <Link href="/mockup/omrinput">
            <button
              onClick={() => {
                sessionStorage.setItem('type', examtype);
                sessionStorage.setItem(
                  'grade',
                  grade >= 3 ? grade : name.includes('1학년') ? 1 : 2,
                );
              }}
            >
              <p>OMR카드로</p>
              <p>입력하기</p>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withDesktop(desktop, inputChoice);

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
  const subjectcode = dat.rows.reduce((obj, entry) => {
    entry.child.map(v => {
      obj[v.codeName] = v.subjectCode;
    });
    return obj;
  }, {});
  const subjectarea = dat.rows.reduce((obj, entry) => {
    obj[entry.areaName] = entry.subjectArea;
    return obj;
  }, {});
  dat = await pool.query(`
		select id, "type" , "year" , grade from "codeExams"
		`);
  const examcode = dat.rows;
  return {props: {subjectarea: subjectarea, subjectcode: subjectcode, examcode: examcode}};
}
