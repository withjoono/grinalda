'use client';

import { useMemo, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { SchoolRecordSubject } from '@/apis/hooks/use-school-record';

// 과목군 키워드 매핑 (subjectGroup.name 또는 subjectName 기준)
const SUBJECT_KEYWORDS: Record<string, string[]> = {
    국어: ['국어', '문학', '독서', '화법', '작문', '언어와 매체', '언어', '매체'],
    영어: ['영어', '영어Ⅰ', '영어Ⅱ', '영어회화', '영어독해'],
    수학: ['수학', '수학Ⅰ', '수학Ⅱ', '미적분', '확률과 통계', '기하'],
    사회: [
        '사회', '한국사', '세계사', '동아시아사', '경제', '정치와 법',
        '사회·문화', '생활과 윤리', '윤리와 사상', '세계지리', '한국지리',
    ],
    과학: [
        '과학', '물리학', '화학', '생명과학', '지구과학',
        '물리학Ⅰ', '물리학Ⅱ', '화학Ⅰ', '화학Ⅱ',
        '생명과학Ⅰ', '생명과학Ⅱ', '지구과학Ⅰ', '지구과학Ⅱ',
    ],
};

function classifySubject(subject: SchoolRecordSubject): string[] {
    const categories: string[] = [];
    const groupName = subject.subjectGroup?.name || '';
    const subjectName = subject.subjectName || '';

    for (const [category, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
        if (
            keywords.some(
                (k) =>
                    groupName.includes(k) ||
                    subjectName.includes(k) ||
                    groupName === category
            )
        ) {
            categories.push(category);
        }
    }
    return categories;
}

// 카테고리 그룹 정의
const CATEGORY_GROUPS = [
    { key: '국영', label: '국영', subjects: ['국어', '영어'], color: '#3b82f6' },
    { key: '국영수', label: '국영수', subjects: ['국어', '영어', '수학'], color: '#10b981' },
    { key: '국영사', label: '국영사', subjects: ['국어', '영어', '사회'], color: '#f59e0b' },
    { key: '국영수사', label: '국영수사', subjects: ['국어', '영어', '수학', '사회'], color: '#8b5cf6' },
    { key: '전체', label: '전체과목', subjects: [], color: '#ef4444' },
];

const SEMESTER_LABELS: Record<string, string> = {
    '1-1': '1-1',
    '1-2': '1-2',
    '2-1': '2-1',
    '2-2': '2-2',
    '3-1': '3-1',
    '3-2': '3-2',
};

interface GradeTrendChartsProps {
    subjects: SchoolRecordSubject[];
}

export default function GradeTrendCharts({ subjects }: GradeTrendChartsProps) {
    const [selectedGroups, setSelectedGroups] = useState<string[]>([
        '국영수',
        '전체',
    ]);

    // 과목별 카테고리 분류
    const classifiedSubjects = useMemo(() => {
        return subjects.map((s) => ({
            ...s,
            categories: classifySubject(s),
        }));
    }, [subjects]);

    // 학기별 카테고리 그룹별 가중 평균 등급 계산
    const chartData = useMemo(() => {
        const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
        const data: {
            semester: string;
            [key: string]: number | string | null;
        }[] = [];

        for (const sem of semesters) {
            const [g, s] = sem.split('-');
            const semSubjects = classifiedSubjects.filter(
                (sub) =>
                    sub.grade === Number(g) &&
                    sub.semester === Number(s) &&
                    sub.gradeRank
            );

            if (semSubjects.length === 0) continue;

            const point: { semester: string;[key: string]: number | string | null } =
            {
                semester: SEMESTER_LABELS[sem] || sem,
            };

            for (const group of CATEGORY_GROUPS) {
                let filtered: typeof semSubjects;

                if (group.key === '전체') {
                    filtered = semSubjects;
                } else {
                    filtered = semSubjects.filter((sub) =>
                        group.subjects.some((cat) => sub.categories.includes(cat))
                    );
                }

                if (filtered.length > 0) {
                    const totalWeightedRank = filtered.reduce(
                        (sum, sub) => sum + (sub.gradeRank || 0) * sub.units,
                        0
                    );
                    const totalUnits = filtered.reduce(
                        (sum, sub) => sum + sub.units,
                        0
                    );
                    point[group.key] =
                        totalUnits > 0
                            ? Math.round((totalWeightedRank / totalUnits) * 100) / 100
                            : null;
                } else {
                    point[group.key] = null;
                }
            }

            data.push(point);
        }

        return data;
    }, [classifiedSubjects]);

    // 교과별 성적추이 (개별 교과 기준)
    const subjectChartData = useMemo(() => {
        const subjectMap: Record<
            string,
            { semester: string; rank: number; units: number }[]
        > = {};

        for (const s of classifiedSubjects) {
            if (!s.gradeRank) continue;
            for (const cat of s.categories) {
                if (!subjectMap[cat]) subjectMap[cat] = [];
                subjectMap[cat].push({
                    semester: `${s.grade}-${s.semester}`,
                    rank: s.gradeRank,
                    units: s.units,
                });
            }
        }

        // 학기별 그룹화+평균
        const semesters = ['1-1', '1-2', '2-1', '2-2', '3-1', '3-2'];
        const data: { semester: string;[key: string]: number | string | null }[] =
            [];

        for (const sem of semesters) {
            const point: { semester: string;[key: string]: number | string | null } =
                { semester: SEMESTER_LABELS[sem] || sem };
            let hasAny = false;

            for (const [cat, records] of Object.entries(subjectMap)) {
                const semRecords = records.filter((r) => r.semester === sem);
                if (semRecords.length > 0) {
                    const totalWeight = semRecords.reduce(
                        (s, r) => s + r.rank * r.units,
                        0
                    );
                    const totalUnits = semRecords.reduce((s, r) => s + r.units, 0);
                    point[cat] =
                        totalUnits > 0
                            ? Math.round((totalWeight / totalUnits) * 100) / 100
                            : null;
                    hasAny = true;
                } else {
                    point[cat] = null;
                }
            }

            if (hasAny) data.push(point);
        }

        return { data, categories: Object.keys(subjectMap) };
    }, [classifiedSubjects]);

    const SUBJECT_COLORS: Record<string, string> = {
        국어: '#3b82f6',
        영어: '#ef4444',
        수학: '#10b981',
        사회: '#f59e0b',
        과학: '#8b5cf6',
    };

    const toggleGroup = (key: string) => {
        setSelectedGroups((prev) =>
            prev.includes(key) ? prev.filter((g) => g !== key) : [...prev, key]
        );
    };

    if (chartData.length === 0) return null;

    return (
        <div className='space-y-8'>
            {/* 학기별 성적추이 (카테고리 그룹별) */}
            <div className='rounded-lg border bg-card p-6 shadow-sm'>
                <h4 className='mb-2 text-base font-semibold'>📈 학기별 성적추이</h4>
                <p className='mb-4 text-xs text-muted-foreground'>
                    과목 조합별 가중 평균 등급 추이 (단위수 가중)
                </p>

                {/* 필터 버튼 */}
                <div className='mb-4 flex flex-wrap gap-2'>
                    {CATEGORY_GROUPS.map((group) => (
                        <button
                            key={group.key}
                            onClick={() => toggleGroup(group.key)}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${selectedGroups.includes(group.key)
                                    ? 'text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                            style={
                                selectedGroups.includes(group.key)
                                    ? { backgroundColor: group.color }
                                    : {}
                            }
                        >
                            {group.label}
                        </button>
                    ))}
                </div>

                <ResponsiveContainer width='100%' height={320}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
                        <XAxis dataKey='semester' tick={{ fontSize: 12 }} />
                        <YAxis
                            reversed
                            domain={[1, 9]}
                            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                            tick={{ fontSize: 12 }}
                            label={{
                                value: '등급',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: 12 },
                            }}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `${value}등급`,
                                CATEGORY_GROUPS.find((g) => g.key === name)?.label || name,
                            ]}
                            contentStyle={{
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                        <Legend
                            formatter={(value: string) =>
                                CATEGORY_GROUPS.find((g) => g.key === value)?.label || value
                            }
                        />
                        {CATEGORY_GROUPS.filter((g) =>
                            selectedGroups.includes(g.key)
                        ).map((group) => (
                            <Line
                                key={group.key}
                                type='monotone'
                                dataKey={group.key}
                                stroke={group.color}
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: group.color }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* 교과별 성적추이 */}
            <div className='rounded-lg border bg-card p-6 shadow-sm'>
                <h4 className='mb-2 text-base font-semibold'>📊 교과별 성적추이</h4>
                <p className='mb-4 text-xs text-muted-foreground'>
                    국어, 영어, 수학, 사회, 과학 교과별 가중 평균 등급 추이
                </p>

                <ResponsiveContainer width='100%' height={320}>
                    <LineChart data={subjectChartData.data}>
                        <CartesianGrid strokeDasharray='3 3' opacity={0.3} />
                        <XAxis dataKey='semester' tick={{ fontSize: 12 }} />
                        <YAxis
                            reversed
                            domain={[1, 9]}
                            ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
                            tick={{ fontSize: 12 }}
                            label={{
                                value: '등급',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: 12 },
                            }}
                        />
                        <Tooltip
                            formatter={(value: number, name: string) => [
                                `${value}등급`,
                                name,
                            ]}
                            contentStyle={{
                                borderRadius: '8px',
                                fontSize: '12px',
                            }}
                        />
                        <Legend />
                        {subjectChartData.categories.map((cat) => (
                            <Line
                                key={cat}
                                type='monotone'
                                dataKey={cat}
                                stroke={SUBJECT_COLORS[cat] || '#6b7280'}
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: SUBJECT_COLORS[cat] || '#6b7280' }}
                                activeDot={{ r: 6 }}
                                connectNulls
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
