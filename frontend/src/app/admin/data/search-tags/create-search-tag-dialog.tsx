'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateSearchTag } from '@/apis/hooks/admin/use-admin-search-tags';

export const CreateSearchTagDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');
  const { mutateAsync: createSearchTag } = useCreateSearchTag();

  const handleCreate = async () => {
    try {
      await createSearchTag({
        name,
      });
      toast.success('검색 태그가 생성되었습니다.');
      setShowDialog(false);
      setName('');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('검색 태그 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>검색 태그 추가</DialogTitle>
          <DialogDescription>
            새로운 검색 태그를 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              태그명
            </Label>
            <Input
              id='name'
              value={name}
              autoComplete='off'
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => setShowDialog(false)}>
            취소
          </Button>
          <Button onClick={handleCreate}>추가하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
