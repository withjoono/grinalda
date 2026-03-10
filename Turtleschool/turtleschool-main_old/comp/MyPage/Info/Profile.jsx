import React, {useState, useContext, useCallback} from 'react';
import Search from '../../search';
import useForm from '../../useform';
import loginContext from '../../../contexts/login';
import styled from 'styled-components';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import SchoolComponent from './School';

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
  font-size: 16px;
  text-align: left;
  padding-left: 10px;
  margin-top: 4px;
  margin-bottom: 15px;
  border: 1px #c2c2c2 solid;
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
`;

const Line = styled.div`
  border-bottom: 2px #f45119 solid;
  margin: 20px 0;
`;

const Children = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  max-height: 300px;
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

const Profile = ({type, relationCode}) => {
  const [isMod, setIsMod] = useState(true);
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
    children,
    setGrade,
    setChildSchool,
    setChildName,
    setChildGrade,
    setChildYear,
    setChildRegion,
    submit,
    addChild,
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

  const handleModSubmit = useCallback(() => {
    if (isMod) {
      setIsMod(false);
    } else {
      setIsMod(true);
      submit(relationCode);
    }
  }, [isMod, relationCode]);

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
          <SendButton disabled={isMod} style={{visibility: 'hidden'}}>
            인증 발송
          </SendButton>
        </InputWrapper>
        {/* <InputWrapper>
          <SerialBox
            disabled={isMod}
            type="serialnumber"
            placeholder="인증 번호"
            // value={email}
            // onChange={setEmail}
          />
          <CheckButton disabled={isMod}>인증 확인</CheckButton>
        </InputWrapper> */}
        <SubTitle>이메일 주소</SubTitle>
        <EmailBox
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={setEmail}
          disabled={isMod}
        />

        {type === 'student' && (
          <SchoolComponent
            isMod={isMod}
            grade={grade}
            setGrade={setGrade}
            year={year}
            setYear={setYear}
            location={location}
            setLocation={setLocation}
            locations={locations}
            schools={schools}
            highschool={highschool}
            setHighschool={setHighschool}
          ></SchoolComponent>
        )}

        {type === 'parent' && (
          <>
            <Line></Line>
            <Title>자녀 정보</Title>
            <Children>
              {children?.map((child, i) => (
                <>
                  {i !== 0 && (
                    <div
                      style={{height: '2px', backgroundColor: '#9D9D9D', margin: '30px 0'}}
                    ></div>
                  )}
                  <SubTitle>이름</SubTitle>
                  <NameBox
                    type="text"
                    value={child.name}
                    placeholder="이름을 입력하세요"
                    disabled={isMod}
                    onChange={e => setChildName(e, i)}
                  />
                  <SchoolComponent
                    childIdx={i}
                    isMod={isMod}
                    grade={child.grade}
                    setGrade={e => setChildGrade(e, i)}
                    year={child.year}
                    setYear={e => setChildYear(e, i)}
                    location={child.region}
                    setLocation={e => setChildRegion(e, i)}
                    locations={locations}
                    schools={schools}
                    highschool={child.highschool}
                    setHighschool={setChildSchool}
                  ></SchoolComponent>
                </>
              ))}
              <AddChildBtn
                onClick={() => {
                  addChild();
                  setIsMod(false);
                }}
              >
                <button>
                  <span>+</span>
                  <span>자녀 추가하기</span>
                </button>
              </AddChildBtn>
            </Children>
          </>
        )}
        <EditButtonWrapper>
          <EditButton onClick={handleModSubmit}>{isMod ? '수정하기' : '저장'}</EditButton>
        </EditButtonWrapper>
      </Container>
    </>
  );
};

export default Profile;
