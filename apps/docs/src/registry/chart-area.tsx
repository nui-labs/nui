import { TrendingUpIcon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@nui/core";

const chartData = [
  { month: "Jan", revenue: 1500 },
  { month: "Feb", revenue: 3200 },
  { month: "Mar", revenue: 2900 },
  { month: "Apr", revenue: 2100 },
  { month: "May", revenue: 4000 },
  { month: "Jun", revenue: 3700 },
  { month: "Jul", revenue: 4300 },
  { month: "Aug", revenue: 4900 },
  { month: "Sep", revenue: 4700 },
  { month: "Oct", revenue: 5200 },
  { month: "Nov", revenue: 6000 },
  { month: "Dec", revenue: 7200 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function ChartAreaDemo() {
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = totalRevenue / chartData.length;
  const lastMonthGrowth =
    ((chartData[11].revenue - chartData[10].revenue) / chartData[10].revenue) *
    100;

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="text-center">
        <CardTitle>Monthly Revenue Trend</CardTitle>
        <CardDescription>Performance overview for 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="var(--chart-1)"
              fillOpacity={0.2}
              stroke="var(--chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm leading-none">
        <div className="flex w-full justify-between font-medium">
          <span>Total Revenue:</span>
          <span>${totalRevenue.toLocaleString()}</span>
        </div>
        <div className="text-muted-foreground flex w-full justify-between">
          <span>Monthly Average:</span>
          <span>
            $
            {averageRevenue.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
        <div className="text-muted-foreground flex w-full justify-between">
          <span>Month-over-month growth:</span>
          <span className="flex items-center gap-1">
            <TrendingUpIcon className="size-4" />
            {lastMonthGrowth.toFixed(1)}%
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
