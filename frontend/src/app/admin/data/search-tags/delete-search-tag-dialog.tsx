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
import { useDeleteSearchTag } from '@/apis/hooks/admin/use-admin-search-tags';

interface DeleteSearchTagDialogProps {
  tagId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSearchTagDialog({
  tagId,
  open,
  onOpenChange,
}: DeleteSearchTagDialogProps) {
  const router = useRouter();
  const { mutateAsync: deleteSearchTag } = useDeleteSearchTag();

  const handleDelete = async () => {
    try {
      await deleteSearchTag(tagId);
      toast.success('검색 태그가 삭제되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('검색 태그 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>검색 태그 삭제</DialogTitle>
          <DialogDescription>
            정말로 이 검색 태그를 삭제하시겠습니까? 이 작업은 되돌릴 수
            없습니다.
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
