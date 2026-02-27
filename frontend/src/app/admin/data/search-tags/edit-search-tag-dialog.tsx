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
import { useUpdateSearchTag } from '@/apis/hooks/admin/use-admin-search-tags';

interface EditSearchTagDialogProps {
  tagId: number;
  tagName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSearchTagDialog({
  tagId,
  tagName,
  open,
  onOpenChange,
}: EditSearchTagDialogProps) {
  const router = useRouter();
  const [editedName, setEditedName] = useState(tagName);
  const { mutateAsync: updateSearchTag } = useUpdateSearchTag();

  const handleEdit = async () => {
    try {
      await updateSearchTag({
        id: tagId,
        name: editedName,
      });
      toast.success('검색 태그가 수정되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('검색 태그 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>검색 태그 수정</DialogTitle>
          <DialogDescription>
            검색 태그의 이름을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              태그명
            </Label>
            <Input
              id='name'
              value={editedName}
              autoComplete='off'
              onChange={(e) => setEditedName(e.target.value)}
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
