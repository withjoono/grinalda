import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCwIcon } from 'lucide-react';

export const AdmissionTypeSelector = ({
  admissionTypePrefixes,
  selectedAdmissionTypePrefixes,
  handleAdmissionTypeClick,
}: {
  admissionTypePrefixes: string[];
  selectedAdmissionTypePrefixes: string[];
  handleAdmissionTypeClick: (name: string) => void;
}) => {
  return (
    <div>
      <h3 className='text-lg font-semibold md:text-xl'>✏️ 입학 유형</h3>
      <div className='flex flex-wrap gap-2 pt-4'>
        {admissionTypePrefixes?.map((admissionTypePrefix) => (
          <Button
            key={admissionTypePrefix}
            variant={
              selectedAdmissionTypePrefixes.includes(admissionTypePrefix)
                ? 'default'
                : 'outline'
            }
            onClick={() => handleAdmissionTypeClick(admissionTypePrefix)}
          >
            {admissionTypePrefix === '학교'
              ? '학생부교과'
              : admissionTypePrefix === '학종'
                ? '학생부학종'
                : admissionTypePrefix === '실기'
                  ? '실기(특기자)'
                  : admissionTypePrefix}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const AdmissionTypeSelectorSkeleton = () => {
  return (
    <div className=''>
      <h3 className='text-lg font-semibold md:text-xl'>✏️ 입학 유형</h3>
      <div className='flex gap-2 pt-4'>
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-20' />
        <Skeleton className='h-9 w-20' />
      </div>
    </div>
  );
};

export const AdmissionTypeSelectorError = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  return (
    <div className=''>
      <h3 className='text-lg font-semibold md:text-xl'>✏️ 입학 유형</h3>
      <div className='space-y-2 pt-2'>
        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
          입학 유형 정보를 불러오는 중 오류가 발생했습니다.
        </p>
        <Button variant='outline' onClick={refetch}>
          <RefreshCwIcon className='h-4 w-4' /> 재시도
        </Button>
      </div>
    </div>
  );
};
