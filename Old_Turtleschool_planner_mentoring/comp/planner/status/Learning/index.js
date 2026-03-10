import React, { useState, useEffect, useMemo } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import * as Labeling from 'chartjs-plugin-labels';
import Image from 'next/image';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';
import { UserAgentProvider, UserAgent } from '@quentin-sommer/react-useragent';

import * as S from './index.style';

const Outline = ({ pieData }) => {
    const weeklyStudyTime = useMemo(() => pieData.datasets[0].data.reduce((prev, curr) => prev + curr, 0), [pieData]);

    const renderLegend = (data) => {
        return (
            <S.LegendContainer>
                {data.labels.map((label, index) => (
                    <S.LegendContent key={label}>
                        <S.LegendDot color={data.datasets[0].backgroundColor[index]} />
                        <S.LegendValue>{`${label} / ${data.datasets[0].data[index]}시간`}</S.LegendValue>
                    </S.LegendContent>
                ))}
            </S.LegendContainer>
        );
    };

    const renderLabel = (args) => {
        return args.label + '\n' + args.percentage + '%';
    };

    return (
        <S.OutlineContainer>
            <S.OutlineDescription>
                <S.OutlineTitle>{'학습개요'}</S.OutlineTitle>
                <S.OutlineContent>
                    <S.OutlineName>{'주간 학습 가용 시간'}</S.OutlineName>
                    <S.OutlineValue>{`${weeklyStudyTime}시간`}</S.OutlineValue>
                </S.OutlineContent>
            </S.OutlineDescription>
            <S.ChartLayout>
                {renderLegend(pieData)}
                <S.ChartContainer>
                    <Pie
                        width={195}
                        height={195}
                        data={pieData}
                        plugins={[Labeling]}
                        options={{
                            elements: {
                                arc: {
                                    borderWidth: 0,
                                },
                            },
                            maintainAspectRatio: false,
                            legend: {
                                display: false,
                            },
                            tooltips: {
                                enabled: false,
                            },
                            plugins: {
                                labels: {
                                    render: renderLabel,
                                    fontSize: 12,
                                    fontFamily: 'NanumSquare',
                                    lineHeight: 14,
                                    fontColor: '#fff',
                                    fontStyle: 'bold',
                                },
                            },
                        }}
                    />
                </S.ChartContainer>
            </S.ChartLayout>
        </S.OutlineContainer>
    );
};

const WeeklySummary = ({ weeklyData, lineData, subjects }) => {
    const renderWeeklyTable = (titles) => {
        const headerTitles = ['', ...titles];

        const getSubjectProgress = (name) => {
            const target = weeklyData.find((subject) => subject.subject === name);
            return target && target.ratio_progress ? `${target.ratio_progress}%` : '-';
        };

        const renderHeader = (titles) => (
            <thead>
                <tr>
                    {titles.map((title) => (
                        <S.WeeklyTH key={title}>{title}</S.WeeklyTH>
                    ))}
                </tr>
            </thead>
        );

        const renderBody = (titles) => (
            <tbody>
                <tr>
                    {titles.map((value, index) => (
                        <S.WeeklyTD key={value} first={index === 0}>
                            {index === 0 ? '성취도' : getSubjectProgress(value)}
                        </S.WeeklyTD>
                    ))}
                </tr>
            </tbody>
        );
        return (
            <S.WeeklyTable>
                {renderHeader(headerTitles)}
                {renderBody(headerTitles)}
            </S.WeeklyTable>
        );
    };

    return (
        <S.WeeklyContainer>
            <S.WeeklyTitle>{'주간 성취도'}</S.WeeklyTitle>
            <S.WeeklyContent>
                <S.WeeklyTableContainer>{renderWeeklyTable(subjects)}</S.WeeklyTableContainer>
                <S.WeeklyGraphContainer>
                    <Line
                        data={lineData}
                        options={{
                            legend: {
                                display: false,
                            },
                            maintainAspectRatio: false,
                            responsive: true,
                            tooltips: {
                                enabled: false,
                            },
                            scales: {
                                yAxes: [
                                    {
                                        ticks: {
                                            beginAtZero: true,
                                            max: 100,
                                        },
                                    },
                                ],
                            },
                        }}
                    />
                </S.WeeklyGraphContainer>
            </S.WeeklyContent>
        </S.WeeklyContainer>
    );
};

const StatusList = ({ _searchStatusData, statusData, dropVisible, setDropVisible, subjects, plans }) => {
    const [selectedSubject, setSelectedSubject] = useState('과목을 선택하세요.');
    const [selectedPlan, setSelectedPlan] = useState('계획을 선택하세요.');

    useEffect(() => {
        setSelectedPlan()
    }, [selectedSubject])
    const handleSelectChange = ({ target }) => {
        switch (target.name) {
            case '과목':
                setSelectedSubject(target.value);
                break;
            case '계획':
                setSelectedPlan(target.value);
                break;
        }
    };

    const renderSelectForm = (labels, type) => (
        <FormControl fullWidth variant='outlined'>
            <Select
                autoWidth={false}
                value={type === '과목' ? selectedSubject : selectedPlan}
                onChange={handleSelectChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label', placeholder: '과목을 선택하세요.' }}
                name={type}
                style={{
                    color: (type === '과목' && selectedSubject === '과목을 선택하세요.') || (type === '계획' && selectedPlan === '계획을 선택하세요.') ? '#9A9A9A' : '#000000',
                }}>
                {[type === '과목' ? '과목을 선택하세요.' : '계획을 선택하세요.', ...labels].map((label, index) => (
                    <MenuItem
                        key={label}
                        style={{
                            color: index === 0 ? '#9A9A9A' : '#000000',
                        }}
                        value={label}
                        disabled={index === 0}>
                        {label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const renderEmptyStatus = () => (
        <S.StatusEmptyContainer>
            <S.StatusEmptyTitle>{'확습 현황을 조회할 과목, 계획을 선택하세요'}</S.StatusEmptyTitle>
            <S.StatusEmptyDescription>{'과목과 계획을 선택해 검색하면 해당 과목, 계획별 학습 현황을 확인할 수 있습니다.'}</S.StatusEmptyDescription>
        </S.StatusEmptyContainer>
    );

    const renderStatusItem = (status, index) => {
        const formatDate = (date) => {
            const dateObj = new Date(date);
            const localizeDays = ['일', '월', '화', '수', '목', '금', '토'];

            return `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${localizeDays[dateObj.getDay()]}요일`;
        };

        const onToggleClick = () => {
            setDropVisible((prev) => {
                prev[index] = !prev[index];
                return [...prev];
            });
        };

        const renderDropContent = (status) => (
            <S.StatusToggleContainer>
                <S.StatusToggleContent>
                    <S.StatusToggleContentTitle>{'학습 시간'}</S.StatusToggleContentTitle>
                    <S.StatusToggleContentDescription>{status.circle_time}</S.StatusToggleContentDescription>
                </S.StatusToggleContent>
                <S.StatusToggleContent>
                    <S.StatusToggleContentTitle>{'멘토쌤 평가'}</S.StatusToggleContentTitle>
                    <S.StatusToggleContentDescription>{status.score ? `${status.score}점` : '평가 전'}</S.StatusToggleContentDescription>
                </S.StatusToggleContent>
                <S.StatusToggleContent>
                    <S.StatusToggleContentTitle>{'멘토쌤 멘트'}</S.StatusToggleContentTitle>
                    <S.StatusToggleContentDescription>{status.mentor_desc}</S.StatusToggleContentDescription>
                </S.StatusToggleContent>
            </S.StatusToggleContainer>
        );

        return (
            <S.StatusContent>
                <UserAgent computer>
                    <S.StatusHeader>
                        <S.StatusIndex>{index + 1}</S.StatusIndex>
                        <S.StatusDate>{formatDate(status.start_date)}</S.StatusDate>
                        <S.StatusItemTitle>{status.title}</S.StatusItemTitle>
                        <S.StatusProgress>{`성취도 : ${status.progress || '0'}%`}</S.StatusProgress>
                        <S.StatusButton onClick={onToggleClick}>
                            <S.StatusButtonTitle>{dropVisible[index] ? '닫기' : '자세히 보기'}</S.StatusButtonTitle>
                            <Image src={`/assets/icons/arrow/${dropVisible[index] ? 'up' : 'bottom'}_grey_arrow.svg`} width={24} height={24} />
                        </S.StatusButton>
                    </S.StatusHeader>
                    {dropVisible[index] && renderDropContent(status)}
                </UserAgent>

                <UserAgent mobile>
                    <S.StatusHeader>
                        <S.StatusIndex>{index + 1}</S.StatusIndex>
                        <S.StatusDate>{formatDate(status.start_date)}</S.StatusDate>
                        <S.StatusButton onClick={onToggleClick}>
                            <S.StatusButtonTitle>{dropVisible[index] ? '닫기' : '자세히 보기'}</S.StatusButtonTitle>
                            <Image src={`/assets/icons/arrow/${dropVisible[index] ? 'up' : 'bottom'}_grey_arrow.svg`} width={24} height={24} />
                        </S.StatusButton>
                    </S.StatusHeader>
                    <S.StatusItemTitle>{status.title}</S.StatusItemTitle>
                </UserAgent>
            </S.StatusContent>
        );
    };

    const renderStatusContent = () => statusData.map(renderStatusItem);

    const onSearchClick = () => {
        _searchStatusData({ subject: selectedSubject === '과목을 선택하세요.' ? '' : selectedSubject, title: selectedPlan === '계획을 선택하세요.' ? '' : selectedPlan });
    };

    return (
        <S.StatusContainer>
            <S.StatusTitle></S.StatusTitle>
            <S.StatusTitle>{'과목별 학습 현황 조회'}</S.StatusTitle>
            <S.StatusFilterContainer>
                <S.StatusFilterContent>
                    <S.StatusFilterLabel>{'과목 선택'}</S.StatusFilterLabel>
                    <S.StatusFilterInput>{renderSelectForm(subjects, '과목')}</S.StatusFilterInput>
                </S.StatusFilterContent>
                <S.StatusFilterContent>
                    <S.StatusFilterLabel>{'계획 선택'}</S.StatusFilterLabel>
                    <S.StatusFilterInput>{renderSelectForm(plans.filter(plan => plan.subject === selectedSubject).map(plan => plan.title), '계획')}</S.StatusFilterInput>
                </S.StatusFilterContent>
                <S.StatusFilterButton onClick={onSearchClick}>{'해당 과목 학습 현황 조회'}</S.StatusFilterButton>
            </S.StatusFilterContainer>
            <S.StatusPartitionLine />
            <S.StatusContentContainer>{statusData.length ? renderStatusContent() : renderEmptyStatus()}</S.StatusContentContainer>
        </S.StatusContainer>
    );
};

const Learning = () => {
    const [subjects, setSubjects] = useState(['수학', '국어', '영어', '사탐', '과탐', '기타']);
    const [plans, setPlans] = useState([]);

    const [pieData, setPieData] = useState({
        labels: [],
        datasets: [
            {
                label: 'week',
                data: [],
                backgroundColor: ['#73C28F', '#BF3752', '#F9C612', '#6277D9', '#69AAFC', '#F6AFC0'],
                hoverOffset: 4,
            },
        ],
    });

    const [lineData, setLineData] = useState({
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [
            {
                data: [],
                fill: false,
                borderColor: '#C86F4C',
                tension: 0,
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: '#C86F4C',
                pointBorderWidth: 2,
            },
        ],
    });

    const [weeklyData, setWeeklyData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [dropVisible, setDropVisible] = useState({});

    useEffect(() => {
        _getWeeklyData();
        _getWeeklyGraphData();
        _getStatusMenuItems();
    }, []);

    const _getWeeklyData = () => {
        axios
            .get('/api/plan/select_s', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '학습',
                },
            })
            .then((res) => {
                const labels = res.data.data.map((subject) => subject.subject);
                const data = res.data.data.map((subject) => subject.date_diff_minute);

                setPieData((prev) => {
                    return {
                        labels,
                        datasets: [
                            {
                                ...prev.datasets[0],
                                data,
                            },
                        ],
                    };
                });

                setWeeklyData(res.data.data);
                console.log('weekly', res);
            })
            .catch((e) => console.log(e));
    };

    const _getWeeklyGraphData = () => {
        axios
            .get('/api/plan/select_plan_graph', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '학습',
                },
            })
            .then((res) => {
                console.log('weeklyGraph', res);

                const data = res.data.data.map((day) => parseInt(day.avg_progress));

                setLineData((prev) => {
                    return {
                        ...prev,
                        datasets: [
                            {
                                ...prev.datasets[0],
                                data,
                            },
                        ],
                    };
                });
            })
            .catch((e) => console.log(e));
    };

    const _getStatusMenuItems = () => {
        axios
            .get('/api/plan/select_plan_title', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '학습',
                },
            })
            .then((res) => {
                setPlans(res.data.data);
            })
            .catch((e) => console.log(e));
    };

    const _searchStatusData = ({ subject, title }) => {
        axios
            .get('/api/plan/select_plan_date', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '학습',
                    subject,
                    title,
                },
            })
            .then((res) => {
                console.log('searchStatusData', res);
                setStatusData(res.data.data);
                setDropVisible(res.data.data.map((status) => false));
            })
            .catch((e) => console.log(e));
    };

    return (
        <UserAgentProvider ua={window.navigator.userAgent}>
            <S.Container>
                <Outline pieData={pieData} />
                <WeeklySummary weeklyData={weeklyData} lineData={lineData} subjects={subjects} />
                <StatusList _searchStatusData={_searchStatusData} statusData={statusData} dropVisible={dropVisible} setDropVisible={setDropVisible} subjects={subjects} plans={plans} />
            </S.Container>
        </UserAgentProvider>
    );
};

export default Learning;
