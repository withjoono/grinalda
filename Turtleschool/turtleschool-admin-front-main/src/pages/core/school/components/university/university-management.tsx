import { useCreateUniversity, useUniversities } from '@/hooks/use-university-queries';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Button } from '@/components/custom/button';
import { IUniversityData } from '@/api/types/university-types';
import { toast } from 'sonner';
import { UniversityDialog } from './university-dialog';

const UniversityManagement = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, error } = useUniversities(page, pageSize);
  const createUniversityMutation = useCreateUniversity();

  const handleAddUniversity = async (newUniversity: Omit<IUniversityData, 'id'>) => {
    const result = await createUniversityMutation.mutateAsync(newUniversity);
    if (result.success) {
      toast.success('대학이 성공적으로 추가되었습니다.');
      setPage(1);
    } else {
      toast.error('대학 추가 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <Heading title={`대학 관리 (${data?.total || 0})`} description="" />
        <UniversityDialog onSave={handleAddUniversity} trigger={<Button>새 대학 추가</Button>} />
      </div>
      <Separator />
      {data && <DataTable columns={columns} data={data.universities} />}
      <Pagination
        page={page}
        pageSize={pageSize}
        totalCount={data?.total || 0}
        itemCount={data?.universities.length || 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
};

export default UniversityManagement;
