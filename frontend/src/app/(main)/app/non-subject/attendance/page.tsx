'use client';

import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';
import {
    useMySchoolRecord,
    type SchoolRecordAttendance,
} from '@/apis/hooks/use-school-record';
import { useMemo } from 'react';

const GRADE_LABELS: Record<number, string> = {
    1: '1학년',
    2: '2학년',
    3: '3학년',
};

function AttendanceSummaryBanner({
    attendances,
}: {
    attendances: SchoolRecordAttendance[];
}) {
    const totals = useMemo(() => {
        let totalAbsence = 0;
        let totalTardy = 0;
        let totalLeave = 0;
        let totalCut = 0;
        let totalUnexcused = 0;

        attendances.forEach((a) => {
            totalAbsence +=
                (a.absenceSick || 0) +
                (a.absenceUnexcused || 0) +
                (a.absenceEtc || 0);
            totalTardy +=
                (a.tardySick || 0) + (a.tardyUnexcused || 0) + (a.tardyEtc || 0);
            totalLeave +=
                (a.leaveSick || 0) + (a.leaveUnexcused || 0) + (a.leaveEtc || 0);
            totalCut +=
                (a.cutSick || 0) + (a.cutUnexcused || 0) + (a.cutEtc || 0);
            totalUnexcused +=
                (a.absenceUnexcused || 0) +
                (a.tardyUnexcused || 0) +
                (a.leaveUnexcused || 0) +
                (a.cutUnexcused || 0);
        });
        return { totalAbsence, totalTardy, totalLeave, totalCut, totalUnexcused };
    }, [attendances]);

    const hasWarning = totals.totalUnexcused > 0;

    return (
        <div
            className={`rounded-xl p-6 ${hasWarning ? 'bg-red-50 border border-red-200' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100'}`}
        >
            <div className='flex items-center gap-2 mb-4'>
                <span className='text-2xl'>📋</span>
                <h3 className='text-lg font-bold'>출결 현황 요약</h3>
                {hasWarning && (
                    <span className='ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700'>
                        ⚠️ 무단 {totals.totalUnexcused}건
                    </span>
                )}
            </div>
            <div className='grid grid-cols-4 gap-4'>
                {[
                    {
                        label: '결석',
                        value: totals.totalAbsence,
                        color: totals.totalAbsence > 0 ? 'text-red-600' : 'text-green-600',
                    },
                    {
                        label: '지각',
                        value: totals.totalTardy,
                        color:
                            totals.totalTardy > 0 ? 'text-orange-600' : 'text-green-600',
                    },
                    {
                        label: '조퇴',
                        value: totals.totalLeave,
                        color:
                            totals.totalLeave > 0 ? 'text-yellow-600' : 'text-green-600',
                    },
                    {
                        label: '결과',
                        value: totals.totalCut,
                        color: totals.totalCut > 0 ? 'text-purple-600' : 'text-green-600',
                    },
                ].map((item) => (
                    <div key={item.label} className='text-center'>
                        <p className='text-sm text-muted-foreground'>{item.label}</p>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AttendanceDetailCard({
    attendance,
}: {
    attendance: SchoolRecordAttendance;
}) {
    const rows = [
        {
            label: '결석',
            sick: attendance.absenceSick || 0,
            unexcused: attendance.absenceUnexcused || 0,
            etc: attendance.absenceEtc || 0,
        },
        {
            label: '지각',
            sick: attendance.tardySick || 0,
            unexcused: attendance.tardyUnexcused || 0,
            etc: attendance.tardyEtc || 0,
        },
        {
            label: '조퇴',
            sick: attendance.leaveSick || 0,
            unexcused: attendance.leaveUnexcused || 0,
            etc: attendance.leaveEtc || 0,
        },
        {
            label: '결과',
            sick: attendance.cutSick || 0,
            unexcused: attendance.cutUnexcused || 0,
            etc: attendance.cutEtc || 0,
        },
    ];

    return (
        <div className='rounded-lg border bg-card p-4 transition-all hover:shadow-md'>
            <div className='flex items-center justify-between mb-3'>
                <h5 className='font-semibold'>
                    {GRADE_LABELS[attendance.grade]}
                </h5>
                <span className='text-xs text-muted-foreground'>
                    수업일수: {attendance.totalDays}일
                </span>
            </div>
            <table className='w-full text-sm'>
                <thead>
                    <tr className='text-muted-foreground text-xs'>
                        <th className='pb-2 text-left'>구분</th>
                        <th className='pb-2 text-center'>질병</th>
                        <th className='pb-2 text-center'>무단</th>
                        <th className='pb-2 text-center'>기타</th>
                        <th className='pb-2 text-center'>합계</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label} className='border-t'>
                            <td className='py-2 font-medium'>{row.label}</td>
                            <td className='py-2 text-center'>{row.sick}</td>
                            <td
                                className={`py-2 text-center ${row.unexcused > 0 ? 'text-red-600 font-bold' : ''}`}
                            >
                                {row.unexcused}
                            </td>
                            <td className='py-2 text-center'>{row.etc}</td>
                            <td className='py-2 text-center font-semibold'>
                                {row.sick + row.unexcused + row.etc}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function AttendancePage() {
    const { data: schoolRecord, isLoading, isError, refetch } = useMySchoolRecord();

    if (isLoading) return <LoadingSection />;
    if (isError) return <ErrorSection onRetry={refetch} />;

    const attendances = schoolRecord?.attendances ?? [];
    const sortedAttendances = [...attendances].sort(
        (a, b) => a.grade - b.grade
    );

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-bold'>출결 현황</h2>
                <p className='text-sm text-muted-foreground mt-1'>
                    학년별 출결 상세 내역입니다.
                </p>
            </div>

            {sortedAttendances.length === 0 ? (
                <div className='rounded-lg border bg-muted/30 p-8 text-center'>
                    <p className='text-muted-foreground'>
                        출결 데이터가 없습니다. 생활기록부를 먼저 업로드해주세요.
                    </p>
                </div>
            ) : (
                <>
                    <AttendanceSummaryBanner attendances={sortedAttendances} />
                    <div className='grid gap-4 md:grid-cols-3'>
                        {sortedAttendances.map((attendance) => (
                            <AttendanceDetailCard
                                key={attendance.grade}
                                attendance={attendance}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
