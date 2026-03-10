import React from 'react';
import useForm from '../../comp/useform';
import Search from '../../comp/search';
import withDesktop from '../../comp/withdesktop';
import loginContext from '../../contexts/login';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {isEmpty} from '../../common/util';
import HighSchool from './Modal/HighSchool';

const Container = styled.div`
  width: 500px;
  height: 500px;
  border: 1px solid #c2c2c2;
  box-shadow: 2px 2px 12px 0px #00000024;
  padding: 30px;
`;

const ChildContainer = styled(Container)`
  max-height: 1000px;
  overflow: hidden;
  overflow-y: scroll;
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
  border: 1px #c2c2c2 solid;
`;
const EmailBox = styled.input`
  width: 100%;
  height: 44px;
  font-size: 16px;
  text-align: left;
  padding-left: 10px;
  margin-top: 4px;
  margin-bottom: 15px;
  border: 1px #c2c2c2 solid;
`;
const OtherNumber = styled.input`
  width: 115px;
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

const AddChildBtn = styled.div`
  margin: 35px 0;
  width: 100%;
  height: 50px;
  font-size: 1.5rem;
  border-top: 1px #dbdbdb solid;
  color: #9d9d9d;
  padding-top: 20px;

  > button {
    color: inherit;
    > span:first-child {
      font-size: 1.8em;
    }
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  padding: 20px 0;
  width: 100%;
`;
const CancelButton = styled.button`
  flex: 0.4;
  margin-right: 10px;
  border: 1px solid #f45119;
  padding: 20px 0;
  border-radius: 3px;

  > span {
    font-weight: bold;
    color: #f45119;
  }
`;
const SubmitButton = styled.button`
  flex: 0.6;
  background-color: ${({active}) => (active ? '#f45119' : '#d9d9d9')};
  border-radius: 3px;
  > span {
    font-weight: bold;
    color: ${({active}) => (active ? '#ffffff' : '#9A9A9A')};
  }
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

const Line = styled.div`
  width: 100%;
  height: 2px;
  background-color: #f45119;
  margin: 30px 0;
`;

const PrivacyWrapper = styled.div`
  width: 100%;
`;

const PrivacyContent = styled.div`
  border: 1px solid #9d9d9d;
  background-color: #f5f5f5;
  padding: 30px;
`;

const PrivacyTitle = styled.h2`
  margin-bottom: 30px;
`;

const PrivayDesc = styled.span`
  font-size: 0.9rem;
`;

const RadioForm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 25px;
`;

const Radio = styled.div`
  display: flex;
  alignitems: center;
  ${({isMargin}) => isMargin && 'margin-right: 30px;'}

  > input {
    width: 18px;
    height: 18px;
  }

  > label {
    padding-left: 5px;
  }
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

const Login = ({history}) => {
  const {login, user} = React.useContext(loginContext);

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
    children,
    grade,
    setGrade,
    addChild,
    setChildName,
    setChildYear,
    setChildGrade,
    setChildSchool,
    setChildRegion,
    submit,
    sms_check,
    auth_number,
    setAuthNumber,
  } = useForm();


  const [highSchoolData, setHighSchoolData] = React.useState('');
  const [highSchoolOpen, setHighSchoolOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');



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

  const isValid =
    !isEmpty(phone) && !isEmpty(phone1) && !isEmpty(phone2) && !isEmpty(email) && !isEmpty(privacy);

  return (
    <>
      <style jsx>
        {`
          * {
            margin: 0px;
            padding: 0px;
          }

          li {
            list-style: none;
          }

          a {
            text-decoration: none;
          }

          .wrap {
            width: 400px;
            min-height: 100vh;
            padding: 20px 0;
          }
          .content {
            width: 500px;
            margin: auto;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 0;
          }
          .title {
            width: 100%;
            height: 140px;
            border-bottom: 2px #f45119 solid;
            margin-bottom: 30px;
          }
          .title h1 {
            text-align: left;
            color: #f45119;
            font-size: 30px;
            font-weight: bold;
          }
          .name {
            margin-top: 24px;
          }

          .nameBox {
            width: 620px;
            height: 60px;
            background-color: #e8e8e8;
            font-size: 18px;
            text-align: left;
            padding-left: 10px;
            margin-top: 10px;
          }
          .phone {
            margin-top: 24px;
          }
          .phone .selectBox {
            margin-top: 10px;
          }
          .phone p {
            font-size: 18px;
            width: 100%;
          }
          .phone select {
            border: 1px #707070 solid;
            width: 130px;
            height: 60px;
            text-align-last: left;
          }
          .secondNumber {
            width: 130px;
            height: 60px;
            border: 1px #707070 solid;
            margin-left: 20px;
          }
          .thirdNumber {
            width: 130px;
            height: 60px;
            border: 1px #707070 solid;
            margin-left: 20px;
          }
          .phoneS {
            margin-top: 24px;
          }
          .phoneS .selectBoxS {
            margin-top: 10px;
          }
          .phoneS p {
            font-size: 18px;
          }
          .phoneS p:nth-of-type(1) {
            float: left;
            width: 50%;
          }
          .phoneS select {
            border: 1px #707070 solid;
            width: 130px;
            height: 60px;
            text-align-last: left;
            margin-left: 10px;
          }
          .secondNumberS {
            width: 130px;
            height: 60px;
            border: 1px #707070 solid;
            margin-left: 10px;
          }
          .secondNumberS {
            width: 130px;
            height: 60px;
            border: 1px #707070 solid;
            margin-left: 10px;
          }
          .thirdNumberS {
            width: 130px;
            height: 60px;
            border: 1px #707070 solid;
            margin-left: 10px;
          }
          .studentName {
            width: 166px;
            height: 60px;
            border: 1px #707070 solid;
          }
          input[type='number']::-webkit-outer-spin-button,
          input[type='number']::-webkit-inner-spin-button {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          input[type='number'] {
            -moz-appearance: textfield;
          }
          input[type='button'] {
            width: 158px;
            height: 60px;
            border: 1px #707070 solid;
            background-color: #e8e8e8;
            margin-left: 20px;
            color: #9d9d9d;
          }
          .serialNumber {
            width: 100%;
            margin-top: 24px;
          }

          .serial {
            width: 437.4px;
            height: 60px;
            border: 1px #707070 solid;
            font-size: 18px;
            text-align: left;
            padding-left: 10px;
            margin-top: 10px;
          }
          .email {
            margin-top: 24px;
            font-size: 18px;
          }
          .emailBox {
            width: 620px;
            height: 60px;
            background-color: #e8e8e8;
            font-size: 18px;
            text-align: left;
            padding-left: 10px;
            margin-top: 10px;
          }
          .grade {
            margin-top: 24px;
            font-size: 18px;
          }
          .grade p:nth-of-type(1) {
            width: 30%;
            float: left;
          }
          .gradeBox1 {
            border: 1px #707070 solid;
            width: 166px;
            height: 60px;
            text-align-last: left;
            margin-top: 10px;
          }
          .gradeBox2 {
            border: 1px #707070 solid;
            width: 430px;
            height: 60px;
            text-align-last: left;
            margin-top: 10px;
            margin-left: 18.4px;
          }
          .line {
            margin-top: 40px;
            border-bottom: 1px #de6b3d solid;
          }
          .turm {
            height: 427px;
          }
          .turm p:nth-of-type(1) {
            font-size: 18px;
            margin-top: 24px;
          }
          .turm .box {
            width: 620px;
            height: 116px;
            border: 1px #9d9d9d solid;
            background-color: #f5f5f5;
          }
          .turm .box p:nth-of-type(1) {
            margin-top: 10px;
            margin-left: 10px;
            font-size: 15px;
          }
          .radio {
            margin-top: 40px;
            display: flex;
            width: 50%;
            margin-left: 10px;
          }
          .radio .radioButton:nth-child(n + 2) {
            margin-left: 60px;
          }
          .radio small {
            font-size: 15px;
            line-height: 13px;
          }
          input[type='submit'] {
            margin-top: 30px;
            width: 270px;
            height: 70px;
            border: 1px #de6b3d solid;
            font-size: 24px;
            font-weight: bold;
            margin-left: 20px;
            color: #de6b3d;
          }
          input[type='reset'] {
            margin-top: 30px;
            width: 270px;
            height: 70px;
            border: 1px #707070 solid;
            background-color: #9d9d9d;
            font-size: 24px;
            font-weight: bold;
            margin-left: 20px;
            color: white;
          }
          .plusButton {
            margin-top: 24px;
            width: 519px;
            height: 124px;
            font-size: 28px;
            border-top: 1px #dbdbdb solid;
            line-height: 124px;
            color: #9d9d9d;
          }
        `}
      </style>
      <div className="content">
        <div className="title">
          <h1>거북스쿨 학부모회원 기본 정보</h1>
        </div>
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
          />
          {/* <NameBox type="text" value={name} placeholder="이름을 입력하세요" onBlur={setName} /> */}
          <SubTitle>핸드폰 번호</SubTitle>
          <InputWrapper>
            <FirstNumber></FirstNumber>
            <OtherNumber type="text" value={phone1} onChange={setPhone1} maxLength={4} />
            <OtherNumber type="text" value={phone2} onChange={setPhone2} maxLength={4} />
            {/* <SendButton onClick={(e) => sms_check('sms_check', false)}>인증 발송</SendButton> */}
          </InputWrapper>
          {/* <InputWrapper>
            <SerialBox
              type="text"
              placeholder="인증 번호"
              maxLength={6} 
              value={auth_number}
              onChange={setAuthNumber}
            />
            <CheckButton onClick={(e) => sms_check('sms_final_check', false)}>인증 확인</CheckButton>
          </InputWrapper> */}
          <SubTitle>이메일 주소</SubTitle>
          <EmailBox
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={setEmail}
          />
        </Container>
        <Line></Line>
        <ChildContainer>
          <Title>자녀 정보</Title>
          {children.map((c, i) => {
            return (
              <>
                {i !== 0 && (
                  <div style={{height: '2px', backgroundColor: '#9D9D9D', margin: '30px 0'}}></div>
                )}
                <SubTitle>자녀 이름</SubTitle>
                <NameBox
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={c.name}
                  onChange={e => setChildName(e, i)}
                />
                <Box>
                  <SchoolWrapper>
                    <SchoolInfo>학년</SchoolInfo>
                    <GradeBox value={c.grade} onChange={e => setChildGrade(e, i)}>
                      <option value="">학년 선택</option>
                      <option value="1">1학년</option>
                      <option value="2">2학년</option>
                      <option value="3">3학년</option>
                      <option value="4">N수생</option>
                    </GradeBox>
                  </SchoolWrapper>
                  <SchoolWrapper isFlex>
                    <SchoolInfo>졸업 예정 연도</SchoolInfo>
                    <GraduateBox type="number" value={c.year} onChange={e => setChildYear(e, i)} />
                  </SchoolWrapper>
                </Box>
            
          {/* <Box>
            <SchoolWrapper>
              <SchoolInfo>지역</SchoolInfo>
              <LocationBox name="" className="gradeBox1" onChange={setLocation} value={location}>
                <option value="">지역 선택</option>
                {locations.map(e => (
                  <option value={e} key={e}>
                    {e}
                  </option>
                ))}
              </LocationBox>
            </SchoolWrapper>
            <SchoolWrapper isFlex>

              <SchoolInfo>학교명</SchoolInfo>

              <HighSchool
                key={highSchoolOpen}
                location={location}
                highSchoolData={highSchoolData}
                setHighSchoolData={setHighSchoolData}
                highSchoolOpen={highSchoolOpen}
                setHighSchoolOpen={setHighSchoolOpen}
                searchText={searchText}
                setSearchText={setSearchText}

              />

            </SchoolWrapper>
          </Box> */}
              </>
            );
          })}
          <AddChildBtn onClick={addChild}>
            <button>
              <span>+</span>
              <span>자녀 추가하기</span>
            </button>
          </AddChildBtn>
        </ChildContainer>

        <Line></Line>
        <PrivacyWrapper>
          <PrivacyContent>
            <PrivacyTitle>개인정보 유효기간</PrivacyTitle>
            <PrivayDesc>
              설정하신 기간 동안 로그인 등 이용이 없는 경우 휴면계정으로 전환됩니다.{' '}
            </PrivayDesc>
            <RadioForm>
              <Radio isMargin>

                <input
                  type="radio"
                  name="agree"
                  id="radio_1"
                  value={1}
                  onClick={setPrivacy}
                  checked={privacy == 1}
                />
                <label htmlFor="radio_1">1년</label>
              </Radio>
              <Radio isMargin>
                <input
                  type="radio"
                  name="agree"
                  id="radio_2"
                  value={5}
                  onClick={setPrivacy}
                  checked={privacy == 5}
                />
                <label htmlFor="radio_2">5년</label>
              </Radio>
              <Radio>
                <input
                  type="radio"
                  name="agree"
                  id="radio_3"
                  value={10}
                  onClick={setPrivacy}
                  checked={privacy == 10}
                />
                <label htmlFor="radio_3">10년</label>
              </Radio>
            </RadioForm>
          </PrivacyContent>
        </PrivacyWrapper>
        <ButtonWrapper>
          <CancelButton>
            <span>취소</span>
          </CancelButton>
          <SubmitButton
            active={true}
            onClick={() => {
           
                submit('20');
             
            }}
          >
            <span>완료</span>
          </SubmitButton>
        </ButtonWrapper>
      </div>
    </>
  );
};

const Mobile = ({history}) => {
  const {login, user} = React.useContext(loginContext);

  const {
    name,
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
    privacy,
    setPrivacy,
    location,
    setLocation,
    children,
    addChild,
    setChildName,
    phoneFull,
    setPhoneFull,
    setChildYear,
    setChildGrade,
    setChildSchool,
    setChildRegion,
    submit,
  } = useForm();
  const thematic = {
    container: {
      border: '1px #707070 solid',
      width: '430px',
      height: '60px',
      textAlignLast: 'left',
      marginTop: '16px',
      marginLeft: '18.4px',
      display: 'inline-flex',
      alignItems: 'center',
      '-moz-appearance': 'textfield',
      position: 'relative',
    },
    suggestionsList: {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'column',
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      backgroundColor: 'white',
      maxHeight: '300px',
      overflow: 'scroll',
      zIndex: 1,
      width: '300px',
      left: 0,
      top: '60px',
    },
    suggestionHighlighted: {
      color: '#fede01',
      cursor: 'pointer',
    },
  };

  const thisyear = new Date().getFullYear();
  const years = Array(11)
    .fill(0)
    .map((e, i) => thisyear + i - 5);

  return (
    <>
      <style jsx>
        {`
          .title2 {
            width: 352px;
            margin: 10px auto;
            font-size: 24px;
            font-weight: bold;
          }
          header {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            margin: 30px;
          }

          /*이름 넣는곳*/
          .name {
            width: 352px;
            height: 98px;
            margin: 30px auto;
            font-size: 14px;
          }
          .name #text {
            margin-top: 8px;
            width: 352px;
            height: 56px;
            border-radius: 8px;
            border: 1px #000000 solid;
          }

          /*전화번호 입력*/
          .phoneNum {
            width: 352px;
            height: 87px;
            font-size: 14px;
            margin: auto;
          }
          .phoneNum .flex {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
          }
          .phoneNum .flex #text {
            width: 244px;
            height: 56px;
            border-radius: 8px;
            border: 1px #000000 solid;
          }
          .phoneNum .flex button {
            width: 100px;
            height: 56px;
            border-radius: 8px;
            border: 1px #de6b3d solid;
          }
          /*인증번호 입력 란*/
          .codes {
            width: 352px;
            height: 88px;
            font-size: 14px;
            margin: 20px auto;
          }
          .codes .flex {
            margin-top: 8px;
            display: flex;
            justify-content: space-between;
          }
          .codes .flex #text {
            width: 244px;
            height: 56px;
            border-radius: 8px;
            border: 1px #000000 solid;
          }
          .codes .flex button {
            width: 100px;
            height: 56px;
            border-radius: 8px;
            border: 1px #de6b3d solid;
          }

          /*이메일 주소*/
          .email {
            width: 352px;
            height: 88px;
            font-size: 14px;
            margin: 20px auto;
          }
          .email #text {
            margin-top: 8px;
            width: 352px;
            height: 56px;
            border: 1px #000000 solid;
            border-radius: 8px;
          }
          /*area*/
          .school {
            width: 352px;
            height: 87px;
            font-size: 14px;
            margin: auto;
          }
          .school .title1 {
            display: flex;
            justify-content: left;
          }
          .school .title1 p {
            width: 35%;
          }
          .school .select {
            display: flex;
            justify-content: space-between;
          }

          .school .select #age {
            width: 115px;
            height: 56px;
            border: 1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
          }
          .school .select #year {
            width: 229px;
            height: 56px;
            border: 1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
          }
          /*지역 section*/
          .area {
            width: 352px;
            height: 87px;
            font-size: 14px;
            margin: auto;
          }
          .area .title1 {
            display: flex;
            justify-content: left;
          }
          .area .title1 p {
            width: 35%;
          }
          .area .select {
            display: flex;
            justify-content: space-between;
          }

          .area .select #area {
            width: 115px;
            height: 56px;
            border: 1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
          }
          .area .select #high {
            width: 229px;
            height: 56px;
            border: 1px #000000 solid;
            border-radius: 8px;
            text-align-last: center;
          }
          .agree {
            width: 352px;
            height: 135px;
            font-size: 14px;
            margin: 10px auto;
          }
          .agree .border {
            width: 352px;
            height: 96px;
            border: 1px #9d9d9d solid;
            border-radius: 8px;
            font-size: 12px;
            background-color: #f5f5f5;
          }
          .agree .border ul {
            margin-top: 10px;
            margin-left: 10px;
          }
          .agree .border .radio {
            line-height: 66px;
            margin-left: 14px;
            font-size: 16px;
          }
          .line hr {
            width: 352px;
            background-color: #de6b3d;
            height: 2px;
            margin: auto;
          }
          .plusButton {
            height: 72px;
            width: 352px;
            line-height: 72px;
            margin: auto;
          }

          .plusButton button {
            width: 352px;
            height: 40px;
            line-height: 40px;
            border-radius: 10px;
            color: #de6b3d;
            border: 1px #de6b3d solid;
            font-size: 16px;
          }
          .join {
            height: 95px;
            width: 352px;

            margin: auto;
          }
          .join button {
            background-color: #707070;
            width: 352px;
            height: 48px;
            line-height: 46px;
            text-align: center;
            color: white;
            border-radius: 24px;
          }
        `}
      </style>
      <header className="header header2">학부모 회원가입</header>
      <section className="name">
        <p>이름</p>
        <input type="text" name="" id="text" value={name} onChange={setName} />
      </section>
      <section className="phoneNum">
        <p>휴대폰 번호</p>
        <div className="flex">
          <input
            type="text"
            name=""
            id="text"
            placeholder="'-'구분없이 입력"
            value={phoneFull}
            onChange={setPhoneFull}
          />
        </div>
      </section>

      <section className="email">
        <p>이메일 주소</p>
        <input
          type="text"
          name=""
          id="text"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={setEmail}
        />
      </section>
      <div className="line">
        {' '}
        <hr />
      </div>
      <section className="title2">
        <p>자녀정보</p>
      </section>
      {children.map((c, i) => (
        <>
          <section className="name">
            <p>자녀이름</p>
            <input
              type="text"
              name=""
              id="text"
              value={c.name}
              onChange={e => setChildName(e, i)}
            />
          </section>
          <section className="school">
            <div className="title1">
              <p>학년</p>
              <p>졸업 예정 연도</p>
            </div>
            <div className="select">
              <select name="" id="age" value={c.grade} onChange={e => setChildGrade(e, i)}>
                <option value="">학년 선택</option>
                <option value="1">1학년</option>
                <option value="2">2학년</option>
                <option value="3">3학년</option>
                <option value="4">N수생</option>
              </select>

              <select name="" id="year" value={c.year} onChange={e => setChildYear(e, i)}>
                <option value="">년도 선택</option>
                {years.map(e => (
                  <option value={e}>{e}</option>
                ))}
              </select>
            </div>
          </section>
          {/* <section className="area">
            <div className="title1">
              <p>지역</p>
              <p>출신고교</p>
            </div>
            <div className="select">
              <select name="" id="area" onChange={e => setChildRegion(e, i)} value={c.region}>
                <option value="">지역 선택</option>
                {locations.map(e => (
                  <option value={e}>{e}</option>
                ))}
              </select>

              <input name="" id="high" value={c.highschool} onChange={e => setChildSchool(e, i)} />
            </div>
          </section> */}
        </>
      ))}
      <div className="line">
        {' '}
        <hr />
      </div>
      <div className="plusButton" onClick={addChild}>
        <button>+ 자녀추가하기</button>
      </div>
      <div className="line">
        {' '}
        <hr />
      </div>
      <section className="agree">
        <p>개인정보 유효기간</p>
        <div className="border">
          <ul>
            <li>설정하신 기간 동안 로그인 등 이용이 없는 경우 휴면계정</li>
            <li>으로 전환됩니다.</li>
          </ul>
          <span className="radio">
            <span>
              <input
                type="radio"
                name="agree"
                id=""
                value={1}
                onClick={setPrivacy}
                checked={privacy == 1}
              />
              1년
            </span>
            <span>
              <input
                type="radio"
                name="agree"
                id=""
                value={5}
                onClick={setPrivacy}
                checked={privacy == 5}
              />
              5년
            </span>
            <span>
              <input
                type="radio"
                name="agree"
                id=""
                value={10}
                onClick={setPrivacy}
                checked={privacy == 10}
              />
              10년
            </span>
          </span>
        </div>
      </section>
      <section className="join" onClick={() => submit('20', true)}>
        <button>회원가입 완료</button>
      </section>
    </>
  );
};

export default withDesktop(Login, Mobile);
