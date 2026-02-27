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
import { DeleteNoticeDialog } from '../delete-notice-dialog';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/constants/routes';
import { Notice } from '@/apis/hooks/use-boards';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const notice = row.original as Notice;
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
            onClick={() =>
              router.push(
                PageRoutes.ADMIN_COMMUNITY_NOTICE + '/edit/' + notice.id
              )
            }
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

      <DeleteNoticeDialog
        noticeId={notice.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
