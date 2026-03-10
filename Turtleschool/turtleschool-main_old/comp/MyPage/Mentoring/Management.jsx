import Link from 'next/link';
import {useRouter} from 'next/router';
import React, {useState, useMemo, useCallback, useContext} from 'react';
import styled from 'styled-components';
import loginContext from '../../../contexts/login';
import Student from './Student';

const Wrapper = styled.div`
  flex: 1;
  padding: 20px;
`;
const ButtonContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  padding-bottom: 20px;
  overflow: auto;
  overflow-x: scroll;
  max-width: 930px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 2px solid #c2c2c2;
  padding: 20px;
`;

const HeaderItem = styled.div`
  display: flex;
  flex: ${({flexValue}) => flexValue};
  font-size: 14px;
  > span {
    font-weight: bold;
    margin-left: 10px;
  }
`;

const ContentContainer = styled.div`
  padding: 10px 0;
  border-bottom: 1px solid #c2c2c2;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 60px;
  text-align: left;
  padding: 0 20px;
  &:hover {
    background: #fefbf4;
    outline: 1px solid #e77536;
    border-radius: 8px;
  }
`;

const ContentItem = styled(HeaderItem)`
  justify-content: space-between;
  align-items: center;
  flex: ${({flexValue}) => flexValue};
  font-size: 16px;
  height: 70px;
`;
const ManageButton = styled.button`
  height: 28px;
  width: 138px;
  border-radius: 100px;
  background-color: #f45119;
  color: #ffffff;
  text-align: center;
  font-weight: 700;
  border: none;
  cursor: pointer;
  font-size: 12px;
`;
const ClassBox = styled.button`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 9px 30px;
  gap: 10px;
  width: 90px;
  height: 44px;
  background: ${props => (props.active ? 'var(--button-hover-bg-color, #025ce2)' : '#aab0ba')};
  border-radius: 40px;
  font-weight: 800;
  color: #ffffff;
  font-size: 18px;
  line-height: 26px;
  align-items: center;
  text-align: center;
  border: none;
  margin-right: 10px;

  &:disabled {
    cursor: default;
    opacity: 0.5;
    background: #025ce2;
  }
  &:hover,
  &:focus {
    background: var(--button-hover-bg-color, #025ce2);
  }

  > span {
    width: 50px;
  }
`;

const selectRelationType = code => {
  switch (code) {
    case '10':
    case '30':
      return 'student';
    case '20':
      return 'parent';
    case '40':
    case '50':
    case '70':
      return 'teacher';
    default:
      return null;
  }
};
// grade 01 => 관리자 , 02 => 학생
const Management = ({relationCode}) => {
  const router = useRouter();

  const type = selectRelationType(relationCode);
  const [selectedClass, setSelectedClass] = useState('A반');
  const tempClass = ['A반', 'B반', 'C반', 'D반'];
  const tempStudent = [
    {name: '이수진', school: '반포고등학교', class: 'A반'},
    {name: '이수진', school: '반포고등학교', class: 'A반'},
    {name: '이수정', school: '반포고등학교', class: 'B반'},
    {name: '이수가', school: '반포고등학교', class: 'B반'},
    {name: '이수부', school: '반포고등학교', class: 'C반'},
    {name: '이수차', school: '반포고등학교', class: 'D반'},
    {name: '이수미', school: '반포고등학교', class: 'D반'},
  ];

  const handleClassChange = useCallback(value => {
    setSelectedClass(value);
  }, []);

  const filteredStudents = useMemo(
    () => tempStudent.filter(v => selectedClass === v.class),
    [selectedClass],
  );

  if (!type) {
    return <div></div>;
  }

  return (
    <Wrapper>
      {type === 'teacher' && (
        <ButtonContainer>
          {tempClass.map((v, idx) => {
            return (
              <ClassBox
                key={v}
                active={v === selectedClass}
                isMarginRight={idx !== 0}
                onClick={() => {
                  handleClassChange(v);
                }}
              >
                <span>{v}</span>
              </ClassBox>
            );
          })}
        </ButtonContainer>
      )}
      <Header>
        <HeaderItem flexValue={0.3}>
          <span>이름</span>
        </HeaderItem>
        <HeaderItem flexValue={0.7}>
          <span>학교</span>
        </HeaderItem>
      </Header>
      {filteredStudents.length ? (
        filteredStudents.map((v, idx) => (
          <ContentContainer key={`${idx}_temp`}>
            <Content>
              <ContentItem flexValue={0.3}>
                <span>{v.name}</span>
              </ContentItem>
              <ContentItem flexValue={0.7}>
                <span>{v.school}</span>

                <ManageButton
                  onClick={() => {
                    router.push({
                      pathname: '/setting/myPage/mentoring/admin/' + 1,
                      query: {name: '이수진', school: '송곡여자고등학교'},
                    });
                  }}
                >
                  학생 관리하기
                </ManageButton>
              </ContentItem>
            </Content>
          </ContentContainer>
        ))
      ) : (
        <div></div>
      )}
    </Wrapper>
  );
};
export default Management;
