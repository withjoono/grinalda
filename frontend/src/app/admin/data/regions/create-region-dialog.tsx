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
import { useCreateRegion } from '@/apis/hooks/admin/use-admin-regions';

export const CreateRegionDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { mutateAsync: createRegion } = useCreateRegion();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = async () => {
    try {
      await createRegion({ name });
      toast.success('지역이 생성되었습니다.');
      setShowDialog(false);
      setName('');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('지역 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지역 추가</DialogTitle>
          <DialogDescription>
            새로운 지역을 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              지역명
            </Label>
            <Input
              id='name'
              value={name}
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
