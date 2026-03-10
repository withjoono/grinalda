import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  itemCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const Pagination = ({
  page,
  pageSize,
  totalCount,
  itemCount,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const lastPages = Math.ceil(totalCount / pageSize);

  const handlePageSizeClick = (value: number) => {
    onPageSizeChange(value);
    onPageChange(1);
  };

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        <div>
          페이지 - {page} / {lastPages}
        </div>
        <div>
          아이템 - {(page - 1) * pageSize + itemCount} / {totalCount}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">한 페이지 단위 ({pageSize})</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <DropdownMenuItem key={size} onClick={() => handlePageSizeClick(size)}>
                {size}개
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(1)} disabled={page <= 1}>
            처음으로
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            이전
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={totalCount <= (page - 1) * pageSize + itemCount}
          >
            다음
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(lastPages)}
            disabled={totalCount <= (page - 1) * pageSize + itemCount}
          >
            마지막으로
          </Button>
        </div>
      </div>
    </div>
  );
};
