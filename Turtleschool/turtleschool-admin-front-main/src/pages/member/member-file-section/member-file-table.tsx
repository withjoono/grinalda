import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { IMemberFile } from '@/api/types/member-file';

interface MemberFileTableProps {
  data: IMemberFile[];
  totalCount: number;
}

export const MemberFileTable = ({ data, totalCount }: MemberFileTableProps) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`유저 생기부 관리 (${totalCount})`} description="" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
