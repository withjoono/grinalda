import { ColumnDef } from '@tanstack/react-table';
import { formatDateYYYYMMDDHHMMSS } from '@/lib/utils';
import { IMemberFile } from '@/api/types/member-file';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IconBubble } from '@tabler/icons-react';
import { toast } from 'sonner';
import { memberFileEndpoints } from '@/api/endpoints/member-file-endpoints';

export const columns: ColumnDef<IMemberFile>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] hover:line-clamp-none">{row.getValue('id')}</div>
    ),
  },
  {
    accessorKey: 'member_nickname',
    header: '유저 이름',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] hover:line-clamp-none">
        {row.getValue('member_nickname')}
      </div>
    ),
  },
  {
    accessorKey: 'member_email',
    header: '유저 이메일',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] hover:line-clamp-none">
        {row.getValue('member_email')}
      </div>
    ),
  },
  {
    accessorKey: 'file_path',
    header: '생기부 파일',
    cell: ({ row }) => <div className="line-clamp-2 w-[150px]">{row.getValue('file_path')}</div>,
  },
  {
    accessorKey: 'file_type',
    header: '생기부 타입',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] hover:line-clamp-none">
        {row.getValue('file_type')}
      </div>
    ),
  },
  {
    accessorKey: 'create_dt',
    header: '생성 날짜',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('create_dt')))}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const file = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconBubble className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(file.file_path);
                toast.success('복사되었습니다.');
              }}
            >
              생기부 주소 복사
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                if (window.confirm('정말 삭제할까요?')) {
                  const result = await memberFileEndpoints.deleteFile({ fileId: file.id });

                  if (result.success) {
                    toast.success('성공적으로 파일을 삭제했습니다.');
                    window.location.reload();
                  }
                }
              }}
              className="text-red-500"
            >
              삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
