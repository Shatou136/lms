import "server-only";
import { prisma } from "@/lib/db";

// Returns true if the user has completed every lesson in the course
export async function checkCourseCompletion(
  userId: string,
  courseSlug: string
): Promise<{
  isComplete: boolean;
  completedLessons: number;
  totalLessons: number;
  courseTitle: string;
}> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: {
      title: true,
      chapter: {
        select: {
          lessons: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) {
    return { isComplete: false, completedLessons: 0, totalLessons: 0, courseTitle: "" };
  }

  const allLessonIds = course.chapter.flatMap((ch) =>
    ch.lessons.map((l) => l.id)
  );

  const totalLessons = allLessonIds.length;

  if (totalLessons === 0) {
    return { isComplete: false, completedLessons: 0, totalLessons: 0, courseTitle: course.title };
  }

  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completed: true,
    },
  });

  return {
    isComplete: completedCount >= totalLessons,
    completedLessons: completedCount,
    totalLessons,
    courseTitle: course.title,
  };
}