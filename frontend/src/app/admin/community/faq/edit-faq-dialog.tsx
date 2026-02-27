'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUpdateFaq } from '@/apis/hooks/admin/use-admin-faq';
import { Textarea } from '@/components/ui/textarea';

interface EditFaqDialogProps {
  faqId: number;
  faqQuestion: string;
  faqAnswer: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFaqDialog({
  faqId,
  faqQuestion,
  faqAnswer,
  open,
  onOpenChange,
}: EditFaqDialogProps) {
  const router = useRouter();
  const [editedQuestion, setEditedQuestion] = useState(faqQuestion);
  const [editedAnswer, setEditedAnswer] = useState(faqAnswer);
  const { mutateAsync: updateFaq } = useUpdateFaq();

  const handleEdit = async () => {
    try {
      await updateFaq({
        id: faqId,
        question: editedQuestion,
        answer: editedAnswer,
      });
      toast.success('FAQ가 수정되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('FAQ 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>FAQ 수정</DialogTitle>
          <DialogDescription>
            FAQ의 질문과 답변을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='question' className='text-right'>
              질문
            </Label>
            <Input
              id='question'
              value={editedQuestion}
              onChange={(e) => setEditedQuestion(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='answer' className='text-right'>
              답변
            </Label>
            <Textarea
              id='answer'
              value={editedAnswer}
              onChange={(e) => setEditedAnswer(e.target.value)}
              className='col-span-3'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleEdit}>수정하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
