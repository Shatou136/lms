"use server";

import { requireAdmin } from "@/app/data/admin/require-Admin";
import arcjets, { fixedWindow } from "@/lib/arcjets";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";


 const aj = arcjets.withRule(
     fixedWindow({
         mode: "LIVE",
         window: "1m",
         max: 6,
     })
 );


export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  const session =  await requireAdmin();

    try {

        const req = await request();
        
         const decision = await aj.protect(req, {
            fingerprint: session.user.id,
         });
         
         if (decision.isDenied()) {
           if (decision.reason.isRateLimit()) {
            return {
                status: "error",
                message: "You have been blocked due to rate limiting",
            };
           } else {
            return {
                status: "error",
                message: "You are a bot! if this is a mistake contact support",
            };
           }
         }

        await prisma.course.delete({
            where: {
                id: courseId,
            },
        });

        revalidatePath("/admin/courses");

        return { 
            status: "success",
            message: "Course deleted successfully",
        };

    }  catch {
        return {
            status: "error",
            message: "Failed to delete course",
        };
    }

}