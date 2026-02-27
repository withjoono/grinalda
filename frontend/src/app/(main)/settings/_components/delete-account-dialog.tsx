'use client';

import {
  Dialog,
  DialogHeader,
  DialogDescription,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const DeleteAccountDialog = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>정말 탈퇴하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-end gap-3'>
          <DialogTrigger asChild>
            <Button variant='outline'>취소</Button>
          </DialogTrigger>
          <Button
            variant='destructive'
            onClick={() => {
              toast.info('작업중');
            }}
          >
            탈퇴하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
