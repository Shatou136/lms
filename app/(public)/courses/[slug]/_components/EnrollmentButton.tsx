// "use client";

// import { Button } from "@/components/ui/button";
// import { tryCatch } from "@/hooks/try-catch";
// import { useTransition } from "react";
// import { enrollInCourseAction } from "../action";
// import { toast } from "sonner";
// import { Loader2 } from "lucide-react";


// export function EnrollmentButton({courseId}: {courseId: string}) {

//     const [pending, startTransition] = useTransition();

//      // 2. Define a submit handler.
//      function onSubmit() {
//       startTransition(async () => {
//        const {data: result, error} = await tryCatch(enrollInCourseAction(courseId));
   
//        if(error) {
//            toast.error("An unexpected error occurred. Please try again.");
//            return;
//        }
   
//        if(result.status === "success") {
//            toast.success(result.message);
//        } else if(result.status === "error") {
//            toast.error(result.message);
//        }
   
//       });
//      }

//     return (
//         <Button
//         onClick={onSubmit}
//         disabled={pending}
//          className="w-full">
//             {pending ? (
//                 <>
//                 <Loader2 className="size-4 animate-spin" />
//                 Loading...
//                 </>
//             ): (
//                 "Enroll Now!"
//             )}
//         </Button>
//     );
// }





// "use client";

// import { Button } from "@/components/ui/button";
// import { tryCatch } from "@/hooks/try-catch";
// import { useState, useTransition } from "react";
// import { enrollInCourseAction, enrollWithMobileMoneyAction } from "../action";
// import { toast } from "sonner";
// import { Loader2, CreditCard, Smartphone } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// // The two radio options for mobile money provider
// type MomoProvider = "orange" | "mtn";

// export function EnrollmentButton({ courseId }: { courseId: string }) {
//   const [stripePending, startStripeTransition] = useTransition();
//   const [momoPending, startMomoTransition] = useTransition();

//   // Mobile money dialog state
//   const [momoOpen, setMomoOpen] = useState(false);
//   const [provider, setProvider] = useState<MomoProvider>("mtn");
//   const [phone, setPhone] = useState("");

//   // ── Stripe payment (existing flow) ──────────────────────────────
//   function onStripeSubmit() {
//     startStripeTransition(async () => {
//       const { data: result, error } = await tryCatch(
//         enrollInCourseAction(courseId)
//       );

//       if (error) {
//         toast.error("An unexpected error occurred. Please try again.");
//         return;
//       }

//       if (result.status === "success") {
//         toast.success(result.message);
//       } else if (result.status === "error") {
//         toast.error(result.message);
//       }
//     });
//   }

//   // ── Mobile Money demo payment ────────────────────────────────────
//   function onMomoSubmit() {
//     // Basic phone validation
//     if (!phone.trim() || phone.trim().length < 9) {
//       toast.error("Please enter a valid phone number (min 9 digits).");
//       return;
//     }

//     startMomoTransition(async () => {
//       const { data: result, error } = await tryCatch(
//         enrollWithMobileMoneyAction(courseId, provider, phone.trim())
//       );

//       if (error) {
//         toast.error("An unexpected error occurred. Please try again.");
//         return;
//       }

//       if (result.status === "success") {
//         setMomoOpen(false);
//         toast.success(result.message);
//       } else if (result.status === "error") {
//         toast.error(result.message);
//       }
//     });
//   }

//   return (
//     <div className="space-y-3">
//       {/* ── Stripe button ────────────────────────── */}
//       <Button
//         onClick={onStripeSubmit}
//         disabled={stripePending || momoPending}
//         className="w-full"
//         variant="default"
//       >
//         {stripePending ? (
//           <>
//             <Loader2 className="size-4 animate-spin" />
//             Redirecting to Stripe...
//           </>
//         ) : (
//           <>
//             <CreditCard className="size-4" />
//             Pay with Card (Stripe)
//           </>
//         )}
//       </Button>

//       {/* ── Mobile Money button / dialog ─────────── */}
//       <Dialog open={momoOpen} onOpenChange={setMomoOpen}>
//         <DialogTrigger asChild>
//           <Button
//             variant="outline"
//             className="w-full"
//             disabled={stripePending || momoPending}
//           >
//             <Smartphone className="size-4" />
//             Pay with Mobile Money
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Mobile Money Payment</DialogTitle>
//             <DialogDescription>
//               Choose your provider and enter your phone number to complete
//               enrollment. This is a <strong>demo payment</strong> — no real
//               money will be charged.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-5 py-2">
//             {/* Provider selection */}
//             <div className="space-y-2">
//               <Label>Select Provider</Label>
//               <div className="grid grid-cols-2 gap-3">
//                 {/* MTN MoMo */}
//                 <button
//                   type="button"
//                   onClick={() => setProvider("mtn")}
//                   className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
//                     provider === "mtn"
//                       ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
//                       : "border-border hover:border-muted-foreground"
//                   }`}
//                 >
//                   <span className="text-2xl">🟡</span>
//                   <span className="text-sm font-semibold">MTN MoMo</span>
//                 </button>

//                 {/* Orange Money */}
//                 <button
//                   type="button"
//                   onClick={() => setProvider("orange")}
//                   className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
//                     provider === "orange"
//                       ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
//                       : "border-border hover:border-muted-foreground"
//                   }`}
//                 >
//                   <span className="text-2xl">🟠</span>
//                   <span className="text-sm font-semibold">Orange Money</span>
//                 </button>
//               </div>
//             </div>

//             {/* Phone number input */}
//             <div className="space-y-2">
//               <Label htmlFor="momo-phone">
//                 {provider === "mtn" ? "MTN" : "Orange"} Phone Number
//               </Label>
//               <Input
//                 id="momo-phone"
//                 type="tel"
//                 placeholder={
//                   provider === "mtn" ? "e.g. 677 123 456" : "e.g. 699 123 456"
//                 }
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//               />
//               <p className="text-xs text-muted-foreground">
//                 {provider === "mtn"
//                   ? "MTN numbers start with 67, 68, 65"
//                   : "Orange numbers start with 69, 65, 66"}
//               </p>
//             </div>

//             {/* Demo notice */}
//             <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
//               <p className="text-xs text-blue-700 dark:text-blue-300">
//                 ⚠️ <strong>Demo Mode:</strong> This simulates a Mobile Money
//                 payment. No real transaction will occur. In production, this
//                 would connect to the{" "}
//                 {provider === "mtn" ? "MTN MoMo API" : "Orange Money API"}.
//               </p>
//             </div>

//             {/* Submit button */}
//             <Button
//               onClick={onMomoSubmit}
//               disabled={momoPending}
//               className="w-full"
//             >
//               {momoPending ? (
//                 <>
//                   <Loader2 className="size-4 animate-spin" />
//                   Processing Payment...
//                 </>
//               ) : (
//                 <>
//                   <Smartphone className="size-4" />
//                   Confirm{" "}
//                   {provider === "mtn" ? "MTN MoMo" : "Orange Money"} Payment
//                 </>
//               )}
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useState, useTransition } from "react";
import { enrollInCourseAction, enrollWithMobileMoneyAction } from "../action";
import { toast } from "sonner";
import { Loader2, CreditCard, Smartphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mobile money provider type
type MomoProvider = "mtn" | "orange";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [stripePending, startStripeTransition] = useTransition();
  const [momoPending, startMomoTransition] = useTransition();

  // Mobile money dialog state
  const [momoOpen, setMomoOpen] = useState(false);
  const [provider, setProvider] = useState<MomoProvider>("mtn");
  const [phone, setPhone] = useState("");

  // ── Stripe payment (existing flow, unchanged) ────────────────────────────
  function onStripeSubmit() {
    startStripeTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      // enrollInCourseAction returns ApiResponse OR calls redirect()
      // If we get here it's an error response (redirect throws, so no return)
      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  // ── Mobile Money demo payment ────────────────────────────────────────────
  function onMomoSubmit() {
    // Basic phone validation — must be at least 9 digits
    const cleanPhone = phone.replace(/\s/g, "");
    if (!cleanPhone || cleanPhone.length < 9) {
      toast.error("Please enter a valid phone number (at least 9 digits).");
      return;
    }

    startMomoTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollWithMobileMoneyAction(courseId, provider, cleanPhone)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        setMomoOpen(false);
        toast.success(result.message);
        // Note: the server action calls redirect() to /payment/success
        // so the page will navigate automatically
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  const isAnyPending = stripePending || momoPending;

  return (
    <div className="space-y-3">

      {/* ── Stripe button ─────────────────────────────────────────────────── */}
      <Button
        onClick={onStripeSubmit}
        disabled={isAnyPending}
        className="w-full"
      >
        {stripePending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Redirecting to Stripe...
          </>
        ) : (
          <>
            <CreditCard className="size-4" />
            Pay with Card (Stripe)
          </>
        )}
      </Button>

      {/* ── Mobile Money button that opens the dialog ─────────────────────── */}
      <Dialog open={momoOpen} onOpenChange={setMomoOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full"
            disabled={isAnyPending}
          >
            <Smartphone className="size-4" />
            Pay with Mobile Money
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mobile Money Payment</DialogTitle>
            <DialogDescription>
              Select your provider and enter your phone number to complete
              enrollment.{" "}
              <strong>
                This is a demo — no real money will be charged.
              </strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">

            {/* Provider selector */}
            <div className="space-y-2">
              <Label>Select your provider</Label>
              <div className="grid grid-cols-2 gap-3">

                {/* MTN MoMo */}
                <button
                  type="button"
                  onClick={() => setProvider("mtn")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
                    provider === "mtn"
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="text-3xl">🟡</span>
                  <span className="text-sm font-semibold">MTN MoMo</span>
                </button>

                {/* Orange Money */}
                <button
                  type="button"
                  onClick={() => setProvider("orange")}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 ${
                    provider === "orange"
                      ? "border-orange-400 bg-orange-50 dark:bg-orange-900/20"
                      : "border-border hover:border-muted-foreground/50"
                  }`}
                >
                  <span className="text-3xl">🟠</span>
                  <span className="text-sm font-semibold">Orange Money</span>
                </button>

              </div>
            </div>

            {/* Phone number input */}
            <div className="space-y-2">
              <Label htmlFor="momo-phone">
                {provider === "mtn" ? "MTN" : "Orange"} Phone Number
              </Label>
              <Input
                id="momo-phone"
                type="tel"
                placeholder={
                  provider === "mtn"
                    ? "e.g. 677 123 456"
                    : "e.g. 699 123 456"
                }
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {provider === "mtn"
                  ? "MTN numbers typically start with 67, 68, or 65"
                  : "Orange numbers typically start with 69, 65, or 66"}
              </p>
            </div>

            {/* Demo notice banner */}
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                <strong>⚠️ Demo Mode:</strong> This simulates a Mobile Money
                payment for development and testing purposes. No real
                transaction will occur. In production, this would connect to
                the{" "}
                {provider === "mtn" ? "MTN MoMo API" : "Orange Money API"}.
              </p>
            </div>

            {/* Confirm button */}
            <Button
              onClick={onMomoSubmit}
              disabled={momoPending}
              className="w-full"
            >
              {momoPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Smartphone className="size-4" />
                  Confirm{" "}
                  {provider === "mtn" ? "MTN MoMo" : "Orange Money"} Payment
                </>
              )}
            </Button>

          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}