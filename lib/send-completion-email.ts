 import { resend } from "./resend";

interface CompletionEmailParams {
  userEmail: string;
  userName: string;
  courseTitle: string;
  courseSlug: string;
}

export async function sendCourseCompletionEmail({
  userEmail,
  userName,
  courseTitle,
  courseSlug,
}: CompletionEmailParams) {
  const completionDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const certificateUrl = `${process.env.BETTER_AUTH_URL}/dashboard/${courseSlug}/certificate`;

  await resend.emails.send({
    from: "ShatouLMS <onboarding@resend.dev>",
    to: [userEmail],
    subject: `🎓 Congratulations! You completed "${courseTitle}"`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fff;">
        
        <!-- Header -->
        <div style="text-align: center; padding: 32px 0 24px; border-bottom: 2px solid #f4f4f5;">
          <h1 style="margin: 0; font-size: 24px; color: #111;">🎓 ShatouLMS</h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px 0;">
          <h2 style="font-size: 22px; color: #111; margin-bottom: 8px;">
            Congratulations, ${userName}!
          </h2>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            You have successfully completed the course:
          </p>

          <!-- Course title box -->
          <div style="background: #f9fafb; border-left: 4px solid #f97316; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111;">
              ${courseTitle}
            </p>
            <p style="margin: 4px 0 0; font-size: 13px; color: #888;">
              Completed on ${completionDate}
            </p>
          </div>

          <p style="color: #555; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            Your certificate of completion is ready. You can view and download it 
            by clicking the button below.
          </p>

          <!-- CTA button -->
          <div style="text-align: center; margin: 32px 0;">
            <a 
              href="${certificateUrl}"
              style="display: inline-block; background: #f97316; color: #fff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold;"
            >
              View My Certificate
            </a>
          </div>

          <p style="color: #888; font-size: 13px; line-height: 1.6;">
            Keep learning! Your dashboard has more courses waiting for you.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #f4f4f5; padding-top: 16px; text-align: center;">
          <p style="color: #bbb; font-size: 12px; margin: 0;">
            ShatouLMS — Your Learning Platform in Cameroon
          </p>
        </div>
      </div>
    `,
  });
}