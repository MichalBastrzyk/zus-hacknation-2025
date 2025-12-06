"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { StatisticData } from "@/db/dbHelpers/getAccidentStatistics"
import { ResponsiveContainer, Pie, LabelList, PieChart } from "recharts"

interface AccidentChartProps {
  title: string
  description: string
  data: StatisticData[]
  dataKey: string
}

export function AccidentChart({
  title,
  description,
  data,
  dataKey,
}: AccidentChartProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            value: {
              label: "Liczba",
            },
          }}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="value" nameKey={dataKey} fill="#8884d8">
                <LabelList
                  dataKey={dataKey}
                  className="fill-background"
                  stroke="none"
                  fontSize={12}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Łączna liczba: {data.reduce((sum, item) => sum + item.value, 0)}
        </div>
      </CardFooter>
    </Card>
  )
}

interface StatsSummaryCardProps {
  title: string
  value: number
  color: string
}

export function StatsSummaryCard({
  title,
  value,
  color,
}: StatsSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`text-3xl font-bold ${color} p-4 rounded-lg text-center`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  )
}
