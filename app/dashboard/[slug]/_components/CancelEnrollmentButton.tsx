"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, XCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { cancelEnrollmentAction } from "../action";
import { toast } from "sonner";

interface Props {
  courseSlug: string;
}

export function CancelEnrollmentButton({ courseSlug }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        cancelEnrollmentAction(courseSlug)
      );

      // cancelEnrollmentAction calls redirect() on success,
      // so if we reach here it means an error response was returned.
      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result?.status === "error") {
        toast.error(result.message);
      }

      setOpen(false);
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        >
          <XCircle className="size-4" />
          Cancel Enrollment
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel your enrollment?</AlertDialogTitle>
          <AlertDialogDescription>
            You will lose access to this course immediately. Your progress will
            be preserved if you re-enroll later, but you will need to pay again.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Keep Enrollment</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={pending}
          >
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Yes, Cancel Enrollment"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}