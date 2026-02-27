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
import { toast } from 'sonner';
import { useDeleteFaq } from '@/apis/hooks/admin/use-admin-faq';

interface DeleteFaqDialogProps {
  faqId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFaqDialog({
  faqId,
  open,
  onOpenChange,
}: DeleteFaqDialogProps) {
  const { mutateAsync: deleteFaq } = useDeleteFaq();

  const handleDelete = async () => {
    try {
      await deleteFaq(faqId);
      toast.success('FAQ가 삭제되었습니다.');
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('FAQ 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>FAQ 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 FAQ를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
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
