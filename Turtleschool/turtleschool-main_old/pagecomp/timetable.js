import MomentUtils from '@date-io/moment';
import {Getter, Plugin} from '@devexpress/dx-react-core';
import {EditingState, ViewState} from '@devexpress/dx-react-scheduler';
import {
  AppointmentForm,
  Appointments,
  AppointmentTooltip,
  DateNavigator,
  DayView,
  EditRecurrenceMenu,
  MonthView,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Slider from '@material-ui/core/Slider';
import {makeStyles} from '@material-ui/core/styles';
import {KeyboardTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import axios from 'axios';
import React, {useContext, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom';
import withDesktop from '../comp/withdesktop';
import s from '../pagecomp/timetable.module.css';

const colors = {
  국어: 'red',
  수학: 'yellow',
  사회: 'blue',
  영어: 'orange',
  과학: 'blue',
  한국사: 'purple',
  기타: 'gray',
  사탐: 'blue',
  과탐: 'blue',
};
const days = ['일', '월', '화', '수', '목', '금', '토'];
const subjects = ['국어', '수학', '영어', '한국사', '과학', '사회'];
const steps = [''];

const DataContext = React.createContext(); // 받아온 장기, 단기, 루틴 데이타 컨텍스트

const sortOrder = {
  국어: 1,
  수학: 2,
  사회: 3,
  영어: 4,
  과학: 5,
  한국사: 6,
  기타: 7,
};

const formData = stuff =>
  stuff.reduce((acc, obj) => {
    const a = {...obj};
    if (a.range instanceof String || typeof a.range == 'string') {
      acc.push(a);
      return acc;
    }
    delete a.range;
    const aa = obj.range.split(',');
    a.range = [
      new Date(aa[0].substring(1, aa[0].length)),
      new Date(aa[1].substring(0, aa[1].length - 1)),
    ];
    acc.push(a);
    return acc;
  }, []);

const Overlay = ({visible, children}) => {
  const innerRef = useContext(DataContext).innerRef;
  const styles = makeStyles({
    root: {
      width: '100%',
      height: '100%',
      zIndex: 5,
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: '20px',
      padding: '1em',
      backgroundColor: 'white',
    },
  });
  const A = innerRef.current;
  const classes = styles();
  if (!visible) return null;
  else return ReactDOM.createPortal(<div className={classes.root}>{children}</div>, A);
};

const useSelectStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    '& > *': {
      marginBottom: '1em',
    },
    '& > p': {
      marginBottom: '0',
    },
    '& err': {
      fontSize: '12px',
      color: 'red',
      marginTop: '-0.8em',
    },
    backgroundColor: 'white',
    borderRadius: '20px',
    overflow: 'hidden',
  },
  select: {
    width: '100%',
  },
  menu: {
    display: 'flex',
    marginRight: '-1em',
    '& > *': {
      flex: '1 0 0',
      marginRight: '1em',
    },
  },
  date: {
    display: 'flex',
    alignItems: 'center',
    '& > *:first-child': {
      flex: '0 0 auto',
      marginRight: '1em',
    },
    '& > *:last-child': {
      flex: '1 0 0',
    },
  },
  selector: {
    display: 'flex',
    height: '40px',
    border: '1px solid #9d9d9d',
    borderRadius: '20px',
    overflow: 'hidden',
    '& > *': {
      borderRight: '1px solid #9d9d9d',
      display: 'flex',
      flex: '1 0 0',
      justifyContent: 'center',
      alignItems: 'center',
      transition: 'color 0.3s ease-out, background-color 0.3s ease-out',
      overflow: 'hidden',
    },
    '& > *:last-child': {
      borderRight: 0,
    },
  },
  active: {
    color: 'white',
    backgroundColor: '#de6b3d',
  },
  display: {
    backgroundColor: '#eeeeee',
    borderRadius: '#9d9d9d',
    padding: '1em',
    display: 'flex',
    flexDirection: 'column',
    '& > div': {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: '1.5em',
      alignItems: 'center',
      fontSize: '14px',
    },
    '& > *:last-child': {
      borderTop: '1px solid #9d9d9d',
    },
    '& > * > *:first-child': {
      fontWeight: 'bold',
      color: '#2d2d2d',
    },
    '& > * > *:last-child': {
      fontWeight: 'bold',
      color: '#9d9d9d',
    },
  },
}));

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const EditLayout = React.forwardRef(
  ({onFieldChange, appointmentData, classes, children, errors, ...restProps}, ref) => {
    useEffect(() => {
      ref.current = appointmentData;
    }, [appointmentData]);
    const [test, setTest] = useState(appointmentData.score || appointmentData.rank);
    const days = {
      월: 'MO',
      화: 'TU',
      수: 'WE',
      목: 'TH',
      금: 'FR',
      토: 'SA',
      일: 'SU',
    };
    const onLate = nextValue => {
      onFieldChange({late: !appointmentData.late});
    };
    const onAbsent = nextValue => {
      onFieldChange({absent: !appointmentData.absent});
    };
    const onDescriptionChange = React.useCallback(
      nextValue => {
        console.log(nextValue);
        onFieldChange({description: nextValue});
      },
      [onFieldChange],
    );
    const onProgressChange = React.useCallback(
      (e, nextValue) => onFieldChange({progress: nextValue}),
      [onFieldChange],
    );
    const onScoreChange = e => onFieldChange({score: e.target.value});
    const onRankChange = e => onFieldChange({rank: e.target.value});
    const onMentorRankChange = nextValue => {
      onFieldChange({mentor_rank: nextValue});
    };
    const onMentorDescChange = React.useCallback(
      nextValue => {
        onFieldChange({mentor_desc: nextValue});
      },
      [onFieldChange],
    );
    const onMentorScoreChange = nextValue => {
      onFieldChange({mentor_test: nextValue});
    };
    const onTest = () => {
      setTest(!test);
    };
    const mentorRankOptions = [
      {id: 'A', text: 'A'},
      {id: 'B', text: 'B'},
      {id: 'C', text: 'C'},
      {id: 'D', text: 'D'},
      {id: 'E', text: 'E'},
    ];

    return (
      <div className={classes.root}>
        <AppointmentForm.Label
          text={appointmentData.primaryType == '수업' ? '수업 확인' : '학습 확인'}
          type="title"
        />
        <div className={classes.display}>
          <div>
            <p>과목</p>
            <p>{appointmentData.subject}</p>
          </div>
          <div>
            <p>{appointmentData.primaryType == '수업' ? '선생님명' : '학습 목표'}</p>
            <p>
              {appointmentData.primaryType == '수업'
                ? appointmentData.teacher
                : appointmentData.title}
            </p>
          </div>
          <div>
            <p>{appointmentData.primaryType == '수업' ? '수업목표' : '교재/인강'}</p>
            <p>
              {appointmentData.primaryType == '수업'
                ? appointmentData.title
                : appointmentData.studyContent
                ? appointmentData.studyContent
                : '(없음)'}
            </p>
          </div>
        </div>
        {appointmentData.primaryType == '수업' ? (
          <>
            <AppointmentForm.Label text="멘토 작성란" type="title" />
            <div>
              <Checkbox value={appointmentData.late} onClick={onLate} />
              <span>지각</span>
              <Checkbox value={appointmentData.absent} onClick={onAbsent} />
              <span>결석</span>
            </div>
            <div>
              <AppointmentForm.Label text="수업내용" type="ordinary" />
              <AppointmentForm.TextEditor
                value={appointmentData.description || ''}
                onValueChange={onDescriptionChange}
                type="multilineTextEditor"
              />
            </div>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <AppointmentForm.Label text="과제 현황" type="ordinary" />
                <p>{appointmentData.progress ? appointmentData.progress : 0}%</p>
              </div>
              <Slider
                value={appointmentData.progress}
                max={100}
                min={0}
                step={1}
                onChange={onProgressChange}
                aria-labelledby="continuous-slider"
              />
            </div>
            <div>
              <Checkbox value={test} onClick={onTest} />
              <span>테스트</span>
            </div>
            <div className={classes.menu}>
              <p>점수</p>
              <p>등수</p>
            </div>
            <div className={classes.menu}>
              <OutlinedInput
                value={appointmentData.score}
                onChange={onScoreChange}
                endAdornment={<InputAdornment position="end">점</InputAdornment>}
              />
              <OutlinedInput
                value={appointmentData.rank}
                onChange={onRankChange}
                endAdornment={<InputAdornment position="end">등</InputAdornment>}
              />
            </div>
            <div className={classes.menu}>
              {errors.score ? <err>유효한 점수를 입력해 주세요</err> : <div />}
              {errors.rank ? <err>유효한 등수를 입력해 주세요</err> : <div />}
            </div>
          </>
        ) : (
          <>
            <AppointmentForm.Label text="학생 작성란" type="title" />
            <div>
              <AppointmentForm.Label text="세부계획" type="ordinary" />
              <AppointmentForm.TextEditor
                value={appointmentData.description}
                onValueChange={onDescriptionChange}
                type="multilineTextEditor"
              />
            </div>
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <AppointmentForm.Label text="과제 현황" type="ordinary" />
                <p>{appointmentData.progress ? appointmentData.progress : 0}%</p>
              </div>
              <Slider
                value={appointmentData.progress}
                max={100}
                min={0}
                step={1}
                onChange={onProgressChange}
                aria-labelledby="continuous-slider"
              />
            </div>
            <AppointmentForm.Label text="멘토 작성란" type="title" />
            <AppointmentForm.Select
              value={appointmentData.mentor_rank || ''}
              onValueChange={onMentorRankChange}
              availableOptions={mentorRankOptions}
              className={classes.select}
            />
            <AppointmentForm.TextEditor
              placeholder="한 줄 평가를 써주세요"
              value={appointmentData.mentor_desc || ''}
              onValueChange={onMentorDescChange}
            />
            <AppointmentForm.TextEditor
              placeholder="테스트 점수를 입력하세요"
              value={appointmentData.mentor_test || ''}
              onValueChange={onMentorScoreChange}
            />
            {errors.mentor_test ? <err>유효한 점수를 입력해 주세요</err> : <div />}
          </>
        )}
      </div>
    );
  },
);

const DatePicker = React.memo(
  ({classes, onValueChange, value, readOnly, className, locale, excludeTime, ...restProps}) => {
    const memoizedChangeHandler = React.useCallback(
      nextDate => nextDate && onValueChange(nextDate.toDate()),
      [onValueChange],
    );
    const dateFormat = excludeTime ? 'DD/MM/YYYY' : 'DD/MM/YYYY hh:mm A';

    return (
      <MuiPickersUtilsProvider utils={MomentUtils} locale={locale}>
        <KeyboardTimePicker
          variant="inline"
          disabled={readOnly}
          className={className}
          margin="normal"
          value={value}
          onChange={memoizedChangeHandler}
          format={dateFormat}
          inputVariant="filled"
          hiddenLabel
          {...restProps}
        />
      </MuiPickersUtilsProvider>
    );
  },
);

const BasicLayout = React.forwardRef(
  ({onFieldChange, appointmentData, classes, children, errors, ...restProps}, ref) => {
    useEffect(() => {
      onFieldChange({date: appointmentData.startDate, endDate: appointmentData.startDate});
    }, []);

    useEffect(() => {
      ref.current = appointmentData;
    }, [appointmentData]);
    const [repeat, setRepeat] = useState(false);
    const [count, setCount] = useState(true);
    const [end, setEnd] = useState(false);
    const days = {
      월: 'MO',
      화: 'TU',
      수: 'WE',
      목: 'TH',
      금: 'FR',
      토: 'SA',
      일: 'SU',
    };
    const onCustomFieldChange = nextValue => {
      onFieldChange({customField: nextValue});
    };
    const onPrimaryTypeChange = nextValue => {
      onFieldChange({primaryType: nextValue});
    };
    const onSubjectChange = nextValue => {
      onFieldChange({subject: nextValue});
    };
    const onTeacherChange = nextValue => {
      onFieldChange({teacher: nextValue});
    };
    const onTitleChange = React.useCallback(
      nextValue => {
        onFieldChange({title: nextValue});
      },
      [onFieldChange],
    );
    const changeStartDate = React.useCallback(
      startDate => onFieldChange({startDate}),
      [onFieldChange],
    );
    const changeEndDate = React.useCallback(endDate => onFieldChange({endDate}), [onFieldChange]);
    const changeDate = React.useCallback(
      date => {
        onFieldChange({
          date: date,
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0),
        });
      },
      [onFieldChange],
    );
    const changeEnd = React.useCallback(end => onFieldChange({end}), [onFieldChange]);
    const onDayChange = React.useCallback(
      e => {
        const v = e.target.value;
        let rRule = appointmentData.rRule;
        if (!rRule)
          rRule =
            'FREQ=WEEKLY;BYDAY=' +
            days[v] +
            ';INTERVAL=1' +
            (count && appointmentData.count ? ';COUNT=' + appointmentData.count : '') +
            (!count && appointmentData.end
              ? ';UNTIL=' +
                appointmentData.end.toISOString().split('T')[0].split('-').join('') +
                'T150000Z'
              : '');
        else {
          rRule = rRule.split(';')[1];
          const arr = Object.keys(days).map(key => rRule.includes(days[key]) ^ (key == v));
          console.log(arr);
          const str = arr.reduce(
            (str, a, i) => str + (a ? Object.entries(days)[i][1] + ',' : ''),
            '',
          );
          if (str.length == '') rRule = undefined;
          else
            rRule =
              'FREQ=WEEKLY;BYDAY=' +
              str.slice(0, -1) +
              ';INTERVAL=1' +
              (count && appointmentData.count ? ';COUNT=' + appointmentData.count : '') +
              (!count && appointmentData.end
                ? ';UNTIL=' +
                  appointmentData.end.toISOString().split('T')[0].split('-').join('') +
                  'T150000Z'
                : '');
        }
        onFieldChange({rRule: rRule});
      },
      [onFieldChange, appointmentData, count],
    );
    const changeRecurrenceInterval = React.useCallback(
      v => {
        let rRule = appointmentData.rRule;
        if (!rRule) return;
        else {
          rRule = rRule.split(';').slice(0, 3).join(';');
          rRule =
            rRule +
            (count ? ';COUNT=' + v : '') +
            (!count
              ? ';UNTIL=' + v.toISOString().split('T')[0].split('-').join('') + 'T150000Z'
              : '');
        }
        onFieldChange({rRule: rRule, ...(count ? {count: v} : {end: v})});
      },
      [onFieldChange, appointmentData, count],
    );
    const onStudyChange = e => onFieldChange({studyType: e.target.value});
    const onStudyContentChange = e => onFieldChange({studyContent: e});
    const primaryTypeOptions = [
      {id: '수업', text: '수업'},
      {id: '학습', text: '학습'},
    ];
    const subjectOptions = [
      {id: '국어', text: '국어'},
      {id: '수학', text: '수학'},
      {id: '영어', text: '영어'},
      {id: '사탐', text: '사탐'},
      {id: '과탐', text: '과탐'},
      {id: '기타', text: '기타'},
    ];

    return (
      <div className={classes.root}>
        <div className={classes.menu}>
          <AppointmentForm.Label text="수업/학습" type="title" />
          <AppointmentForm.Label text="과목" type="title" />
        </div>
        <div className={classes.menu}>
          <AppointmentForm.Select
            value={appointmentData.primaryType}
            onValueChange={onPrimaryTypeChange}
            availableOptions={primaryTypeOptions}
            className={classes.select}
          />
          <AppointmentForm.Select
            value={appointmentData.subject}
            onValueChange={onSubjectChange}
            availableOptions={subjectOptions}
            className={classes.select}
          />
        </div>
        <div className={classes.menu}>
          {errors.primaryType ? <err>수업/학습 여부를 입력해 주세요</err> : <div />}
          {errors.subject ? <err>과목을 입력해 주세요</err> : <div />}
        </div>
        {appointmentData.primaryType === '수업' ? (
          <>
            <AppointmentForm.Label text="선생님 이름" type="title" />
            <AppointmentForm.TextEditor
              placeholder="선생님 이름을 입력하세요"
              type="ordinaryTextEditor"
              value={appointmentData.teacher}
              onValueChange={onTeacherChange}
            />
          </>
        ) : null}
        {errors.teacher ? <err>선생님 이름을 입력해 주세요</err> : null}
        <AppointmentForm.Label text="목표" type="title" />
        <AppointmentForm.TextEditor
          placeholder="계획 목표를 작성해 주세요"
          type="ordinaryTextEditor"
          value={appointmentData.title}
          onValueChange={onTitleChange}
        />
        {errors.title ? <err>계획 목표을 입력해 주세요</err> : null}
        <AppointmentForm.Label text="기간과 시간 선택" type="title" />
        <AppointmentForm.Label text="시작 날짜 선택" type="ordinary" />
        <AppointmentForm.DateEditor
          value={appointmentData.date}
          onValueChange={changeDate}
          excludeTime={true}
        />
        {errors.date ? <err>날짜를 입력헤 주세요</err> : null}
        <div className={classes.date}>
          <p>시작 시간:</p>
          <DatePicker
            value={appointmentData.startDate}
            onValueChange={changeStartDate}
            excludeTime={appointmentData.allDay}
          />
        </div>
        {errors.startDate ? <err>시작 시간이 유효하지 않습니다</err> : null}
        <div className={classes.date}>
          <p>끝 시간:</p>
          <DatePicker
            value={appointmentData.endDate}
            onValueChange={changeEndDate}
            excludeTime={appointmentData.allDay}
          />
        </div>
        {errors.endDate ? <err>끝 시간이 유효하지 않습니다</err> : null}
        {errors.wrongDate ? <err>끝 시간은 시작 시간보다 이후여야 합니다</err> : null}
        <FormControlLabel
          checked={repeat}
          onClick={() => setRepeat(!repeat)}
          control={<Radio />}
          label="반복주기 설정 (이 계획이 1일 이상 지속될 경우)"
        />
        {repeat ? (
          <>
            <p>{appointmentData.rRule}</p>
            <AppointmentForm.Label text="주간 반복주기 선택" type="title" />
            <AppointmentForm.Label text="해당 요일 선택" type="ordinary" />
            <div className={classes.selector}>
              {['월', '화', '수', '목', '금', '토', '일'].map(e => (
                <button
                  value={e}
                  id={e}
                  onClick={onDayChange}
                  className={
                    appointmentData.rRule && appointmentData.rRule.split(';')[1].includes(days[e])
                      ? classes.active
                      : ''
                  }
                >
                  {e}
                </button>
              ))}
            </div>
            <div className={classes.menu}>
              <div>
                <FormControlLabel
                  checked={count}
                  onClick={() => setCount(!count)}
                  control={<Radio />}
                  label="플랜 수로 설정"
                />
                <AppointmentForm.TextEditor
                  readOnly={!count}
                  value={appointmentData.count}
                  type="numberEditor"
                  onValueChange={changeRecurrenceInterval}
                />
              </div>
              <div>
                <FormControlLabel
                  checked={!count}
                  onClick={() => setCount(!count)}
                  control={<Radio />}
                  label="끝나는 날짜로 설정"
                />
                <AppointmentForm.DateEditor
                  readOnly={count}
                  value={appointmentData.end}
                  onValueChange={changeRecurrenceInterval}
                  excludeTime={appointmentData.allDay}
                />
              </div>
            </div>
          </>
        ) : null}
        {appointmentData.primaryType && appointmentData.primaryType == '학습' ? (
          <>
            <AppointmentForm.Label text="교재 또는 인강 선택" type="title" />
            <RadioGroup row value={appointmentData.studyType} onChange={onStudyChange}>
              <FormControlLabel value="인강" control={<Radio />} label="인강" />
              <FormControlLabel value="교재" control={<Radio />} label="교재" />
            </RadioGroup>
            {appointmentData.studyType ? (
              <AppointmentForm.TextEditor
                placeholder="교재/인강 이름을 입력하세요"
                type="ordinaryTextEditor"
                value={appointmentData.studyContent}
                onValueChange={onStudyContentChange}
              />
            ) : null}
          </>
        ) : null}
      </div>
    );
  },
);

const startViewDateComputed = ({startViewDate}) => {
  console.log('start view date:', startViewDate);
  return startViewDate;
};
const endViewDateComputed = ({endViewDate}) => {
  console.log('end view date:', endViewDate);
  return endViewDate;
};

const pluginDependencies = [
  {name: 'DayView', optional: true},
  {name: 'MonthView', optional: true},
  {name: 'WeekView', optional: true},
  {name: 'ViewState', optional: true},
];

const IntegratedDates = ({setStart, setEnd}) => {
  const s = props => {
    setStart(startViewDateComputed(props));
  };
  const e = props => {
    setEnd(endViewDateComputed(props));
  };

  return (
    <Plugin dependencies={pluginDependencies} name="IntegratedDates">
      <Getter name="startViewDate" computed={s} />
      <Getter name="endViewDate" computed={e} />
    </Plugin>
  );
};

const EditRecurrenceMenuOverlay = ({target, ...restProps}) => {
  const overlay = document.getElementById('scheduler_overlay');
  useEffect(() => {
    if (overlay && restProps.visible) overlay.style.visibility = 'visible';
    else if (overlay) overlay.style.visibility = 'hidden';
  }, [restProps.visible, overlay]);
  return <EditRecurrenceMenu.Overlay target={{current: overlay}} {...restProps} />;
};

const Y = ({data, setData, date, setDate, setStart, setEnd}) => {
  useEffect(() => console.log(data), [data]);
  const [currentViewName, setCurrentViewName] = useState('Week');
  const {connected} = useContext(DataContext);
  const [edited, setEdited] = useState({});
  const [resources, setResources] = useState([
    {
      fieldName: 'primaryType',
      title: '수업/학습',
      instances: [
        {
          text: '수업',
          id: '수업',
        },
        {
          text: '학습',
          id: '학습',
        },
      ],
    },
    {
      fieldName: 'subject',
      title: '과목',
      instances: [
        {
          text: '국어',
          id: '국어',
          color: '#7E57C2',
        },
        {
          text: '수학',
          id: '수학',
          color: '#FF7043',
        },
        {
          text: '영어',
          id: '영어',
          color: '#E91E63',
        },
        {
          text: '과탐',
          id: '과탐',
          color: '#E91E63',
        },
        {
          text: '사탐',
          id: '사탐',
          color: '#AB47BC',
        },
        {
          text: '기타',
          id: '기타',
          color: '#FFA726',
        },
      ],
    },
  ]);
  const [errors, setErrors] = useState({});
  const reffy = useRef(null);
  const currentViewNameChange = currentViewName => {
    setCurrentViewName(currentViewName);
  };

  const Command = props => {
    return (
      <AppointmentForm.CommandButton
        {...props}
        onExecute={p => {
          if (props.id != 'saveButton') {
            setErrors({});
            props.onExecute(p);
            return;
          }
          let obj = {};
          console.log(reffy.current, !reffy.current.title);
          if (!reffy.current.title) {
            obj.title = true;
          }
          if (!reffy.current.primaryType) {
            obj.primaryType = true;
          }
          if (!reffy.current.subject) {
            obj.subject = true;
          }
          if (reffy.current.primaryType == '수업' && !reffy.current.teacher) {
            obj.teacher = true;
          }
          if (!reffy.current.startDate || !(reffy.current.startDate instanceof Date)) {
            obj.startDate = true;
          }
          if (!reffy.current.endDate || !(reffy.current.endDate instanceof Date)) {
            obj.endDate = true;
          }
          if (
            reffy.current.endDate instanceof Date &&
            reffy.current.startDate instanceof Date &&
            reffy.current.endDate <= reffy.current.startDate
          ) {
            obj.wrongDate = true;
          }
          if (!!reffy.current.score && !/^\d+$/.test(reffy.current.score)) {
            obj.score = true;
          }
          if (!!reffy.current.rank && !/^\d+$/.test(reffy.current.rank)) {
            obj.rank = true;
          }
          if (!!reffy.current.mentor_test && !/^\d+$/.test(reffy.current.mentor_test)) {
            obj.mentor_test = true;
          }
          setErrors(obj);
          if (Object.keys(obj).length > 0) {
            return;
          } else props.onExecute(p);
        }}
      />
    );
  };

  const Layout = props =>
    props.appointmentData.id ? (
      <EditLayout {...props} classes={selectClasses} ref={reffy} errors={errors} />
    ) : (
      <BasicLayout {...props} classes={selectClasses} ref={reffy} errors={errors} />
    );

  const commitChanges = async ({added, changed, deleted}) => {
    console.log(added, changed, deleted);
    let dataa = data;
    if (added) {
      const res = await axios.post('/api/plan/add', added, {
        headers: {
          auth: connected ? connected : localStorage.getItem('uid'),
        },
      });
      added.id = res.data.data;
      dataa.push(added);
      dataa = [...dataa];
    }
    if (changed) {
      let tobe = {};
      dataa = dataa.map(appointment => {
        if (changed[appointment.id]) tobe = {...appointment, ...changed[appointment.id]};
        return changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment;
      });
      const res = await axios.post('/api/plan/add', tobe, {
        headers: {
          auth: connected ? connected : localStorage.getItem('uid'),
        },
      });
    }
    if (deleted !== undefined) {
      console.log(deleted);
      const res = await axios.get('/api/plan/delete', {
        params: {
          id: deleted,
        },
        headers: {
          auth: localStorage.getItem('uid'),
        },
      });
      dataa = dataa.filter(appointment => appointment.id !== deleted);
    }
    setData(dataa);
  };

  const selectClasses = useSelectStyles();
  return (
    <>
      <Paper>
        <Scheduler data={data} locale="ko-kr">
          <ViewState
            defaultCurrentDate={date}
            onCurrentDateChange={setDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={currentViewNameChange}
          />

          <WeekView startDayHour={6} endDayHour={24} displayName="일간" />
          <MonthView displayName="월간" />
          <DayView displayName="일간" />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <EditingState onCommitChanges={commitChanges} />
          <ViewSwitcher />
          <Appointments />
          <EditRecurrenceMenu
            overlayComponent={EditRecurrenceMenuOverlay}
            messages={{
              current: '이 계획만',
              currentAndFollowing: '이 계획과 따라오는 계획들',
              all: '모든 반복되는 계획들',
              menuEditingTitle: '반복되는 계획 변경하기',
              menuDeletingTitle: '반복되는 계획 삭제하기',
              cancelButton: '취소',
            }}
          />
          <AppointmentTooltip showOpenButton showDeleteButton />

          <AppointmentForm
            overlayComponent={Overlay}
            commandButtonComponent={Command}
            basicLayoutComponent={Layout}
            recurrenceLayoutComponent={() => null}
          />
          <Resources data={resources} mainResourceName="subject" />
        </Scheduler>
      </Paper>
      <div
        style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 100}}
        id="scheduler_overlay"
      />
    </>
  );
};

const Z = ({data, setData, date, setDate, setStart, setEnd}) => {
  const [currentViewName, setCurrentViewName] = useState('Week');
  const connected = useContext(DataContext);
  const [edited, setEdited] = useState({});
  const [resources, setResources] = useState([
    {
      fieldName: 'primaryType',
      title: '수업/학습',
      instances: [
        {
          text: '수업',
          id: '수업',
        },
        {
          text: '학습',
          id: '학습',
        },
      ],
    },
    {
      fieldName: 'subject',
      title: '과목',
      instances: [
        {
          text: '국어',
          id: '국어',
          color: '#7E57C2',
        },
        {
          text: '수학',
          id: '수학',
          color: '#FF7043',
        },
        {
          text: '영어',
          id: '영어',
          color: '#E91E63',
        },
        {
          text: '과탐',
          id: '과탐',
          color: '#E91E63',
        },
        {
          text: '사탐',
          id: '사탐',
          color: '#AB47BC',
        },
        {
          text: '기타',
          id: '기타',
          color: '#FFA726',
        },
      ],
    },
  ]);
  const [errors, setErrors] = useState({});
  const reffy = useRef(null);
  const currentViewNameChange = currentViewName => {
    setCurrentViewName(currentViewName);
  };

  const Command = props => {
    return (
      <AppointmentForm.CommandButton
        {...props}
        onExecute={p => {
          if (props.id != 'saveButton') {
            setErrors({});
            props.onExecute(p);
            return;
          }
          let obj = {};
          console.log(reffy.current, !reffy.current.title);
          if (!reffy.current.title) {
            obj.title = true;
          }
          if (!reffy.current.primaryType) {
            obj.primaryType = true;
          }
          if (!reffy.current.subject) {
            obj.subject = true;
          }
          if (reffy.current.primaryType == '수업' && !reffy.current.teacher) {
            obj.teacher = true;
          }
          if (!reffy.current.startDate || !(reffy.current.startDate instanceof Date)) {
            obj.startDate = true;
          }
          if (!reffy.current.endDate || !(reffy.current.endDate instanceof Date)) {
            obj.endDate = true;
          }
          if (
            reffy.current.endDate instanceof Date &&
            reffy.current.startDate instanceof Date &&
            reffy.current.endDate <= reffy.current.startDate
          ) {
            obj.wrongDate = true;
          }
          if (!!reffy.current.score && !/^\d+$/.test(reffy.current.score)) {
            obj.score = true;
          }
          if (!!reffy.current.rank && !/^\d+$/.test(reffy.current.rank)) {
            obj.rank = true;
          }
          if (!!reffy.current.mentor_test && !/^\d+$/.test(reffy.current.mentor_test)) {
            obj.mentor_test = true;
          }
          setErrors(obj);
          if (Object.keys(obj).length > 0) {
            return;
          } else props.onExecute(p);
        }}
      />
    );
  };

  const Layout = props =>
    props.appointmentData.id ? (
      <EditLayout {...props} classes={selectClasses} ref={reffy} errors={errors} />
    ) : (
      <BasicLayout {...props} classes={selectClasses} ref={reffy} errors={errors} />
    );

  const commitChanges = async ({added, changed, deleted}) => {
    let dataa = data;
    if (added) {
      const res = await axios.post('/api/plan/add', added, {
        headers: {
          auth: connected ? connected : localStorage.getItem('uid'),
        },
      });
      added.id = res.data.data;
      dataa.push(added);
      dataa = [...dataa];
    }
    if (changed) {
      let tobe = {};
      dataa = dataa.map(appointment => {
        if (changed[appointment.id]) tobe = {...appointment, ...changed[appointment.id]};
        return changed[appointment.id] ? {...appointment, ...changed[appointment.id]} : appointment;
      });
      const res = await axios.post('/api/plan/add', tobe, {
        headers: {
          auth: connected ? connected : localStorage.getItem('uid'),
        },
      });
    }
    if (deleted !== undefined) {
      console.log(deleted);
      const res = await axios.get('/api/plan/delete', {
        params: {
          id: deleted,
        },
        headers: {
          auth: localStorage.getItem('uid'),
        },
      });
      dataa = dataa.filter(appointment => appointment.id !== deleted);
    }
    setData(dataa);
  };

  const selectClasses = useSelectStyles();
  return (
    <>
      <Scheduler data={data} locale="ko-kr">
        <ViewState
          defaultCurrentDate={date}
          onCurrentDateChange={setDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={currentViewNameChange}
        />

        <WeekView startDayHour={6} endDayHour={24} displayName="일간" />
        <MonthView displayName="월간" />
        <DayView displayName="일간" />
        <Toolbar />
        <DateNavigator />
        <TodayButton />
        <EditingState onCommitChanges={commitChanges} />
        <ViewSwitcher />
        <Appointments />
        <EditRecurrenceMenu
          overlayComponent={EditRecurrenceMenuOverlay}
          messages={{
            current: '이 계획만',
            currentAndFollowing: '이 계획과 따라오는 계획들',
            all: '모든 반복되는 계획들',
            menuEditingTitle: '반복되는 계획 변경하기',
            menuDeletingTitle: '반복되는 계획 삭제하기',
            cancelButton: '취소',
          }}
        />
        <AppointmentTooltip showOpenButton showDeleteButton />

        <AppointmentForm
          commandButtonComponent={Command}
          basicLayoutComponent={Layout}
          recurrenceLayoutComponent={() => null}
        />
        <Resources data={resources} mainResourceName="subject" />
      </Scheduler>
      <div
        style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, zIndex: 100}}
        id="scheduler_overlay"
      />
    </>
  );
};

const Monthly = ({date, data, start, end}) => {
  const [subject, setSubject] = useState('전체');
  const subjectsFiltered = React.useMemo(() => {
    console.log(date, data, start, end);
    if (!start || !end) return [];
    else
      return data.reduce((acc, obj) => {
        if (obj.startDate.getTime() <= end.getTime() && start.getTime() < obj.endDate.getTime()) {
          acc.push(obj);
        }
        return acc;
      }, []);
  }, [date, data, start, end]);

  const def = (
    <>
      <style jsx>{`
        h3 {
          font-size: 1.4rem;
        }
        .subject {
          padding: 0.5em 1.2em;
          margin: 1em 0;
          background-color: #f7f7f7;
          border-radius: 10px;
          line-height: 1.8em;
          font-size: 0.9rem;
          word-break: keep-all;
        }
        .subject > a {
          margin-right: 1em;
          color: #333333;
          opacity: 30%;
        }
        .subject > a.on {
          opacity: 1;
        }
        .circle {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin: 0 4px 2px 0;
          border-radius: 50%;
        }
        .kor {
          background-color: #f56262;
        }
        .math {
          background-color: #d8dc6a;
        }
        .eng {
          background-color: #fccf2e;
        }
        .his {
          background-color: #995d81;
        }
        .sci {
          background-color: #6689a1;
        }
        .etc {
          background-color: #f6afc0;
        }
      `}</style>
      <h3>이번주 계획</h3>
      <div className="subject">
        <a href="#" className={subject == '전체' ? 'on' : null} onClick={() => setSubject('전체')}>
          전체
        </a>
        <a href="#" className={subject == '국어' ? 'on' : null} onClick={() => setSubject('국어')}>
          <span className="circle kor"></span>국어
        </a>
        <a href="#" className={subject == '수학' ? 'on' : null} onClick={() => setSubject('수학')}>
          <span className="circle math"></span>수학
        </a>
        <a href="#" className={subject == '영어' ? 'on' : null} onClick={() => setSubject('영어')}>
          <span className="circle eng"></span>영어
        </a>
        <a href="#" className={subject == '과학' ? 'on' : null} onClick={() => setSubject('과탐')}>
          <span className="circle sci"></span>과탐
        </a>
        <a href="#" className={subject == '과학' ? 'on' : null} onClick={() => setSubject('사탐')}>
          <span className="circle sci"></span>사탐
        </a>
        <a href="#" className={subject == '기타' ? 'on' : null} onClick={() => setSubject('기타')}>
          <span className="circle etc"></span>기타
        </a>
      </div>
      <div className="detail">
        {subjectsFiltered
          .filter(e => subject == '전체' || subject == e.subject)
          .map((d, i) => {
            return (
              <div className={s.flex} style={{alignItems: 'center'}}>
                <SubjectListItem data={d} style={{width: 0, flex: '1 0 0'}} />
              </div>
            );
          })}
      </div>
    </>
  );
  /*onClick={() => {
				console.log(d.isitem);
				updateDataDone(d.isitem,d.done,d.id); setItems(p => {
					return p.map(pp => {
						if (pp.id == d.id) {
							pp.isitemdone = !d.isitemdone
						}
						return pp;
					})
				})}}*/
  return (
    <>
      <style jsx>{`
        #con_right_top {
          min-height: 700px;
          margin-bottom: 2em;
          background-color: #ffffff;
          border-radius: 20px;
        }
        #con_right_bottom {
          min-height: 600px;
          background-color: #ffffff;
          border-radius: 20px;
        }
        #con_right_bottom > h4 {
          font-size: 1.4rem;
        }
      `}</style>
      <div id="con_right_top">{def}</div>
      {/*<div id="con_right_bottom">
                <h4>요약</h4>
                <div className="detail">
					<WeeklySummary open={true} data={subjectsFiltered}/>
				</div>
			</div>*/}
    </>
  );
};

const SubjectListItem = props => {
  //장기 리스트 뷰에서 나오는 목표 리스트 아이템들
  const {data, hideProgress} = props;
  let endDate = data.rRule
    ? data.rRule.includes('UNTIL')
      ? data.rRule.split(';')[3].split('=')[1].split('T')[0]
      : data.rRule.split(';')[3].split('=')[1]
    : null;
  console.log(data.id, endDate);
  if (endDate && endDate.length == 8)
    endDate = new Date(
      endDate.slice(0, 4) + '-' + endDate.slice(4, 6) + '-' + endDate.slice(6, 8) + 'T15:00:00Z',
    );
  return (
    <div
      style={{width: '100%', padding: '12px 20px', boxSizing: 'border-box', ...props.style}}
      onClick={props.onClick ? () => props.onClick(data) : null}
    >
      <div className={[s.flex, s.smallfont].join(' ')} style={{marginBottom: '8px'}}>
        <div>
          <div className={[s.dot, s[colors[data.subject]]].join(' ')}></div>
          {data.subject}&nbsp;|&nbsp;{data.primaryType}
        </div>
      </div>
      <div className={s.bigtext} style={{marginBottom: '8px'}}>
        {data.title}
      </div>
      <div style={{fontSize: '0.8em', marginBottom: '8px'}}>
        {data.startDate.getFullYear()}.{(data.startDate.getMonth() + 1).toString().padStart(2, '0')}
        .{data.startDate.getDate().toString().padStart(2, '0')}({days[data.startDate.getDay()]})
        {endDate instanceof Date ? (
          <>
            &nbsp;- &nbsp;
            {endDate.getFullYear()}.{(endDate.getMonth() + 1).toString().padStart(2, '0')}.
            {endDate.getDate().toString().padStart(2, '0')}({days[endDate.getDay()]}),
            {Math.ceil((endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))}
            주
          </>
        ) : null}
        {endDate && typeof endDate == 'string' ? <> 부터 {endDate}회 반복</> : null}
      </div>
      {hideProgress ? null : (
        <>
          <div
            style={{width: '100%', marginBottom: '8px'}}
            className={[s.flex, s.smallfont, s.disabled].join(' ')}
          >
            <div
              style={{borderRight: '1px solid black', paddingRight: '1em', overflow: 'hidden'}}
              className={[s.ellipse, s.flexchild].join(' ')}
            >
              {data.primaryType == '수업'
                ? data.teacher
                : data.studyType && data.studyContent
                ? data.studyType + ': ' + data.studyContent
                : '(없음)'}
            </div>
            <div className={s.flexchild} style={{paddingLeft: '1em'}}>
              {data.progress || '0'}%)
            </div>
          </div>
          <div style={{position: 'relative'}}>
            <div
              className={[s.bar, s[colors[data.subject]]].join(' ')}
              style={{width: (data.progress || '0') + '%', position: 'absolute'}}
            />
            <div className={[s.bar, s[colors[data.subject]], s.disabled].join(' ')}></div>
          </div>
        </>
      )}
    </div>
  );
};

const MobileBigCalendar = () => {
  const [data, setData] = useState([]);
  const ref = useRef(null);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('주간');
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const params = new URL(document.location).searchParams;
  const connected = params.get('id') ? params.get('id') : null;

  useEffect(() => {
    axios
      .get('/api/plan/add', {
        headers: {
          auth: connected ? connected : localStorage.getItem('uid'),
        },
      })
      .then(res => {
        const a = res.data.data.map(r => {
          r.startDate = new Date(r.startDate);
          r.endDate = new Date(r.endDate);
          return r;
        });
        setData(a);
      });
  }, []);

  const setDater = v => setDate(v);

  return (
    <DataContext.Provider value={{data: [data, setData], innerRef: ref, connected: connected}}>
      <Z data={data} setData={setData} date={date} setDate={setDater} />
    </DataContext.Provider>
  );
};

const DesktopBigCalendar = () => {
  const [data, setData] = useState([]);
  const ref = useRef(null);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState('주간');
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const params = new URL(document.location).searchParams;
  const connected = params.get('id') ? params.get('id') : null;

  useEffect(() => {
    axios
      .get('/api/plan/add', {
        headers: {
          auth: connected ? connected : localStorage.getItem('uid'),
        },
      })
      .then(res => {
        const a = res.data.data.map(r => {
          r.startDate = new Date(r.startDate);
          r.endDate = new Date(r.endDate);
          return r;
        });
        setData(a);
      });
  }, []);

  const setDater = v => setDate(v);

  return (
    <DataContext.Provider value={{data: [data, setData], innerRef: ref, connected: connected}}>
      <div style={{position: 'relative'}}>
        <style jsx>{`
          /* reset */
          * {
            margin: 0px;
            padding: 0px;
            list-style: none;
          }
          ol ul {
            list-style: none;
          }
          table {
            border-collapse: collapse;
            border-spacing: 0;
          }
          a {
            text-decoration: none;
            color: inherit;
          }

          /* common */
          body {
            background-color: #fafafa;
            color: #333333;
          }
          #inner {
            display: flex;
            align-content: space-between;
            max-width: 1216px;
            margin: 6em auto 10em;
          }
          #inner .inner_top {
            height: 47px;
            margin-bottom: 1em;
          }
          #inner > #inner_left {
            width: 66%;
            margin-right: 2%;
          }
          #inner > #inner_left > .inner_top {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          #inner > #inner_left > .inner_top > h1 {
            font-size: 1.8rem;
          }
          #inner > #inner_left > .inner_top > ul {
            display: flex;
            height: 36px;
            line-height: 34px;
          }
          #inner > #inner_left > .inner_top > ul > li {
            position: relative;
            padding: 0 12px;
            margin-left: 20px;
            border-radius: 35px;
            font-weight: 500;
          }
          #inner > #inner_left > .inner_top > ul > li:nth-child(1) {
            margin-left: 0;
            background-color: #de6b3d;
            color: #ffffff;
          }
          #inner > #inner_left > .inner_top > ul > li:nth-child(1):after {
            position: absolute;
            top: 51%;
            right: -14px;
            transform: translateY(-50%);
            content: '';
            width: 8px;
            height: 9px;
            background-image: url('https://img.ingipsy.com/assets/icons/p_nav_on.png');
          }
          #inner > #inner_left > .inner_top > ul > li:nth-child(2) {
            background-color: #ffffff;
            color: #333333;
          }
          #inner > #inner_left > .inner_top > ul > li:nth-child(2):after {
            position: absolute;
            top: 51%;
            right: -14px;
            transform: translateY(-50%);
            content: '';
            width: 8px;
            height: 9px;
            background-image: url('https://img.ingipsy.com/assets/icons/p_nav_off.png');
          }
          #inner > #inner_left > .inner_top > ul > li:last-child {
            background-color: #ffffff;
            color: #333333;
          }
          #inner > #inner_left > #con_left {
            min-height: 1000px;
            padding: 2em;
            background-color: #ffffff;
            border-radius: 20px;
          }
          #inner > #inner_left > #con_left > h2 {
            font-size: 2rem;
          }
          #inner > #inner_left > #con_left > h2 > a {
            padding: 0 0.5em;
            vertical-align: middle;
          }
          #inner > #inner_right {
            width: 32%;
          }
          #inner > #inner_right > .inner_top {
            line-height: 47px;
            text-align: right;
          }
          #inner > #inner_right > .inner_top > a {
            font-weight: 500;
          }
          #inner > #inner_right > .inner_top > a:last-child {
            margin-left: 1.2em;
          }
          #inner > #inner_right > .inner_top > a:last-child img {
            vertical-align: middle;
          }
          #inner > #inner_right > #con_right {
            min-height: 1000px;
            padding: 1em;
            background-color: #ffffff;
            border-radius: 20px;
            position: relative;
          }
          #inner > #inner_right > #con_right > h3 {
            font-size: 1.4rem;
          }

          .circle {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin: 0 4px 2px 0;
            border-radius: 50%;
          }
          .kor {
            background-color: #f56262;
          }
          .math {
            background-color: #d8dc6a;
          }
          .eng {
            background-color: #fccf2e;
          }
          .his {
            background-color: #995d81;
          }
          .sci {
            background-color: #6689a1;
          }
          .etc {
            background-color: #f6afc0;
          }

          /* start */
          #inner > #inner_right > #con_right > .detail > .detail_box {
            padding: 1em;
            margin-top: 1em;
            box-shadow: 2px 2px 5px 0px #dddddd96;
            border-radius: 10px;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .subject {
            display: flex;
            font-size: 0.7rem;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .subject > .tit {
            margin-right: 9px;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .subject > .tit:after {
            display: inline-block;
            width: 1px;
            height: 9px;
            margin-left: 9px;
            content: '';
            background-color: #8c8c8c;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .subject > .tit > .circle {
            width: 7px;
            height: 7px;
            margin-bottom: 1px;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .title {
            padding: 0.3em 0;
            font-size: 1.1rem;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: black;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .date {
            font-size: 0.8rem;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .learn {
            display: flex;
            position: relative;
            justify-content: space-between;
            padding: 0.7em 0;
            font-size: 0.7rem;
            color: #999999;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .learn > .book {
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 60%;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .learn > .book:after {
            position: absolute;
            top: 50%;
            right: 36%;
            transform: translateY(-50%);
            width: 1px;
            height: 9px;
            margin-left: 9px;
            content: '';
            background-color: #cccccc;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .learn > .per {
            width: 30%;
          }
          #inner > #inner_right > #con_right > .detail > .detail_box > .bar {
            width: 100%;
            height: 8px;
          }
          .disabled {
            width: 100vw;
            height: 100%;
            background-color: #f6f6f6;
            opacity: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            -webkit-text-stroke: 1px;
            position: absolute;
            top: 0;
            z-index: 1;
            color: #fc8454;
            line-height: 300px;
          }
          .disabled h1 {
            background-color: #000000;
            border-radius: 20px;

            height: 30%;
          }
        `}</style>
        <div id="inner">
          <div id="inner_left">
            <div className="inner_top">
              <h1>플래너</h1>
              <span>(*추가하시려면 원하는 시간에 더블클릭을 해주세요.)</span>
            </div>
            <div id="con_left">
              <Y
                data={data}
                setData={setData}
                date={date}
                setDate={setDater}
                setEnd={setEnd}
                setStart={setStart}
              />
            </div>
          </div>
          <div id="inner_right">
            {/*<div className="inner_top">
						<a href="#"><img src="assets/icons/p_setting.png" alt="플래너 설정" /> 플래너 설정</a>
			</div>*/}
            <div id="con_right" ref={ref}>
              <Monthly date={date} data={data} start={start} end={end} />
            </div>
          </div>
        </div>
        {
          //<div className='disabled'><h1>서비스 시작일 : 21년 8월 16일</h1></div>
        }
      </div>
    </DataContext.Provider>
  );
};

export default withDesktop(DesktopBigCalendar, MobileBigCalendar);
