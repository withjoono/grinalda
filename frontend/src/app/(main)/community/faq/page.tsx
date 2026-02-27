import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageRoutes } from '@/constants/routes';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { FaqList } from './faq-list';

const CommunityFaqPage = () => {
  return (
    <section className='w-full'>
      <div className='mx-auto w-full'>
        <div>
          <Badge className='text-xs font-medium'>자주 묻는 질문</Badge>
          <h1 className='mt-4 text-4xl font-semibold'>자주 묻는 질문과 답변</h1>
          <p className='mt-6 font-medium text-muted-foreground'>
            그리날다에 대해 궁금한 점이 있으신가요? 자주 묻는 질문과 답변을 통해
            더 자세히 알아보세요.
          </p>
        </div>
        <div className='mt-12'>
          <FaqList />
        </div>
        <Separator className='my-12' />
        <div className='flex flex-col justify-between gap-12 md:flex-row md:items-end'>
          <div className='lg:col-span-2'>
            <h1 className='mt-4 text-2xl font-semibold'>
              추가 문의사항이 있으신가요?
            </h1>
            <p className='mt-6 font-medium text-muted-foreground'>
              더 자세한 상담이 필요하시다면 1:1 문의하기를 이용해주세요.
            </p>
          </div>
          <div className='flex md:justify-end'>
            <Link
              href={PageRoutes.COMMUNITY_INQUIRY}
              className={cn(buttonVariants({ variant: 'link' }))}
            >
              1대1 문의하기
              <ChevronRight className='h-auto w-4' />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityFaqPage;
