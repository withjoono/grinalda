import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { columns } from './columns';
import { Heading } from '@/components/ui/heading';
import { IconPlus } from '@tabler/icons-react';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { uploadSusiPassRecordFileAPI } from '@/api2/수시_서비스/합불사례-api';
import { SusiPassRecord } from '@/api2/types/susi-pass-record';

interface SusiPassRecordTableProps {
  data: SusiPassRecord[];
  totalCount: number;
}

export const SusiPassRecordTable = ({ data, totalCount }: SusiPassRecordTableProps) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadSusiPassRecordFileAPI(file);
        if (!response.success) {
          toast.error('파일 업로드 실패: ' + response.error, {
            duration: 10000,
            position: 'top-right',
          });
          return;
        }

        toast.success('파일 업로드 성공! 새로고침을 해주세요', {
          duration: 10000,
          position: 'top-right',
        });
      } catch (error) {
        toast.error('파일 업로드 중 오류가 발생했습니다.', {
          duration: 10000,
          position: 'top-right',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  const handleButtonClick = () => {
    toast.info('*합불사례* 엑셀파일인지 다시한번 확인해주세요!', { position: 'top-right' });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`합불 사례 DB (${totalCount})`}
          description="엑셀 파일 동기화시 DB 데이터가 엑셀파일에 맞춰 동기화됩니다."
        />
        <Button className="text-xs md:text-sm" onClick={handleButtonClick} disabled={isLoading}>
          {isLoading ? (
            '업로드 중...'
          ) : (
            <>
              <IconPlus className="mr-2 h-4 w-4" /> 엑셀파일 동기화
            </>
          )}
        </Button>
        <input
          type="file"
          accept=".xls,.xlsx"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} />
    </>
  );
};
