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
import { useRouter } from 'next/navigation';
import { useDeleteSubject } from '@/apis/hooks/admin/use-admin-subjects';

interface DeleteSubjectDialogProps {
  subjectId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSubjectDialog({
  subjectId,
  open,
  onOpenChange,
}: DeleteSubjectDialogProps) {
  const router = useRouter();
  const { mutateAsync: deleteSubject } = useDeleteSubject();

  const handleDelete = async () => {
    try {
      await deleteSubject(subjectId);
      toast.success('과목이 삭제되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('과목 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>과목 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 과목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
