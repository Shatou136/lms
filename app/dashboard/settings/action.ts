// app/dashboard/settings/action.ts
// Server action to update the user's display name.
// "use server" means this code ONLY runs on the server — not in the browser.

"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";

export async function updateUserSettings({
  userId,
  name,
}: {
  userId: string;
  name: string;
}): Promise<ApiResponse> {
  try {
    // Security check: make sure the logged-in user matches the userId being updated
    const session = await requireUser();
    if (session.id !== userId) {
      return { status: "error", message: "Unauthorized" };
    }

    // Validate: name must not be empty
    if (!name.trim()) {
      return { status: "error", message: "Name cannot be empty" };
    }

    // Update the user's name in the database
    await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });

    return { status: "success", message: "Settings updated successfully" };

  } catch {
    return { status: "error", message: "Failed to update settings" };
  }
}