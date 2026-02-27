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
import { toast } from 'sonner';
import { useDeleteInquiryReply } from '@/apis/hooks/admin/use-admin-inquiry';
import { useState } from 'react';

interface DeleteInquiryReplyDialogProps {
  inquiryId: number;
  replyId: number;
  children: React.ReactNode;
}

export function DeleteInquiryReplyDialog({
  inquiryId,
  replyId,
  children,
}: DeleteInquiryReplyDialogProps) {
  const { mutateAsync: deleteInquiryReply } = useDeleteInquiryReply();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteInquiryReply({ id: inquiryId, replyId: replyId });
      toast.success('답변이 삭제되었습니다.');
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('답변 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>답변 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 답변을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            취소
          </Button>
          <Button variant='destructive' onClick={handleDelete}>
            삭제하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
