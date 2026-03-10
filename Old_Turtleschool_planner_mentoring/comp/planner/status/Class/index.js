import React, { useState, useEffect, useMemo } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import * as Labeling from 'chartjs-plugin-labels';
import Image from 'next/image';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import axios from 'axios';

import * as S from './index.style';

const Outline = ({ pieData }) => {

    const weeklyStudyTime = useMemo(() => pieData.datasets[0].data.reduce((prev, curr) => prev + curr, 0), [pieData])

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
                        <S.OutlineName>{'금주 총 수업시간'}</S.OutlineName>
                        <S.OutlineValue>
                            {`${weeklyStudyTime}시간`}
                        </S.OutlineValue>
                    </S.OutlineContent>
                </S.OutlineDescription>
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
            </S.OutlineContainer>
    )
}

const WeeklySummary = ({ lineTestData, lineTaskData }) => {
    return (
        <S.WeeklyContainer>
                    <S.WeeklyContent>
                        <S.WeeklyGraphTitleContainer>
                            <S.WeeklyTitle>{'과목 월간 시험 결과'}</S.WeeklyTitle>
                            <S.WeeklyGraphContainer>
                                <Line
                                    data={lineTestData}
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
                        </S.WeeklyGraphTitleContainer>
                        <S.WeeklyGraphTitleContainer>
                            <S.WeeklyTitle>{'과목 월간 과제 결과'}</S.WeeklyTitle>
                            <S.WeeklyGraphContainer>
                                <Line
                                    data={lineTaskData}
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
                        </S.WeeklyGraphTitleContainer>
                    </S.WeeklyContent>
                </S.WeeklyContainer>
    )
}
const StatusList = ({ _searchStatusData, _getMontlyGraphData, statusData, lineTestData, lineTaskData, dropVisible, setDropVisible, subjects, plans }) => {

    const [selectedSubject, setSelectedSubject] = useState("과목을 선택하세요.");
    const [selectedPlan, setSelectedPlan] = useState("계획을 선택하세요.");

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
        <FormControl variant='outlined'>
            <Select
                value={type === '과목' ? selectedSubject : selectedPlan}
                onChange={handleSelectChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label', placeholder: '과목을 선택하세요.' }}
                name={type}
                style={{
                    width: 170,
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
                <S.StatusHeader>
                    <S.StatusIndex>{index + 1}</S.StatusIndex>
                    <S.StatusDate>{formatDate(status.start_date)}</S.StatusDate>
                    <S.StatusItemTitle>{status.title}</S.StatusItemTitle>
                    <S.StatusProgressContainer>
                    <S.StatusProgress>{`과제현황 : ${status.progress || '0'}%`}</S.StatusProgress>
                    <S.StatusProgress>{`시험결과 : ${status.score === null ? '없음' : `${status.score}점`}`}</S.StatusProgress>
                    </S.StatusProgressContainer>
                    <S.StatusButton onClick={onToggleClick}>
                        <S.StatusButtonTitle>{dropVisible[index] ? '닫기' : '자세히 보기'}</S.StatusButtonTitle>
                        <Image src={`/assets/icons/arrow/${dropVisible[index] ? 'up' : 'bottom'}_grey_arrow.svg`} width={24} height={24} />
                    </S.StatusButton>
                </S.StatusHeader>
                {dropVisible[index] && renderDropContent(status)}
            </S.StatusContent>
        );
    };

    const renderStatusContent = () => statusData.map(renderStatusItem);

    const renderMentoInfo = () => (
        // 임시
        <S.MentoInfoContainer>
                    <S.MentoInfoContent>
                        <S.MentoInfoTitle>
                            {"선생님"}
                        </S.MentoInfoTitle>
                        <S.MentoInfoDescription>
                            {"강보리 선생님"}
                        </S.MentoInfoDescription>
                    </S.MentoInfoContent>
                    <S.MentoInfoContent>
                        <S.MentoInfoTitle>
                            {"학습목표"}
                        </S.MentoInfoTitle>
                        <S.MentoInfoDescription>
                            {"수업목표를 적어봅시다."}
                        </S.MentoInfoDescription>
                    </S.MentoInfoContent>
                </S.MentoInfoContainer>
    )

    const onSearchClick = () => {
        _searchStatusData({ subject: selectedSubject === '과목을 선택하세요.' ? '' : selectedSubject, title: selectedPlan === '계획을 선택하세요.' ? '' : selectedPlan });
        _getMontlyGraphData(selectedSubject);
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
                {renderMentoInfo()}
                <WeeklySummary lineTestData={lineTestData} lineTaskData={lineTaskData}/>
                <S.StatusContentContainer>{statusData.length ? renderStatusContent() : renderEmptyStatus()}</S.StatusContentContainer>
            </S.StatusContainer>
    )
}

const Class = () => {
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

    const [lineTestData, setLineTestData] = useState({
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
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

    const [lineTaskData, setLineTaskData] = useState({
        labels: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
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
        _getStatusMenuItems();
    }, []);

    const _getWeeklyData = () => {
        axios
            .get('/api/plan/select_s', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '수업',
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

    const _getMontlyGraphData = (subject) => {
        axios
            .get('/api/plan/select_month_graph', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '수업',
                    subject,
                },
            })
            .then((res) => {
                console.log('monthly', res)
                const testData = res.data.data.map(month => month.avg_score || 0);
                const taskData = res.data.data.map(month => month.avg_progress || 0);

                setLineTestData(prev => {
                    return {
                        ...prev,
                        datasets: [
                            {
                                ...prev.datasets[0],
                                data: testData,
                            }
                        ]
                    }
                })

                setLineTaskData(prev => {
                    return {
                        ...prev,
                        datasets: [
                            {
                                ...prev.datasets[0],
                                data: taskData,
                            }
                        ]
                    }
                })
            })
            .catch((e) => console.log(e));
    }

    const _getStatusMenuItems = () => {
        axios.get('/api/plan/select_plan_title', {
            headers: { auth: localStorage.getItem('uid') },
            params: {
                primarytype: '수업',
            },
        })
        .then((res) => {
            setPlans(res.data.data)
        })
        .catch((e) => console.log(e))
    }

    const _searchStatusData = ({ subject, title }) => {
        axios
            .get('/api/plan/select_plan_date', {
                headers: { auth: localStorage.getItem('uid') },
                params: {
                    primarytype: '수업',
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
        <S.Container>
            <Outline pieData={pieData}/>
            <StatusList _searchStatusData={_searchStatusData} _getMontlyGraphData={_getMontlyGraphData} lineTestData={lineTestData} lineTaskData={lineTaskData} statusData={statusData} dropVisible={dropVisible} setDropVisible={setDropVisible} subjects={subjects} plans={plans} />
        </S.Container>
    );
};

export default Class;
