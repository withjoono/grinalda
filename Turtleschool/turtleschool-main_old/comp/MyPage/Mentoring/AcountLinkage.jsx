import axios from 'axios';
import React, {useState} from 'react';
import {useCallback} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  margin-top: 40px;
`;

const Desc = styled.div`
  display: flex;
  flex-direction: column;
  height: 368px;
  border-radius: 2px;
  border: 1px solid #9a9a9a;
  box-shadow: 2px 2px 12px 0px #00000024;
  background: #f4f4f4;
  flex: 1;
  padding: 30px;
`;
const Content = styled.div`
  height: 240px;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: -0.03em;
  padding-left: 10px;
  overflow:hidden;
  overflow-y;scroll;
  > p {
    margin-bottom: 5px;
  }
`;
const Title = styled.h2`
  height: 32px;
  font-family: NanumSquareOTF;
  font-weight: 800;
  text-align: left;
  margin-bottom: 20px;
  font-size: 1.65em;
`;
const Function = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-left: 25px;
`;
const Creation = styled.div`
  height: 224px;
  border-radius: 2px;
  border: 1px solid #9a9a9a;
  box-shadow: 2px 2px 12px 0px #00000024;
  margin-bottom: 20px;
  padding: 30px;
`;
const Link = styled.div`
  height: 412px;
  border-radius: 2px;
  border: 1px solid #9a9a9a;
  box-shadow: 2px 2px 12px 0px #00000024;
  padding: 30px;
`;
const LinkCodeButton = styled.button`
  font-weight: bold;
  border: 1.5px solid #f45119;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #f45119;
  height: 35px;
  width: 120px;
  padding: 5px 0;
  &:hover {
    background-color: #f45119;
    color: #ffffff;
  }
`;

const AccountAddBtn = styled(LinkCodeButton)`
  background-color: #f45119;
  color: #ffffff;
  &:hover {
  }
`;

const CodeInputWrapper = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 50px;
  border: 1px solid #c1c1c1;
  padding: 0 20px;
  background-color: #f1f1f1;
`;

const CopyButton = styled.button`
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #18b2f2;
`;

const GenerateCodeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GenerateCodeText = styled.span`
  margin-right: 10px;
  font-size: 0.8rem;
`;
const GenerateCodeDescText = styled(GenerateCodeText)`
  color: #a1a1a1;
`;

const AccountLinkage = () => {
  const [linkCode, setLinkCode] = useState('');

  const handleLinkCodeChange = useCallback(e => {
    const {value} = e.target;
    setLinkCode(value);
  }, []);

  const handleLinkCodeCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(linkCode);
    } catch (err) {
      console.log(err);
    }
  }, [linkCode]);

  const requestGetLinkCode = async () => {
    const {data: res} = await axios.get('/api/linkage', {
      headers: {auth: localStorage.getItem('uid')},
    });

    console.log(res);
    // if (!res.data.success) {
    //   alert('로그인 하거나 개인정보 수정해주세요');
    //   return;
    // }

    // setLinkCode(res.data.data.code);
    // setExpire(res.data.data.time);
  };

  return (
    <Container>
      <Desc>
        <Title>멘토, 멘티 연결 이용 방법</Title>
        <Content>
          <p>1. 멘토가 관리를 원하는 멘티(학생)에게 연계코드를 생성해서 보냅니다.</p>
          <p>
            2. 코드를 받은 멘티(학생)는 거북스쿨에 접속해서, 타 계정 연계란에 받은 코드를
            입력합니다.
          </p>
          <p>3. 멘토의 경우, 관리자페이지에, 코드 연계한 멘티들의 계정 리스트가 보여집니다. </p>
          <p>
            4. 계정 연계한 멘티 역시 관리자 페이지에, 본인 계정에 접속 가능한, 멘토 계정리스트가
            보여집니다.
          </p>
          <p>
            5. 멘토는 언제든 멘티계정으로 접속해서, 멘티의 학습계획 성취정도, 수업계획, 모의 성적,
            내신 성적 등을 체크하고 관리할 수 있습니다.
          </p>
        </Content>
      </Desc>
      <Function>
        <Creation>
          <Title>연계 코드 생성</Title>
          <CodeInputWrapper>
            <StyledInput
              // onChange={handleLinkCodeChange}
              placeholder={'연계 코드 생성'}
            ></StyledInput>
            <CopyButton onClick={handleLinkCodeCopy}>복사</CopyButton>
          </CodeInputWrapper>
          <GenerateCodeWrapper>
            <LinkCodeButton onClick={requestGetLinkCode}>버튼누르기</LinkCodeButton>
            <div>
              <GenerateCodeDescText>제한시간</GenerateCodeDescText>
              <GenerateCodeText>03:00</GenerateCodeText>
            </div>
          </GenerateCodeWrapper>
        </Creation>
        <Link>
          <Title>타 계정 연계</Title>
          <div>
            <StyledInput placeholder={'코드를 입력해 주세요'}></StyledInput>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
              <LinkCodeButton>코드 조회하기</LinkCodeButton>
            </div>
            <div
              style={{height: '1px', width: '100%', backgroundColor: '#a3a3a3', margin: '30px 0'}}
            ></div>
            <h3>코드 학생 정보</h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '120px',
                  fontSize: '0.75rem',
                  border: '1px solid #c1c1c1',
                  padding: '15px 10px',
                  backgroundColor: '#f1f1f1',
                }}
              >
                <span style={{color: '#808080'}}>이름</span>
                <span style={{fontWeight: 'bold'}}>홍길동</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '120px',
                  fontSize: '0.75rem',
                  border: '1px solid #c1c1c1',
                  padding: '15px 10px',
                  backgroundColor: '#f1f1f1',
                }}
              >
                <span style={{color: '#808080'}}>학년</span>
                <span style={{fontWeight: 'bold'}}>1학년</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '120px',
                  fontSize: '0.75rem',
                  border: '1px solid #c1c1c1',
                  padding: '15px 10px',
                  backgroundColor: '#f1f1f1',
                }}
              >
                <span style={{color: '#808080'}}>학교</span>
                <span style={{fontWeight: 'bold'}}>반포고등학교</span>
              </div>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <AccountAddBtn>계정 등록하기</AccountAddBtn>
          </div>
        </Link>
      </Function>
    </Container>
  );
};

export default AccountLinkage;
