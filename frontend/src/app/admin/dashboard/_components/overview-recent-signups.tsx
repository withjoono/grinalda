import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  YAxis,
  Tooltip,
  XAxis,
} from 'recharts';
import { subDays, isAfter } from 'date-fns';

import { Button } from '@/components/ui/button';
import { DataPoint } from '../page';

type OverviewRecentSignupsProps = {
  data: DataPoint[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='rounded-md border bg-background px-4 py-2 shadow-md'>
        <p className='label'>{`날짜: ${label}`}</p>
        <p className='intro'>{`가입자 수: ${payload[0].value} 명`}</p>
      </div>
    );
  }

  return null;
};

export const OverviewRecentSignups = ({ data }: OverviewRecentSignupsProps) => {
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<number>(30);

  const filterData = (data: DataPoint[], days: number) => {
    const cutoffDate = subDays(new Date(), days);
    const filtered = data.filter((d) => isAfter(new Date(d.name), cutoffDate));
    setFilteredData(filtered);
  };

  const handleTimeRangeChange = (days: number) => {
    setTimeRange(days);
    filterData(data, days);
  };

  useEffect(() => {
    filterData(data, timeRange);
  }, [data, timeRange]);

  return (
    <div>
      <ResponsiveContainer width='100%' height={350}>
        <BarChart data={filteredData}>
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor='end'
            height={80} // 높이 조정
            dx={-5}
            dy={10}
            interval={Math.floor(filteredData.length / 20)} // 일정 간격으로 레이블 표시
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} 명`}
            allowDecimals={false} // 정수만 허용
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey='total'
            fill='currentColor'
            radius={[4, 4, 0, 0]}
            className='fill-primary'
            barSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
      <div className='space-x-2'>
        <Button
          variant={timeRange === 30 ? 'default' : 'outline'}
          onClick={() => handleTimeRangeChange(30)}
        >
          1달
        </Button>
        <Button
          variant={timeRange === 90 ? 'default' : 'outline'}
          onClick={() => handleTimeRangeChange(90)}
        >
          3달
        </Button>
        <Button
          variant={timeRange === 180 ? 'default' : 'outline'}
          onClick={() => handleTimeRangeChange(180)}
        >
          6달
        </Button>
        <Button
          variant={timeRange === 365 ? 'default' : 'outline'}
          onClick={() => handleTimeRangeChange(365)}
        >
          12달
        </Button>
      </div>
    </div>
  );
};
