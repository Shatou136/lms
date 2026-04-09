// "use server";

// import { requireUser } from "@/app/data/user/require-user";
// import { prisma } from "@/lib/db";
// import { ApiResponse } from "@/lib/types";
// import { revalidatePath } from "next/cache";

// export async function markLessonComplete(
//     lessonId: string,
//     slug:  string,
// ): Promise<ApiResponse> {

//     const session = await requireUser();
     
//     try {

//         await prisma.lessonProgress.upsert({
//            where: {
//             userId_lessonId: {
//                 userId: session.id,
//                 lessonId: lessonId,
//             },
//            },
//            update: {
//             completed: true,
//            },
//            create: {
//             lessonId: lessonId,
//             userId: session.id,
//             completed: true,
//            },
//         });

      
//         revalidatePath(`/dashboard/${slug}`);

//         return {
//             status: "success",
//             message: "Progress updated",
//         };

//     } catch (error) {
//         console.error("Error marking lesson as complete:", error);
//         return {
//             status: "error",
//             message: "Failed to mark lesson as complete",
//         };
//     }
// }



"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { checkCourseCompletion } from "@/app/data/course/check-course-completion";
import { sendCourseCompletionEmail } from "@/lib/send-completion-email";

export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse & { courseCompleted?: boolean }> {

  const session = await requireUser();

  try {
    // 1. Mark this lesson as complete (upsert = create if not exists, update if exists)
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        lessonId: lessonId,
        userId: session.id,
        completed: true,
      },
    });

    // 2. Check if the user just completed the entire course
    const completion = await checkCourseCompletion(session.id, slug);

    let courseCompleted = false;

    if (completion.isComplete) {
      courseCompleted = true;

      // 3. Send a congratulations email with certificate info
      // We do this in the background — don't await so it doesn't slow the UI
      sendCourseCompletionEmail({
        userEmail: session.email,
        userName: session.name ?? session.email.split("@")[0],
        courseTitle: completion.courseTitle,
        courseSlug: slug,
      }).catch((err) => {
        // Log but don't crash — email failure shouldn't break lesson completion
        console.error("Failed to send completion email:", err);
      });
    }

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: courseCompleted
        ? "🎉 Congratulations! You completed the course!"
        : "Progress updated",
      courseCompleted,
    };

  } catch (error) {
    console.error("Error marking lesson as complete:", error);
    return {
      status: "error",
      message: "Failed to mark lesson as complete",
    };
  }
}