import { requireUser } from "@/app/data/user/require-user";
import { checkCourseCompletion } from "@/app/data/course/check-course-completion";
import { redirect } from "next/navigation";
import { CertificateView } from "./_components/CertificateView";


type Params = Promise<{ slug: string }>;

export default async function CertificatePage({ params }: { params: Params }) {
  const { slug } = await params;
  const user = await requireUser();

  // Check that the user actually completed this course
  const completion = await checkCourseCompletion(user.id, slug);

  if (!completion.isComplete) {
    // Not completed — redirect back to the course
    redirect(`/dashboard/${slug}`);
  }

  return (
    <CertificateView
      userName={user.name ?? user.email.split("@")[0]}
      courseTitle={completion.courseTitle}
      completionDate={new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}
      courseSlug={slug}
    />
  );
}