'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { RoleBadge } from '@/components/badges/role-badge';
import { GradeBadge } from '@/components/badges/grade-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatarFallback } from '@/lib/utils';
import { AccountForAdmin } from '@/apis/hooks/admin/use-admin-accounts';

export const columns: ColumnDef<AccountForAdmin>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[40px]'>
        <Badge variant='outline'>{row.getValue('id')}</Badge>
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'profile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='프로필' />
    ),
    cell: ({ row }) => (
      <div className='w-[40px]'>
        <Avatar>
          <AvatarFallback>
            {generateAvatarFallback(row.original.user.name)}
          </AvatarFallback>
          <AvatarImage
            src={row.original.user.profileImage || ''}
            alt={`${row.original.id}-avatar`}
          />
        </Avatar>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='이름' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span className='font-medium'>{row.original.user.name}</span>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return row.original.user.name.toString().includes(value);
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='이메일' />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('email')}</div>;
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='권한' />
    ),
    cell: ({ row }) => {
      return <RoleBadge role={row.original.role} />;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'grade',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='학년' />
    ),
    cell: ({ row }) => {
      return <GradeBadge grade={row.original.user.grade} />;
    },
    filterFn: (row, _, value) => {
      return value.includes(row.original.user.grade.toString());
    },
  },
  {
    accessorKey: 'marketingConsent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='마케팅 동의' />
    ),
    cell: ({ row }) => {
      const consent = row.original.termsAgreement.marketingConsent;
      return (
        <div>
          <Badge variant={consent ? 'default' : 'secondary'}>
            {consent ? '동의' : '미동의'}
          </Badge>
          <p className='text-xs text-muted-foreground'>
            {new Date(row.original.termsAgreement.agreedAt).toLocaleDateString(
              'ko-KR'
            )}
          </p>
        </div>
      );
    },
    filterFn: (row, _, value) => {
      return value.includes(
        row.original.termsAgreement.marketingConsent.toString()
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='가입일' />
    ),
    cell: ({ row }) => {
      return (
        <div className='w-[90px]'>
          {new Date(row.getValue('createdAt')).toLocaleDateString('ko-KR')}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
