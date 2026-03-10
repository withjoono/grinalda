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
import { IMinorFieldData } from '@/api/types/fields-types';

interface MinorFieldDialogProps {
  minorField?: IMinorFieldData;
  onSave: (minorField: { name: string; midFieldId: number }) => void;
  trigger: React.ReactNode;
}

export function MinorFieldDialog({ minorField, onSave, trigger }: MinorFieldDialogProps) {
  const [name, setName] = useState(minorField?.name || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (minorField) {
      setName(minorField.name);
    }
  }, [minorField]);

  const handleSave = () => {
    onSave({ name, midFieldId: minorField?.mid_field_id || 0 });
    setName('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{minorField ? '소계열 수정' : '새 소계열 추가'}</DialogTitle>
          <DialogDescription>
            소계열 정보를 입력하세요. 완료 후 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              소계열명
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
