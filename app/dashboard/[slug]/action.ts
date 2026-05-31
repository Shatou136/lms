"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function cancelEnrollmentAction(
  courseSlug: string
): Promise<ApiResponse> {
  const user = await requireUser();

  try {
    const course = await prisma.course.findUnique({
      where: { slug: courseSlug },
      select: { id: true },
    });

    if (!course) {
      return { status: "error", message: "Course not found." };
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      select: { status: true },
    });

    if (!enrollment) {
      return { status: "error", message: "Enrollment not found." };
    }

    if (enrollment.status !== "Active") {
      return {
        status: "error",
        message: "Only active enrollments can be cancelled.",
      };
    }

    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      data: { status: "Cancelled" },
    });

    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/${courseSlug}`);
    revalidatePath(`/courses/${courseSlug}`);

  } catch {
    return { status: "error", message: "Failed to cancel enrollment." };
  }

  // redirect() must be called OUTSIDE try/catch so Next.js can handle it
  redirect("/dashboard");
}