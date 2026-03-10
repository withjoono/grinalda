import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heading } from '@/components/ui/heading';
import { IconPlus } from '@tabler/icons-react';
import { DataTable } from '@/components/ui/data-table';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { columns } from './columns';
import { SusiComprehensive } from '@/api2/types/susi-comprehensive';
import { uploadSusiComprehensiveFileAPI } from '@/api2/수시_서비스/학종-api';

interface ProductsClientProps {
  data: SusiComprehensive[];
  totalCount: number;
}

export const SusiComprehensiveTable: React.FC<ProductsClientProps> = ({ data, totalCount }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const response = await uploadSusiComprehensiveFileAPI(file);

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
    toast.info('*교과* 엑셀파일인지 다시한번 확인해주세요!', { position: 'top-right' });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`수시 학종 DB (${totalCount})`}
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
