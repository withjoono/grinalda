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
import {
  Select,
  SelectContent,
  SelectValue,
  SelectTrigger,
  SelectItem,
} from '@/components/ui/select';
import { SchoolSubject } from '@/apis/hooks/use-subjects';
import { useUpdateSubject } from '@/apis/hooks/admin/use-admin-subjects';

interface EditSubjectDialogProps {
  subject: SchoolSubject;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSubjectDialog({
  subject,
  open,
  onOpenChange,
}: EditSubjectDialogProps) {
  const router = useRouter();
  const { mutateAsync: updateSubject } = useUpdateSubject();
  const [editedName, setEditedName] = useState(subject.name);
  const [editedCode, setEditedCode] = useState(subject.code);
  const [editedTypeCode, setEditedTypeCode] = useState(subject.typeCode);

  const handleEdit = async () => {
    if (!editedName) {
      toast.error('과목명을 입력해주세요.');
      return;
    }
    if (!editedCode) {
      toast.error('과목코드를 입력해주세요.');
      return;
    }
    if (!editedTypeCode) {
      toast.error('과목유형을 선택해주세요.');
      return;
    }

    try {
      await updateSubject({
        id: subject.id,
        name: editedName,
        code: editedCode,
        typeCode: editedTypeCode,
        subjectGroupId: subject.subjectGroupId,
      });
      toast.success('과목이 수정되었습니다.');
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('과목 수정에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>과목 수정</DialogTitle>
          <DialogDescription>
            과목의 이름을 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='name' className='text-right'>
                과목명
              </Label>
              <Input
                placeholder='예) 생활과 윤리'
                id='name'
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className='col-span-3'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='code' className='text-right'>
                과목코드
              </Label>
              <Input
                placeholder='예) HHS517'
                id='code'
                value={editedCode}
                onChange={(e) => setEditedCode(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='typeCode' className='text-right'>
              과목유형
            </Label>
            <Select
              defaultValue={editedTypeCode.toString()}
              onValueChange={(value) => setEditedTypeCode(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder='과목유형을 선택해주세요.' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>공통과목(석차등급)</SelectItem>
                <SelectItem value='2'>선택과목(석차등급)</SelectItem>
                <SelectItem value='3'>진로선택과목(성취도)</SelectItem>
              </SelectContent>
            </Select>
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
