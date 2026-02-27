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

// 출결 상세 카드
function AttendanceDetailCard({ attendance }: { attendance: SchoolRecordAttendance }) {
    const totalAbsence = (attendance.absenceSick || 0) + (attendance.absenceUnexcused || 0) + (attendance.absenceEtc || 0);
    const totalTardy = (attendance.tardySick || 0) + (attendance.tardyUnexcused || 0) + (attendance.tardyEtc || 0);
    const totalLeave = (attendance.leaveSick || 0) + (attendance.leaveUnexcused || 0) + (attendance.leaveEtc || 0);
    const totalCut = (attendance.cutSick || 0) + (attendance.cutUnexcused || 0) + (attendance.cutEtc || 0);
    const hasUnexcused =
        (attendance.absenceUnexcused || 0) > 0 ||
        (attendance.tardyUnexcused || 0) > 0 ||
        (attendance.leaveUnexcused || 0) > 0 ||
        (attendance.cutUnexcused || 0) > 0;

    const totalIssues = totalAbsence + totalTardy + totalLeave + totalCut;

    return (
        <div className={`rounded-xl border p-5 ${hasUnexcused ? 'border-red-200 bg-red-50/50' : 'bg-card'} transition-all hover:shadow-md`}>
            {/* 헤더 */}
            <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                    <span className='text-lg'>📋</span>
                    <h4 className='text-base font-semibold'>{GRADE_LABELS[attendance.grade]}</h4>
                </div>
                <div className='flex items-center gap-3'>
                    <span className='text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full'>
                        수업일수 {attendance.totalDays}일
                    </span>
                    {totalIssues === 0 && (
                        <span className='text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium'>
                            ✓ 개근
                        </span>
                    )}
                </div>
            </div>

            {/* 요약 카드 */}
            <div className='grid grid-cols-4 gap-3 mb-4'>
                <div className='rounded-lg bg-white/70 border p-3 text-center'>
                    <p className='text-xs text-muted-foreground mb-1'>결석</p>
                    <p className={`font-bold text-xl ${totalAbsence > 0 ? 'text-red-600' : 'text-green-600'}`}>{totalAbsence}</p>
                </div>
                <div className='rounded-lg bg-white/70 border p-3 text-center'>
                    <p className='text-xs text-muted-foreground mb-1'>지각</p>
                    <p className={`font-bold text-xl ${totalTardy > 0 ? 'text-orange-600' : 'text-green-600'}`}>{totalTardy}</p>
                </div>
                <div className='rounded-lg bg-white/70 border p-3 text-center'>
                    <p className='text-xs text-muted-foreground mb-1'>조퇴</p>
                    <p className={`font-bold text-xl ${totalLeave > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{totalLeave}</p>
                </div>
                <div className='rounded-lg bg-white/70 border p-3 text-center'>
                    <p className='text-xs text-muted-foreground mb-1'>결과</p>
                    <p className={`font-bold text-xl ${totalCut > 0 ? 'text-yellow-600' : 'text-green-600'}`}>{totalCut}</p>
                </div>
            </div>

            {/* 상세 분류 테이블 */}
            {totalIssues > 0 && (
                <div className='rounded-lg border bg-white/50 overflow-hidden'>
                    <table className='w-full text-xs'>
                        <thead>
                            <tr className='bg-muted/50'>
                                <th className='text-left py-2 px-3 font-medium text-muted-foreground'>구분</th>
                                <th className='text-center py-2 px-3 font-medium text-muted-foreground'>질병</th>
                                <th className='text-center py-2 px-3 font-medium text-muted-foreground'>미인정</th>
                                <th className='text-center py-2 px-3 font-medium text-muted-foreground'>기타</th>
                                <th className='text-center py-2 px-3 font-medium text-muted-foreground'>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {totalAbsence > 0 && (
                                <tr className='border-t'>
                                    <td className='py-2 px-3 font-medium'>결석</td>
                                    <td className='text-center py-2 px-3'>{attendance.absenceSick || 0}</td>
                                    <td className={`text-center py-2 px-3 ${(attendance.absenceUnexcused || 0) > 0 ? 'text-red-600 font-bold' : ''}`}>
                                        {attendance.absenceUnexcused || 0}
                                    </td>
                                    <td className='text-center py-2 px-3'>{attendance.absenceEtc || 0}</td>
                                    <td className='text-center py-2 px-3 font-semibold'>{totalAbsence}</td>
                                </tr>
                            )}
                            {totalTardy > 0 && (
                                <tr className='border-t'>
                                    <td className='py-2 px-3 font-medium'>지각</td>
                                    <td className='text-center py-2 px-3'>{attendance.tardySick || 0}</td>
                                    <td className={`text-center py-2 px-3 ${(attendance.tardyUnexcused || 0) > 0 ? 'text-red-600 font-bold' : ''}`}>
                                        {attendance.tardyUnexcused || 0}
                                    </td>
                                    <td className='text-center py-2 px-3'>{attendance.tardyEtc || 0}</td>
                                    <td className='text-center py-2 px-3 font-semibold'>{totalTardy}</td>
                                </tr>
                            )}
                            {totalLeave > 0 && (
                                <tr className='border-t'>
                                    <td className='py-2 px-3 font-medium'>조퇴</td>
                                    <td className='text-center py-2 px-3'>{attendance.leaveSick || 0}</td>
                                    <td className={`text-center py-2 px-3 ${(attendance.leaveUnexcused || 0) > 0 ? 'text-red-600 font-bold' : ''}`}>
                                        {attendance.leaveUnexcused || 0}
                                    </td>
                                    <td className='text-center py-2 px-3'>{attendance.leaveEtc || 0}</td>
                                    <td className='text-center py-2 px-3 font-semibold'>{totalLeave}</td>
                                </tr>
                            )}
                            {totalCut > 0 && (
                                <tr className='border-t'>
                                    <td className='py-2 px-3 font-medium'>결과</td>
                                    <td className='text-center py-2 px-3'>{attendance.cutSick || 0}</td>
                                    <td className={`text-center py-2 px-3 ${(attendance.cutUnexcused || 0) > 0 ? 'text-red-600 font-bold' : ''}`}>
                                        {attendance.cutUnexcused || 0}
                                    </td>
                                    <td className='text-center py-2 px-3'>{attendance.cutEtc || 0}</td>
                                    <td className='text-center py-2 px-3 font-semibold'>{totalCut}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* 미인정 경고 */}
            {hasUnexcused && (
                <div className='mt-3 flex items-center gap-2 rounded-lg bg-red-100 border border-red-200 px-3 py-2 text-xs text-red-700'>
                    <span>⚠️</span>
                    <span>미인정(무단) 출결 사항이 있습니다. 대학 입시에 불리하게 작용할 수 있습니다.</span>
                </div>
            )}

            {/* 특기사항 */}
            {attendance.note && (
                <div className='mt-3 rounded-lg bg-white/60 border p-3'>
                    <p className='text-xs font-semibold text-muted-foreground mb-1'>📝 특기사항</p>
                    <p className='text-sm leading-relaxed text-gray-700'>{attendance.note}</p>
                </div>
            )}
        </div>
    );
}

// 전체 요약 배너
function AttendanceSummaryBanner({ attendances }: { attendances: SchoolRecordAttendance[] }) {
    const totals = useMemo(() => {
        let absence = 0, tardy = 0, leave = 0, cut = 0, unexcused = 0;
        attendances.forEach((a) => {
            absence += (a.absenceSick || 0) + (a.absenceUnexcused || 0) + (a.absenceEtc || 0);
            tardy += (a.tardySick || 0) + (a.tardyUnexcused || 0) + (a.tardyEtc || 0);
            leave += (a.leaveSick || 0) + (a.leaveUnexcused || 0) + (a.leaveEtc || 0);
            cut += (a.cutSick || 0) + (a.cutUnexcused || 0) + (a.cutEtc || 0);
            unexcused += (a.absenceUnexcused || 0) + (a.tardyUnexcused || 0) + (a.leaveUnexcused || 0) + (a.cutUnexcused || 0);
        });
        return { absence, tardy, leave, cut, unexcused, total: absence + tardy + leave + cut };
    }, [attendances]);

    const isPerfect = totals.total === 0;

    return (
        <div className={`rounded-xl border p-5 mb-6 ${isPerfect ? 'bg-green-50 border-green-200' : totals.unexcused > 0 ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <span className='text-2xl'>{isPerfect ? '🏆' : totals.unexcused > 0 ? '⚠️' : '📊'}</span>
                    <div>
                        <h4 className='font-semibold'>
                            {isPerfect ? '전 학년 개근!' : '전체 출결 현황'}
                        </h4>
                        <p className='text-xs text-muted-foreground'>
                            {isPerfect
                                ? '출결 관련 감점 요인이 없습니다.'
                                : `총 ${totals.total}건 (결석 ${totals.absence} · 지각 ${totals.tardy} · 조퇴 ${totals.leave} · 결과 ${totals.cut})`}
                        </p>
                    </div>
                </div>
                {totals.unexcused > 0 && (
                    <span className='text-xs text-red-700 bg-red-100 px-3 py-1.5 rounded-full font-medium'>
                        미인정 {totals.unexcused}건
                    </span>
                )}
            </div>
        </div>
    );
}

export default function AttendancePage() {
    const { data, isLoading, error, refetch } = useMySchoolRecord();

    const hasAttendance = useMemo(() => (data?.attendances?.length ?? 0) > 0, [data]);

    if (isLoading) return <LoadingSection />;
    if (error) {
        return (
            <ErrorSection
                text='출결 데이터를 불러오는 중 오류가 발생했습니다.'
                onRetry={refetch}
            />
        );
    }

    return (
        <div className='mt-5'>
            <div className='mx-auto w-full max-w-screen-lg py-4'>
                <div className='pb-4'>
                    <h3 className='text-lg font-medium'>📋 출결 현황</h3>
                    <p className='text-sm text-muted-foreground'>
                        학년별 출결 상세 내역을 확인하세요.
                    </p>
                </div>

                {hasAttendance ? (
                    <div>
                        <AttendanceSummaryBanner attendances={data!.attendances} />
                        <div className='space-y-4'>
                            {data!.attendances
                                .sort((a, b) => a.grade - b.grade)
                                .map((att) => (
                                    <AttendanceDetailCard
                                        key={att.grade}
                                        attendance={att}
                                    />
                                ))}
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center'>
                        <p className='text-4xl pb-4'>📋</p>
                        <p className='text-lg font-semibold text-muted-foreground'>
                            출결 데이터가 없습니다
                        </p>
                        <p className='mt-2 text-sm text-muted-foreground'>
                            입력 메뉴에서 생기부를 업로드하면 자동으로 불러옵니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
