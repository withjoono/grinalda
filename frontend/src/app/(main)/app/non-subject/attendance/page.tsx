'use client';

import { useMySchoolRecord, SchoolRecordAttendance } from '@/apis/hooks/use-school-record';
import { LoadingSection } from '@/components/status/loading-section';
import { ErrorSection } from '@/components/status/error-section';

// 출결 상세 카드 (학년별)
function AttendanceDetailCard({ attendance }: { attendance: SchoolRecordAttendance }) {
    const hasUnexcused =
        attendance.absenceUnexcused > 0 ||
        attendance.tardyUnexcused > 0 ||
        attendance.leaveUnexcused > 0 ||
        attendance.cutUnexcused > 0;

    const totalAbsence =
        attendance.absenceSick + attendance.absenceUnexcused + attendance.absenceEtc;
    const totalTardy =
        attendance.tardySick + attendance.tardyUnexcused + attendance.tardyEtc;
    const totalLeave =
        attendance.leaveSick + attendance.leaveUnexcused + attendance.leaveEtc;
    const totalCut =
        attendance.cutSick + attendance.cutUnexcused + attendance.cutEtc;

    const isPerfect = totalAbsence === 0 && totalTardy === 0 && totalLeave === 0 && totalCut === 0;

    return (
        <div className='rounded-xl border bg-card p-5 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-lg font-semibold'>{attendance.grade}학년</h3>
                <div className='flex items-center gap-2'>
                    {isPerfect && (
                        <span className='rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'>
                            🎉 개근
                        </span>
                    )}
                    {hasUnexcused && (
                        <span className='rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700'>
                            ⚠️ 미인정 있음
                        </span>
                    )}
                    <span className='text-sm text-muted-foreground'>
                        수업일수: {attendance.totalDays}일
                    </span>
                </div>
            </div>

            {/* 요약 수치 */}
            <div className='mb-4 grid grid-cols-4 gap-3'>
                {[
                    { label: '결석', value: totalAbsence, color: totalAbsence > 0 ? 'text-red-600' : '' },
                    { label: '지각', value: totalTardy, color: totalTardy > 0 ? 'text-orange-600' : '' },
                    { label: '조퇴', value: totalLeave, color: totalLeave > 0 ? 'text-yellow-600' : '' },
                    { label: '결과', value: totalCut, color: totalCut > 0 ? 'text-purple-600' : '' },
                ].map((item) => (
                    <div
                        key={item.label}
                        className='rounded-lg bg-muted/50 p-3 text-center'
                    >
                        <p className='text-xs text-muted-foreground'>{item.label}</p>
                        <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>

            {/* 상세 테이블 */}
            <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                    <thead>
                        <tr className='border-b text-muted-foreground'>
                            <th className='pb-2 text-left font-medium'>구분</th>
                            <th className='pb-2 text-center font-medium'>질병</th>
                            <th className='pb-2 text-center font-medium'>미인정</th>
                            <th className='pb-2 text-center font-medium'>기타</th>
                            <th className='pb-2 text-center font-medium'>합계</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            {
                                label: '결석',
                                sick: attendance.absenceSick,
                                unexcused: attendance.absenceUnexcused,
                                etc: attendance.absenceEtc,
                                total: totalAbsence,
                            },
                            {
                                label: '지각',
                                sick: attendance.tardySick,
                                unexcused: attendance.tardyUnexcused,
                                etc: attendance.tardyEtc,
                                total: totalTardy,
                            },
                            {
                                label: '조퇴',
                                sick: attendance.leaveSick,
                                unexcused: attendance.leaveUnexcused,
                                etc: attendance.leaveEtc,
                                total: totalLeave,
                            },
                            {
                                label: '결과',
                                sick: attendance.cutSick,
                                unexcused: attendance.cutUnexcused,
                                etc: attendance.cutEtc,
                                total: totalCut,
                            },
                        ].map((row) => (
                            <tr key={row.label} className='border-b last:border-0'>
                                <td className='py-2 font-medium'>{row.label}</td>
                                <td className='py-2 text-center'>{row.sick}</td>
                                <td
                                    className={`py-2 text-center ${row.unexcused > 0 ? 'font-bold text-red-600' : ''
                                        }`}
                                >
                                    {row.unexcused}
                                </td>
                                <td className='py-2 text-center'>{row.etc}</td>
                                <td className='py-2 text-center font-semibold'>{row.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 특이사항 */}
            {attendance.note && (
                <div className='mt-4 rounded-lg bg-blue-50 p-3'>
                    <p className='text-xs font-medium text-blue-700'>특이사항</p>
                    <p className='mt-1 text-sm text-blue-900'>{attendance.note}</p>
                </div>
            )}
        </div>
    );
}

// 전체 요약 배너
function AttendanceSummaryBanner({
    attendances,
}: {
    attendances: SchoolRecordAttendance[];
}) {
    const totalUnexcused = attendances.reduce(
        (sum, a) =>
            sum +
            a.absenceUnexcused +
            a.tardyUnexcused +
            a.leaveUnexcused +
            a.cutUnexcused,
        0,
    );
    const totalAbsence = attendances.reduce(
        (sum, a) => sum + a.absenceSick + a.absenceUnexcused + a.absenceEtc,
        0,
    );
    const totalTardy = attendances.reduce(
        (sum, a) => sum + a.tardySick + a.tardyUnexcused + a.tardyEtc,
        0,
    );
    const isPerfect = attendances.every(
        (a) =>
            a.absenceSick + a.absenceUnexcused + a.absenceEtc === 0 &&
            a.tardySick + a.tardyUnexcused + a.tardyEtc === 0 &&
            a.leaveSick + a.leaveUnexcused + a.leaveEtc === 0 &&
            a.cutSick + a.cutUnexcused + a.cutEtc === 0,
    );

    return (
        <div
            className={`rounded-xl p-5 ${isPerfect
                    ? 'bg-green-50 border border-green-200'
                    : totalUnexcused > 0
                        ? 'bg-red-50 border border-red-200'
                        : 'bg-blue-50 border border-blue-200'
                }`}
        >
            <div className='flex items-center justify-between'>
                <div>
                    <h2 className='text-lg font-bold'>
                        {isPerfect
                            ? '🎉 전 학년 개근!'
                            : totalUnexcused > 0
                                ? `⚠️ 미인정 ${totalUnexcused}건`
                                : '📋 출결 요약'}
                    </h2>
                    <p className='mt-1 text-sm text-muted-foreground'>
                        전체 결석 {totalAbsence}일 · 지각 {totalTardy}회
                    </p>
                </div>
                <div className='text-3xl'>
                    {isPerfect ? '✨' : totalUnexcused > 0 ? '📌' : '📊'}
                </div>
            </div>
        </div>
    );
}

export default function AttendancePage() {
    const { data, isLoading, isError, refetch } = useMySchoolRecord();

    if (isLoading) return <LoadingSection />;
    if (isError || !data)
        return <ErrorSection text='출결 정보를 불러오지 못했습니다.' onRetry={() => refetch()} />;

    const attendances = data.attendances || [];

    if (attendances.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center py-20 text-center'>
                <p className='text-4xl'>📋</p>
                <p className='mt-4 text-lg font-semibold'>출결 정보가 없습니다</p>
                <p className='mt-2 text-sm text-muted-foreground'>
                    생활기록부를 업로드하면 출결 정보가 자동으로 표시됩니다.
                </p>
            </div>
        );
    }

    const sortedAttendances = [...attendances].sort((a, b) => a.grade - b.grade);

    return (
        <div className='space-y-6'>
            <div>
                <h1 className='text-2xl font-bold'>출결</h1>
                <p className='mt-1 text-sm text-muted-foreground'>
                    학년별 출결 현황을 확인합니다.
                </p>
            </div>

            <AttendanceSummaryBanner attendances={sortedAttendances} />

            <div className='space-y-4'>
                {sortedAttendances.map((attendance) => (
                    <AttendanceDetailCard key={attendance.grade} attendance={attendance} />
                ))}
            </div>
        </div>
    );
}
