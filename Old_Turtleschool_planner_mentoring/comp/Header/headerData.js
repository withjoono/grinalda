import React from 'react';

export const HeaderMenu = [
    {
        title: '(학습/수업)플래너',
    },
    {
        title: '성적관리',
    },
    {
        title: '수시/정시 컨설팅',
    },
    {
        title: '멘토링',
    },
    {
        title: '입시 버틀러',
    },
];

export const subMenu = [
    {
        key: 1,
        title: [
            {
                tit: '(학습/수업)플래너',
                subTit: [
                    {   text: '장기 학습/수업 계획',
                        url: '/planner/plan'
                    },
                    {   text: '금일 학습/수업 현황',
                        url: '/planner/result'
                    },
                    {
                        text: '누적 학습/수업 현황',
                        url: '/planner/status',
                    },
                    /* {
                        text: '멘토관리반',
                        url: '/myclass/planner',
                    }, */
                ],
            },
        ],
    },
    {
        key: 2,
        title: [
            {
                tit: '내신 성적 관리',
                subTit: [
                    {
                        text: '성적입력',
                        url: '/gpa/infoform',
                    },
                    {
                        text: '교과분석',
                        url: '/gpa/mygrade',
                    },
                    {
                        text: '비교과분석',
                        url: '/gpa/graph',
                    },
                    {
                        text: '학종 컨설팅',
                        url: '/desktop/gradeuniversity',
                    },
                    {
                        text: '교과 컨설팅',
                        url: '/desktop/gradeuniversity',
                    },
                    {
                        text: '논술 컨설팅',
                        url: '/desktop/gradeuniversity',
                    },
                    {
                        text: '목표대학',
                        url: '/desktop/gradeobjective',
                    },
                ],
            },
            {
                tit: '모의고사 성적 관리',
                subTit: [
                    {
                        text: '체점하기/점수입력',
                        url: '/mockup/inputchoice',
                    },
                    {
                        text: '성적분석',
                        url: '/mockup/mygrade',
                    },
                    {
                        text: '오답분석',
                        url: '/mockup/graph',
                    },
                    {
                        text: '대학 예측 및 검색',
                        url: '/mockup/university',
                    },
                    {
                        text: '목표대학',
                        url: '/mockup/prediction',
                    },
                ],
            },
        ],
    },
    {
        key: 3,
        title: [
            {
                tit: '수시 컨설팅',
                subTit: [
                    { text: '성적입력', url: '' },
                    {
                        text: '교과분석',
                        url: '',
                    },
                    {
                        text: '비교과분석',
                        url: '',
                    },
                    { text: '학종 컨설팅', url: '' },
                    { text: '교과 컨설팅', url: '' },
                    { text: '논술 컨설팅', url: '/nonsul/lib' },
                    {
                        text: '목표대학',
                        url: '',
                    },
                ],
            },
            {
                tit: '정시 컨설팅',
                subTit: [
                    { text: '성적입력', url: '/regular/scoreInput' },
                    {
                        text: '성적분석',
                        url: '/regular/analyse',
                    },
                    {
                        text: '가군컨설팅',
                        url: '/regular/firstConsulting',
                    },
                    {
                        text: '나군컨설팅',
                        url: '/regular/secondConsulting',
                    },
                    {
                        text: '다군컨설팅',
                        url: '/regular/thirdConsulting',
                    },
                    {
                        text: '모의지원 현황',
                        url: '/regular/mockApply',
                    },
                    {
                        text: '경쟁율 검색',
                        url: ''
                    }
                ],
            },
            {
                tit: '추가모집',
                subTit: [
                    {
                        text: '수시/정시 선택',
                        url: '',
                    },
                    {
                        text: '일반/특별 선택',
                        url: '',
                    },
                    { text: '대학별 검색', url: '' },
                    { text: '학과별 검색', url: '' },
                    { text: '관심대학', url: '' },
                ],
            },
        ],
    },
    {
        key: 4,
        title: [
            {
                tit: '멘토링',
                subTit: [
                    { text: '플래너 멘토링', url: '/myclass/planner' },
                    { text: '생기부 멘토링', url: '/temps/s-mentoring/1' },
                    /* { text: '학습관리/클리닉 프로그램', url: '' }, */
                ],
            },
        ],
    },
    {
        key: 5,
        title: [
            {
                tit: '입시 버틀러',
                subTit: [
                    { text: '거북쌤의 입시코칭', url: '' },
                    { text: '맞춤 입시정보', url: '' },
                ],
            },
        ],
    },
];
