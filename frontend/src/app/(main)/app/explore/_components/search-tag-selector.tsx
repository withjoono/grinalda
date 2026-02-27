import { Check, RefreshCwIcon } from 'lucide-react';
import {
  CommandInput,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import { CommandEmpty } from '@/components/ui/command';
import { Command } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SearchTag } from '@/apis/hooks/use-search-tags';
import { Skeleton } from '@/components/ui/skeleton';

export const SearchTagSelector = ({
  searchTags,
  selectedSearchTagIds,
  handleSearchTagClick,
}: {
  searchTags: SearchTag[];
  selectedSearchTagIds: number[];
  handleSearchTagClick: (id: number) => void;
}) => {
  return (
    <div>
      <h3 className='text-lg font-semibold md:text-xl'>🗺 검색 태그</h3>

      <div className='flex flex-wrap gap-2 pt-4'>
        <Popover>
          <PopoverTrigger asChild>
            <Badge
              role='combobox'
              variant={'outline'}
              className='cursor-pointer text-blue-500 hover:text-blue-500'
            >
              + 추가
            </Badge>
          </PopoverTrigger>
          <PopoverContent className='ml-4 w-[200px] p-0'>
            <Command>
              <CommandInput placeholder='태그를 입력하세요...' />
              <CommandList className='h-[200px] overflow-y-auto'>
                <CommandEmpty>결과가 없습니다.</CommandEmpty>
                {searchTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    className='cursor-pointer'
                    onSelect={() => {
                      handleSearchTagClick(tag.id);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2',
                        selectedSearchTagIds.includes(tag.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedSearchTagIds.map((tagId) => {
          const tag = searchTags.find((t) => t.id === tagId);
          return (
            <Badge
              key={tagId}
              className='badge cursor-pointer'
              onClick={() => {
                handleSearchTagClick(tagId);
              }}
            >
              {tag?.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export const SearchTagSelectorSkeleton = () => {
  return (
    <div className=''>
      <h3 className='text-lg font-semibold md:text-xl'>🗺 검색 태그</h3>
      <div className='flex gap-2 pt-4'>
        <Skeleton className='h-[22px] w-16' />
      </div>
    </div>
  );
};

export const SearchTagSelectorError = ({
  refetch,
}: {
  refetch: () => void;
}) => {
  return (
    <div className=''>
      <h3 className='text-lg font-semibold md:text-xl'>🗺 검색 태그</h3>
      <div className='space-y-2 pt-2'>
        <p className='flex items-center gap-2 text-sm text-muted-foreground'>
          검색 태그 정보를 불러오는 중 오류가 발생했습니다.
        </p>
        <Button variant='outline' onClick={refetch}>
          <RefreshCwIcon className='h-4 w-4' /> 재시도
        </Button>
      </div>
    </div>
  );
};
