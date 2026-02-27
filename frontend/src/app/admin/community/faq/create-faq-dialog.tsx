'use client';

import { useCreateFaq } from '@/apis/hooks/admin/use-admin-faq';
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
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const CreateFaqDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { mutateAsync: createFaq } = useCreateFaq();
  const [showDialog, setShowDialog] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleCreate = async () => {
    try {
      await createFaq({ question, answer });
      toast.success('FAQ가 생성되었습니다.');
      setShowDialog(false);
      setQuestion('');
      setAnswer('');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('FAQ 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>FAQ 추가</DialogTitle>
          <DialogDescription>
            새로운 FAQ를 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='question' className='text-right'>
              질문
            </Label>
            <Input
              id='question'
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='answer' className='text-right'>
              답변
            </Label>
            <Textarea
              id='answer'
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
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
