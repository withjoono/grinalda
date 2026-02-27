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
import { useUpdateSubjectGroup } from '@/apis/hooks/admin/use-admin-subjects';
import { SchoolSubjectGroup } from '@/apis/hooks/use-subjects';

interface EditSubjectGroupDialogProps {
  subjectGroup: SchoolSubjectGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubjectGroupDialog({
  subjectGroup,
  open,
  onOpenChange,
}: EditSubjectGroupDialogProps) {
  const router = useRouter();
  const [editedName, setEditedName] = useState(subjectGroup.name);
  const [editedCode, setEditedCode] = useState(subjectGroup.code);
  const { mutateAsync: updateSubjectGroup } = useUpdateSubjectGroup();

  const handleEdit = async () => {
    if (!editedName) {
      toast.error('교과명을 입력해주세요.');
      return;
    }
    if (!editedCode) {
      toast.error('교과코드를 입력해주세요.');
      return;
    }
    try {
      await updateSubjectGroup({
        id: subjectGroup.id,
        name: editedName,
        code: editedCode,
      });
      toast.success('교과가 수정되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('교과 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>교과 수정</DialogTitle>
          <DialogDescription>
            교과의 이름을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid grid-cols-2 gap-2'>
          <div className='space-y-2'>
            <Label htmlFor='name' className='text-right'>
              교과명
            </Label>
            <Input
              placeholder='예) 국어'
              id='name'
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className='col-span-3'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='code' className='text-right'>
              교과코드
            </Label>
            <Input
              placeholder='예) HH1'
              id='code'
              value={editedCode}
              onChange={(e) => setEditedCode(e.target.value)}
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
