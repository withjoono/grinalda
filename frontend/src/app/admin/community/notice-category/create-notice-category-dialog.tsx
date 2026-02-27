'use client';

import { useCreateNoticeCategory } from '@/apis/hooks/admin/use-admin-notice';
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

export const CreateNoticeCategoryDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { mutateAsync: createNoticeCategory } = useCreateNoticeCategory();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [textColor, setTextColor] = useState('');

  const handleCreate = async () => {
    try {
      await createNoticeCategory({ name, backgroundColor, textColor });
      toast.success('공지사항 카테고리가 생성되었습니다.');
      setShowDialog(false);
      setName('');
      setBackgroundColor('');
      setTextColor('');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('공지사항 카테고리 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공지사항 카테고리 추가</DialogTitle>
          <DialogDescription>
            새로운 공지사항 카테고리를 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              이름
            </Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='col-span-3'
              placeholder='예) 그리날다소식'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='backgroundColor' className='text-right'>
              배경색
            </Label>
            <Input
              id='backgroundColor'
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className='col-span-3'
              placeholder='#000000'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='textColor' className='text-right'>
              텍스트 색
            </Label>
            <Input
              id='textColor'
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className='col-span-3'
              placeholder='#000000'
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
