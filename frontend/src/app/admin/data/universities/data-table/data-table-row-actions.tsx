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
import { DeleteUniversityDialog } from '../delete-university-dialog';
import { useRouter } from 'next/navigation';
import { PageRoutes } from '@/constants/routes';
import { University } from '@/apis/hooks/use-universities';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const university = row.original as University;
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
                PageRoutes.ADMIN_UNIVERSITIES + '/edit/' + university.id
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

      <DeleteUniversityDialog
        universityId={university.region.id}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
