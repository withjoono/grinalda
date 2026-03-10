import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IUniversityData } from '@/api/types/university-types';

interface UniversityDialogProps {
  university?: IUniversityData;
  onSave: (university: Omit<IUniversityData, 'id'>) => void;
  trigger: React.ReactNode;
}

export function UniversityDialog({ university, onSave, trigger }: UniversityDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(university?.name || '');
  const [region, setRegion] = useState(university?.region || '');
  const [code, setCode] = useState(university?.code || '');
  const [establishmentType, setEstablishmentType] = useState<'' | '국립' | '사립'>(
    university?.establishment_type || ''
  );

  const handleSave = () => {
    onSave({ name, region, code, establishment_type: establishmentType });
    if (!university) {
      setName('');
      setRegion('');
      setCode('');
      setEstablishmentType('');
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{university ? '대학 정보 수정' : '새 대학 추가'}</DialogTitle>
          <DialogDescription>
            대학 정보를 입력하세요. 완료 후 저장 버튼을 클릭하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              대학명
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="region" className="text-right">
              지역
            </Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              대학코드
            </Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="establishment-type" className="text-right">
              설립형태
            </Label>
            <Select
              value={establishmentType}
              onValueChange={(value: 'null' | '국립' | '사립') => {
                setEstablishmentType(value === 'null' ? '' : value);
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="설립형태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">미정</SelectItem>
                <SelectItem value="국립">국립</SelectItem>
                <SelectItem value="사립">사립</SelectItem>
              </SelectContent>
            </Select>
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
