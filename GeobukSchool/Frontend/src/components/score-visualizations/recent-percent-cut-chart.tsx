import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  Legend,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/custom/chart";
import { cn } from "@/lib/utils";

interface RecentPercentCutChartProps {
  data: {
    year: number;
    percent: number;
    myPercent?: number | null;
  }[];
  myPercent: number;
  className?: string;
}

const chartConfig = {
  grade: {
    label: "점수",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export const RecentPercentCutChart: React.FC<RecentPercentCutChartProps> = ({
  data,
  myPercent,
  className,
}) => {
  const transformedData = data.map((item) => ({
    ...item,
    displayPercent: item.percent !== null ? 100 - item.percent : null, // 표시용 반전값
    percent: item.percent, // 원래 값은 유지 (툴팁용)
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className={cn("h-[400px] min-h-[300px] w-full", className)}
    >
      <BarChart
        data={transformedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid vertical={false} horizontal={true} z={1} />
        <Legend content={<CustomLegend />} verticalAlign="top" />
        <XAxis
          dataKey="year"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={<TickX />}
          height={120}
          interval={0}
        />

        <YAxis
          stroke="#888888"
          type="number"
          axisLine={false}
          tickLine={false}
          interval={0}
          domain={[0, 100]}
          ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
          tick={(props) => <TickY {...props} />}
        />
        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <Bar
          dataKey="displayPercent" // 반전된 값을 사용
          fill="var(--color-grade)"
          name="점수"
          radius={[8, 8, 0, 0]}
          barSize={50}
        />

        {myPercent !== null && (
          <ReferenceLine y={100 - myPercent} strokeWidth={3}>
            <Label value="내 누백" content={<LabelRender />} />
          </ReferenceLine>
        )}
      </BarChart>
    </ChartContainer>
  );
};

const TickX = ({ x, y, payload }: any) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );
};

const TickY = ({ x, y, payload }: any) => {
  const percent = 100 - payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={-5}
        y={0}
        dy={4}
        fontSize={12}
        fill="#9A9A9A"
        textAnchor="end"
        fontWeight={400}
        fontFamily="Roboto"
      >
        {percent !== null ? `${percent}%` : "N/A"}
      </text>
    </g>
  );
};
const CustomLegend = () => {
  return (
    <div className="flex items-center space-x-4 px-4 py-2 pb-4">
      <div className="flex items-center">
        <div className="mr-2 h-3 w-3 bg-[hsl(var(--primary))]"></div>
        <span className="text-xs font-semibold">점수</span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const myPercent = payload[0].payload.myPercent;
    const percent = payload[0].payload.percent; // 원래 값 사용
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{`${label}년도`}</p>
        <p className="text-sm">
          {`최초합컷 누백: ${
            percent !== null
              ? percent === 9
                ? "데이터 없음"
                : percent?.toFixed(2) + "%"
              : "N/A"
          }`}
        </p>
        <p className="text-sm">
          {`내 누백: ${
            myPercent !== null
              ? myPercent === 9
                ? "데이터 없음"
                : myPercent?.toFixed(2) + "%"
              : "N/A"
          }`}
        </p>
      </div>
    );
  }
  return null;
};

const LabelRender = (props: any) => {
  const { viewBox } = props;
  let x = viewBox.x;
  let y = viewBox.y - 30;

  return (
    <text
      x={x + 7}
      y={y + 48}
      textAnchor="start"
      className="fill-blue-500"
      fontSize={13}
    >
      내 누백
    </text>
  );
};
