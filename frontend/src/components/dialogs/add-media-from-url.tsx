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
import { useState } from 'react';

export function AddMediaFromUrl({
  children,
  setImageUrl,
}: {
  children: React.ReactNode;
  setImageUrl: (url: string) => void;
}) {
  const [url, setUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    setImageUrl(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>이미지 링크 추가</DialogTitle>
          <DialogDescription>
            추가 후 정상적으로 이미지가 표시되는지 확인해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className='mt-4'>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='https://www.example.com/image.jpg'
          />
        </div>
        <DialogFooter>
          <Button type='button' onClick={handleAdd}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
