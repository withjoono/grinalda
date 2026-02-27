'use client';

import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useMySchoolRecord } from '@/apis/hooks/use-school-record';
import { useMemo } from 'react';

const GRADE_LABELS: Record<number, string> = {
    1: '1학년',
    2: '2학년',
    3: '3학년',
};

function getRankBadgeColor(rank: number | null) {
    if (!rank) return 'bg-gray-100 text-gray-500';
    if (rank <= 2) return 'bg-blue-100 text-blue-700';
    if (rank <= 4) return 'bg-green-100 text-green-700';
    if (rank <= 6) return 'bg-yellow-100 text-yellow-700';
    if (rank <= 8) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
}

function getAchievementColor(achievement: string) {
    switch (achievement) {
        case 'A': return 'bg-blue-100 text-blue-700';
        case 'B': return 'bg-green-100 text-green-700';
        case 'C': return 'bg-yellow-100 text-yellow-700';
        case 'D': return 'bg-orange-100 text-orange-700';
        case 'E': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-500';
    }
}

export default function SubjectAnalysisPage() {
    const { data, isLoading, error, refetch } = useMySchoolRecord();

    const groupedByGradeSemester = useMemo(() => {
        if (!data?.subjects?.length) return {};
        const groups: Record<string, typeof data.subjects> = {};
        data.subjects.forEach((s) => {
            const key = `${s.grade}-${s.semester}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });
        return groups;
    }, [data]);

    const selectGroupedByGrade = useMemo(() => {
        if (!data?.selectSubjects?.length) return {};
        const groups: Record<string, typeof data.selectSubjects> = {};
        data.selectSubjects.forEach((s) => {
            const key = `${s.grade}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });
        return groups;
    }, [data]);

    // 학년·학기별 평균 등급 계산
    const semesterAverages = useMemo(() => {
        const avgs: Record<string, { totalRank: number; totalUnits: number }> = {};
        data?.subjects?.forEach((s) => {
            const key = `${s.grade}-${s.semester}`;
            if (!avgs[key]) avgs[key] = { totalRank: 0, totalUnits: 0 };
            if (s.gradeRank) {
                avgs[key].totalRank += s.gradeRank * s.units;
                avgs[key].totalUnits += s.units;
            }
        });
        return avgs;
    }, [data]);

    if (isLoading) return <LoadingSection />;
    if (error) {
        return (
            <ErrorSection
                text='성적 데이터를 불러오는데 실패했습니다.'
                onRetry={refetch}
            />
        );
    }

    const hasSubjects = data?.subjects?.length;
    const hasSelectSubjects = data?.selectSubjects?.length;

    if (!hasSubjects && !hasSelectSubjects) {
        return (
            <div className='mt-5'>
                <div className='mx-auto w-full max-w-screen-lg py-4'>
                    <div className='pb-4'>
                        <h3 className='text-lg font-medium'>📊 교과성적분석</h3>
                    </div>
                    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                        <p className='text-4xl pb-4'>📝</p>
                        <p className='text-lg font-semibold text-muted-foreground'>
                            입력된 성적이 없습니다
                        </p>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            &quot;입력&quot; 메뉴에서 생기부를 업로드하거나 직접 입력해주세요.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-5'>
            <div className='mx-auto w-full max-w-screen-lg py-4'>
                <div className='pb-4'>
                    <h3 className='text-lg font-medium'>📊 교과성적분석</h3>
                    <p className='text-sm text-muted-foreground'>
                        학년·학기별 교과 성적을 한눈에 확인하세요.
                    </p>
                </div>

                {/* 전체 요약 카드 */}
                {Object.keys(semesterAverages).length > 0 && (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8'>
                        {Object.entries(semesterAverages)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([key, val]) => {
                                const [g, s] = key.split('-');
                                const avg = val.totalUnits > 0
                                    ? (val.totalRank / val.totalUnits).toFixed(2)
                                    : '-';
                                return (
                                    <div
                                        key={key}
                                        className='rounded-lg border bg-card p-4 text-center shadow-sm'
                                    >
                                        <p className='text-xs text-muted-foreground'>
                                            {GRADE_LABELS[Number(g)]} {s}학기
                                        </p>
                                        <p className='mt-1 text-2xl font-bold'>{avg}</p>
                                        <p className='text-xs text-muted-foreground'>평균 등급</p>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* 교과 성적 상세 */}
                {hasSubjects && (
                    <div className='space-y-6'>
                        <h4 className='text-base font-semibold border-b pb-2'>📚 교과 성적</h4>
                        {Object.entries(groupedByGradeSemester)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([key, subjects]) => {
                                const [g, s] = key.split('-');
                                return (
                                    <div key={key} className='space-y-3'>
                                        <h5 className='text-sm font-semibold text-primary'>
                                            {GRADE_LABELS[Number(g)]} {s}학기
                                        </h5>
                                        <div className='overflow-x-auto'>
                                            <table className='w-full text-sm'>
                                                <thead>
                                                    <tr className='border-b bg-muted/50'>
                                                        <th className='px-3 py-2 text-left font-medium'>교과</th>
                                                        <th className='px-3 py-2 text-left font-medium'>과목</th>
                                                        <th className='px-3 py-2 text-center font-medium'>단위수</th>
                                                        <th className='px-3 py-2 text-center font-medium'>원점수</th>
                                                        <th className='px-3 py-2 text-center font-medium'>과목평균</th>
                                                        <th className='px-3 py-2 text-center font-medium'>표준편차</th>
                                                        <th className='px-3 py-2 text-center font-medium'>성취도</th>
                                                        <th className='px-3 py-2 text-center font-medium'>석차등급</th>
                                                        <th className='px-3 py-2 text-center font-medium'>수강자수</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subjects.map((s, idx) => (
                                                        <tr key={`${s.subjectName}-${s.grade}-${s.semester}-${idx}`} className='border-b hover:bg-muted/30 transition-colors'>
                                                            <td className='px-3 py-2.5 text-muted-foreground'>
                                                                {s.subjectGroup?.name || '-'}
                                                            </td>
                                                            <td className='px-3 py-2.5 font-medium'>{s.subjectName}</td>
                                                            <td className='px-3 py-2.5 text-center'>{s.units}</td>
                                                            <td className='px-3 py-2.5 text-center font-semibold'>{s.score}</td>
                                                            <td className='px-3 py-2.5 text-center'>{s.average}</td>
                                                            <td className='px-3 py-2.5 text-center'>{s.standardDeviation}</td>
                                                            <td className='px-3 py-2.5 text-center'>
                                                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${getAchievementColor(s.achievement)}`}>
                                                                    {s.achievement}
                                                                </span>
                                                            </td>
                                                            <td className='px-3 py-2.5 text-center'>
                                                                {s.gradeRank ? (
                                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${getRankBadgeColor(s.gradeRank)}`}>
                                                                        {s.gradeRank}등급
                                                                    </span>
                                                                ) : (
                                                                    <span className='text-muted-foreground'>-</span>
                                                                )}
                                                            </td>
                                                            <td className='px-3 py-2.5 text-center'>{s.numberOfStudents}명</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}

                {/* 진로선택 과목 */}
                {hasSelectSubjects && (
                    <div className='mt-8 space-y-6'>
                        <h4 className='text-base font-semibold border-b pb-2'>🎯 진로선택 과목</h4>
                        {Object.entries(selectGroupedByGrade)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([grade, subjects]) => (
                                <div key={grade} className='space-y-3'>
                                    <h5 className='text-sm font-semibold text-primary'>
                                        {GRADE_LABELS[Number(grade)]}
                                    </h5>
                                    <div className='grid gap-3 md:grid-cols-2'>
                                        {subjects.map((s, idx) => (
                                            <div
                                                key={`${s.subjectName}-${s.grade}-${idx}`}
                                                className='rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow'
                                            >
                                                <div className='flex items-start justify-between'>
                                                    <div>
                                                        <p className='text-xs text-muted-foreground'>
                                                            {s.subjectGroup?.name}
                                                        </p>
                                                        <p className='font-semibold'>{s.subjectName}</p>
                                                    </div>
                                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${getAchievementColor(s.achievement || '')}`}>
                                                        {s.achievement || '-'}
                                                    </span>
                                                </div>
                                                <div className='mt-3 grid grid-cols-3 gap-2 text-center text-xs'>
                                                    <div className='rounded bg-muted p-1.5'>
                                                        <p className='text-muted-foreground'>원점수</p>
                                                        <p className='font-semibold'>{s.score || '-'}</p>
                                                    </div>
                                                    <div className='rounded bg-muted p-1.5'>
                                                        <p className='text-muted-foreground'>과목평균</p>
                                                        <p className='font-semibold'>{s.average || '-'}</p>
                                                    </div>
                                                    <div className='rounded bg-muted p-1.5'>
                                                        <p className='text-muted-foreground'>수강자수</p>
                                                        <p className='font-semibold'>{s.numberOfStudents || '-'}명</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
