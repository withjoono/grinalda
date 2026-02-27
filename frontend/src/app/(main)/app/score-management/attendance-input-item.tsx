import { SchoolRecordAttendance } from '@/apis/hooks/use-school-record';
import { Input } from '@/components/ui/input';
import React from 'react';

export const AttendanceInputItem = ({
  attendanceItem,
  onChangeAttendanceValue,
}: {
  attendanceItem?: SchoolRecordAttendance | null;
  onChangeAttendanceValue: (type: string, value: string) => void;
}) => {
  return (
    <div className='flex items-center space-x-2'>
      <Input
        className='min-w-[80px] max-w-[80px]'
        placeholder='학년'
        type='number'
        value={attendanceItem?.grade || 0}
        disabled
      />
      <Input
        className='min-w-[80px] max-w-[80px]'
        placeholder='수업일수'
        type='number'
        min={0}
        onChange={(e) => onChangeAttendanceValue('totalDays', e.target.value)}
        value={attendanceItem?.totalDays || 0}
      />
      <div className='wf-ull flex min-w-[200px] max-w-[200px] items-center justify-around gap-2'>
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) =>
            onChangeAttendanceValue('absenceSick', e.target.value)
          }
          value={attendanceItem?.absenceSick || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) =>
            onChangeAttendanceValue('absenceUnexcused', e.target.value)
          }
          value={attendanceItem?.absenceUnexcused || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) =>
            onChangeAttendanceValue('absenceEtc', e.target.value)
          }
          value={attendanceItem?.absenceEtc || 0}
        />
      </div>
      <div className='wf-ull flex min-w-[200px] max-w-[200px] items-center justify-around gap-2'>
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) => onChangeAttendanceValue('tardySick', e.target.value)}
          value={attendanceItem?.tardySick || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) =>
            onChangeAttendanceValue('tardyUnexcused', e.target.value)
          }
          value={attendanceItem?.tardyUnexcused || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) => onChangeAttendanceValue('tardyEtc', e.target.value)}
          value={attendanceItem?.tardyEtc || 0}
        />
      </div>
      <div className='wf-ull flex min-w-[200px] max-w-[200px] items-center justify-around gap-2'>
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) => onChangeAttendanceValue('leaveSick', e.target.value)}
          value={attendanceItem?.leaveSick || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) =>
            onChangeAttendanceValue('leaveUnexcused', e.target.value)
          }
          value={attendanceItem?.leaveUnexcused || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) => onChangeAttendanceValue('leaveEtc', e.target.value)}
          value={attendanceItem?.leaveEtc || 0}
        />
      </div>
      <div className='wf-ull flex min-w-[200px] max-w-[200px] items-center justify-around gap-2'>
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) => onChangeAttendanceValue('cutSick', e.target.value)}
          value={attendanceItem?.cutSick || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) =>
            onChangeAttendanceValue('cutUnexcused', e.target.value)
          }
          value={attendanceItem?.cutUnexcused || 0}
        />
        <Input
          className='w-full'
          type='number'
          min={0}
          onChange={(e) => onChangeAttendanceValue('cutEtc', e.target.value)}
          value={attendanceItem?.cutEtc || 0}
        />
      </div>
    </div>
  );
};
