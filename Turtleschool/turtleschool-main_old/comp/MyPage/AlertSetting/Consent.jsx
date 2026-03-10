import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import styled from 'styled-components';
import {useEffect} from 'react';
import axios from 'axios';

const Container = styled.div`
  position: relative;
  width: 100%;
`;
const List = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgb(228, 228, 228);
  padding: 20px;
`;
const Title = styled.dt`
  font-weight: 700;
  font-size: 24px;
  line-height: 22px;
`;
const DataList = styled.dl`
  display: flex;
  flex-direction: column;
  -webkit-box-pack: center;
  justify-content: center;
  width: calc(100% - 72px);
  margin: 24px 0px;
`;
const IOSSwitch = withStyles(theme => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: '#1C4BC3',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: '#1C4BC3',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({classes, ...props}) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const Consent = ({ipsy_yn, mento_yn, setMemberInfo}) => {
  const [state, setState] = useState({
    ipsy_alarm_yn: false,
    mento_alarm_yn: false,
  });

  useEffect(() => {
    setState({
      ipsy_alarm_yn: ipsy_yn === 'Y' ? true : false,
      mento_alarm_yn: mento_yn === 'Y' ? true : false,
    });
  }, [ipsy_yn, mento_yn]);

  async function handleIpsyAlramStatusUpdate() {
    try {
      const {data: res} = await axios.put(
        '/api/setting/alarm/ipsy',
        {
          status: !state.ipsy_alarm_yn === true ? 'Y' : 'N',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            auth: localStorage.realuid,
          },
        },
      );
      if (res.success) {
        setMemberInfo(prev => {
          return {...prev, ['ipsy_alarm_yn']: !state.ipsy_alarm_yn === true ? 'Y' : 'N'};
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleMentoAlramStatusUpdate() {
    try {
      const status = !state.mento_alarm_yn === true ? 'Y' : 'N';
      const {data: res} = await axios.put(
        '/api/setting/alarm/mento',
        {
          status: status,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            auth: localStorage.realuid,
          },
        },
      );
      if (res.success) {
        setMemberInfo(prev => {
          return {...prev, ['mento_alarm_yn']: status};
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <ul>
        <List>
          <DataList>
            <Title>맞춤 입시 정보 수신</Title>
          </DataList>
          <FormControlLabel
            control={
              <IOSSwitch
                checked={state.ipsy_alarm_yn}
                onChange={handleIpsyAlramStatusUpdate}
                name="ipsy_alarm_yn"
              />
            }
          />
        </List>
        <List>
          <DataList>
            <Title>멘토/멘티 메시지 수신</Title>
          </DataList>
          <FormControlLabel
            control={
              <IOSSwitch
                checked={state.mento_alarm_yn}
                onChange={handleMentoAlramStatusUpdate}
                name="mento_alarm_yn"
              />
            }
          />
        </List>
      </ul>
    </Container>
  );
};

export default Consent;
