// app/dashboard/settings/page.tsx
// A working settings page for the student.
// Lets users update their display name and toggle email notifications.
// This is a server component that passes data to a client component form.

import { requireUser } from "@/app/data/user/require-user";
import { SettingsForm } from "./_components/SettingsForm";


export default async function SettingsPage() {
  // Get the current user's data to pre-fill the form
  const user = await requireUser();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account preferences
        </p>
      </div>

      {/* Pass user data to the client-side form component */}
      <SettingsForm
        initialName={user.name ?? ""}
        initialEmail={user.email}
        userId={user.id}
      />
    </div>
  );
}