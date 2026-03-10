import { useMemo } from "react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { ProcessedAdmission } from "./step-4-data-table";

interface JungsiStep4ChartProps {
  data: ProcessedAdmission[];
  selectedAdmissions: number[];
  onSelectAdmission: (id: number) => void;
  isSorted?: boolean;
}

// const CustomDot = (props: any) => {
//   const { cx, cy, payload, selectedAdmissions } = props;
//   if (!cx || !cy) return null;

//   const isSelected = selectedAdmissions.includes(payload.id);

//   return (
//     <circle
//       cx={cx}
//       cy={cy}
//       r={4}
//       stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--primary))"}
//       strokeWidth={isSelected ? 3 : 2}
//       fill={payload.scoreDifference >= 0 ? "#22c55e" : "#ef4444"}
//       className={cn(isSelected && "animate-pulse")}
//     />
//   );
// };

export const JungsiStep4Chart = ({
  data,
  selectedAdmissions,
  onSelectAdmission,
}: JungsiStep4ChartProps) => {
  const chartData = useMemo(() => {
    const processedData = data.map((item, idx) => {
      return {
        id: item.id,
        idx,
        university: item.university.name,
        region: item.university.region,
        recruitmentName: item.recruitment_name || "",
        scoreDifference: item.normalizedScoreDifference || 0,
        minCut: item.min_cut ? parseFloat(item.min_cut) : null,
        maxCut: item.max_cut ? parseFloat(item.max_cut) : null,
        totalScore: item.total_score,
        standardScore: item.standardScore,
        xLabelData: `${item.university.name}\n${item.university.region}\n${item.recruitment_name || ""}\n${item.id}`,
      };
    });

    return processedData;
  }, [data]);

  const yDomain = useMemo(() => {
    const maxDiff = Math.max(...chartData.map((d) => d.scoreDifference));
    const minDiff = Math.min(...chartData.map((d) => d.scoreDifference));
    // 최대 절대값을 찾아서 양쪽에 동일하게 적용
    const maxAbsValue = Math.max(Math.abs(maxDiff), Math.abs(minDiff));
    const padding = maxAbsValue * 0.1;
    return [-maxAbsValue - padding, maxAbsValue + padding];
  }, [chartData]);

  const barSize = 120;

  return (
    <ResponsiveContainer
      width={Math.max(1188, barSize * chartData.length)}
      height={"100%"}
    >
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        onClick={(event) => {
          if (event.activePayload && event.activePayload.length > 0) {
            const clickedData = event.activePayload[0].payload;
            onSelectAdmission(clickedData.id);
          }
        }}
      >
        <CartesianGrid vertical={false} className="stroke-foreground/20" />
        <XAxis
          tickLine={false}
          height={100}
          dataKey="xLabelData"
          tick={(props) => (
            <TickX
              {...props}
              selectedAdmissions={selectedAdmissions}
              onSelect={onSelectAdmission}
            />
          )}
          interval={0}
        />
        <YAxis
          stroke="#888888"
          domain={yDomain}
          tickFormatter={(value) => value.toFixed(1)}
        />
        <Tooltip
          cursor={{ fill: "transparent" }}
          content={({ payload }) => {
            const data = payload?.[0]?.payload;
            if (!data) return null;

            return (
              <div className="rounded-md bg-background px-4 py-4 text-foreground shadow-lg">
                <p className="font-semibold">{`${data.university}(${data.region})`}</p>
                <p className="mb-2 text-sm">{data.recruitmentName}</p>
                <p className="text-sm">총점: {data.totalScore || "-"}</p>
                <p className="text-sm">
                  최초컷: {data.minCut?.toFixed(2) || "-"}
                </p>
                <p className="text-sm">
                  추합컷: {data.maxCut?.toFixed(2) || "-"}
                </p>
                <p className="text-sm">
                  동점수 평균: {data.standardScore?.toFixed(2) || "-"}
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    data.scoreDifference > 0
                      ? "text-green-500"
                      : data.scoreDifference < 0
                        ? "text-red-500"
                        : "text-foreground",
                  )}
                >
                  점수차이: {data.scoreDifference.toFixed(2)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  클릭하여{" "}
                  {selectedAdmissions.includes(data.id) ? "선택 해제" : "선택"}
                </p>
              </div>
            );
          }}
        />
        <ReferenceLine
          y={0}
          stroke="hsl(var(--primary))" // 또는 원하는 색상 값
          strokeDasharray="3 3"
          strokeWidth={2} // 선 두께도 조절 가능
        />
        {/* <Line
          type="monotone"
          dataKey="scoreDifference"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={(props) => (
            <CustomDot {...props} selectedAdmissions={selectedAdmissions} />
          )}
          activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
        /> */}
        <Bar
          dataKey="scoreDifference"
          radius={[8, 8, 0, 0]}
          barSize={barSize - 50}
          className="cursor-pointer" // 이 줄을 추가
        >
          {/* <LabelList position="top" dataKey="month" fillOpacity={1} /> */}
          {chartData.map((item) => (
            <Cell
              key={item.scoreDifference}
              className="hover:opacity-80"
              fill={
                item.scoreDifference > 0
                  ? "hsl(var(--chart-2))"
                  : "hsl(var(--chart-1))"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
interface TickXProps {
  x?: number;
  y?: number;
  payload?: {
    value: string;
  };
  selectedAdmissions: number[];
  onSelect: (id: number) => void;
}

const TickX = ({ x, y, payload, selectedAdmissions, onSelect }: TickXProps) => {
  if (!x || !y || !payload) return null;

  const [university_name, region, recruitment_name, id] =
    payload.value.split("\n");
  const width = 110;
  const numericId = Number(id);
  const isSelected = selectedAdmissions.includes(numericId);

  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject
        className="node"
        x={-width / 2}
        y="0"
        width={width}
        height="100px"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelect(numericId);
          }}
          className={cn(
            "flex h-full w-full cursor-pointer flex-col items-center space-y-1 text-xs font-semibold hover:opacity-75",
            isSelected ? "text-primary" : "text-foreground/60",
          )}
        >
          <p>{`${university_name}(${region})`}</p>
          <p>{recruitment_name}</p>
        </div>
      </foreignObject>
    </g>
  );
};

export default JungsiStep4Chart;
