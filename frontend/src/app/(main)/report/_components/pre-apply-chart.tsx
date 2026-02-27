'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  //   CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { format } from 'date-fns';

const chartConfig = {
  score: {
    label: '점수',
  },
  myScore: {
    label: '내점수',
    color: 'hsl(var(--chart-1))',
  },
  maxScore: {
    label: '최고점',
    color: 'hsl(var(--chart-2))',
  },
  avgScore: {
    label: '평균점',
    color: 'hsl(var(--chart-3))',
  },
  minScore: {
    label: '최저점',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function PreApplyChart({
  myScore,
  maxScore,
  avgScore,
  minScore,
  chartMaxValue = 100,
}: {
  myScore?: number;
  maxScore?: number;
  avgScore?: number;
  minScore?: number;
  chartMaxValue?: number;
}) {
  const chartData = [
    { name: 'myScore', score: myScore || 0, fill: 'var(--color-myScore)' },
    { name: 'maxScore', score: maxScore || 0, fill: 'var(--color-maxScore)' },
    { name: 'avgScore', score: avgScore || 0, fill: 'var(--color-avgScore)' },
    { name: 'minScore', score: minScore || 0, fill: 'var(--color-minScore)' },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>그래프로 보는 내 위치</CardTitle>
        <CardDescription>
          {format(new Date(), 'yyyy.MM.dd hh:mm')} 기준
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{
              left: 0,
            }}
          >
            <CartesianGrid vertical={true} horizontal={false} />
            <YAxis
              dataKey='name'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis
              dataKey='score'
              type='number'
              domain={[0, chartMaxValue]} // 최대값 설정
              hide={false} // XAxis 표시
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='score' layout='vertical' radius={5} barSize={40} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='leading-none text-muted-foreground'>
          허수범위의 성적은 지원자 리스트 통계에서 제외됩니다.
        </div>
      </CardFooter> */}
    </Card>
  );
}
