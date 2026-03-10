import React, { useState, useEffect } from 'react';
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
import { IAdmissionSubtypeData } from '@/api/types/admission-subtypes';

interface AdmissionSubtypeDialogProps {
  admissionSubtype?: IAdmissionSubtypeData;
  onSave: (admissionSubtype: IAdmissionSubtypeData) => void;
  trigger: React.ReactNode;
}

export function AdmissionSubtypeDialog({
  admissionSubtype,
  onSave,
  trigger,
}: AdmissionSubtypeDialogProps) {
  const [id, setId] = useState(admissionSubtype?.id + '' || null);
  const [name, setName] = useState(admissionSubtype?.name || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (admissionSubtype) {
      setId(admissionSubtype.id + '');
      setName(admissionSubtype.name);
    }
  }, [admissionSubtype]);

  const handleSave = () => {
    onSave({ id: Number(id), name });
    if (!admissionSubtype) {
      setId(null);
      setName('');
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{admissionSubtype ? '세부유형 수정' : '새 세부유형 추가'}</DialogTitle>
          <DialogDescription>
            세부유형 정보를 입력하세요. 완료 후 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!admissionSubtype && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                아이디
              </Label>
              <Input
                id="id"
                value={id || ''}
                onChange={(e) => setId(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              세부유형명
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
