import React, {useRef} from 'react';

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    color: '#2d2d2d',
  },
  row: {
    display: 'flex',
    alignItems: 'stretch',
    flexWrap: 'wrap',
  },
  number: {
    backgroundColor: 'rgb(210,210,210)',
    fontSize: '0.8em',
    flex: '1 0',
    padding: '0.6em',
  },
  cell: {
    flex: '5 0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  cellinput: {
    padding: 0,
    border: '1px solid #707070',
    borderRadius: '6px',
    position: 'absolute',
    left: '30%',
    height: '46px',
    width: '46px',
    margin: '12px 0',
  },
  cellnumber: {
    width: 'fit-content',
    position: 'absolute',
    left: '30%',
    border: '1px solid #707070',
    borderRadius: '1em',
    fontSize: '0.8em',
    padding: '0 0.4em',
  },
  cellnumber2: {
    width: 'fit-content',
    margin: '0 auto',
    border: '1px solid #707070',
    borderRadius: '1em',
    fontSize: '0.8em',
    padding: '0 0.4em',
    backgroundColor: '#aaaaaa',
  },
  line: {
    width: '100%',
    borderBottom: '1px solid #eeeeee',
  },
  wow: {
    display: 'flex',
    flexDirection: 'column',
  },
  wowhead: {
    minWidth: '100px',
    width: '10%',
    backgroundColor: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8em',
    padding: '0.8em 0',
  },
  wowcell: {
    minWidth: '33px',
    width: '33%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.8em 0',
  },
  wownumber: {
    width: 'fit-content',
    margin: '0 auto',
    border: '1px solid #707070',
    borderRadius: '1em',
    fontSize: '0.8em',
    padding: '0 0.4em',
  },
  wownumber2: {
    width: 'fit-content',
    margin: '0 auto',
    border: '1px solid #707070',
    borderRadius: '1em',
    fontSize: '0.8em',
    padding: '0 0.4em',
    backgroundColor: '#aaaaaa',
  },
};

const omr = props => {
  let {disabled, input, multi, answers} = props;
  if (!input) input = Array(45).fill();
  if (!multi) multi = [30];
  const {
    main,
    row,
    number,
    cell,
    cellnumber,
    cellinput,
    line,
    cellnumber2,
    wow,
    wowhead,
    wowcell,
    wownumber,
    wownumber2,
  } = styles;
  const inputRefs = useRef([]);

  const handleChange = e => {
    const {value, name} = e.target;
    const tag = e.target.getAttribute('data-tag');
    if (
      value == '' ||
      (value.match(/^\d*$/) &&
        ((!tag && parseInt(value) >= 0 && parseInt(value) < 6) ||
          (tag && parseInt(value) >= 0 && parseInt(value) < 1000)))
    ) {
      input[1](p => {
        p[parseInt(name)] = value;
        return p.slice();
      });
      if (value != 0 && value != '') {
        if ((parseInt(name) + 1 < input[0].length && !tag) || (tag && value.length == 3)) {
          inputRefs.current[parseInt(name) + 1].focus();
        }
      }
    }
  };

  const inputs = Array(input[0].length)
    .fill()
    .map((e, i) => (
      <input
        name={i}
        data-tag={multi.includes(i) ? '1' : undefined}
        key={'input' + i}
        value={input[0][i] || ''}
        style={cellinput}
        ref={el => (inputRefs.current[i] = el)}
      />
    ));

  return (
    <div className="form" onChange={handleChange}>
      <style jsx>{`
        .correct {
          border: 2px solid red !important;
        }
        .form {
          width: 100%;
          display: flex;
          flex-direction: column;
          height: ${Math.ceil(input[0].length / 4) * 70}px;
          flex-wrap: wrap;
          position: relative;
        }
        .form > div {
          width: 25%;
          height: 70px;
          position: relative;
        }
        .number {
          line-height: 70px;
          font-size: 24px;
          display: inline-block;
        }
        .disabled {
          opacity: 50%;
          position: absolute !important;
          background-color: white;
          height: 100% !important;
          width: 100% !important;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          -webkit-text-stroke: 1px;
          z-index: 1;
        }
      `}</style>
      {disabled ? <div className="disabled">조건을 선택해주세요</div> : <div />}
      {input[0].map((e, i) => (
        <div>
          <div className="number">{i + 1}</div>
          {inputs[i]}
          {answers && answers[i] ? (
            <div
              style={{
                position: 'absolute',
                right: '30%',
                top: '30%',
                color: parseInt(answers[i]) == input[0][i] ? 'blue' : 'red',
              }}
            >
              {answers[i]}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default omr;
