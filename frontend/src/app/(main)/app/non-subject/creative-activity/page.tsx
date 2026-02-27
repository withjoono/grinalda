'use client';

import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import {
    useMySchoolRecord,
    type SchoolRecordAttendance,
    type SchoolRecordCreativeActivity,
    type SchoolRecordBehaviorOpinion,
} from '@/apis/hooks/use-school-record';
import { useMemo, useState } from 'react';

const GRADE_LABELS: Record<number, string> = {
    1: '1학년',
    2: '2학년',
    3: '3학년',
};

// 활동 유형 매핑
const ACTIVITY_TYPE_INFO: Record<string, { label: string; emoji: string; description: string }> = {
    자치활동: { label: '자치활동', emoji: '🏛️', description: '학급회, 학생회, 자치법정 등' },
    자율활동: { label: '자율활동', emoji: '🏛️', description: '학급회, 학생회, 자치법정 등' },
    동아리활동: { label: '동아리활동', emoji: '🎭', description: '교내 동아리, 자율동아리 등' },
    봉사활동: { label: '봉사활동', emoji: '❤️', description: '교내외 봉사, 캠페인 등' },
    진로활동: { label: '진로활동', emoji: '🧭', description: '진로체험, 진로상담, 진로적성검사 등' },
};

// 출결 요약 카드
function AttendanceSummaryCard({ attendance }: { attendance: SchoolRecordAttendance }) {
    const totalAbsence = (attendance.absenceSick || 0) + (attendance.absenceUnexcused || 0) + (attendance.absenceEtc || 0);
    const totalTardy = (attendance.tardySick || 0) + (attendance.tardyUnexcused || 0) + (attendance.tardyEtc || 0);
    const totalLeave = (attendance.leaveSick || 0) + (attendance.leaveUnexcused || 0) + (attendance.leaveEtc || 0);
    const totalCut = (attendance.cutSick || 0) + (attendance.cutUnexcused || 0) + (attendance.cutEtc || 0);
    const hasUnexcused = (attendance.absenceUnexcused || 0) > 0 || (attendance.tardyUnexcused || 0) > 0;

    return (
        <div className={`rounded-lg border p-4 ${hasUnexcused ? 'border-red-200 bg-red-50' : 'bg-card'} transition-all hover:shadow-md`}>
            <div className='flex items-center justify-between mb-3'>
                <h5 className='font-semibold'>{GRADE_LABELS[attendance.grade]}</h5>
                <span className='text-xs text-muted-foreground'>수업일수: {attendance.totalDays}일</span>
            </div>
            <div className='grid grid-cols-4 gap-2 text-center text-xs'>
                <div className='rounded bg-white/60 p-2'>
                    <p className='text-muted-foreground'>결석</p>
                    <p className={`font-bold text-lg ${totalAbsence > 0 ? 'text-red-600' : 'text-green-600'}`}>{totalAbsence}</p>
                    {(attendance.absenceUnexcused || 0) > 0 && <p className='text-red-500 text-[10px]'>무단 {attendance.absenceUnexcused}</p>}
                </div>
                <div className='rounded bg-white/60 p-2'>
                    <p className='text-muted-foreground'>지각</p>
                    <p className={`font-bold text-lg ${totalTardy > 0 ? 'text-orange-600' : 'text-green-600'}`}>{totalTardy}</p>
                    {(attendance.tardyUnexcused || 0) > 0 && <p className='text-red-500 text-[10px]'>무단 {attendance.tardyUnexcused}</p>}
                </div>
                <div className='rounded bg-white/60 p-2'>
                    <p className='text-muted-foreground'>조퇴</p>
                    <p className={`font-bold text-lg ${totalLeave > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{totalLeave}</p>
                </div>
                <div className='rounded bg-white/60 p-2'>
                    <p className='text-muted-foreground'>결과</p>
                    <p className={`font-bold text-lg ${totalCut > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{totalCut}</p>
                </div>
            </div>
        </div>
    );
}

// 창체 활동 카드
function ActivityCard({ activity }: { activity: SchoolRecordCreativeActivity }) {
    const info = ACTIVITY_TYPE_INFO[activity.activityType] || {
        label: activity.activityType,
        emoji: '📌',
        description: '',
    };

    return (
        <div className='rounded-lg border bg-card p-4 transition-all hover:shadow-md'>
            <div className='flex items-start gap-2'>
                <span className='text-xl'>{info.emoji}</span>
                <div className='flex-1'>
                    <p className='font-semibold text-sm'>{info.label}</p>
                    {activity.content ? (
                        <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                            {activity.content}
                        </p>
                    ) : (
                        <p className='mt-2 text-xs text-gray-400 italic'>내용 없음</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// 행동특성 카드
function BehaviorCard({ opinion }: { opinion: SchoolRecordBehaviorOpinion }) {
    return (
        <div className='rounded-lg border bg-amber-50 border-amber-200 p-4 transition-all hover:shadow-md'>
            <div className='flex items-center gap-2 mb-2'>
                <span className='text-lg'>💬</span>
                <h5 className='font-semibold'>{GRADE_LABELS[opinion.grade]}</h5>
            </div>
            {opinion.content ? (
                <p className='text-sm leading-relaxed text-gray-700'>
                    {opinion.content}
                </p>
            ) : (
                <p className='text-xs text-gray-400 italic'>내용 없음</p>
            )}
        </div>
    );
}

type TabType = 'attendance' | 'creative' | 'behavior';

export default function CreativeActivityPage() {
    const { data, isLoading, error, refetch } = useMySchoolRecord();
    const [activeTab, setActiveTab] = useState<TabType>('creative');

    const tabs: { key: TabType; label: string; emoji: string }[] = [
        { key: 'creative', label: '창체활동', emoji: '🎨' },
        { key: 'attendance', label: '출결', emoji: '📋' },
        { key: 'behavior', label: '행동특성 및 종합의견', emoji: '💬' },
    ];

    const hasAttendance = useMemo(() => (data?.attendances?.length ?? 0) > 0, [data]);
    const hasCreativeActivities = useMemo(() => (data?.creativeActivities?.length ?? 0) > 0, [data]);
    const hasBehaviorOpinions = useMemo(() => (data?.behaviorOpinions?.length ?? 0) > 0, [data]);

    // 창체 활동을 학년별로 그룹핑
    const activitiesByGrade = useMemo(() => {
        if (!data?.creativeActivities?.length) return {};
        const groups: Record<number, SchoolRecordCreativeActivity[]> = {};
        data.creativeActivities.forEach((a) => {
            if (!groups[a.grade]) groups[a.grade] = [];
            groups[a.grade].push(a);
        });
        return groups;
    }, [data]);

    if (isLoading) return <LoadingSection />;
    if (error) {
        return (
            <ErrorSection
                text='데이터를 불러오는 중 오류가 발생했습니다.'
                onRetry={refetch}
            />
        );
    }

    return (
        <div className='mt-5'>
            <div className='mx-auto w-full max-w-screen-lg py-4'>
                <div className='pb-4'>
                    <h3 className='text-lg font-medium'>🎨 창체·행특</h3>
                    <p className='text-sm text-muted-foreground'>
                        창의적 체험활동, 출결, 행동특성 및 종합의견을 확인하세요.
                    </p>
                </div>

                {/* 탭 */}
                <div className='flex border-b mb-6'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <span>{tab.emoji}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* 창체활동 탭 */}
                {activeTab === 'creative' && (
                    <div>
                        {hasCreativeActivities ? (
                            <div className='space-y-6'>
                                {Object.entries(activitiesByGrade)
                                    .sort(([a], [b]) => Number(a) - Number(b))
                                    .map(([grade, activities]) => (
                                        <div key={grade}>
                                            <h5 className='text-sm font-semibold text-primary mb-3'>
                                                {GRADE_LABELS[Number(grade)]}
                                            </h5>
                                            <div className='grid gap-3 md:grid-cols-2'>
                                                {activities.map((a) => (
                                                    <ActivityCard key={a.id} activity={a} />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                                <p className='text-4xl pb-4'>🎨</p>
                                <p className='text-lg font-semibold text-muted-foreground'>
                                    창의적 체험활동 데이터가 없습니다
                                </p>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                    입력 메뉴에서 생기부를 업로드하면 자동으로 불러옵니다.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 출결 탭 */}
                {activeTab === 'attendance' && (
                    <div>
                        {hasAttendance ? (
                            <div className='grid gap-4 md:grid-cols-3'>
                                {data!.attendances
                                    .sort((a, b) => a.grade - b.grade)
                                    .map((att) => (
                                        <AttendanceSummaryCard
                                            key={att.grade}
                                            attendance={att}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                                <p className='text-4xl pb-4'>📋</p>
                                <p className='text-lg font-semibold text-muted-foreground'>
                                    출결 데이터가 없습니다
                                </p>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                    입력 메뉴에서 출결 정보를 입력해주세요.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 행동특성 탭 */}
                {activeTab === 'behavior' && (
                    <div>
                        {hasBehaviorOpinions ? (
                            <div className='space-y-4'>
                                {data!.behaviorOpinions
                                    .sort((a, b) => a.grade - b.grade)
                                    .map((opinion) => (
                                        <BehaviorCard key={opinion.id} opinion={opinion} />
                                    ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                                <p className='text-4xl pb-4'>💬</p>
                                <p className='text-lg font-semibold text-muted-foreground'>
                                    행동특성 및 종합의견 데이터가 없습니다
                                </p>
                                <p className='mt-2 text-sm text-muted-foreground'>
                                    입력 메뉴에서 생기부를 업로드하면 자동으로 불러옵니다.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
