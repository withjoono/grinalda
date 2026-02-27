'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Button } from '@/components/ui/button';
import { EarlyAdmissionListItem } from '@/apis/hooks/use-early-admissions';

export const columns: ColumnDef<EarlyAdmissionListItem>[] = [
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
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='연도' />
    ),
    cell: ({ row, column }) => {
      const year = row.original.year.toString();
      const filterValue = (column.getFilterValue() as string[]) || [];
      const isSelected = filterValue.includes(year);
      return (
        <div className='w-[40px]'>
          <Badge
            variant={isSelected ? 'default' : 'outline'}
            onClick={() => {
              if (isSelected) {
                column.setFilterValue(null);
              } else {
                column.setFilterValue([year]);
              }
            }}
            className='cursor-pointer'
          >
            {year}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, id, value) => {
      if (!value) return true;
      return value.includes(row.getValue(id) + '');
    },
  },
  {
    accessorKey: 'universityName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='대학명' />
    ),
    cell: ({ row, column }) => {
      const isSelected =
        column.getFilterValue() &&
        column.getFilterValue() === row.original.university.name;
      return (
        <Badge
          variant={isSelected ? 'default' : 'outline'}
          className='cursor-pointer'
          onClick={() => {
            if (isSelected) {
              column.setFilterValue('');
            } else {
              column.setFilterValue(row.original.university.name);
            }
          }}
        >
          {row.original.university.name}
        </Badge>
      );
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, _, value) => {
      return row.original.university.name.toString().includes(value);
    },
  },
  {
    accessorKey: 'admissionType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='전형유형' />
    ),
    cell: ({ row, column }) => {
      const isSelected =
        column.getFilterValue() &&
        column.getFilterValue() === row.original.admissionType.name;
      return (
        <div className='w-[120px]'>
          <Badge
            variant={isSelected ? 'default' : 'outline'}
            className='cursor-pointer'
            onClick={() => {
              if (isSelected) {
                column.setFilterValue('');
              } else {
                column.setFilterValue(row.original.admissionType.name);
              }
            }}
          >
            {row.original.admissionType.name}
          </Badge>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, _, value) => {
      return row.original.admissionType.name.toString().includes(value);
    },
  },
  {
    accessorKey: 'admissionName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='학교별 전형명' />
    ),
    cell: ({ row, column }) => {
      const isSelected =
        column.getFilterValue() &&
        column.getFilterValue() === row.original.admissionName;
      return (
        <Button
          variant={isSelected ? 'default' : 'outline'}
          type='button'
          className='cursor-pointer'
          size={'sm'}
          onClick={() => {
            if (isSelected) {
              column.setFilterValue('');
            } else {
              column.setFilterValue(row.original.admissionName);
            }
          }}
        >
          {row.original.admissionName}
        </Button>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'departmentName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='학과명' />
    ),
    cell: ({ row, column }) => {
      const isSelected =
        column.getFilterValue() &&
        column.getFilterValue() === row.original.departmentName;
      return (
        <Button
          variant={isSelected ? 'default' : 'outline'}
          size={'sm'}
          className='cursor-pointer'
          onClick={() => {
            if (isSelected) {
              column.setFilterValue('');
            } else {
              column.setFilterValue(row.original.departmentName);
            }
          }}
        >
          {row.original.departmentName}
        </Button>
      );
    },
    enableSorting: true,
    enableHiding: true,
    filterFn: (row, _, value) => {
      return row.original.departmentName.toString().includes(value);
    },
  },
  {
    accessorKey: 'quota',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='모집인원' />
    ),
    cell: ({ row }) => <div>{row.getValue('quota')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'competitionRate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='경쟁률' />
    ),
    cell: ({ row }) => <div>{row.getValue('competitionRate')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'studentRecordRatio',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='학생부총점/전형총점' />
    ),
    cell: ({ row }) => <div>{row.getValue('studentRecordRatio')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'convertCut',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='예상점수(환산점)' />
    ),
    cell: ({ row }) => <div>{row.getValue('convertCut')}</div>,
    enableSorting: true,
    enableHiding: true,
  },

  {
    accessorKey: 'gradeCut',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='예상점수(등급)' />
    ),
    cell: ({ row }) => <div>{row.getValue('gradeCut')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'searchTags',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='검색태그' />
    ),
    cell: ({ row, column }) => (
      <div className='flex min-w-[400px] flex-wrap gap-1'>
        {row.original.searchTags.map((tag) => {
          const filterValue = column.getFilterValue() as string[] | undefined;
          const isSelected = filterValue?.includes(tag.id.toString());
          return (
            <Badge
              key={tag.id}
              variant={isSelected ? 'default' : 'secondary'}
              className='cursor-pointer'
              onClick={() => {
                if (isSelected) {
                  column.setFilterValue(
                    filterValue?.filter((v: string) => v !== tag.id.toString())
                  );
                } else {
                  column.setFilterValue([
                    ...(filterValue || []),
                    tag.id.toString(),
                  ]);
                }
              }}
            >
              {tag.name}
            </Badge>
          );
        })}
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
    filterFn: (row, id, value) => {
      // 여기 value는 ["1", "3"] 같은 형태인데 searchTags는 [1, 3] 같은 형태야.
      // value에 모든요소가 searchTags에 포함된 것만 가져와야해
      return value.every((v: string) =>
        row.original.searchTags.some((tag) => tag.id === Number(v))
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
