import { ColumnDef } from '@tanstack/react-table';
import { cn, formatDateYYYYMMDDHHMMSS } from '@/lib/utils';
import { Member } from '@/api2/types/member';

const convertBufferToBoolean = (buffer: { type: 'Buffer'; data: number[] }): boolean => {
  if (typeof buffer === 'boolean') {
    return buffer;
  }
  return buffer.data[0] === 1;
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'nickname',
    header: '유저 이름',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('nickname')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: '유저 이메일',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('email')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'phone',
    header: '휴대폰 번호',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('phone')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'ck_sms',
    header: 'SMS 인증 여부',
    cell: ({ row }) => {
      const value = row.getValue('ck_sms') as { type: 'Buffer'; data: number[] };
      const isVerified = convertBufferToBoolean(value);
      return (
        <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
          {isVerified ? '인증됨' : '인증 안됨'}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'ck_sms_agree',
    header: 'SMS 수신동의',
    cell: ({ row }) => {
      const value = row.getValue('ck_sms_agree') as { type: 'Buffer'; data: number[] };
      const isAgreed = convertBufferToBoolean(value);
      return (
        <div
          className={cn(
            'line-clamp-2 w-[100px] text-center hover:line-clamp-none',
            isAgreed ? 'text-blue-500' : 'text-red-500'
          )}
        >
          {isAgreed ? '동의' : '미동의'}
        </div>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'provider_type',
    header: 'OAuth 공급자',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('provider_type') ?? 'N/A'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 's_type_id',
    header: '학생타입분류ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('s_type_id') ?? 'N/A'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'hst_type_id',
    header: '고등학교분류ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('hst_type_id') ?? 'N/A'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'g_type_id',
    header: '학년타입분류ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('g_type_id') ?? 'N/A'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'graduate_year',
    header: '졸업예정년도',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('graduate_year') ?? 'N/A'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'major',
    header: '문과/이과 구분',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-2 w-[100px] text-center hover:line-clamp-none',
          row.getValue('major') === 'LiberalArts'
            ? 'text-green-500'
            : row.getValue('major') === 'NaturalSciences'
              ? 'text-blue-500'
              : 'text-red-500'
        )}
      >
        {row.getValue('major') === 'LiberalArts'
          ? '문과'
          : row.getValue('major') === 'NaturalSciences'
            ? '이과'
            : 'N/A'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'account_stop_yn',
    header: '정지 여부',
    cell: ({ row }) => (
      <div
        className={cn(
          'line-clamp-2 w-[100px] text-center hover:line-clamp-none',
          row.getValue('account_stop_yn') === 'Y' ? 'text-red-500' : 'text-green-500'
        )}
      >
        {row.getValue('account_stop_yn') === 'Y' ? '정지' : '활성'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'create_dt',
    header: '생성 날짜',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('create_dt')))}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'update_dt',
    header: '업데이트 날짜',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('update_dt')))}
      </div>
    ),
    enableSorting: true,
  },
];
