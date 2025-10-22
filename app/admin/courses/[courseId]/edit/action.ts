"use server";

import { requireAdmin } from "@/app/data/admin/require-Admin";
import arcjets, { detectBot, fixedWindow } from "@/lib/arcjets";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";


  const aj = arcjets.withRule(
       detectBot({
           mode: "LIVE",
           allow: [],
       })
   ).withRule(
       fixedWindow({
           mode: "LIVE",
           window: "1m",
           max: 6,
       })
   );
  
export async function editCourse(data: CourseSchemaType, courseId: string):
 Promise<ApiResponse> {
    const user = await requireAdmin();

    try {
      
        const req = await request();

     const decision = await aj.protect(req, {
        fingerprint: user.user.id, 
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

        const result = courseSchema.safeParse(data);

        if(!result.success) {
            return {
                status: "error",
                message: "Invalid data",
            };
        }

        await prisma.course.update({
            where: {
                id: courseId,
                userId: user.user.id,
            },
            data: {
                ...result.data,
            },
        });

        return {
            status: "success",
            message: "Course Updated successfully",
        };

    } catch {
        return {
           status: "error",
           message: "Failed to upadate Course",
        }
    }
    
}