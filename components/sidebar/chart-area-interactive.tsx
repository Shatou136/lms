"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"



export const description = "An interactive area chart"

const dummyEnrollmentData = [
  { date: "2026-01-15", enrollments: 12 },
  { date: "2026-01-16", enrollments: 8  },
  { date: "2026-01-17", enrollments: 15 },
  { date: "2026-01-18", enrollments: 23 },
  { date: "2026-01-19", enrollments: 18 },
  { date: "2026-01-20", enrollments: 31 },
  { date: "2026-01-21", enrollments: 28 },
  { date: "2026-01-22", enrollments: 22 },
  { date: "2026-01-23", enrollments: 19 },
  { date: "2026-01-24", enrollments: 35 },
  { date: "2026-01-25", enrollments: 38 },
  { date: "2026-01-26", enrollments: 35 },
  { date: "2026-01-27", enrollments: 29 },
  { date: "2026-01-28", enrollments: 33 },
  { date: "2026-01-29", enrollments: 45 },
  { date: "2026-01-30", enrollments: 52 },
  { date: "2026-01-31", enrollments: 48 },
  { date: "2026-02-01", enrollments: 55 },
  { date: "2026-02-02", enrollments: 41 },
  { date: "2026-02-03", enrollments: 37 },
  { date: "2026-02-04", enrollments: 44 },
  { date: "2026-02-05", enrollments: 39 },
  { date: "2026-02-06", enrollments: 47 },
  { date: "2026-02-07", enrollments: 51 },
  { date: "2026-02-08", enrollments: 43 },
  { date: "2026-02-09", enrollments: 36 },
  { date: "2026-02-10", enrollments: 49 },
  { date: "2026-02-11", enrollments: 58 },
  { date: "2026-02-12", enrollments: 62 },
  { date: "2026-02-13", enrollments: 54 },
  { date: "2026-02-14", enrollments: 46 },
  { date: "2026-02-15", enrollments: 40 },

];

const chartConfig = {

  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;


interface ChartAreaInteractiveProps {
  data: {
    date: string;
    enrollments: number;
  }[]; 
} 


export function ChartAreaInteractive({data}: ChartAreaInteractiveProps) {

  const totalEnrollmentsNumber = React.useMemo(() => 
    data.reduce((acc, curr) => acc + curr.enrollments, 0),
  [data]
  );
 
  return (
    <Card className="@container/card">
      <CardHeader>
       <CardTitle>Total Enrollments</CardTitle>
       <CardDescription>
        <span className="hidden @[540px]/card:block">
         Total Enrollments for the last 30 days: {totalEnrollmentsNumber}
        </span>
        <span className="@[540px]/card:hidden">
          Last 30 days: {totalEnrollmentsNumber}
        </span>
       </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
       <ChartContainer 
       config={chartConfig} 
       className="aspect-auto h-[250px] w-full"
       >
         <BarChart
         data={data} 
         margin={{
          left: 12,
          right: 12,
         }}
         >
         <CartesianGrid vertical={false} />
         <XAxis
         dataKey="date"
         tickLine={false}
         axisLine={false}
         tickMargin={8}
         interval={"preserveStartEnd"}
         tickFormatter={(value) => {
          const date = new Date(value);
          return date.toLocaleDateString("en-Douala", {
            month: "short",
            day: "numeric",
          });
         }} 
          />

          <ChartTooltip 
          content={
            <ChartTooltipContent
            className="w-[150px]"
            labelFormatter={(value) => {
              const date = new Date(value);
          return date.toLocaleDateString("en-Douala", {
            month: "short",
            day: "numeric",
          });
            }}
            />
           } 
          />

          <Bar  dataKey={"enrollments"}
           fill="var(--color-enrollments)"
           />
         </BarChart>
       </ChartContainer>
      </CardContent>
    </Card>
  )
}
