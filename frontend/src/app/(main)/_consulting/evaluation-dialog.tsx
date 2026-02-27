'use client';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { Teacher } from '@/apis/hooks/use-evaluation';
import { toast } from 'sonner';

interface EvaluationDialogProps {
  children: React.ReactNode;
  teacher: Teacher;
}

export function EvaluationDialog({ children, teacher }: EvaluationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // PDF 파일 검증
      if (selectedFile.type !== 'application/pdf') {
        toast.error('PDF 파일만 업로드 가능합니다.');
        return;
      }
      // 파일 크기 제한 (예: 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('10MB 이하의 파일만 업로드 가능합니다.');
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('생기부를 첨부해주세요.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('file', file);
      formData.append('teacherId', teacher.id.toString());
      // TODO: API 호출 구현
      // await submitEvaluation(formData);

      toast.success('평가 요청이 전송되었습니다. 평균 1~2일 정도 소요됩니다.');

      setIsOpen(false);
      setMessage('');
      setFile(null);
    } catch (error) {
      console.log(error);
      toast.error('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {teacher.name} 평가자에게 생기부 평가 요청하기
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <div>
              <label className='text-sm font-medium'>
                생기부 첨부 (10MB 이하)
              </label>
              <p className='text-sm text-muted-foreground'>
                생기부는 평가를 위해 필수적으로 제출해야하며 평가 완료 후
                서버에서 완전히 삭제됩니다.
              </p>
            </div>
            <div className='relative'>
              <input
                type='file'
                accept='.pdf'
                onChange={handleFileChange}
                className='hidden'
                id='file-upload'
              />
              <label
                htmlFor='file-upload'
                className={cn(
                  'flex h-24 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed',
                  'transition-colors hover:border-primary',
                  file ? 'border-primary bg-primary/5' : 'border-gray-300'
                )}
              >
                {file ? (
                  <div className='flex items-center gap-2'>
                    <span className='text-sm'>{file.name}</span>
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                      }}
                      className='rounded p-1 hover:bg-gray-200'
                    >
                      <X className='h-4 w-4' />
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col items-center gap-1'>
                    <Upload className='h-6 w-6 text-gray-400' />
                    <span className='text-sm text-gray-500'>
                      PDF 파일을 선택하세요
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>메시지</label>
            <Textarea
              placeholder='평가자에게 전달할 메시지를 입력해주세요. (원하는 학과, 학교 등)'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className='min-h-[200px]'
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button
              variant='outline'
              type='button'
              onClick={() => setIsOpen(false)}
            >
              취소
            </Button>
            <Button type='submit'>요청하기</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
