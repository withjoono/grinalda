import { ColumnDef } from '@tanstack/react-table';
import { formatDateYYYYMMDDHHMMSS } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/custom/button';
import { IconBubble } from '@tabler/icons-react';
import { toast } from 'sonner';
import { IBoardPostData } from '@/api/types/board-types';
import { Link } from 'react-router-dom';
import { boardEndpoints } from '@/api/endpoints/board-endpoints';

export const columns: ColumnDef<IBoardPostData>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: '제목',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: 'content',
    header: '내용',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[250px] text-center">{row.getValue('content')}</div>
    ),
  },
  {
    accessorKey: 'is_emphasized',
    header: '강조(상단고정)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[120px] text-center text-red-500 hover:line-clamp-none">
        {row.getValue('is_emphasized') ? '🔥 활성화' : ''}
      </div>
    ),
  },
  {
    accessorKey: 'nickname',
    header: '작성자',
    cell: ({ row }) => {
      const postData = row.original;
      return (
        <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
          {postData.member.nickname}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: '작성일',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('created_at')))}
      </div>
    ),
  },
  {
    accessorKey: 'updated_at',
    header: '수정일',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[180px] text-center hover:line-clamp-none">
        {formatDateYYYYMMDDHHMMSS(new Date(row.getValue('updated_at')))}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const postData = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconBubble className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link to={`/board/${postData.board.id}/posts/${postData.id}`}>
              <DropdownMenuItem className="text-blue-500">수정하기</DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={async () => {
                if (window.confirm('정말 삭제할까요?')) {
                  const result = await boardEndpoints.deletePost({
                    boardId: postData.board.id,
                    postId: postData.id,
                  });

                  if (result.success) {
                    toast.success('게시물을 삭제했습니다.');
                    window.location.reload();
                  } else {
                    toast.error(result.error);
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
