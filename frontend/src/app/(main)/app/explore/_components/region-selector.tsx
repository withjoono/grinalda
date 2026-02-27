import { Region } from '@/apis/hooks/use-regions';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCwIcon } from 'lucide-react';

export const RegionSelector = ({
  regions,
  selectedRegionIds,
  handleRegionClick,
}: {
  regions: Region[];
  selectedRegionIds: number[];
  handleRegionClick: (id: number) => void;
}) => {
  return (
    <div>
      <h3 className='text-lg font-semibold md:text-xl'>🗺️ 지역</h3>
      <div className='flex flex-wrap gap-2 pt-4'>
        {regions?.map((region) => (
          <Button
            key={region.id}
            variant={
              selectedRegionIds.includes(region.id) ? 'default' : 'outline'
            }
            onClick={() => handleRegionClick(region.id)}
          >
            {region.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export const RegionSelectorSkeleton = () => {
  return (
    <div className=''>
      <h3 className='text-lg font-semibold md:text-xl'>🗺️ 지역</h3>
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

export const RegionSelectorError = ({ refetch }: { refetch: () => void }) => {
  return (
    <div className=''>
      <h3 className='text-lg font-semibold md:text-xl'>🗺️ 지역</h3>
      <div className='space-y-2 pt-2'>
        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
          지역정보를 불러오는 중 오류가 발생했습니다.
        </p>
        <Button variant='outline' onClick={refetch}>
          <RefreshCwIcon className='h-4 w-4' /> 재시도
        </Button>
      </div>
    </div>
  );
};
