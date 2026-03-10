import React from 'react';
import styles from './Home.module.css';
import Link from 'next/link';
import { Opt } from '../../contexts/login';
import { useState, useEffect, useContext } from 'react';
import { getData } from '../../comp/data';
import loginContext from '../../contexts/login';
import axios from 'axios';
import styled from 'styled-components';

import SliderMenu from '../desktop/MainPage/SliderMenu/SliderMenu';
import QuickMenu from '../desktop/MainPage/QickMenu/QuickMenu';
import AppBorderWrapper from '../desktop/MainPage/AppBorder/AppBorderWrapper';
import WinterProgram from '../desktop/MainPage/WinterProgram/WinterProgram';

const Home = () => {
    const { type } = React.useContext(Opt);
    const { info, user } = useContext(loginContext);
    const [acc, setAcc] = useState([]);
    const [s, setS] = useState();
    const c = React.useMemo(() => {
        const cc = acc.filter((i) => i.account == s);
        console.log(acc, cc);
        return cc.length ? cc[0] : {};
    }, [s]);
    console.log(c);
    useEffect(() => {
        if (user[0]) {
            getData('/api/linkage/get', setAcc, {}, user[0]);
        }
    }, [user[0]]);
    useEffect(() => {
        console.log(acc);
    }, [acc]);
    const a = {
        H1: '1학년',
        H2: '2학년',
        H3: '3학년',
        HN: 'N수생',
    };

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <SliderMenu />
            <QuickMenu />
            <AppBorderWrapper />
            <img width='100%' src='/assets/main_banner/mobile_main_analysis.png' />
            <img width='100%' src='/assets/main_banner/mobile_main_jungsi.png' />
            <WinterProgram />
            <MentorList />
            <Suggestion />
        </div>
    );
};

const MentorList = () => {
    const [mentors, setMentors] = useState([]);

    useEffect(() => {
        _getMentors();
    }, []);

    const FlatList = styled.div`
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow: auto;
        padding-top: 50px;
        padding-bottom: 16px;
        margin: 0px;
    `;

    const Title = styled.div`
        font-weight: 800;
        font-size: 24px;
        line-height: 32px;
        white-space: pre-wrap;
        text-align: center;
    `;

    const MentorContainer = styled.div`
        min-width: 158px;
        width: 158px;
        height: 247px;
        padding-top: 24px;
        background: #ffffff;
        box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.12);
        margin-right: 9px;

        &:first-child {
            margin-left: 9px;
        }
    `;

    const MentorTitle = styled.div`
        font-weight: bold;
        font-size: 20px;
        line-height: 28px;
        margin: 0px 20px;
        margin-bottom: 8px;
    `;

    const MentorInfo = styled.div`
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        margin: 0px 20px;
    `;

    const MentorImage = styled.img`
        width: 70px;
        height: 70px;
        border-radius: 35px;
        margin: 0px 20px;
        margin-top: 4px;
        margin-bottom: 16px;
        float: right;
    `;

    const MentorButton = styled.button`
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        text-align: center;

        color: #f45119;
        border-top: 1px solid #f45119;

        width: 100%;
        padding: 12px 0px;
    `;

    const _getMentors = () => {
        axios
            .get('/api/planner/home_planner', {
                headers: {
                    auth: localStorage.getItem('uid'),
                },
            })
            .then((res) => {
                console.log('mentor', res);
                setMentors(res.data.data);
            });
    };

    const renderMentorContent = (mentor) => (
        <MentorContainer>
            <MentorTitle>{mentor.name}</MentorTitle>
            <MentorInfo>{mentor.univ}</MentorInfo>
            <MentorInfo>{mentor.dep}</MentorInfo>
            <MentorImage src={'profile-img/' + mentor.img + '.jpg'} />
            <MentorButton>{'1:1 평가받기'}</MentorButton>
        </MentorContainer>
    );

    return (
        <>
            <Title>{'거북스쿨의\n멘토쌤들을 만나보세요!'}</Title>
            <FlatList>{mentors.map(renderMentorContent)}</FlatList>
        </>
    );
};

const Suggestion = () => {
    const Container = styled.div`
        padding: 0px 14px;
        width: 100%;
        margin-top: 100px;
    `;

    const SuggestImage = styled.img`
        width: 100%;
    `;

    const Title = styled.div`
        font-weight: normal;
        font-size: 24px;
        line-height: 32px;
        text-align: center;
    `;

    const HighlightTitle = styled.div`
        font-weight: 800;
        font-size: 24px;
        line-height: 32px;

        text-align: center;
        color: #f45119;
        margin-bottom: 50px;
    `;

    const OrangeBox = styled.div`
        margin-top: -60px;
        width: 100%;
        height: 110px;
        background-color: #f45119;
    `;

    return (
            <Container>
                <Title>{'거북스쿨'}</Title>
                <HighlightTitle>{'추천서비스'}</HighlightTitle>
                <SuggestImage src='/assets/main_banner/main_suggest1.png' onClick={() => window.location.href = "/gpa/mygrade/"}/>
                <SuggestImage src='/assets/main_banner/main_suggest2.png' onClick={() => window.location.href = "https://www.turtleschool.kr/z/"}/>
                <SuggestImage src='/assets/main_banner/main_suggest3.png' onClick={() => window.location.href = "/gpa/graph/"}/>
            </Container>
    );
};

export default Home;
