import React, { useState } from 'react';

import * as S from './index.style';
import Advice from '../../../Advice';
import axios from 'axios';

const CheckPriority = ({ type, selectedUniv }) => {

    return (
        <S.Container>
            <Advice style={{ marginBottom: 36 }}>
                <b>*유불리지수란</b> '본인의 대학별점수'와 '같은 표점 지원자들의 동대학 평균점수'와의 차이를 보여주는 수치이며, 해당 대학으로의 유불리를 알 수 있는 척도입니다.
                <br /> <br /> <b>*1000점 환산 유불리지수란</b> 대학별 유불리지수를 알더라도, 각 대학별 점수의 총점이 다르기 때문에, 어떤 대학이 얼마나 유리한지 비교를 할 수 없다는 점을 보완하기 위해서, 대학별 유불리지수를 1000점만점으로 통일함으로써, 대학간 유불리 지수를 보다 수월하게 파악할 수 있도록 만든 지수입니다.
            </Advice>
            <ListTable title='적정 or 안정' univs={Object.values(selectedUniv).filter((major) => major.risk_yn === 'H')} />
            <ListTable title='소신' univs={Object.values(selectedUniv).filter((major) => major.risk_yn === '0')} />
            <ListTable title='위험 or 불합' univs={Object.values(selectedUniv).filter((major) => major.risk_yn === 'L')} />
        </S.Container>
    );
};

const ListTable = ({ title, univs }) => {
    const [checkAll, setCheckAll] = useState(false);
    const [selectedUniv, setSelectedUniv] = useState([]);

    const _postSaveCollegeInterest = (univ, univs) => {
        console.log(univ, univs)
        axios
            .post(
                '/api/csat/savecollegeInterest',
                {
                    data: univs
                        ? univs
                        : {
                              universityid: univ.universityid,
                              department: univ.major_cd,
                              year: 2022,
                          },
                },
                {
                    headers: {
                        auth: localStorage.getItem('uid'),
                    },
                }
            )
            .then((res) => {
                console.log('savecollegeInterest: ', res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const _postDeleteCollegeInterest = (univ, univs) => {
        axios
            .post(
                '/api/csat/deletecollegeinterest',
                {
                    data: univs
                        ? univs
                        : {
                              universityid: univ.universityid,
                              department: univ.major_cd,
                              year: 2022,
                          },
                },
                {
                    headers: {
                        auth: localStorage.getItem('uid'),
                    },
                }
            )
            .then((res) => {
                console.log('deletecollegeInterest', res);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const onSeeDetailClick = (data) => {
        window.open(process.env.NEXT_PUBLIC_HOME_URL + '/regular/detail?data=' +  JSON.stringify(data), '_blank')
    }

    const onCheckClick = ({ target }, univ) => {
        if (target.checked) {
            setSelectedUniv((prev) => [...prev, target.id]);
            _postSaveCollegeInterest(univ);
        } else {
            setSelectedUniv((prev) => {
                const index = prev.indexOf(target.id);
                if (index > -1) {
                    prev.splice(index, 1);
                    return [...prev];
                }
            });
            _postDeleteCollegeInterest(univ);
        }
    };

    const onCheckAllClick = ({ target }, univs) => {
        setCheckAll(target.checked);

        const data = univs.map((univ) => ({
            universityid: univ.universityid,
            department: univ.major_cd,
            year: 2022,
        }));

        if (target.checked) {
            setSelectedUniv(univs.map(univ => `${univ.name}-${univ.major_nm}`))
            _postSaveCollegeInterest('', data);
        } else {
            setSelectedUniv([])
            _postDeleteCollegeInterest('', data);
        }
    };

    return (
        <S.ListContainer>
            <S.ListHeaderContainer>
                <S.ContentTitle>{title}</S.ContentTitle>
                <S.SelectAllContainer>
                    <S.CheckBoxInput id={`selectAll-${title}`} type='checkbox' onClick={(e) => onCheckAllClick(e, univs)} />
                    <label htmlFor={`selectAll-${title}`} />
                    <S.SelectAllTitle>{'학과 전체선택'}</S.SelectAllTitle>
                </S.SelectAllContainer>
            </S.ListHeaderContainer>
            <S.MoblieOverflowContainer>
                <S.ListTable>
                    <tr>
                        <S.ListTH>{'유불리 순위'}</S.ListTH>
                        <S.ListTH>{'대학명'}</S.ListTH>
                        <S.ListTH>{'학과명'}</S.ListTH>
                        <S.ListTH>{'내 점수'}</S.ListTH>
                        <S.ListTH>{'최초합 예측점'}</S.ListTH>
                        <S.ListTH>{'차이'}</S.ListTH>
                        <S.ListTH>{'유불리 지수'}</S.ListTH>
                        <S.ListTH>{'1000점 환산 유불리 지수'}</S.ListTH>
                        <S.ListTH>{'상세보기'}</S.ListTH>
                        <S.ListTH>{'관심대학 저장'}</S.ListTH>
                    </tr>
                    {univs.map((univ, index) => (
                        <tr key={univ.major_cd}>
                            <S.ListTD>{index + 1 || '-'}</S.ListTD>
                            <S.ListTD>{univ.name || '-'}</S.ListTD>
                            <S.ListTD>{univ.major_nm || '-'}</S.ListTD>
                            <S.ListTD>{univ.basic_score || '-'}</S.ListTD>
                            <S.ListTD>{univ.expected_score || '-'}</S.ListTD>
                            <S.ListTD>{univ.expected_score_diff || '-'}</S.ListTD>
                            <S.ListTD>{univ.new_score || '-'}</S.ListTD>
                            <S.ListTD>{univ.u_t_jisu || '-'}</S.ListTD>
                            <S.ListTD>
                                <S.SeeDetailButton onClick={() => onSeeDetailClick(univ)}>{'상세보기'}</S.SeeDetailButton>
                            </S.ListTD>
                            <S.ListTD>
                                <S.CheckBoxInput checked={selectedUniv.includes(`${univ.name}-${univ.major_nm}`)} id={`${univ.name}-${univ.major_nm}`} type='checkbox' onClick={(e) => onCheckClick(e, univ)} />
                                <label htmlFor={`${univ.name}-${univ.major_nm}`} />
                            </S.ListTD>
                        </tr>
                    ))}
                </S.ListTable>
            </S.MoblieOverflowContainer>
        </S.ListContainer>
    );
};

export default CheckPriority;
