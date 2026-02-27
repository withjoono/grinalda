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
import { useCreateSubjectGroup } from '@/apis/hooks/admin/use-admin-subjects';

export const CreateSubjectGroupDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { mutateAsync: createSubjectGroup } = useCreateSubjectGroup();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleCreate = async () => {
    if (!name) {
      toast.error('교과명을 입력해주세요.');
      return;
    }
    if (!code) {
      toast.error('교과코드를 입력해주세요.');
      return;
    }
    try {
      await createSubjectGroup({
        name,
        code,
      });
      toast.success('교과가 생성되었습니다.');
      setShowDialog(false);
      setName('');
      setCode('');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('교과 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>교과 추가</DialogTitle>
          <DialogDescription>
            새로운 교과를 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-2'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-right'>
              교과명
            </Label>
            <Input
              placeholder='예) 국어'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='code' className='text-right'>
              교과코드
            </Label>
            <Input
              placeholder='예) HH1'
              id='code'
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
