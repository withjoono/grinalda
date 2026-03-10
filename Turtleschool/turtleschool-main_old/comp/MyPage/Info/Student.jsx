import React, {useState, useContext} from 'react';
import Search from '../../search';
import useForm from '../../useform';
import loginContext from '../../../contexts/login';
import styled from 'styled-components';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';

const Container = styled.div`
  width: 460px;
  height: 798px;
  border: 1px solid #c2c2c2;
  box-shadow: 2px 2px 12px 0px #00000024;
  padding: 30px;
`;
const Title = styled.div`
  color: #000000;
  font-weight: 800;
  font-size: 24px;
  margin: 15px 0 25px 0;
`;
const SubTitle = styled.p`
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  margin-top: 24px;
  margin-bottom: 5px;
`;
const SchoolInfo = styled.span`
  height: 26px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  margin-top: 15px;
`;
const NameBox = styled.input`
  width: 100%;
  height: 44px;
  background-color: #e8e8e8;
  font-size: 16px;
  text-align: left;
  padding-left: 10px;
  margin-top: 4px;
  margin-bottom: 10px;
`;
const EmailBox = styled.input`
  width: 100%;
  height: 44px;
  background-color: #e8e8e8;
  font-size: 16px;
  text-align: left;
  padding-left: 10px;
  margin-top: 4px;
  margin-bottom: 15px;
`;
const OtherNumber = styled.input`
  width: 93px;
  height: 44px;
  border: 1px #c2c2c2 solid;
  padding: 10px 0px 10px 12px;
`;
const SendButton = styled.button`
  width: 100px;
  height: 44px;
  border: 1px solid #f45119;
  border-radius: 4px;
  color: #f45119;
  font-size: 16px;
  padding: 10px 10px 10px 10px;
  font-weight: 700;
`;
const SerialBox = styled.input`
  height: 44px;
  width: 100%;
  margin-right: 6px;
  padding: 10px 0px 10px 12px;
  border: 1px #c2c2c2 solid;
`;
const CheckButton = styled.button`
  width: 100px;
  height: 44px;
  border: 1px solid #f45119;
  border-radius: 4px;
  color: #ffffff;
  background-color: #f45119;
  font-size: 16px;
  padding: 10px 10px 10px 10px;
  font-weight: 700;
  min-width: 100px;
`;
const Box = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  margin-bottom: 15px;
`;
const GradeBox = styled.select`
  border: 1px #c2c2c2 solid;
  width: 100px;
  height: 44px;
  text-align-last: left;
  margin-top: 4px;
  font-size: 16px;
  padding: 10px 0px 10px 12px;
`;
const GraduateBox = styled.input`
  border: 1px #c2c2c2 solid;
  width: 100%;
  height: 44px;
  text-align-last: left;
  margin-top: 4px;
  font-size: 16px;
  padding: 10px 0px 10px 12px;
`;
const LocationBox = styled.select`
  border: 1px #c2c2c2 solid;
  width: 100px;
  height: 44px;
  font-size: 16px;
  text-align-last: left;
  margin-top: 4px;
  padding: 10px 0px 10px 12px;
`;

const EditButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: 80px;
`;
const EditButton = styled.button`
  height: 40px;
  width: 170px;
  border-radius: 4px;
  background: #f45119;
  border-radius: 4px;
  color: #ffffff;
  font-weight: 700;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const SchoolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({isFlex}) => isFlex && 'flex: 1; margin-left:20px;'}
`;
const thematic = {
  container: {
    border: '1px #C2C2C2 solid',
    height: '44px',
    textAlignLast: 'left',
    marginTop: '4px',
    padding: '10px 20px 10px 12px',
    // marginLeft: '30px',
    display: 'inline-flex',
    alignItems: 'center',
    '-moz-appearance': 'textfield',
    position: 'relative',
  },
  suggestionsList: {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: '42px',
    width: '275px',
    fontWeight: '300',
    lineHeight: '26px',
    left: -1,
    padding: '10px 12px',
    border: '1px solid #aaa',
    flexDirection: 'column',
    backgroundColor: '#fff',
    fontSize: '16px',
    zIndex: '1',
  },
  suggestionHighlighted: {
    color: '#F45119',
    cursor: 'pointer',
  },
};

const Student = ({history}) => {
  const [isMod, setIsMod] = useState(true);
  const {login, user} = useContext(loginContext);
  const {
    name,
    phone,
    phone1,
    phone2,
    email,
    setEmail,
    highschool,
    setHighschool,
    setSchoolLocation,
    schools,
    setSchools,
    locations,
    year,
    setYear,
    setName,
    setPhone,
    setPhone1,
    setPhone2,
    privacy,
    setPrivacy,
    location,
    setLocation,
    grade,
    setGrade,
    submit,
  } = useForm();

  const BootstrapInput = withStyles(theme => ({
    root: {
      'label + &': {},
    },
    input: {
      width: '55px',
      height: '22px',
      position: 'relative',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid #C2C2C2',
      fontSize: 16,
      padding: '10px 0px 10px 12px',
      transition: theme.transitions.create('border-color'),
      fontFamily: ['NanumSquare', 'Malgun Gothic'].join(','),
      '&:focus': {
        borderColor: '#F45119',
      },
    },
  }))(InputBase);

  const FirstNumber = ({disabled}) => {
    return (
      <FormControl>
        <InputLabel htmlFor="demo-customized-select-native"></InputLabel>
        <NativeSelect
          id="demo-customized-select-native"
          value={phone}
          onChange={setPhone}
          input={<BootstrapInput />}
          disabled={disabled}
        >
          <option value="">선택</option>
          <option value="010">010</option>
        </NativeSelect>
      </FormControl>
    );
  };
  const onRemoveAccountClick = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    deleteUser(user)
      .then(() => {
        logout();
      })
      .catch(error => {
        // An error ocurred
        // ...
        console.log(error);
      });
  };

  console.log(location);

  return (
    <>
      <Container>
        <Title>회원 정보</Title>
        <SubTitle>이름</SubTitle>
        <NameBox
          type="text"
          value={name}
          placeholder="이름을 입력하세요"
          onChange={e => {
            setName(e);
          }}
          disabled={isMod}
        />
        {/* <NameBox type="text" value={name} placeholder="이름을 입력하세요" onBlur={setName} /> */}
        <SubTitle>핸드폰 번호</SubTitle>
        <InputWrapper>
          <FirstNumber disabled={isMod}></FirstNumber>
          <OtherNumber type="number" value={phone1} onChange={setPhone1} disabled={isMod} />
          <OtherNumber type="number" value={phone2} onChange={setPhone2} disabled={isMod} />
          <SendButton disabled={isMod}>인증 발송</SendButton>
        </InputWrapper>
        <InputWrapper>
          <SerialBox
            disabled={isMod}
            type="serialnumber"
            placeholder="인증 번호"
            // value={email}
            // onChange={setEmail}
          />
          <CheckButton disabled={isMod}>인증 확인</CheckButton>
        </InputWrapper>
        <SubTitle>이메일 주소</SubTitle>
        <EmailBox
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={setEmail}
          disabled={isMod}
        />
        <Box>
          <SchoolWrapper>
            <SchoolInfo>학년</SchoolInfo>
            <GradeBox value={grade} onChange={setGrade} disabled={isMod}>
              <option value="">학년 선택</option>
              <option value="H1">1학년</option>
              <option value="H2">2학년</option>
              <option value="H3">3학년</option>
              <option value="HN">N수생</option>
            </GradeBox>
          </SchoolWrapper>
          <SchoolWrapper isFlex>
            <SchoolInfo>졸업 예정 연도</SchoolInfo>
            <GraduateBox type="number" value={year} onChange={setYear} disabled={isMod} />
          </SchoolWrapper>
        </Box>

        <Box>
          <SchoolWrapper>
            <SchoolInfo>지역</SchoolInfo>
            <LocationBox
              name=""
              className="gradeBox1"
              onChange={setLocation}
              value={location}
              disabled={isMod}
            >
              <option value="">지역 선택</option>
              {locations.map(e => (
                <option value={e} key={e}>
                  {e}
                </option>
              ))}
            </LocationBox>
          </SchoolWrapper>
          <SchoolWrapper isFlex>
            <SchoolInfo>출신고교</SchoolInfo>
            <Search
              majors={schools}
              val={[highschool, setHighschool]}
              name="학교명"
              holder="학교를 입력하세요"
              theme={thematic}
              disabled={isMod}
            />
          </SchoolWrapper>
        </Box>
        <EditButtonWrapper>
          <EditButton
            onClick={() => {
              setIsMod(false);
            }}
          >
            수정하기
          </EditButton>
        </EditButtonWrapper>
      </Container>
    </>
  );
};

export default Student;
