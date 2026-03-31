// import { env } from "@/lib/env";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { NextResponse } from "next/server";
// import {z} from "zod";
// import { v4 as uuidv4 } from 'uuid';
// import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
// import { S3 } from "@/lib/S3Client";
// import arcjets, { fixedWindow } from "@/lib/arcjets";
// import { requireAdmin } from "@/app/data/admin/require-Admin";

// export const fileUploadSchema = z.object({
//     fileName: z.string().min(1, {message: "Filename is required"}),
//     contentType: z.string().min(1, {message: "Content type is required"}),
//     size: z.number().min(1, {message: "Size is required"}),
//     isImage: z.boolean(),
// });

// const aj = arcjets.withRule(
//     fixedWindow({
//         mode: "LIVE",
//         window: "1m",
//         max: 6,
//     })
// );

// export async function POST(request: Request) {

// const session = await requireAdmin();

//     try {

//         const decision = await aj.protect(request, {
//             fingerprint: session?.user.id as string,
//         });

//         if(decision.isDenied()) {
//             return NextResponse.json(
//                 { error: "dudde not good" },
//                 { status: 429 }
//             );
//         }

// const body = await request.json();

// const validation = fileUploadSchema.safeParse(body);

// if(!validation.success) {
//     return NextResponse.json(
//         { error: "Invalid Request Body" },
//         { status: 400 }
//     );
// }

// const {fileName, contentType, size} = validation.data;

// const uniquKey =`${uuidv4()}-${fileName}`

// const command = new PutObjectCommand({
//     Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//     ContentType: contentType,
//     ContentLength: size,
//     Key: uniquKey
// });


// const presignedUrl = await getSignedUrl(S3, command, {
//     expiresIn: 1800, //url expires in 30 minutes
// });

// const response = {
//     presignedUrl,
//     key: uniquKey,
// };

// return NextResponse.json(response);

//     } catch {
//         return NextResponse.json(
//             {error: "Failed to generate presigned URL"},
//             {status: 500}
//         );
//     }
// }


// app/api/s3/upload/route.ts
import { requireAdmin } from "@/app/data/admin/require-Admin";
import arcjets, { fixedWindow } from "@/lib/arcjets";
import { NextResponse } from "next/server";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

const aj = arcjets.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 6,
  })
);

export async function POST(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { isImage } = validation.data;

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "shatoulms";
    const resourceType = isImage ? "image" : "video";

    // ✅ resource_type is NOT included in signature — Cloudinary excludes it
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      folder,
      resourceType,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
    });

  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}