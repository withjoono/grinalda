import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Member } from '@/api2/types/member';

interface MemberTableClientProps {
  data: Member[];
  totalCount: number;
}

export const MemberTable = ({ data, totalCount }: MemberTableClientProps) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`유저 목록 DB (${totalCount})`} description="" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
