'use client';

import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import { useMySchoolRecord, type SchoolRecordSubject, type SchoolRecordSelectSubject } from '@/apis/hooks/use-school-record';
import { useMemo, useState } from 'react';

const GRADE_SEMESTER_LABELS: Record<string, string> = {
    '1-1': '1학년 1학기',
    '1-2': '1학년 2학기',
    '2-1': '2학년 1학기',
    '2-2': '2학년 2학기',
    '3-1': '3학년 1학기',
    '3-2': '3학년 2학기',
};

function getRankingColor(ranking: number | undefined) {
    if (!ranking) return 'text-gray-400';
    if (ranking <= 2) return 'text-blue-600';
    if (ranking <= 4) return 'text-green-600';
    if (ranking <= 6) return 'text-yellow-600';
    if (ranking <= 8) return 'text-orange-600';
    return 'text-red-600';
}

function getRankingBgColor(ranking: number | undefined) {
    if (!ranking) return 'bg-gray-50 border-gray-200';
    if (ranking <= 2) return 'bg-blue-50 border-blue-200';
    if (ranking <= 4) return 'bg-green-50 border-green-200';
    if (ranking <= 6) return 'bg-yellow-50 border-yellow-200';
    if (ranking <= 8) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
}

function SubjectCard({ subject }: { subject: SchoolRecordSubject }) {
    const detailText = subject.note;

    return (
        <div className={`rounded-lg border p-4 ${getRankingBgColor(subject.gradeRank)} transition-all hover:shadow-md`}>
            <div className='flex items-start justify-between'>
                <div className='flex-1'>
                    <p className='text-xs text-muted-foreground'>
                        {subject.subjectGroup?.name || '교과'}
                    </p>
                    <p className='font-semibold text-sm'>{subject.subjectName}</p>
                </div>
                {subject.gradeRank && (
                    <span className={`text-lg font-bold ${getRankingColor(subject.gradeRank)}`}>
                        {subject.gradeRank}등급
                    </span>
                )}
            </div>
            <div className='mt-2 grid grid-cols-4 gap-1 text-xs'>
                <div className='text-center'>
                    <p className='text-muted-foreground'>원점수</p>
                    <p className='font-semibold'>{subject.score}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground'>평균</p>
                    <p className='font-semibold'>{subject.average}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground'>표준편차</p>
                    <p className='font-semibold'>{subject.standardDeviation}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground'>수강자</p>
                    <p className='font-semibold'>{subject.numberOfStudents}명</p>
                </div>
            </div>
            {/* 세특 내용 (note 필드) */}
            {detailText && (
                <div className='mt-3 rounded bg-white/60 p-2.5 text-xs leading-relaxed text-gray-700'>
                    <p className='font-semibold text-gray-500 mb-1'>📝 세부능력 및 특기사항</p>
                    {detailText}
                </div>
            )}
            {!detailText && (
                <p className='mt-2 text-xs text-gray-400 italic'>
                    세특 내용이 아직 입력되지 않았습니다.
                </p>
            )}
        </div>
    );
}

function SelectSubjectCard({ subject }: { subject: SchoolRecordSelectSubject }) {
    const detailText = subject.note;

    return (
        <div className='rounded-lg border bg-purple-50 border-purple-200 p-4 transition-all hover:shadow-md'>
            <div className='flex items-start justify-between'>
                <div>
                    <p className='text-xs text-muted-foreground'>
                        {subject.subjectGroup?.name || '진로선택'}
                    </p>
                    <p className='font-semibold text-sm'>{subject.subjectName}</p>
                </div>
                <span className='rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700'>
                    {subject.achievement || '-'}
                </span>
            </div>
            {/* 세특 내용 */}
            {detailText && (
                <div className='mt-3 rounded bg-white/60 p-2.5 text-xs leading-relaxed text-gray-700'>
                    <p className='font-semibold text-gray-500 mb-1'>📝 세부능력 및 특기사항</p>
                    {detailText}
                </div>
            )}
            {!detailText && (
                <p className='mt-2 text-xs text-gray-400 italic'>
                    세특 내용이 아직 입력되지 않았습니다.
                </p>
            )}
        </div>
    );
}

export default function SetukPage() {
    const { data, isLoading, error, refetch } = useMySchoolRecord();
    const [selectedGrade, setSelectedGrade] = useState<string>('all');

    const subjectsByGradeSemester = useMemo(() => {
        if (!data?.subjects?.length) return {};
        const groups: Record<string, SchoolRecordSubject[]> = {};
        data.subjects.forEach((s) => {
            const key = `${s.grade}-${s.semester}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });
        return groups;
    }, [data]);

    const selectSubjectsByGrade = useMemo(() => {
        if (!data?.selectSubjects?.length) return {};
        const groups: Record<string, SchoolRecordSelectSubject[]> = {};
        data.selectSubjects.forEach((s) => {
            const key = `${s.grade}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });
        return groups;
    }, [data]);

    const filteredSubjects = useMemo(() => {
        if (selectedGrade === 'all') return subjectsByGradeSemester;
        const filtered: Record<string, SchoolRecordSubject[]> = {};
        Object.entries(subjectsByGradeSemester).forEach(([key, subjects]) => {
            if (key.startsWith(selectedGrade + '-')) {
                filtered[key] = subjects;
            }
        });
        return filtered;
    }, [selectedGrade, subjectsByGradeSemester]);

    const filteredSelectSubjects = useMemo(() => {
        if (selectedGrade === 'all') return selectSubjectsByGrade;
        const filtered: Record<string, SchoolRecordSelectSubject[]> = {};
        Object.entries(selectSubjectsByGrade).forEach(([key, subjects]) => {
            if (key === selectedGrade) {
                filtered[key] = subjects;
            }
        });
        return filtered;
    }, [selectedGrade, selectSubjectsByGrade]);

    if (isLoading) return <LoadingSection />;
    if (error) {
        return (
            <ErrorSection
                text='세특 데이터를 불러오는 중 오류가 발생했습니다.'
                onRetry={refetch}
            />
        );
    }

    const hasData =
        Object.keys(subjectsByGradeSemester).length > 0 ||
        Object.keys(selectSubjectsByGrade).length > 0;

    return (
        <div className='mt-5'>
            <div className='mx-auto w-full max-w-screen-lg py-4'>
                <div className='pb-4'>
                    <h3 className='text-lg font-medium'>📄 세부능력 및 특기사항</h3>
                    <p className='text-sm text-muted-foreground'>
                        생기부에 입력된 세특 내용을 학년·학기별로 확인하세요.
                    </p>
                </div>

                {!hasData ? (
                    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                        <p className='text-4xl pb-4'>📄</p>
                        <p className='text-lg font-semibold text-muted-foreground'>
                            세특 데이터가 없습니다
                        </p>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            입력 메뉴에서 생기부를 등록하면 세특 내용을 확인할 수 있습니다.
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* 학년 필터 */}
                        <div className='flex gap-2 mb-6'>
                            {['all', '1', '2', '3'].map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGrade(g)}
                                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selectedGrade === g
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                >
                                    {g === 'all' ? '전체' : `${g}학년`}
                                </button>
                            ))}
                        </div>

                        {/* 일반 교과 세특 */}
                        {Object.keys(filteredSubjects).length > 0 && (
                            <div className='mb-8'>
                                <h4 className='text-base font-semibold border-b pb-2 mb-4'>📚 교과 세특</h4>
                                <div className='space-y-6'>
                                    {Object.entries(filteredSubjects)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([key, subjects]) => (
                                            <div key={key}>
                                                <h5 className='text-sm font-semibold text-primary mb-3'>
                                                    {GRADE_SEMESTER_LABELS[key] || key}
                                                </h5>
                                                <div className='grid gap-3 md:grid-cols-2'>
                                                    {subjects.map((s) => (
                                                        <SubjectCard key={s.subjectName + s.grade + s.semester} subject={s} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* 진로선택 과목 세특 */}
                        {Object.keys(filteredSelectSubjects).length > 0 && (
                            <div>
                                <h4 className='text-base font-semibold border-b pb-2 mb-4'>🎯 진로선택 과목 세특</h4>
                                <div className='space-y-6'>
                                    {Object.entries(filteredSelectSubjects)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([key, subjects]) => (
                                            <div key={key}>
                                                <h5 className='text-sm font-semibold text-primary mb-3'>
                                                    {key}학년
                                                </h5>
                                                <div className='grid gap-3 md:grid-cols-2'>
                                                    {subjects.map((s) => (
                                                        <SelectSubjectCard key={s.subjectName + s.grade} subject={s} />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
