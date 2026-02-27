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
import { useUpdateAdmissionType } from '@/apis/hooks/admin/use-admin-admission-types';

interface EditAdmissionTypeDialogProps {
  admissionTypeId: number;
  admissionTypeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAdmissionTypeDialog({
  admissionTypeId,
  admissionTypeName,
  open,
  onOpenChange,
}: EditAdmissionTypeDialogProps) {
  const router = useRouter();
  const { mutateAsync: updateAdmissionType } = useUpdateAdmissionType();
  const [editedName, setEditedName] = useState(admissionTypeName);

  const handleEdit = async () => {
    try {
      await updateAdmissionType({
        id: admissionTypeId,
        name: editedName,
      });
      toast.success('전형 유형이 수정되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('전형 유형 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>전형 유형 수정</DialogTitle>
          <DialogDescription>
            전형 유형의 이름을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              전형 유형명
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
