import {makeStyles} from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import s from './formform.module.css';

const useStyles = makeStyles({
  listbox: {
    width: '200px',
  },
  popper: {
    width: '200px !important',
  },
  label: {
    textTransform: 'capitalize',
  },
});

const FormForm = ({
  grade,
  semester,
  data,
  setData,
  addData,
  submit,
  subjectArea,
  subjectCode,
  deleteData,
}) => {
  const classes = useStyles();
  const top100Films = [{title: 'dd'}];
  const codeMap = React.useMemo(
    () =>
      subjectCode.reduce((a, b) => {
        a[b.code] = b.name;
        return a;
      }, {}),
    [subjectCode],
  );
  const nameMap = React.useMemo(
    () =>
      subjectCode.reduce((a, b) => {
        a[b.name] = b.code;
        return a;
      }, {}),
    [subjectCode],
  );
  return (
    <div>
      <div className={s.ttl}>{semester}학기</div>
      <div className={s.labels}>
        <div>교과</div>
        <div>과목</div>
        <div>단위수</div>
        <div>원점수</div>
        <div>평균</div>
        <div>표준편차</div>
        <div>성취도</div>
        <div>수강자수</div>
        <div>석차등급</div>
        <div>A비율</div>
        <div>B비율</div>
        <div>C비율</div>
        <div> </div>
      </div>
      {data.map((k, j) => (
        <div className={s.inputs}>
          {k.map((e, i) =>
            i < 12 ? (
              <div>
                {i == 0 ? (
                  <select
                    className={s.input}
                    value={data[j][i]}
                    name={j * 12 + i}
                    id={'' + grade + semester + (j * 12 + i)}
                    onChange={setData}
                  >
                    <option value="" />

                    {subjectArea.map(e => (
                      <option value={e.code}>{e.name}</option>
                    ))}
                  </select>
                ) : i == 1 ? (
                  <Autocomplete
                    options={subjectCode.filter(r => r.code[0] == data[j][0][0]).map(z => z.name)}
                    value={data[j][i]}
                    onChange={(event, newValue) => {
                      event.target.value = nameMap[newValue];
                      event.target.name = j * 12 + i;
                      setData(event);
                    }}
                    getOptionLabel={option => '' + option}
                    className={s.input}
                    classes={{listbox: classes.listbox, popper: classes.popper}}
                    freeSolo
                    //renderInput={(params) => <TextField {...params} ref={params.InputProps.ref} style={{height:'100%'}} InputProps={{ style: {padding:0,height:'100%'}}} inputProps={{ style: {padding:0,height:'100%',border:0}}} variant="outlined" />}
                    renderInput={params => (
                      <div ref={params.InputProps.ref} style={{height: '100%', width: '100%'}}>
                        <input
                          style={{height: '100%', padding: 0, width: '100%'}}
                          type="text"
                          {...params.inputProps}
                          value={codeMap[data[j][i]] || data[j][i]}
                          name={j * 12 + i}
                          id={'' + grade + semester + (j * 12 + i)}
                          onChange={setData}
                        />
                      </div>
                    )}
                  />
                ) : i == 6 ? (
                  <select
                    className={s.input}
                    value={data[j][i]}
                    name={j * 12 + i}
                    id={'' + grade + semester + (j * 12 + i)}
                    onChange={setData}
                  >
                    {['A', 'B', 'C', 'D', 'E'].map(c => (
                      <option value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={data[j][i]}
                    name={j * 12 + i}
                    id={'' + grade + semester + (j * 12 + i)}
                    onChange={setData}
                  />
                )}
              </div>
            ) : null,
          )}
          <button
            className="buttons"
            style={{width: '80px', height: '40px', marginTop: '16px'}}
            onClick={() => deleteData(j)}
          >
            삭제
          </button>
        </div>
      ))}

      <div className={s.longbtn}>
        <button onClick={addData}>+ 과목 추가하기</button>
      </div>
      <button className={s.orangebtn} onClick={submit}>
        수정하기
      </button>
    </div>
  );
};
export default FormForm;
