import { Badge } from '@/components/ui/badge';
import { Flag } from 'lucide-react';

export default function AppMain() {
  return (
    <div className='mt-5'>
      <div className='mx-auto flex max-w-screen-md flex-col items-center gap-4'>
        <Badge
          variant='outline'
          className='flex items-center gap-1 px-2.5 py-1.5 text-sm'
        >
          <Flag className='h-auto w-4' />
          미대 입시 전략
        </Badge>
        <h2 className='text-center text-3xl font-semibold lg:text-4xl'>
          미대수시 온라인 합격예측 서비스
        </h2>
        <p className='whitespace-pre-line text-center text-muted-foreground lg:text-lg'>
          {
            '생기부 평가, 실기, 성적을 바탕으로 미술대학 수시 지원 가능성을 분석하고, 맞춤형 지원 전략을 제시해드립니다.'
          }
        </p>
      </div>
    </div>
  );
}
