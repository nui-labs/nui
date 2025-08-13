import {
  ActivityIcon,
  DollarSignIcon,
  ShoppingCartIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, cn } from "@nui/core";

import { formatCurrency, formatNumber, formatPercentage } from "./utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  data?: Array<{ value: number }>;
  className?: string;
}

function StatsCard({
  title,
  value,
  change,
  changeLabel = "from last month",
  icon,
  data,
  className,
}: StatsCardProps) {
  const isPositive = change > 0;
  const isNegative = change < 0;

  const changeColor = isPositive
    ? "text-green-600 dark:text-green-400"
    : isNegative
      ? "text-red-600 dark:text-red-400"
      : "text-muted-foreground";

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className={cn("flex items-center", changeColor)}>
            {isPositive && <TrendingUpIcon className="h-3 w-3 mr-1" />}
            {isNegative && <TrendingDownIcon className="h-3 w-3 mr-1" />}
            <span className="font-medium">
              {isPositive && "+"}
              {formatPercentage(Math.abs(change))}
            </span>
          </div>
          <span>{changeLabel}</span>
        </div>
        {data && (
          <div className="mt-4 h-[60px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={
                    isPositive ? "#10b981" : isNegative ? "#ef4444" : "#6b7280"
                  }
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Sample data for demonstration
const sampleData = [
  { value: 400 },
  { value: 300 },
  { value: 500 },
  { value: 280 },
  { value: 590 },
  { value: 320 },
  { value: 490 },
];

export default function StatsCardDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(45231.89)}
        change={20.1}
        icon={<DollarSignIcon />}
        trend="up"
        data={sampleData}
      />
      <StatsCard
        title="Subscriptions"
        value={formatNumber(2350)}
        change={180.1}
        icon={<UsersIcon />}
        trend="up"
        data={sampleData.map((d) => ({ value: d.value * 0.8 }))}
      />
      <StatsCard
        title="Sales"
        value={formatNumber(12234)}
        change={19}
        icon={<ShoppingCartIcon />}
        trend="up"
        data={sampleData.map((d) => ({ value: d.value * 1.2 }))}
      />
      <StatsCard
        title="Active Now"
        value={formatNumber(573)}
        change={-2.1}
        icon={<ActivityIcon />}
        trend="down"
        data={sampleData.map((d) => ({ value: d.value * 0.6 }))}
      />
    </div>
  );
}
