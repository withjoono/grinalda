import { Button } from '@/components/ui/button';
import { HeroCard } from './hero-card';

const Hero = () => {
  return (
    <div className='container'>
      <div className='grid items-center gap-10 lg:grid-cols-2'>
        <div className='mx-auto flex flex-col gap-8 lg:gap-14'>
          <h1 className='text-4xl font-semibold sm:text-5xl lg:text-6xl xl:text-7xl'>
            그리날다 미대수시 <br />
            <span className='mx-1 inline-block whitespace-nowrap text-primary'>
              온라인 합격예측
            </span>
          </h1>
          <p className='text-muted-foreground lg:text-lg'>
            내신 성적, 멘토 선생님의 생기부 평가를 통해 각 대학의 점수 및 내
            위치를 확인하고 단계별 필터링을 통해 원하는 대학을 찾아보세요.
          </p>
          <Button size='lg' className='ml-auto w-fit lg:ml-0'>
            사용안내
          </Button>
        </div>
        <div className='relative'>
          <div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_100%_at_50%_50%,#000_60%,transparent_100%)]'></div>
          <HeroCard />
        </div>
      </div>
    </div>
  );
};

export default Hero;
