/* eslint-disable @typescript-eslint/no-unused-vars */
// "use server";

// import { requireUser } from "@/app/data/user/require-user";
// import arcjets, { fixedWindow } from "@/lib/arcjets";
// import { prisma } from "@/lib/db";
// import { env } from "@/lib/env";
// import { stripe } from "@/lib/stripe";
// import { ApiResponse } from "@/lib/types";
// import { request } from "@arcjet/next";
// import { redirect } from "next/navigation";
// import Stripe from "stripe";


// const aj = arcjets.withRule(
//     fixedWindow({
//         mode: "LIVE",
//         window: "1m",
//         max: 5,
//     })
// );

// export async function enrollInCourseAction(courseId: string): Promise<ApiResponse | never> {

//     const user = await requireUser();

//     let checkoutUrl: string;

//     try {
//         const req = await request();
//         const decision = await aj.protect(req, {
//             fingerprint: user.id,
//         });

//         if (decision.isDenied()) {
//             return {
//                 status: "error",
//                 message: "You have been blocked",
//             };
//         }
       
//         const course = await prisma.course.findUnique({
//             where: {
//                 id: courseId,
//             },
//             select: {
//                 id: true,
//                 title: true,
//                 price: true,
//                 slug: true,
//             },
//         });

//         if(!course) {
//             return {
//                 status: "error",
//                 message: "Course not found",
//             };
//         }
 
//         let stripeCustomerId: string;

//         const userWithStripeCustomerId = await prisma.user.findUnique({
//             where: {
//               id: user.id,
//             },
//             select: {
//                 stripeCustomerId: true,
//             },
//         });

//         if(userWithStripeCustomerId?.stripeCustomerId) {
//           stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
//         } else {

//           const customer = await stripe.customers.create({
//             email: user.email,
//             name: user.name,
//             metadata: {
//                 userId: user.id,
//             },
//           });

//           stripeCustomerId = customer.id;

//           await prisma.user.update({
//             where: {
//                 id: user.id,
//             },
//             data: {
//                 stripeCustomerId: stripeCustomerId,
//             },
//           });

//         }


//         const result = await prisma.$transaction(async (tx) => {

//             const existingEnrollment = await tx.enrollment.findUnique({
//                 where: {
//                     userId_courseId: {
//                         userId: user.id,
//                         courseId: courseId,
//                     },
//                 },
//                 select: {
//                     status: true,
//                     id: true,
//                 },
//             });

//             if(existingEnrollment?.status === "Active") {
//                 return {
//                     status: "success",
//                     message: "You are already enrolled in this Course",
//                 };
//             }

//             let enrollment;

//             if (existingEnrollment) {
//                 enrollment = await tx.enrollment.update({
//                     where: {
//                         id: existingEnrollment.id
//                     },
//                     data: {
//                         amount: course.price,
//                         status: "Pending",
//                         updatedAt: new Date(),
//                     },
//                 });
//             } else {
//                 enrollment = await tx.enrollment.create({
//                     data: {
//                         userId: user.id,
//                         courseId: course.id,
//                         amount: course.price,
//                         status: "Pending",
//                     },
//                 });
//             }

//             const checkoutSession =  await stripe.checkout.sessions.create({
//                 customer: stripeCustomerId,
//                 line_items: [
//                     {
//                         // price: "price_1THiFyI8otO7dxwddx9jvkqQ",
//                         // Create the price inline from the course's actual price in your DB
//             price_data: {
//                 currency: "xaf", // Change to "xaf" if you want CFA Francs
//                 unit_amount: course.price * 1, // Stripe expects amount in cents
//                 product_data: {
//                     name: course.title, // Shows the course name in Stripe checkout
//                 },
//             },
//                         quantity: 1,
//                     },
//                 ],
//                 mode: "payment",
//                 success_url: `${env.BETTER_AUTH_URL}/payment/success`,
//                 cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
//                 metadata: {
//                     userId: user.id,
//                     courseId: course.id,
//                     enrollmentId: enrollment.id,
//                 },
//             });

//             return {
//                 enrollment: enrollment,
//                 checkoutUrl: checkoutSession.url,
//             };
//         });


//         checkoutUrl = result.checkoutUrl as string;

//     } catch (error) {
//         console.error("Enrollment error:", error); // ← ADD THIS LINE
//        if(error instanceof Stripe.errors.StripeError) {
//         return {
//             status: "error",
//             message: "Payment system error. Please try again later.",
//         };
//        }

//         return {
//             status: "error",
//             message: "Failed to enroll in course",
//         };
//     }

//     redirect(checkoutUrl);
// }





// // ── Mobile Money Demo Payment Action ────────────────────────────────────────
// // This is a DEMO implementation. It simulates payment without real API calls.
// // In production, replace the demo block with real MTN/Orange API integration.

// export async function enrollWithMobileMoneyAction(
//   courseId: string,
//   provider: "mtn" | "orange",
//   phone: string
// ): Promise<ApiResponse | never> {
//   const user = await requireUser();

//   try {
//     // Rate limiting (reusing existing arcjet setup)
//     const req = await request();
//     const decision = await aj.protect(req, {
//       fingerprint: user.id,
//     });

//     if (decision.isDenied()) {
//       return {
//         status: "error",
//         message: "Too many requests. Please try again later.",
//       };
//     }

//     // Fetch the course
//     const course = await prisma.course.findUnique({
//       where: { id: courseId },
//       select: { id: true, title: true, price: true, slug: true },
//     });

//     if (!course) {
//       return { status: "error", message: "Course not found." };
//     }

//     // Check if already enrolled
//     const existingEnrollment = await prisma.enrollment.findUnique({
//       where: {
//         userId_courseId: { userId: user.id, courseId: courseId },
//       },
//       select: { status: true, id: true },
//     });

//     if (existingEnrollment?.status === "Active") {
//       return {
//         status: "success",
//         message: "You are already enrolled in this course.",
//       };
//     }

//     // ── DEMO: Simulate payment processing delay ──────────────────
//     // In production, you would call the MTN MoMo API or Orange Money API here,
//     // initiate a payment request, and wait for a callback/webhook to confirm.
//     //
//     // Example (MTN MoMo API - production):
//     //   const paymentRef = await initiateMtnMomoPayment({ phone, amount: course.price, courseId });
//     //   Then handle callback via /api/webhook/momo route.
//     //
//     // For this demo, we assume payment always succeeds immediately.
//     await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call delay
//     const demoPaymentSucceeded = true; // Always succeeds in demo
//     // ─────────────────────────────────────────────────────────────

//     if (!demoPaymentSucceeded) {
//       return {
//         status: "error",
//         message: "Payment failed. Please check your phone number and try again.",
//       };
//     }

//     // Create or update enrollment — set directly to Active (payment confirmed)
//     if (existingEnrollment) {
//       await prisma.enrollment.update({
//         where: { id: existingEnrollment.id },
//         data: {
//           amount: course.price,
//           status: "Active",
//           updatedAt: new Date(),
//         },
//       });
//     } else {
//       await prisma.enrollment.create({
//         data: {
//           userId: user.id,
//           courseId: course.id,
//           amount: course.price,
//           status: "Active", // Immediately active — demo payment confirmed
//         },
//       });
//     }

//   } catch (error) {
//     console.error("Mobile Money enrollment error:", error);
//     return {
//       status: "error",
//       message: "Payment processing failed. Please try again.",
//     };
//   }

//   // Redirect to success page (same as Stripe flow)
//   redirect(`/payment/success`);
// }




"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjets, { fixedWindow } from "@/lib/arcjets";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";
import Stripe from "stripe";

// Rate limiter — shared by both payment actions
const aj = arcjets.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

// ── EXISTING: Stripe enrollment action (unchanged) ───────────────────────────
export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse | never> {
  const user = await requireUser();

  let checkoutUrl: string;

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    let stripeCustomerId: string;

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        stripeCustomerId: true,
      },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId: stripeCustomerId,
        },
      });
    }

    const result = await prisma.$transaction(async (tx) => {
      const existingEnrollment = await tx.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
        select: {
          status: true,
          id: true,
        },
      });

      if (existingEnrollment?.status === "Active") {
        return {
          status: "success",
          message: "You are already enrolled in this Course",
        };
      }

      let enrollment;

      if (existingEnrollment) {
        enrollment = await tx.enrollment.update({
          where: {
            id: existingEnrollment.id,
          },
          data: {
            amount: course.price,
            status: "Pending",
            updatedAt: new Date(),
          },
        });
      } else {
        enrollment = await tx.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Pending",
          },
        });
      }

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: "xaf",
              unit_amount: course.price * 1,
              product_data: {
                name: course.title,
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${env.BETTER_AUTH_URL}/payment/success`,
        cancel_url: `${env.BETTER_AUTH_URL}/payment/cancel`,
        metadata: {
          userId: user.id,
          courseId: course.id,
          enrollmentId: enrollment.id,
        },
      });

      return {
        enrollment: enrollment,
        checkoutUrl: checkoutSession.url,
      };
    });

    checkoutUrl = result.checkoutUrl as string;
  } catch (error) {
    console.error("Enrollment error:", error);
    if (error instanceof Stripe.errors.StripeError) {
      return {
        status: "error",
        message: "Payment system error. Please try again later.",
      };
    }

    return {
      status: "error",
      message: "Failed to enroll in course",
    };
  }

  redirect(checkoutUrl);
}

// ── NEW: Mobile Money demo payment action ────────────────────────────────────
//
// HOW THIS WORKS:
// 1. User selects MTN or Orange and enters their phone number in the dialog
// 2. This server action runs, validates the request, and simulates payment
// 3. The enrollment is created immediately as "Active" (since demo = always succeeds)
// 4. The user is redirected to /payment/success — same as the Stripe flow
//
// In production, step 2 would instead call the real MTN MoMo API or
// Orange Money API, wait for a payment callback/webhook, and then activate
// the enrollment. For now, we simulate that the payment always succeeds.
//
export async function enrollWithMobileMoneyAction(
  courseId: string,
  provider: "mtn" | "orange",
  phone: string
): Promise<ApiResponse | never> {
  // Step 1 — Get the logged-in user (redirects to /login if not logged in)
  const user = await requireUser();

  try {
    // Step 2 — Rate limiting (reuses the same arcjet rule as Stripe)
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: "Too many requests. Please wait a moment and try again.",
      };
    }

    // Step 3 — Load the course from the database
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    // Step 4 — Check if the user is already enrolled in this course
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
      select: {
        status: true,
        id: true,
      },
    });

    if (existingEnrollment?.status === "Active") {
      // Already enrolled — just redirect them to the success page
      // (they will see their course in the dashboard)
    } else {
      // Step 5 — Simulate Mobile Money payment processing
      //
      // In a real production integration, this is where you would:
      //   • Call the MTN MoMo API to initiate a payment request
      //   • OR call the Orange Money API to initiate a payment request
      //   • The API would send a USSD push to the user's phone
      //   • You would then wait for a webhook callback confirming payment
      //
      

      // In demo mode, payment always succeeds:
      const demoPaymentSucceeded = true;

      if (!demoPaymentSucceeded) {
        // This branch would be reached in production if the API call fails
        return {
          status: "error",
          message:
            "Payment failed. Please check your phone number and try again.",
        };
      }

      // Step 6 — Create or update the enrollment with status "Active"
      //
      // Unlike the Stripe flow (where the enrollment starts as "Pending" and
      // is activated later by a webhook), Mobile Money activates immediately
      // because we confirm payment right here in the same server action.
      if (existingEnrollment) {
        // A previous Pending enrollment exists — upgrade it to Active
        await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
            amount: course.price,
            status: "Active",
            updatedAt: new Date(),
          },
        });
      } else {
        // No prior enrollment — create a fresh Active one
        await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            amount: course.price,
            status: "Active",
          },
        });
      }
    }

  } catch (error) {
    console.error("Mobile Money enrollment error:", error);
    return {
      status: "error",
      message: "Payment processing failed. Please try again.",
    };
  }

  // Step 7 — Redirect to the success page (identical to the Stripe flow)
  // This uses Next.js redirect() which throws internally, so it must be
  // called OUTSIDE the try-catch block.
  redirect("/payment/success");
}