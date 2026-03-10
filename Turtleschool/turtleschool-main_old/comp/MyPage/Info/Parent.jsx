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
  width: 100%;
  height: 26px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
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
  margin-left: 7px;
  font-weight: 700;
  min-width: 100px;
`;
const Line = styled.div`
  border-bottom: 2px #f45119 solid;
  margin: 20px 0;
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
const Parent = ({history}) => {
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
    children,
    addChild,
    setChildName,
    setChildYear,
    setChildGrade,
    setChildSchool,
    setChildRegion,
    submit,
  } = useForm();

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

  const useStyles = makeStyles(theme => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

  const FirstNumber = ({disabled}) => {
    const classes = useStyles();
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

  return (
    <>
      <Container>
        <Title>회원 정보</Title>
        <SubTitle>이름</SubTitle>
        <NameBox
          type="text"
          value={name}
          placeholder="이름을 입력하세요"
          onChange={setName}
          disabled={isMod}
        />
        <SubTitle>핸드폰 번호</SubTitle>
        <InputWrapper>
          <FirstNumber disabled={isMod}></FirstNumber>
          <OtherNumber type="number" value={phone1} onChange={setPhone1} disabled={isMod} />
          <OtherNumber type="number" value={phone2} onChange={setPhone2} disabled={isMod} />
          <SendButton disabled={isMod}>인증 발송</SendButton>
        </InputWrapper>
        <InputWrapper>
          <SerialBox
            type="serialnumber"
            placeholder="인증 번호"
            disabled={isMod}
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
        <Line></Line>
        <Title>자녀 정보</Title>
        <div style={{overflow: 'hidden', overflowY: 'scroll', maxHeight: '300px'}}>
          {[
            {
              college: '',
              email: 'wnj5516@gmail.com',
              grade: 'H2',
              highschool: '송곡여자고등학교',
              region: '서울특별시',
              locations: [
                '서울특별시',
                '경기도',
                '인천광역시',
                '세종특별자치시',
                '대전광역시',
                '대구광역시',
                '충청북도',
                '충청남도',
                '강원도',
                '광주광역시',
                '전라북도',
                '전라남도',
                '부산광역시',
                '울산광역시',
                '경상북도',
                '경상남도',
                '제주특별자치도',
                '재외한국학교교육청',
              ],
              year: '2023',
              major: '',
              name: '김주호',
              phone: '010',
              phone1: '3777',
              phone2: '1356',
              phoneFull: '01037771356',
              privacy: '1',
              relationCode: '10',
            },
            {
              college: '',
              email: 'wnj5516@gmail.com',
              grade: 'H2',
              highschool: '송곡여자고등학교',
              region: '서울특별시',
              locations: [
                '서울특별시',
                '경기도',
                '인천광역시',
                '세종특별자치시',
                '대전광역시',
                '대구광역시',
                '충청북도',
                '충청남도',
                '강원도',
                '광주광역시',
                '전라북도',
                '전라남도',
                '부산광역시',
                '울산광역시',
                '경상북도',
                '경상남도',
                '제주특별자치도',
                '재외한국학교교육청',
              ],
              year: '2023',
              major: '',
              name: '김주호',
              phone: '010',
              phone1: '3777',
              phone2: '1356',
              phoneFull: '01037771356',
              privacy: '1',
              relationCode: '10',
            },
          ].map((child, i) => (
            <>
              <SubTitle>이름</SubTitle>
              <NameBox
                type="text"
                value={child.name}
                placeholder="이름을 입력하세요"
                disabled={isMod}
                onChange={e => setChildName(e, i)}
              />
              <Box>
                <SchoolWrapper>
                  <SchoolInfo>학년</SchoolInfo>
                  <GradeBox
                    onChange={e => setChildGrade(e, i)}
                    value={child.grade}
                    disabled={isMod}
                  >
                    <option value="">학년 선택</option>
                    <option value="H1">1학년</option>
                    <option value="H2">2학년</option>
                    <option value="H3">3학년</option>
                    <option value="HN">N수생</option>
                  </GradeBox>
                </SchoolWrapper>
                <SchoolWrapper isFlex>
                  <SchoolInfo>졸업 예정 연도</SchoolInfo>
                  <GraduateBox
                    type="number"
                    value={child.year}
                    onChange={e => setChildYear(e, i)}
                    disabled={isMod}
                  />
                </SchoolWrapper>
              </Box>

              <Box>
                <SchoolWrapper>
                  <SchoolInfo>지역</SchoolInfo>
                  <LocationBox
                    name=""
                    className="gradeBox1"
                    onChange={e => setChildRegion(e, i)}
                    value={child.region}
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
                    val={[highschool, setChildSchool]}
                    name="학교명"
                    holder="학교를 입력하세요"
                    theme={thematic}
                  />
                </SchoolWrapper>
              </Box>
            </>
          ))}
        </div>
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

export default Parent;
