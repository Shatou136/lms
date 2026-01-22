import { requireAdmin } from "@/app/data/admin/require-Admin";
import arcjets, { fixedWindow } from "@/lib/arcjets";
import { env } from "@/lib/env";
import { S3 } from "@/lib/S3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
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

          if(decision.isDenied()) {
            return NextResponse.json(
                { error: "dudde not good" },
                { status: 429 }
            );
        }



  const body = await request.json();

    const key = body.key;

    if(!key) {
        return NextResponse.json(
            {error: "Missing or invalid object key"},
            {status: 400}
        );
    }

    const command = new DeleteObjectCommand({
        Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
        Key: key,
    });

    await S3.send(command);

    return NextResponse.json(
        {message: "File deleted successfully"},
        {status: 200}
    );

    } catch {
          return NextResponse.json(
            {error: "Missing or invalid object key"},
            {status: 500}
        );
    }

}