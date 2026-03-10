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

interface RecentScoreCutChartProps {
  data: {
    year: number;
    ranking: number;
    myScore?: number | null;
  }[];
  myScore?: number | null;
  className?: string;
  totalScore?: number;
}

const chartConfig = {
  grade: {
    label: "점수",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export const RecentScoreCutChart: React.FC<RecentScoreCutChartProps> = ({
  data,
  myScore,
  className,
  totalScore,
}) => {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("h-[400px] min-h-[300px] w-full", className)}
    >
      <BarChart
        data={data}
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
          interval={0}
          type="number"
          tickCount={11}
          axisLine={false}
          tickLine={false}
          domain={[0, totalScore || 1000]}
          tick={(props) => <TickY {...props} />}
        />
        <ChartTooltip cursor={false} content={<CustomTooltip />} />
        <Bar
          dataKey="ranking"
          fill="var(--color-grade)"
          name="점수"
          radius={[8, 8, 0, 0]}
          barSize={50}
        />

        {myScore !== null && (
          <ReferenceLine y={myScore} strokeWidth={3}>
            <Label value="내 점수" content={<LabelRender />} />
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
  const grade = payload.value;
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
        {grade !== null ? `${grade?.toFixed(2)}점` : "N/A"}
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
    const myScore = payload[0].payload.myScore;
    const ranking = payload[0].payload.ranking;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <p className="text-sm font-medium">{`${label}년도`}</p>

        <p className="text-sm">
          {`최초컷: ${
            ranking !== null
              ? ranking === 9
                ? "데이터 없음"
                : ranking?.toFixed(2)
              : "N/A"
          }`}
        </p>
        <p className="text-sm">
          {`내 점수: ${
            myScore !== null
              ? myScore === 9
                ? "데이터 없음"
                : myScore?.toFixed(2)
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
      내 점수
    </text>
  );
};
