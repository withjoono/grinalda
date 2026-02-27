'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTableViewOptions } from './data-table-view-options';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { SearchTag } from '@/apis/hooks/use-search-tags';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchTags: SearchTag[];
}

export function DataTableToolbar<TData>({
  table,
  searchTags,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        <Input
          placeholder='대학명 검색...'
          value={
            (table.getColumn('universityName')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('universityName')
              ?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Input
          placeholder='전형유형 검색...'
          value={
            (table.getColumn('admissionType')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('admissionType')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Input
          placeholder='학교별 전형명 검색...'
          value={
            (table.getColumn('admissionName')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('admissionName')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <Input
          placeholder='학과명 검색...'
          value={
            (table.getColumn('departmentName')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('departmentName')
              ?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {table.getColumn('year') && (
          <DataTableFacetedFilter
            column={table.getColumn('year')}
            title='연도'
            options={[
              { label: '2024년', value: '2024' },
              { label: '2025년', value: '2025' },
              { label: '2026년', value: '2026' },
            ]}
          />
        )}
        {table.getColumn('searchTags') && (
          <DataTableFacetedFilter
            column={table.getColumn('searchTags')}
            title='검색태그'
            options={searchTags.map((tag) => ({
              label: tag.name,
              value: tag.id.toString(),
            }))}
          />
        )}

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            초기화
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
