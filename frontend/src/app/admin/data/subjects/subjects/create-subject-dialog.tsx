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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateSubject } from '@/apis/hooks/admin/use-admin-subjects';

export const CreateSubjectDialog = ({
  children,
  subjectGroupId,
}: {
  children: React.ReactNode;
  subjectGroupId: number | null;
}) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [typeCode, setTypeCode] = useState(0);
  const { mutateAsync: createSubject } = useCreateSubject();

  const handleCreate = async () => {
    if (!subjectGroupId) {
      toast.error('교과를 선택해주세요.');
      return;
    }
    if (!name) {
      toast.error('과목명을 입력해주세요.');
      return;
    }
    if (!code) {
      toast.error('과목코드를 입력해주세요.');
      return;
    }
    if (!typeCode) {
      toast.error('과목유형을 선택해주세요.');
      return;
    }

    try {
      await createSubject({
        name,
        code,
        typeCode,
        subjectGroupId,
      });
      toast.success('과목이 생성되었습니다.');
      setShowDialog(false);
      setName('');
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('과목 생성에 실패했습니다.');
      }
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>과목 추가</DialogTitle>
          <DialogDescription>
            새로운 과목을 추가할 수 있습니다.
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='typeCode' className='text-right'>
              과목유형
            </Label>
            <Select onValueChange={(value) => setTypeCode(Number(value))}>
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
          <Button variant='outline' onClick={() => setShowDialog(false)}>
            취소
          </Button>
          <Button onClick={handleCreate}>추가하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
