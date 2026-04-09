// ONLY for development testing - remove before production
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const { enrollmentId } = await req.json();

  await prisma.enrollment.update({
    where: { id: enrollmentId },
    data: { status: "Active" },
  });

  return NextResponse.json({ success: true });
}