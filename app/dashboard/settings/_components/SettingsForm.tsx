// app/dashboard/settings/_components/SettingsForm.tsx
// The actual settings form with all the interactive elements.
// "use client" because it handles form state, input changes, and button clicks.

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Bell, Shield } from "lucide-react";
import { toast } from "sonner";
import { updateUserSettings } from "../action";

interface SettingsFormProps {
  initialName: string;
  initialEmail: string;
  userId: string;
}

export function SettingsForm({ initialName, initialEmail, userId }: SettingsFormProps) {
  const [name, setName] = useState(initialName);
  // Email is shown but not editable (it's tied to auth)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      const result = await updateUserSettings({ userId, name });
      if (result.status === "success") {
        toast.success("Settings saved!");
      } else {
        toast.error(result.message || "Failed to save settings");
      }
    });
  }

  return (
    <div className="space-y-6">

      {/* ── Profile Section ──────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <User className="size-5 text-primary" />
          <div>
            <CardTitle className="text-base">Profile</CardTitle>
            <CardDescription>Update your display name</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Display Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            {/* Email is read-only — it's managed by the auth system */}
            <Input
              id="email"
              value={initialEmail}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed here. Contact support if needed.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── Notifications Section ─────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <Bell className="size-5 text-primary" />
          <div>
            <CardTitle className="text-base">Notifications</CardTitle>
            <CardDescription>Control what emails you receive</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle: Course update emails */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Course Updates</p>
              <p className="text-xs text-muted-foreground">
                Get notified when new lessons are added to your courses
              </p>
            </div>
            {/* Simple toggle using a checkbox styled as a switch */}
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors
                ${emailNotifications ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span
                className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform
                  ${emailNotifications ? "translate-x-5" : "translate-x-1"}`}
              />
            </button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Weekly Progress Report</p>
              <p className="text-xs text-muted-foreground">
                Receive a weekly summary of your learning activity
              </p>
            </div>
            <button
              className="relative inline-flex h-5 w-9 items-center rounded-full bg-muted-foreground/30"
            >
              <span className="inline-block h-3 w-3 rounded-full bg-white shadow translate-x-1" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* ── Account Security ──────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <Shield className="size-5 text-primary" />
          <div>
            <CardTitle className="text-base">Account</CardTitle>
            <CardDescription>Account security information</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your account is secured with {initialEmail.includes("@") ? "email OTP" : "OAuth"}.
            Sign in method: <strong>Email / GitHub</strong>
          </p>
        </CardContent>
      </Card>

      {/* ── Save Button ───────────────────────────────────────── */}
      <Button onClick={handleSave} disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </div>
  );
}