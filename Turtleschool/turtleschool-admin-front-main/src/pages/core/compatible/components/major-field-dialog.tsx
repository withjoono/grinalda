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
import { IMajorFieldData } from '@/api/types/fields-types';

interface MajorFieldDialogProps {
  majorField?: IMajorFieldData;
  onSave: (majorField: Omit<IMajorFieldData, 'id'>) => void;
  trigger: React.ReactNode;
}

export function MajorFieldDialog({ majorField, onSave, trigger }: MajorFieldDialogProps) {
  const [name, setName] = useState(majorField?.name || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (majorField) {
      setName(majorField.name);
    }
  }, [majorField]);

  const handleSave = () => {
    onSave({ name });
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{majorField ? '대계열 수정' : '새 대계열 추가'}</DialogTitle>
          <DialogDescription>
            대계열 정보를 입력하세요. 완료 후 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              대계열명
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
