import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { IBoardPostData } from '@/api/types/board-types';
import { buttonVariants } from '@/components/custom/button';
import { Link } from 'react-router-dom';

interface NoticeBoardTableProps {
  data: IBoardPostData[];
  totalCount: number;
}

export const NoticeBoardTable = ({ data, totalCount }: NoticeBoardTableProps) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`공지사항 관리 (${totalCount})`} description="" />

        <Link to="/board/create" className={buttonVariants()}>
          글작성
        </Link>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
