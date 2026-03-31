// import { requireAdmin } from "@/app/data/admin/require-Admin";
// import arcjets, { fixedWindow } from "@/lib/arcjets";
// import { env } from "@/lib/env";
// import { S3 } from "@/lib/S3Client";
// import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// import { NextResponse } from "next/server";

// const aj = arcjets.withRule(
//     fixedWindow({
//         mode: "LIVE",
//         window: "1m",
//         max: 6,
//     })
// );

// export async function DELETE(request: Request) {

//    const session = await requireAdmin();

//     try {

//  const decision = await aj.protect(request, {
//             fingerprint: session?.user.id as string,
//         });

//           if(decision.isDenied()) {
//             return NextResponse.json(
//                 { error: "dudde not good" },
//                 { status: 429 }
//             );
//         }



//   const body = await request.json();

//     const key = body.key;

//     if(!key) {
//         return NextResponse.json(
//             {error: "Missing or invalid object key"},
//             {status: 400}
//         );
//     }

//     const command = new DeleteObjectCommand({
//         Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
//         Key: key,
//     });

//     await S3.send(command);

//     return NextResponse.json(
//         {message: "File deleted successfully"},
//         {status: 200}
//     );

//     } catch {
//           return NextResponse.json(
//             {error: "Missing or invalid object key"},
//             {status: 500}
//         );
//     }

// }  


// app/api/s3/delete/route.ts
import { requireAdmin } from "@/app/data/admin/require-Admin";
import arcjets, { fixedWindow } from "@/lib/arcjets";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

const aj = arcjets.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 6,
  })
);

export async function DELETE(request: Request) {
  const session = await requireAdmin();

  try {
    const decision = await aj.protect(request, {
      fingerprint: session?.user.id as string,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 });
    }

    const body = await request.json();
    const key = body.key; // This will now be the Cloudinary public_id

    if (!key) {
      return NextResponse.json(
        { error: "Missing or invalid object key" },
        { status: 400 }
      );
    }

    // Determine if it's a video or image based on the public_id path
    // Cloudinary public_id for videos stored in shatoulms folder
    // We try image first, then video
    let destroyed = false;

    try {
      const result = await cloudinary.uploader.destroy(key, {
        resource_type: "image",
      });
      if (result.result === "ok") destroyed = true;
    } catch {
      // not an image, try video
    }

    if (!destroyed) {
      try {
        const result = await cloudinary.uploader.destroy(key, {
          resource_type: "video",
        });
        if (result.result === "ok") destroyed = true;
      } catch {
        // ignore
      }
    }

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}