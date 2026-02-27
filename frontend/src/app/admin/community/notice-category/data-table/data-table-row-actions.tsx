'use client';

import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EditNoticeCategoryDialog } from '../edit-notice-category-dialog';
import { DeleteNoticeCategoryDialog } from '../delete-notice-category-dialog';
import { NoticeCategory } from '@/apis/hooks/use-boards';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const noticeCategory = row.original as NoticeCategory;
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal />
            <span className='sr-only'>메뉴열기</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem
            className='cursor-pointer'
            onClick={() => setShowEditDialog(true)}
          >
            수정
          </DropdownMenuItem>
          <DropdownMenuItem
            className='cursor-pointer text-red-500 focus:text-red-500'
            onClick={() => setShowDeleteDialog(true)}
          >
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditNoticeCategoryDialog
        noticeCategoryId={noticeCategory.id}
        noticeCategoryName={noticeCategory.name}
        noticeCategoryBackgroundColor={noticeCategory.backgroundColor}
        noticeCategoryTextColor={noticeCategory.textColor}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <DeleteNoticeCategoryDialog
        noticeCategoryId={noticeCategory.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
