import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { PayOrder } from '@/api2/types/pay-order';

interface PayOrderTableClientProps {
  data: PayOrder[];
  totalCount: number;
}

export const PayOrderTable = ({ data, totalCount }: PayOrderTableClientProps) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading title={`주문 목록 DB (${totalCount})`} description="" />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
