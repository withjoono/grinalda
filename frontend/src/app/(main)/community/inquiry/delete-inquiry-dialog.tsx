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
import { useDeleteMyInquiry } from '@/apis/hooks/use-boards';
import { useState } from 'react';

interface DeleteInquiryDialogProps {
  children: React.ReactNode;
  inquiryId: number;
  onBack: () => void;
}

export function DeleteInquiryDialog({
  children,
  inquiryId,
  onBack,
}: DeleteInquiryDialogProps) {
  const { mutateAsync: deleteInquiry } = useDeleteMyInquiry();
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteInquiry({ id: inquiryId });
      toast.success('문의가 삭제되었습니다.');
      setShowDialog(false);
      onBack();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('문의 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>문의 삭제</DialogTitle>
          <DialogDescription>
            삭제 시 해당 문의의 답변까지 전부 삭제되며{' '}
            <b className='text-red-500'>다시 복구할 수 없습니다.</b>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => setShowDialog(false)}>
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
