"use server";

import { requireAdmin } from "@/app/data/admin/require-Admin";
import arcjets, { fixedWindow } from "@/lib/arcjets";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";


 const aj = arcjets.withRule(
     fixedWindow({
         mode: "LIVE",
         window: "1m",
         max: 6,
     })
 );

export async function CreateCourse(
    values: CourseSchemaType
 ): Promise<ApiResponse> {

    const session = await requireAdmin();

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

 const validation = courseSchema.safeParse(values);

 if(!validation.success) {
    return {
        status: "error",
        message: "Invalid Form Data",
    };
 }

 const data = await stripe.products.create({
    name: validation.data.title,
    description: validation.data.smallDescription,
    default_price_data: {
        currency: "xaf",
        unit_amount: validation.data.price * 100, // in centimes
    },
 });

  await prisma.course.create({
    data: {
        ...validation.data,
        userId: session?.user.id as string,
        stripePriceId: data.default_price as string,
     },
 });

 return {
    status: "success",
    message: "Course created successfully",
 }

    } catch (error) {
        console.error("CreateCourse error:", error);
        return {
            status: "error",
            message: "Failed to create course"
        }
    }

}