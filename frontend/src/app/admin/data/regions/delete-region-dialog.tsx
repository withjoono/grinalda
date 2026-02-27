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
import { useDeleteRegion } from '@/apis/hooks/admin/use-admin-regions';

interface DeleteRegionDialogProps {
  regionId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRegionDialog({
  regionId,
  open,
  onOpenChange,
}: DeleteRegionDialogProps) {
  const { mutateAsync: deleteRegion } = useDeleteRegion();

  const handleDelete = async () => {
    try {
      await deleteRegion(regionId);
      toast.success('지역이 삭제되었습니다.');
      onOpenChange(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('지역 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>지역 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 지역을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
