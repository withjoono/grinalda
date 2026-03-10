import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel } from '@material-ui/core';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';

import * as S from './index.style';
import Button from '../../Button';
import axios from 'axios';

const MockApply = () => {
    const [page, setPage] = useState('input');

    const onNavClick = ({ target }) => {
        setPage(target.id);
    };

    return (
        <S.Container>
            {/* <S.NavContainer style={{ marginBottom: 32 }}>
                <S.NavButton id="input" disabled={true} active={page === 'input'} onClick={onNavClick}>
                    {'모의지원 입력'}
                </S.NavButton>
                <S.NavButton id="result" disabled={true} active={page === 'result'} onClick={onNavClick}>
                    {'모의지원 결과'}
                </S.NavButton>
            </S.NavContainer> */}
            {page === 'input' && <MockInput />}
            {page === 'result' && <MockResult />}
        </S.Container>
    );
};

const MockInput = () => {
    const [page, setPage] = useState('myUniv');

    const onNavClick = ({ target }) => {
        console.log(target);
        setPage(target.id);
    };

    return (
        <S.Container>
            <S.Content>
                {/* <S.ContentTitle>{'모의지원 입력'}</S.ContentTitle> */}
                {/* <MockInputResult /> */}
                <hr style={{ height: 1, marginTop: 36, border: 'none', backgroundColor: '#9A9A9A' }} />
            </S.Content>
            <S.Content>
                <S.ContentTitle>{'모의지원 입력 방법 선택'}</S.ContentTitle>
                <S.NavContainer>
                    <S.NavButton id="myUniv" disabled={true} active={page === 'myUniv'} onClick={onNavClick}>
                        {'관심대학에서 직접 선택'}
                    </S.NavButton>
                    <S.NavButton id="search" disabled={true} active={page === 'search'}>
                        {'직접 검색'}
                    </S.NavButton>
                </S.NavContainer>
            </S.Content>
            {/* {page === 'search' && <Search />} */}
            {page === 'myUniv' && <MyUnivs />}
        </S.Container>
    );
};

const MockInputResult = () => {
    const [selectedType, setSelectedType] = useState('가');
    const [result, setResult] = useState();

    const onNavClick = ({ target }) => {
        setSelectedType(target.id);
    };

    return (
        <>
            <UserAgent mobile>
                <S.NavContainer style={{ marginBottom: 16 }}>
                    <S.NavButton id="가" active={selectedType === '가'} onClick={onNavClick}>
                        {'가'}
                    </S.NavButton>
                    <S.NavButton id="나" active={selectedType === '나'} onClick={onNavClick}>
                        {'나'}
                    </S.NavButton>
                    <S.NavButton id="다" active={selectedType === '다'} onClick={onNavClick}>
                        {'다'}
                    </S.NavButton>
                </S.NavContainer>
            </UserAgent>
            <S.ContentTable>
                <colgroup>
                    <UserAgent computer>
                        <col width="200px" />
                    </UserAgent>
                    <UserAgent mobile>
                        <col width="120px" />
                    </UserAgent>
                </colgroup>
                <thead>
                    <UserAgent computer>
                        <tr>
                            <S.TH>{'구분'}</S.TH>
                            <S.TH>{'가'}</S.TH>
                            <S.TH>{'나'}</S.TH>
                            <S.TH>{'다'}</S.TH>
                        </tr>
                    </UserAgent>
                    <UserAgent mobile>
                        <S.TH>{'구분'}</S.TH>
                        <S.TH>{selectedType}</S.TH>
                    </UserAgent>
                </thead>
                <tbody>
                    <tr>
                        <S.TH>{'대학'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <S.TH>{'학과'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <S.TH>{'2021 70% 컷'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <S.TH>{'내 점수'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <S.TH>{'2022 최초합예측선'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <S.TH>{'차이'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <S.TH>{'진단'}</S.TH>
                        <UserAgent computer>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TD>{'-'}</S.TD>
                        </UserAgent>
                    </tr>
                    <tr>
                        <UserAgent computer>
                            <S.TH>{'모의지원 결과 바로가기'}</S.TH>
                            <S.TD>
                                <S.GoToResultButton>{'모의지원 결과 바로가기'}</S.GoToResultButton>
                            </S.TD>
                            <S.TD>
                                <S.GoToResultButton>{'모의지원 결과 바로가기'}</S.GoToResultButton>
                            </S.TD>
                            <S.TD>
                                <S.GoToResultButton>{'모의지원 결과 바로가기'}</S.GoToResultButton>
                            </S.TD>
                        </UserAgent>
                        <UserAgent mobile>
                            <S.TH>{'모의지원 결과 바로가기'}</S.TH>
                            <S.TD>
                                <S.GoToResultButton>{'모의지원 결과 바로가기'}</S.GoToResultButton>
                            </S.TD>
                        </UserAgent>
                    </tr>
                </tbody>
            </S.ContentTable>
        </>
    );
};

const MockResult = () => {
    return <S.Container></S.Container>;
};

const Search = () => {
    const [applyType, setApplyType] = useState('');

    const onApplyTypeChange = ({ target }) => {
        // setApplyType(target.value);
    };

    const renderEmptyIndicator = () => (
        <S.EmptyContainer>
            <S.EmptyTitle>{'군 선택 후 대학과 학과명을 검색하세요'}</S.EmptyTitle>
            <S.EmptyDescription>
                {'군과 대학, 학과명을 입력하면 입력에 대한 유사학과가 보여집니다. 유사학과 중에서 모의지원으로 선택할 수 있습니다.'}
            </S.EmptyDescription>
        </S.EmptyContainer>
    );

    return (
        <>
            <S.SearchContainer>
                <S.OutlineFormControl variant="outlined">
                    <InputLabel id="demo-simple-select-outlined-label">{'군 선택'}</InputLabel>
                    <Select
                        disabled={true}
                        label="군 선택"
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={applyType}
                        onChange={onApplyTypeChange}
                        inputProps={{ 'aria-label': 'Without label' }}
                    >
                        {['', '가', '나', '다'].map((applyType, index) => (
                            <MenuItem disabled={!index} key={applyType} value={applyType}>
                                {applyType}
                            </MenuItem>
                        ))}
                    </Select>
                </S.OutlineFormControl>
                <S.SearchInputForm>
                    <S.SearchInputContainer>
                        <S.SearchInputLabel>{'대학명'}</S.SearchInputLabel>
                        <S.SearchInputDivider />
                        <S.SearchInput disabled={true} placeholder="대학명을 입력해주세요" />
                    </S.SearchInputContainer>
                    <S.SearchInputContainer>
                        <S.SearchInputLabel>{'학과명'}</S.SearchInputLabel>
                        <S.SearchInputDivider />
                        <S.SearchInput disabled={true} placeholder="학과명을 입력해주세요" />
                    </S.SearchInputContainer>
                </S.SearchInputForm>
                <Button>{'검색하기'}</Button>
            </S.SearchContainer>
            <S.Content>
                <S.ContentTitle>{'입력 검색 결과'}</S.ContentTitle>
                {renderEmptyIndicator()}
            </S.Content>
        </>
    );
};

const MyUnivs = () => {
    const [applyType, setApplyType] = useState('가');
    const [hData, setHData] = useState([]); //안정 데이터 테이블
    const [oData, setOData] = useState([]); //소신 데이터 테이블
    const [lData, setLData] = useState([]); //위험
    const onNavClick = ({ target }) => {
        setApplyType(target.id);
    };
    useEffect(async () => {
        const params = {
            division: '1',
            year: '2022',
            collegeinterest: 'Y',
            recruitment: applyType,
        };

        await axios
            .post('/api/csat/selectanalysis_6', null, {
                headers: { auth: localStorage.getItem('uid') },
                params,
            })
            .then((res) => {
                console.log(res.data.data);
                let table = res.data.data;
                if (res.data.data) {
                    table.map((item, index) => {
                        switch (item.risk_yn) {
                            case 'H':
                                setHData([...hData, item]);
                                break;
                            case 'O':
                                setOData([...oData, { ...item }]);
                                break;
                            case 'L':
                                console.log(item.risk_yn, index);
                                setLData((i) => [...i, item]);
                                break;
                            default:
                                break;
                        }
                    });
                } else {
                    setHData([]);
                    setOData([]);
                    setLData([]);
                }
            })
            .catch((e) => {
                console.dir(e);
            });
    }, [applyType]);
    // const renderEmptyIndicator = (title) => <S.EmptyIndicator>{`${title}에 해당하는 관심대학이 없습니다.`}</S.EmptyIndicator>;

    const renderUnivItem = (univ, index) =>
        index === 0 ? (
            <>
                <tr>
                    <S.TH rowSpan={3}>{index + 1}</S.TH>

                    <S.TD rowSpan={3}>{univ.name}</S.TD>
                    <S.TD rowSpan={3}>{univ.major_nm}</S.TD>
                    <S.TD>{univ.recruits}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{univ.rv_acceptrank}</S.TD>
                    <S.TD>{univ.rv_acceptrank}</S.TD>
                    {/* <S.TD>
                <S.CheckBoxInput id={`${univ}-${index}`} type="checkbox" />
                <label htmlFor={`${univ}-${index}`} />
            </S.TD> */}
                </tr>
                <tr>
                    {/* <S.TH>{index + 1}</S.TH> */}

                    <S.TH>내 점수</S.TH>
                    <S.TH>최초합 예측점</S.TH>
                    <S.TH>최초합과의 차이</S.TH>
                    <S.TH>추합 예측점</S.TH>
                    <S.TH>추합과의 차이</S.TH>
                    <S.TH>유불리지수</S.TH>
                    <S.TH>1000점 환산 유불리지수</S.TH>
                </tr>
                <tr>
                    {/* <S.TH>{index + 1}</S.TH> */}

                    <S.TD>{univ.basic_score}</S.TD>
                    <S.TD>{univ.last70cuts_score}</S.TD>
                    <S.TD>{univ.expected_score_diff}</S.TD>
                    <S.TD>{univ.add70cuts_score}</S.TD>
                    <S.TD>{univ.add_expected_score_diff}</S.TD>
                    <S.TD>{univ.new_score}</S.TD>
                    <S.TD>{univ.u_t_jisu}</S.TD>
                </tr>
            </>
        ) : (
            <>
                <tr>
                    <S.TH rowSpan={4}>{index + 1}</S.TH>
                    <S.TH>대학명</S.TH>
                    <S.TH>학과명</S.TH>
                    <S.TH>모집인원</S.TH>
                    <S.TH>지원자수</S.TH>
                    <S.TH>내 순위</S.TH>
                    <S.TH>예측지원자수</S.TH>
                    <S.TH>예측내 순위</S.TH>
                    <S.TH>최초합 학격 순위</S.TH>
                    <S.TH>추합 학격 순위(예상)</S.TH>
                    {/* <S.TD>
             <S.CheckBoxInput id={`${univ}-${index}`} type="checkbox" />
             <label htmlFor={`${univ}-${index}`} />
            </S.TD> */}
                </tr>
                <tr>
                    <S.TD rowSpan={3}>{univ.name}</S.TD>
                    <S.TD rowSpan={3}>{univ.major_nm}</S.TD>
                    <S.TD>{univ.recruits}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{'-'}</S.TD>
                    <S.TD>{univ.rv_acceptrank}</S.TD>
                    <S.TD>{univ.rv_acceptrank}</S.TD>
                </tr>
                <tr>
                    {/* <S.TH>{index + 1}</S.TH> */}

                    <S.TH>내 점수</S.TH>
                    <S.TH>최초합 예측점</S.TH>
                    <S.TH>최초합과의 차이</S.TH>
                    <S.TH>추합 예측점</S.TH>
                    <S.TH>추합과의 차이</S.TH>
                    <S.TH>유불리지수</S.TH>
                    <S.TH>1000점 환산 유불리지수</S.TH>
                </tr>
                <tr>
                    {/* <S.TH>{index + 1}</S.TH> */}

                    <S.TD>{univ.basic_score}</S.TD>
                    <S.TD>{univ.last70cuts_score}</S.TD>
                    <S.TD>{univ.expected_score_diff}</S.TD>
                    <S.TD>{univ.add70cuts_score}</S.TD>
                    <S.TD>{univ.add_expected_score_diff}</S.TD>
                    <S.TD>{univ.new_score}</S.TD>
                    <S.TD>{univ.u_t_jisu}</S.TD>
                </tr>
            </>
        );

    return (
        <>
            <S.Content>
                <S.ContentTitle>{'관심대학'}</S.ContentTitle>
                <S.NavContainer>
                    <S.NavButton id="가" active={applyType === '가'} onClick={onNavClick}>
                        {'가'}
                    </S.NavButton>
                    <S.NavButton id="나" active={applyType === '나'} onClick={onNavClick}>
                        {'나'}
                    </S.NavButton>
                    <S.NavButton id="다" active={applyType === '다'} onClick={onNavClick}>
                        {'다'}
                    </S.NavButton>
                </S.NavContainer>
            </S.Content>
            <S.Content>
                <S.ContentTitle>{'안정/적정'}</S.ContentTitle>
                {hData && hData.length ? (
                    <S.OverflowContainer>
                        <S.ContentTable scroll={true}>
                            <colgroup>
                                <col width="50px" />
                                <col width="92px" />
                                <col width="113px" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <S.TH>{'유불리 순위'}</S.TH>
                                    <S.TH>{'대학명'}</S.TH>
                                    <S.TH>{'학과명'}</S.TH>
                                    <S.TH>{'모집인원'}</S.TH>
                                    <S.TH>{'지원자수'}</S.TH>
                                    <S.TH>{'내 순위'}</S.TH>
                                    <S.TH>{'예측지원자수'}</S.TH>
                                    <S.TH>{'예측내 순위'}</S.TH>
                                    <S.TH>{'추합 합격 순위'}</S.TH>
                                    <S.TH>{'추합 합격 순위 (예상)'}</S.TH>
                                    {/* <S.TH>{'모의지원 선택'}</S.TH> */}
                                </tr>
                            </thead>
                            <tbody>
                                {hData.map((item, index) => {
                                    return renderUnivItem(item, index);
                                })}
                            </tbody>
                        </S.ContentTable>
                    </S.OverflowContainer>
                ) : (
                    <S.PlaceholderBox>안정/정적에 해당하는 관심대학이 없습니다.</S.PlaceholderBox>
                )}
            </S.Content>
            <S.Content>
                <S.ContentTitle>{'소신(최초합 기준)'}</S.ContentTitle>
                {oData && oData.length ? (
                    <S.OverflowContainer>
                        <S.ContentTable scroll={true}>
                            <colgroup>
                                <col width="50px" />
                                <col width="92px" />
                                <col width="113px" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <S.TH>{'유불리 순위'}</S.TH>
                                    <S.TH>{'대학명'}</S.TH>
                                    <S.TH>{'학과명'}</S.TH>
                                    <S.TH>{'모집인원'}</S.TH>
                                    <S.TH>{'지원자수'}</S.TH>
                                    <S.TH>{'내 순위'}</S.TH>
                                    <S.TH>{'예측지원자수'}</S.TH>
                                    <S.TH>{'예측내 순위'}</S.TH>
                                    <S.TH>{'추합 합격 순위'}</S.TH>
                                    <S.TH>{'추합 합격 순위 (예상)'}</S.TH>
                                    {/* <S.TH>{'모의지원 선택'}</S.TH> */}
                                </tr>
                            </thead>
                            <tbody>
                                {oData.map((item, index) => {
                                    return renderUnivItem(item, index);
                                })}
                            </tbody>
                        </S.ContentTable>
                    </S.OverflowContainer>
                ) : (
                    <S.PlaceholderBox>소신(최초합 기준)에 해당하는 관심대학이 없습니다.</S.PlaceholderBox>
                )}
            </S.Content>
            <S.Content>
                <S.ContentTitle>{'위험'}</S.ContentTitle>
                {lData && lData.length ? (
                    <S.OverflowContainer>
                        <S.ContentTable scroll={true}>
                            <colgroup>
                                <col width="50px" />
                                <col width="92px" />
                                <col width="113px" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                                <col width="auto" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <S.TH>{'유불리 순위'}</S.TH>
                                    <S.TH>{'대학명'}</S.TH>
                                    <S.TH>{'학과명'}</S.TH>
                                    <S.TH>{'모집인원'}</S.TH>
                                    <S.TH>{'지원자수'}</S.TH>
                                    <S.TH>{'내 순위'}</S.TH>
                                    <S.TH>{'예측지원자수'}</S.TH>
                                    <S.TH>{'예측내 순위'}</S.TH>
                                    <S.TH>{'추합 합격 순위'}</S.TH>
                                    <S.TH>{'추합 합격 순위 (예상)'}</S.TH>
                                    {/* <S.TH>{'모의지원 선택'}</S.TH> */}
                                </tr>
                            </thead>
                            <tbody>
                                {lData.map((item, index) => {
                                    console.log(item);
                                    return renderUnivItem(item, index);
                                })}
                            </tbody>
                        </S.ContentTable>
                    </S.OverflowContainer>
                ) : (
                    <S.PlaceholderBox>위험/불합(추합 기준)에 해당하는 관심대학이 없습니다.</S.PlaceholderBox>
                )}
            </S.Content>
        </>
    );
};

export default MockApply;
