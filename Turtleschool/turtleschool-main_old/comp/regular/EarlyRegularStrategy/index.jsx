import FuzzyMatchingTd from '../../../src/components/atoms/td/fuzzyMatchingTd';
import * as S from './index.style';
import {FormControl, InputLabel, MenuItem, Select} from '@material-ui/core';
import styled from 'styled-components';
import {useEarlyRegularStrategy} from './useEarlyRegualrStrategy';
import {getOccasionalUnivList} from '../../../src/api/csat';
import {useEffect} from 'react';
import {useState} from 'react';
import {isMobile} from 'react-device-detect';
import Advice from '../../../comp/Advice';
import {usePayment} from '../../../src/api/query';
const StyledFormControl = styled(FormControl)`
  width: 80%;
`;

const StyledSelect = styled(Select)`
  border: 1px solid #e77536;
  color: #9a9a9a;
  border-radius: 0.15rem;
  font-size: 0.6rem;
  display: flex;
  margin: auto;
`;

const EarlyRegularStrategy = () => {
  const {
    recruitContentList,
    recruitTypeList,
    selectedUnivOccasional,
    occasionalUnivList,
    univList,
    majorList,
    isReset,
    occasionalUnivCalculateScoreList,
    onSelectUniv,
    onSelectRecruitContents,
    onSelectRecruitType,
    onSelectMajor,
    delOcassionalUniv,
    onClickSaveOccasionalUniv,
  } = useEarlyRegularStrategy();
  const [selectedUniv, setSelectedUniv] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('uid');

    if (id && selectedUniv.name !== '') {
      getOccasionalUnivListFetch(selectedUniv.name);
    }
  }, [selectedUniv]);

  const getOccasionalUnivListFetch = async (univName, recContents = null) => {
    const params = {
      univ_nm: univName,
      recruit_contents: recContents,
    };

    const {data} = await getOccasionalUnivList(params);
  };
  const {data: payData, isLoading} = usePayment();
  return (
    <>
      <S.Container>
        <S.RegularContainer>
          <S.ContentTitle>수시 지원 대학 입력</S.ContentTitle>
          <S.MoblieOverflowContainer
            isMobile={isMobile}
            style={{overflow: isMobile ? 'scroll' : 'visible'}}
          >
            <S.RegularTable>
              <tbody>
                <tr>
                  <S.RegularTH>수시대학명</S.RegularTH>
                  <S.RegularTH>학종/교과/논술</S.RegularTH>
                  <S.RegularTH>전형명</S.RegularTH>
                  <S.RegularTH>모집단위</S.RegularTH>
                </tr>
                <tr></tr>
                <tr>
                  <FuzzyMatchingTd
                    items={univList}
                    label="대학명"
                    // onSelectItem={item => console.error(item)}
                    onSelectItem={onSelectUniv}
                    isReset={isReset}
                  />
                  <S.RegularTD>
                    <StyledFormControl>
                      <StyledSelect
                        style={{border: '1px solid red', fontSize: '.6rem'}}
                        fullWidth
                        value={selectedUnivOccasional.recruit_contents}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={onSelectRecruitContents}
                      >
                        {recruitContentList.length === 0 ? (
                          <MenuItem disabled>대학을 선택해주세요.</MenuItem>
                        ) : (
                          recruitContentList.map(recruitContent => {
                            return <MenuItem value={recruitContent}>{recruitContent}</MenuItem>;
                          })
                        )}
                      </StyledSelect>
                    </StyledFormControl>
                  </S.RegularTD>
                  <S.RegularTD>
                    <StyledFormControl>
                      <StyledSelect
                        style={{border: '1px solid red', fontSize: '.6rem'}}
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedUnivOccasional.recruit_type}
                        onChange={onSelectRecruitType}
                      >
                        {recruitTypeList.length === 0 ? (
                          <MenuItem disabled>학종/교과/논술을 선택해주세요.</MenuItem>
                        ) : (
                          recruitTypeList.map(recruitType => {
                            return <MenuItem value={recruitType}>{recruitType}</MenuItem>;
                          })
                        )}
                      </StyledSelect>
                    </StyledFormControl>
                  </S.RegularTD>
                  <FuzzyMatchingTd
                    onSelectItem={onSelectMajor}
                    label="모집단위"
                    items={majorList.map(({major_nm}) => {
                      return major_nm;
                    })}
                    searchType="recruitment"
                    isReset={isReset}
                  />
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
              </tbody>
            </S.RegularTable>
          </S.MoblieOverflowContainer>
          <S.ResultConditionButton onClick={onClickSaveOccasionalUniv}>
            학교 저장하기
          </S.ResultConditionButton>
          <S.HorizontalLine />
          <span>* 수시 지원 대학 정시 예측컷 서비스는 수능직후부터 11월말까지만 제공됩니다.</span>
        </S.RegularContainer>
        <S.RegularContainer style={{opacity: 0.3}}>
          <S.ContentTitle>수시 지원 대학</S.ContentTitle>
          <S.MoblieOverflowContainer
            isMobile={isMobile}
            style={{overflow: isMobile ? 'scroll' : 'visible'}}
          >
            <S.RegularTable>
              <tbody>
                <tr>
                  <S.RegularTH>번호</S.RegularTH>
                  <S.RegularTH>수시대학명</S.RegularTH>
                  <S.RegularTH>학종/교과/논술</S.RegularTH>
                  <S.RegularTH>전형명</S.RegularTH>
                  <S.RegularTH>모집단위</S.RegularTH>
                  <S.RegularTH>비고</S.RegularTH>
                </tr>
                {occasionalUnivList.map((univ, index) => {
                  return (
                    <tr>
                      <S.RegularTD>{index + 1}</S.RegularTD>
                      <S.RegularTD>{univ.univ_nm}</S.RegularTD>
                      <S.RegularTD>{univ.recruit_contents}</S.RegularTD>
                      <S.RegularTD>{univ.recruit_type}</S.RegularTD>
                      <S.RegularTD>{univ.major_nm}</S.RegularTD>
                      <S.RegularTD>
                        <S.DelBtn onClick={() => delOcassionalUniv(univ.occasional_id)}>
                          삭제
                        </S.DelBtn>
                      </S.RegularTD>
                    </tr>
                  );
                })}
              </tbody>
            </S.RegularTable>
          </S.MoblieOverflowContainer>
          <S.HorizontalLine />
        </S.RegularContainer>

        <S.GpaContainer style={{opacity: 0.3}}>
          <S.ContentTitle>수시대학 정시 예측컷</S.ContentTitle>
          <S.MoblieOverflowContainer
            isMobile={isMobile}
            style={{overflow: isMobile ? 'scroll' : 'visible'}}
          >
            <S.RegularTable>
              <tbody>
                <tr>
                  <S.RegularTH rowSpan={4}>수시지원대학</S.RegularTH>
                  <S.RegularTH>대학명</S.RegularTH>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTH>{univ.univ_nm}</S.RegularTH>;
                  })}
                  {[...new Array(6 - occasionalUnivCalculateScoreList.length)].map(() => {
                    return <S.RegularTH>대학</S.RegularTH>;
                  })}
                </tr>
                <tr>
                  <S.RegularTD dark>학종/교과/논술</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.recruit_contents}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTD dark>전형명</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.recruit_type}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTD dark>모집단위</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.major_nm}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTH rowSpan={2}>수시대학의 정시 내 점수</S.RegularTH>
                  <S.RegularTD dark>대학별 점수</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    console.log('unviCheck', univ);
                    return <S.RegularTD>{univ.ontime_myscore} 점</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTD dark>누적백분위</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.ontime_myscore_percent}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTH rowSpan={2}>수시대학의 정시 작년 컷</S.RegularTH>
                  <S.RegularTD dark>최종합격자 70%컷</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.ontime_last_cut}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTD dark>70%컷 누적 백분위</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.ontime_last_cut_percent}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTH rowSpan={2}>차이</S.RegularTH>
                  <S.RegularTD dark>대학별 점수</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.ontime_myscore_diff}</S.RegularTD>;
                  })}
                </tr>
                <tr>
                  <S.RegularTD dark>누적 백분위</S.RegularTD>
                  {occasionalUnivCalculateScoreList.map(univ => {
                    return <S.RegularTD>{univ.ontime_myscore_percent_diff}</S.RegularTD>;
                  })}
                </tr>
                {payData?.data?.data?.length < 1 && (
                  <>
                    <tr>
                      <S.RegularTH rowSpan={4}>수시대학의 정시 작년컷</S.RegularTH>
                      <S.RegularTD dark>85%컷 점수</S.RegularTD>
                      <S.RegularTD colSpan={6} rowSpan={6}>
                        <p style={{color: '#f45119'}}>
                          해당 내역은 정시합격예측 이용권 구매후 컨설팅에서 확인하실 수 있습니다.
                        </p>
                      </S.RegularTD>
                    </tr>
                    <tr>
                      <S.RegularTD dark>85%컷 누백</S.RegularTD>
                    </tr>
                    <tr>
                      <S.RegularTD dark>95%컷 점수</S.RegularTD>
                    </tr>
                    <tr>
                      <S.RegularTD dark>95%컷 누백</S.RegularTD>
                    </tr>
                    <tr>
                      <S.RegularTD dark colSpan={2}>
                        해당 대학 유불리
                      </S.RegularTD>
                    </tr>
                    <tr>
                      <S.RegularTD dark colSpan={2}>
                        세부내역
                      </S.RegularTD>
                    </tr>
                  </>
                )}
              </tbody>
            </S.RegularTable>
            <Advice>
              '수시 대학 정시 작년컷'과 '차이'가 빈칸으로 나오는 경우는, 지원한 수시 대학의 학과가
              정시로는 뽑지 않아서 직접적인 비교가 불가한 경우입니다.
              <br /> 유사학과로 검색하시려면, 유료서비스를 이용하세요
            </Advice>
          </S.MoblieOverflowContainer>
        </S.GpaContainer>
      </S.Container>
      {/* <style jsx></style> */}
    </>
  );
};

export default EarlyRegularStrategy;
