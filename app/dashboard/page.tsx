// import { EmptyState } from "@/components/general/EmptyState";
// import { getAllCourses } from "../data/course/get-all-courses";
// import { getEnrolledCourses } from "../data/user/get-enrolled-courses"
// import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
// import { CourseProgressCard } from "./_components/CourseProgressCard";


// export default async function DashboardPage() {

//   const [course, enrolledCourses] = await Promise.all([
//    getAllCourses(),
//    getEnrolledCourses()
//   ]);

//   return (
//   <>
//   <div className="flex flex-col gap-2">
//     <h1 className="text-3xl font-bold">
//       Enrolled Courses
//     </h1>
//     <p className="text-muted-foreground">
//       Here you can see all the courses you have access to 
//     </p>
//   </div>

//   {enrolledCourses.length === 0 ? (
//     <EmptyState
//     title="No courses purchased"
//     description="You have not purchased any courses yet"
//     buttonText="Browse Courses"
//     href="/courses"
//     />
//   ): (
//    <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
//     {enrolledCourses.map((course) => (
//       <CourseProgressCard key={course.Course.id} data={course} />
//     ))}
//    </div>
//   )}


//   <section className="mt-10">
//      <div className="flex flex-col gap-2 mb-5">
//     <h1 className="text-3xl font-bold">
//       Available Courses
//     </h1>
//     <p className="text-muted-foreground">
//       Here you can see all the courses you can purchase
//     </p>
//   </div>

//   {course.filter(
//     (course) => !enrolledCourses.some(
//       ({Course: enrolled}) => enrolled.id === course.id
//     )
//   ).length ===0 ? (
//     <EmptyState
//     title="No courses available"
//     description="You have already purchased all available courses"
//     buttonText="Browse Courses"
//     href="/courses"
//     />
//   ): (
    
//     <div className="grid  grid-cols-1 md:grid-cols-2 gap-6">
//        {course.filter(
//     (course) => !enrolledCourses.some(
//       ({Course: enrolled}) => enrolled.id === course.id
//     )
//   ).map((course) => (
//    <PublicCourseCard 
//    key={course.id}
//    data={course}
//    />
//   ))}
//     </div>
//   )}
//   </section>
//   </>
//   );
// }


// app/dashboard/page.tsx
// The main student dashboard page.
// Shows: welcome banner, learning stats, enrolled courses with progress,
//        and available courses to browse.
// It's a server component — fetches all data at once for fast loading.

import { EmptyState } from "@/components/general/EmptyState";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";
import { requireUser } from "../data/user/require-user";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Flame, Target } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  // Load everything in parallel for speed
  const [user, courses, enrolledCourses] = await Promise.all([
    requireUser(),
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  // Count total lessons completed across all enrolled courses
  const completedLessons = await prisma.lessonProgress.count({
    where: { userId: user.id, completed: true },
  });

  // Count total lessons available in enrolled courses (for the "lessons" stat)
  const totalEnrolledLessons = await prisma.lesson.count({
    where: {
      Chapter: {
        Course: {
          enrollment: { some: { userId: user.id, status: "Active" } },
        },
      },
    },
  });

  // Not-yet-enrolled courses
  const unenrolledCourses = courses.filter(
    (c) => !enrolledCourses.some(({ Course }) => Course.id === c.id)
  );

  // Compute a simple "streak" — days in a row with at least one lesson completed
  // We look at lessonProgress and count consecutive days
  const recentProgress = await prisma.lessonProgress.findMany({
    where: { userId: user.id, completed: true },
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
    take: 100, // Only look at last 100 to keep it fast
  });

  // Compute streak: count how many consecutive days back have activity
  let streak = 0;
  if (recentProgress.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeDays = new Set(
      recentProgress.map((p) => {
        const d = new Date(p.updatedAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Walk backwards day by day from today
    for (let i = 0; i < 365; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      if (activeDays.has(day.getTime())) {
        streak++;
      } else {
        break; // Streak is broken
      }
    }
  }

  // Overall progress percentage across all enrolled courses
  const progressPercent =
    totalEnrolledLessons > 0
      ? Math.round((completedLessons / totalEnrolledLessons) * 100)
      : 0;

  // First name for the greeting
  const firstName = user.name?.split(" ")[0] || "Learner";

  return (
    <>
      {/* ── Welcome Banner ──────────────────────────────────────────── */}
      <div className="rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border">
        <h1 className="text-2xl font-bold mb-1">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          {enrolledCourses.length > 0
            ? `You have ${enrolledCourses.length} active course${enrolledCourses.length > 1 ? "s" : ""}. Keep going!`
            : "Start your learning journey by enrolling in a course below."}
        </p>
        {enrolledCourses.length > 0 && (
          <Link
            href={`/dashboard/${enrolledCourses[0].Course.slug}`}
            className={buttonVariants({ className: "mt-4", size: "sm" })}
          >
            Continue Learning →
          </Link>
        )}
      </div>

      {/* ── Learning Stats ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1: Courses enrolled */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled
            </CardTitle>
            <BookOpen className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{enrolledCourses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Courses</p>
          </CardContent>
        </Card>

        {/* Stat 2: Lessons completed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <Trophy className="size-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedLessons}</p>
            <p className="text-xs text-muted-foreground mt-1">Lessons</p>
          </CardContent>
        </Card>

        {/* Stat 3: Learning streak */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Streak
            </CardTitle>
            <Flame className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {streak === 1 ? "Day" : "Days"} in a row
            </p>
          </CardContent>
        </Card>

        {/* Stat 4: Overall progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progress
            </CardTitle>
            <Target className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{progressPercent}%</p>
            <p className="text-xs text-muted-foreground mt-1">Overall</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Enrolled Courses ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">My Courses</h2>
        {enrolledCourses.length === 0 ? (
          <EmptyState
            title="No courses yet"
            description="Browse and enroll in a course to get started"
            buttonText="Browse Courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enrolledCourses.map((enrollment) => (
              <CourseProgressCard key={enrollment.Course.id} data={enrollment} />
            ))}
          </div>
        )}
      </div>

      {/* ── Available Courses ─────────────────────────────────────────── */}
      {unenrolledCourses.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Explore More Courses</h2>
            <Link href="/courses" className={buttonVariants({ variant: "outline", size: "sm" })}>
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {unenrolledCourses.slice(0, 4).map((course) => (
              <PublicCourseCard key={course.id} data={course} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
