import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { SusiPassRecord } from '@/api2/types/susi-pass-record';
import { getAdminSusiPassRecordAPI } from '@/api2/수시_서비스/합불사례-api';
import { SusiPassRecordTable } from './student-record-table';

export const SusiPassRecordSection = () => {
  const [susiPassRecords, setSusiPassRecordRecords] = useState<SusiPassRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const lastPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  useEffect(() => {
    const fetch = async () => {
      const result = await getAdminSusiPassRecordAPI({
        page,
        pageSize,
      });
      if (!result.success) {
        toast.error('데이터 로드 중 에러가 발생했습니다.' + result.error);
        return;
      }
      setSusiPassRecordRecords(result.data.list);
      setTotalCount(result.data.totalCount);
    };
    fetch();
  }, [page, pageSize]);

  const handlePageSizeClick = (value: number) => {
    setPageSize(value);
    setPage(1);
  };
  return (
    <>
      <SusiPassRecordTable data={susiPassRecords} totalCount={totalCount} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <div>
            페이지 - {page} / {lastPages}
          </div>
          <div>
            아이템 - {(page - 1) * pageSize + susiPassRecords.length} / {totalCount}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">한 페이지 단위 ({pageSize})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlePageSizeClick(10)}>10개</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePageSizeClick(20)}>20개</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePageSizeClick(30)}>30개</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePageSizeClick(40)}>40개</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePageSizeClick(50)}>50개</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page <= 1}>
              처음으로
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page <= 1}
            >
              이전
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={totalCount <= (page - 1) * pageSize + susiPassRecords.length}
            >
              다음
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(lastPages)}
              disabled={totalCount <= (page - 1) * pageSize + susiPassRecords.length}
            >
              마지막으로
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
