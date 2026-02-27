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
import { useUpdateNoticeCategory } from '@/apis/hooks/admin/use-admin-notice';

interface EditNoticeCategoryDialogProps {
  noticeCategoryId: number;
  noticeCategoryName: string;
  noticeCategoryBackgroundColor: string;
  noticeCategoryTextColor: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditNoticeCategoryDialog({
  noticeCategoryId,
  noticeCategoryName,
  noticeCategoryBackgroundColor,
  noticeCategoryTextColor,
  open,
  onOpenChange,
}: EditNoticeCategoryDialogProps) {
  const router = useRouter();
  const [editedName, setEditedName] = useState(noticeCategoryName);
  const [editedBackgroundColor, setEditedBackgroundColor] = useState(
    noticeCategoryBackgroundColor
  );
  const [editedTextColor, setEditedTextColor] = useState(
    noticeCategoryTextColor
  );
  const { mutateAsync: updateNoticeCategory } = useUpdateNoticeCategory();

  const handleEdit = async () => {
    try {
      await updateNoticeCategory({
        id: noticeCategoryId,
        name: editedName,
        backgroundColor: editedBackgroundColor,
        textColor: editedTextColor,
      });
      toast.success('공지사항 카테고리가 수정되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('공지사항 카테고리 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>공지사항 카테고리 수정</DialogTitle>
          <DialogDescription>
            공지사항 카테고리의 이름, 배경색, 텍스트 색을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              이름
            </Label>
            <Input
              id='name'
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='backgroundColor' className='text-right'>
              배경색
            </Label>
            <Input
              id='backgroundColor'
              value={editedBackgroundColor}
              onChange={(e) => setEditedBackgroundColor(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='textColor' className='text-right'>
              텍스트 색
            </Label>
            <Input
              id='textColor'
              value={editedTextColor}
              onChange={(e) => setEditedTextColor(e.target.value)}
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
