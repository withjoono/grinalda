import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/custom/button';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { MemberFileTable } from './member-file-table';
import { memberFileEndpoints } from '@/api/endpoints/member-file-endpoints';
import { IMemberFile } from '@/api/types/member-file';

export const MemberFileSection = () => {
  const [memberFiles, setMemberFiles] = useState<IMemberFile[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [_searchWord, _setSearchWord] = useState('');
  const [searchWord, setSearchWord] = useState('');

  const lastPages = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  useEffect(() => {
    const fetch = async () => {
      const result = await memberFileEndpoints.getMemberFiles({
        page,
        limit: pageSize,
        searchKey: searchWord,
      });
      if (!result.success) {
        toast.error('데이터 로드 중 에러가 발생했습니다.' + result.error);
        return;
      }
      setTotalCount(result.data.total);
      setMemberFiles(result.data.files);
    };
    fetch();
  }, [page, pageSize, searchWord]);

  const handlePageSizeClick = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const handleSearch = () => {
    setSearchWord(_searchWord);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            onChange={(e) => _setSearchWord(e.target.value)}
            value={_searchWord}
            className="w-[300px]"
            placeholder="이메일 검색하기"
            onKeyDown={handleKeyPress}
          />
          <Button onClick={handleSearch} type="button">
            검색하기
          </Button>
        </div>
      </div>
      <MemberFileTable data={memberFiles} totalCount={totalCount} />
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <div>
            페이지 - {page} / {lastPages}
          </div>
          <div>
            아이템 - {(page - 1) * pageSize + memberFiles.length} / {totalCount}
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
              disabled={totalCount <= (page - 1) * pageSize + memberFiles.length}
            >
              다음
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(lastPages)}
              disabled={totalCount <= (page - 1) * pageSize + memberFiles.length}
            >
              마지막으로
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
