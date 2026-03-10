import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from 'axios';

import Component from '../../comp/regular/Detail';

const Detail = () => {
    const router = useRouter();
    const [univ, setUniv] = useState({});

    useEffect(() => {
        console.log('query', router.query);
        if (router?.query?.data) {
            setUniv(JSON.parse(router.query.data));
        }
    }, [router]);

    const _postSaveCollegeInterest = () => {
        axios.post(
            '/api/csat/savecollegeInterest',
            {
                data: univ
                    ? univ
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
        ).then(res => {
            console.log('_postSaveCollegeInterest: ', res);
            alert('관심대학에 저장했습니다.')
        }).catch(e => {
            console.log(e)
        });
    };

    return (
        <Container>
            <Header>
                <HeaderImage src='/assets/header/logo@3x.png' />
                <HeaderTitle>{'분석 레포트'}</HeaderTitle>
            </Header>
            <Component />
            <Footer>
                <FooterButton onClick={() => window.close()}>{'창닫기'}</FooterButton>
                <FooterButtonFilled onClick={_postSaveCollegeInterest}>
                    {'관심대학 저장하기'}
                    <SquareCheckBox />
                </FooterButtonFilled>
            </Footer>
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    height: 100%;
    padding-bottom: 108px;
`;

const Header = styled.div`
    width: 100%;
    height: 54px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px 100px;
    border: 1px solid #c86f4c;
    box-sizing: border-box;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
`;

const HeaderImage = styled.img`
    height: 100%;
`;

const HeaderTitle = styled.div`
    font-weight: bold;
    font-size: 12px;
    line-height: 18px;
    color: #c86f4c;
`;

const Footer = styled.div`
    width: 100%;
    padding: 0px 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const FooterButton = styled.div`
    background: #ffffff;
    border: 1px solid #3d94de;
    box-sizing: border-box;
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 30%;
    padding: 24px 0px;
    color: #3d94de;
    cursor: pointer;
`;

const FooterButtonFilled = styled.div`
    background: #3d94de;
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 68%;
    padding: 24px 0px;
    color: #ffffff;
    cursor: pointer;
`;

const SquareCheckBox = styled.div`
    width: 20px;
    height: 20px;
    border: 2px solid #ffffff;
    border-radius: 4px;
    background-color: #3d94de;
    margin-left: 8px;
    margin-bottom: 3px;
`;

export default Detail;
