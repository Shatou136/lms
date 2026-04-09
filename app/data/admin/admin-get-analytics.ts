import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-Admin";

export async function adminGetAnalytics() {
  await requireAdmin();

  const now = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  // Run all queries in parallel for speed
  const [
    totalUsers,
    newUsersLast30Days,
    totalEnrollments,
    activeEnrollments,
    revenueData,
    topCourses,
    lessonCompletions,
    dailySignups,
    courseCompletionRates,
  ] = await Promise.all([

    // Total registered users
    prisma.user.count(),

    // New signups in last 30 days
    prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    }),

    // Total enrollments ever
    prisma.enrollment.count(),

    // Currently active enrollments
    prisma.enrollment.count({
      where: { status: "Active" },
    }),

    // Revenue: sum of all active enrollment amounts
    prisma.enrollment.aggregate({
      where: { status: "Active" },
      _sum: { amount: true },
      _count: true,
    }),

    // Top 5 courses by enrollment count
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        _count: {
          select: {
            enrollment: {
              where: { status: "Active" },
            },
          },
        },
      },
      orderBy: {
        enrollment: { _count: "desc" },
      },
      take: 5,
    }),

    // Lesson completions in last 30 days
    prisma.lessonProgress.count({
      where: {
        completed: true,
        updatedAt: { gte: thirtyDaysAgo },
      },
    }),

    // Daily user signups over last 30 days
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),

    // Course completion rates (users who completed ALL lessons)
    prisma.course.findMany({
      select: {
        id: true,
        title: true,
        chapter: {
          select: {
            lessons: {
              select: { id: true },
            },
          },
        },
        enrollment: {
          where: { status: "Active" },
          select: { userId: true },
        },
      },
      take: 5,
    }),
  ]);

  // Build daily signups chart data
  const signupChartData: { date: string; signups: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    signupChartData.push({
      date: date.toISOString().split("T")[0],
      signups: 0,
    });
  }
  dailySignups.forEach((user) => {
    const dateStr = user.createdAt.toISOString().split("T")[0];
    const idx = signupChartData.findIndex((d) => d.date === dateStr);
    if (idx !== -1) signupChartData[idx].signups++;
  });

  // Calculate course completion rates
  const completionRates = await Promise.all(
    courseCompletionRates.map(async (course) => {
      const totalLessons = course.chapter.reduce(
        (sum, ch) => sum + ch.lessons.length,
        0
      );
      const enrolledUserIds = course.enrollment.map((e) => e.userId);

      if (totalLessons === 0 || enrolledUserIds.length === 0) {
        return { title: course.title, completionRate: 0, enrolled: 0 };
      }

      // Count users who completed all lessons in this course
      const lessonIds = course.chapter.flatMap((ch) =>
        ch.lessons.map((l) => l.id)
      );

      const completedUsers = await prisma.lessonProgress.groupBy({
        by: ["userId"],
        where: {
          lessonId: { in: lessonIds },
          completed: true,
          userId: { in: enrolledUserIds },
        },
        having: {
          userId: { _count: { equals: totalLessons } },
        },
      });

      const completionRate =
        enrolledUserIds.length > 0
          ? Math.round((completedUsers.length / enrolledUserIds.length) * 100)
          : 0;

      return {
        title: course.title,
        completionRate,
        enrolled: enrolledUserIds.length,
      };
    })
  );

  return {
    // Summary stats
    totalUsers,
    newUsersLast30Days,
    totalEnrollments,
    activeEnrollments,
    totalRevenue: revenueData._sum.amount ?? 0,
    lessonCompletionsLast30Days: lessonCompletions,

    // Chart data
    signupChartData,

    // Top courses
    topCourses: topCourses.map((c) => ({
      title: c.title,
      price: c.price,
      enrollments: c._count.enrollment,
    })),

    // Completion rates
    completionRates,
  };
}

export type AdminAnalyticsType = Awaited<ReturnType<typeof adminGetAnalytics>>;