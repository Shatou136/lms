// import { ReactNode } from "react";
// import { CourseSidebar } from "../_components/CourseSidebar";
// import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";


// interface iAppProps {
//     params: Promise<{ slug: string }>;
//     children: ReactNode;
// }

// export default async function CourseLayout({ children, params }: iAppProps) {

//     const { slug } = await params;

//     //server-side security check and lightweight data fetching
//     const course = await getCourseSidebarData(slug);

//     return (
//         <div className="flex flex-1">

//             {/*  sidebar - 30% */}
//          <div className="w-80 border-r border-border shrink-0">
//            <CourseSidebar course={course.course} />
//          </div>

//          {/* Main content - 70% */}
//          <div className="flex-1 overflow-hidden">{children}</div>
//         </div>
//     );
// }

import { ReactNode } from "react";
import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CancelEnrollmentButton } from "./_components/CancelEnrollmentButton";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({ children, params }: iAppProps) {
  const { slug } = await params;

  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">

      {/* Sidebar — 320px wide */}
      <div className="w-80 border-r border-border shrink-0 flex flex-col">

        {/* Scrollable lesson list */}
        <div className="flex-1 overflow-y-auto">
          <CourseSidebar course={course.course} />
        </div>

        {/* Cancel button pinned at the bottom of the sidebar */}
        <div className="p-4 border-t border-border shrink-0">
          <CancelEnrollmentButton courseSlug={slug} />
        </div>

      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}