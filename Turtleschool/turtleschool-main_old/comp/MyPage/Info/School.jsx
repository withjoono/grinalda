import React from 'react';
import styled from 'styled-components';
import Search from '../../search';

const SchoolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({isFlex}) => isFlex && 'flex: 1; margin-left:20px;'}
`;

const SchoolInfo = styled.span`
  height: 26px;
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  margin-top: 15px;
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

const SchoolComponent = ({
  childIdx,
  isMod,
  grade,
  setGrade,
  year,
  setYear,
  location,
  setLocation,
  locations,
  schools,
  highschool,
  setHighschool,
}) => {
  return (
    <>
      <Box>
        <SchoolWrapper>
          <SchoolInfo>학년</SchoolInfo>
          <GradeBox value={grade} onChange={setGrade} disabled={isMod}>
            <option value="">학년 선택</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
            <option value="4">N수생</option>
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
            childIdx={childIdx}
            val={[highschool, setHighschool]}
            name="학교명"
            holder="학교를 입력하세요"
            theme={thematic}
            disabled={isMod}
          />
        </SchoolWrapper>
      </Box>
    </>
  );
};

export default SchoolComponent;
