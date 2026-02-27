'use client';

import { useCreateMyInquiry } from '@/apis/hooks/use-boards';
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
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';

export const CreateInquiryDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { mutateAsync: createInquiry } = useCreateMyInquiry();
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = async () => {
    try {
      await createInquiry({ title, content });
      toast.success('문의가 생성되었습니다.');
      setShowDialog(false);
      setTitle('');
      setContent('');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('문의 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>문의 추가</DialogTitle>
          <DialogDescription>
            새로운 문의를 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='제목을 입력해주세요.'
              className='col-span-4'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Textarea
              id='content'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='내용을 입력해주세요.'
              className='col-span-4 h-[280px]'
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
