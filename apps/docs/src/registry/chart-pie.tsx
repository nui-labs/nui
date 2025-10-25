import { Cell, Legend, Pie, PieChart } from "recharts";
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
  { category: "Sales", amount: 4000, fill: "var(--chart-1)" },
  { category: "Marketing", amount: 3000, fill: "var(--chart-2)" },
  { category: "IT", amount: 2000, fill: "var(--chart-3)" },
  { category: "HR", amount: 1000, fill: "var(--chart-4)" },
  { category: "Operations", amount: 1000, fill: "var(--chart-5)" },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "var(--chart-1)",
  },
  marketing: {
    label: "Marketing",
    color: "var(--chart-2)",
  },
  it: {
    label: "IT",
    color: "var(--chart-3)",
  },
  hr: {
    label: "HR",
    color: "var(--chart-4)",
  },
  operations: {
    label: "Operations",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export default function ChartPieDemo() {
  const totalBudget = chartData.reduce((sum, item) => sum + item.amount, 0);
  const highestBudget = Math.max(...chartData.map((item) => item.amount));
  const highestCategory = chartData.find(
    (item) => item.amount === highestBudget,
  )?.category;

  return (
    <Card className="flex w-full flex-col">
      <CardHeader className="pb-0 text-center">
        <CardTitle>Budget Distribution</CardTitle>
        <CardDescription>Department budget allocation for 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
            >
              {chartData.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm leading-none">
        <div className="flex w-full justify-between font-medium">
          <span>Total Budget:</span>
          <span>${totalBudget.toLocaleString()}</span>
        </div>
        <div className="text-muted-foreground flex w-full justify-between">
          <span>Largest Department:</span>
          <span>{highestCategory}</span>
        </div>
        <div className="text-muted-foreground flex w-full justify-between">
          <span>Highest Budget:</span>
          <span>${highestBudget.toLocaleString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
