"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  signupChartData: { date: string; signups: number }[];
  topCourses: { title: string; price: number; enrollments: number }[];
  completionRates: {
    title: string;
    completionRate: number;
    enrolled: number;
  }[];
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

// Formats "2026-04-09" → "Apr 9"
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AnalyticsCharts({
  signupChartData,
  topCourses,
  completionRates,
}: Props) {

  // Only show dates that have ticks every ~5 days so x-axis isn't crowded
  const tickDates = signupChartData
    .filter((_, i) => i % 5 === 0 || i === signupChartData.length - 1)
    .map((d) => d.date);

  return (
    <div className="space-y-6">

      {/* ── Row 1: Signups chart + Top courses ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily signups bar chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily User Signups</CardTitle>
            <CardDescription>
              New account registrations over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={signupChartData}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 11 }}
                  ticks={tickDates}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value: number) => [value, "Signups"]}
                  labelFormatter={formatDate}
                  contentStyle={{
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="signups"
                  fill="var(--color-chart-1, #f97316)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top courses by enrollment */}
        <Card>
          <CardHeader>
            <CardTitle>Top Courses by Enrollment</CardTitle>
            <CardDescription>
              The 5 most enrolled courses on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topCourses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                No enrollment data yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={topCourses}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                    width={120}
                    tickFormatter={(v: string) =>
                      v.length > 18 ? v.slice(0, 18) + "…" : v
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => [value, "Enrollments"]}
                    contentStyle={{
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="enrollments"
                    radius={[0, 4, 4, 0]}
                  >
                    {topCourses.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>

      {/* ── Row 2: Course completion rates ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Course Completion Rates</CardTitle>
          <CardDescription>
            Percentage of enrolled students who completed each course
          </CardDescription>
        </CardHeader>
        <CardContent>
          {completionRates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No completion data yet
            </p>
          ) : (
            <div className="space-y-5">
              {completionRates.map((course) => (
                <div key={course.title} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate max-w-[60%]">
                      {course.title}
                    </span>
                    <span className="text-muted-foreground">
                      {course.completionRate}% &nbsp;·&nbsp;{" "}
                      {course.enrolled}{" "}
                      {course.enrolled === 1 ? "student" : "students"}
                    </span>
                  </div>
                  <Progress value={course.completionRate} className="h-2" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}